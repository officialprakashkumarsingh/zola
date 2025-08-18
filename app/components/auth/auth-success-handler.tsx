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
      
      // Add a small delay to ensure user is fully created in database
      setTimeout(() => {
        console.log("🔄 Refreshing user state after auth...")
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
          
          // Try again after a longer delay
          setTimeout(() => {
            console.log("🔄 Retrying user refresh...")
            refreshUser()
          }, 2000)
        })
      }, 1000) // Wait 1 second for database operations to complete
    }
  }, [searchParams, refreshUser, router])

  return null // This component doesn't render anything
}