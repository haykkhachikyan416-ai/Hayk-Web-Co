import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { site } from '../../content/site'
import { Reveal } from '../ui/Reveal'
import { SectionIntro } from '../ui/SectionIntro'

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  return (
    <section className="section faq-section">
      <div className="shell faq-grid">
        <Reveal>
          <SectionIntro
            eyebrow="FAQ"
            title="Questions before the first call."
            body="Straight answers help you decide whether a conversation is worth your time."
          />
        </Reveal>
        <div className="faq-list">
          {site.faqs.map((faq, index) => {
            const open = openIndex === index
            const answerId = `faq-answer-${index}`
            return (
              <div className="faq-item" key={faq.question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    <span>{faq.question}</span>
                    {open ? <Minus /> : <Plus />}
                  </button>
                </h3>
                <div id={answerId} className="faq-answer" hidden={!open}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
