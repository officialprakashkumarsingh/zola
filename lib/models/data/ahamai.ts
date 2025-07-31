import { openproviders } from "@/lib/openproviders"
import { ModelConfig } from "../types"

// Cache for AhamAI models
let ahamaiModelsCache: ModelConfig[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

// Interface for AhamAI API model response
interface AhamAIModel {
  id: string
  object: string
  created: number
  owned_by: string
}

interface AhamAIModelsResponse {
  object: string
  data: AhamAIModel[]
}

// Static fallback models in case API is unavailable
const ahamaiStaticModels: ModelConfig[] = [
  {
    id: "ahamai:gpt-3.5-turbo",
    name: "GPT-3.5 Turbo (AhamAI)",
    provider: "AhamAI",
    providerId: "ahamai",
    modelFamily: "GPT-3.5",
    baseProviderId: "ahamai",
    description: "Fast and efficient model via AhamAI",
    tags: ["fast", "efficient"],
    contextWindow: 4096,
    vision: false,
    tools: true,
    audio: false,
    openSource: false,
    speed: "Fast",
    intelligence: "Medium",
    website: "https://ahamai-api.officialprakashkrsingh.workers.dev",
    icon: "ahamai",
    apiSdk: (apiKey?: string) =>
      openproviders("ahamai:gpt-3.5-turbo", undefined, apiKey),
  },
]

// Function to fetch models dynamically from AhamAI API
async function fetchAhamAIModels(): Promise<ModelConfig[]> {
  try {
    const response = await fetch(
      "https://ahamai-api.officialprakashkrsingh.workers.dev/v1/models",
      {
        headers: {
          Authorization: `Bearer ahamaibyprakash25`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      console.warn(`AhamAI API responded with status: ${response.status}`)
      return ahamaiStaticModels
    }

    const data: AhamAIModelsResponse = await response.json()

    if (!data.data || !Array.isArray(data.data)) {
      console.warn("Invalid response format from AhamAI API")
      return ahamaiStaticModels
    }

    // Convert API models to ModelConfig format
    const models: ModelConfig[] = data.data.map((model) => ({
      id: `ahamai:${model.id}`, // Prefix with ahamai:
      name: `${model.id.charAt(0).toUpperCase() + model.id.slice(1).replace(/-/g, " ")} (AhamAI)`,
      provider: "AhamAI",
      providerId: "ahamai",
      modelFamily: model.id.includes("gpt") ? "GPT" : "Unknown",
      baseProviderId: "ahamai",
      description: `${model.id} model via AhamAI`,
      tags: ["ahamai"],
      contextWindow: 4096, // Default value
      vision: model.id.includes("vision") || model.id.includes("4o"),
      tools: true,
      audio: false,
      openSource: false,
      speed: "Medium" as const,
      intelligence: "Medium" as const,
      website: "https://ahamai-api.officialprakashkrsingh.workers.dev",
      icon: "ahamai",
      apiSdk: (apiKey?: string) =>
        openproviders(`ahamai:${model.id}`, undefined, apiKey),
    }))

    return models.length > 0 ? models : ahamaiStaticModels
  } catch (error) {
    console.warn("Failed to fetch AhamAI models:", error)
    return ahamaiStaticModels
  }
}

// Function to get AhamAI models with caching
export async function getAhamAIModels(): Promise<ModelConfig[]> {
  const now = Date.now()

  // Use cache if it's still valid
  if (ahamaiModelsCache && now - lastFetchTime < CACHE_DURATION) {
    return ahamaiModelsCache
  }

  try {
    const models = await fetchAhamAIModels()
    ahamaiModelsCache = models
    lastFetchTime = now
    return models
  } catch (error) {
    console.warn("Failed to load AhamAI models, using cache or static models:", error)
    return ahamaiModelsCache || ahamaiStaticModels
  }
}

// Export static models for immediate use
export const ahamaiModels: ModelConfig[] = ahamaiStaticModels