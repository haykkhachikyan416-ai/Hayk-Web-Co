import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../../content/site'
import { Logo } from '../ui/Logo'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <Logo inverted />
          <p>Clear websites for businesses people rely on.</p>
        </div>
        <div>
          <p className="footer-label">Explore</p>
          {site.navigation.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </div>
        <div>
          <p className="footer-label">Service area</p>
          <p>{site.serviceAreas.slice(0, 3).join(' · ')}</p>
          <a href={`mailto:${site.email}`}>
            {site.email}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          {site.phone && (
            <a href={site.phoneHref}>
              {site.phone}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
      <div className="shell site-footer__bottom">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <Link to="/privacy">Privacy</Link>
      </div>
    </footer>
  )
}
