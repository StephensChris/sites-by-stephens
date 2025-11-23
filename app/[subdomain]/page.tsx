import { headers } from "next/headers"
import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
import { ClientHero } from "@/components/client/hero"
import { ClientAbout } from "@/components/client/about"
import { ClientGallery } from "@/components/client/gallery"
import { ClientContact } from "@/components/client/contact"
import { ClientFooter } from "@/components/client/footer"
import { BackToTop } from "@/components/client/back-to-top"
import { QRButton } from "@/components/client/qr-button"
import { AnimationFallback } from "@/components/client/animation-fallback"

// Force dynamic rendering - no caching for subdomain routes
export const dynamic = 'force-dynamic'
export const dynamicParams = true

interface ClientData {
  metadata: {
    title: string
    description: string
    subdomain: string
  }
  hero: any
  about: any
  gallery: any
  contact: any
  footer: any
  businessCard?: any
}

/**
 * Extract subdomain from host header as fallback
 * This ensures we can get the subdomain even if params don't work
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
  
  // Check for vercel.app preview domains (e.g., sweetsbysami-sitesbystephens.vercel.app)
  if (hostWithoutPort.includes(".vercel.app")) {
    const parts = hostWithoutPort.split(".")
    if (parts.length >= 3) {
      // Extract subdomain from vercel.app domain
      const subdomainPart = parts[0]
      if (subdomainPart.includes("-")) {
        // Format: subdomain-sitesbystephens.vercel.app
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
      console.log(`[ClientPage] No content found for subdomain: ${subdomain} at ${contentPath}`)
      return null
    }
    const fileContents = fs.readFileSync(contentPath, "utf8")
    return JSON.parse(fileContents) as ClientData
  } catch (error) {
    console.error(`[ClientPage] Error loading client data for ${subdomain}:`, error)
    return null
  }
}

/**
 * Client Page Component
 * 
 * This page handles all subdomain requests (e.g., sweetsbysami.sitesbystephens.com)
 * It reads the subdomain from both params (via middleware rewrite) and headers (as fallback)
 */
export default async function ClientPage({
  params,
}: {
  params: Promise<{ subdomain: string }>
}) {
  // Get subdomain from params (set by middleware rewrite)
  const resolvedParams = await params
  let subdomain = resolvedParams?.subdomain
  
  // Fallback: extract subdomain from headers if params didn't work
  if (!subdomain) {
    const headersList = await headers()
    const host = headersList.get("host")
    console.log(`[ClientPage] No subdomain in params, extracting from host: ${host}`)
    subdomain = extractSubdomainFromHost(host) || null
  }
  
  console.log(`[ClientPage] Processing request for subdomain: ${subdomain}`)
  
  if (!subdomain) {
    console.error("[ClientPage] No subdomain found in params or headers")
    notFound()
  }
  
  // Load client data
  const clientData = await getClientData(subdomain)
  
  if (!clientData) {
    console.log(`[ClientPage] Client data not found for subdomain: ${subdomain}`)
    notFound()
  }
  
  console.log(`[ClientPage] Successfully loaded client data for: ${subdomain}`)
  
  // Hide contact section for sweetsbysami (QR code is primary contact method)
  const showContactSection = subdomain !== "sweetsbysami"

  return (
    <main className="min-h-screen">
      <AnimationFallback />
      {clientData.contact?.businessCard && (
        <QRButton data={clientData.contact.businessCard} />
      )}
      <ClientHero 
        data={clientData.hero} 
        instagram={subdomain === "sweetsbysami" ? clientData.contact?.instagram : undefined}
      />
      <ClientAbout data={clientData.about} />
      <ClientGallery data={clientData.gallery} />
      {showContactSection && <ClientContact data={clientData.contact} />}
      <ClientFooter data={clientData.footer} />
      <BackToTop />
    </main>
  )
}

