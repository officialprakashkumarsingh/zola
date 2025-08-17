import { tool } from "ai"

export const imageGenerationTool = tool({
  description: "Generate images from text prompts using AI",
  parameters: {
    type: "object",
    properties: {
      prompt: {
        type: "string",
        description: "The text prompt to generate an image from",
      },
      size: {
        type: "string",
        enum: ["256x256", "512x512", "1024x1024", "1792x1024", "1024x1792"],
        description: "The size of the generated image",
        default: "1024x1024",
      },
      n: {
        type: "number",
        minimum: 1,
        maximum: 4,
        description: "Number of images to generate (1-4)",
        default: 1,
      },
      quality: {
        type: "string",
        enum: ["low", "medium", "high"],
        description: "Quality of the generated image",
        default: "medium",
      },
    },
    required: ["prompt"],
  },
  execute: async ({ prompt, size = "1024x1024", n = 1, quality = "medium" }) => {
    try {
      const response = await fetch("https://ahamai-api.officialprakashkrsingh.workers.dev/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ahamaibyprakash25",
        },
        body: JSON.stringify({
          prompt,
          n,
          size,
          quality,
        }),
      })

      if (!response.ok) {
        throw new Error(`Image generation failed: ${response.status} ${response.statusText}`)
      }

      // The API returns image data directly, we need to convert it to a data URL
      const imageBuffer = await response.arrayBuffer()
      const base64Image = Buffer.from(imageBuffer).toString('base64')
      const dataUrl = `data:image/png;base64,${base64Image}`

      return {
        success: true,
        images: [{
          url: dataUrl,
          prompt: prompt,
          size: size,
          quality: quality,
        }],
        metadata: {
          model: "flux",
          prompt: prompt,
          size: size,
          quality: quality,
          count: n,
        }
      }
    } catch (error) {
      console.error("Image generation error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        prompt: prompt,
      }
    }
  },
})