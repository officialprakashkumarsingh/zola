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
  const mimeType = file.type.toLowerCase()

  // Map common extensions and MIME types
  const typeMap: Record<string, string> = {
    // Text files
    'txt': 'text',
    'md': 'markdown',
    'markdown': 'markdown',
    'json': 'json',
    'xml': 'xml',
    'csv': 'csv',
    'tsv': 'tsv',
    'log': 'log',
    'ini': 'config',
    'conf': 'config',
    'config': 'config',
    'env': 'env',
    'yml': 'yaml',
    'yaml': 'yaml',
    'toml': 'toml',
    
    // Code files
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'h': 'c',
    'hpp': 'cpp',
    'cs': 'csharp',
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'swift': 'swift',
    'kt': 'kotlin',
    'scala': 'scala',
    'r': 'r',
    'sql': 'sql',
    'sh': 'shell',
    'bash': 'shell',
    'zsh': 'shell',
    'ps1': 'powershell',
    
    // Web files
    'html': 'html',
    'htm': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'less': 'less',
    
    // Data files
    'pdf': 'pdf',
    'zip': 'zip',
    'tar': 'archive',
    'gz': 'archive',
    'rar': 'archive',
    '7z': 'archive',
    
    // Document files
    'doc': 'document',
    'docx': 'document',
    'rtf': 'document',
    'odt': 'document',
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

// Extract text content from files
export async function extractFileContent(file: File): Promise<FileExtractionResult> {
  try {
    const fileType = getFileType(file)
    
    // Handle different file types
    switch (fileType) {
      case 'pdf':
        return await extractPDFContent(file)
      
      case 'zip':
        return await extractZipContent(file)
      
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
        return await extractTextContent(file, fileType)
      
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

// Extract content from text-based files
async function extractTextContent(file: File, fileType: string): Promise<FileExtractionResult> {
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

// Extract content from PDF files (basic implementation)
async function extractPDFContent(file: File): Promise<FileExtractionResult> {
  try {
    // Note: This is a basic implementation. For production, you'd want to use a proper PDF parser
    // like pdf-parse or PDF.js for better text extraction
    
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // Basic PDF text extraction (very limited)
    let text = ''
    const decoder = new TextDecoder('utf-8', { fatal: false })
    
    // Try to extract readable text from PDF
    for (let i = 0; i < uint8Array.length - 10; i++) {
      const chunk = uint8Array.slice(i, i + 100)
      const decoded = decoder.decode(chunk)
      
      // Look for text patterns in PDF
      const textMatch = decoded.match(/[a-zA-Z0-9\s.,!?;:'"()-]{10,}/g)
      if (textMatch) {
        text += textMatch.join(' ') + ' '
      }
    }
    
    // Clean up extracted text
    text = text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?;:'"()-]/g, '')
      .trim()
    
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
        content: text,
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

// Extract content from ZIP files
async function extractZipContent(file: File): Promise<FileExtractionResult> {
  try {
    // Note: This is a basic implementation. For production, you'd want to use a proper ZIP library
    // like JSZip for better ZIP file handling
    
    const arrayBuffer = await file.arrayBuffer()
    
    // Basic ZIP inspection - this is very limited
    // In a real implementation, you'd use JSZip or similar library
    
    const uint8Array = new Uint8Array(arrayBuffer)
    const decoder = new TextDecoder('utf-8', { fatal: false })
    
    let extractedFiles: string[] = []
    let totalContent = ''
    
    // Very basic ZIP file listing (this won't work for all ZIP files)
    for (let i = 0; i < uint8Array.length - 30; i++) {
      // Look for ZIP file header signatures
      if (uint8Array[i] === 0x50 && uint8Array[i + 1] === 0x4B) {
        const chunk = uint8Array.slice(i, i + 1000)
        const decoded = decoder.decode(chunk)
        
        // Try to extract filenames and readable content
        const matches = decoded.match(/[\w.-]+\.(txt|md|json|html|css|js|py|java|cpp|cs)/g)
        if (matches) {
          extractedFiles.push(...matches)
        }
      }
    }
    
    if (extractedFiles.length === 0) {
      return {
        success: false,
        error: 'Could not extract file list from ZIP archive. Please extract files manually and upload them individually.'
      }
    }
    
    totalContent = `ZIP Archive Contents:\n\nDetected files:\n${extractedFiles.map(f => `- ${f}`).join('\n')}\n\nNote: This is a basic ZIP file analysis. For full content extraction, please extract the files manually and upload them individually.`
    
    return {
      success: true,
      content: {
        fileName: file.name,
        fileType: 'zip',
        content: totalContent,
        originalSize: file.size,
        extractedSize: totalContent.length
      }
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to extract ZIP content: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Format extracted content for AI consumption
export function formatContentForAI(extractedContent: ExtractedFileContent): string {
  const header = `File: ${extractedContent.fileName} (${extractedContent.fileType})\n`
  const metadata = `Size: ${extractedContent.originalSize} bytes\n`
  const separator = '---\n'
  
  return `${header}${metadata}${separator}${extractedContent.content}`
}

// Batch process multiple files
export async function extractMultipleFiles(files: File[]): Promise<{
  successful: ExtractedFileContent[]
  failed: Array<{ fileName: string; error: string }>
}> {
  const successful: ExtractedFileContent[] = []
  const failed: Array<{ fileName: string; error: string }> = []
  
  for (const file of files) {
    if (!isSupportedFileType(file)) {
      failed.push({
        fileName: file.name,
        error: `File type not supported for content extraction`
      })
      continue
    }
    
    const result = await extractFileContent(file)
    
    if (result.success && result.content) {
      successful.push(result.content)
    } else {
      failed.push({
        fileName: file.name,
        error: result.error || 'Unknown error'
      })
    }
  }
  
  return { successful, failed }
}