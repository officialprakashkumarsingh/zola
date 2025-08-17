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
        
        // Process chemistry formulas with mhchem package syntax
        let formula = children
        if (type === "chemistry") {
          // Add \ce{} wrapper for chemistry formulas if not already present
          if (!formula.startsWith("\\ce{") && !formula.startsWith("\\cee{")) {
            formula = `\\ce{${formula}}`
          }
        }

        katex.render(formula, ref.current, {
          displayMode,
          throwOnError: false,
          errorColor: "#dc2626",
          strict: false,
          trust: true,
          macros: {
            // Add common chemistry macros
            "\\ce": "\\mathrm{#1}",
            "\\cee": "\\mathrm{#1}",
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