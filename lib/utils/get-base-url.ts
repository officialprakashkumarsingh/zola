import { APP_DOMAIN } from "@/lib/config"

/**
 * Get the base URL for the application
 * Prioritizes browser location, then environment variables, then fallbacks
 */
export function getBaseUrl(): string {
  // In browser, always use current origin
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  
  // Server-side detection
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }
  
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  
  // Development fallback
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000"
  }
  
  // Final fallback
  return APP_DOMAIN
}

/**
 * Get OAuth callback URL
 */
export function getOAuthCallbackUrl(): string {
  return `${getBaseUrl()}/auth/callback`
}