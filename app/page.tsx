"use client"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { WorkSection } from "@/components/work-section"
import { PricingSection } from "@/components/pricing-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"

export default function Home() {
  const scrollToWork = () => {
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with radial gradient */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(circle at center, rgb(15 23 42) 0%, rgb(30 41 59) 50%, rgb(0 0 0) 100%)'
          }}
        />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance leading-tight">
              Modern websites for small businesses
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto text-balance">
              See your site before you commit. Free previews for every project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-white text-black hover:bg-slate-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.8)]"
                onClick={scrollToWork}
              >
                View My Work
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-transparent text-white border-white hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                onClick={scrollToContact}
              >
                Contact Me
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <WorkSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
