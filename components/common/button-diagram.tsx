"use client"

import { TreeStructure } from "@phosphor-icons/react"
import React from "react"
import { TextMorph } from "../motion-primitives/text-morph"

type ButtonDiagramProps = {
  onToggle: () => void
  diagramType?: string
}

export function ButtonDiagram({ onToggle, diagramType = "Diagram" }: ButtonDiagramProps) {
  return (
    <button
      onClick={onToggle}
      type="button"
      className="text-muted-foreground hover:bg-muted inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs"
      title={`Preview ${diagramType}`}
    >
      <TreeStructure className="h-3 w-3" />
      <TextMorph as="span">Diagram</TextMorph>
    </button>
  )
}