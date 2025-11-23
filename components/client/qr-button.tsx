"use client"

import { useState, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

interface BusinessCardData {
  name: string
  phone?: string
  email?: string
  website: string
  instagram?: string
}

interface QRButtonProps {
  data: BusinessCardData
}

export function QRButton({ data }: QRButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  // Generate vCard format for QR code
  const generateVCard = () => {
    let vcard = "BEGIN:VCARD\n"
    vcard += "VERSION:3.0\n"
    vcard += `FN:${data.name}\n`
    vcard += `ORG:${data.name}\n`
    if (data.phone) {
      vcard += `TEL:${data.phone}\n`
    }
    if (data.email) {
      vcard += `EMAIL:${data.email}\n`
    }
    if (data.website) {
      vcard += `URL:${data.website}\n`
    }
    if (data.instagram) {
      vcard += `NOTE:Instagram: ${data.instagram}\n`
    }
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
      downloadLink.download = `${data.name.replace(/\s+/g, "-").toLowerCase()}-qr-code.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-40 h-12 w-12 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={() => setIsOpen(true)}
        aria-label="Save contact"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
          />
        </svg>
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4"
          onClick={() => setIsOpen(false)}
        >
          <Card
            className="w-full max-w-sm border-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold mb-1">Save Our Contact</h3>
                  <p className="text-muted-foreground text-xs">
                    Scan with your phone camera
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
                <div ref={qrRef} className="bg-white p-4 rounded-lg shadow-md border border-border">
                  <QRCodeSVG
                    value={qrValue}
                    size={180}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                
                <Button onClick={downloadQR} variant="outline" className="w-full" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

