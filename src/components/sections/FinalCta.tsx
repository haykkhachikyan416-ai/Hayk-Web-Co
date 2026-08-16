import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { site } from '../../content/site'
import { Reveal } from '../ui/Reveal'

export function FinalCta() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="final-cta">
      <motion.div
        className="final-cta__line"
        data-testid="final-build-beam"
        aria-hidden="true"
        initial={reduceMotion ? false : { clipPath: 'inset(0 0 100% 0)' }}
        whileInView={reduceMotion ? undefined : { clipPath: 'inset(0)' }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: [0.77, 0, 0.18, 1] }}
      />
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
