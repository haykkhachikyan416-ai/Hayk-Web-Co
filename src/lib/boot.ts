const PANEL_ID = 'boot-error-panel'

function detailFrom(reason: unknown): string {
  if (reason instanceof Error) return `${reason.name}: ${reason.message}`
  if (typeof reason === 'string') return reason
  try {
    return JSON.stringify(reason)
  } catch {
    return String(reason)
  }
}

/**
 * True once React has painted something of its own into the mount point. The
 * server-rendered `.boot-fallback` does not count, since that is the marker for
 * a startup that never happened.
 */
function hasRenderedApp(): boolean {
  const root = document.getElementById('root')
  if (!root) return false
  return Boolean(root.querySelector(':scope > *:not(.boot-fallback)'))
}

/**
 * Paints a readable failure panel straight into the DOM.
 *
 * Styles are inline on purpose: this has to stay legible when the stylesheet
 * itself is what failed to load, which is exactly the case that used to leave
 * an empty white page behind.
 */
export function showBootError(reason: unknown): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(PANEL_ID)) return

  const panel = document.createElement('div')
  panel.id = PANEL_ID
  panel.setAttribute('role', 'alert')
  panel.style.cssText = [
    'box-sizing:border-box',
    'position:fixed',
    'inset:0',
    'z-index:2147483647',
    'overflow:auto',
    'display:grid',
    'place-content:center',
    'gap:16px',
    'padding:32px',
    'color:#0b0d12',
    'background:#f7f7f4',
    'font-family:Arial,Helvetica,sans-serif',
    'text-align:center',
  ].join(';')

  const heading = document.createElement('strong')
  heading.style.cssText = 'font-size:clamp(22px,4vw,36px);line-height:1.15'
  heading.textContent = 'The website hit an error while starting.'

  const help = document.createElement('p')
  help.style.cssText = 'max-width:560px;margin:0 auto;line-height:1.6'
  help.textContent =
    'Reload the page. If this keeps happening, stop the dev server, run "npm run dev" again, and open the Local URL it prints.'

  const detail = document.createElement('pre')
  detail.style.cssText = [
    'max-width:min(720px,90vw)',
    'margin:0 auto',
    'padding:12px 16px',
    'overflow:auto',
    'border:1px solid #d7d9df',
    'border-radius:8px',
    'background:#fff',
    'color:#5e6574',
    'font-size:13px',
    'text-align:left',
    'white-space:pre-wrap',
    'word-break:break-word',
  ].join(';')
  detail.textContent = detailFrom(reason)

  panel.append(heading, help, detail)
  document.body.appendChild(panel)
}

/**
 * Takes over the page only when the alternative is a blank one.
 *
 * Once the site is on screen, a stray rejected promise is not worth hiding a
 * working page behind a full-screen panel, so it is logged and left alone. The
 * error boundary handles anything that actually breaks the rendered tree.
 */
export function reportBootFailure(reason: unknown): void {
  if (hasRenderedApp()) {
    console.error('Uncaught error after startup.', reason)
    return
  }
  showBootError(reason)
}

/**
 * Catches failures that happen outside React's own error handling — a chunk
 * that never downloads, a rejected dynamic import, a throw during bootstrap.
 */
export function installBootErrorHandlers(): void {
  if (typeof window === 'undefined') return

  window.addEventListener('error', (event) => {
    reportBootFailure(event.error ?? event.message)
  })

  window.addEventListener('unhandledrejection', (event) => {
    reportBootFailure(event.reason)
  })
}
