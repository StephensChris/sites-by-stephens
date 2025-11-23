"use client"

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2Icon } from "lucide-react"

interface ContactFormProps {
  /**
   * Optional title to display above the form
   */
  title?: string
  /**
   * Optional description/subtitle
   */
  description?: string
  /**
   * Optional className for custom styling
   */
  className?: string
}

/**
 * Reusable Contact Form Component
 * 
 * Works on both main site and client subdomains.
 * Automatically detects the current site and includes it in the email.
 * 
 * Features:
 * - Beautiful, responsive Tailwind styling
 * - Loading states with spinner
 * - Success message (auto-hides after 5 seconds)
 * - Error handling with user-friendly messages
 * - Accessible (labels, aria-live for status)
 * - Rate limiting handled by API
 */
export function ContactForm({ title, description, className = "" }: ContactFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [honeypot, setHoneypot] = useState("") // Honeypot field for spam protection

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Honeypot check - if filled, it's a bot
    if (honeypot) {
      console.log("[ContactForm] Honeypot triggered - bot detected")
      return // Silently fail
    }

    // Reset previous status
    setSubmitStatus("idle")
    setErrorMessage("")

    // Basic validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage("Please fill in all required fields")
      setSubmitStatus("error")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address")
      setSubmitStatus("error")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          phone: phone.trim() || undefined,
          company: company.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      // Success!
      setSubmitStatus("success")
      
      // Reset form
      setName("")
      setEmail("")
      setMessage("")
      setPhone("")
      setCompany("")
      setHoneypot("")

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus("idle")
      }, 5000)

      console.log("[ContactForm] Message sent successfully")
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      )
      console.error("[ContactForm] Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={className}>
      {(title || description) && (
        <div className="mb-6 text-center">
          {title && (
            <h3 className="text-2xl font-bold mb-2 text-foreground">{title}</h3>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field - hidden from users but visible to bots */}
        <div className="hidden" aria-hidden="true">
          <Label htmlFor="website">Website (leave blank)</Label>
          <Input
            id="website"
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              disabled={isSubmitting}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={isSubmitting}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              disabled={isSubmitting}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company (Optional)</Label>
            <Input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your company"
              disabled={isSubmitting}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">
            Message <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us how we can help..."
            required
            disabled={isSubmitting}
            rows={6}
            className="w-full resize-none"
          />
        </div>

        {/* Status messages */}
        <div role="status" aria-live="polite" aria-atomic="true">
          {submitStatus === "success" && (
            <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
              <p className="text-green-800 dark:text-green-200 font-medium">
                Thanks! I'll get back to you soon.
              </p>
            </div>
          )}

          {submitStatus === "error" && errorMessage && (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
              <p className="text-red-800 dark:text-red-200 font-medium">
                {errorMessage}
              </p>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </div>
  )
}

