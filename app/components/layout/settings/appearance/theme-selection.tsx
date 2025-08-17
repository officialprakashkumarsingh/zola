"use client"

import { useTheme } from "next-themes"
import { useState } from "react"

export function ThemeSelection() {
  const { theme, setTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState(theme || "light-default")

  const themes = [
    { id: "system", name: "System", colors: ["#ffffff", "#1a1a1a"], category: "system" },
    
    // Light themes (15 total)
    { id: "light-default", name: "Classic Light", colors: ["#ffffff", "#f8f9fa"], category: "light" },
    { id: "light-warm", name: "Warm Light", colors: ["#fefcf8", "#f5f1eb"], category: "light" },
    { id: "light-cool", name: "Cool Light", colors: ["#f8fafb", "#f1f5f7"], category: "light" },
    { id: "light-sage", name: "Sage Light", colors: ["#f7f9f7", "#f0f4f0"], category: "light" },
    { id: "light-lavender", name: "Lavender Light", colors: ["#faf9fb", "#f3f2f5"], category: "light" },
    { id: "light-cream", name: "Cream", colors: ["#fefdf9", "#f7f5f0"], category: "light" },
    { id: "light-pearl", name: "Pearl", colors: ["#fafafa", "#f0f0f0"], category: "light" },
    { id: "light-snow", name: "Snow", colors: ["#fffffe", "#f8f8f8"], category: "light" },
    { id: "light-ivory", name: "Ivory", colors: ["#fffff0", "#f5f5dc"], category: "light" },
    { id: "light-linen", name: "Linen", colors: ["#faf0e6", "#f0e6d2"], category: "light" },
    { id: "light-vanilla", name: "Vanilla", colors: ["#f3e5ab", "#ede0a3"], category: "light" },
    { id: "light-paper", name: "Paper", colors: ["#fdfdfd", "#f4f4f4"], category: "light" },
    { id: "light-ash", name: "Ash", colors: ["#f7f7f7", "#eeeeee"], category: "light" },
    { id: "light-mist", name: "Mist", colors: ["#f9f9f9", "#f1f1f1"], category: "light" },
    { id: "light-bone", name: "Bone", colors: ["#f9f6f0", "#f0ede7"], category: "light" },
    
    // Dark themes (15 total)
    { id: "dark-default", name: "Classic Dark", colors: ["#1a1a1a", "#0f0f0f"], category: "dark" },
    { id: "dark-slate", name: "Slate Dark", colors: ["#1e293b", "#0f172a"], category: "dark" },
    { id: "dark-forest", name: "Forest Dark", colors: ["#1a2e1a", "#0f1a0f"], category: "dark" },
    { id: "dark-ocean", name: "Ocean Dark", colors: ["#1a252e", "#0f1419"], category: "dark" },
    { id: "dark-purple", name: "Purple Dark", colors: ["#1e1a2e", "#0f0d19"], category: "dark" },
    { id: "dark-charcoal", name: "Charcoal", colors: ["#2c2c2c", "#1f1f1f"], category: "dark" },
    { id: "dark-graphite", name: "Graphite", colors: ["#2a2a2a", "#1d1d1d"], category: "dark" },
    { id: "dark-onyx", name: "Onyx", colors: ["#1c1c1c", "#111111"], category: "dark" },
    { id: "dark-obsidian", name: "Obsidian", colors: ["#0d1117", "#010409"], category: "dark" },
    { id: "dark-shadow", name: "Shadow", colors: ["#1f1f1f", "#141414"], category: "dark" },
    { id: "dark-void", name: "Void", colors: ["#0a0a0a", "#000000"], category: "dark" },
    { id: "dark-steel", name: "Steel", colors: ["#2d2d30", "#1e1e1e"], category: "dark" },
    { id: "dark-carbon", name: "Carbon", colors: ["#181818", "#0e0e0e"], category: "dark" },
    { id: "dark-coal", name: "Coal", colors: ["#1a1a1a", "#0d0d0d"], category: "dark" },
    { id: "dark-pitch", name: "Pitch", colors: ["#121212", "#080808"], category: "dark" },
  ]

  const systemThemes = themes.filter(theme => theme.category === "system")
  const lightThemes = themes.filter(theme => theme.category === "light")
  const darkThemes = themes.filter(theme => theme.category === "dark")

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
        <div className="grid grid-cols-3 gap-2">
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
        <div className="grid grid-cols-3 gap-2">
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
    </div>
  )
}
