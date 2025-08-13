import { ChatContainer } from "@/app/components/chat/chat-container"
import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import React, { Suspense } from "react"

export const dynamic = "force-dynamic"

function SearchHandlerChatContainer({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const [query, setQuery] = React.useState<string | undefined>(undefined)
  
  React.useEffect(() => {
    searchParams.then(params => {
      const q = params.q || params.query
      setQuery(typeof q === 'string' ? q : undefined)
    })
  }, [searchParams])
  
  return <ChatContainer initialQuery={query} />
}

export default function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return (
    <MessagesProvider>
      <LayoutApp>
        <Suspense fallback={<ChatContainer />}>
          <SearchHandlerChatContainer searchParams={searchParams} />
        </Suspense>
      </LayoutApp>
    </MessagesProvider>
  )
}
