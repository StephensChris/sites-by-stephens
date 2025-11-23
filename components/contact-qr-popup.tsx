"use client"

import { createContext, useContext, useState, useRef, ReactNode } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Download, X, Mail, Copy, Check } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface ContactQRContextType {
  open: () => void
}

const ContactQRContext = createContext<ContactQRContextType | null>(null)

export function useContactQR() {
  const context = useContext(ContactQRContext)
  if (!context) {
    throw new Error("useContactQR must be used within ContactQRProvider")
  }
  return context
}

export function ContactQRProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [emailRevealed, setEmailRevealed] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const email = "contact@sitesbystephens.com"
  const website = "https://sitesbystephens.com"
  
  const handleRevealEmail = async () => {
    if (!emailRevealed) {
      setEmailRevealed(true)
    }
    
    try {
      await navigator.clipboard.writeText(email)
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2000)
    } catch (err) {
      // If clipboard API fails, at least reveal the email
      setEmailRevealed(true)
    }
  }
  
  // Reset email reveal state when modal closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setEmailRevealed(false)
      setEmailCopied(false)
    }
  }
  
  // Generate vCard format for QR code
  const generateVCard = () => {
    let vcard = "BEGIN:VCARD\n"
    vcard += "VERSION:3.0\n"
    vcard += "FN:Sites by Stephens\n"
    vcard += "ORG:Sites by Stephens\n"
    vcard += `EMAIL:${email}\n`
    vcard += `URL:${website}\n`
    vcard += "END:VCARD"
    return vcard
  }

  const qrValue = generateVCard()

  const downloadQR = () => {
    if (!qrRef.current) return

    const svg = qrRef.current.querySelector("svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = "sitesbystephens-contact-qr-code.png"
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <ContactQRContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <DialogTitle className="text-3xl font-bold mb-2">Get in Touch</DialogTitle>
              <p className="text-muted-foreground text-sm">
                Scan with your phone camera to add us to your contacts
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <div ref={qrRef} className="bg-white p-6 rounded-xl shadow-lg border-2 border-border">
              <QRCodeSVG
                value={qrValue}
                size={220}
                level="H"
                includeMargin={true}
              />
            </div>
            
            <div className="w-full space-y-4">
              {!emailRevealed ? (
                <Button
                  onClick={handleRevealEmail}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Click to reveal email
                </Button>
              ) : (
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-mono break-all">{email}</span>
                    </div>
                    <Button
                      onClick={handleRevealEmail}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                    >
                      {emailCopied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              <Button onClick={downloadQR} variant="outline" className="w-full" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ContactQRContext.Provider>
  )
}

