"use client"

import { useTheme } from "next-themes"
import { useState } from "react"

export function ThemeSelection() {
  const { theme, setTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState(theme || "light-default")

  const themes = [
    { id: "system", name: "System", colors: ["#ffffff", "#1a1a1a"], category: "system" },
    
    // Light themes
    { id: "light-default", name: "Classic Light", colors: ["#ffffff", "#f8f9fa"], category: "light" },
    { id: "light-warm", name: "Warm Light", colors: ["#fefcf8", "#f5f1eb"], category: "light" },
    { id: "light-cool", name: "Cool Light", colors: ["#f8fafb", "#f1f5f7"], category: "light" },
    { id: "light-sage", name: "Sage Light", colors: ["#f7f9f7", "#f0f4f0"], category: "light" },
    { id: "light-lavender", name: "Lavender Light", colors: ["#faf9fb", "#f3f2f5"], category: "light" },
    
    // Dark themes
    { id: "dark-default", name: "Classic Dark", colors: ["#1a1a1a", "#0f0f0f"], category: "dark" },
    { id: "dark-slate", name: "Slate Dark", colors: ["#1e293b", "#0f172a"], category: "dark" },
    { id: "dark-forest", name: "Forest Dark", colors: ["#1a2e1a", "#0f1a0f"], category: "dark" },
    { id: "dark-ocean", name: "Ocean Dark", colors: ["#1a252e", "#0f1419"], category: "dark" },
    { id: "dark-purple", name: "Purple Dark", colors: ["#1e1a2e", "#0f0d19"], category: "dark" },
    
    // Unique themed variants
    { id: "theme-cyberpunk", name: "Cyberpunk", colors: ["#1a0d2e", "#ff00ff"], category: "unique" },
    { id: "theme-rose", name: "Rose Garden", colors: ["#fef7f7", "#ff6b9d"], category: "unique" },
    { id: "theme-amber", name: "Amber Glow", colors: ["#fef9f3", "#f59e0b"], category: "unique" },
    { id: "theme-mint", name: "Fresh Mint", colors: ["#f0fdf4", "#10b981"], category: "unique" },
    { id: "theme-coral", name: "Coral Reef", colors: ["#fff5f5", "#ff7875"], category: "unique" },
    { id: "theme-midnight", name: "Midnight Blue", colors: ["#0f1419", "#3b82f6"], category: "unique" },
    { id: "theme-coffee", name: "Coffee Bean", colors: ["#f7f3f0", "#8b4513"], category: "unique" },
    { id: "theme-neon", name: "Neon Glow", colors: ["#0a0a0f", "#00ff41"], category: "unique" },
    { id: "theme-vintage", name: "Vintage Paper", colors: ["#f5f5dc", "#8b7355"], category: "unique" },
    { id: "theme-arctic", name: "Arctic Frost", colors: ["#f8fafc", "#0ea5e9"], category: "unique" },
  ]

  const systemThemes = themes.filter(theme => theme.category === "system")
  const lightThemes = themes.filter(theme => theme.category === "light")
  const darkThemes = themes.filter(theme => theme.category === "dark")
  const uniqueThemes = themes.filter(theme => theme.category === "unique")

  return (
    <div className="max-h-[60vh] overflow-y-auto">
      <h4 className="mb-4 text-sm font-medium">Theme Selection</h4>
      
      {/* System Theme */}
      <div className="mb-6">
        <h5 className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">System</h5>
        <div className="grid grid-cols-1 gap-2">
          {systemThemes.map((themeItem) => (
            <button
              key={themeItem.id}
              type="button"
              onClick={() => {
                setSelectedTheme(themeItem.id)
                setTheme(themeItem.id)
              }}
              className={`rounded-lg border p-3 text-left transition-all hover:shadow-sm ${
                selectedTheme === themeItem.id
                  ? "border-primary ring-primary/30 ring-2 shadow-sm"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="mb-2 flex space-x-1">
                {themeItem.colors.map((color, i) => (
                  <div
                    key={i}
                    className="border-border h-4 w-4 rounded-full border shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-sm font-medium">{themeItem.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Light Themes */}
      <div className="mb-6">
        <h5 className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Light Themes</h5>
        <div className="grid grid-cols-2 gap-2">
          {lightThemes.map((themeItem) => (
            <button
              key={themeItem.id}
              type="button"
              onClick={() => {
                setSelectedTheme(themeItem.id)
                setTheme(themeItem.id)
              }}
              className={`rounded-lg border p-3 text-left transition-all hover:shadow-sm ${
                selectedTheme === themeItem.id
                  ? "border-primary ring-primary/30 ring-2 shadow-sm"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="mb-2 flex space-x-1">
                {themeItem.colors.map((color, i) => (
                  <div
                    key={i}
                    className="border-border h-3 w-3 rounded-full border shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-xs font-medium">{themeItem.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Dark Themes */}
      <div className="mb-6">
        <h5 className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Dark Themes</h5>
        <div className="grid grid-cols-2 gap-2">
          {darkThemes.map((themeItem) => (
            <button
              key={themeItem.id}
              type="button"
              onClick={() => {
                setSelectedTheme(themeItem.id)
                setTheme(themeItem.id)
              }}
              className={`rounded-lg border p-3 text-left transition-all hover:shadow-sm ${
                selectedTheme === themeItem.id
                  ? "border-primary ring-primary/30 ring-2 shadow-sm"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="mb-2 flex space-x-1">
                {themeItem.colors.map((color, i) => (
                  <div
                    key={i}
                    className="border-border h-3 w-3 rounded-full border shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-xs font-medium">{themeItem.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Unique Themed Variants */}
      <div>
        <h5 className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Unique Themes</h5>
        <div className="grid grid-cols-2 gap-2">
          {uniqueThemes.map((themeItem) => (
            <button
              key={themeItem.id}
              type="button"
              onClick={() => {
                setSelectedTheme(themeItem.id)
                setTheme(themeItem.id)
              }}
              className={`rounded-lg border p-3 text-left transition-all hover:shadow-sm ${
                selectedTheme === themeItem.id
                  ? "border-primary ring-primary/30 ring-2 shadow-sm"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="mb-2 flex space-x-1">
                {themeItem.colors.map((color, i) => (
                  <div
                    key={i}
                    className="border-border h-3 w-3 rounded-full border shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-xs font-medium">{themeItem.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
