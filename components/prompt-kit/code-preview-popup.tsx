"use client"

import { cn } from "@/lib/utils"
import { X } from "@phosphor-icons/react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

export type CodePreviewPopupProps = {
  code: string
  language: string
  isOpen: boolean
  onClose: () => void
}

function CodePreviewPopup({ code, language, isOpen, onClose }: CodePreviewPopupProps) {
  const renderPreview = () => {
    const lowerLang = language.toLowerCase()

    switch (lowerLang) {
      case "html":
        // Sanitize HTML for basic security
        const sanitizedCode = code
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<!-- script removed -->')
          .replace(/javascript:/gi, '#')
          .replace(/on\w+\s*=/gi, 'data-removed=')
        
        return (
          <iframe
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body { 
                      margin: 0; 
                      padding: 16px; 
                      font-family: system-ui, -apple-system, sans-serif;
                      background: white;
                      color: #000;
                      line-height: 1.6;
                    }
                    * { 
                      box-sizing: border-box; 
                    }
                    h1, h2, h3, h4, h5, h6 {
                      margin-top: 0;
                    }
                  </style>
                </head>
                <body>
                  ${sanitizedCode}
                </body>
              </html>
            `}
            className="h-full w-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            title="HTML Preview"
          />
        )

      case "svg":
        // Basic SVG validation and sanitization
        const isSvgValid = code.trim().toLowerCase().startsWith('<svg')
        if (!isSvgValid) {
          return (
            <div className="flex h-full w-full items-center justify-center p-4">
              <div className="text-destructive text-center">
                <p className="font-medium">Invalid SVG</p>
                <p className="text-muted-foreground text-sm">
                  SVG content must start with &lt;svg&gt; tag
                </p>
              </div>
            </div>
          )
        }
        
        // Remove script tags and event handlers from SVG for security
        const sanitizedSvg = code
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
          .replace(/on\w+\s*=\s*'[^']*'/gi, '')
          .replace(/javascript:/gi, '#')
        
        return (
          <div className="flex h-full w-full items-center justify-center bg-background p-4">
            <div
              className="max-h-full max-w-full"
              dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
            />
          </div>
        )

      case "json":
        try {
          const parsed = JSON.parse(code)
          const formatted = JSON.stringify(parsed, null, 2)
          const isArray = Array.isArray(parsed)
          const isObject = typeof parsed === 'object' && parsed !== null && !isArray
          const summary = isArray 
            ? `Array with ${parsed.length} items`
            : isObject 
            ? `Object with ${Object.keys(parsed).length} properties`
            : `Value: ${typeof parsed}`
            
          return (
            <div className="h-full w-full overflow-auto">
              <div className="border-border bg-muted/30 sticky top-0 border-b px-4 py-2">
                <span className="text-muted-foreground text-xs">{summary}</span>
              </div>
              <div className="p-4">
                <pre className="text-foreground whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
                  {formatted}
                </pre>
              </div>
            </div>
          )
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Parse error"
          const lineMatch = errorMessage.match(/position (\d+)/)
          const position = lineMatch ? parseInt(lineMatch[1]) : null
          
          return (
            <div className="flex h-full w-full items-center justify-center p-4">
              <div className="text-destructive max-w-md text-center">
                <p className="font-medium">Invalid JSON</p>
                <p className="text-muted-foreground mb-2 text-sm">{errorMessage}</p>
                {position !== null && (
                  <p className="text-muted-foreground text-xs">
                    Error near character {position}
                  </p>
                )}
              </div>
            </div>
          )
        }

      default:
        return (
          <div className="flex h-full w-full items-center justify-center p-4">
            <p className="text-muted-foreground">Preview not available for {language}</p>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{language.toUpperCase()} Preview</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden rounded-md border">
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { CodePreviewPopup }