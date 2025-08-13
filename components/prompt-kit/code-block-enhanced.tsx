"use client"

import { cn } from "@/lib/utils"
import React, { useState } from "react"
import { ButtonCopy } from "../common/button-copy"
import { ButtonPreview } from "../common/button-preview"
import { ButtonDiagram } from "../common/button-diagram"
import {
  CodeBlock,
  CodeBlockCode,
  CodeBlockGroup,
} from "./code-block"
import { CodePreviewPopup, isPreviewableLanguage } from "./code-preview-popup"
import { MermaidPreview } from "../diagram/mermaid-preview"
import { containsMermaid, formatMermaidType, getMermaidType } from "@/lib/mermaid-utils"

export type CodeBlockEnhancedProps = {
  code: string
  language: string
  className?: string
}

export function CodeBlockEnhanced({ code, language, className }: CodeBlockEnhancedProps) {
  const [showPreviewPopup, setShowPreviewPopup] = useState(false)
  const [showDiagramPopup, setShowDiagramPopup] = useState(false)
  
  const canPreview = isPreviewableLanguage(language)
  
  // Check for Mermaid diagrams only
  const isMermaidCode = containsMermaid(code)
  const isDiagramCode = isMermaidCode
  
  // Get diagram info
  const mermaidType = isMermaidCode ? getMermaidType(code) : ''
  const diagramLabel = isMermaidCode 
    ? formatMermaidType(mermaidType)
    : language

  return (
    <div>
      <CodeBlock className={className}>
        <CodeBlockGroup className="flex h-9 items-center justify-between px-4">
          <div className="text-muted-foreground py-1 pr-2 font-mono text-xs">
            {diagramLabel}
          </div>
        </CodeBlockGroup>
        <div className="sticky top-16 lg:top-0">
          <div className="absolute right-0 bottom-0 flex h-9 items-center gap-1 pr-1.5">
            {isDiagramCode && (
              <ButtonDiagram
                onToggle={() => setShowDiagramPopup(true)}
                diagramType={formatMermaidType(mermaidType)}
              />
            )}
            {canPreview && !isDiagramCode && (
              <ButtonPreview
                language={language}
                onToggle={() => setShowPreviewPopup(true)}
                isVisible={false}
              />
            )}
            <ButtonCopy code={code} />
          </div>
        </div>
        <CodeBlockCode code={code} language={language} />
      </CodeBlock>
      
      {canPreview && !isDiagramCode && (
        <CodePreviewPopup
          code={code}
          language={language}
          isOpen={showPreviewPopup}
          onClose={() => setShowPreviewPopup(false)}
        />
      )}
      
      {isMermaidCode && (
        <MermaidPreview
          mermaidCode={code}
          isOpen={showDiagramPopup}
          onClose={() => setShowDiagramPopup(false)}
          title={formatMermaidType(mermaidType)}
        />
      )}
    </div>
  )
}