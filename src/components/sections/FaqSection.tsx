import { Plus } from 'lucide-react'
import { useState } from 'react'
import { site } from '../../content/site'
import { Reveal } from '../ui/Reveal'

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="faq" aria-labelledby="faq-title">
      <div className="shell faq__grid">
        <Reveal as="header" className="faq__head" variant="blur">
          <p className="kicker">FAQ</p>
          <h2 id="faq-title">
            Straight <span>answers.</span>
          </h2>
          <p>
            Something else on your mind? <a href={`mailto:${site.email}`}>Email me</a>
            {site.phone && (
              <>
                {' '}
                or call <a href={site.phoneHref}>{site.phone}</a>
              </>
            )}
            .
          </p>
        </Reveal>
        <div className="faq__list">
          {site.faqs.map((faq, index) => {
            const open = openIndex === index
            const answerId = `faq-answer-${index}`
            return (
              <div className="faq__item" data-open={open} key={faq.question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <Plus aria-hidden="true" />
                  </button>
                </h3>
                {/* Collapsed with a grid-rows transition so it animates to its
                    natural height; `inert` keeps the hidden answer out of the
                    tab order and the accessibility tree while closed. */}
                <div id={answerId} className="faq__answer" inert={!open}>
                  <div>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
