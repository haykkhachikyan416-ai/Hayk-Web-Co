import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ContactForm } from '../components/ContactForm'
import { emptyContactValues, validateContact } from '../lib/contact'
import { site } from '../content/site'

const validValues = {
  ...emptyContactValues,
  name: 'Jamie Rivera',
  businessName: 'Rivera Electric',
  email: 'jamie@example.com',
  businessType: 'Contractor',
  mainGoal: 'Generate more quote requests',
  budget: '$3,000–$6,000',
  projectDescription: 'We need a clear website for residential electrical services in Glendale.',
}

/** The whole fast path: a name, one way to reply, and a sentence. */
async function completeFastPath(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^name/i), validValues.name)
  await user.type(screen.getByLabelText(/^email/i), validValues.email)
  await user.type(screen.getByLabelText(/what do you need/i), validValues.projectDescription)
}

afterEach(() => vi.restoreAllMocks())

describe('contact validation', () => {
  it('requires only a name, a reply route, and a description', () => {
    const missing = validateContact(emptyContactValues)
    expect(missing.name).toMatch(/name/i)
    expect(missing.contactMethod).toMatch(/email address or a phone/i)
    expect(missing.projectDescription).toMatch(/what you need/i)

    // The four fields moved to the optional block must never block a submit.
    expect(missing.businessName).toBeUndefined()
    expect(missing.businessType).toBeUndefined()
    expect(missing.mainGoal).toBeUndefined()
    expect(missing.budget).toBeUndefined()
    expect(missing.currentWebsite).toBeUndefined()
  })

  it('accepts either a phone or an email, and does not demand both', () => {
    const base = {
      ...emptyContactValues,
      name: 'Jamie Rivera',
      projectDescription: 'Need a new site for my shop.',
    }
    expect(validateContact({ ...base, email: 'jamie@example.com' })).toEqual({})
    expect(validateContact({ ...base, phone: '(747) 306-1007' })).toEqual({})
    // Neither one is the only rejection.
    expect(validateContact(base).contactMethod).toBeTruthy()
  })

  it('still rejects a malformed reply route, so the answer can actually arrive', () => {
    const base = {
      ...emptyContactValues,
      name: 'Jamie Rivera',
      projectDescription: 'Need a new site for my shop.',
    }
    expect(validateContact({ ...base, email: 'not-an-email' }).email).toMatch(/valid email/i)
    expect(validateContact({ ...base, phone: '12' }).phone).toMatch(/phone number/i)
    expect(validateContact({ ...validValues, email: 'not-an-email' }).email).toMatch(/valid email/i)
    expect(validateContact(validValues)).toEqual({})
  })

  it('validates a supplied website but tolerates an empty one', () => {
    const base = {
      ...emptyContactValues,
      name: 'Jamie Rivera',
      email: 'jamie@example.com',
      projectDescription: 'Need a new site for my shop.',
    }
    expect(validateContact({ ...base, currentWebsite: 'example.com' }).currentWebsite).toMatch(
      /complete website address/i,
    )
    expect(validateContact({ ...base, currentWebsite: '' }).currentWebsite).toBeUndefined()
  })
})

describe('contact form', () => {
  it('shows accessible errors without making a request', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /request my free review/i }))

    // Exactly three: name, the email/phone pair, and the description. A fourth
    // would mean an optional field had crept back into the required path.
    expect(screen.getAllByRole('alert')).toHaveLength(3)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('submits with only the fast-path fields filled in', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true, message: 'Received' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>,
    )
    await completeFastPath(user)
    await user.click(screen.getByRole('button', { name: /request my free review/i }))

    expect(await screen.findByRole('status')).toBeInTheDocument()
    const body = JSON.parse(String(fetchSpy.mock.calls[0]?.[1]?.body))
    expect(body.name).toBe(validValues.name)
    expect(body.email).toBe(validValues.email)
    // Untouched optional fields travel as empty strings, not as blockers.
    expect(body.businessName).toBe('')
    expect(body.budget).toBe('')
    expect(body.source).toBe('contact-page')
  })

  it('confirms a response time rather than only clearing the form', async () => {
    const user = userEvent.setup()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true, message: 'Received' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>,
    )
    await completeFastPath(user)
    await user.click(screen.getByRole('button', { name: /request my free review/i }))

    expect(await screen.findByRole('status')).toHaveTextContent(/within one business day/i)
    expect(screen.queryByRole('button', { name: /request my free review/i })).toBeNull()
  })

  it('shows loading and then a success state', async () => {
    const user = userEvent.setup()
    let resolveRequest!: (value: Response) => void
    vi.spyOn(globalThis, 'fetch').mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve
      }),
    )
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>,
    )
    await completeFastPath(user)

    await user.click(screen.getByRole('button', { name: /request my free review/i }))
    expect(screen.getByRole('button', { name: /sending your request/i })).toBeDisabled()

    resolveRequest(
      new Response(JSON.stringify({ ok: true, message: 'Received' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    expect(await screen.findByRole('status')).toHaveTextContent(/request received/i)
  })

  it('hands a failed submission back to the visitor instead of losing it', async () => {
    const user = userEvent.setup()
    // The exact shape the deployed endpoint returns with no mail provider set.
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: false, message: 'Email is not configured yet.' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>,
    )
    await completeFastPath(user)
    await user.click(screen.getByRole('button', { name: /request my free review/i }))

    const alert = await screen.findByRole('alert', { name: /submission error/i })
    // Server copy is written for whoever configured the deploy, not for a
    // customer who just filled in nine fields.
    expect(alert).not.toHaveTextContent(/not configured/i)

    const mailto = within(alert).getByRole('link', { name: /email the request/i })
    const href = decodeURIComponent(mailto.getAttribute('href')!)
    expect(href).toContain(`mailto:${site.email}`)
    // Every answer must survive, or the fallback just asks them to retype it.
    expect(href).toContain(validValues.name)
    expect(href).toContain(validValues.email)
    expect(href).toContain(validValues.projectDescription)
    // Optional fields left blank must not emit a dangling "Budget:" line.
    expect(href).toContain('Budget: Not provided')

    expect(within(alert).getByRole('link', { name: /call/i })).toHaveAttribute(
      'href',
      site.phoneHref,
    )
    expect(screen.getByRole('button', { name: /request my free review/i })).toBeEnabled()
  })

  it('offers the same fallback when the response is not JSON at all', async () => {
    const user = userEvent.setup()
    // The local Vite server has no function runtime and serves index.html.
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('<!doctype html>', {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      }),
    )
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>,
    )
    await completeFastPath(user)
    await user.click(screen.getByRole('button', { name: /request my free review/i }))

    const alert = await screen.findByRole('alert', { name: /submission error/i })
    expect(within(alert).getByRole('link', { name: /email the request/i })).toHaveAttribute(
      'href',
      expect.stringContaining(`mailto:${site.email}`),
    )
  })

  it('recovers from a network failure with no response to read', async () => {
    const user = userEvent.setup()
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'))
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>,
    )
    await completeFastPath(user)
    await user.click(screen.getByRole('button', { name: /request my free review/i }))

    const alert = await screen.findByRole('alert', { name: /submission error/i })
    expect(within(alert).getByRole('link', { name: /email the request/i })).toBeInTheDocument()
  })
})
