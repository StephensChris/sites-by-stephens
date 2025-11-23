"use client"

import { createContext, useContext, useState, useRef, ReactNode } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
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
  const qrRef = useRef<HTMLDivElement>(null)

  const email = "contact@sitesbystephens.com"
  const website = "https://sitesbystephens.com"
  
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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-2xl font-bold">Get in Touch</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground mb-6 text-sm">
            Scan this QR code with your phone to automatically save our contact information
          </p>
          <div className="flex flex-col items-center gap-4">
            <div ref={qrRef} className="bg-white p-4 rounded-lg">
              <QRCodeSVG
                value={qrValue}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p className="font-medium mb-1">Email:</p>
              <p className="font-mono">{email}</p>
            </div>
            <Button onClick={downloadQR} variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ContactQRContext.Provider>
  )
}

