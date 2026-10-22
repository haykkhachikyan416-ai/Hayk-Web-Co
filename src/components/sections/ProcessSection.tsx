import { site } from '../../content/site'
import { Reveal } from '../ui/Reveal'

export function ProcessSection() {
  return (
    <section className="steps" aria-labelledby="steps-title">
      <div className="shell">
        <Reveal as="header" className="steps__head" variant="blur">
          <p className="kicker kicker--light">How it works</p>
          <h2 id="steps-title">
            First call to launch. <span>Four steps, no mystery.</span>
          </h2>
        </Reveal>
        <div className="steps__track">
          <span className="steps__line" aria-hidden="true" />
          <ol className="steps__list">
            {site.process.map((item, index) => (
              <Reveal as="li" variant="rise" order={index} key={item.step}>
                <span className="steps__number" aria-hidden="true">
                  {item.step}
                </span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
