import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function SiteLayout() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo({ top: 0, behavior: 'instant' }), [pathname])
  return (
    <>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
