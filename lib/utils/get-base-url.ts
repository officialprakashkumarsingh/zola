import { APP_DOMAIN } from "@/lib/config"

/**
 * Get the base URL for the application
 * Prioritizes browser location, then environment variables, then fallbacks
 */
export function getBaseUrl(): string {
  let baseUrl: string;
  
  // In browser, always use current origin
  if (typeof window !== "undefined") {
    baseUrl = window.location.origin;
    
    // Special handling for Vercel preview deployments
    if (baseUrl.includes('vercel.app')) {
      console.log("🌐 Using browser origin (Vercel):", baseUrl);
      return baseUrl;
    }
    
    console.log("🌐 Using browser origin:", baseUrl);
    return baseUrl;
  }
  
  // Server-side detection
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    console.log("🚀 Using NEXT_PUBLIC_VERCEL_URL:", baseUrl);
    return baseUrl;
  }
  
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    console.log("🔗 Using NEXT_PUBLIC_SITE_URL:", baseUrl);
    return baseUrl;
  }
  
  // Development fallback
  if (process.env.NODE_ENV === "development") {
    baseUrl = "http://localhost:3000";
    console.log("🛠️ Using development fallback:", baseUrl);
    return baseUrl;
  }
  
  // Final fallback
  baseUrl = APP_DOMAIN;
  console.log("🏠 Using APP_DOMAIN fallback:", baseUrl);
  return baseUrl;
}

/**
 * Get OAuth callback URL
 */
export function getOAuthCallbackUrl(): string {
  const callbackUrl = `${getBaseUrl()}/auth/callback`;
  console.log("🔐 OAuth callback URL:", callbackUrl);
  return callbackUrl;
}