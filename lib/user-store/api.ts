// @todo: move in /lib/user/api.ts
import { toast } from "@/components/ui/toast"
import { createClient } from "@/lib/supabase/client"
import type { UserProfile } from "@/lib/user/types"

export async function fetchUserProfile(
  id: string
): Promise<UserProfile | null> {
  const supabase = createClient()
  if (!supabase) return null

  console.log("🔍 Fetching user profile for ID:", id)

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    console.error("❌ Failed to fetch user:", error)
    return null
  }

  console.log("📄 User data fetched:", {
    id: data.id,
    email: data.email,
    anonymous: data.anonymous,
    display_name: data.display_name
  })

  // Don't return anonymous users
  if (data.anonymous === true) {
    console.log("🚫 User is anonymous, not returning profile")
    return null
  }

  const profile = {
    ...data,
    profile_image: data.profile_image || "",
    display_name: data.display_name || "",
  }

  console.log("✅ Returning user profile:", profile.email)
  return profile
}

export async function updateUserProfile(
  id: string,
  updates: Partial<UserProfile>
): Promise<boolean> {
  const supabase = createClient()
  if (!supabase) return false

  const { error } = await supabase.from("users").update(updates).eq("id", id)

  if (error) {
    console.error("Failed to update user:", error)
    return false
  }

  return true
}

export async function signOutUser(): Promise<boolean> {
  const supabase = createClient()
  if (!supabase) {
    toast({
      title: "Sign out is not supported in this deployment",
      status: "info",
    })
    return false
  }

  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Failed to sign out:", error)
    return false
  }

  return true
}

export function subscribeToUserUpdates(
  userId: string,
  onUpdate: (newData: Partial<UserProfile>) => void
) {
  const supabase = createClient()
  if (!supabase) return () => {}

  const channel = supabase
    .channel(`public:users:id=eq.${userId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "users",
        filter: `id=eq.${userId}`,
      },
      (payload) => {
        onUpdate(payload.new as Partial<UserProfile>)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
