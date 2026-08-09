import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ContactForm } from '../components/ContactForm'
import { emptyContactValues, validateContact } from '../lib/contact'

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

async function completeRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^name/i), validValues.name)
  await user.type(screen.getByLabelText(/business name/i), validValues.businessName)
  await user.type(screen.getByLabelText(/^email/i), validValues.email)
  await user.selectOptions(screen.getByLabelText(/business type/i), validValues.businessType)
  await user.selectOptions(screen.getByLabelText(/main goal/i), validValues.mainGoal)
  await user.selectOptions(screen.getByLabelText(/budget range/i), validValues.budget)
  await user.type(screen.getByLabelText(/project description/i), validValues.projectDescription)
}

afterEach(() => vi.restoreAllMocks())

describe('contact validation', () => {
  it('reports missing required fields and invalid email addresses', () => {
    const missing = validateContact(emptyContactValues)
    expect(missing.name).toMatch(/name/i)
    expect(missing.businessName).toMatch(/business name/i)
    expect(missing.projectDescription).toMatch(/tell us/i)

    expect(validateContact({ ...validValues, email: 'not-an-email' }).email).toMatch(/valid email/i)
    expect(validateContact(validValues)).toEqual({})
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

    expect(screen.getAllByRole('alert').length).toBeGreaterThan(3)
    expect(fetchSpy).not.toHaveBeenCalled()
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
    await completeRequiredFields(user)

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

  it('keeps the form available after a server error', async () => {
    const user = userEvent.setup()
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
    await completeRequiredFields(user)
    await user.click(screen.getByRole('button', { name: /request my free review/i }))

    expect(await screen.findByRole('alert', { name: /submission error/i })).toHaveTextContent(
      /not configured/i,
    )
    expect(screen.getByRole('button', { name: /request my free review/i })).toBeEnabled()
  })

  it('explains when the local Vite server has no function runtime', async () => {
    const user = userEvent.setup()
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
    await completeRequiredFields(user)
    await user.click(screen.getByRole('button', { name: /request my free review/i }))

    expect(await screen.findByRole('alert', { name: /submission error/i })).toHaveTextContent(
      /secure email endpoint is available after deployment/i,
    )
  })
})
