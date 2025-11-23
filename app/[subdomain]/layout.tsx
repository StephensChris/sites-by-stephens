import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import fs from "fs"
import path from "path"
import { ThemeInjector } from "@/components/client/theme-injector"
import "../globals.css"

// Force dynamic rendering - no caching for subdomain routes
export const dynamic = 'force-dynamic'
export const dynamicParams = true

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

/**
 * Extract subdomain from host header as fallback
 */
function extractSubdomainFromHost(host: string | null): string | null {
  if (!host) return null
  
  const hostWithoutPort = host.split(":")[0]
  
  // Check for sitesbystephens.com subdomain
  if (hostWithoutPort.endsWith(".sitesbystephens.com")) {
    const subdomain = hostWithoutPort.replace(".sitesbystephens.com", "")
    if (subdomain && subdomain !== "www") {
      return subdomain
    }
  }
  
  // Check for vercel.app preview domains
  if (hostWithoutPort.includes(".vercel.app")) {
    const parts = hostWithoutPort.split(".")
    if (parts.length >= 3) {
      const subdomainPart = parts[0]
      if (subdomainPart.includes("-")) {
        const subdomain = subdomainPart.split("-")[0]
        if (subdomain) return subdomain
      }
    }
  }
  
  // For localhost development
  if (hostWithoutPort.includes(".localhost")) {
    const parts = hostWithoutPort.split(".")
    if (parts.length > 1 && parts[0] !== "localhost" && parts[0] !== "www") {
      return parts[0]
    }
  }
  
  return null
}

/**
 * Load client data from content folder
 */
async function getClientData(subdomain: string): Promise<ClientData | null> {
  try {
    const contentPath = path.join(process.cwd(), "content", subdomain, "data.json")
    if (!fs.existsSync(contentPath)) {
      return null
    }
    const fileContents = fs.readFileSync(contentPath, "utf8")
    return JSON.parse(fileContents) as ClientData
  } catch (error) {
    console.error(`[ClientLayout] Error loading client data for ${subdomain}:`, error)
    return null
  }
}

/**
 * Generate metadata for the client site
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  let subdomain: string | null = resolvedParams?.subdomain || null
  
  // Fallback: extract subdomain from headers
  if (!subdomain) {
    const headersList = await headers()
    const host = headersList.get("host")
    subdomain = extractSubdomainFromHost(host)
  }
  
  if (!subdomain) {
    return {
      title: "Site Not Found",
      description: "This site is not available",
    }
  }
  
  const clientData = await getClientData(subdomain)
  
  if (!clientData) {
    return {
      title: "Site Not Found",
      description: "This site is not available",
    }
  }
  
  // Use custom favicons for specific subdomains
  let favicon = "/icon.svg"
  if (subdomain === "sweetsbysami") {
    favicon = "/cupcake.png"
  } else if (subdomain === "rvssa") {
    favicon = "/clients/rvssa/images/target.png"
  }
  
  return {
    title: clientData.metadata.title,
    description: clientData.metadata.description,
    icons: {
      icon: favicon,
      apple: favicon,
    },
  }
}

/**
 * Client Layout Component
 * 
 * This layout wraps all client subdomain pages and injects theme colors
 */
export default async function ClientLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ subdomain: string }>
}>) {
  const resolvedParams = await params
  let subdomain: string | null = resolvedParams?.subdomain || null
  
  // Fallback: extract subdomain from headers
  if (!subdomain) {
    const headersList = await headers()
    const host = headersList.get("host")
    subdomain = extractSubdomainFromHost(host)
  }
  
  if (!subdomain) {
    notFound()
  }
  
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

