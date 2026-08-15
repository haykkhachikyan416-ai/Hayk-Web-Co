import { Menu, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { site } from '../../content/site'
import { Logo } from '../ui/Logo'
import { ARROW_UP_RIGHT } from '../../lib/glyphs'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 36)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    // Escape would otherwise strand focus on a link that just became
    // invisible, leaving keyboard users with no idea where they are.
    toggleRef.current?.focus()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) close()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [open, close])

  // The panel is pinned below the header, so it needs the header's real
  // height. Hard-coded offsets drifted whenever the bar changed size —
  // between breakpoints, and on rotation, where it goes 69px to 77px.
  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const publish = () => {
      document.documentElement.style.setProperty(
        '--header-h',
        `${Math.round(header.getBoundingClientRect().height)}px`,
      )
    }
    publish()
    // resize/orientationchange alone cover every environment; the observer
    // is the precise signal where it exists, but it is not universal (jsdom
    // has none), so its absence must not take the header down.
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(publish)
    observer?.observe(header)
    window.addEventListener('resize', publish)
    window.addEventListener('orientationchange', publish)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', publish)
      window.removeEventListener('orientationchange', publish)
    }
  }, [])

  // A menu left open while rotating to a desktop width would keep the body
  // scroll lock with no visible way to release it.
  useEffect(() => {
    if (!open) return
    const desktop = window.matchMedia('(min-width: 861px)')
    const closeOnDesktop = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) setOpen(false)
    }
    closeOnDesktop(desktop)
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [open])

  return (
    <>
      <header className="site-header" data-scrolled={scrolled || open} ref={headerRef}>
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
            ref={toggleRef}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>
      {/*
        Deliberately a sibling of <header>, not a child. The header applies
        backdrop-filter when scrolled or open, and a filtered element becomes
        the containing block for its position:fixed descendants. Nested here,
        the panel resolved `inset` against the 69px header instead of the
        viewport and collapsed to zero height, spilling its links across the
        page. Keeping it outside means no ancestor filter can trap it.
      */}
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
              <span aria-hidden="true">{ARROW_UP_RIGHT}</span>
            </NavLink>
          ))}
          <NavLink className="button" to={site.primaryCta.to}>
            {site.primaryCta.label}
          </NavLink>
        </div>
      </nav>
    </>
  )
}
