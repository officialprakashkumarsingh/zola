"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { 
  GitBranch, 
  Plus, 
  Trash, 
  ChatCircle, 
  ArrowRight,
  Clock
} from "@phosphor-icons/react"
import { useState } from "react"
import type { ConversationBranch } from "@/app/hooks/use-conversation-branching"

interface ConversationBranchesProps {
  messageId: string
  branches: ConversationBranch[]
  onCreateBranch: (parentMessageId: string, branchTitle: string, initialMessage?: string) => void
  onSwitchBranch: (branchId: string) => void
  onDeleteBranch: (branchId: string) => void
  currentBranchId?: string | null
  className?: string
}

export function ConversationBranches({
  messageId,
  branches,
  onCreateBranch,
  onSwitchBranch,
  onDeleteBranch,
  currentBranchId,
  className,
}: ConversationBranchesProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [branchTitle, setBranchTitle] = useState("")
  const [initialMessage, setInitialMessage] = useState("")

  const handleCreateBranch = () => {
    if (branchTitle.trim()) {
      console.log('Creating branch:', { messageId, branchTitle: branchTitle.trim(), initialMessage: initialMessage.trim() })
      onCreateBranch(messageId, branchTitle.trim(), initialMessage.trim() || undefined)
      setBranchTitle("")
      setInitialMessage("")
      setIsCreateDialogOpen(false)
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (branches.length === 0) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <GitBranch className="h-3 w-3 mr-1" />
              Branch conversation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Conversation Branch</DialogTitle>
              <DialogDescription>
                Start a new conversation branch from this point. You can explore different discussion paths.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="branch-title">Branch Title</Label>
                <Input
                  id="branch-title"
                  placeholder="e.g., Alternative approach, Different topic..."
                  value={branchTitle}
                  onChange={(e) => setBranchTitle(e.target.value)}
                  className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0"
                  autoComplete="off"
                />
              </div>
              <div>
                <Label htmlFor="initial-message">Initial Message (Optional)</Label>
                <Textarea
                  id="initial-message"
                  placeholder="Start the branch with a specific message..."
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  rows={3}
                  className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0"
                  autoComplete="off"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateBranch} disabled={!branchTitle.trim()}>
                  Create Branch
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <GitBranch className="h-3 w-3" />
        <span>{branches.length} conversation branch{branches.length !== 1 ? 'es' : ''}</span>
      </div>
      
      <div className="space-y-1">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className={cn(
              "flex items-center justify-between rounded-md border p-2 text-sm transition-colors",
              branch.isActive || branch.id === currentBranchId
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <ChatCircle className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{branch.branchTitle}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(branch.createdAt)}</span>
                  <span>•</span>
                  <span>{branch.messages.length} message{branch.messages.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {!(branch.isActive || branch.id === currentBranchId) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onSwitchBranch(branch.id)}
                  title="Switch to this branch"
                >
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                onClick={() => onDeleteBranch(branch.id)}
                title="Delete branch"
              >
                <Trash className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-full justify-start px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-3 w-3 mr-1" />
            Create new branch
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Conversation Branch</DialogTitle>
            <DialogDescription>
              Start a new conversation branch from this point. You can explore different discussion paths.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="branch-title-2">Branch Title</Label>
              <Input
                id="branch-title-2"
                placeholder="e.g., Alternative approach, Different topic..."
                value={branchTitle}
                onChange={(e) => setBranchTitle(e.target.value)}
                className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0"
                autoComplete="off"
              />
            </div>
            <div>
              <Label htmlFor="initial-message-2">Initial Message (Optional)</Label>
              <Textarea
                id="initial-message-2"
                placeholder="Start the branch with a specific message..."
                value={initialMessage}
                onChange={(e) => setInitialMessage(e.target.value)}
                rows={3}
                className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0"
                autoComplete="off"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateBranch} disabled={!branchTitle.trim()}>
                Create Branch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}