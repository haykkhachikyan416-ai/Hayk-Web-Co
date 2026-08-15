import { Resend } from 'resend'
import { cleanContactValues, validateContact } from '../src/lib/contact.js'
import type { ContactValues } from '../src/lib/contact.js'

const windowMs = 10 * 60 * 1000
const requestLimit = 5
const maxBodyBytes = 20_000
const requestLog = new Map<string, number[]>()
const jsonHeaders = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' }

function json(body: { ok: boolean; message: string }, status: number, headers?: HeadersInit) {
  return Response.json(body, { status, headers: { ...jsonHeaders, ...headers } })
}

function getIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

function isRateLimited(ip: string, now: number) {
  const recent = (requestLog.get(ip) ?? []).filter((time) => now - time < windowMs)
  recent.push(now)
  requestLog.set(ip, recent)
  return recent.length > requestLimit
}

function parseBody(value: unknown): ContactValues | null {
  if (!value || typeof value !== 'object') return null
  const body = value as Record<string, unknown>
  const text = (key: string) => (typeof body[key] === 'string' ? body[key] : '')
  return {
    name: text('name'),
    businessName: text('businessName'),
    email: text('email'),
    phone: text('phone'),
    currentWebsite: text('currentWebsite'),
    businessType: text('businessType'),
    mainGoal: text('mainGoal'),
    budget: text('budget'),
    projectDescription: text('projectDescription'),
    company: text('company'),
    startedAt: typeof body.startedAt === 'number' ? body.startedAt : 0,
  }
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST')
    return json({ ok: false, message: 'Method not allowed.' }, 405, { Allow: 'POST' })
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > maxBodyBytes)
    return json({ ok: false, message: 'Request body is too large.' }, 413)

  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return json({ ok: false, message: 'Invalid request body.' }, 400)
  }
  const values = parseBody(rawBody)
  if (!values) return json({ ok: false, message: 'Invalid request body.' }, 400)
  if (values.company) return json({ ok: true, message: 'Request received.' }, 200)

  const now = Date.now()
  if (!values.startedAt || now - values.startedAt < 1500)
    return json({ ok: false, message: 'Please wait a moment and try again.' }, 429)
  const cleaned = cleanContactValues(values)
  if (Object.keys(validateContact(cleaned)).length)
    return json({ ok: false, message: 'Please check the form and try again.' }, 400)
  if (isRateLimited(getIp(request), now))
    return json({ ok: false, message: 'Too many requests. Please try again later.' }, 429)

  const formsubmitTarget = process.env.FORMSUBMIT_TARGET
  const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  if (!formsubmitTarget && !web3formsKey && (!apiKey || !to))
    return json(
      { ok: false, message: 'Email is not configured yet. Please contact HAYK WEB CO. directly.' },
      503,
    )

  const details = [
    `Name: ${cleaned.name}`,
    `Business: ${cleaned.businessName}`,
    `Email: ${cleaned.email}`,
    `Phone: ${cleaned.phone || 'Not provided'}`,
    `Website: ${cleaned.currentWebsite || 'Not provided'}`,
    `Business type: ${cleaned.businessType}`,
    `Main goal: ${cleaned.mainGoal}`,
    `Budget: ${cleaned.budget}`,
    '',
    'Project description:',
    cleaned.projectDescription,
  ].join('\n')
  const subject = `Website review request — ${cleaned.businessName}`
  const failed = json(
    { ok: false, message: 'The message service could not accept the request. Please try again.' },
    502,
  )
  const received = json(
    { ok: true, message: 'Request received. HAYK WEB CO. will follow up soon.' },
    200,
  )

  // FormSubmit needs no account at all — the target is either the receiving
  // address or the alias it issues after activation. Preferred when set.
  //
  // It answers HTTP 200 even when it refuses the submission, and reports
  // status as the STRING "true"/"false", so neither response.ok nor a plain
  // truthiness check can be trusted. Both were verified against the live
  // endpoint: an unactivated form returns 200 with {"success":"false"}.
  if (formsubmitTarget) {
    const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(formsubmitTarget)}`
    const sent = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: subject,
        // Replies go to the visitor rather than to FormSubmit.
        _replyto: cleaned.email,
        // reCAPTCHA would block a server-to-server POST.
        _captcha: 'false',
        _template: 'table',
        name: cleaned.name,
        business: cleaned.businessName,
        email: cleaned.email,
        phone: cleaned.phone || 'Not provided',
        website: cleaned.currentWebsite || 'Not provided',
        businessType: cleaned.businessType,
        mainGoal: cleaned.mainGoal,
        budget: cleaned.budget,
        message: cleaned.projectDescription,
      }),
    }).catch(() => null)
    if (!sent?.ok) return failed
    const payload = (await sent.json().catch(() => null)) as { success?: unknown } | null
    // String "false" is truthy, so compare against both real shapes.
    const accepted = payload?.success === true || payload?.success === 'true'
    return accepted ? received : failed
  }

  // Web3Forms needs only an access key, so it is also a zero-setup path: no
  // domain, no DNS records, no sending reputation to build.
  if (web3formsKey) {
    const sent = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: web3formsKey,
        subject,
        from_name: 'HAYK WEB CO. website',
        // Puts the visitor's address in Reply-To, so a reply reaches them.
        replyto: cleaned.email,
        message: details,
      }),
    }).catch(() => null)
    return sent?.ok ? received : failed
  }

  const result = await new Resend(apiKey!).emails.send({
    from: process.env.CONTACT_FROM_EMAIL || 'HAYK WEB CO. <onboarding@resend.dev>',
    to: [to!],
    replyTo: cleaned.email,
    subject,
    text: details,
  })
  return result.error ? failed : received
}
