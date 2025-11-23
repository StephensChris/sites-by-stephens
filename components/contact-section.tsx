"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { ProtectedEmail } from "@/components/protected-email"

export function ContactSection() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  useEffect(() => {
    // Check if a tier was selected from pricing section
    const tier = sessionStorage.getItem('selectedTier')
    if (tier) {
      setSelectedTier(tier)
      // Clear it after reading so it doesn't persist
      sessionStorage.removeItem('selectedTier')
    }
  }, [])

  return (
    <section id="contact" className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Get in Touch</h2>
          {selectedTier && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
              <p className="text-lg text-blue-900 dark:text-blue-100">
                Great choice! You selected the <strong>{selectedTier}</strong> package. 
                Mention this in your email and I'll get started on your free preview right away.
              </p>
            </div>
          )}
          <p className="text-xl text-muted-foreground mb-8">
            {selectedTier 
              ? "Reach out via email and I'll send you a free preview of your site."
              : "Interested in seeing your website before committing? Reach out via email and I'll send you a free preview of your site."
            }
          </p>
          <div className="flex justify-center">
            <ProtectedEmail />
          </div>
          <p className="text-sm text-muted-foreground mt-8">
            Click the button above to reveal my email address. This helps prevent spam while keeping it easy for real clients to contact me.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
