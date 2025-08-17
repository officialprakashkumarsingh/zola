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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  PencilSimple,
  ArrowsOut,
  ArrowsIn,
  Smiley,
  GraduationCap,
  Briefcase,
  Heart,
  Lightning,
  Sparkle,
  BookOpen,
  Target,
  CircleNotch
} from "@phosphor-icons/react"
import { useState } from "react"

export interface ResponseStyle {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  prompt: string
  category: "length" | "tone" | "format"
}

const responseStyles: ResponseStyle[] = [
  {
    id: "expand",
    name: "Expand",
    description: "Make the response more detailed and comprehensive",
    icon: <ArrowsOut className="h-4 w-4" />,
    prompt: "Expand this response with more details, examples, and comprehensive explanations:",
    category: "length"
  },
  {
    id: "compact",
    name: "Compact",
    description: "Make the response shorter and more concise",
    icon: <ArrowsIn className="h-4 w-4" />,
    prompt: "Make this response more concise and to the point, keeping only the essential information:",
    category: "length"
  },
  {
    id: "humorous",
    name: "Humorous",
    description: "Add humor and wit to the response",
    icon: <Smiley className="h-4 w-4" />,
    prompt: "Rewrite this response with humor, wit, and entertaining elements while keeping the core information:",
    category: "tone"
  },
  {
    id: "academic",
    name: "Academic",
    description: "Make the response more scholarly and formal",
    icon: <GraduationCap className="h-4 w-4" />,
    prompt: "Rewrite this response in an academic, scholarly tone with formal language and proper citations where appropriate:",
    category: "tone"
  },
  {
    id: "professional",
    name: "Professional",
    description: "Make the response more business-oriented",
    icon: <Briefcase className="h-4 w-4" />,
    prompt: "Rewrite this response in a professional, business-appropriate tone suitable for workplace communication:",
    category: "tone"
  },
  {
    id: "casual",
    name: "Casual",
    description: "Make the response more conversational and friendly",
    icon: <Heart className="h-4 w-4" />,
    prompt: "Rewrite this response in a casual, friendly, conversational tone as if talking to a friend:",
    category: "tone"
  },
  {
    id: "technical",
    name: "Technical",
    description: "Add more technical details and specifications",
    icon: <Lightning className="h-4 w-4" />,
    prompt: "Rewrite this response with more technical details, specifications, and implementation specifics:",
    category: "format"
  },
  {
    id: "creative",
    name: "Creative",
    description: "Make the response more creative and imaginative",
    icon: <Sparkle className="h-4 w-4" />,
    prompt: "Rewrite this response with creative flair, metaphors, and imaginative elements:",
    category: "tone"
  },
  {
    id: "educational",
    name: "Educational",
    description: "Structure as a teaching/learning resource",
    icon: <BookOpen className="h-4 w-4" />,
    prompt: "Rewrite this response as an educational resource with clear explanations, examples, and learning objectives:",
    category: "format"
  },
  {
    id: "actionable",
    name: "Actionable",
    description: "Focus on practical steps and implementation",
    icon: <Target className="h-4 w-4" />,
    prompt: "Rewrite this response focusing on actionable steps, practical implementation, and clear next actions:",
    category: "format"
  }
]

interface ModifyResponseProps {
  originalResponse: string
  onModify: (style: ResponseStyle, originalResponse: string) => Promise<void>
  isModifying?: boolean
  className?: string
}

export function ModifyResponse({
  originalResponse,
  onModify,
  isModifying = false,
  className
}: ModifyResponseProps) {
  const [selectedStyle, setSelectedStyle] = useState<ResponseStyle | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleStyleSelect = async (style: ResponseStyle) => {
    setSelectedStyle(style)
    setIsDialogOpen(false)
    await onModify(style, originalResponse)
  }

  const getCategoryStyles = (category: ResponseStyle["category"]) => {
    return responseStyles.filter(style => style.category === category)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7.5 w-7.5 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition",
            isModifying && "animate-spin",
            className
          )}
          disabled={isModifying}
        >
          {isModifying ? (
            <CircleNotch className="h-4 w-4 animate-spin" />
          ) : (
            <PencilSimple className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          <PencilSimple className="h-4 w-4" />
          Modify Response
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Length
        </DropdownMenuLabel>
        {getCategoryStyles("length").map((style) => (
          <DropdownMenuItem
            key={style.id}
            onClick={() => handleStyleSelect(style)}
            className="flex items-start gap-3 p-3 cursor-pointer"
          >
            <div className="flex-shrink-0 mt-0.5">
              {style.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium">{style.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {style.description}
              </p>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Tone
        </DropdownMenuLabel>
        {getCategoryStyles("tone").map((style) => (
          <DropdownMenuItem
            key={style.id}
            onClick={() => handleStyleSelect(style)}
            className="flex items-start gap-3 p-3 cursor-pointer"
          >
            <div className="flex-shrink-0 mt-0.5">
              {style.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium">{style.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {style.description}
              </p>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Format
        </DropdownMenuLabel>
        {getCategoryStyles("format").map((style) => (
          <DropdownMenuItem
            key={style.id}
            onClick={() => handleStyleSelect(style)}
            className="flex items-start gap-3 p-3 cursor-pointer"
          >
            <div className="flex-shrink-0 mt-0.5">
              {style.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium">{style.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {style.description}
              </p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}