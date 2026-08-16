import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Header } from '../components/layout/Header'

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )

afterEach(() => {
  document.body.style.overflow = ''
  vi.restoreAllMocks()
})

describe('mobile menu', () => {
  it('keeps the panel outside the header so no ancestor filter can trap it', () => {
    const { container } = renderHeader()

    const header = container.querySelector('.site-header')!
    const nav = container.querySelector('.mobile-nav')!

    // The header applies backdrop-filter when scrolled or open, and a
    // filtered element becomes the containing block for its fixed-position
    // descendants. Nested, the panel resolved `inset` against the 69px
    // header instead of the viewport and collapsed to zero height.
    expect(header.contains(nav)).toBe(false)
  })

  it('locks and releases body scroll as the menu opens and closes', async () => {
    const user = userEvent.setup()
    renderHeader()

    await user.click(screen.getByRole('button', { name: /open menu/i }))
    expect(document.body.style.overflow).toBe('hidden')

    await user.click(screen.getByRole('button', { name: /close menu/i }))
    expect(document.body.style.overflow).toBe('')
  })

  it('returns focus to the toggle when Escape closes the menu', async () => {
    const user = userEvent.setup()
    renderHeader()

    const toggle = screen.getByRole('button', { name: /open menu/i })
    await user.click(toggle)
    await user.keyboard('{Escape}')

    // Otherwise focus is stranded on a link that just became invisible.
    expect(screen.getByRole('button', { name: /open menu/i })).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })

  it('releases the scroll lock when a rotation crosses to a desktop width', async () => {
    const user = userEvent.setup()
    const listeners = new Set<(event: MediaQueryListEvent) => void>()
    let matches = false
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches,
          media: query,
          addEventListener: (_: string, fn: (event: MediaQueryListEvent) => void) => {
            listeners.add(fn)
          },
          removeEventListener: (_: string, fn: (event: MediaQueryListEvent) => void) => {
            listeners.delete(fn)
          },
          addListener: () => {},
          removeListener: () => {},
          onchange: null,
          dispatchEvent: () => false,
        }) as unknown as MediaQueryList,
    )

    renderHeader()
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    expect(document.body.style.overflow).toBe('hidden')

    // Rotating a phone to a desktop-width layout hides the panel via CSS.
    // Without this the lock persisted and the page became unscrollable.
    act(() => {
      matches = true
      listeners.forEach((fn) => fn({ matches: true } as MediaQueryListEvent))
    })

    expect(await screen.findByRole('button', { name: /open menu/i })).toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
  })

  it('renders arrows in text presentation rather than as emoji', () => {
    const { container } = renderHeader()

    const arrow = container.querySelector('.mobile-nav__links a span:last-child')!
    // Bare U+2197 defaults to a colour emoji on iOS; VS15 forces text form.
    expect(arrow.textContent).toBe('↗︎')
  })
})
