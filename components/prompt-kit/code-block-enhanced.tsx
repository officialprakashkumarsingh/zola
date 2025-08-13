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
import { PlantUMLPreview } from "../diagram/plantuml-preview"
import { containsPlantUML, formatDiagramType, getDiagramType } from "@/lib/plantuml-utils"

export type CodeBlockEnhancedProps = {
  code: string
  language: string
  className?: string
}

export function CodeBlockEnhanced({ code, language, className }: CodeBlockEnhancedProps) {
  const [showPreviewPopup, setShowPreviewPopup] = useState(false)
  const [showDiagramPopup, setShowDiagramPopup] = useState(false)
  
  const canPreview = isPreviewableLanguage(language)
  const isPlantUMLCode = containsPlantUML(code)
  const diagramType = isPlantUMLCode ? getDiagramType(code) : ''

  return (
    <div>
      <CodeBlock className={className}>
        <CodeBlockGroup className="flex h-9 items-center justify-between px-4">
          <div className="text-muted-foreground py-1 pr-2 font-mono text-xs">
            {isPlantUMLCode ? formatDiagramType(diagramType) : language}
          </div>
        </CodeBlockGroup>
        <div className="sticky top-16 lg:top-0">
          <div className="absolute right-0 bottom-0 flex h-9 items-center gap-1 pr-1.5">
            {isPlantUMLCode && (
              <ButtonDiagram
                onToggle={() => setShowDiagramPopup(true)}
                diagramType={formatDiagramType(diagramType)}
              />
            )}
            {canPreview && !isPlantUMLCode && (
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
      
      {canPreview && !isPlantUMLCode && (
        <CodePreviewPopup
          code={code}
          language={language}
          isOpen={showPreviewPopup}
          onClose={() => setShowPreviewPopup(false)}
        />
      )}
      
      {isPlantUMLCode && (
        <PlantUMLPreview
          plantumlCode={code}
          isOpen={showDiagramPopup}
          onClose={() => setShowDiagramPopup(false)}
          title={formatDiagramType(diagramType)}
        />
      )}
    </div>
  )
}