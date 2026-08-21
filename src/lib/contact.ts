export type ContactValues = {
  name: string
  businessName: string
  email: string
  phone: string
  currentWebsite: string
  businessType: string
  mainGoal: string
  budget: string
  projectDescription: string
  /** Which entry point produced the lead, e.g. `quick-quote-hero`. */
  source: string
  company: string
  startedAt: number
}

/**
 * `contactMethod` is not a field. Email and phone are individually optional but
 * jointly required, so "you must give me one of these" belongs to the pair
 * rather than to either input.
 */
export type ContactErrorKey = keyof ContactValues | 'contactMethod'
export type ContactErrors = Partial<Record<ContactErrorKey, string>>

export const CONTACT_SOURCES = {
  contactPage: 'contact-page',
  quickQuoteHero: 'quick-quote-hero',
} as const

export const emptyContactValues: ContactValues = {
  name: '',
  businessName: '',
  email: '',
  phone: '',
  currentWebsite: '',
  businessType: '',
  mainGoal: '',
  budget: '',
  projectDescription: '',
  source: CONTACT_SOURCES.contactPage,
  company: '',
  startedAt: 0,
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Shortest useful note. Long enough to exclude "hi", short enough that a
 *  one-line answer ("Need a site for my shop") clears it. */
export const MIN_DESCRIPTION_LENGTH = 10

const countDigits = (value: string) => value.replace(/\D/g, '').length

/**
 * The single source of truth for both the browser and `api/contact.ts`, so the
 * server can never accept something the form rejected, or vice versa.
 *
 * Only three things are genuinely required: a name, one way to reply, and a
 * sentence about the work. Business type, main goal, budget, current website,
 * and business name are all optional — they make a reply more useful, but a
 * visitor who will not fill them in is a lead, not a rejection.
 */
export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {}
  const email = values.email.trim()
  const phone = values.phone.trim()

  if (!values.name.trim()) errors.name = 'Please enter your name.'

  if (!email && !phone) {
    errors.contactMethod = 'Add an email address or a phone number so we can reply.'
  }
  // Validate whatever they did give. A typo in the only reply route means the
  // response never arrives, which is worse than asking them to fix it now.
  if (email && !emailPattern.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (phone && countDigits(phone) < 7) {
    errors.phone = 'Please enter a phone number we can reach you on.'
  }

  if (values.projectDescription.trim().length < MIN_DESCRIPTION_LENGTH) {
    errors.projectDescription = 'Tell us briefly what you need.'
  }

  if (values.currentWebsite.trim()) {
    try {
      new URL(values.currentWebsite)
    } catch {
      errors.currentWebsite = 'Enter a complete website address, including https://.'
    }
  }

  return errors
}

export function cleanContactValues(values: ContactValues): ContactValues {
  return {
    ...values,
    name: values.name.trim(),
    businessName: values.businessName.trim(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim(),
    currentWebsite: values.currentWebsite.trim(),
    projectDescription: values.projectDescription.trim(),
    source: values.source.trim(),
    company: values.company.trim(),
  }
}

/**
 * One combined field on the hero form keeps the fast path to three inputs.
 * An "@" is the only reliable signal of intent here: a phone number never
 * contains one, and an address always does.
 */
export function splitContactMethod(value: string): { email: string; phone: string } {
  const trimmed = value.trim()
  if (!trimmed) return { email: '', phone: '' }
  return trimmed.includes('@') ? { email: trimmed, phone: '' } : { email: '', phone: trimmed }
}
