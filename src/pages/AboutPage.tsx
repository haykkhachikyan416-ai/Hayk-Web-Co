import { Seo } from '../components/Seo'
import { PageCta } from '../components/sections/PageCta'

const principles = [
  {
    label: 'Design',
    title: 'Design that earns attention.',
    body: 'Strong typography, useful hierarchy, and a distinct visual point of view help the right details land quickly. Polish supports the message instead of competing with it.',
  },
  {
    label: 'Development',
    title: 'Development that stays out of the way.',
    body: 'Clean, responsive code keeps pages quick, interactions dependable, and the experience comfortable across phones, tablets, and desktops.',
  },
  {
    label: 'Strategy',
    title: 'Strategy tied to a real business action.',
    body: 'The goal is not more decoration. It is a clearer path to the call, quote request, booking, visit, or conversation that moves the business forward.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About"
        description="Learn how HAYK WEB CO. combines clear strategy, modern design, clean development, and mobile-first thinking."
        path="/about"
      />
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow">About HAYK WEB CO.</p>
          <h1>Good websites start with clear thinking.</h1>
          <p>
            Modern design, clean development, mobile-first planning, business-focused strategy, and
            straightforward communication—working as one system.
          </p>
        </div>
      </section>
      <section className="section about-intro">
        <div className="shell about-intro__grid">
          <p className="eyebrow">The working standard</p>
          <div>
            <h2>Make the business easier to understand and easier to choose.</h2>
            <p>
              HAYK WEB CO. approaches the website as part brand introduction, part salesperson, and
              part service desk. It should answer practical questions, look credible, and make the
              next step obvious without overselling.
            </p>
            <p>
              That means listening closely, explaining decisions plainly, and keeping the work
              focused on what customers actually need.
            </p>
          </div>
        </div>
      </section>
      <section className="about-principles">
        <div className="shell">
          {principles.map((principle, index) => (
            <article key={principle.label}>
              <span>
                {String(index + 1).padStart(2, '0')} / {principle.label}
              </span>
              <h2>{principle.title}</h2>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section about-communication">
        <div className="shell about-communication__grid">
          <h2>Clear communication is part of the deliverable.</h2>
          <div>
            <p>
              You should know what is being decided, why it matters, and what comes next. Feedback
              stays connected to the business goal so the project can move forward without
              unnecessary mystery.
            </p>
            <ul>
              <li>Plain-language recommendations</li>
              <li>Visible project stages</li>
              <li>Mobile-first review</li>
              <li>Honest scope decisions</li>
            </ul>
          </div>
        </div>
      </section>
      <PageCta
        eyebrow="A practical first conversation"
        title="Have a business worth explaining clearly?"
        body="Share what the current site is doing—and what you need it to do better."
      />
    </>
  )
}
