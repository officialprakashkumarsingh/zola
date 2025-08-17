"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { 
  Robot,
  Lightning,
  CheckCircle,
  CircleNotch,
  Stack
} from "@phosphor-icons/react"
import { useState } from "react"

export interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  icon?: React.ReactNode
  capabilities: string[]
  isSelected?: boolean
}

// Mock model data - in real implementation, this would come from your model store
const availableModels: AIModel[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    description: "Most capable GPT model for complex tasks",
    capabilities: ["reasoning", "coding", "creative"],
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI", 
    description: "Fast and efficient for most tasks",
    capabilities: ["general", "coding", "fast"],
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    description: "Balanced model with strong reasoning",
    capabilities: ["reasoning", "analysis", "safety"],
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    description: "Fast and lightweight Claude model",
    capabilities: ["fast", "concise", "efficient"],
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    description: "Google's most capable AI model",
    capabilities: ["multimodal", "reasoning", "coding"],
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral",
    description: "High-performance open model",
    capabilities: ["reasoning", "multilingual", "coding"],
  }
]

interface MultiModelResponseProps {
  onMultiModelRequest: (selectedModels: AIModel[], originalMessage: string) => Promise<void>
  originalMessage: string
  isProcessing?: boolean
  className?: string
}

export function MultiModelResponse({
  onMultiModelRequest,
  originalMessage,
  isProcessing = false,
  className
}: MultiModelResponseProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set())

  const handleModelToggle = (modelId: string) => {
    const newSelected = new Set(selectedModels)
    if (newSelected.has(modelId)) {
      newSelected.delete(modelId)
    } else {
      newSelected.add(modelId)
    }
    setSelectedModels(newSelected)
  }

  const handleSubmit = async () => {
    if (selectedModels.size === 0) return
    
    const modelsToUse = availableModels.filter(model => selectedModels.has(model.id))
    setIsDialogOpen(false)
    await onMultiModelRequest(modelsToUse, originalMessage)
  }

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "openai": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "anthropic": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case "google": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "mistral": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7.5 w-7.5 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition",
            isProcessing && "animate-pulse",
            className
          )}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <CircleNotch className="h-4 w-4 animate-spin" />
          ) : (
            <Stack className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stack className="h-5 w-5" />
            Compare Multiple Models
          </DialogTitle>
          <DialogDescription>
            Select multiple AI models to get different perspectives on the same question. 
            You'll receive responses from each selected model for comparison.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Select Models ({selectedModels.size} selected)
            </span>
            {selectedModels.size > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedModels(new Set())}
              >
                Clear All
              </Button>
            )}
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {availableModels.map((model) => (
                <div
                  key={model.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-4 transition-colors cursor-pointer hover:bg-accent/50",
                    selectedModels.has(model.id) && "border-primary bg-primary/5"
                  )}
                  onClick={() => handleModelToggle(model.id)}
                >
                  <Checkbox
                    checked={selectedModels.has(model.id)}
                    onChange={() => handleModelToggle(model.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{model.name}</span>
                      <Badge variant="secondary" className={getProviderColor(model.provider)}>
                        {model.provider}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {model.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.map((capability) => (
                        <Badge
                          key={capability}
                          variant="outline"
                          className="text-xs"
                        >
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {selectedModels.has(model.id) && (
                    <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedModels.size === 0 
                ? "Select at least one model to continue"
                : `${selectedModels.size} model${selectedModels.size !== 1 ? 's' : ''} selected`
              }
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedModels.size === 0}
                className="flex items-center gap-2"
              >
                <Lightning className="h-4 w-4" />
                Compare Responses
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}