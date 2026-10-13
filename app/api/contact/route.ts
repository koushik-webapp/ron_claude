import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Resend is instantiated per-request so the env var is read at runtime, not build time

// ── Simple in-memory rate limiter (5 req / IP / 60s) ─────────────────────────
const rateMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  // Drop expired entries now and then so the map can't grow without bound
  if (rateMap.size > 1000) {
    for (const [key, entry] of rateMap) if (now > entry.reset) rateMap.delete(key)
  }
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

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

// Strict enough that the address can't smuggle ?subject=/&body= into the mailto link
const EMAIL_RE = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

// The quote form appends "Please try again, or call (201) 850-2253."
const SEND_FAILED = 'We couldn’t send your request right now.'

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

  let body: Record<string, unknown>
  try {
    const parsed = await req.json()
    body = parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Spam protection — honeypot field should always be empty
  if (body.honeypot) {
    return NextResponse.json({ success: true }) // silently discard
  }

  const name = str(body.name)
  const email = str(body.email) // optional — the quote form marks it that way
  const phone = str(body.phone)
  const message = str(body.message)

  // Validation
  if (!name || !phone || !message) {
    return NextResponse.json(
      { error: 'Please fill in your name, phone number and request details.' },
      { status: 400 }
    )
  }

  // Input length limits
  if (name.length > 100 || email.length > 254 || phone.length > 40 || message.length > 5000) {
    return NextResponse.json(
      { error: 'Input exceeds maximum allowed length.' },
      { status: 400 }
    )
  }

  if (phone.replace(/\D/g, '').length < 7) {
    return NextResponse.json(
      { error: 'Please enter a valid phone number.' },
      { status: 400 }
    )
  }

  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address, or leave it blank.' },
      { status: 400 }
    )
  }

  // If the email can't be sent, the lead still lands in the server logs
  const logLead = (reason: string, detail?: unknown) =>
    console.error(`[contact/route] ${reason} — lead not emailed:`, { name, phone, email, message }, detail ?? '')

  const apiKey = process.env.RESEND_API_KEY
  const recipient = process.env.CONTACT_RECIPIENT
  if (!apiKey || !recipient) {
    logLead('RESEND_API_KEY or CONTACT_RECIPIENT is not set')
    return NextResponse.json({ error: SEND_FAILED }, { status: 500 })
  }

  // Sanitize all user input before inserting into HTML
  const safeName    = esc(name)
  const safeEmail   = esc(email)
  const safePhone   = esc(phone)
  const safeMessage = esc(message).replace(/\n/g, '<br/>')
  const service     = message.match(/^Service: (.+)$/m)?.[1]

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: 'Rainey Removal <noreply@raineyremoval.com>',

      to: recipient,

      // Hitting Reply answers the customer (when they gave an email)
      ...(email ? { replyTo: email } : {}),

      // Name + service in the subject so leads don't all collapse into one thread
      subject: `New Quote Request: ${name}${service ? ` (${service})` : ''}`.replace(/[\r\n]+/g, ' '),
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
                  ${email
                    ? `<a href="mailto:${safeEmail}" style="color: #22c55e;">${safeEmail}</a>`
                    : '<span style="color: #9ca3af;">Not provided</span>'}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <strong style="color: #374151; font-size: 13px;">Phone</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">
                  <a href="tel:${esc(phone.replace(/[^\d+]/g, ''))}" style="color: #22c55e;">${safePhone}</a>
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

    if (error) {
      logLead('Resend API error', error)
      return NextResponse.json({ error: SEND_FAILED }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    logLead('Resend request failed', err)
    return NextResponse.json({ error: SEND_FAILED }, { status: 500 })
  }
}
