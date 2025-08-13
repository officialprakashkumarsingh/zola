"use client"

import { cn } from "@/lib/utils"
import { ArrowsOut, Copy, Download, X } from "@phosphor-icons/react"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { toast } from "../ui/toast"

export type PlantUMLPreviewProps = {
  plantumlCode: string
  isOpen: boolean
  onClose: () => void
  title?: string
}

// Function to encode PlantUML code for the server using deflate compression
function encodePlantUML(plantumlCode: string): string {
  try {
    // Simple encoding for PlantUML server
    // Remove any leading/trailing whitespace and ensure proper format
    const cleanCode = plantumlCode.trim()
    
    // Use base64 encoding with URL-safe characters
    const encoded = btoa(unescape(encodeURIComponent(cleanCode)))
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  } catch (error) {
    console.error('Error encoding PlantUML:', error)
    // Fallback to simple encoding
    return btoa(plantumlCode).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }
}

// Generate PlantUML server URL
function getPlantUMLImageUrl(plantumlCode: string, format: 'svg' | 'png' = 'svg'): string {
  const encoded = encodePlantUML(plantumlCode)
  return `https://www.plantuml.com/plantuml/${format}/${encoded}`
}

export function PlantUMLPreview({ plantumlCode, isOpen, onClose, title = "PlantUML Diagram" }: PlantUMLPreviewProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const svgUrl = getPlantUMLImageUrl(plantumlCode, 'svg')
  const pngUrl = getPlantUMLImageUrl(plantumlCode, 'png')

  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false)
      setImageError(false)
    }
  }, [isOpen, plantumlCode])

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(plantumlCode)
      toast({
        title: "Copied to clipboard",
        description: "PlantUML code copied successfully",
        status: "success",
      })
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy PlantUML code to clipboard",
        status: "error",
      })
    }
  }

  const handleDownload = () => {
    // Download PNG version
    const link = document.createElement('a')
    link.href = pngUrl
    link.download = 'diagram.png'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageLoaded(false)
    setImageError(true)
  }

  return (
    <>
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
                  title="Copy PlantUML code"
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
          
          <div className="flex-1 overflow-hidden rounded-md border">
            <div className="h-full w-full flex items-center justify-center bg-white">
              {!imageLoaded && !imageError && (
                <div className="text-muted-foreground">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p>Generating diagram...</p>
                </div>
              )}
              
              {imageError && (
                <div className="text-center p-8">
                  <div className="text-destructive mb-4">
                    <X className="h-12 w-12 mx-auto mb-2" />
                    <p className="font-medium">Failed to generate diagram</p>
                  </div>
                  <div className="text-muted-foreground text-sm space-y-2">
                    <p>Please check your PlantUML syntax:</p>
                    <ul className="text-left list-disc list-inside space-y-1">
                      <li>Ensure your diagram starts with @startuml and ends with @enduml</li>
                      <li>Check for syntax errors in your PlantUML code</li>
                      <li>Verify that all relationships and elements are properly defined</li>
                    </ul>
                  </div>
                </div>
              )}
              
              <img
                src={svgUrl}
                alt="PlantUML Diagram"
                className={cn(
                  "max-w-full max-h-full object-contain",
                  !imageLoaded && "hidden"
                )}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Mode */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm">
            <h2 className="text-lg font-semibold">{title}</h2>
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
          
          <div className="flex-1 overflow-hidden flex items-center justify-center bg-white">
            {!imageLoaded && !imageError && (
              <div className="text-muted-foreground text-center">
                <div className="animate-spin h-12 w-12 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Generating diagram...</p>
              </div>
            )}
            
            {imageError && (
              <div className="text-center p-8 max-w-md">
                <div className="text-destructive mb-4">
                  <X className="h-16 w-16 mx-auto mb-4" />
                  <p className="font-medium text-lg">Failed to generate diagram</p>
                </div>
                <div className="text-muted-foreground space-y-2">
                  <p>Please check your PlantUML syntax and try again.</p>
                </div>
              </div>
            )}
            
            <img
              src={svgUrl}
              alt="PlantUML Diagram"
              className={cn(
                "max-w-full max-h-full object-contain",
                !imageLoaded && "hidden"
              )}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        </div>
      )}
    </>
  )
}