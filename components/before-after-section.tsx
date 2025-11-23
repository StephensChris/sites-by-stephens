"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

const examples = [
  {
    id: 1,
    business: "Restaurant",
    before: "/old-1990s-geocities-restaurant-website.jpg",
    after: "/modern-sleek-restaurant-website.jpg",
  },
  {
    id: 2,
    business: "Construction",
    before: "/outdated-2000s-construction-website.jpg",
    after: "/modern-professional-construction-website.jpg",
  },
  {
    id: 3,
    business: "Salon",
    before: "/old-basic-salon-website.jpg",
    after: "/modern-elegant-salon-website.jpg",
  },
]

export function BeforeAfterSection() {
  const [activeExample, setActiveExample] = useState(0)
  const [sliderValue, setSliderValue] = useState([50])

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            From outdated to outstanding in 48 hours
          </h2>
          <p className="text-xl text-muted-foreground">See the transformation</p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Example selector */}
          <div className="flex justify-center gap-4 mb-8">
            {examples.map((example, index) => (
              <button
                key={example.id}
                onClick={() => setActiveExample(index)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeExample === index
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-slate-800 text-foreground hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {example.business}
              </button>
            ))}
          </div>

          {/* Before/After comparison */}
          <Card className="overflow-hidden">
            <div className="relative aspect-video">
              {/* After image (always visible) */}
              <img
                src={examples[activeExample].after || "/placeholder.svg"}
                alt="After"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Before image (clipped by slider) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderValue[0]}% 0 0)` }}
              >
                <img
                  src={examples[activeExample].before || "/placeholder.svg"}
                  alt="Before"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Labels */}
              <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold">BEFORE</div>
              <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg font-bold">AFTER</div>

              {/* Slider line */}
              <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg" style={{ left: `${sliderValue[0]}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-1 h-6 bg-slate-400" />
                    <div className="w-1 h-6 bg-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Slider control */}
            <div className="p-6 bg-white dark:bg-slate-800">
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
