"use client"

import { useEffect } from "react"

interface ThemeInjectorProps {
  colors: Record<string, string>
}

export function ThemeInjector({ colors }: ThemeInjectorProps) {
  useEffect(() => {
    // Map the color keys to their CSS variable names
    const colorMap: Record<string, string> = {
      background: "background",
      foreground: "foreground",
      card: "card",
      cardForeground: "card-foreground",
      popover: "popover",
      popoverForeground: "popover-foreground",
      primary: "primary",
      primaryForeground: "primary-foreground",
      secondary: "secondary",
      secondaryForeground: "secondary-foreground",
      muted: "muted",
      mutedForeground: "muted-foreground",
      accent: "accent",
      accentForeground: "accent-foreground",
      destructive: "destructive",
      destructiveForeground: "destructive-foreground",
      border: "border",
      input: "input",
      ring: "ring",
    }

    const colorStyles = Object.entries(colors)
      .map(([key, value]) => {
        const cssKey = colorMap[key] || key.replace(/([A-Z])/g, "-$1").toLowerCase()
        return `--${cssKey}: ${value};`
      })
      .join("\n    ")

    // Create or update style element
    let styleElement = document.getElementById("client-theme-styles")
    if (!styleElement) {
      styleElement = document.createElement("style")
      styleElement.id = "client-theme-styles"
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = `
      :root {
        ${colorStyles}
      }
    `

    return () => {
      // Cleanup on unmount
      const element = document.getElementById("client-theme-styles")
      if (element) {
        element.remove()
      }
    }
  }, [colors])

  return null
}

