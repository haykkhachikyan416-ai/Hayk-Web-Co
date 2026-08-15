import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../../content/site'
import { Reveal } from '../ui/Reveal'
import { ARROW_UP_RIGHT } from '../../lib/glyphs'
import { SectionIntro } from '../ui/SectionIntro'

export function ScopeSection() {
  return (
    <section id="project-scope" className="section scope-section">
      <div className="shell">
        <Reveal>
          <SectionIntro
            eyebrow="Project scope"
            title="Right-sized around the work."
            body="No inflated packages. The scope follows the pages, content, integrations, and decisions your business actually needs."
          />
        </Reveal>
        <div className="scope-grid">
          {site.scopes.map((scope) => (
            <article className="scope-card" data-featured={scope.featured} key={scope.name}>
              {scope.featured && <span className="scope-card__flag">Most flexible</span>}
              <h3>{scope.name}</h3>
              <p>{scope.bestFor}</p>
              <ul>
                {scope.includes.map((item) => (
                  <li key={item}>
                    <Check size={16} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/contact">
                Discuss this scope <span>{ARROW_UP_RIGHT}</span>
              </Link>
            </article>
          ))}
        </div>
        <p className="scope-note">
          Every recommendation starts with the business need—not a preselected package.
        </p>
      </div>
    </section>
  )
}
