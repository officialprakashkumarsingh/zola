// Detect if text contains Mermaid code
export function containsMermaid(text: string): boolean {
  const mermaidKeywords = [
    'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram',
    'erDiagram', 'journey', 'gantt', 'pie', 'gitgraph', 'mindmap', 'timeline',
    'sankey', 'xyChart', 'block-beta'
  ]
  
  // Check if text starts with any Mermaid diagram type
  const trimmedText = text.trim()
  return mermaidKeywords.some(keyword => 
    trimmedText.startsWith(keyword) || 
    trimmedText.includes(`\n${keyword}`) ||
    new RegExp(`^\\s*${keyword}`, 'm').test(trimmedText)
  )
}

// Extract Mermaid code blocks from text
export function extractMermaidBlocks(text: string): Array<{ code: string; type: string; startIndex: number; endIndex: number }> {
  const blocks: Array<{ code: string; type: string; startIndex: number; endIndex: number }> = []
  
  // Split by code blocks and paragraphs to find Mermaid content
  const lines = text.split('\n')
  let currentBlock = ''
  let blockStart = -1
  let blockType = ''
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (containsMermaid(line) && blockStart === -1) {
      // Start of a new Mermaid block
      blockStart = i
      currentBlock = line
      blockType = getMermaidType(line)
    } else if (blockStart !== -1) {
      // Continue building the block
      currentBlock += '\n' + lines[i]
      
      // Check if this could be the end of the block
      if (line === '' || i === lines.length - 1 || 
          (i + 1 < lines.length && containsMermaid(lines[i + 1].trim()))) {
        
        // Validate if we have a complete Mermaid diagram
        if (isValidMermaidBlock(currentBlock)) {
          blocks.push({
            code: currentBlock.trim(),
            type: blockType,
            startIndex: blockStart,
            endIndex: i
          })
        }
        
        // Reset for next block
        currentBlock = ''
        blockStart = -1
        blockType = ''
      }
    }
  }
  
  return blocks
}

// Get the type of Mermaid diagram
export function getMermaidType(code: string): string {
  const trimmedCode = code.trim().toLowerCase()
  
  if (trimmedCode.startsWith('graph')) return 'graph'
  if (trimmedCode.startsWith('flowchart')) return 'flowchart'
  if (trimmedCode.startsWith('sequencediagram')) return 'sequence'
  if (trimmedCode.startsWith('classdiagram')) return 'class'
  if (trimmedCode.startsWith('statediagram')) return 'state'
  if (trimmedCode.startsWith('erdiagram')) return 'er'
  if (trimmedCode.startsWith('journey')) return 'journey'
  if (trimmedCode.startsWith('gantt')) return 'gantt'
  if (trimmedCode.startsWith('pie')) return 'pie'
  if (trimmedCode.startsWith('gitgraph')) return 'gitgraph'
  if (trimmedCode.startsWith('mindmap')) return 'mindmap'
  if (trimmedCode.startsWith('timeline')) return 'timeline'
  if (trimmedCode.startsWith('sankey')) return 'sankey'
  if (trimmedCode.startsWith('xychart')) return 'chart'
  if (trimmedCode.startsWith('block-beta')) return 'block'
  
  return 'unknown'
}

// Format diagram type for display
export function formatMermaidType(type: string): string {
  const typeMap: Record<string, string> = {
    'graph': 'Graph Diagram',
    'flowchart': 'Flowchart',
    'sequence': 'Sequence Diagram',
    'class': 'Class Diagram',
    'state': 'State Diagram',
    'er': 'Entity Relationship Diagram',
    'journey': 'User Journey',
    'gantt': 'Gantt Chart',
    'pie': 'Pie Chart',
    'gitgraph': 'Git Graph',
    'mindmap': 'Mind Map',
    'timeline': 'Timeline',
    'sankey': 'Sankey Diagram',
    'chart': 'XY Chart',
    'block': 'Block Diagram',
    'unknown': 'Diagram'
  }
  
  return typeMap[type] || 'Mermaid Diagram'
}

// Basic validation for Mermaid blocks
function isValidMermaidBlock(code: string): boolean {
  const trimmedCode = code.trim()
  
  // Must have some content
  if (trimmedCode.length < 10) return false
  
  // Must start with a Mermaid keyword
  if (!containsMermaid(trimmedCode)) return false
  
  // Must have at least some diagram content (not just the keyword)
  const lines = trimmedCode.split('\n').filter(line => line.trim().length > 0)
  return lines.length >= 2
}

// Generate sample Mermaid code for different diagram types
export function generateSampleMermaid(type: string): string {
  const samples: Record<string, string> = {
    'flowchart': `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`,
    
    'sequence': `sequenceDiagram
    participant User
    participant App
    participant Server
    
    User->>App: Login Request
    App->>Server: Authenticate
    Server-->>App: Auth Token
    App-->>User: Login Success`,
    
    'class': `classDiagram
    class User {
        +String name
        +String email
        +login()
        +logout()
    }
    
    class Admin {
        +String permissions
        +manageUsers()
    }
    
    User <|-- Admin`,
    
    'gantt': `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Design
    Wireframes    :a1, 2024-01-01, 30d
    Mockups       :a2, after a1, 20d
    section Development
    Frontend      :b1, 2024-02-01, 45d
    Backend       :b2, 2024-02-15, 45d`,
    
    'pie': `pie title Favorite Colors
    "Red" : 35
    "Blue" : 25
    "Green" : 20
    "Yellow" : 15
    "Other" : 5`
  }
  
  return samples[type] || samples['flowchart']
}