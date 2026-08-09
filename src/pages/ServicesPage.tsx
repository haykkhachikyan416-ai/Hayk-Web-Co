import { Seo } from '../components/Seo'
import { PageCta } from '../components/sections/PageCta'
import { site } from '../content/site'

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Services"
        description="Website strategy, design, development, local SEO foundations, and practical integrations for local businesses."
        path="/services"
      />
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow">Services / strategy through support</p>
          <h1>Website services built around your business.</h1>
          <p>
            Choose the parts that remove friction for your customers and your team. Every service
            connects to a practical business benefit.
          </p>
        </div>
      </section>
      <section className="section section--light">
        <div className="shell service-grid">
          {site.services.map((service, index) => (
            <article className="service-card" key={service.title}>
              <span className="service-card__number">{String(index + 1).padStart(2, '0')}</span>
              <h2>{service.title}</h2>
              <p>{service.summary}</p>
              <div className="service-card__benefit">
                <span>What this does for you</span>
                <strong>{service.benefit}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
      <PageCta
        eyebrow="Start with the bottleneck"
        title="Ready for a website that works harder?"
        body="A free review can identify the clearest improvement before you commit to a project scope."
      />
    </>
  )
}
