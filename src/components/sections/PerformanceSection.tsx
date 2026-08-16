import { ArrowDownRight, MousePointerClick, SearchCheck, Smartphone } from 'lucide-react'
import { Reveal } from '../ui/Reveal'

export function PerformanceSection() {
  return (
    <section className="section performance-section">
      <span className="performance-section__label" aria-hidden="true">
        Mobile / Designed First
      </span>
      <div className="shell performance-grid">
        <Reveal className="performance-phone">
          <div className="phone-frame">
            <div className="phone-speaker" />
            <div className="phone-site">
              <span>NORTHLINE</span>
              <p>LOCAL CONSTRUCTION</p>
              <h3>Build with confidence.</h3>
              <span className="phone-site__cta" aria-hidden="true">
                GET A QUOTE
              </span>
              <div className="phone-site__image" />
            </div>
          </div>
          <span className="phone-caption">MOBILE / DESIGNED FIRST</span>
        </Reveal>
        <Reveal className="performance-copy">
          <p className="eyebrow">Performance & mobile</p>
          <h2>Built for the phone in your customer’s hand.</h2>
          <p>
            Most local decisions happen between a search result and a tap. The experience needs to
            stay fast, readable, and obvious at every step.
          </p>
          <ul>
            <li>
              <Smartphone />
              <div>
                <strong>Responsive by design</strong>
                <span>Layouts adapt intentionally across screen sizes.</span>
              </div>
            </li>
            <li>
              <MousePointerClick />
              <div>
                <strong>Tap-ready actions</strong>
                <span>Calls, forms, and bookings stay within easy reach.</span>
              </div>
            </li>
            <li>
              <SearchCheck />
              <div>
                <strong>Search-ready structure</strong>
                <span>Semantic pages and metadata support discovery.</span>
              </div>
            </li>
          </ul>
          <a className="text-link text-link--dark" href="#project-scope">
            See project scopes <ArrowDownRight size={17} />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
