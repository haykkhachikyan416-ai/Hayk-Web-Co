import { afterEach, describe, expect, it, vi } from 'vitest'
import handler from '../../api/contact'

const validPayload = {
  name: 'Jamie Rivera',
  businessName: 'Rivera Electric',
  email: 'jamie@example.com',
  phone: '',
  currentWebsite: '',
  businessType: 'Contractor',
  mainGoal: 'Generate more quote requests',
  budget: '$3,000–$6,000',
  projectDescription: 'A clear website for residential electrical services.',
  company: '',
  startedAt: Date.now() - 5000,
}

const request = (body: object, method = 'POST') =>
  new Request('https://haykwebco.com/api/contact', {
    method,
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '192.0.2.10' },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  })

afterEach(() => {
  delete process.env.RESEND_API_KEY
  delete process.env.CONTACT_TO_EMAIL
  delete process.env.WEB3FORMS_ACCESS_KEY
  vi.restoreAllMocks()
})

describe('contact API', () => {
  it('rejects unsupported methods', async () => {
    const response = await handler(request({}, 'GET'))
    expect(response.status).toBe(405)
    expect(response.headers.get('Allow')).toBe('POST')
  })

  it('validates request data on the server', async () => {
    const response = await handler(request({ ...validPayload, email: 'invalid' }))
    expect(response.status).toBe(400)
  })

  it('accepts honeypot submissions without sending them', async () => {
    const response = await handler(request({ ...validPayload, company: 'spam value' }))
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ ok: true })
  })

  it('reports unavailable email configuration honestly', async () => {
    const response = await handler(request(validPayload))
    expect(response.status).toBe(503)
    expect(await response.json()).toMatchObject({ ok: false })
  })

  it('delivers through Web3Forms when only an access key is set', async () => {
    process.env.WEB3FORMS_ACCESS_KEY = 'test-access-key'
    const send = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('{}', { status: 200 }))

    const response = await handler(request(validPayload))

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ ok: true })
    const call = send.mock.calls[0]
    expect(call).toBeDefined()
    expect(call![0]).toBe('https://api.web3forms.com/submit')
    const body = JSON.parse(String((call![1] as RequestInit).body))
    expect(body.access_key).toBe('test-access-key')
    // Replying to the notification must reach the visitor, not Web3Forms.
    expect(body.replyto).toBe('jamie@example.com')
    expect(body.message).toContain('Rivera Electric')
  })

  it('does not claim success when Web3Forms rejects the request', async () => {
    process.env.WEB3FORMS_ACCESS_KEY = 'test-access-key'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 500 }))

    const response = await handler(request(validPayload))

    expect(response.status).toBe(502)
    expect(await response.json()).toMatchObject({ ok: false })
  })

  it('still honors the honeypot before contacting any mail service', async () => {
    process.env.WEB3FORMS_ACCESS_KEY = 'test-access-key'
    const send = vi.spyOn(globalThis, 'fetch')

    const response = await handler(request({ ...validPayload, company: 'spam value' }))

    expect(response.status).toBe(200)
    expect(send).not.toHaveBeenCalled()
  })
})
