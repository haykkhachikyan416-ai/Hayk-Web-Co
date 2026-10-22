import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../content/site'

/**
 * A real, launched client site.
 *
 * Deliberately a separate component from `ConceptBrowser` rather than a prop on
 * it. The two carry opposite claims — this one says "this is live, go look",
 * the other says "this is speculative" — and keeping them apart means no future
 * edit can accidentally put a `Demo Concept` pill on real work or drop it from
 * a concept.
 *
 * The browser chrome is the same visual device used for the concepts, so the
 * page still reads as one system; only the label, the real screenshot, and the
 * outbound link differ.
 */
export function ProjectShowcase({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <div className="project-card__meta">
        <span className="pill pill--live">Live site</span>
        <span>{project.category}</span>
      </div>

      <a
        className="project-card__frame"
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        // The heading link below carries the accessible name; this one is the
        // same destination, so it is hidden from the tab order rather than
        // announced twice.
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="browser-bar browser-bar--light">
          <span />
          <span />
          <span />
          <div className="browser-address">{project.domain}</div>
        </div>
        <span className="project-card__shot">
          <img
            src={project.image}
            alt={`The ${project.name} website homepage`}
            width={1600}
            height={1000}
            loading="lazy"
            decoding="async"
          />
        </span>
      </a>

      <div className="project-card__copy">
        <h3>
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            {project.name}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </h3>
        <p className="project-card__tagline">{project.tagline}</p>
        <p>{project.description}</p>
        <ul>
          {project.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <a
          className="inline-cta"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${project.domain}`}
        >
          Visit {project.domain} <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}
