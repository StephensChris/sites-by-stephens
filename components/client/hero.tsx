"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface HeroData {
  title: string
  subtitle: string
  backgroundImage: string
  buttons: Array<{
    text: string
    variant: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
    href?: string
  }>
}

interface InstagramData {
  handle: string
  url: string
}

interface HeroProps {
  data: HeroData
  instagram?: InstagramData
}

export function ClientHero({ data, instagram }: HeroProps) {
  const [showYay, setShowYay] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Ensure elements become visible even if animations don't work
  useEffect(() => {
    setIsMounted(true)
    // Fallback: make elements visible after animation should have completed
    const timer = setTimeout(() => {
      const animatedElements = document.querySelectorAll('[data-animated]')
      animatedElements.forEach((el) => {
        const computedStyle = window.getComputedStyle(el)
        if (computedStyle.opacity === '0' || parseFloat(computedStyle.opacity) < 0.1) {
          el.classList.add('force-visible')
        }
      })
    }, 2000) // After all animations should have completed (max delay is ~1.2s, so 2s is safe)
    
    return () => clearTimeout(timer)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  // Replace "Place an Order" button with Instagram follow button if instagram is provided
  const processedButtons = data.buttons.map((button) => {
    if (button.text === "Place an Order" && instagram) {
      return {
        ...button,
        text: "Follow Us!",
        href: instagram.url,
      }
    }
    return button
  })

  return (
    <section className="relative min-h-screen flex items-center justify-center pb-20" style={{ overflow: 'visible' }}>
      <div className="absolute inset-0 z-0">
        <Image
          src={data.backgroundImage}
          alt="Hero background"
          fill
          className="object-cover opacity-30"
          priority
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32 mx-auto text-center min-h-[80vh] flex flex-col justify-center">
        <h1 
          data-animated
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-balance mb-4 sm:mb-6 text-foreground px-4 opacity-0" 
          style={{ animation: 'fadeInUp 0.7s ease-out 0.1s forwards' }}
        >
          {data.title}
        </h1>
        <p 
          data-animated
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-pretty mb-6 sm:mb-8 leading-relaxed px-4 opacity-0" 
          style={{ animation: 'fadeInUp 0.7s ease-out 0.3s forwards' }}
        >
          {data.subtitle}
        </p>
        <div 
          data-animated
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 opacity-0" 
          style={{ animation: 'fadeInUp 0.7s ease-out 0.5s forwards' }}
        >
          {processedButtons.map((button, index) => (
            <div key={index} className="relative transition-transform duration-300 hover:scale-105 w-full sm:w-auto sm:flex-1 sm:max-w-[200px]" style={{ overflow: 'visible' }}>
              <Button
                size="lg"
                variant={button.variant}
                className={
                  button.variant === "outline"
                    ? "text-base sm:text-lg px-6 sm:px-8 bg-transparent border-2 transition-shadow duration-300 w-full"
                    : "text-base sm:text-lg px-6 sm:px-8 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full"
                }
                onClick={() => {
                  if (button.href?.startsWith("#")) {
                    const element = document.querySelector(button.href)
                    element?.scrollIntoView({ behavior: "smooth" })
                  } else if (button.href && button.href.startsWith("http")) {
                    window.open(button.href, "_blank", "noopener,noreferrer")
                  } else if (button.href) {
                    window.location.href = button.href
                  }
                }}
              >
                {button.text}
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bouncing arrow to scroll to About section */}
      <div 
        data-animated
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 cursor-pointer z-20"
        style={{ animation: 'fadeInUp 0.7s ease-out 0.7s forwards' }}
        onClick={() => scrollToSection("#about")}
      >
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-sm font-medium text-foreground">About Us</span>
          <svg
            className="w-6 h-6 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}

