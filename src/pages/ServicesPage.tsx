import { Seo } from '../components/Seo'
import { PageCta } from '../components/sections/PageCta'
import { site } from '../content/site'
import type { ServiceGroup } from '../content/site'

const groups: { id: ServiceGroup; title: string; intro: string }[] = [
  {
    id: 'web',
    title: 'Websites',
    intro: 'Custom sites built to earn trust fast and make the next step obvious on any screen.',
  },
  {
    id: 'ai',
    title: 'AI automation',
    intro:
      'Practical AI and automation for the repetitive work: answering, following up, booking, and passing details along.',
  },
]

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Services"
        description="Custom websites, redesigns, local SEO foundations, and practical AI automation — AI assistants, instant lead follow-up, and booking — for local businesses."
        path="/services"
      />
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow">Services / websites + AI automation</p>
          <h1>Websites and AI automation, built around your business.</h1>
          <p>
            Pick the parts that remove friction for your customers and your team. Every service
            connects to a practical business benefit.
          </p>
        </div>
      </section>
      {groups.map((group) => {
        const services = site.services.filter((service) => service.group === group.id)
        return (
          <section
            className={`section service-group service-group--${group.id}`}
            id={group.id === 'ai' ? 'ai-automation' : undefined}
            aria-labelledby={`services-${group.id}`}
            key={group.id}
          >
            <div className="shell">
              <header className="service-group__head">
                <h2 id={`services-${group.id}`}>{group.title}</h2>
                <p>{group.intro}</p>
              </header>
              <div className="service-grid">
                {services.map((service, index) => (
                  <article className="service-card" key={service.title}>
                    <span className="service-card__number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3>{service.title}</h3>
                    <p>{service.summary}</p>
                    <div className="service-card__benefit">
                      <span>What this does for you</span>
                      <strong>{service.benefit}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )
      })}
      <PageCta
        eyebrow="Start with the bottleneck"
        title="Ready for a website that works harder?"
        body="A free review can identify the clearest improvement — on the site or behind it — before you commit to a project scope."
      />
    </>
  )
}
