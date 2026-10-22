import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../../content/site'
import { ProjectShowcase } from '../ProjectShowcase'
import { Reveal } from '../ui/Reveal'

export function WorkSection() {
  return (
    <section id="work" className="work" aria-labelledby="work-title">
      <div className="shell">
        <Reveal as="header" className="work__head" variant="blur">
          <p className="kicker">Launched work</p>
          <h2 id="work-title">
            Live now. <span>Go click around.</span>
          </h2>
          <p>Two real sites serving Los Angeles businesses today. Open either one and judge it.</p>
        </Reveal>

        <div className="project-list project-list--home">
          {site.projects.map((project, index) => (
            <Reveal variant="wipe" order={index} key={project.name}>
              <ProjectShowcase project={project} />
            </Reveal>
          ))}
        </div>

        <Link className="arrow-link" to="/work">
          Plus three demo concepts <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
