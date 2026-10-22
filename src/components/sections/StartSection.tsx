import { ArrowUpRight, Mail, Phone } from 'lucide-react'
import { site } from '../../content/site'
import { QuickQuoteForm } from '../QuickQuoteForm'
import { SignalField } from '../effects/SignalField'
import { Reveal } from '../ui/Reveal'

export function StartSection() {
  return (
    <section id="start" className="start" aria-labelledby="start-title">
      <SignalField className="start__field" intensity={0.6} />
      <div className="shell start__grid">
        <Reveal className="start__copy" variant="blur">
          <p className="kicker kicker--light">Start here</p>
          <h2 id="start-title">
            Let’s build <span>yours.</span>
          </h2>
          <p>
            A new website, a redesign, or AI that answers your leads — tell me what you need and
            I’ll reply within one business day with honest next steps.
          </p>
          <ul className="start__direct">
            {site.phone && (
              <li>
                <a href={site.phoneHref}>
                  <Phone size={18} aria-hidden="true" />
                  {site.phone}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </li>
            )}
            <li>
              <a href={`mailto:${site.email}`}>
                <Mail size={18} aria-hidden="true" />
                {site.email}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </li>
          </ul>
        </Reveal>
        <Reveal className="start__form" variant="scale">
          <QuickQuoteForm />
        </Reveal>
      </div>
    </section>
  )
}
