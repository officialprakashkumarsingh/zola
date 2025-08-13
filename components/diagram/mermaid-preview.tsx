"use client"

import { cn } from "@/lib/utils"
import { ArrowsOut, Copy, Download, X } from "@phosphor-icons/react"
import { useState, useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { toast } from "@/components/ui/toast"

export type MermaidPreviewProps = {
  mermaidCode: string
  isOpen: boolean
  onClose: () => void
  title?: string
}

export function MermaidPreview({ mermaidCode, isOpen, onClose, title = "Mermaid Diagram" }: MermaidPreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mermaid, setMermaid] = useState<any>(null)

  // Load Mermaid dynamically
  useEffect(() => {
    const loadMermaid = async () => {
      try {
        // Only load if we're in the browser
        if (typeof window === 'undefined') return
        
        const mermaidModule = await import('mermaid')
        const mermaidInstance = mermaidModule.default
        
        mermaidInstance.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'inherit',
          fontSize: 14,
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true
          },
          sequence: {
            useMaxWidth: true,
            showSequenceNumbers: true
          },
          gantt: {
            useMaxWidth: true
          }
        })
        
        setMermaid(mermaidInstance)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load Mermaid:', error)
        setHasError(true)
        setIsLoading(false)
      }
    }

    // Add a small delay to ensure the component is fully mounted
    const timer = setTimeout(loadMermaid, 100)
    return () => clearTimeout(timer)
  }, [])

  // Render diagram when mermaid is loaded and dialog is open
  useEffect(() => {
    if (!mermaid || !isOpen || !containerRef.current || typeof window === 'undefined') return

    const renderDiagram = async () => {
      setIsLoading(true)
      setHasError(false)

      try {
        // Clear previous content
        if (containerRef.current) {
          containerRef.current.innerHTML = ''
        }

        // Generate unique ID for this diagram
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        
        // Basic validation
        if (!mermaidCode.trim()) {
          throw new Error('Empty diagram code')
        }
        
        // Validate and render the diagram
        const { svg } = await mermaid.render(id, mermaidCode)
        
        if (containerRef.current && svg) {
          containerRef.current.innerHTML = svg
          
          // Style the generated SVG
          const svgElement = containerRef.current.querySelector('svg')
          if (svgElement) {
            svgElement.style.maxWidth = '100%'
            svgElement.style.height = 'auto'
            svgElement.style.background = 'transparent'
          }
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Mermaid render error:', error)
        setHasError(true)
        setIsLoading(false)
        
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="flex items-center justify-center h-64 text-red-500">
              <div class="text-center">
                <p class="font-semibold">Diagram Render Error</p>
                <p class="text-sm mt-2">Please check your Mermaid syntax</p>
                <p class="text-xs mt-1 text-gray-500">${error instanceof Error ? error.message : 'Unknown error'}</p>
              </div>
            </div>
          `
        }
      }
    }

    // Add a small delay to prevent race conditions
    const timer = setTimeout(renderDiagram, 200)
    return () => clearTimeout(timer)
  }, [mermaid, mermaidCode, isOpen])

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(mermaidCode)
      toast({
        title: "Copied to clipboard",
        description: "Mermaid code copied successfully",
        status: "success",
      })
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy Mermaid code to clipboard",
        status: "error",
      })
    }
  }

  const handleDownload = () => {
    try {
      const svgElement = containerRef.current?.querySelector('svg')
      if (!svgElement) {
        toast({
          title: "Download failed",
          description: "No diagram to download",
          status: "error",
        })
        return
      }

      // Simple SVG download (more reliable than canvas conversion)
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = 'mermaid-diagram.svg'
      link.click()
      URL.revokeObjectURL(url)
      
      toast({
        title: "Download complete",
        description: "Diagram downloaded as SVG",
        status: "success",
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Download failed",
        description: "Could not download diagram",
        status: "error",
      })
    }
  }

  return (
    <>
      {/* Regular Dialog */}
      <Dialog open={isOpen && !isFullscreen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{title}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(true)}
                  className="h-8 w-8 p-0"
                  title="Fullscreen"
                >
                  <ArrowsOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyCode}
                  className="h-8 w-8 p-0"
                  title="Copy Mermaid code"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="h-8 w-8 p-0"
                  title="Download as PNG"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden rounded-md border bg-white">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            <div 
              ref={containerRef}
              className={cn(
                "h-full w-full flex items-center justify-center p-4 overflow-auto",
                (isLoading || hasError) && "hidden"
              )}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Mode */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="w-full h-full bg-white m-4 rounded-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">{title} - Fullscreen</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyCode}
                  className="h-8 px-3"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Code
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="h-8 px-3"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(false)}
                  className="h-8 px-3"
                >
                  <X className="h-4 w-4 mr-1" />
                  Close
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden bg-white">
              {isLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}
              <div 
                ref={containerRef}
                className={cn(
                  "h-full w-full flex items-center justify-center p-8 overflow-auto",
                  (isLoading || hasError) && "hidden"
                )}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}