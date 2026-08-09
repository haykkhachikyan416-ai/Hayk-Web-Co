import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { site } from '../../content/site'
import { BrowserWorkshop } from '../BrowserWorkshop'

export function HeroSection() {
  const reduceMotion = useReducedMotion()
  return (
    <section className="home-hero">
      <div className="home-hero__grid shell">
        <motion.div
          className="home-hero__copy"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="eyebrow">{site.hero.eyebrow}</p>
          <h1>{site.hero.title}</h1>
          <p className="home-hero__body">{site.hero.body}</p>
          <div className="hero-actions">
            <Link className="button" to={site.primaryCta.to}>
              {site.primaryCta.label}
              <ArrowUpRight size={18} />
            </Link>
            <Link className="text-link" to={site.secondaryCta.to}>
              {site.secondaryCta.label}
              <ArrowDown size={16} />
            </Link>
          </div>
        </motion.div>
        <BrowserWorkshop />
      </div>
      <div className="hero-ticker" aria-label="Core website priorities">
        <div>
          TRUST <span>●</span> MOBILE <span>●</span> LOCAL SEARCH <span>●</span> SPEED{' '}
          <span>●</span> CLEAR ACTION <span>●</span> TRUST <span>●</span> MOBILE
        </div>
      </div>
    </section>
  )
}
