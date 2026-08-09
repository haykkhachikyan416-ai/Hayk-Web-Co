import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../../content/site'
import { Reveal } from '../ui/Reveal'

export function FinalCta() {
  return (
    <section className="final-cta">
      <div className="final-cta__line" aria-hidden="true" />
      <Reveal className="shell final-cta__inner">
        <p className="eyebrow">A useful first step</p>
        <h2>Your website should make the next customer easier to win.</h2>
        <p>
          Get an honest review of what is working, what is getting in the way, and what to improve
          first.
        </p>
        <Link className="button" to={site.primaryCta.to}>
          {site.primaryCta.label}
          <ArrowUpRight size={18} />
        </Link>
      </Reveal>
    </section>
  )
}
