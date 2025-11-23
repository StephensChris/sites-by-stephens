"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { RequestFormDialog } from "@/components/request-form-dialog"

const tiers = [
  {
    name: "Basic",
    price: "$149",
    description: "Perfect for simple businesses",
    features: [
      "1 page",
      "Basic SEO",
      "48-hour delivery",
    ],
  },
  {
    name: "Standard",
    price: "$249",
    description: "Most popular choice",
    features: [
      "Up to 3 pages",
      "Everything in Basic",
      "Advanced SEO",
      "Image gallery",
      "Social media integration",
      "Blog setup",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "$299",
    description: "For growing businesses",
    features: [
      "Up to 9 pages",
      "Everything in Standard",
      "Custom features",
    ],
  },
]

export function PricingSection() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const handleGetStarted = (tierName: string) => {
    setSelectedTier(tierName)
    setDialogOpen(true)
  }

  return (
    <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Choose Your Website</h2>
          <p className="text-xl text-muted-foreground">Simple pricing. No surprises.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className={`p-8 h-full flex flex-col relative ${
                  tier.popular ? "border-2 border-blue-600 shadow-lg" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-foreground">{tier.name}</h3>
                  <div className="mb-2">
                    <span className="text-5xl font-bold text-foreground">{tier.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleGetStarted(tier.name)}
                  className={`w-full ${tier.popular ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                  variant={tier.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <RequestFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedTier={selectedTier}
      />
    </section>
  )
}
