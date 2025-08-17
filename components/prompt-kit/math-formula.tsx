"use client"

import { cn } from "@/lib/utils"
import katex from "katex"
import "katex/dist/katex.min.css"
import React, { useEffect, useRef, useState } from "react"

export type MathFormulaProps = {
  children: string
  displayMode?: boolean
  className?: string
  type?: "latex" | "chemistry"
}

// Simple chemistry formula processor
function processChemistryFormula(formula: string): string {
  return formula
    // Convert common chemistry notation to LaTeX
    .replace(/(\d+)/g, '_{$1}') // Convert numbers to subscripts
    .replace(/->/g, '\\rightarrow ') // Right arrow for reactions
    .replace(/<->/g, '\\leftrightarrow ') // Equilibrium arrow
    .replace(/<-/g, '\\leftarrow ') // Left arrow
    .replace(/\+/g, ' + ') // Add spaces around plus signs
    .replace(/\s+/g, ' ') // Clean up multiple spaces
    .trim()
}

export function MathFormula({ 
  children, 
  displayMode = false, 
  className,
  type = "latex" 
}: MathFormulaProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (ref.current) {
      try {
        setError(null)
        
        let formula = children.trim()
        
        if (type === "chemistry") {
          // Process chemistry formulas with simple LaTeX formatting
          formula = processChemistryFormula(formula)
          // Wrap in math mode for proper rendering
          formula = `\\mathrm{${formula}}`
        }

        katex.render(formula, ref.current, {
          displayMode,
          throwOnError: false,
          errorColor: "#dc2626",
          strict: false,
          trust: true,
          macros: {
            // Add common chemistry-like macros
            "\\chem": "\\mathrm{#1}",
          },
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to render formula")
        if (ref.current) {
          ref.current.textContent = children
        }
      }
    }
  }, [children, displayMode, type])

  if (error) {
    return (
      <span 
        className={cn(
          "inline-block rounded bg-red-50 px-2 py-1 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400",
          className
        )}
        title={error}
      >
        {children}
      </span>
    )
  }

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block",
        displayMode && "my-2 text-center",
        className
      )}
    />
  )
}

// Inline math component
export function InlineMath({ children, className }: { children: string; className?: string }) {
  return <MathFormula className={className} displayMode={false}>{children}</MathFormula>
}

// Display math component
export function DisplayMath({ children, className }: { children: string; className?: string }) {
  return <MathFormula className={className} displayMode={true}>{children}</MathFormula>
}

// Chemistry formula component
export function ChemistryFormula({ children, className }: { children: string; className?: string }) {
  return <MathFormula className={className} type="chemistry" displayMode={false}>{children}</MathFormula>
}

// Display chemistry formula component
export function DisplayChemistry({ children, className }: { children: string; className?: string }) {
  return <MathFormula className={className} type="chemistry" displayMode={true}>{children}</MathFormula>
}