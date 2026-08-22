import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../../content/site'
import { ConceptBrowser } from '../ConceptBrowser'
import { ProjectShowcase } from '../ProjectShowcase'
import { Reveal } from '../ui/Reveal'
import { SectionIntro } from '../ui/SectionIntro'

export function WorkSection() {
  return (
    <section className="section work-section">
      <div className="shell">
        <Reveal>
          <SectionIntro
            eyebrow="Launched work"
            title="Two live sites, serving real Los Angeles businesses."
            body="Both are online now. Open either one and judge it for yourself."
            inverted
          />
        </Reveal>
        <div className="project-list project-list--home">
          {site.projects.map((project, index) => (
            <Reveal key={project.name} delay={index * 0.07}>
              <ProjectShowcase project={project} />
            </Reveal>
          ))}
        </div>
        <Reveal>
          <SectionIntro
            eyebrow="Demo concepts"
            title="Three industries. Three distinct decisions."
            body="Separately from the client work above, these original concepts are not client projects. They demonstrate how content, layout, and conversion paths change with the business."
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
          See all work and concepts <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  )
}
