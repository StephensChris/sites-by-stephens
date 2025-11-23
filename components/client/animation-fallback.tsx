"use client"

import { useEffect } from "react"

/**
 * Animation Fallback Component
 * 
 * Ensures that animated elements become visible even if CSS animations fail to work
 * in production. This is a safety net for elements that start with opacity-0 and
 * rely on animations to become visible.
 */
export function AnimationFallback() {
  useEffect(() => {
    // Wait for animations to complete (max delay is ~1.2s, so 2s is safe)
    const timer = setTimeout(() => {
      const animatedElements = document.querySelectorAll('[data-animated]')
      animatedElements.forEach((el) => {
        const computedStyle = window.getComputedStyle(el)
        const opacity = parseFloat(computedStyle.opacity)
        // If element is still invisible after animations should have completed, force visibility
        if (opacity < 0.1) {
          el.classList.add('force-visible')
          console.log('[AnimationFallback] Forcing visibility for element:', el)
        }
      })
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  return null
}

