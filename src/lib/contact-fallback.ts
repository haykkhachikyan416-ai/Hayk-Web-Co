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
  const body = [
    `Name: ${values.name}`,
    `Business: ${values.businessName}`,
    `Email: ${values.email}`,
    `Phone: ${values.phone || 'Not provided'}`,
    `Current website: ${values.currentWebsite || 'Not provided'}`,
    `Business type: ${values.businessType}`,
    `Main goal: ${values.mainGoal}`,
    `Budget: ${values.budget}`,
    '',
    'Project description:',
    values.projectDescription,
  ].join('\n')

  const subject = values.businessName
    ? `Website review request — ${values.businessName}`
    : 'Website review request'

  // encodeURIComponent leaves these RFC 3986 sub-delimiters alone, and some
  // mail clients treat them as parameter separators mid-body.
  const encode = (value: string) =>
    encodeURIComponent(value).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16)}`)

  return `mailto:${site.email}?subject=${encode(subject)}&body=${encode(body)}`
}
