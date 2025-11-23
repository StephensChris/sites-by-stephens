import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function GET(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "RESEND_API_KEY is not set" },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const result = await resend.emails.send({
      from: 'noreply@sitesbystephens.com', // Change this to match what you verified in Resend
      to: 'contact@sitesbystephens.com',
      subject: 'Test Email from Your Website',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b;">Test Email</h2>
          <p>This is a test email from your website using your verified domain.</p>
          <p>If you received this, your Resend setup is working correctly!</p>
          <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
            Sent at: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
      text: `Test Email\n\nThis is a test email from your website using your verified domain.\n\nIf you received this, your Resend setup is working correctly!\n\nSent at: ${new Date().toLocaleString()}`,
    })

    return NextResponse.json({
      success: true,
      message: "Test email sent! Check your inbox at contact@sitesbystephens.com",
      emailId: result.id,
    })
  } catch (error: any) {
    console.error("Error sending test email:", error)
    return NextResponse.json(
      {
        error: "Failed to send test email",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    )
  }
}

