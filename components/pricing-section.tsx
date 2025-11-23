"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PricingRequestModal } from "@/components/pricing-request-modal"

export function PricingSection() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Get Your Website Quote</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tell me what you need and I'll create a custom quote.
          </p>
          <Button
            size="lg"
            onClick={() => setModalOpen(true)}
            className="text-lg px-8 py-6"
          >
            Get Started
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6">
              <div className="text-3xl font-bold text-foreground mb-2">Custom</div>
              <p className="text-muted-foreground">Pricing</p>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-foreground mb-2">48hrs</div>
              <p className="text-muted-foreground">Fast delivery</p>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-foreground mb-2">Free</div>
              <p className="text-muted-foreground">Preview included</p>
            </div>
          </div>
        </motion.div>
      </div>

      <PricingRequestModal open={modalOpen} onOpenChange={setModalOpen} />
    </section>
  )
}
