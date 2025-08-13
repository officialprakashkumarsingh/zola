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
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // Improved ZIP parser with proper central directory reading
    const files = parseZipFile(uint8Array)
    
    if (files.length === 0) {
      return {
        success: false,
        error: 'Could not read ZIP file structure. The file might be corrupted or use an unsupported compression method.'
      }
    }
    
    let totalContent = `ZIP Archive: ${file.name}\n`
    totalContent += `Total files: ${files.length}\n\n`
    
    const textFiles: string[] = []
    const otherFiles: string[] = []
    
    // Categorize files and extract text content where possible
    for (const zipFile of files) {
      if (isTextFile(zipFile.name)) {
        textFiles.push(zipFile.name)
        // Try to extract content for small text files
        if (zipFile.uncompressedSize < 50000) { // Limit to 50KB for performance
          try {
            const content = extractFileFromZip(uint8Array, zipFile)
            if (content && content.length > 0) {
              totalContent += `\n--- File: ${zipFile.name} ---\n`
              totalContent += content.substring(0, 2000) // Limit content length
              if (content.length > 2000) {
                totalContent += `\n... (truncated, ${content.length} total characters)`
              }
              totalContent += '\n'
            }
          } catch (e) {
            // Skip files that can't be extracted
          }
        }
      } else {
        otherFiles.push(zipFile.name)
      }
    }
    
    // Add file listing
    if (textFiles.length > 0) {
      totalContent += `\nText files found:\n${textFiles.map(f => `  - ${f}`).join('\n')}\n`
    }
    
    if (otherFiles.length > 0) {
      totalContent += `\nOther files:\n${otherFiles.map(f => `  - ${f}`).join('\n')}\n`
    }
    
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

// Helper function to parse ZIP file structure
function parseZipFile(data: Uint8Array): Array<{name: string, offset: number, compressedSize: number, uncompressedSize: number, method: number}> {
  const files: Array<{name: string, offset: number, compressedSize: number, uncompressedSize: number, method: number}> = []
  
  try {
    // Find End of Central Directory Record
    let eocdOffset = -1
    for (let i = data.length - 22; i >= 0; i--) {
      if (data[i] === 0x50 && data[i + 1] === 0x4B && 
          data[i + 2] === 0x05 && data[i + 3] === 0x06) {
        eocdOffset = i
        break
      }
    }
    
    if (eocdOffset === -1) return files
    
    // Read central directory info
    const centralDirSize = readUint32LE(data, eocdOffset + 12)
    const centralDirOffset = readUint32LE(data, eocdOffset + 16)
    
    // Parse central directory entries
    let offset = centralDirOffset
    while (offset < centralDirOffset + centralDirSize) {
      if (data[offset] !== 0x50 || data[offset + 1] !== 0x4B ||
          data[offset + 2] !== 0x01 || data[offset + 3] !== 0x02) {
        break
      }
      
      const compressedSize = readUint32LE(data, offset + 20)
      const uncompressedSize = readUint32LE(data, offset + 24)
      const nameLength = readUint16LE(data, offset + 28)
      const extraLength = readUint16LE(data, offset + 30)
      const commentLength = readUint16LE(data, offset + 32)
      const localHeaderOffset = readUint32LE(data, offset + 42)
      const compressionMethod = readUint16LE(data, offset + 10)
      
      // Extract filename
      const nameBytes = data.slice(offset + 46, offset + 46 + nameLength)
      const name = new TextDecoder('utf-8', { fatal: false }).decode(nameBytes)
      
      if (name && !name.endsWith('/')) { // Skip directories
        files.push({
          name,
          offset: localHeaderOffset,
          compressedSize,
          uncompressedSize,
          method: compressionMethod
        })
      }
      
      offset += 46 + nameLength + extraLength + commentLength
    }
  } catch (e) {
    // Return whatever files we managed to parse
  }
  
  return files
}

// Helper function to check if a file is likely text-based
function isTextFile(filename: string): boolean {
  const textExtensions = [
    '.txt', '.md', '.json', '.xml', '.html', '.htm', '.css', '.js', '.ts', 
    '.jsx', '.tsx', '.py', '.java', '.c', '.cpp', '.h', '.hpp', '.cs', 
    '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala', '.r', '.sql',
    '.yml', '.yaml', '.toml', '.ini', '.conf', '.config', '.env', '.log',
    '.sh', '.bash', '.zsh', '.ps1', '.bat', '.cmd'
  ]
  
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'))
  return textExtensions.includes(ext)
}

// Helper function to extract a specific file from ZIP
function extractFileFromZip(data: Uint8Array, file: {name: string, offset: number, compressedSize: number, uncompressedSize: number, method: number}): string | null {
  try {
    // Read local file header
    const localOffset = file.offset
    if (data[localOffset] !== 0x50 || data[localOffset + 1] !== 0x4B ||
        data[localOffset + 2] !== 0x03 || data[localOffset + 3] !== 0x04) {
      return null
    }
    
    const nameLength = readUint16LE(data, localOffset + 26)
    const extraLength = readUint16LE(data, localOffset + 28)
    const dataOffset = localOffset + 30 + nameLength + extraLength
    
    // Only handle uncompressed files (method 0) for simplicity
    if (file.method === 0) {
      const fileData = data.slice(dataOffset, dataOffset + file.uncompressedSize)
      return new TextDecoder('utf-8', { fatal: false }).decode(fileData)
    }
    
    return null
  } catch (e) {
    return null
  }
}

// Helper functions to read integers from byte arrays
function readUint16LE(data: Uint8Array, offset: number): number {
  return data[offset] | (data[offset + 1] << 8)
}

function readUint32LE(data: Uint8Array, offset: number): number {
  return data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16) | (data[offset + 3] << 24)
}

// Format extracted content for AI consumption
export function formatContentForAI(extractedContent: ExtractedFileContent): string {
  const header = `File: ${extractedContent.fileName} (${extractedContent.fileType})\n`
  const metadata = `Size: ${extractedContent.originalSize} bytes\n`
  const separator = '---\n'
  
  return `${header}${metadata}${separator}${extractedContent.content}`
}

// Batch process multiple files (parallel processing for speed)
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
        type: 'failed' as const,
        fileName: file.name,
        error: `File type not supported for content extraction`
      }
    }
    
    try {
      const result = await extractFileContent(file)
      
      if (result.success && result.content) {
        return {
          type: 'success' as const,
          content: result.content
        }
      } else {
        return {
          type: 'failed' as const,
          fileName: file.name,
          error: result.error || 'Unknown error'
        }
      }
    } catch (error) {
      return {
        type: 'failed' as const,
        fileName: file.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })
  
  // Wait for all extractions to complete
  const results = await Promise.all(promises)
  
  // Categorize results
  for (const result of results) {
    if (result.type === 'success') {
      successful.push(result.content)
    } else {
      failed.push({
        fileName: result.fileName,
        error: result.error
      })
    }
  }
  
  return { successful, failed }
}