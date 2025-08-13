"use client"

import { useState, useCallback, useMemo } from "react"

type PreviewState = Record<string, boolean>

export function useCodePreview() {
  const [previewStates, setPreviewStates] = useState<PreviewState>({})

  const togglePreview = useCallback((codeId: string) => {
    setPreviewStates(prev => ({
      ...prev,
      [codeId]: !prev[codeId]
    }))
  }, [])

  const isPreviewVisible = useCallback((codeId: string) => {
    return previewStates[codeId] || false
  }, [previewStates])

  const generateCodeId = useCallback((code: string, language: string) => {
    // Create a simple hash from code content and language
    const content = `${language}-${code}`
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return `code-${Math.abs(hash)}`
  }, [])

  return useMemo(() => ({
    togglePreview,
    isPreviewVisible,
    generateCodeId
  }), [togglePreview, isPreviewVisible, generateCodeId])
}