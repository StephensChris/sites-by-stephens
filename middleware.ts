import { NextRequest, NextResponse } from "next/server"

/**
 * Extract subdomain from host header
 * 
 * Handles:
 * - Production: *.sitesbystephens.com
 * - Vercel preview: *-sitesbystephens.vercel.app
 * - Local dev: *.localhost
 */
function extractSubdomain(host: string | null): string | null {
  if (!host) {
    console.log(`[extractSubdomain] No host provided`)
    return null
  }

  // Remove port if present
  const hostWithoutPort = host.split(":")[0]
  console.log(`[extractSubdomain] Processing host: ${host}, without port: ${hostWithoutPort}`)

  // Check if it's a subdomain of sitesbystephens.com
  if (hostWithoutPort.endsWith(".sitesbystephens.com")) {
    const subdomain = hostWithoutPort.replace(".sitesbystephens.com", "")
    if (subdomain && subdomain !== "www" && subdomain !== "sitesbystephens") {
      console.log(`[extractSubdomain] Found sitesbystephens.com subdomain: ${subdomain}`)
      return subdomain
    }
  }

  // Check for Vercel preview domains (e.g., sweetsbysami-sitesbystephens.vercel.app)
  if (hostWithoutPort.includes(".vercel.app")) {
    const parts = hostWithoutPort.split(".")
    if (parts.length >= 3) {
      // Format: subdomain-sitesbystephens.vercel.app
      const subdomainPart = parts[0]
      if (subdomainPart.includes("-")) {
        const subdomain = subdomainPart.split("-")[0]
        if (subdomain && subdomain !== "www") {
          console.log(`[extractSubdomain] Found vercel.app subdomain: ${subdomain}`)
          return subdomain
        }
      }
    }
  }

  // For localhost development, check for subdomain.localhost
  // Handles: rvssa.localhost:3000, sweetsbysami.localhost:3000, etc.
  if (hostWithoutPort.includes(".localhost")) {
    const parts = hostWithoutPort.split(".")
    console.log(`[extractSubdomain] localhost detected, parts:`, parts)
    // If it's subdomain.localhost format (e.g., rvssa.localhost)
    if (parts.length > 1 && parts[0] !== "localhost" && parts[0] !== "www") {
      const subdomain = parts[0]
      console.log(`[extractSubdomain] Found localhost subdomain: ${subdomain}`)
      return subdomain
    }
    // If it's just localhost, return null (main site)
  }

  console.log(`[extractSubdomain] No subdomain found for host: ${hostWithoutPort}`)
  return null
}

/**
 * Middleware to handle subdomain routing
 * 
 * When a subdomain is detected (e.g., sweetsbysami.sitesbystephens.com),
 * this middleware rewrites the request to /[subdomain] route.
 * 
 * The rewrite preserves the original URL in the browser (no redirect),
 * so users see sweetsbysami.sitesbystephens.com/about, not sitesbystephens.com/sweetsbysami/about
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host")
  const subdomain = extractSubdomain(host)
  const pathname = request.nextUrl.pathname

  // Debug logging
  console.log(`[Middleware] Request: ${host}${pathname}, extracted subdomain: ${subdomain}`)

  // Don't rewrite static assets, API routes, or Next.js internals
  if (
    pathname.startsWith("/clients/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next()
  }

  // If there's a subdomain, rewrite to the client site route
  // The rewrite goes to /[subdomain] which matches app/[subdomain]/page.tsx
  if (subdomain) {
    const url = request.nextUrl.clone()
    // Rewrite to /[subdomain] route (e.g., /sweetsbysami)
    // For the root path, rewrite to /sweetsbysami
    // For other paths, we still rewrite to /sweetsbysami since client sites are single-page apps
    // If you need nested routes later, add app/[subdomain]/[...slug]/page.tsx
    url.pathname = `/${subdomain}`
    
    console.log(`[Middleware] Rewriting ${host}${pathname} to ${url.pathname} (subdomain: ${subdomain})`)
    
    return NextResponse.rewrite(url)
  }

  // For root domain (sitesbystephens.com), let it pass through to the main marketing site
  // This goes to app/page.tsx
  console.log(`[Middleware] No subdomain detected, passing through to main site`)
  return NextResponse.next()
}

/**
 * Middleware configuration
 * 
 * Matches all routes except:
 * - API routes (/api/*)
 * - Next.js static files (_next/static/*, _next/image/*)
 * - Favicon
 * - Client static assets (/clients/*)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - clients/ (client static assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|clients/).*)",
  ],
}
