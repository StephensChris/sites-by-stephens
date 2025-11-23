"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useContactQR } from "@/components/contact-qr-popup"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { open: openContactQR } = useContactQR()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/90 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-xl font-bold text-white hover:text-slate-300 transition-colors"
        >
          Sites by Stephens
        </button>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection("work")} className="text-white hover:text-slate-300 transition-colors">
            Work
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-white hover:text-slate-300 transition-colors"
          >
            Pricing
          </button>
          <button
            onClick={openContactQR}
            className="text-white hover:text-slate-300 transition-colors"
          >
            Contact
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
