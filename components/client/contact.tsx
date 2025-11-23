"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ContactForm } from "@/components/contact-form"

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

                <div className="pt-6 border-t">
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base">Or send us a message</p>
                  <ContactForm className="mt-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

