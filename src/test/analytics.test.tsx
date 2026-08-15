import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '../App'

const renderHome = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )

describe('web analytics', () => {
  it('renders the site normally alongside the analytics mount', async () => {
    renderHome()

    expect(
      await screen.findByRole('heading', {
        name: /websites that turn local attention into real customers/i,
      }),
    ).toBeInTheDocument()
  })

  it('injects no tracking script in a non-production build', () => {
    // Verified against a real browser: mounting <Analytics /> outside a
    // Vercel deployment requests /_vercel/insights/script.js, which 404s on
    // every page load and fails the browser QA sweep's console check.
    expect(import.meta.env.PROD).toBe(false)

    renderHome()

    expect(document.querySelector('script[src*="/_vercel/insights"]')).toBeNull()
    // The development path would reach an external host the CSP forbids.
    expect(document.querySelector('script[src*="vercel-scripts.com"]')).toBeNull()
  })
})
