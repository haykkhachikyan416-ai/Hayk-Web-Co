import { Seo } from '../components/Seo'
import { ContactForm } from '../components/ContactForm'
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { site } from '../content/site'

export default function ContactPage() {
  return (
    <>
      <Seo
        title="Contact"
        description="Request a free, honest review of your business website and the clearest next step."
        path="/contact"
      />
      <section className="page-hero contact-hero">
        <div className="shell">
          <p className="eyebrow">Start with clarity</p>
          <h1>Let’s find the strongest next step for your website.</h1>
          <p>Tell us where the business is today and what you want the website to do better.</p>
        </div>
      </section>
      <section className="section contact-section">
        <div className="shell contact-layout">
          <aside className="contact-aside">
            <p className="eyebrow">What happens next</p>
            <h2>A useful review, not a generic pitch.</h2>
            <p>
              We’ll look at your goals and current site, then respond with the clearest practical
              next step.
            </p>
            <ul>
              <li>
                <ShieldCheck />
                <span>
                  <strong>Private by default</strong>Your information is used only for this inquiry.
                </span>
              </li>
              <li>
                <MapPin />
                <span>
                  <strong>Local perspective</strong>
                  {site.serviceAreas.slice(0, 3).join(', ')} and nearby.
                </span>
              </li>
              <li>
                <Mail />
                <span>
                  <strong>Prefer email?</strong>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </span>
              </li>
              {site.phone && (
                <li>
                  <Phone />
                  <span>
                    <strong>Rather talk?</strong>
                    <a href={site.phoneHref}>{site.phone}</a>
                  </span>
                </li>
              )}
            </ul>
          </aside>
          <ContactForm />
        </div>
      </section>
    </>
  )
}
