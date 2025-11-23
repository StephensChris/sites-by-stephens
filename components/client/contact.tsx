"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ContactData {
  title: string
  subtitle: string
  instagram: {
    handle: string
    url: string
  }
  cta: {
    text: string
  }
  buttons: Array<{
    text: string
    variant: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  }>
  businessCard?: {
    name: string
    phone?: string
    email?: string
    website: string
    instagram?: string
  }
}

interface ContactProps {
  data: ContactData
}

export function ClientContact({ data }: ContactProps) {
  return (
    <section id="contact" className="py-16 md:py-20 lg:py-24 bg-card min-h-[60vh] flex flex-col justify-center">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            data-animated
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-balance px-4 opacity-0" 
            style={{ animation: 'fadeInUp 0.7s ease-out 0.1s forwards' }}
          >
            {data.title}
          </h2>
          <p 
            data-animated
            className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 sm:mb-12 px-4 opacity-0" 
            style={{ animation: 'fadeInUp 0.7s ease-out 0.3s forwards' }}
          >
            {data.subtitle}
          </p>

          <Card className="border-2 mx-4">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-serif text-2xl font-semibold mb-2">Connect with us</h3>
                  <p className="text-muted-foreground leading-relaxed">{data.cta.text}</p>
                </div>

                <Button
                  size="lg"
                  className="w-full sm:w-auto mx-auto text-lg px-8 transition-all duration-300 hover:scale-105"
                  onClick={() => window.open(data.instagram.url, "_blank", "noopener,noreferrer")}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  {data.instagram.handle}
                </Button>

                <div className="pt-6 border-t">
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base">Or send us a message</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {data.buttons.map((button, index) => (
                      <Button
                        key={index}
                        variant={button.variant}
                        size="lg"
                        className="flex-1 bg-transparent border-2 text-sm sm:text-base"
                      >
                        {button.text}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

