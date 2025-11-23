import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
import { ThemeInjector } from "@/components/client/theme-injector"
import "../../globals.css"

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

interface ClientData {
  metadata: {
    title: string
    description: string
    subdomain: string
  }
  fonts: {
    heading: string
    body: string
  }
  colors: Record<string, string>
}

async function getClientData(subdomain: string): Promise<ClientData | null> {
  try {
    const contentPath = path.join(process.cwd(), "content", subdomain, "data.json")
    if (!fs.existsSync(contentPath)) {
      return null
    }
    const fileContents = fs.readFileSync(contentPath, "utf8")
    return JSON.parse(fileContents) as ClientData
  } catch (error) {
    console.error(`Error loading client data for ${subdomain}:`, error)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>
}): Promise<Metadata> {
  const { subdomain } = await params
  const clientData = await getClientData(subdomain)

  if (!clientData) {
    return {
      title: "Site Not Found",
      description: "This site is not available",
    }
  }

  // Use cupcake favicon for Sweets by Sami, default for others
  const favicon = subdomain === "sweetsbysami" ? "/cupcake.png" : "/icon.svg"
  
  return {
    title: clientData.metadata.title,
    description: clientData.metadata.description,
    icons: {
      icon: favicon,
      apple: favicon,
    },
  }
}

export default async function ClientLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ subdomain: string }>
}>) {
  const { subdomain } = await params
  const clientData = await getClientData(subdomain)

  if (!clientData) {
    notFound()
  }

  return (
    <div className={`${playfair.variable} ${inter.variable}`}>
      <ThemeInjector colors={clientData.colors} />
      {children}
    </div>
  )
}

