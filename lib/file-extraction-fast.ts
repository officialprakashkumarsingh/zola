import { toast } from "@/components/ui/toast"

export type ExtractedFileContent = {
  fileName: string
  fileType: string
  content: string
  originalSize: number
  extractedSize: number
}

export type FileExtractionResult = {
  success: boolean
  content?: ExtractedFileContent
  error?: string
}

// Enhanced file type detection
export function getFileType(file: File): string {
  const extension = file.name.toLowerCase().split('.').pop() || ''
  
  const typeMap: Record<string, string> = {
    // Text files
    'txt': 'text', 'md': 'markdown', 'markdown': 'markdown', 'json': 'json',
    'xml': 'xml', 'csv': 'csv', 'tsv': 'tsv', 'log': 'log',
    'ini': 'config', 'conf': 'config', 'config': 'config', 'env': 'env',
    'yml': 'yaml', 'yaml': 'yaml', 'toml': 'toml',
    
    // Code files
    'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
    'py': 'python', 'java': 'java', 'c': 'c', 'cpp': 'cpp', 'h': 'c', 'hpp': 'cpp',
    'cs': 'csharp', 'php': 'php', 'rb': 'ruby', 'go': 'go', 'rs': 'rust',
    'swift': 'swift', 'kt': 'kotlin', 'scala': 'scala', 'r': 'r', 'sql': 'sql',
    'sh': 'shell', 'bash': 'shell', 'zsh': 'shell', 'ps1': 'powershell',
    
    // Web files
    'html': 'html', 'htm': 'html', 'css': 'css', 'scss': 'scss', 'sass': 'sass', 'less': 'less',
    
    // Data files
    'pdf': 'pdf', 'zip': 'zip', 'tar': 'archive', 'gz': 'archive', 'rar': 'archive', '7z': 'archive',
    
    // Document files
    'doc': 'document', 'docx': 'document', 'rtf': 'document', 'odt': 'document',
  }

  return typeMap[extension] || 'unknown'
}

// Check if file type is supported for extraction
export function isSupportedFileType(file: File): boolean {
  const fileType = getFileType(file)
  const supportedTypes = [
    'text', 'markdown', 'json', 'xml', 'csv', 'tsv', 'log', 'config', 'env', 'yaml', 'toml',
    'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp', 'php', 'ruby', 'go', 
    'rust', 'swift', 'kotlin', 'scala', 'r', 'sql', 'shell', 'powershell',
    'html', 'css', 'scss', 'sass', 'less',
    'pdf', 'zip'
  ]
  
  return supportedTypes.includes(fileType) || file.size < 5 * 1024 * 1024 // 5MB limit for text files
}

// Fast text extraction for text-based files
async function extractTextContentFast(file: File, fileType: string): Promise<FileExtractionResult> {
  try {
    const text = await file.text()
    
    return {
      success: true,
      content: {
        fileName: file.name,
        fileType,
        content: text,
        originalSize: file.size,
        extractedSize: text.length
      }
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to read text content: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Improved PDF extraction using simple text pattern matching
async function extractPDFContentFast(file: File): Promise<FileExtractionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // Convert to string for pattern matching
    let text = ''
    const decoder = new TextDecoder('utf-8', { fatal: false })
    
    // Process in chunks for better performance
    const chunkSize = 1000
    const textChunks: string[] = []
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.slice(i, i + chunkSize)
      const decoded = decoder.decode(chunk)
      
      // Extract readable text patterns
      const matches = decoded.match(/[a-zA-Z0-9\s.,!?;:'"()\-]{15,}/g)
      if (matches) {
        textChunks.push(...matches)
      }
      
      // Break early if we have enough content
      if (textChunks.length > 100) break
    }
    
    text = textChunks.join(' ').replace(/\s+/g, ' ').trim()
    
    if (text.length < 50) {
      return {
        success: false,
        error: 'Could not extract readable text from PDF. The PDF might be image-based or encrypted.'
      }
    }
    
    return {
      success: true,
      content: {
        fileName: file.name,
        fileType: 'pdf',
        content: text.slice(0, 10000), // Limit to 10KB of text
        originalSize: file.size,
        extractedSize: text.length
      }
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to extract PDF content: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Improved ZIP file extraction using manual ZIP parsing
async function extractZipContentFast(file: File): Promise<FileExtractionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const view = new DataView(arrayBuffer)
    
    // Look for ZIP file signatures and central directory
    const zipFiles: string[] = []
    let extractedContent = ''
    
    // Simple ZIP parsing - look for file entries
    for (let i = 0; i < arrayBuffer.byteLength - 30; i++) {
      // Local file header signature: 0x04034b50
      if (view.getUint32(i, true) === 0x04034b50) {
        try {
          const filenameLength = view.getUint16(i + 26, true)
          const extraFieldLength = view.getUint16(i + 28, true)
          
          if (i + 30 + filenameLength < arrayBuffer.byteLength) {
            const filenameBytes = new Uint8Array(arrayBuffer, i + 30, filenameLength)
            const filename = new TextDecoder().decode(filenameBytes)
            
            if (filename && !filename.includes('\0') && filename.length < 256) {
              zipFiles.push(filename)
              
              // Try to extract content for text files
              if (filename.match(/\.(txt|md|json|js|py|html|css|xml)$/i)) {
                const dataOffset = i + 30 + filenameLength + extraFieldLength
                const compressedSize = view.getUint32(i + 18, true)
                
                if (dataOffset + Math.min(compressedSize, 1000) < arrayBuffer.byteLength) {
                  const contentBytes = new Uint8Array(arrayBuffer, dataOffset, Math.min(compressedSize, 1000))
                  const content = new TextDecoder('utf-8', { fatal: false }).decode(contentBytes)
                  
                  if (content && content.length > 10) {
                    extractedContent += `\n\n=== ${filename} ===\n${content.slice(0, 500)}`
                  }
                }
              }
            }
          }
        } catch (e) {
          // Skip this entry if parsing fails
          continue
        }
      }
    }
    
    if (zipFiles.length === 0) {
      return {
        success: false,
        error: 'Could not read ZIP file structure. The file might be corrupted or use an unsupported compression method.'
      }
    }
    
    const summary = `ZIP Archive: ${file.name}\n\nFiles found (${zipFiles.length}):\n${zipFiles.slice(0, 20).map(f => `• ${f}`).join('\n')}${zipFiles.length > 20 ? `\n... and ${zipFiles.length - 20} more files` : ''}`
    
    const finalContent = extractedContent 
      ? `${summary}\n\n=== File Contents Preview ===${extractedContent}`
      : summary
    
    return {
      success: true,
      content: {
        fileName: file.name,
        fileType: 'zip',
        content: finalContent,
        originalSize: file.size,
        extractedSize: finalContent.length
      }
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to extract ZIP content: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Main extraction function with optimized performance
export async function extractFileContent(file: File): Promise<FileExtractionResult> {
  const fileType = getFileType(file)
  
  try {
    switch (fileType) {
      case 'pdf':
        return await extractPDFContentFast(file)
      
      case 'zip':
        return await extractZipContentFast(file)
      
      case 'text':
      case 'markdown':
      case 'json':
      case 'xml':
      case 'csv':
      case 'tsv':
      case 'log':
      case 'config':
      case 'env':
      case 'yaml':
      case 'toml':
      case 'javascript':
      case 'typescript':
      case 'python':
      case 'java':
      case 'c':
      case 'cpp':
      case 'csharp':
      case 'php':
      case 'ruby':
      case 'go':
      case 'rust':
      case 'swift':
      case 'kotlin':
      case 'scala':
      case 'r':
      case 'sql':
      case 'shell':
      case 'powershell':
      case 'html':
      case 'css':
      case 'scss':
      case 'sass':
      case 'less':
        return await extractTextContentFast(file, fileType)
      
      default:
        return {
          success: false,
          error: `File type '${fileType}' is not supported for content extraction`
        }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Format extracted content for AI consumption
export function formatContentForAI(extractedContent: ExtractedFileContent): string {
  const header = `📁 ${extractedContent.fileName} (${extractedContent.fileType.toUpperCase()})\n`
  const metadata = `📊 Size: ${Math.round(extractedContent.originalSize / 1024)}KB\n`
  const separator = '─'.repeat(50) + '\n'
  
  return `${header}${metadata}${separator}${extractedContent.content}`
}

// Optimized batch processing with parallel execution
export async function extractMultipleFiles(files: File[]): Promise<{
  successful: ExtractedFileContent[]
  failed: Array<{ fileName: string; error: string }>
}> {
  const successful: ExtractedFileContent[] = []
  const failed: Array<{ fileName: string; error: string }> = []
  
  // Process files in parallel for better performance
  const promises = files.map(async (file) => {
    if (!isSupportedFileType(file)) {
      return {
        success: false,
        fileName: file.name,
        error: 'File type not supported for content extraction'
      }
    }
    
    const result = await extractFileContent(file)
    return {
      success: result.success,
      fileName: file.name,
      content: result.content,
      error: result.error
    }
  })
  
  const results = await Promise.all(promises)
  
  results.forEach(result => {
    if (result.success && result.content) {
      successful.push(result.content)
    } else {
      failed.push({
        fileName: result.fileName,
        error: result.error || 'Unknown error'
      })
    }
  })
  
  return { successful, failed }
}