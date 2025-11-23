"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2Icon } from "lucide-react"

interface RequestFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTier: string
  tierPrice: string
}

export function RequestFormDialog({
  open,
  onOpenChange,
  selectedTier,
  tierPrice,
}: RequestFormDialogProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [honeypot, setHoneypot] = useState("") // Anti-spam field
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setName("")
      setEmail("")
      setMessage("")
      setHoneypot("")
      setSubmitStatus("idle")
      setErrorMessage("")
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Honeypot check - if filled, it's a bot
    if (honeypot) {
      return // Silently fail
    }

    // Basic validation
    if (!name.trim() || !email.trim()) {
      setErrorMessage("Please fill in all fields")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          tier: selectedTier,
          price: tierPrice,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send request")
      }

      setSubmitStatus("success")
      // Close dialog after 2 seconds
      setTimeout(() => {
        onOpenChange(false)
      }, 2000)
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request {selectedTier} Package</DialogTitle>
          <DialogDescription>
            Fill out the form below and I'll get back to you within 24 hours with your free preview.
          </DialogDescription>
        </DialogHeader>

        {submitStatus === "success" ? (
          <div className="py-8 text-center">
            <div className="text-green-600 text-lg font-semibold mb-2">Request sent!</div>
            <p className="text-muted-foreground">
              I'll send you a free preview of your {selectedTier} website within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I like this but only need 1 page, can we talk more about it?"
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            {/* Honeypot field - hidden from users, bots will fill it */}
            <div className="hidden" aria-hidden="true">
              <Label htmlFor="website">Website (leave blank)</Label>
              <Input
                id="website"
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">
                <strong>Package:</strong> {selectedTier}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Price:</strong> {tierPrice}
              </p>
            </div>

            {errorMessage && (
              <div className="text-sm text-red-600 dark:text-red-400">{errorMessage}</div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Request"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

