import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HomePage from '../pages/HomePage'

describe('homepage', () => {
  it('presents the complete conversion story', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', {
        name: /websites that turn local attention into real customers/i,
      }),
    ).toBeInTheDocument()
    const reviewLinks = screen.getAllByRole('link', { name: /get a free website review/i })
    expect(reviewLinks.length).toBeGreaterThanOrEqual(2)
    reviewLinks.forEach((link) => expect(link).toHaveAttribute('href', '/contact'))
    expect(screen.getByRole('link', { name: /view demo work/i })).toHaveAttribute('href', '/work')
    expect(
      screen.getByRole('heading', { name: /a website can look fine and still lose business/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /built for the way local customers decide/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /business-first, down to the details/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /three industries. three distinct decisions/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('Demo Concept')).toHaveLength(3)
    expect(
      screen.getByRole('heading', { name: /a clear path from review to launch/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('listitem', { name: /process step/i })).toHaveLength(4)
    expect(
      screen.getByRole('heading', { name: /built for the phone in your customer’s hand/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /right-sized around the work/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /questions before the first call/i }),
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: /website|project|google|phone|booking/i }).length,
    ).toBeGreaterThanOrEqual(5)
    expect(
      screen.getByRole('heading', {
        name: /your website should make the next customer easier to win/i,
      }),
    ).toBeInTheDocument()
  })

  it('identifies the hero transformation as an accessible visual', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('img', {
        name: /unfinished website transforming into a polished local business website/i,
      }),
    ).toBeInTheDocument()
  })
})
