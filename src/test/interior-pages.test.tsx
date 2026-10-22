import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { site } from '../content/site'
import AboutPage from '../pages/AboutPage'
import ServicesPage from '../pages/ServicesPage'
import WorkPage from '../pages/WorkPage'

const renderPage = (page: React.ReactNode) => render(<MemoryRouter>{page}</MemoryRouter>)

describe('interior pages', () => {
  it('connects the complete service catalog to customer benefits and a CTA', () => {
    renderPage(<ServicesPage />)
    expect(screen.getAllByRole('article')).toHaveLength(site.services.length)
    expect(screen.getByRole('heading', { level: 2, name: /^websites$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /^ai automation$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /local SEO foundations/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /ai website assistant/i })).toBeInTheDocument()
    expect(screen.getByText(/give search engines a clearer understanding/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /ready for a website that works harder/i }),
    ).toBeInTheDocument()
  })

  it('shows all concept details without implying client work', () => {
    renderPage(<WorkPage />)
    expect(screen.getAllByText('Demo Concept')).toHaveLength(3)
    expect(screen.getByText('Service-area clarity')).toBeInTheDocument()
    expect(screen.getByText('Reservation path')).toBeInTheDocument()
    expect(screen.getByText('Stylist profiles')).toBeInTheDocument()
    expect(screen.queryByText(/client result|case study/i)).not.toBeInTheDocument()
  })

  it('explains the working principles without fabricated company claims', () => {
    renderPage(<AboutPage />)
    expect(
      screen.getByRole('heading', { name: /design that earns attention/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /development that stays out of the way/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /strategy tied to a real business action/i }),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/years of experience|award-winning|hundreds of clients/i),
    ).not.toBeInTheDocument()
  })
})
