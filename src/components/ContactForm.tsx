import { CheckCircle2, LoaderCircle, Mail, Phone, Send } from 'lucide-react'
import { useState } from 'react'
import { cleanContactValues, emptyContactValues, validateContact } from '../lib/contact'
import type { ContactErrors, ContactValues } from '../lib/contact'
import { contactMailto } from '../lib/contact-fallback'
import { site } from '../content/site'

const businessTypes = [
  'Contractor',
  'Restaurant',
  'Barber or beauty',
  'Cleaning company',
  'Automotive business',
  'Professional service',
  'Another local business',
]
const goals = [
  'Generate more quote requests',
  'Increase calls',
  'Add online booking',
  'Improve local search visibility',
  'Replace an outdated website',
  'Launch a new business website',
]
const budgets = ['Under $3,000', '$3,000–$6,000', '$6,000–$10,000', '$10,000+', 'Not sure yet']

type FieldProps = {
  name: keyof ContactValues
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

function Field({ name, label, error, required, children }: FieldProps) {
  const errorId = `${name}-error`
  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactForm() {
  const [values, setValues] = useState<ContactValues>(() => ({
    ...emptyContactValues,
    startedAt: Date.now(),
  }))
  const [errors, setErrors] = useState<ContactErrors>({})
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [fallback, setFallback] = useState('')

  const update = (name: keyof ContactValues, value: string) => {
    setValues((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const inputProps = (name: keyof ContactValues) => ({
    id: name,
    name,
    value: String(values[name]),
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => update(name, event.target.value),
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleaned = cleanContactValues(values)
    const nextErrors = validateContact(cleaned)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      setState('idle')
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      )
      return
    }

    setState('loading')
    setMessage('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleaned),
      })
      const isJson = response.headers.get('content-type')?.includes('application/json')
      const data = isJson ? ((await response.json()) as { ok?: boolean; message?: string }) : null
      if (!response.ok || !data?.ok) throw new Error('send-failed')
      setState('success')
      setMessage(data.message || 'Request received. We will be in touch soon.')
    } catch {
      // Deliberately not surfacing the server's message. It is written for
      // whoever configured the deployment ("Email is not configured yet"),
      // which means nothing to a customer who just filled in nine fields.
      setState('error')
      setFallback(contactMailto(cleaned))
    }
  }

  if (state === 'success') {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 aria-hidden="true" />
        <p className="eyebrow">Request received</p>
        <h2>Thank you for the context.</h2>
        <p>{message}</p>
      </div>
    )
  }

  return (
    <form className="contact-form" noValidate onSubmit={handleSubmit}>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="company">Company website confirmation</label>
        <input {...inputProps('company')} tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={values.startedAt} />
      <div className="form-grid">
        <Field name="name" label="Name" required error={errors.name}>
          <input {...inputProps('name')} autoComplete="name" />
        </Field>
        <Field name="businessName" label="Business name" required error={errors.businessName}>
          <input {...inputProps('businessName')} autoComplete="organization" />
        </Field>
        <Field name="email" label="Email" required error={errors.email}>
          <input {...inputProps('email')} type="email" inputMode="email" autoComplete="email" />
        </Field>
        <Field name="phone" label="Phone">
          <input {...inputProps('phone')} type="tel" inputMode="tel" autoComplete="tel" />
        </Field>
        <Field name="currentWebsite" label="Current website" error={errors.currentWebsite}>
          <input
            {...inputProps('currentWebsite')}
            type="url"
            inputMode="url"
            placeholder="https://"
          />
        </Field>
        <Field name="businessType" label="Business type" required error={errors.businessType}>
          <select {...inputProps('businessType')}>
            <option value="">Choose one</option>
            {businessTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </Field>
        <Field name="mainGoal" label="Main goal" required error={errors.mainGoal}>
          <select {...inputProps('mainGoal')}>
            <option value="">Choose one</option>
            {goals.map((goal) => (
              <option key={goal}>{goal}</option>
            ))}
          </select>
        </Field>
        <Field name="budget" label="Budget range" required error={errors.budget}>
          <select {...inputProps('budget')}>
            <option value="">Choose one</option>
            {budgets.map((budget) => (
              <option key={budget}>{budget}</option>
            ))}
          </select>
        </Field>
        <Field
          name="projectDescription"
          label="Project description"
          required
          error={errors.projectDescription}
        >
          <textarea
            {...inputProps('projectDescription')}
            rows={6}
            placeholder="What is working today, and what needs to improve?"
          />
        </Field>
      </div>
      {state === 'error' && (
        <div
          className="form-message form-message--error"
          role="alert"
          aria-label="Submission error"
        >
          <p>
            <strong>That didn’t go through.</strong> Nothing you typed is lost — send it straight to
            us instead, and we’ll pick it up from there.
          </p>
          <div className="form-message__actions">
            {/* Carries every answer into the draft, so a failed send never
                asks the visitor to fill the form in a second time. */}
            <a className="button button--small" href={fallback}>
              <Mail size={16} aria-hidden="true" />
              Email the request
            </a>
            {site.phone && (
              <a className="button button--small button--ghost" href={site.phoneHref}>
                <Phone size={16} aria-hidden="true" />
                Call {site.phone}
              </a>
            )}
          </div>
        </div>
      )}
      <button className="button form-submit" type="submit" disabled={state === 'loading'}>
        {state === 'loading' ? (
          <>
            <LoaderCircle className="spin" />
            Sending your request…
          </>
        ) : (
          <>
            Request my free review
            <Send size={18} />
          </>
        )}
      </button>
      <p className="form-note">
        No pressure and no mailing list. Your details are used only to respond to this request.
      </p>
    </form>
  )
}
