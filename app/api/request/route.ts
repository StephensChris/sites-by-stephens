import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

// Simple in-memory rate limiting (in production, use Redis or similar)
const submissions = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const MAX_SUBMISSIONS_PER_HOUR = 3

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, tier, price } = body

    // Validation
    if (!name || !email || !tier || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimitKey = getRateLimitKey(clientIP, email)
    
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    // Send email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set in environment variables")
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      )
    }

    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev', // Change this to your verified domain in Resend
        to: 'contact@sitesbystephens.com',
        replyTo: email,
        subject: `New ${tier} Package Request from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
              New Website Request
            </h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p style="margin: 10px 0;"><strong>Package:</strong> ${tier} (${price})</p>
              ${message ? `<p style="margin: 10px 0;"><strong>Message:</strong></p><p style="background: white; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>` : ''}
              <p style="margin: 10px 0; color: #64748b; font-size: 14px;"><strong>Requested:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
              Reply directly to this email to respond to ${name}.
            </p>
          </div>
        `,
        text: `
New Website Request

Name: ${name}
Email: ${email}
Package: ${tier} (${price})
${message ? `\nMessage:\n${message}\n` : ''}
Requested: ${new Date().toLocaleString()}

Reply to: ${email}
        `.trim(),
      })

      console.log("Email sent successfully for request from:", email)
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      // Still log the request even if email fails
      console.log("New website request (email failed):", {
        name,
        email,
        message: message || "(no message)",
        tier,
        price,
        timestamp: new Date().toISOString(),
      })
      
      // Return error but don't fail the request completely
      // You might want to change this behavior
      return NextResponse.json(
        { error: "Failed to send email notification" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Request submitted successfully",
    })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

