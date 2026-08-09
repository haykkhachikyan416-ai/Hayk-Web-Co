import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../../content/site'
import { ConceptBrowser } from '../ConceptBrowser'
import { Reveal } from '../ui/Reveal'
import { SectionIntro } from '../ui/SectionIntro'

export function WorkSection() {
  return (
    <section className="section work-section">
      <div className="shell">
        <Reveal>
          <SectionIntro
            eyebrow="Demo work"
            title="Three industries. Three distinct decisions."
            body="These original concepts are not client projects. They demonstrate how content, layout, and conversion paths change with the business."
            inverted
          />
        </Reveal>
        <div className="work-grid">
          {site.concepts.map((concept, index) => (
            <Reveal key={concept.name} delay={index * 0.07}>
              <ConceptBrowser concept={concept} index={index} />
            </Reveal>
          ))}
        </div>
        <Link className="inline-cta inline-cta--light" to="/work">
          View the concept details <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  )
}
