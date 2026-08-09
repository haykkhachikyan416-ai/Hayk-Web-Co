import { Check, Gauge, MessageSquareText, Search, Smartphone } from 'lucide-react'
import { Reveal } from '../ui/Reveal'
import { SectionIntro } from '../ui/SectionIntro'

const reasons = [
  {
    icon: MessageSquareText,
    title: 'Clear before clever',
    body: 'The message and next step stay understandable, even when a visitor is moving quickly.',
  },
  {
    icon: Smartphone,
    title: 'Mobile from the start',
    body: 'Phone layouts are designed as their own experience—not squeezed down from desktop.',
  },
  {
    icon: Search,
    title: 'Search-aware structure',
    body: 'Pages, headings, metadata, and local context give search engines useful signals.',
  },
  {
    icon: Gauge,
    title: 'Performance-minded build',
    body: 'Lean code, stable layouts, and restrained motion protect the experience on slower connections.',
  },
]

export function WhySection() {
  return (
    <section className="section why-section">
      <div className="shell why-grid">
        <Reveal>
          <SectionIntro
            eyebrow="Why HAYK WEB CO."
            title="Business-first, down to the details."
            body="A polished site only matters when it helps a real customer understand, trust, and act."
          />
        </Reveal>
        <div className="reason-list">
          {reasons.map(({ icon: Icon, title, body }) => (
            <Reveal className="reason" key={title}>
              <div className="reason__icon">
                <Icon />
                <Check className="reason__check" size={14} />
              </div>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
