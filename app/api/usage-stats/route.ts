import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }
    
    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user usage data - handle potential missing columns gracefully
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (userError) {
      console.error("Error fetching user data:", userError)
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
    }

    // Calculate usage statistics
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    // Check if daily counters need reset - handle missing columns
    const dailyReset = userData?.daily_reset ? new Date(userData.daily_reset) : null
    const needsDailyReset = !dailyReset || dailyReset < today
    
    const dailyCount = needsDailyReset ? 0 : (userData?.daily_message_count || 0)
    const dailyProCount = (userData as any)?.daily_pro_usage || 0
    
    // Calculate limits
    const isAnonymous = userData?.anonymous || false
    const dailyLimit = isAnonymous ? 5 : 1000
    const dailyProLimit = 500
    
    // Calculate account age
    const accountCreated = userData?.created_at ? new Date(userData.created_at) : new Date()
    const accountAge = Math.floor((now.getTime() - accountCreated.getTime()) / (1000 * 60 * 60 * 24))
    
    // Get chat history for additional stats (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
    
    const { data: chatData, error: chatError } = await supabase
      .from("messages")
      .select("created_at, role")
      .eq("user_id", user.id)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: false })

    // Handle chat data - might not exist
    const messages = chatData || []
    const userMessages = messages.filter(m => m.role === "user")
    const assistantMessages = messages.filter(m => m.role === "assistant")
    
    // Group by day for trend data
    const dailyStats: Record<string, { user: number; assistant: number }> = {}
    
    messages.forEach(msg => {
      if (msg.created_at) {
        const date = new Date(msg.created_at).toISOString().split('T')[0]
        if (!dailyStats[date]) {
          dailyStats[date] = { user: 0, assistant: 0 }
        }
        dailyStats[date][msg.role as 'user' | 'assistant']++
      }
    })

    // Convert to array for last 7 days
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000))
      const dateStr = date.toISOString().split('T')[0]
      const stats = dailyStats[dateStr] || { user: 0, assistant: 0 }
      last7Days.push({
        date: dateStr,
        messages: stats.user,
        responses: stats.assistant
      })
    }

    const response = {
      // Current usage
      daily: {
        used: dailyCount,
        limit: dailyLimit,
        remaining: Math.max(0, dailyLimit - dailyCount),
        resetTime: today.getTime() + (24 * 60 * 60 * 1000) // Next midnight
      },
      dailyPro: {
        used: dailyProCount,
        limit: dailyProLimit,
        remaining: Math.max(0, dailyProLimit - dailyProCount),
        resetTime: today.getTime() + (24 * 60 * 60 * 1000)
      },
      
      // Total usage
      total: {
        messages: userData?.message_count || 0,
        accountAge: accountAge
      },
      
      // Recent activity (last 30 days)
      recent: {
        messages: userMessages.length,
        responses: assistantMessages.length,
        days: last7Days
      },
      
      // Account info
      account: {
        type: (isAnonymous ? "guest" : "registered") as "guest" | "registered",
        premium: userData?.premium || false,
        created: userData?.created_at || new Date().toISOString()
      }
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error("Usage stats error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}