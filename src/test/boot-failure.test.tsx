import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppErrorBoundary } from '../components/AppErrorBoundary'
import { reportBootFailure, showBootError } from '../lib/boot'

function Exploding(): never {
  throw new Error('section blew up')
}

function mountRoot(inner: string): void {
  const root = document.createElement('div')
  root.id = 'root'
  root.innerHTML = inner
  document.body.appendChild(root)
}

afterEach(() => {
  document.getElementById('boot-error-panel')?.remove()
  document.getElementById('root')?.remove()
  vi.restoreAllMocks()
})

describe('visible failure states', () => {
  it('replaces a crashed tree with a readable message instead of an empty page', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <AppErrorBoundary>
        <Exploding />
      </AppErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(/something on this page failed to load/i)
    expect(screen.getByRole('button', { name: /reload the page/i })).toBeInTheDocument()
    expect(screen.getByText(/section blew up/)).toBeInTheDocument()
  })

  it('paints a bootstrap failure panel even when no stylesheet is available', () => {
    showBootError(new Error('module load failed'))

    const panel = document.getElementById('boot-error-panel')
    expect(panel).not.toBeNull()
    expect(panel).toHaveTextContent(/the website hit an error while starting/i)
    expect(panel).toHaveTextContent(/module load failed/)
    expect(panel?.style.position).toBe('fixed')
  })

  it('does not stack duplicate panels when several errors fire', () => {
    showBootError(new Error('first'))
    showBootError(new Error('second'))

    expect(document.querySelectorAll('#boot-error-panel')).toHaveLength(1)
  })

  it('takes over the page when startup left only the boot fallback behind', () => {
    mountRoot('<div class="boot-fallback">could not start</div>')

    reportBootFailure(new Error('startup failed'))

    expect(document.getElementById('boot-error-panel')).not.toBeNull()
  })

  it('leaves a working page alone and only logs a late stray error', () => {
    mountRoot('<header>the site is on screen</header>')
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {})

    reportBootFailure(new Error('an aborted fetch, ten minutes in'))

    expect(document.getElementById('boot-error-panel')).toBeNull()
    expect(logged).toHaveBeenCalled()
  })
})
