"use client"

import { useState } from "react"
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

interface HeroProps {
  data: HeroData
}

export function ClientHero({ data }: HeroProps) {
  const [showYay, setShowYay] = useState(false)

  const placeOrderButton = data.buttons.find((btn) => btn.text === "Place an Order")

  return (
    <section className="relative min-h-screen flex items-center justify-center" style={{ overflow: 'visible' }}>
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
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-balance mb-4 sm:mb-6 text-foreground px-4 opacity-0 animate-[fadeInUp_0.7s_ease-out_0.1s_forwards]">
          {data.title}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-pretty mb-6 sm:mb-8 leading-relaxed px-4 opacity-0 animate-[fadeInUp_0.7s_ease-out_0.3s_forwards]">
          {data.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 opacity-0 animate-[fadeInUp_0.7s_ease-out_0.5s_forwards]">
          {data.buttons.map((button, index) => (
            <div key={index} className="relative transition-transform duration-300 hover:scale-105" style={{ overflow: 'visible' }}>
              <Button
                size="lg"
                variant={button.variant}
                className={
                  button.variant === "outline"
                    ? "text-base sm:text-lg px-6 sm:px-8 bg-transparent border-2 transition-shadow duration-300"
                    : "text-base sm:text-lg px-6 sm:px-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                }
                onMouseEnter={() => {
                  if (button.text === "Place an Order") {
                    setShowYay(true)
                    setTimeout(() => setShowYay(false), 2200)
                  }
                }}
                onClick={() => {
                  if (button.href?.startsWith("#")) {
                    const element = document.querySelector(button.href)
                    element?.scrollIntoView({ behavior: "smooth" })
                  } else if (button.href) {
                    window.location.href = button.href
                  }
                }}
              >
                {button.text}
              </Button>
              {button.text === "Place an Order" && showYay && (
                <span 
                  className="absolute pointer-events-none text-2xl font-bold text-primary animate-[floatUpSway_2.2s_ease-out_forwards] whitespace-nowrap z-50"
                  style={{ 
                    willChange: 'transform, opacity',
                    left: '50%',
                    top: '0',
                    transform: 'translateX(-50%) translateY(-100%)',
                  }}
                >
                  yay!
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

