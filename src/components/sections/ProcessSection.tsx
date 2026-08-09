import { site } from '../../content/site'
import { Reveal } from '../ui/Reveal'
import { SectionIntro } from '../ui/SectionIntro'

export function ProcessSection() {
  return (
    <section className="section process-section">
      <div className="shell">
        <Reveal>
          <SectionIntro
            eyebrow="The process"
            title="A clear path from review to launch."
            body="Four deliberate stages keep decisions visible and the project moving."
          />
        </Reveal>
        <ol className="process-list">
          {site.process.map((item) => (
            <li aria-label={`Process step ${item.step}`} key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
