"use client"

import { Eye } from "@phosphor-icons/react"
import React from "react"
import { TextMorph } from "../motion-primitives/text-morph"

type ButtonPreviewProps = {
  language: string
  onToggle: () => void
  isVisible: boolean
}

export function ButtonPreview({ language, onToggle, isVisible }: ButtonPreviewProps) {
  return (
    <button
      onClick={onToggle}
      type="button"
      className="text-muted-foreground hover:bg-muted inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs"
      title={`${isVisible ? 'Hide' : 'Show'} ${language.toUpperCase()} preview`}
    >
      <Eye className="h-3 w-3" />
      <TextMorph as="span">Preview</TextMorph>
    </button>
  )
}