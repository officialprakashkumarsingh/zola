import {
  FileUpload,
  FileUploadContent,
  FileUploadTrigger,
} from "@/components/prompt-kit/file-upload"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getModelInfo } from "@/lib/models"
import { isSupabaseEnabled } from "@/lib/supabase/config"
import { cn } from "@/lib/utils"
import { FileArrowUp, Paperclip } from "@phosphor-icons/react"
import React from "react"
import { PopoverContentAuth } from "./popover-content-auth"

type ButtonFileUploadProps = {
  onFileUpload: (files: File[]) => void
  isUserAuthenticated: boolean
  model: string
}

export function ButtonFileUpload({
  onFileUpload,
  isUserAuthenticated,
  model,
}: ButtonFileUploadProps) {
  // Always show the attachment button - we support text file extraction for all models
  const isVisionModel = getModelInfo(model)?.vision
  const hasSupabase = isSupabaseEnabled

  if (!isUserAuthenticated && hasSupabase) {
    return (
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="border-border dark:bg-secondary size-9 rounded-full border bg-transparent"
                type="button"
                aria-label="Add files"
              >
                <Paperclip className="size-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Add files</TooltipContent>
        </Tooltip>
        <PopoverContentAuth />
      </Popover>
    )
  }

  // Show different behavior based on configuration
  if (!hasSupabase) {
    // No Supabase - show basic file input that works client-side only
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <input
              type="file"
              multiple
              accept=".txt,.md,.json,.xml,.csv,.html,.htm,.css,.scss,.sass,.less,.js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.h,.hpp,.cs,.php,.rb,.go,.rs,.swift,.kt,.scala,.r,.sql,.sh,.bash,.zsh,.ps1,.yml,.yaml,.toml,.ini,.conf,.config,.env,.log,.pdf,.zip,.tar,.gz,.rar,.7z,image/jpeg,image/png,image/gif,image/webp,image/svg,image/heic,image/heif"
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                if (files.length > 0) {
                  onFileUpload(files)
                  e.target.value = '' // Reset input
                }
              }}
              style={{ display: 'none' }}
              id="file-upload-input"
            />
            <label htmlFor="file-upload-input">
              <Button
                size="sm"
                variant="secondary"
                className="border-border dark:bg-secondary size-9 rounded-full border bg-transparent cursor-pointer"
                type="button"
                aria-label="Add files"
                asChild
              >
                <div>
                  <Paperclip className="size-4" />
                </div>
              </Button>
            </label>
          </div>
        </TooltipTrigger>
        <TooltipContent>Add files - content will be extracted for AI analysis</TooltipContent>
      </Tooltip>
    )
  }

  // With Supabase - use the full FileUpload component
  return (
    <FileUpload
      onFilesAdded={onFileUpload}
      multiple
      disabled={!isUserAuthenticated}
      accept=".txt,.md,.json,.xml,.csv,.html,.htm,.css,.scss,.sass,.less,.js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.h,.hpp,.cs,.php,.rb,.go,.rs,.swift,.kt,.scala,.r,.sql,.sh,.bash,.zsh,.ps1,.yml,.yaml,.toml,.ini,.conf,.config,.env,.log,.pdf,.zip,.tar,.gz,.rar,.7z,image/jpeg,image/png,image/gif,image/webp,image/svg,image/heic,image/heif"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <FileUploadTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className={cn(
                "border-border dark:bg-secondary size-9 rounded-full border bg-transparent",
                !isUserAuthenticated && "opacity-50"
              )}
              type="button"
              disabled={!isUserAuthenticated}
              aria-label="Add files"
            >
              <Paperclip className="size-4" />
            </Button>
          </FileUploadTrigger>
        </TooltipTrigger>
        <TooltipContent>Add files - {isVisionModel ? 'supports images and' : ''} content extraction for AI analysis</TooltipContent>
      </Tooltip>
      <FileUploadContent>
        <div className="border-input bg-background flex flex-col items-center rounded-lg border border-dashed p-8">
          <FileArrowUp className="text-muted-foreground size-8" />
          <span className="mt-4 mb-1 text-lg font-medium">Drop files here</span>
          <span className="text-muted-foreground text-sm">
            Drop files here - supports code, text, PDF, ZIP{isVisionModel ? ', and images' : ''}
          </span>
        </div>
      </FileUploadContent>
    </FileUpload>
  )
}
