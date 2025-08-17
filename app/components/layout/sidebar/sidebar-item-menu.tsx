import { useBreakpoint } from "@/app/hooks/use-breakpoint"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useChats } from "@/lib/chat-store/chats/provider"
import { useMessages } from "@/lib/chat-store/messages/provider"
import { useChatSession } from "@/lib/chat-store/session/provider"
import { Chat } from "@/lib/chat-store/types"
import { DotsThree, PencilSimple, Trash, PushPin, PushPinSlash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { DialogDeleteChat } from "./dialog-delete-chat"

type SidebarItemMenuProps = {
  chat: Chat
  onStartEditing: () => void
  onMenuOpenChange?: (open: boolean) => void
}

export function SidebarItemMenu({
  chat,
  onStartEditing,
  onMenuOpenChange,
}: SidebarItemMenuProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const router = useRouter()
  const { deleteMessages } = useMessages()
  const { deleteChat } = useChats()
  const { chatId } = useChatSession()
  const isMobile = useBreakpoint(768)

  // Load pinned state from localStorage
  useEffect(() => {
    const pinnedChats = JSON.parse(localStorage.getItem('pinnedChats') || '[]')
    setIsPinned(pinnedChats.includes(chat.id))
  }, [chat.id])

  const handleConfirmDelete = async () => {
    await deleteMessages()
    await deleteChat(chat.id, chatId!, () => router.push("/"))
  }

  const handleTogglePin = () => {
    const pinnedChats = JSON.parse(localStorage.getItem('pinnedChats') || '[]')
    let updatedPinnedChats
    
    if (isPinned) {
      // Unpin
      updatedPinnedChats = pinnedChats.filter((id: string) => id !== chat.id)
      setIsPinned(false)
    } else {
      // Pin
      updatedPinnedChats = [...pinnedChats, chat.id]
      setIsPinned(true)
    }
    
    localStorage.setItem('pinnedChats', JSON.stringify(updatedPinnedChats))
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('pinnedChatsChanged', { 
      detail: { pinnedChats: updatedPinnedChats } 
    }))
  }

  return (
    <>
      <DropdownMenu
        // shadcn/ui / radix pointer-events-none issue
        modal={isMobile ? true : false}
        onOpenChange={onMenuOpenChange}
      >
        <DropdownMenuTrigger asChild>
          <button
            className="hover:bg-secondary flex size-7 items-center justify-center rounded-md p-1 transition-colors duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <DotsThree size={18} className="text-primary" weight="bold" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleTogglePin()
            }}
          >
            {isPinned ? (
              <>
                <PushPinSlash size={16} className="mr-2" />
                Unpin
              </>
            ) : (
              <>
                <PushPin size={16} className="mr-2" />
                Pin
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onStartEditing()
            }}
          >
            <PencilSimple size={16} className="mr-2" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            variant="destructive"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsDeleteDialogOpen(true)
            }}
          >
            <Trash size={16} className="mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogDeleteChat
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        chatTitle={chat.title || "Untitled chat"}
        onConfirmDelete={handleConfirmDelete}
      />
    </>
  )
}
