"use client"

import { motion } from "framer-motion"
import { Upload, Hammer, Eye, Rocket } from "lucide-react"

const steps = [
  {
    number: "1",
    title: "You send photos & info",
    description: "Share your business details, branding, and content with me",
    icon: Upload,
  },
  {
    number: "2",
    title: "I build your site in 48 hours",
    description: "I create a beautiful, fast website tailored to your business",
    icon: Hammer,
  },
  {
    number: "3",
    title: "You see a free live preview",
    description: "Review your site on a live URL before paying anything",
    icon: Eye,
  },
  {
    number: "4",
    title: "Love it? It's yours instantly",
    description: "Once approved, your site goes live on your domain",
    icon: Rocket,
  },
]

export function ProcessSection() {
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">How It Works</h2>
          <p className="text-xl text-muted-foreground">From idea to live site in 4 simple steps</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mb-6 relative">
                <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <step.icon className="w-10 h-10" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-lg border-2 border-blue-600 mx-auto left-1/2 translate-x-6">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
