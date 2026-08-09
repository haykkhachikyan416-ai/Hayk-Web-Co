import { afterEach, describe, expect, it } from 'vitest'
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
})
