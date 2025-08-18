"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

type UsageStats = {
  daily: {
    used: number
    limit: number
    remaining: number
    resetTime: number
  }
  dailyPro: {
    used: number
    limit: number
    remaining: number
    resetTime: number
  }
  total: {
    messages: number
    accountAge: number
  }
  recent: {
    messages: number
    responses: number
    days: Array<{
      date: string
      messages: number
      responses: number
    }>
  }
  account: {
    type: "guest" | "registered"
    premium: boolean
    created: string
  }
}

async function fetchUsageStats(): Promise<UsageStats> {
  const response = await fetch("/api/usage-stats")
  if (!response.ok) {
    throw new Error("Failed to fetch usage stats")
  }
  return response.json()
}

function formatResetTime(resetTime: number): string {
  const now = new Date()
  const reset = new Date(resetTime)
  const diff = reset.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric' 
  })
}

function UsageCard({ 
  title, 
  used, 
  limit, 
  resetTime, 
  type = "default" 
}: {
  title: string
  used: number
  limit: number
  resetTime: number
  type?: "default" | "pro"
}) {
  const percentage = limit > 0 ? (used / limit) * 100 : 0
  const remaining = Math.max(0, limit - used)
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Used</span>
          <span className="font-mono">
            {used.toLocaleString()} / {limit.toLocaleString()}
          </span>
        </div>
        
        <Progress 
          value={percentage} 
          className={cn(
            "h-2",
            type === "pro" && percentage > 80 && "data-[state=complete]:bg-orange-500"
          )}
        />
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{remaining.toLocaleString()} remaining</span>
          <span>Resets in {formatResetTime(resetTime)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCard({ 
  title, 
  value, 
  subtitle 
}: {
  title: string
  value: string | number
  subtitle?: string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-2xl font-mono font-semibold">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityChart({ days }: { days: UsageStats['recent']['days'] }) {
  const maxMessages = Math.max(...days.map(d => d.messages), 1)
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Activity (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {days.map((day, index) => {
            const height = (day.messages / maxMessages) * 100
            
            return (
              <div key={day.date} className="flex items-center gap-3">
                <div className="w-12 text-xs text-muted-foreground">
                  {formatDate(day.date)}
                </div>
                
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2 relative overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${height}%` }}
                    />
                  </div>
                  
                  <div className="w-8 text-xs font-mono text-right">
                    {day.messages}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {days.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No activity in the last 7 days
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function UsageDashboard() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['usage-stats'],
    queryFn: fetchUsageStats,
    refetchInterval: 60000, // Refetch every minute
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-8 bg-muted rounded animate-pulse" />
                  <div className="h-2 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center">
            Failed to load usage statistics. Please try again later.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Daily Usage Limits */}
      <div>
        <h3 className="text-sm font-medium mb-3">Daily Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UsageCard
            title="Standard Messages"
            used={stats.daily.used}
            limit={stats.daily.limit}
            resetTime={stats.daily.resetTime}
          />
          <UsageCard
            title="Pro Model Messages"
            used={stats.dailyPro.used}
            limit={stats.dailyPro.limit}
            resetTime={stats.dailyPro.resetTime}
            type="pro"
          />
        </div>
      </div>

      <Separator />

      {/* Overview Stats */}
      <div>
        <h3 className="text-sm font-medium mb-3">Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Messages"
            value={stats.total.messages}
            subtitle="All time"
          />
          <StatCard
            title="Account Age"
            value={stats.total.accountAge}
            subtitle="days"
          />
          <StatCard
            title="Recent Messages"
            value={stats.recent.messages}
            subtitle="Last 30 days"
          />
          <StatCard
            title="Account Type"
            value={stats.account.type === "guest" ? "Guest" : "Registered"}
            subtitle={stats.account.premium ? "Premium" : "Free"}
          />
        </div>
      </div>

      <Separator />

      {/* Activity Chart */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Recent Activity</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        </div>
        
        {isExpanded ? (
          <ActivityChart days={stats.recent.days} />
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {stats.recent.messages} messages
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last 30 days
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {stats.recent.responses} responses
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Generated
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Account Info */}
      <div className="text-xs text-muted-foreground">
        <p>
          Account created {new Date(stats.account.created).toLocaleDateString()}
        </p>
        <p className="mt-1">
          Usage statistics update in real-time and reset daily at midnight UTC.
        </p>
      </div>
    </div>
  )
}