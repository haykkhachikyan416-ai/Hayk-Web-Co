import { CheckCircle2, LoaderCircle, Send } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CONTACT_SOURCES,
  cleanContactValues,
  emptyContactValues,
  splitContactMethod,
  validateContact,
} from '../lib/contact'
import type { ContactErrors } from '../lib/contact'
import { site } from '../content/site'

/**
 * The three-field version of the contact form, closing the homepage.
 *
 * It posts to the same `/api/contact` endpoint as the full form and carries
 * `source: 'quick-quote-home'`, so these leads are distinguishable in the
 * notification email without needing a second handler or provider.
 *
 * Reply route is one combined "email or phone" input rather than two, which is
 * what keeps this to three fields. `splitContactMethod` decides which column it
 * lands in, so the server still receives the normal shape.
 *
 * This is an addition, not a replacement — the "Free website review" CTAs are
 * untouched, and this form's own footer links to the full one for anyone who
 * would rather give the detail up front.
 */
export function QuickQuoteForm() {
  const [name, setName] = useState('')
  const [contactMethod, setContactMethod] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<ContactErrors>({})
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  // Set once, at first render, so the server's minimum-fill-time check has a
  // real reading age to measure rather than the moment of submit.
  const [startedAt] = useState(() => Date.now())

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { email, phone } = splitContactMethod(contactMethod)
    const values = cleanContactValues({
      ...emptyContactValues,
      name,
      email,
      phone,
      projectDescription: note,
      source: CONTACT_SOURCES.quickQuoteHome,
      startedAt,
    })

    const nextErrors = validateContact(values)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      setState('idle')
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('.quick-quote [aria-invalid="true"]')?.focus(),
      )
      return
    }

    setErrors({})
    setState('loading')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const isJson = response.headers.get('content-type')?.includes('application/json')
      const data = isJson ? ((await response.json()) as { ok?: boolean }) : null
      if (!response.ok || !data?.ok) throw new Error('send-failed')
      setState('success')
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="quick-quote quick-quote--done" role="status">
        <CheckCircle2 aria-hidden="true" />
        <p className="quick-quote__done-title">Thanks — that came through.</p>
        <p className="quick-quote__done-body">
          I&rsquo;ll get back to you within one business day. Nothing else is needed from you right
          now.
        </p>
      </div>
    )
  }

  // One shared message for the email/phone pair: neither field is required on
  // its own, so an error on either alone would be misleading.
  const methodError = errors.contactMethod || errors.email || errors.phone

  return (
    <form className="quick-quote" onSubmit={handleSubmit} noValidate aria-label="Quick quote">
      <p className="quick-quote__title">Tell me about your project</p>
      <p className="quick-quote__lede">
        Three fields. No sales script — just what you need, and I&rsquo;ll reply.
      </p>

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="quick-company">Company website confirmation</label>
        <input id="quick-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="quick-quote__fields">
        <div className="form-field">
          <label htmlFor="quick-name">
            Name<span aria-hidden="true"> *</span>
          </label>
          <input
            id="quick-name"
            name="name"
            value={name}
            autoComplete="name"
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'quick-name-error' : undefined}
          />
          {errors.name && (
            <p id="quick-name-error" className="field-error" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="quick-contact">
            Email or phone<span aria-hidden="true"> *</span>
          </label>
          <input
            id="quick-contact"
            name="contactMethod"
            value={contactMethod}
            autoComplete="email"
            placeholder="you@example.com or (555) 123-4567"
            onChange={(event) => setContactMethod(event.target.value)}
            aria-invalid={Boolean(methodError)}
            aria-describedby={methodError ? 'quick-contact-error' : undefined}
          />
          {methodError && (
            <p id="quick-contact-error" className="field-error" role="alert">
              {methodError}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="quick-note">
            What do you need?<span aria-hidden="true"> *</span>
          </label>
          <textarea
            id="quick-note"
            name="projectDescription"
            rows={2}
            value={note}
            placeholder="A new site, or AI that answers my leads"
            onChange={(event) => setNote(event.target.value)}
            aria-invalid={Boolean(errors.projectDescription)}
            aria-describedby={errors.projectDescription ? 'quick-note-error' : undefined}
          />
          {errors.projectDescription && (
            <p id="quick-note-error" className="field-error" role="alert">
              {errors.projectDescription}
            </p>
          )}
        </div>
      </div>

      {state === 'error' && (
        <div
          className="form-message form-message--error"
          role="alert"
          aria-label="Quick quote error"
        >
          <p>
            <strong>That didn&rsquo;t send.</strong> Email{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>
            {site.phone && (
              <>
                {' '}
                or call <a href={site.phoneHref}>{site.phone}</a>
              </>
            )}
            .
          </p>
        </div>
      )}

      <button className="button quick-quote__submit" type="submit" disabled={state === 'loading'}>
        {state === 'loading' ? (
          <>
            <LoaderCircle className="spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            Send it
            <Send size={16} aria-hidden="true" />
          </>
        )}
      </button>

      <p className="quick-quote__note">
        {site.responsePromise} <Link to={site.primaryCta.to}>Prefer the full form?</Link>
      </p>
    </form>
  )
}
