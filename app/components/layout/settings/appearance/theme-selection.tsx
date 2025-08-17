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
  ]

  const systemThemes = themes.filter(theme => theme.category === "system")
  const lightThemes = themes.filter(theme => theme.category === "light")
  const darkThemes = themes.filter(theme => theme.category === "dark")

  return (
    <div>
      <h4 className="mb-3 text-sm font-medium">Theme</h4>
      
      {/* System Theme */}
      <div className="mb-4">
        <h5 className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">System</h5>
        <div className="grid grid-cols-1 gap-2">
          {systemThemes.map((themeItem) => (
            <button
              key={themeItem.id}
              type="button"
              onClick={() => {
                setSelectedTheme(themeItem.id)
                setTheme(themeItem.id)
              }}
              className={`rounded-lg border p-3 text-left transition-all ${
                selectedTheme === themeItem.id
                  ? "border-primary ring-primary/30 ring-2"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="mb-2 flex space-x-1">
                {themeItem.colors.map((color, i) => (
                  <div
                    key={i}
                    className="border-border h-4 w-4 rounded-full border"
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
      <div className="mb-4">
        <h5 className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Light Themes</h5>
        <div className="grid grid-cols-2 gap-2">
          {lightThemes.map((themeItem) => (
            <button
              key={themeItem.id}
              type="button"
              onClick={() => {
                setSelectedTheme(themeItem.id)
                setTheme(themeItem.id)
              }}
              className={`rounded-lg border p-3 text-left transition-all ${
                selectedTheme === themeItem.id
                  ? "border-primary ring-primary/30 ring-2"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="mb-2 flex space-x-1">
                {themeItem.colors.map((color, i) => (
                  <div
                    key={i}
                    className="border-border h-3 w-3 rounded-full border"
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
      <div>
        <h5 className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Dark Themes</h5>
        <div className="grid grid-cols-2 gap-2">
          {darkThemes.map((themeItem) => (
            <button
              key={themeItem.id}
              type="button"
              onClick={() => {
                setSelectedTheme(themeItem.id)
                setTheme(themeItem.id)
              }}
              className={`rounded-lg border p-3 text-left transition-all ${
                selectedTheme === themeItem.id
                  ? "border-primary ring-primary/30 ring-2"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="mb-2 flex space-x-1">
                {themeItem.colors.map((color, i) => (
                  <div
                    key={i}
                    className="border-border h-3 w-3 rounded-full border"
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
