import {
  ArrowUpRight,
  CalendarClock,
  Check,
  MousePointerClick,
  RefreshCw,
  Workflow,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../../content/site'
import { BuildPreview } from '../BuildPreview'
import { ChatDemo } from '../ChatDemo'
import { Reveal } from '../ui/Reveal'

const extras: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: RefreshCw, title: 'Redesigns', body: 'Keep what works. Fix what costs you calls.' },
  {
    icon: MousePointerClick,
    title: 'Landing pages',
    body: 'One offer, one audience, one next step.',
  },
  { icon: CalendarClock, title: 'Booking & reminders', body: 'Fewer no-shows, zero phone tag.' },
  { icon: Workflow, title: 'Workflow automation', body: 'Your apps pass the details along.' },
]

/**
 * One light listener for the whole grid. Each card gets its own pointer
 * coordinates, so the spotlight is lit on every card at once and the borders
 * of neighbours glow as the pointer approaches them.
 */
function trackSpotlight(event: React.PointerEvent<HTMLDivElement>) {
  if (event.pointerType !== 'mouse') return
  event.currentTarget.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((card) => {
    const box = card.getBoundingClientRect()
    card.style.setProperty('--mx', `${event.clientX - box.left}px`)
    card.style.setProperty('--my', `${event.clientY - box.top}px`)
  })
}

function PointList({ points }: { points: string[] }) {
  return (
    <ul className="pillar__points">
      {points.map((point) => (
        <li key={point}>
          <Check size={15} aria-hidden="true" />
          {point}
        </li>
      ))}
    </ul>
  )
}

export function PillarsSection() {
  const { web, ai } = site.pillars

  return (
    <section className="pillars" aria-labelledby="pillars-title">
      <div className="shell">
        <Reveal as="header" className="pillars__head" variant="blur">
          <p className="kicker">What I build</p>
          <h2 id="pillars-title">
            A website that wins customers. <span>AI that handles the rest.</span>
          </h2>
        </Reveal>

        <div className="bento" onPointerMove={trackSpotlight}>
          <Reveal className="bento__cell bento__cell--web" variant="scale">
            <article className="pillar pillar--web" aria-labelledby="pillar-web" data-spotlight>
              <BuildPreview />
              <div className="pillar__copy">
                <span className="pillar__index">01 / Websites</span>
                <h3 id="pillar-web">{web.title}</h3>
                <p>{web.body}</p>
                <PointList points={web.points} />
              </div>
            </article>
          </Reveal>

          <Reveal className="bento__cell bento__cell--ai" variant="scale" order={1}>
            <article className="pillar pillar--ai" aria-labelledby="pillar-ai" data-spotlight>
              <ChatDemo className="chat-demo--pillar" />
              <div className="pillar__copy">
                <span className="pillar__index">02 / AI automation</span>
                <h3 id="pillar-ai">{ai.title}</h3>
                <p>{ai.body}</p>
                <PointList points={ai.points} />
              </div>
            </article>
          </Reveal>

          {extras.map(({ icon: Icon, title, body }, index) => (
            <Reveal className="bento__cell" variant="rise" order={index} key={title}>
              <div className="mini" data-spotlight>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Link className="arrow-link" to="/services">
          See every service <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
