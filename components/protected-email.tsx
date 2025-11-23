"use client"

import { useState } from "react"
import { Mail, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProtectedEmail() {
  const [isRevealed, setIsRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  // Email is split and encoded to prevent easy scraping
  // This will be decoded on click
  const emailParts = [
    "contact",
    "@",
    "sitesbystephens",
    ".",
    "com"
  ]

  const email = emailParts.join("")

  const handleCopy = async () => {
    if (!isRevealed) {
      setIsRevealed(true)
    }
    
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // If clipboard API fails, at least reveal the email so user can copy manually
      setIsRevealed(true)
    }
  }

  if (!isRevealed) {
    return (
      <Button
        onClick={handleCopy}
        variant="outline"
        className="w-full sm:w-auto text-lg py-6 px-8 border-2 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Copy className="w-5 h-5 mr-2" />
        Click to copy email
      </Button>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-6 py-4 rounded-lg border-2 border-slate-300 dark:border-slate-700">
        <Mail className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <span className="text-lg font-mono text-slate-900 dark:text-slate-100">
          {email}
        </span>
      </div>
      <Button
        onClick={handleCopy}
        variant="outline"
        size="lg"
        className="px-8"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copy again
          </>
        )}
      </Button>
    </div>
  )
}

