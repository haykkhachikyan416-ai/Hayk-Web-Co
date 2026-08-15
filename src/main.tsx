import '@fontsource-variable/manrope'
import '@fontsource-variable/space-grotesk'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AppErrorBoundary } from './components/AppErrorBoundary'
import { installBootErrorHandlers, showBootError } from './lib/boot'
import './styles/index.css'

installBootErrorHandlers()

try {
  const container = document.getElementById('root')
  if (!container) throw new Error('The page is missing its <div id="root"> mount point.')

  createRoot(container).render(
    <StrictMode>
      <AppErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppErrorBoundary>
    </StrictMode>,
  )
} catch (error) {
  showBootError(error)
}
