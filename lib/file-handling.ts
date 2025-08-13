import { toast } from "@/components/ui/toast"
import { SupabaseClient } from "@supabase/supabase-js"
import * as fileType from "file-type"
import { DAILY_FILE_UPLOAD_LIMIT } from "./config"
import { createClient } from "./supabase/client"
import { isSupabaseEnabled } from "./supabase/config"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const ALLOWED_FILE_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/heic",
  "image/heif",
  
  // Documents
  "application/pdf",
  
  // Text files
  "text/plain",
  "text/markdown",
  "text/html",
  "text/css",
  "text/javascript",
  "text/xml",
  "text/csv",
  
  // JSON and data
  "application/json",
  "application/xml",
  "text/yaml",
  "application/yaml",
  
  // Archives
  "application/zip",
  "application/x-zip-compressed",
  "application/x-tar",
  "application/x-gzip",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
  
  // Code files (most will be detected as text/plain)
  "application/javascript",
  "application/typescript",
  "text/x-python",
  "text/x-java-source",
  "text/x-c",
  "text/x-c++src",
  "text/x-csharp",
  "text/x-php",
  "text/x-ruby",
  "text/x-go",
  "text/x-rust",
  "text/x-swift",
  "text/x-kotlin",
  "text/x-scala",
  "text/x-r",
  "text/x-sql",
  "text/x-shellscript",
  
  // Office documents
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

export type Attachment = {
  name: string
  contentType: string
  url: string
}

export async function validateFile(
  file: File
): Promise<{ isValid: boolean; error?: string }> {
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
    }
  }

  // Get file extension for validation
  const extension = file.name.toLowerCase().split('.').pop() || ''
  
  // Common text-based extensions that should be allowed
  const textBasedExtensions = [
    'txt', 'md', 'markdown', 'json', 'xml', 'csv', 'html', 'htm', 'css', 
    'scss', 'sass', 'less', 'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 
    'cpp', 'h', 'hpp', 'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 
    'scala', 'r', 'sql', 'sh', 'bash', 'zsh', 'ps1', 'yml', 'yaml', 
    'toml', 'ini', 'conf', 'config', 'env', 'log'
  ]

  // If it's a text-based file by extension, allow it
  if (textBasedExtensions.includes(extension)) {
    return { isValid: true }
  }

  // For other files, check MIME type
  const buffer = await file.arrayBuffer()
  const type = await fileType.fileTypeFromBuffer(
    Buffer.from(buffer.slice(0, 4100))
  )

  // If no type detected but file starts with text content, allow it
  if (!type) {
    const decoder = new TextDecoder('utf-8', { fatal: false })
    const sample = decoder.decode(buffer.slice(0, 1000))
    const isText = /^[\x20-\x7E\s]*$/.test(sample) && sample.length > 0
    
    if (isText) {
      return { isValid: true }
    }
    
    return {
      isValid: false,
      error: "File type could not be determined",
    }
  }

  // Check if the detected type is allowed
  const isAllowed = ALLOWED_FILE_TYPES.includes(type.mime) || 
    ALLOWED_FILE_TYPES.includes(file.type) ||
    file.type.startsWith('text/') ||
    file.type.startsWith('application/json') ||
    file.type.startsWith('application/xml')

  if (!isAllowed) {
    return {
      isValid: false,
      error: `File type '${type.mime || file.type}' is not supported`,
    }
  }

  return { isValid: true }
}

export async function uploadFile(
  supabase: SupabaseClient,
  file: File
): Promise<string> {
  const fileExt = file.name.split(".").pop()
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `uploads/${fileName}`

  const { error } = await supabase.storage
    .from("chat-attachments")
    .upload(filePath, file)

  if (error) {
    throw new Error(`Error uploading file: ${error.message}`)
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("chat-attachments").getPublicUrl(filePath)

  return publicUrl
}

export function createAttachment(file: File, url: string): Attachment {
  return {
    name: file.name,
    contentType: file.type,
    url,
  }
}

export async function processFiles(
  files: File[],
  chatId: string,
  userId: string
): Promise<Attachment[]> {
  const supabase = isSupabaseEnabled ? createClient() : null
  const attachments: Attachment[] = []

  for (const file of files) {
    const validation = await validateFile(file)
    if (!validation.isValid) {
      console.warn(`File ${file.name} validation failed:`, validation.error)
      toast({
        title: "File validation failed",
        description: validation.error,
        status: "error",
      })
      continue
    }

    try {
      const url = supabase
        ? await uploadFile(supabase, file)
        : URL.createObjectURL(file)

      if (supabase) {
        const { error } = await supabase.from("chat_attachments").insert({
          chat_id: chatId,
          user_id: userId,
          file_url: url,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
        })

        if (error) {
          throw new Error(`Database insertion failed: ${error.message}`)
        }
      }

      attachments.push(createAttachment(file, url))
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error)
    }
  }

  return attachments
}

export class FileUploadLimitError extends Error {
  code: string
  constructor(message: string) {
    super(message)
    this.code = "DAILY_FILE_LIMIT_REACHED"
  }
}

export async function checkFileUploadLimit(userId: string) {
  if (!isSupabaseEnabled) return 0

  const supabase = createClient()

  if (!supabase) {
    toast({
      title: "File upload is not supported in this deployment",
      status: "info",
    })
    return 0
  }

  const now = new Date()
  const startOfToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  )

  const { count, error } = await supabase
    .from("chat_attachments")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfToday.toISOString())

  if (error) throw new Error(error.message)
  if (count && count >= DAILY_FILE_UPLOAD_LIMIT) {
    throw new FileUploadLimitError("Daily file upload limit reached.")
  }

  return count
}
