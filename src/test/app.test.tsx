import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '../App'

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

    expect(
      screen.getByRole('heading', {
        name: /websites that turn local attention into real customers/i,
      }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('status', { name: /loading page/i })).not.toBeInTheDocument()
  })

  it('renders shared navigation and the services route', async () => {
    renderRoute('/services')

    expect(
      await screen.findByRole('heading', { name: /website services built around your business/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeInTheDocument()
    const reviewLinks = screen.getAllByRole('link', { name: /get a free website review/i })
    expect(reviewLinks.length).toBeGreaterThanOrEqual(2)
    reviewLinks.forEach((link) => expect(link).toHaveAttribute('href', '/contact'))
  })

  it('labels all portfolio examples honestly', async () => {
    renderRoute('/work')

    expect(
      await screen.findByRole('heading', {
        name: /concepts built for the businesses people rely on/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('Demo Concept')).toHaveLength(3)
  })

  it('renders a useful custom 404 route', async () => {
    renderRoute('/missing-page')

    expect(
      await screen.findByRole('heading', { name: /this page missed the route/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /return home/i })).toHaveAttribute('href', '/')
  })
})
