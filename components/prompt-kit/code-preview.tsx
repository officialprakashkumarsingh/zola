"use client"

import { cn } from "@/lib/utils"
import { Eye, EyeSlash, Maximize, Minimize } from "@phosphor-icons/react"
import { useState } from "react"
import { Button } from "../ui/button"

export type CodePreviewProps = {
  code: string
  language: string
  className?: string
}

function isPreviewableLanguage(language: string): boolean {
  const previewableLanguages = ["html", "svg", "json"]
  return previewableLanguages.includes(language.toLowerCase())
}

function CodePreview({ code, language, className }: CodePreviewProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!isPreviewableLanguage(language)) {
    return null
  }

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
        return null
    }
  }

  return (
    <div className={cn("mt-2", className)}>
      {/* Preview Controls */}
      <div className="border-border bg-muted/50 flex items-center justify-between rounded-t-lg border border-b-0 px-3 py-2">
        <span className="text-muted-foreground text-xs font-medium">
          {language.toUpperCase()} Preview
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="h-7 px-2 text-xs"
          >
            {showPreview ? (
              <>
                <EyeSlash className="mr-1 h-3 w-3" />
                Hide
              </>
            ) : (
              <>
                <Eye className="mr-1 h-3 w-3" />
                Show
              </>
            )}
          </Button>
          {showPreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-7 px-2 text-xs"
            >
              {isFullscreen ? (
                <>
                  <Minimize className="mr-1 h-3 w-3" />
                  Minimize
                </>
              ) : (
                <>
                  <Maximize className="mr-1 h-3 w-3" />
                  Fullscreen
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Preview Content */}
      {showPreview && (
        <>
          {isFullscreen && (
            <div className="bg-background/95 fixed inset-0 z-50 flex flex-col backdrop-blur-sm">
              <div className="border-border bg-background flex items-center justify-between border-b px-4 py-3">
                <h2 className="text-lg font-semibold">
                  {language.toUpperCase()} Preview
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(false)}
                >
                  <Minimize className="mr-1 h-4 w-4" />
                  Close Fullscreen
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">{renderPreview()}</div>
            </div>
          )}
          
          {!isFullscreen && (
            <div className="border-border bg-card h-64 overflow-hidden rounded-b-lg border">
              {renderPreview()}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export { CodePreview, isPreviewableLanguage }