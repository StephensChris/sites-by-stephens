import Link from "next/link"
import { Button } from "@/components/ui/button"

/**
 * Not Found Page for Client Subdomains
 * 
 * This page is shown when a subdomain is accessed but no content folder exists
 * for that subdomain (e.g., nonexistent.sitesbystephens.com)
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Site Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          This subdomain doesn&apos;t have a site configured yet. Please check the URL or contact
          us if you believe this is an error.
        </p>
        <Link href="https://sitesbystephens.com">
          <Button>Visit Sites by Stephens</Button>
        </Link>
      </div>
    </div>
  )
}

