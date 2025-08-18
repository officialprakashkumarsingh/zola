import { MODEL_DEFAULT } from "@/lib/config"
import { isSupabaseEnabled } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"
import { createGuestServerClient } from "@/lib/supabase/server-guest"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (!isSupabaseEnabled) {
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent("Supabase is not enabled in this deployment.")}`
    )
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent("Missing authentication code")}`
    )
  }

  const supabase = await createClient()
  const supabaseAdmin = await createGuestServerClient()

  if (!supabase || !supabaseAdmin) {
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent("Supabase is not enabled in this deployment.")}`
    )
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("Auth error:", error)
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent(error.message)}`
    )
  }

  const user = data?.user
  if (!user || !user.id || !user.email) {
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent("Missing user info")}`
    )
  }

  try {
    console.log("👤 Creating user record for:", user.email, "ID:", user.id)
    
    // Try to insert user only if not exists
    const { error: insertError } = await supabaseAdmin.from("users").insert({
      id: user.id,
      email: user.email,
      created_at: new Date().toISOString(),
      message_count: 0,
      premium: false,
      anonymous: false, // Explicitly set to false for authenticated users
      favorite_models: [MODEL_DEFAULT],
    })

    if (insertError && insertError.code !== "23505") {
      console.error("❌ Error inserting user:", insertError)
    } else if (insertError?.code === "23505") {
      console.log("✅ User already exists, skipping insert")
    } else {
      console.log("✅ User record created successfully")
    }
  } catch (err) {
    console.error("❌ Unexpected user insert error:", err)
  }

  const host = request.headers.get("host")
  const protocol = host?.includes("localhost") ? "http" : "https"

  // Force redirect to home page to refresh user state
  const redirectUrl = `${protocol}://${host}/`

  // Add cache-busting parameter to force refresh
  const finalRedirectUrl = new URL(redirectUrl)
  finalRedirectUrl.searchParams.set('auth_success', 'true')
  finalRedirectUrl.searchParams.set('t', Date.now().toString())

  console.log("Auth callback redirecting to:", finalRedirectUrl.toString())

  return NextResponse.redirect(finalRedirectUrl.toString())
}
