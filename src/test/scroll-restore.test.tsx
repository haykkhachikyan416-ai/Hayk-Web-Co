import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('route scroll restoration', () => {
  it('survives a browser whose scrollTo returns a promise', async () => {
    // Chrome 151 resolves a promise when the scroll settles. A concise-arrow
    // effect handed that promise back to React as its cleanup function, and
    // the resulting "destroy is not a function" took down the whole layout.
    vi.spyOn(window, 'scrollTo').mockImplementation(() => Promise.resolve() as unknown as void)
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', {
        name: /websites that turn local attention into real customers/i,
      }),
    ).toBeInTheDocument()
    expect(window.scrollTo).toHaveBeenCalled()

    const complaints = consoleError.mock.calls
      .map((call) => String(call[0]))
      .filter((message) => /must not return anything|destroy is not a function/i.test(message))
    expect(complaints).toEqual([])
  })
})
