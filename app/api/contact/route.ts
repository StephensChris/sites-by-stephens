import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

// Simple in-memory rate limiting (in production, use Redis or similar)
const submissions = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const MAX_SUBMISSIONS_PER_HOUR = 5

function getRateLimitKey(ip: string, email: string): string {
  return `${ip}:${email.toLowerCase()}`
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const userSubmissions = submissions.get(key) || []
  
  // Remove submissions outside the time window
  const recentSubmissions = userSubmissions.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  )
  
  if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_HOUR) {
    return false
  }
  
  // Add current submission
  recentSubmissions.push(now)
  submissions.set(key, recentSubmissions)
  
  // Clean up old entries periodically (simple cleanup)
  if (submissions.size > 1000) {
    for (const [k, timestamps] of submissions.entries()) {
      const filtered = timestamps.filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
      )
      if (filtered.length === 0) {
        submissions.delete(k)
      } else {
        submissions.set(k, filtered)
      }
    }
  }
  
  return true
}

function getClientIP(request: NextRequest): string {
  // Try various headers for IP address
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfConnectingIP = request.headers.get("cf-connecting-ip")
  
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  return "unknown"
}

/**
 * Extract subdomain from host header
 * Returns null for main domain, subdomain string for client sites
 */
function extractSubdomain(host: string | null): string | null {
  if (!host) return null
  
  const hostWithoutPort = host.split(":")[0]
  
  // Check for sitesbystephens.com subdomain
  if (hostWithoutPort.endsWith(".sitesbystephens.com")) {
    const subdomain = hostWithoutPort.replace(".sitesbystephens.com", "")
    if (subdomain && subdomain !== "www" && subdomain !== "sitesbystephens") {
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
 * Contact Form API Route
 * 
 * Handles contact form submissions from both main site and client subdomains.
 * Sends emails via Resend to hello@sitesbystephens.com
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, phone, company } = body

    console.log("[Contact API] Received contact form submission:", { name, email, hasMessage: !!message })

    // Validation
    if (!name || !email || !message) {
      console.log("[Contact API] Validation failed: missing required fields")
      return NextResponse.json(
        { error: "Missing required fields. Please fill in name, email, and message." },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("[Contact API] Validation failed: invalid email format")
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimitKey = getRateLimitKey(clientIP, email)
    
    if (!checkRateLimit(rateLimitKey)) {
      console.log("[Contact API] Rate limit exceeded for:", email)
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    // Extract subdomain from request
    const host = request.headers.get("host")
    const subdomain = extractSubdomain(host)
    const siteLabel = subdomain ? `[${subdomain}]` : "[Main Site]"
    
    console.log("[Contact API] Processing submission from:", { host, subdomain, siteLabel })

    // Send email using Resend
    if (!process.env.RESEND_API_KEY) {
      console.error("[Contact API] RESEND_API_KEY is not set in environment variables")
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Escape HTML to prevent XSS
    const escapeHtml = (text: string) => {
      const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      }
      return text.replace(/[&<>"']/g, (m) => map[m])
    }

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')
    const safePhone = phone ? escapeHtml(phone) : null
    const safeCompany = company ? escapeHtml(company) : null

    try {
      const emailResult = await resend.emails.send({
        from: 'forms@sitesbystephens.com', // Using your verified domain
        to: 'hello@sitesbystephens.com', // Your personal email - UPDATE THIS if needed
        replyTo: email, // So you can reply directly to the client
        subject: `${siteLabel} New Contact Form Submission from ${safeName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
              New Contact Form Submission ${siteLabel}
            </h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e293b; margin-bottom: 15px; font-size: 18px;">Contact Information</h3>
              <p style="margin: 10px 0;"><strong>Name:</strong> ${safeName}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
              ${safePhone ? `<p style="margin: 10px 0;"><strong>Phone:</strong> ${safePhone}</p>` : ''}
              ${safeCompany ? `<p style="margin: 10px 0;"><strong>Company:</strong> ${safeCompany}</p>` : ''}
              ${subdomain ? `<p style="margin: 10px 0;"><strong>Site:</strong> ${subdomain}.sitesbystephens.com</p>` : '<p style="margin: 10px 0;"><strong>Site:</strong> Main Marketing Site</p>'}
              
              <h3 style="color: #1e293b; margin-top: 20px; margin-bottom: 15px; font-size: 18px;">Message</h3>
              <div style="background: white; padding: 15px; border-radius: 4px; white-space: pre-wrap; margin: 10px 0; line-height: 1.6;">
                ${safeMessage}
              </div>
              
              <p style="margin: 20px 0 10px 0; color: #64748b; font-size: 14px;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
              Reply directly to this email to respond to ${safeName}.
            </p>
          </div>
        `,
        text: `
New Contact Form Submission ${siteLabel}

Contact Information
Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}\n` : ''}${company ? `Company: ${company}\n` : ''}Site: ${subdomain ? `${subdomain}.sitesbystephens.com` : 'Main Marketing Site'}

Message
${message}

Submitted: ${new Date().toLocaleString()}

Reply to: ${email}
        `.trim(),
      })

      console.log("[Contact API] Email sent successfully:", emailResult)

      return NextResponse.json({
        success: true,
        message: "Message sent successfully",
      })
    } catch (emailError: any) {
      console.error("[Contact API] Error sending email:", emailError)
      
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[Contact API] Error processing request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

