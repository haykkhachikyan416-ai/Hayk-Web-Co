import { Seo } from '../components/Seo'
import { ConceptBrowser } from '../components/ConceptBrowser'
import { PageCta } from '../components/sections/PageCta'
import { site } from '../content/site'

export default function WorkPage() {
  return (
    <>
      <Seo
        title="Demo Work"
        description="Explore clearly labeled website concepts for a contractor, restaurant, and barber or beauty business."
        path="/work"
      />
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow">Demo work / clearly labeled</p>
          <h1>Concepts built for the businesses people rely on.</h1>
          <p>
            Original, non-client explorations showing how industry context can shape a website. No
            fabricated outcomes—just focused design thinking.
          </p>
        </div>
      </section>
      <section className="section work-page">
        <div className="shell work-page__list">
          {site.concepts.map((concept, index) => (
            <ConceptBrowser concept={concept} index={index} key={concept.name} />
          ))}
        </div>
      </section>
      <PageCta
        eyebrow="Your business, not a template"
        title="See what the right structure could do for your business."
        body="Start with an honest review of your current website, goals, and strongest conversion opportunity."
      />
    </>
  )
}
