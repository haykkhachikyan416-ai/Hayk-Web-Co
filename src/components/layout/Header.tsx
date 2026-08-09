import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { site } from '../../content/site'
import { Logo } from '../ui/Logo'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 36)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <header className="site-header" data-scrolled={scrolled || open}>
      <div className="site-header__inner shell">
        <Logo inverted={!scrolled && !open} />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {site.navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <NavLink className="button button--small desktop-cta" to={site.primaryCta.to}>
          Free website review
        </NavLink>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobile navigation"
        data-open={open}
      >
        <div className="mobile-nav__links shell">
          {site.navigation.map((item) => (
            <NavLink key={item.to} to={item.to}>
              <span>{item.label}</span>
              <span aria-hidden="true">↗</span>
            </NavLink>
          ))}
          <NavLink className="button" to={site.primaryCta.to}>
            {site.primaryCta.label}
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
