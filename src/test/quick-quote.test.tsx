import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { QuickQuoteForm } from '../components/QuickQuoteForm'
import { splitContactMethod } from '../lib/contact'

afterEach(() => vi.restoreAllMocks())

const renderForm = () =>
  render(
    <MemoryRouter>
      <QuickQuoteForm />
    </MemoryRouter>,
  )

const okResponse = () =>
  new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })

type FetchSpy = { mock: { calls: unknown[][] } }

/** The JSON actually handed to fetch, so tests assert on the wire payload
 *  rather than on component internals. */
const submittedBody = (spy: FetchSpy) =>
  JSON.parse(String((spy.mock.calls[0]?.[1] as RequestInit | undefined)?.body))

describe('splitContactMethod', () => {
  it('routes one combined field to the right column', () => {
    expect(splitContactMethod('jamie@example.com')).toEqual({
      email: 'jamie@example.com',
      phone: '',
    })
    expect(splitContactMethod('(747) 306-1007')).toEqual({ email: '', phone: '(747) 306-1007' })
    expect(splitContactMethod('   ')).toEqual({ email: '', phone: '' })
  })
})

describe('homepage quick quote', () => {
  it('posts to the same endpoint as the full form, tagged with its source', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okResponse())
    renderForm()

    await user.type(screen.getByLabelText(/^name/i), 'Jamie Rivera')
    await user.type(screen.getByLabelText(/email or phone/i), 'jamie@example.com')
    await user.type(screen.getByLabelText(/what do you need/i), 'New site for my plumbing company')
    await user.click(screen.getByRole('button', { name: /send it/i }))

    expect(await screen.findByRole('status')).toHaveTextContent(/within one business day/i)
    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({ method: 'POST' }),
    )

    const body = submittedBody(fetchSpy)
    expect(body.source).toBe('quick-quote-home')
    expect(body.name).toBe('Jamie Rivera')
    expect(body.email).toBe('jamie@example.com')
    expect(body.phone).toBe('')
  })

  it('accepts a phone number in the same combined field', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okResponse())
    renderForm()

    await user.type(screen.getByLabelText(/^name/i), 'Jamie Rivera')
    await user.type(screen.getByLabelText(/email or phone/i), '(747) 306-1007')
    await user.type(screen.getByLabelText(/what do you need/i), 'New site for my plumbing company')
    await user.click(screen.getByRole('button', { name: /send it/i }))

    await screen.findByRole('status')
    const body = submittedBody(fetchSpy)
    expect(body.phone).toBe('(747) 306-1007')
    expect(body.email).toBe('')
  })

  it('refuses to send without a reply route, and says so once', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    renderForm()

    await user.type(screen.getByLabelText(/^name/i), 'Jamie Rivera')
    await user.type(screen.getByLabelText(/what do you need/i), 'New site for my plumbing company')
    await user.click(screen.getByRole('button', { name: /send it/i }))

    const alerts = await screen.findAllByRole('alert')
    expect(alerts).toHaveLength(1)
    expect(alerts[0]).toHaveTextContent(/email address or a phone/i)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('shows a visible error when the endpoint fails', async () => {
    const user = userEvent.setup()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: false }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    renderForm()

    await user.type(screen.getByLabelText(/^name/i), 'Jamie Rivera')
    await user.type(screen.getByLabelText(/email or phone/i), 'jamie@example.com')
    await user.type(screen.getByLabelText(/what do you need/i), 'New site for my plumbing company')
    await user.click(screen.getByRole('button', { name: /send it/i }))

    const alert = await screen.findByRole('alert', { name: /quick quote error/i })
    expect(alert).toHaveTextContent(/didn’t send/i)
    // The form stays put so nothing typed is lost.
    expect(screen.getByRole('button', { name: /send it/i })).toBeEnabled()
  })

  it('survives a non-JSON response from a server with no function runtime', async () => {
    const user = userEvent.setup()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('<!doctype html>', { status: 404, headers: { 'Content-Type': 'text/html' } }),
    )
    renderForm()

    await user.type(screen.getByLabelText(/^name/i), 'Jamie Rivera')
    await user.type(screen.getByLabelText(/email or phone/i), 'jamie@example.com')
    await user.type(screen.getByLabelText(/what do you need/i), 'New site for my plumbing company')
    await user.click(screen.getByRole('button', { name: /send it/i }))

    expect(await screen.findByRole('alert', { name: /quick quote error/i })).toBeInTheDocument()
  })
})
