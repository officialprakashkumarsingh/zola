"use client"

import { MultiChat } from "@/app/components/multi-chat/multi-chat"
import { useUserPreferences } from "@/lib/user-preference-store/provider"
import { Chat } from "./chat"

interface ChatContainerProps {
  initialQuery?: string
}

export function ChatContainer({ initialQuery }: ChatContainerProps) {
  const { preferences } = useUserPreferences()
  const multiModelEnabled = preferences.multiModelEnabled

  // TODO: Implement initialQuery handling in Chat and MultiChat components
  // For now, just render the components without passing the prop
  // The search functionality will be implemented in a future update

  if (multiModelEnabled) {
    return <MultiChat />
  }

  return <Chat />
}
