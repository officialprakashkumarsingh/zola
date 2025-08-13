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

  if (multiModelEnabled) {
    return <MultiChat initialQuery={initialQuery} />
  }

  return <Chat initialQuery={initialQuery} />
}
