"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Maria Rodriguez",
    business: "La Bella Pizza",
    text: "Stephens built my restaurant website in 2 days and we're getting so many more calls now. The online menu feature is exactly what we needed!",
    rating: 5,
  },
  {
    id: 2,
    name: "John Thompson",
    business: "Thompson Plumbing",
    text: "I was skeptical about the 48-hour turnaround, but he delivered an amazing site faster than promised. My business looks so professional now.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sarah Chen",
    business: "Mindful Yoga Studio",
    text: "The free preview was genius - I could see exactly what I was getting before paying. Made a few tweaks and it was perfect. Worth every penny!",
    rating: 5,
  },
  {
    id: 4,
    name: "Marcus Williams",
    business: "Elite Fitness Gym",
    text: "Best investment for my gym. The site looks incredible on phones which is where most of my clients find me. Highly recommend!",
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const previous = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">What Clients Say</h2>
          <p className="text-xl text-muted-foreground">Real feedback from real business owners</p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 md:p-12">
                <div className="flex gap-1 mb-4 justify-center">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xl md:text-2xl text-center mb-6 text-foreground italic">
                  "{testimonials[currentIndex].text}"
                </p>
                <div className="text-center">
                  <p className="font-bold text-lg text-foreground">{testimonials[currentIndex].name}</p>
                  <p className="text-muted-foreground">{testimonials[currentIndex].business}</p>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 rounded-full bg-transparent"
            onClick={previous}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 rounded-full bg-transparent"
            onClick={next}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Dots indicator */}
          <div className="flex gap-2 justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-blue-600 w-8" : "bg-slate-300 dark:bg-slate-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
