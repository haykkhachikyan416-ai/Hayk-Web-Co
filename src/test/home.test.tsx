import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { site } from '../content/site'
import HomePage from '../pages/HomePage'

const renderHome = () =>
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )

describe('homepage', () => {
  it('keeps the visible hero rows synchronized with the accessible title', () => {
    expect(site.hero.titleLines.join(' ')).toBe(site.hero.title)
  })

  it('leads with both offers in one heading', () => {
    renderHome()

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveAccessibleName(site.hero.title)
    expect(site.hero.title).toMatch(/websites/i)
    expect(site.hero.title).toMatch(/\bAI\b/)
    // The split rows are visual only, so a screen reader hears one sentence.
    heading
      .querySelectorAll('.hero__line')
      .forEach((line) => expect(line).toHaveAttribute('aria-hidden', 'true'))
    expect(heading.querySelectorAll('.hero__line')).toHaveLength(site.hero.titleLines.length)

    const reviewLinks = screen.getAllByRole('link', { name: site.primaryCta.label })
    expect(reviewLinks.length).toBeGreaterThanOrEqual(1)
    reviewLinks.forEach((link) => expect(link).toHaveAttribute('href', '/contact'))
    expect(screen.getByRole('link', { name: /see live work/i })).toHaveAttribute('href', '#work')
  })

  it('presents websites and AI automation as two equal pillars', () => {
    renderHome()

    const web = screen.getByRole('article', { name: /custom websites/i })
    const ai = screen.getByRole('article', { name: /ai automation/i })
    expect(within(web).getAllByRole('listitem').length).toBeGreaterThanOrEqual(3)
    expect(within(ai).getAllByRole('listitem').length).toBeGreaterThanOrEqual(3)
  })

  it('walks through an automation flow that is clearly labelled as a demo', () => {
    renderHome()

    const flow = screen.getByRole('region', { name: /while you.re on the job/i })
    expect(within(flow).getByText('Demo Concept')).toBeInTheDocument()
    expect(within(flow).getAllByRole('listitem', { name: /automation step/i })).toHaveLength(
      site.automationFlow.length,
    )
  })

  it('labels every illustrative AI conversation as a demo', () => {
    const { container } = renderHome()

    const demos = container.querySelectorAll('[data-demo]')
    expect(demos.length).toBeGreaterThanOrEqual(2)
    demos.forEach((demo) => expect(demo).toHaveTextContent('Demo Concept'))
  })

  it('shows the real launched sites and points to the concepts', () => {
    renderHome()

    const work = screen.getByRole('region', { name: /live now/i })
    expect(within(work).getAllByText('Live site')).toHaveLength(site.projects.length)
    expect(within(work).getByRole('link', { name: /demo concepts/i })).toHaveAttribute(
      'href',
      '/work',
    )
  })

  it('answers the AI questions a business owner will ask', () => {
    renderHome()

    expect(screen.getByRole('button', { name: /what can ai actually do/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /say something wrong to my customers/i }),
    ).toBeInTheDocument()
  })

  it('ends with the quick quote form so a lead never has to leave the page', () => {
    const { container } = renderHome()

    const start = container.querySelector('#start')
    expect(start).not.toBeNull()
    expect(within(start as HTMLElement).getByRole('form', { name: /quick quote/i })).toBeVisible()
  })

  it('stays short: no more than eight sections', () => {
    const { container } = renderHome()

    expect(container.querySelectorAll('section').length).toBeLessThanOrEqual(8)
  })

  it('keeps decorative motion out of the accessibility tree', () => {
    const { container } = renderHome()

    container
      .querySelectorAll('canvas, .marquee')
      .forEach((element) => expect(element).toHaveAttribute('aria-hidden', 'true'))
  })
})
