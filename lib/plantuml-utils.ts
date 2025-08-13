// Detect if text contains PlantUML code
export function containsPlantUML(text: string): boolean {
  const plantUMLPattern = /@start(uml|class|activity|sequence|usecase|component|state|object|deployment|timing|network|yaml|json|wire|archimate|gantt|mindmap|wbs|salt|math|latex|ditaa|jcckit|flow|board|bpm|nwdiag|rackdiag|packetdiag|blockdiag|actdiag|seqdiag|erd|ie|tree)[\s\S]*?@end(uml|class|activity|sequence|usecase|component|state|object|deployment|timing|network|yaml|json|wire|archimate|gantt|mindmap|wbs|salt|math|latex|ditaa|jcckit|flow|board|bpm|nwdiag|rackdiag|packetdiag|blockdiag|actdiag|seqdiag|erd|ie|tree)/gi
  return plantUMLPattern.test(text)
}

// Extract PlantUML code blocks from text
export function extractPlantUMLBlocks(text: string): Array<{ code: string; type: string; startIndex: number; endIndex: number }> {
  const blocks: Array<{ code: string; type: string; startIndex: number; endIndex: number }> = []
  const plantUMLPattern = /@start(uml|class|activity|sequence|usecase|component|state|object|deployment|timing|network|yaml|json|wire|archimate|gantt|mindmap|wbs|salt|math|latex|ditaa|jcckit|flow|board|bpm|nwdiag|rackdiag|packetdiag|blockdiag|actdiag|seqdiag|erd|ie|tree)([\s\S]*?)@end\1/gi
  
  let match
  while ((match = plantUMLPattern.exec(text)) !== null) {
    blocks.push({
      code: match[0],
      type: match[1],
      startIndex: match.index,
      endIndex: match.index + match[0].length
    })
  }
  
  return blocks
}

// Validate PlantUML syntax
export function validatePlantUMLSyntax(code: string): { isValid: boolean; error?: string } {
  // Basic validation checks
  const trimmedCode = code.trim()
  
  if (!trimmedCode) {
    return { isValid: false, error: "PlantUML code cannot be empty" }
  }
  
  // Check for start and end tags
  const startMatch = trimmedCode.match(/@start(uml|class|activity|sequence|usecase|component|state|object|deployment|timing|network|yaml|json|wire|archimate|gantt|mindmap|wbs|salt|math|latex|ditaa|jcckit|flow|board|bpm|nwdiag|rackdiag|packetdiag|blockdiag|actdiag|seqdiag|erd|ie|tree)/i)
  const endMatch = trimmedCode.match(/@end(uml|class|activity|sequence|usecase|component|state|object|deployment|timing|network|yaml|json|wire|archimate|gantt|mindmap|wbs|salt|math|latex|ditaa|jcckit|flow|board|bpm|nwdiag|rackdiag|packetdiag|blockdiag|actdiag|seqdiag|erd|ie|tree)/i)
  
  if (!startMatch) {
    return { isValid: false, error: "PlantUML code must start with @startuml, @startclass, @startactivity, etc." }
  }
  
  if (!endMatch) {
    return { isValid: false, error: "PlantUML code must end with @enduml, @endclass, @endactivity, etc." }
  }
  
  if (startMatch[1] !== endMatch[1]) {
    return { isValid: false, error: `Start tag @start${startMatch[1]} does not match end tag @end${endMatch[1]}` }
  }
  
  return { isValid: true }
}

// Generate sample PlantUML code for different diagram types
export function generateSamplePlantUML(type: string): string {
  const samples: Record<string, string> = {
    'class': `@startuml
class User {
  +id: number
  +name: string
  +email: string
  --
  +login()
  +logout()
}

class Order {
  +id: number
  +userId: number
  +total: number
  +status: string
  --
  +calculate()
  +pay()
}

User ||--o{ Order : places
@enduml`,

    'sequence': `@startuml
actor User
participant Frontend
participant Backend
database Database

User -> Frontend: Login request
activate Frontend

Frontend -> Backend: Authenticate
activate Backend

Backend -> Database: Check credentials
activate Database
Database --> Backend: User data
deactivate Database

Backend --> Frontend: Auth token
deactivate Backend

Frontend --> User: Welcome page
deactivate Frontend
@enduml`,

    'activity': `@startuml
start

:User opens app;
:Enter credentials;

if (Valid credentials?) then (yes)
  :Generate auth token;
  :Redirect to dashboard;
else (no)
  :Show error message;
  :Return to login;
endif

stop
@enduml`,

    'usecase': `@startuml
left to right direction
skinparam packageStyle rectangle

actor User
actor Admin

rectangle "E-commerce System" {
  User --> (Browse Products)
  User --> (Add to Cart)
  User --> (Checkout)
  User --> (Track Order)
  
  Admin --> (Manage Products)
  Admin --> (Process Orders)
  Admin --> (View Analytics)
  
  (Manage Products) .> (Browse Products) : includes
  (Process Orders) .> (Track Order) : includes
}
@enduml`,

    'component': `@startuml
package "Frontend" {
  [React App] as app
  [Redux Store] as store
  [React Router] as router
}

package "Backend" {
  [API Gateway] as gateway
  [Auth Service] as auth
  [User Service] as user
  [Order Service] as order
}

database "Database" {
  [Users] as userdb
  [Orders] as orderdb
}

app --> gateway : HTTP/REST
store --> app : State Management
router --> app : Navigation

gateway --> auth : Authentication
gateway --> user : User Operations
gateway --> order : Order Operations

auth --> userdb : User Data
user --> userdb : User CRUD
order --> orderdb : Order CRUD
@enduml`,

    'state': `@startuml
[*] --> Idle

Idle --> Processing : start
Processing --> Idle : cancel
Processing --> Success : complete
Processing --> Failed : error

Success --> [*]
Failed --> Idle : retry
Failed --> [*] : abandon

state Processing {
  [*] --> Validating
  Validating --> Executing : valid
  Validating --> [*] : invalid
  Executing --> [*] : done
}
@enduml`
  }

  return samples[type] || samples['class']
}

// Get diagram type from PlantUML code
export function getDiagramType(code: string): string {
  const match = code.match(/@start(uml|class|activity|sequence|usecase|component|state|object|deployment|timing|network|yaml|json|wire|archimate|gantt|mindmap|wbs|salt|math|latex|ditaa|jcckit|flow|board|bpm|nwdiag|rackdiag|packetdiag|blockdiag|actdiag|seqdiag|erd|ie|tree)/i)
  return match ? match[1].toLowerCase() : 'uml'
}

// Format diagram type for display
export function formatDiagramType(type: string): string {
  const typeMap: Record<string, string> = {
    'uml': 'UML Diagram',
    'class': 'Class Diagram',
    'activity': 'Activity Diagram',
    'sequence': 'Sequence Diagram',
    'usecase': 'Use Case Diagram',
    'component': 'Component Diagram',
    'state': 'State Diagram',
    'object': 'Object Diagram',
    'deployment': 'Deployment Diagram',
    'timing': 'Timing Diagram',
    'network': 'Network Diagram',
    'gantt': 'Gantt Chart',
    'mindmap': 'Mind Map',
    'wbs': 'Work Breakdown Structure',
    'flow': 'Flow Chart'
  }
  
  return typeMap[type] || 'Diagram'
}