import { site } from '../content/site'
import type { ContactValues } from './contact'

/**
 * Builds a mailto: draft containing everything the visitor already typed.
 *
 * When the endpoint fails, the alternative is telling someone who filled in
 * nine fields to "contact us directly" — i.e. to type it all again. This
 * hands their answers back to them instead.
 */
export function contactMailto(values: ContactValues): string {
  const blank = 'Not provided'
  const body = [
    `Name: ${values.name}`,
    `Business: ${values.businessName || blank}`,
    `Email: ${values.email || blank}`,
    `Phone: ${values.phone || blank}`,
    `Current website: ${values.currentWebsite || blank}`,
    `Business type: ${values.businessType || blank}`,
    `Main goal: ${values.mainGoal || blank}`,
    `Budget: ${values.budget || blank}`,
    `Submitted from: ${values.source || 'unknown'}`,
    '',
    'What they need:',
    values.projectDescription,
  ].join('\n')

  const subjectLabel = values.businessName || values.name
  const subject = subjectLabel
    ? `Website review request — ${subjectLabel}`
    : 'Website review request'

  // encodeURIComponent leaves these RFC 3986 sub-delimiters alone, and some
  // mail clients treat them as parameter separators mid-body.
  const encode = (value: string) =>
    encodeURIComponent(value).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16)}`)

  return `mailto:${site.email}?subject=${encode(subject)}&body=${encode(body)}`
}
