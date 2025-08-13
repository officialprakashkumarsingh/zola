"use client"

import { X } from "@phosphor-icons/react"
import { Button } from "../ui/button"

export type FileItemDisplayProps = {
  file: File
  onRemove: () => void
  extractionStatus?: "extracting" | "extracted" | "failed" | "not-supported" | "ready"
  extractedContentLength?: number
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function getFileExtension(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase() || ''
  return extension ? `.${extension}` : ''
}

function getFileIcon(extension: string): string {
  const iconMap: Record<string, string> = {
    '.txt': '📄',
    '.md': '📝',
    '.json': '🔧',
    '.xml': '🔧',
    '.csv': '📊',
    '.html': '🌐',
    '.htm': '🌐',
    '.css': '🎨',
    '.scss': '🎨',
    '.sass': '🎨',
    '.less': '🎨',
    '.js': '⚡',
    '.jsx': '⚡',
    '.ts': '🔷',
    '.tsx': '🔷',
    '.py': '🐍',
    '.java': '☕',
    '.c': '⚙️',
    '.cpp': '⚙️',
    '.h': '⚙️',
    '.hpp': '⚙️',
    '.cs': '🔵',
    '.php': '🐘',
    '.rb': '💎',
    '.go': '🐹',
    '.rs': '🦀',
    '.swift': '🦉',
    '.kt': '🟣',
    '.scala': '🔴',
    '.r': '📈',
    '.sql': '🗃️',
    '.sh': '💻',
    '.bash': '💻',
    '.zsh': '💻',
    '.ps1': '💙',
    '.yml': '⚙️',
    '.yaml': '⚙️',
    '.toml': '⚙️',
    '.ini': '⚙️',
    '.conf': '⚙️',
    '.config': '⚙️',
    '.env': '🔐',
    '.log': '📋',
    '.pdf': '📕',
    '.zip': '📦',
    '.tar': '📦',
    '.gz': '📦',
    '.rar': '📦',
    '.7z': '📦',
    '.jpg': '🖼️',
    '.jpeg': '🖼️',
    '.png': '🖼️',
    '.gif': '🖼️',
    '.svg': '🖼️',
    '.webp': '🖼️'
  }
  
  return iconMap[extension] || '📄'
}

function getStatusText(status?: "extracting" | "extracted" | "failed" | "not-supported" | "ready", contentLength?: number): { text: string; color: string } {
  switch (status) {
    case "extracting":
      return { text: "Extracting content...", color: "text-blue-600 dark:text-blue-400" }
    case "extracted":
      return { 
        text: `Content extracted (${contentLength ? `${contentLength} chars` : 'processed'})`, 
        color: "text-green-600 dark:text-green-400" 
      }
    case "failed":
      return { text: "Extraction failed", color: "text-red-600 dark:text-red-400" }
    case "not-supported":
      return { text: "Content extraction not available", color: "text-gray-500 dark:text-gray-400" }
    case "ready":
      return { text: "Ready to upload", color: "text-blue-600 dark:text-blue-400" }
    default:
      return { text: "Ready for upload", color: "text-gray-600 dark:text-gray-300" }
  }
}

export function FileItemDisplay({ file, onRemove, extractionStatus, extractedContentLength }: FileItemDisplayProps) {
  const extension = getFileExtension(file.name)
  const icon = getFileIcon(extension)
  const { text: statusText, color: statusColor } = getStatusText(extractionStatus, extractedContentLength)
  
  return (
    <div className="border-border bg-card flex items-center gap-3 rounded-lg border p-3">
      <div className="text-2xl">{icon}</div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate" title={file.name}>
            {file.name}
          </span>
          <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs font-medium">
            {extension || 'FILE'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="text-muted-foreground text-xs">
            {formatFileSize(file.size)}
          </span>
          <span className="text-muted-foreground text-xs">•</span>
          <span className={`text-xs ${statusColor}`}>
            {statusText}
          </span>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
        aria-label="Remove file"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}