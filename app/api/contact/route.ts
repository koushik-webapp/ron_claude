import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// ── Simple in-memory rate limiter (5 req / IP / 60s) ─────────────────────────
const rateMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  return false
}

// ── HTML escape to prevent XSS in email body ─────────────────────────────────
function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const { name, email, phone, message, honeypot } = body

    // Spam protection — honeypot field should always be empty
    if (honeypot) {
      return NextResponse.json({ success: true }) // silently discard
    }

    // Validation
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      )
    }

    // Input length limits
    if (name.length > 100 || email.length > 254 || phone.length > 30 || message.length > 5000) {
      return NextResponse.json(
        { error: 'Input exceeds maximum allowed length.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // Sanitize all user input before inserting into HTML
    const safeName    = esc(name.trim())
    const safeEmail   = esc(email.trim())
    const safePhone   = esc(phone.trim())
    const safeMessage = esc(message.trim()).replace(/\n/g, '<br/>')

    await resend.emails.send({
      // TEST SETUP: uses Resend's shared domain — no custom domain needed yet
      from: 'Rainey Removal <onboarding@resend.dev>',

      // ── Replace with business email after domain setup on Vercel ──
      // from: 'Rainey Removal <leads@yourdomain.com>',

      to: process.env.CONTACT_RECIPIENT!,

      // ── Later: forward replies to the customer ──
      // reply_to: safeEmail,

      subject: 'New Inquiry - Rainey Removal LLC',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 8px; overflow: hidden;">
          <div style="background: #111111; padding: 24px 32px; border-bottom: 3px solid #22c55e;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">
              New Quote Request
            </h1>
            <p style="color: #6b7280; margin: 4px 0 0; font-size: 13px;">Rainey Removal LLC</p>
          </div>

          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; width: 120px;">
                  <strong style="color: #374151; font-size: 13px;">Name</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">
                  ${safeName}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <strong style="color: #374151; font-size: 13px;">Email</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">
                  <a href="mailto:${safeEmail}" style="color: #22c55e;">${safeEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <strong style="color: #374151; font-size: 13px;">Phone</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">
                  <a href="tel:${safePhone}" style="color: #22c55e;">${safePhone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; vertical-align: top;">
                  <strong style="color: #374151; font-size: 13px;">Message</strong>
                </td>
                <td style="padding: 12px 0; color: #111827; font-size: 14px; line-height: 1.6;">
                  ${safeMessage}
                </td>
              </tr>
            </table>
          </div>

          <div style="background: #f3f4f6; padding: 16px 32px; text-align: center;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">
              This inquiry was submitted via the Rainey Removal LLC website.
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact/route] Resend error:', err)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or call us directly.' },
      { status: 500 }
    )
  }
}
