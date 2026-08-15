import { Component, type ErrorInfo, type ReactNode } from 'react'
import { site } from '../content/site'

type Props = { children: ReactNode }
type State = { error: Error | null }

/**
 * Without this, a throw inside any section unmounts the whole tree and leaves
 * an empty <div id="root">, which reads as a blank white page to a visitor.
 */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('The site failed to render.', error, info.componentStack)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="app-crash" role="alert">
        <h1>Something on this page failed to load.</h1>
        <p>
          Reload the page to try again. If it keeps failing, email{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a> and mention what you were doing.
        </p>
        <button type="button" onClick={() => window.location.reload()}>
          Reload the page
        </button>
        <pre>{`${error.name}: ${error.message}`}</pre>
      </div>
    )
  }
}
