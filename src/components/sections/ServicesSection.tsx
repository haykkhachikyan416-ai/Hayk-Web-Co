import {
  ArrowUpRight,
  PanelsTopLeft,
  RefreshCw,
  MousePointerClick,
  Smartphone,
  MapPin,
  CalendarCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../../content/site'
import { Reveal } from '../ui/Reveal'
import { SectionIntro } from '../ui/SectionIntro'

const icons: Record<string, LucideIcon> = {
  PanelsTopLeft,
  RefreshCw,
  MousePointerClick,
  Smartphone,
  MapPin,
  CalendarCheck,
}

export function ServicesSection() {
  return (
    <section className="section home-services">
      <div className="shell">
        <Reveal>
          <SectionIntro
            eyebrow="Core services"
            title="Built for the way local customers decide."
            body="Strategy, design, development, and practical integrations—organized around customer confidence and a clear next step."
            inverted
          />
        </Reveal>
        <div className="home-services__grid">
          {site.services.slice(0, 6).map((service, index) => {
            const Icon = icons[service.icon] ?? PanelsTopLeft
            return (
              <Reveal key={service.title} delay={index * 0.05} className="home-service">
                <Icon aria-hidden="true" />
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{service.title}</h3>
                <p>{service.benefit}</p>
              </Reveal>
            )
          })}
        </div>
        <Link className="inline-cta" to="/services">
          Explore every service <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  )
}
