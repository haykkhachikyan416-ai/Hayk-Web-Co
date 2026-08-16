import { motion, useReducedMotion } from 'motion/react'
import { site } from '../../content/site'
import { Reveal } from '../ui/Reveal'
import { SectionIntro } from '../ui/SectionIntro'

export function ProcessSection() {
  const reduceMotion = useReducedMotion()

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
        <div className="process-progress" data-testid="process-progress" aria-hidden="true">
          <motion.span
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={reduceMotion ? undefined : { scaleX: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
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
