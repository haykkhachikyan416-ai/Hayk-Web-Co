import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { site } from '../content/site'
import HomePage from '../pages/HomePage'

describe('homepage', () => {
  it('keeps the visible hero rows synchronized with the accessible title', () => {
    const titleLines = (
      site.hero as typeof site.hero & {
        titleLines?: readonly string[]
      }
    ).titleLines

    expect(titleLines).toBeDefined()
    expect(titleLines?.join(' ')).toBe(site.hero.title)
  })

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
    expect(
      screen.getByText('Websites that turn', { selector: '.home-hero__title-line' }),
    ).toBeVisible()
    expect(
      screen.getByText('local attention', { selector: '.home-hero__title-line' }),
    ).toBeVisible()
    expect(
      screen.getByText('into real customers.', {
        selector: '.home-hero__title-line--signal',
      }),
    ).toBeVisible()
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
    expect(screen.getByTestId('process-progress')).toHaveAttribute('aria-hidden', 'true')
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
    expect(screen.getByTestId('final-build-beam')).toHaveAttribute('aria-hidden', 'true')
  })

  it('identifies the hero transformation as an accessible visual', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    const workshop = screen.getByRole('img', {
      name: /unfinished website transforming into a polished local business website/i,
    })
    expect(workshop).toBeInTheDocument()
    expect((workshop.querySelector('.workshop-window') as HTMLElement).style.transform).toContain(
      'var(--tilt-x)',
    )
  })

  it('keeps editorial status labels decorative and honest', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    const labels = [
      ['.workshop-stage__label', 'Demo Concept / Local Service'],
      ['.why-section__status', 'Checked / Built / Ready'],
      ['.performance-section__label', 'Mobile / Designed First'],
    ] as const

    labels.forEach(([selector, copy]) => {
      const label = container.querySelector(selector)
      expect(label).toHaveTextContent(copy)
      expect(label).toHaveAttribute('aria-hidden', 'true')
    })
  })

  it('does not apply pointer tilt without a fine hover pointer', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    const workshop = screen.getByRole('img', {
      name: /unfinished website transforming into a polished local business website/i,
    })
    const frame = workshop.querySelector('.workshop-window') as HTMLElement

    vi.spyOn(workshop, 'getBoundingClientRect').mockReturnValue({
      bottom: 100,
      height: 100,
      left: 0,
      right: 100,
      top: 0,
      width: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    fireEvent.pointerMove(workshop, { clientX: 90, clientY: 10, pointerType: 'mouse' })

    expect(frame.style.getPropertyValue('--tilt-x')).toBe('')
    expect(frame.style.getPropertyValue('--tilt-y')).toBe('')
  })
})
