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
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2Icon, ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { motion, AnimatePresence } from "framer-motion"

interface PricingRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Pricing structure
const pricing = {
  pagePrice: 50, // $50 per page
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

const steps = [
  { id: 1, title: "Website Size", description: "How many pages do you need?" },
  { id: 2, title: "Style & Theme", description: "Choose your design style" },
  { id: 3, title: "Features", description: "Select additional features" },
  { id: 4, title: "Delivery & Support", description: "When do you need it?" },
  { id: 5, title: "Review & Contact", description: "Review your selections and provide contact info" },
]

export function PricingRequestModal({ open, onOpenChange }: PricingRequestModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Form options
  const [pageCount, setPageCount] = useState([3]) // Default to 3 pages (max 5 for standard pricing)
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
  const estimatedPrice = () => {
    let total = 0
    // Pages 1-5: $50 per page
    total = pageCount[0] * pricing.pagePrice
    total += pricing.seo[seoLevel as keyof typeof pricing.seo] || 0
    total += pricing.delivery[deliveryTime as keyof typeof pricing.delivery] || 0
    total += pricing.theme[theme as keyof typeof pricing.theme] || 0
    total += pricing.support[supportLevel as keyof typeof pricing.support] || 0

    if (features.imageGallery) total += pricing.features.imageGallery
    if (features.socialMedia) total += pricing.features.socialMedia
    if (features.blog) total += pricing.features.blog
    if (features.customFeatures) total += pricing.features.customFeatures
    if (features.darkMode) total += pricing.features.darkMode

    return total
  }

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setCurrentStep(0)
      setName("")
      setEmail("")
      setMessage("")
      setHoneypot("")
      setSubmitStatus("idle")
      setErrorMessage("")
      setPageCount([3])
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

  const nextStep = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    // Validation on last step (contact info is now at the end)
    if (currentStep === steps.length - 1) {
      if (!name.trim() || !email.trim()) {
        setErrorMessage("Please fill in all required fields")
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setErrorMessage("Please enter a valid email address")
        return
      }
    }
    setErrorMessage("")
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setErrorMessage("")
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (honeypot) {
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
          pages: `${pageCount[0]} page${pageCount[0] > 1 ? 's' : ''}`,
          seoLevel,
          deliveryTime,
          theme,
          supportLevel,
          features,
          customFeaturesText: features.customFeatures ? customFeaturesText.trim() : "",
          estimatedPrice: estimatedPrice(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send request")
      }

      setSubmitStatus("success")
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
      <DialogContent className="sm:max-w-2xl h-[550px] w-full max-w-[90vw] !p-0 !gap-0 [&>div]:!flex [&>div]:!flex-col [&>div]:!h-full">
        <div className="flex flex-col h-full max-h-[550px]">
          <DialogHeader className="px-6 pt-4 pb-3 border-b flex-shrink-0 relative pr-24">
            <div className="absolute top-6 right-16">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Estimated Total</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                  ${estimatedPrice()}
                </div>
              </div>
            </div>
            <DialogTitle>Get Your Website Quote</DialogTitle>
            <DialogDescription>
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].description}
            </DialogDescription>
            {/* Progress bar */}
            <div className="w-full bg-muted h-2 rounded-full mt-4">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </DialogHeader>

          {submitStatus === "success" ? (
            <div className="py-12 text-center px-6 flex-shrink-0">
              <div className="text-green-600 text-lg font-semibold mb-2">Request sent!</div>
              <p className="text-muted-foreground">
                I'll review your selections and send you a free preview of your website within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto relative pb-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 py-3"
                  >
                  {/* Step 0: Website Size */}
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{steps[0].title}</h3>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Number of Pages *</Label>
                            <div className="text-lg font-semibold text-primary">
                              {pageCount[0]} page{pageCount[0] > 1 ? 's' : ''} - ${pageCount[0] * pricing.pagePrice}
                            </div>
                          </div>
                          <div className="px-2">
                            <Slider
                              value={pageCount}
                              onValueChange={setPageCount}
                              min={1}
                              max={5}
                              step={1}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>1</span>
                              <span>5</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label>SEO Level *</Label>
                          <RadioGroup value={seoLevel} onValueChange={setSeoLevel}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="basic" id="seo-basic" />
                              <Label htmlFor="seo-basic" className="font-normal cursor-pointer">Basic SEO (included)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="advanced" id="seo-advanced" />
                              <Label htmlFor="seo-advanced" className="font-normal cursor-pointer">Advanced SEO (+$50)</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 1: Style & Theme */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{steps[1].title}</h3>
                      <div className="space-y-3">
                        <Label>Theme Style *</Label>
                        <RadioGroup value={theme} onValueChange={setTheme}>
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
                    </div>
                  )}

                  {/* Step 2: Features */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{steps[2].title}</h3>
                      <p className="text-sm text-muted-foreground">Select all that apply</p>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="imageGallery"
                            checked={features.imageGallery}
                            onCheckedChange={(checked) => handleFeatureChange("imageGallery", checked as boolean)}
                          />
                          <Label htmlFor="imageGallery" className="font-normal cursor-pointer">Image Gallery (+$30)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="socialMedia"
                            checked={features.socialMedia}
                            onCheckedChange={(checked) => handleFeatureChange("socialMedia", checked as boolean)}
                          />
                          <Label htmlFor="socialMedia" className="font-normal cursor-pointer">Social Media Integration (+$25)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="blog"
                            checked={features.blog}
                            onCheckedChange={(checked) => handleFeatureChange("blog", checked as boolean)}
                          />
                          <Label htmlFor="blog" className="font-normal cursor-pointer">Blog Setup (+$40)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="darkMode"
                            checked={features.darkMode}
                            onCheckedChange={(checked) => handleFeatureChange("darkMode", checked as boolean)}
                          />
                          <Label htmlFor="darkMode" className="font-normal cursor-pointer">Dark Mode Switch (+$25)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="customFeatures"
                            checked={features.customFeatures}
                            onCheckedChange={(checked) => handleFeatureChange("customFeatures", checked as boolean)}
                          />
                          <Label htmlFor="customFeatures" className="font-normal cursor-pointer">Custom Features (+$50)</Label>
                        </div>
                        {features.customFeatures && (
                          <div className="space-y-2 mt-4 ml-7">
                            <Label htmlFor="customFeaturesText">Describe your custom features *</Label>
                            <Textarea
                              id="customFeaturesText"
                              value={customFeaturesText}
                              onChange={(e) => setCustomFeaturesText(e.target.value)}
                              placeholder="e.g., Online booking, payment processing, appointment scheduler..."
                              rows={3}
                              required={features.customFeatures}
                              className="resize-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Delivery & Support */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{steps[3].title}</h3>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label>Delivery Time *</Label>
                          <RadioGroup value={deliveryTime} onValueChange={setDeliveryTime}>
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
                        <div className="space-y-3">
                          <Label>Level of Support *</Label>
                          <RadioGroup value={supportLevel} onValueChange={setSupportLevel}>
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
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review & Contact Info */}
                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <div className="space-y-4">
                        <h4 className="text-md font-semibold">Contact Information</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Your Name *</Label>
                            <Input
                              id="name"
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="John Smith"
                              required
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
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 pt-4 border-t">
                        <Label htmlFor="message">Additional Details (Optional)</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tell me more about your business, brand style, or any specific requirements..."
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                      {/* Honeypot field */}
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
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {errorMessage && (
              <div className="px-6 py-2 text-sm text-red-600 dark:text-red-400 flex-shrink-0">{errorMessage}</div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3 px-6 pt-6 pb-3 border-t flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0 || isSubmitting}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={(e) => nextStep(e)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="flex-1 flex flex-col gap-2 relative">
                  {currentStep === steps.length - 1 && (
                    <p className="absolute left-1/2 -translate-x-1/2 top-[-1.25rem] text-xs text-yellow-600 dark:text-yellow-500 text-center whitespace-nowrap">
                      Final pricing will be confirmed in your custom quote
                    </p>
                  )}
                  <Button type="submit" disabled={isSubmitting} className="w-full">
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
              )}
            </div>
          </form>
        )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

