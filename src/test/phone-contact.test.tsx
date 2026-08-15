import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Footer } from '../components/layout/Footer'
import ContactPage from '../pages/ContactPage'
import { site } from '../content/site'

const renderWithRouter = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('published phone number', () => {
  it('offers a dialable link on the contact page', () => {
    renderWithRouter(<ContactPage />)

    const link = screen.getByRole('link', { name: site.phone! })
    // A tel: href is what makes the number tappable on a phone.
    expect(link).toHaveAttribute('href', site.phoneHref)
  })

  it('repeats the number in the footer so it is reachable from every page', () => {
    const { container } = renderWithRouter(<Footer />)

    const footer = within(container.querySelector('footer')!)
    expect(footer.getByRole('link', { name: site.phone! })).toHaveAttribute('href', site.phoneHref)
  })

  it('keeps the tel: target in E.164 so it dials from any country', () => {
    // Punctuation in a tel: href is unreliable across dialers; the display
    // string keeps the human formatting instead.
    expect(site.phoneHref).toMatch(/^tel:\+[1-9]\d{7,14}$/)
    expect(site.phoneHref).toBe('tel:+17473061007')
  })

  it('shows the number in a readable format, not raw digits', () => {
    expect(site.phone).toBe('(747) 306-1007')
  })
})
