# Email Setup Instructions

The request form is set up and ready to use, but you need to configure an email service to actually send emails.

## Current Status

Right now, the API route (`app/api/request/route.ts`) logs requests to the console. To receive actual emails, choose one of the options below.

## Option 1: Resend (Recommended - Easiest)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add to your `.env.local` file:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```
4. Install Resend:
   ```bash
   npm install resend
   ```
5. Update `app/api/request/route.ts` - uncomment the Resend code and add:
   ```typescript
   import { Resend } from 'resend'
   const resend = new Resend(process.env.RESEND_API_KEY)
   
   await resend.emails.send({
     from: 'onboarding@resend.dev', // Change to your verified domain
     to: 'stephens@sitesbystephens.com',
     subject: `New ${tier} Package Request from ${name}`,
     html: `
       <h2>New Website Request</h2>
       <p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Package:</strong> ${tier} (${price})</p>
       <p><strong>Requested:</strong> ${new Date().toLocaleString()}</p>
     `,
   })
   ```

## Option 2: SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Add to `.env.local`:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ```
4. Install SendGrid:
   ```bash
   npm install @sendgrid/mail
   ```
5. Update the API route to use SendGrid

## Option 3: Nodemailer with SMTP

1. Install Nodemailer:
   ```bash
   npm install nodemailer
   ```
2. Configure with your SMTP settings (Gmail, Outlook, etc.)
3. Update the API route accordingly

## Anti-Spam Protection

The form already includes:
- ✅ **Honeypot field** - Hidden field that bots fill (silently rejected)
- ✅ **Rate limiting** - Max 3 requests per hour per IP/email
- ✅ **Email validation** - Basic format checking
- ✅ **Server-side validation** - All checks happen on the server

## Testing

1. Start your dev server: `npm run dev`
2. Click "Request [Tier]" on any pricing card
3. Fill out the form
4. Check your server console for logged requests
5. Once email is configured, you'll receive actual emails

