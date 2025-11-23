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
    const { name, email, message, pages, seoLevel, deliveryTime, theme, supportLevel, features, customFeaturesText, estimatedPrice } = body

    // Validation
    if (!name || !email || !pages || !seoLevel || !deliveryTime || !theme || !supportLevel) {
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
    if (!process.env.RESEND_API_KEY) {
      console.error("[Request API] RESEND_API_KEY is not set in environment variables")
      console.error("[Request API] Available env vars:", Object.keys(process.env).filter(k => k.includes('RESEND')))
      
      // Provide helpful error message
      const isDevelopment = process.env.NODE_ENV === 'development'
      const errorMessage = isDevelopment
        ? "Email service not configured. Please add RESEND_API_KEY to your .env.local file for local development."
        : "Email service not configured. Please check your Vercel environment variables."
      
      return NextResponse.json(
        { error: errorMessage },
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
    const safePages = escapeHtml(pages)
    const safeSeoLevel = escapeHtml(seoLevel)
    const safeDeliveryTime = escapeHtml(deliveryTime)
    const safeTheme = escapeHtml(theme)
    const safeSupportLevel = escapeHtml(supportLevel)
    const safeMessage = message ? escapeHtml(message).replace(/\n/g, '<br>') : ''
    const safeCustomFeaturesText = customFeaturesText ? escapeHtml(customFeaturesText).replace(/\n/g, '<br>') : ''
    const safeEstimatedPrice = estimatedPrice ? `$${estimatedPrice}` : 'Not calculated'
    
    // Format selected features
    const selectedFeatures = features ? Object.entries(features)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => {
        // Convert camelCase to readable format
        return key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim()
      }) : []

    try {
      const featuresList = selectedFeatures.length > 0 
        ? `<ul style="margin: 10px 0; padding-left: 20px;">${selectedFeatures.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>`
        : '<p style="margin: 10px 0; color: #64748b; font-style: italic;">(No additional features selected)</p>'

      const emailResult = await resend.emails.send({
        from: 'noreply@sitesbystephens.com', // Using your verified domain - change if you verified a different address
        to: 'contact@sitesbystephens.com', // Your Zoho email address
        replyTo: email, // So you can reply directly to the client
        subject: `New Website Request from ${safeName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
              New Website Request
            </h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e293b; margin-bottom: 15px; font-size: 18px;">Contact Information</h3>
              <p style="margin: 10px 0;"><strong>Name:</strong> ${safeName}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
              
              <h3 style="color: #1e293b; margin-top: 20px; margin-bottom: 15px; font-size: 18px;">Website Configuration</h3>
              <p style="margin: 10px 0;"><strong>Pages:</strong> ${safePages}</p>
              <p style="margin: 10px 0;"><strong>Theme:</strong> ${safeTheme}</p>
              <p style="margin: 10px 0;"><strong>SEO Level:</strong> ${safeSeoLevel}</p>
              <p style="margin: 10px 0;"><strong>Support Level:</strong> ${safeSupportLevel}</p>
              <p style="margin: 10px 0;"><strong>Delivery Time:</strong> ${safeDeliveryTime}</p>
              <p style="margin: 10px 0;"><strong>Estimated Price:</strong> ${safeEstimatedPrice}</p>
              
              <h3 style="color: #1e293b; margin-top: 20px; margin-bottom: 15px; font-size: 18px;">Selected Features</h3>
              ${featuresList}
              ${safeCustomFeaturesText ? `<h4 style="color: #1e293b; margin-top: 15px; margin-bottom: 10px; font-size: 16px;">Custom Features Details:</h4><p style="background: white; padding: 15px; border-radius: 4px; white-space: pre-wrap; margin: 10px 0;">${safeCustomFeaturesText}</p>` : ''}
              
              ${safeMessage ? `<h3 style="color: #1e293b; margin-top: 20px; margin-bottom: 15px; font-size: 18px;">Additional Details</h3><p style="background: white; padding: 15px; border-radius: 4px; white-space: pre-wrap; margin: 10px 0;">${safeMessage}</p>` : ''}
              
              <p style="margin: 20px 0 10px 0; color: #64748b; font-size: 14px;"><strong>Requested:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
              Reply directly to this email to respond to ${safeName}.
            </p>
          </div>
        `,
        text: `
New Website Request

Contact Information
Name: ${name}
Email: ${email}

Website Configuration
Pages: ${pages}
Theme: ${theme}
SEO Level: ${seoLevel}
Support Level: ${supportLevel}
Delivery Time: ${deliveryTime}
Estimated Price: ${estimatedPrice ? `$${estimatedPrice}` : 'Not calculated'}

Selected Features
${selectedFeatures.length > 0 ? selectedFeatures.map(f => `- ${f}`).join('\n') : '(No additional features selected)'}
${customFeaturesText ? `\nCustom Features Details:\n${customFeaturesText}\n` : ''}

${message ? `\nAdditional Details:\n${message}\n` : ''}

Requested: ${new Date().toLocaleString()}

Reply to: ${email}
        `.trim(),
      })

      console.log("Email sent successfully:", emailResult)

      console.log("Email sent successfully for request from:", email)
    } catch (emailError: any) {
      console.error("Error sending email:", emailError)
      // Still log the request even if email fails
      console.log("New website request (email failed):", {
        name,
        email,
        message: message || "(no message)",
        pages,
        theme,
        seoLevel,
        supportLevel,
        deliveryTime,
        features,
        customFeaturesText,
        estimatedPrice,
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

