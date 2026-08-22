import { Seo } from '../components/Seo'
import { ConceptBrowser } from '../components/ConceptBrowser'
import { ProjectShowcase } from '../components/ProjectShowcase'
import { PageCta } from '../components/sections/PageCta'
import { site } from '../content/site'

export default function WorkPage() {
  return (
    <>
      <Seo
        title="Work"
        description="Launched websites for Los Angeles glass installers, plus clearly labeled concepts for a contractor, restaurant, and barber or beauty business."
        path="/work"
      />
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow">Launched work</p>
          <h1>Sites that are live, and concepts that show the thinking.</h1>
          <p>
            Below are real websites currently serving Los Angeles businesses, followed by original
            concepts. The two are labeled separately, and always will be.
          </p>
        </div>
      </section>
      <section className="section work-page">
        <div className="shell">
          <div className="work-page__lead">
            <h2>Live client sites</h2>
            <p>Both are online now — open either one and judge it yourself.</p>
          </div>
          <div className="project-list">
            {site.projects.map((project) => (
              <ProjectShowcase project={project} key={project.name} />
            ))}
          </div>
        </div>
      </section>
      <section className="section work-page work-page--concepts">
        <div className="shell">
          <div className="work-page__lead">
            <h2>Demo concepts</h2>
            <p>
              These are not client projects. They are original explorations of how industry context
              changes a website, with no fabricated outcomes attached.
            </p>
          </div>
          <div className="work-page__list">
            {site.concepts.map((concept, index) => (
              <ConceptBrowser concept={concept} index={index} key={concept.name} />
            ))}
          </div>
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
