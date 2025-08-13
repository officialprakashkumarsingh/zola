"use client"

import { cn } from "@/lib/utils"
import { useCodePreview } from "@/lib/hooks/use-code-preview"
import React from "react"
import { ButtonCopy } from "../common/button-copy"
import { ButtonPreview } from "../common/button-preview"
import {
  CodeBlock,
  CodeBlockCode,
  CodeBlockGroup,
} from "./code-block"
import { CodePreview, isPreviewableLanguage } from "./code-preview"

export type CodeBlockEnhancedProps = {
  code: string
  language: string
  className?: string
}

export function CodeBlockEnhanced({ code, language, className }: CodeBlockEnhancedProps) {
  const { togglePreview, isPreviewVisible, generateCodeId } = useCodePreview()
  const canPreview = isPreviewableLanguage(language)
  const codeId = generateCodeId(code, language)
  const showPreview = isPreviewVisible(codeId)

  return (
    <div>
      <CodeBlock className={className}>
        <CodeBlockGroup className="flex h-9 items-center justify-between px-4">
          <div className="text-muted-foreground py-1 pr-2 font-mono text-xs">
            {language}
          </div>
        </CodeBlockGroup>
        <div className="sticky top-16 lg:top-0">
          <div className="absolute right-0 bottom-0 flex h-9 items-center gap-1 pr-1.5">
            {canPreview && (
              <ButtonPreview
                language={language}
                onToggle={() => togglePreview(codeId)}
                isVisible={showPreview}
              />
            )}
            <ButtonCopy code={code} />
          </div>
        </div>
        <CodeBlockCode code={code} language={language} />
      </CodeBlock>
      {canPreview && showPreview && (
        <CodePreview code={code} language={language} />
      )}
    </div>
  )
}