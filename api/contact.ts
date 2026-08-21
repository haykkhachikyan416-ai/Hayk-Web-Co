import { cleanContactValues, validateContact } from '../src/lib/contact.js'
import type { ContactValues } from '../src/lib/contact.js'

/**
 * REQUIRED — do not remove.
 *
 * This handler has the Web signature: `(request: Request) => Response`. That is
 * the Edge runtime's contract. Vercel's *default* Node runtime calls the
 * default export as `(req, res)` with Node objects instead, and the mismatch
 * fails in two different ways that look unrelated:
 *
 *   - POST crashed on `request.headers.get(...)`, because Node's `req.headers`
 *     is a plain object with no `.get` — HTTP 500 FUNCTION_INVOCATION_FAILED
 *     on every submission, whatever the payload.
 *   - GET hung until the gateway gave up, because returning a `Response` writes
 *     nothing to Node's `res`, so the request was never answered.
 *
 * Both were observed against the live deployment. Every contact submission had
 * been failing; visitors only ever saw the mailto fallback.
 */
export const config = { runtime: 'edge' }

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
    source: text('source'),
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

  // Everything except the name and the note is optional now, so each line has
  // to survive being empty rather than emailing a dangling "Budget:".
  const blank = 'Not provided'
  const details = [
    `Name: ${cleaned.name}`,
    `Business: ${cleaned.businessName || blank}`,
    `Email: ${cleaned.email || blank}`,
    `Phone: ${cleaned.phone || blank}`,
    `Website: ${cleaned.currentWebsite || blank}`,
    `Business type: ${cleaned.businessType || blank}`,
    `Main goal: ${cleaned.mainGoal || blank}`,
    `Budget: ${cleaned.budget || blank}`,
    `Submitted from: ${cleaned.source || 'unknown'}`,
    '',
    'What they need:',
    cleaned.projectDescription,
  ].join('\n')
  // Business name is no longer guaranteed, so fall back to the person's name
  // before emitting a subject that trails off after the dash.
  const subjectLabel = cleaned.businessName || cleaned.name
  const subject = subjectLabel
    ? `Website review request — ${subjectLabel}`
    : 'Website review request'
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
        // Replies go to the visitor rather than to FormSubmit. A phone-only
        // lead has no address to reply to, and sending an empty _replyto makes
        // FormSubmit reject the whole submission — so omit the key entirely.
        ...(cleaned.email ? { _replyto: cleaned.email } : {}),
        // reCAPTCHA would block a server-to-server POST.
        _captcha: 'false',
        _template: 'table',
        name: cleaned.name,
        business: cleaned.businessName || blank,
        email: cleaned.email || blank,
        phone: cleaned.phone || blank,
        website: cleaned.currentWebsite || blank,
        businessType: cleaned.businessType || blank,
        mainGoal: cleaned.mainGoal || blank,
        budget: cleaned.budget || blank,
        submittedFrom: cleaned.source || 'unknown',
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
        ...(cleaned.email ? { replyto: cleaned.email } : {}),
        message: details,
      }),
    }).catch(() => null)
    return sent?.ok ? received : failed
  }

  // Imported here rather than at the top of the file. The Edge runtime has no
  // Node built-ins, and this package ships no edge export condition — a
  // top-level import risks failing at module load and taking down every
  // request, including the ones that never reach this branch.
  const { Resend } = await import('resend')
  const result = await new Resend(apiKey!).emails.send({
    from: process.env.CONTACT_FROM_EMAIL || 'HAYK WEB CO. <onboarding@resend.dev>',
    to: [to!],
    ...(cleaned.email ? { replyTo: cleaned.email } : {}),
    subject,
    text: details,
  })
  return result.error ? failed : received
}
