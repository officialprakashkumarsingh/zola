"use client"

import { useCallback, useState } from "react"

export interface ConversationBranch {
  id: string
  parentMessageId: string
  branchTitle: string
  messages: Array<{
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: number
  }>
  isActive: boolean
  createdAt: number
}

export interface BranchingState {
  branches: ConversationBranch[]
  currentBranchId: string | null
  branchingEnabled: boolean
}

export function useConversationBranching() {
  const [branchingState, setBranchingState] = useState<BranchingState>({
    branches: [],
    currentBranchId: null,
    branchingEnabled: true,
  })

  const createBranch = useCallback(
    (parentMessageId: string, branchTitle: string, initialUserMessage?: string) => {
      console.log('useConversationBranching: Creating branch', { parentMessageId, branchTitle, initialUserMessage })
      
      const newBranch: ConversationBranch = {
        id: `branch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        parentMessageId,
        branchTitle,
        messages: initialUserMessage
          ? [
              {
                id: `msg-${Date.now()}`,
                role: "user",
                content: initialUserMessage,
                timestamp: Date.now(),
              },
            ]
          : [],
        isActive: false,
        createdAt: Date.now(),
      }

      console.log('useConversationBranching: New branch created', newBranch)

      setBranchingState((prev) => {
        const newState = {
          ...prev,
          branches: [...prev.branches, newBranch],
        }
        console.log('useConversationBranching: Updated state', newState)
        return newState
      })

      return newBranch.id
    },
    []
  )

  const switchToBranch = useCallback((branchId: string) => {
    setBranchingState((prev) => ({
      ...prev,
      currentBranchId: branchId,
      branches: prev.branches.map((branch) => ({
        ...branch,
        isActive: branch.id === branchId,
      })),
    }))
  }, [])

  const deleteBranch = useCallback((branchId: string) => {
    setBranchingState((prev) => ({
      ...prev,
      branches: prev.branches.filter((branch) => branch.id !== branchId),
      currentBranchId: prev.currentBranchId === branchId ? null : prev.currentBranchId,
    }))
  }, [])

  const addMessageToBranch = useCallback(
    (branchId: string, role: "user" | "assistant", content: string) => {
      const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      setBranchingState((prev) => ({
        ...prev,
        branches: prev.branches.map((branch) =>
          branch.id === branchId
            ? {
                ...branch,
                messages: [
                  ...branch.messages,
                  {
                    id: messageId,
                    role,
                    content,
                    timestamp: Date.now(),
                  },
                ],
              }
            : branch
        ),
      }))

      return messageId
    },
    []
  )

  const getBranchesForMessage = useCallback(
    (messageId: string) => {
      return branchingState.branches.filter(
        (branch) => branch.parentMessageId === messageId
      )
    },
    [branchingState.branches]
  )

  const getCurrentBranch = useCallback(() => {
    if (!branchingState.currentBranchId) return null
    return branchingState.branches.find(
      (branch) => branch.id === branchingState.currentBranchId
    ) || null
  }, [branchingState.branches, branchingState.currentBranchId])

  const toggleBranching = useCallback(() => {
    setBranchingState((prev) => ({
      ...prev,
      branchingEnabled: !prev.branchingEnabled,
    }))
  }, [])

  return {
    branchingState,
    createBranch,
    switchToBranch,
    deleteBranch,
    addMessageToBranch,
    getBranchesForMessage,
    getCurrentBranch,
    toggleBranching,
  }
}