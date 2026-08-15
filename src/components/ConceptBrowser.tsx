import type { CSSProperties } from 'react'
import type { Concept } from '../content/site'
import { ARROW_UP_RIGHT } from '../lib/glyphs'

export function ConceptBrowser({ concept, index }: { concept: Concept; index: number }) {
  const style = { '--concept-accent': concept.accent } as CSSProperties
  return (
    <article className={`concept-preview concept-preview--${index + 1}`} style={style}>
      <div className="concept-preview__meta">
        <span className="pill">Demo Concept</span>
        <span>{concept.category}</span>
      </div>
      <div className="concept-browser">
        <div className="browser-bar browser-bar--light">
          <span />
          <span />
          <span />
          <div className="browser-address">
            {concept.name.toLowerCase().replaceAll(' ', '')}.com
          </div>
        </div>
        <div className="concept-browser__canvas">
          <div className="concept-browser__nav">
            <b>{concept.name}</b>
            <span>Explore&nbsp;&nbsp; Contact</span>
          </div>
          <div className="concept-browser__body">
            <p>{concept.category}</p>
            <h3>{concept.tagline}</h3>
            <span className="concept-browser__button">START HERE {ARROW_UP_RIGHT}</span>
          </div>
          <div className="concept-browser__art">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
      <div className="concept-preview__copy">
        <h3>{concept.name}</h3>
        <p>{concept.description}</p>
        <ul>
          {concept.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}
