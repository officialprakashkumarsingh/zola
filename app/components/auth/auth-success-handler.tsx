"use client"

import { useUser } from "@/lib/user-store/provider"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function AuthSuccessHandler() {
  const { refreshUser } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const authSuccess = searchParams.get('auth_success')
    
    if (authSuccess === 'true') {
      console.log("🎉 Auth success detected, refreshing user state...")
      
      // Refresh user state
      refreshUser().then(() => {
        console.log("✅ User state refreshed after auth")
        
        // Clean up URL parameters
        const url = new URL(window.location.href)
        url.searchParams.delete('auth_success')
        url.searchParams.delete('t')
        
        // Replace URL without page reload
        router.replace(url.pathname + url.search, { scroll: false })
      }).catch((error) => {
        console.error("❌ Failed to refresh user state:", error)
      })
    }
  }, [searchParams, refreshUser, router])

  return null // This component doesn't render anything
}