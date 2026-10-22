import { BellRing, Bot, CalendarCheck2, MessageSquareText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { useRef, useState } from 'react'
import { site } from '../../content/site'
import { useMediaQuery } from '../../hooks/useMediaQuery'

/** What each step looks like on screen. Copy lives in `site.automationFlow`. */
const artifacts: { icon: LucideIcon; render: () => React.ReactNode }[] = [
  {
    icon: MessageSquareText,
    render: () => (
      <p className="flow-art flow-art--in">Can someone look at a kitchen remodel this week?</p>
    ),
  },
  {
    icon: Bot,
    render: () => (
      <p className="flow-art flow-art--ai">
        Happy to help! Thursday 10 AM or Friday 2 PM for a free estimate?
      </p>
    ),
  },
  {
    icon: CalendarCheck2,
    render: () => (
      <p className="flow-art flow-art--cal">
        <b>FRI</b>
        <span>2:00 PM · In-home estimate</span>
        <em>Booked</em>
      </p>
    ),
  },
  {
    icon: BellRing,
    render: () => (
      <p className="flow-art flow-art--note">
        <b>New booked lead</b>
        <span>Kitchen remodel · Fri 2:00 PM · details attached</span>
      </p>
    ),
  },
]

// Scroll progress at which each step lights up while pinned.
const thresholds = [0, 0.24, 0.5, 0.74]

/**
 * The AI offer, shown rather than described: a lead arriving after hours and
 * being handled end to end. On wide screens the section pins and scroll
 * drives the sequence; on phones and for reduced motion it is a plain,
 * fully lit list, because pinning a small screen feels like being stuck.
 */
export function AutomationSection() {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const wide = useMediaQuery('(min-width: 900px) and (min-height: 620px)')
  const pinned = wide && !reduceMotion
  const [active, setActive] = useState(site.automationFlow.length - 1)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const rail = useTransform(scrollYProgress, [0.02, 0.8], [0, 1])

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!pinned) return
    let next = 0
    thresholds.forEach((threshold, index) => {
      if (progress >= threshold) next = index
    })
    setActive(next)
  })

  const current = pinned ? active : site.automationFlow.length - 1

  return (
    <section className="flow" ref={ref} data-pinned={pinned} aria-labelledby="flow-title">
      <div className="flow__sticky">
        <div className="shell flow__grid">
          <div className="flow__copy">
            <p className="kicker kicker--light">AI automation</p>
            <h2 id="flow-title">
              While you’re on the job, <span>AI handles the inbox.</span>
            </h2>
            <p>
              Every lead answered in seconds, booked straight into your calendar, and summarized for
              you — at 9 PM on a Sunday as reliably as 10 AM on a Tuesday.
            </p>
            <div className="flow__meta">
              <span className="pill pill--demo">Demo Concept</span>
              <span className="flow__counter" aria-hidden="true">
                <b>{String(current + 1).padStart(2, '0')}</b> /{' '}
                {String(site.automationFlow.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="flow__track">
            <span className="flow__rail" aria-hidden="true">
              <motion.span style={{ scaleY: pinned ? rail : 1 }} />
            </span>
            <ol className="flow__steps">
              {site.automationFlow.map((step, index) => {
                const { icon: Icon, render } = artifacts[index] ?? artifacts[0]!
                return (
                  <li
                    className="flow-step"
                    data-active={index <= current}
                    data-current={index === current}
                    aria-label={`Automation step ${index + 1}: ${step.title}`}
                    key={step.title}
                  >
                    <span className="flow-step__node" aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <div className="flow-step__body">
                      <time>{step.time}</time>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                      {render()}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
