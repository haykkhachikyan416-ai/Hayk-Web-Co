import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { site } from '../content/site'

function renderRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('site routing', () => {
  it('renders the homepage immediately without a route-loading placeholder', () => {
    renderRoute('/')

    expect(screen.getByRole('heading', { level: 1, name: site.hero.title })).toBeInTheDocument()
    expect(screen.queryByRole('status', { name: /loading page/i })).not.toBeInTheDocument()
  })

  it('renders shared navigation and the services route', async () => {
    renderRoute('/services')

    expect(
      await screen.findByRole('heading', { name: /websites and ai automation, built around/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeInTheDocument()
    const reviewLinks = screen.getAllByRole('link', { name: site.primaryCta.label })
    expect(reviewLinks.length).toBeGreaterThanOrEqual(2)
    reviewLinks.forEach((link) => expect(link).toHaveAttribute('href', '/contact'))
  })

  it('labels all portfolio examples honestly', async () => {
    renderRoute('/work')

    expect(
      await screen.findByRole('heading', {
        name: /sites that are live, and concepts that show the thinking/i,
      }),
    ).toBeInTheDocument()

    // The separation is the whole point: speculative work stays labelled as
    // speculative, and real work is never dressed up as more than it is.
    expect(screen.getAllByText('Demo Concept')).toHaveLength(3)
    expect(screen.getAllByText('Live site')).toHaveLength(2)

    // Concepts must still carry the not-a-client disclosure.
    expect(screen.getByText(/these are not client projects/i)).toBeInTheDocument()
  })

  it('links the launched work to the real sites it claims to have built', async () => {
    renderRoute('/work')
    await screen.findByRole('heading', { name: /live client sites/i })

    for (const domain of ['houseglassla.com', 'laglass.org']) {
      const link = screen.getByRole('link', { name: new RegExp(`visit ${domain}`, 'i') })
      expect(link).toHaveAttribute('href', expect.stringContaining(domain))
      // Opening a client's live site must not navigate the portfolio away.
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    }
  })

  it.each(['/', '/work', '/services'])(
    'states no outcome it cannot evidence on %s',
    async (path) => {
      renderRoute(path)
      await screen.findByRole('heading', { level: 1 })

      // No invented metrics, rankings, revenue, or client quotes. There is no
      // data behind any of these yet, and the concepts' honesty depends on the
      // real work staying equally plain.
      const body = document.body.textContent ?? ''
      for (const claim of [/\d+\s*%/, /\bROI\b/i, /increased?\s+(sales|leads|traffic)/i, /#1\b/]) {
        expect(body).not.toMatch(claim)
      }
    },
  )

  it('renders a useful custom 404 route', async () => {
    renderRoute('/missing-page')

    expect(
      await screen.findByRole('heading', { name: /this page missed the route/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /return home/i })).toHaveAttribute('href', '/')
  })
})
