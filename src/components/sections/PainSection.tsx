import { site } from '../../content/site'
import { Reveal } from '../ui/Reveal'
import { SectionIntro } from '../ui/SectionIntro'

export function PainSection() {
  return (
    <section className="section pain-section">
      <div className="shell">
        <Reveal>
          <SectionIntro
            eyebrow="What gets in the way"
            title="A website can look fine and still lose business."
            body="Local customers make fast judgments. The site needs to answer the right questions before hesitation becomes a back button."
          />
        </Reveal>
        <div className="pain-grid">
          {site.painPoints.map((pain, index) => (
            <Reveal key={pain.label} delay={index * 0.08} className="pain-card">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p className="pain-card__label">{pain.label}</p>
              <h3>{pain.title}</h3>
              <p>{pain.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
