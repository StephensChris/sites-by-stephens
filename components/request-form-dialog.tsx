"use client"

import { useState, useEffect, useMemo } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2Icon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"

interface RequestFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTier: string | null
}

// Tier default configurations
const tierDefaults: Record<string, {
  pages: string
  seoLevel: string
  features: Record<string, boolean>
}> = {
  Basic: {
    pages: "1 page",
    seoLevel: "basic",
    features: {
      imageGallery: false,
      socialMedia: false,
      blog: false,
      customFeatures: false,
      darkMode: false,
    },
  },
  Standard: {
    pages: "Up to 3 pages",
    seoLevel: "advanced",
    features: {
      imageGallery: true,
      socialMedia: true,
      blog: true,
      customFeatures: false,
      darkMode: false,
    },
  },
  Premium: {
    pages: "Up to 9 pages",
    seoLevel: "advanced",
    features: {
      imageGallery: true,
      socialMedia: true,
      blog: true,
      customFeatures: true,
      darkMode: false,
    },
  },
}

// Pricing structure
const pricing = {
  pages: {
    "1 page": 99,
    "Up to 3 pages": 249,
    "Up to 9 pages": 299,
  },
  seo: {
    basic: 0,
    advanced: 50,
  },
  features: {
    imageGallery: 30,
    socialMedia: 25,
    blog: 40,
    darkMode: 25,
    customFeatures: 50,
  },
  delivery: {
    standard: 0,
    rush: 50,
  },
  theme: {
    modern: 0,
    fun: 0,
    elegant: 0,
    minimal: 0,
    custom: 50,
  },
  support: {
    basic: 0,
    standard: 30,
    priority: 50,
  },
}

export function RequestFormDialog({
  open,
  onOpenChange,
  selectedTier,
}: RequestFormDialogProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [honeypot, setHoneypot] = useState("") // Anti-spam field
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Form options
  const [pages, setPages] = useState("Up to 3")
  const [seoLevel, setSeoLevel] = useState("basic")
  const [deliveryTime, setDeliveryTime] = useState("standard")
  const [theme, setTheme] = useState("modern")
  const [supportLevel, setSupportLevel] = useState("basic")
  const [customFeaturesText, setCustomFeaturesText] = useState("")
  const [features, setFeatures] = useState<Record<string, boolean>>({
    imageGallery: false,
    socialMedia: false,
    blog: false,
    customFeatures: false,
    darkMode: false,
  })

  // Calculate estimated price
  const estimatedPrice = useMemo(() => {
    // Start with tier base price if a tier is selected
    let total = 0
    if (selectedTier === "Basic") {
      total = 99
    } else if (selectedTier === "Standard") {
      total = 249
    } else if (selectedTier === "Premium") {
      total = 299
    } else {
      // If no tier selected, calculate from scratch
      total = pricing.pages[pages as keyof typeof pricing.pages] || 0
      total += pricing.seo[seoLevel as keyof typeof pricing.seo] || 0
    }
    
    // Add delivery, theme, and support costs (these are always add-ons)
    total += pricing.delivery[deliveryTime as keyof typeof pricing.delivery] || 0
    total += pricing.theme[theme as keyof typeof pricing.theme] || 0
    total += pricing.support[supportLevel as keyof typeof pricing.support] || 0

    // Add feature costs only if they're not included in the tier
    if (selectedTier !== "Standard" && selectedTier !== "Premium") {
      // Basic tier doesn't include these features, so add their cost
      if (features.imageGallery) total += pricing.features.imageGallery
      if (features.socialMedia) total += pricing.features.socialMedia
      if (features.blog) total += pricing.features.blog
    }
    if (selectedTier !== "Premium") {
      // Only Premium includes custom features
      if (features.customFeatures) total += pricing.features.customFeatures
    }
    // Dark mode is always an add-on
    if (features.darkMode) total += pricing.features.darkMode

    return total
  }, [pages, seoLevel, deliveryTime, theme, supportLevel, features, selectedTier])

  // Pre-populate form based on selected tier
  useEffect(() => {
    if (open && selectedTier && tierDefaults[selectedTier]) {
      const defaults = tierDefaults[selectedTier]
      setPages(defaults.pages)
      setSeoLevel(defaults.seoLevel)
      setFeatures(defaults.features)
      setDeliveryTime("standard")
      setTheme("modern")
      setSupportLevel(selectedTier === "Premium" ? "priority" : selectedTier === "Standard" ? "standard" : "basic")
    }
  }, [open, selectedTier])

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setName("")
      setEmail("")
      setMessage("")
      setHoneypot("")
      setSubmitStatus("idle")
      setErrorMessage("")
      setPages("Up to 3")
      setSeoLevel("basic")
      setDeliveryTime("standard")
      setTheme("modern")
      setSupportLevel("basic")
      setCustomFeaturesText("")
      setFeatures({
        imageGallery: false,
        socialMedia: false,
        blog: false,
        customFeatures: false,
        darkMode: false,
      })
    }
  }, [open])

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFeatures((prev) => ({ ...prev, [feature]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Honeypot check - if filled, it's a bot
    if (honeypot) {
      return // Silently fail
    }

    // Basic validation
    if (!name.trim() || !email.trim()) {
      setErrorMessage("Please fill in all required fields")
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
          pages,
          seoLevel,
          deliveryTime,
          theme,
          supportLevel,
          features,
          customFeaturesText: features.customFeatures ? customFeaturesText.trim() : "",
          estimatedPrice,
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

  const selectedFeaturesCount = Object.values(features).filter(Boolean).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <DialogHeader>
          <DialogTitle>Get Started with Your Website</DialogTitle>
          <DialogDescription>
            Select the features you need and I'll create a custom quote for you. I'll get back to you within 24 hours with your free preview.
          </DialogDescription>
        </DialogHeader>

        {submitStatus === "success" ? (
          <div className="py-8 text-center">
            <div className="text-green-600 text-lg font-semibold mb-2">Request sent!</div>
            <p className="text-muted-foreground">
              I'll review your selections and send you a free preview of your website within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
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
                <Label htmlFor="email">Your Email *</Label>
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
            </div>

            <Separator />

            {/* Website Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Website Configuration</h3>
              
              <div className="space-y-3">
                <Label>Number of Pages *</Label>
                <RadioGroup value={pages} onValueChange={setPages} disabled={isSubmitting}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1 page" id="pages-1" />
                    <Label htmlFor="pages-1" className="font-normal cursor-pointer">1 page</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Up to 3 pages" id="pages-3" />
                    <Label htmlFor="pages-3" className="font-normal cursor-pointer">Up to 3 pages</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Up to 9 pages" id="pages-9" />
                    <Label htmlFor="pages-9" className="font-normal cursor-pointer">Up to 9 pages</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Theme Style *</Label>
                <RadioGroup value={theme} onValueChange={setTheme} disabled={isSubmitting}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="modern" id="theme-modern" />
                    <Label htmlFor="theme-modern" className="font-normal cursor-pointer">Modern</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fun" id="theme-fun" />
                    <Label htmlFor="theme-fun" className="font-normal cursor-pointer">Fun</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="elegant" id="theme-elegant" />
                    <Label htmlFor="theme-elegant" className="font-normal cursor-pointer">Elegant</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal" id="theme-minimal" />
                    <Label htmlFor="theme-minimal" className="font-normal cursor-pointer">Minimal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="theme-custom" />
                    <Label htmlFor="theme-custom" className="font-normal cursor-pointer">Custom Theme (+$50)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>SEO Level *</Label>
                <RadioGroup value={seoLevel} onValueChange={setSeoLevel} disabled={isSubmitting}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="basic" id="seo-basic" />
                    <Label htmlFor="seo-basic" className="font-normal cursor-pointer">Basic SEO (meta tags, descriptions)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="seo-advanced" />
                    <Label htmlFor="seo-advanced" className="font-normal cursor-pointer">Advanced SEO (sitemap, schema markup, optimization) (+$50)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Level of Support *</Label>
                <RadioGroup value={supportLevel} onValueChange={setSupportLevel} disabled={isSubmitting}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="basic" id="support-basic" />
                    <Label htmlFor="support-basic" className="font-normal cursor-pointer">Basic Support</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="support-standard" />
                    <Label htmlFor="support-standard" className="font-normal cursor-pointer">Standard Support (+$30)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="priority" id="support-priority" />
                    <Label htmlFor="support-priority" className="font-normal cursor-pointer">Priority Support (+$50)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Delivery Time *</Label>
                <RadioGroup value={deliveryTime} onValueChange={setDeliveryTime} disabled={isSubmitting}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="delivery-standard" />
                    <Label htmlFor="delivery-standard" className="font-normal cursor-pointer">Standard (5-7 business days)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rush" id="delivery-rush" />
                    <Label htmlFor="delivery-rush" className="font-normal cursor-pointer">Rush (48-72 hours) (+$50)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Features</h3>
              <p className="text-sm text-muted-foreground">Select all that apply</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="imageGallery"
                    checked={features.imageGallery}
                    onCheckedChange={(checked) => handleFeatureChange("imageGallery", checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="imageGallery" className="font-normal cursor-pointer">Image Gallery (+$30)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="socialMedia"
                    checked={features.socialMedia}
                    onCheckedChange={(checked) => handleFeatureChange("socialMedia", checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="socialMedia" className="font-normal cursor-pointer">Social Media Integration (+$25)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="blog"
                    checked={features.blog}
                    onCheckedChange={(checked) => handleFeatureChange("blog", checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="blog" className="font-normal cursor-pointer">Blog Setup (+$40)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="darkMode"
                    checked={features.darkMode}
                    onCheckedChange={(checked) => handleFeatureChange("darkMode", checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="darkMode" className="font-normal cursor-pointer">Dark Mode Switch (+$25)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="customFeatures"
                    checked={features.customFeatures}
                    onCheckedChange={(checked) => handleFeatureChange("customFeatures", checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="customFeatures" className="font-normal cursor-pointer">Custom Features (+$50)</Label>
                </div>
              </div>

              {features.customFeatures && (
                <div className="space-y-2 mt-4">
                  <Label htmlFor="customFeaturesText">Describe your custom features *</Label>
                  <Textarea
                    id="customFeaturesText"
                    value={customFeaturesText}
                    onChange={(e) => setCustomFeaturesText(e.target.value)}
                    placeholder="e.g., Online booking system, customer portal, live chat integration, payment processing, appointment scheduler..."
                    rows={3}
                    disabled={isSubmitting}
                    required={features.customFeatures}
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* Price Estimate */}
            <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-lg font-semibold">Estimated Price</h3>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  ${estimatedPrice}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                This is an estimate based on your selections. Final pricing may vary based on specific requirements and will be confirmed in your custom quote.
              </p>
            </Card>

            <Separator />

            {/* Additional Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Additional Details (Optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me more about your business, brand style, or any specific requirements..."
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
                  `Send Request${selectedFeaturesCount > 0 ? ` (${selectedFeaturesCount} features)` : ""}`
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
