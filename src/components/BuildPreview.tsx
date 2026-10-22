import { useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'

/**
 * A wireframe page assembling itself: navigation, headline, image, and a call
 * to action that a cursor then clicks. Pure CSS keyframes keyed off
 * `data-play`, so it only runs while visible and rests on the finished page
 * otherwise — including for reduced motion, where the CSS skips straight to it.
 */
export function BuildPreview() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.35 })
  const reduceMotion = useReducedMotion()

  return (
    <div className="build-preview" ref={ref} data-play={inView && !reduceMotion} aria-hidden="true">
      <div className="build-preview__bar">
        <span />
        <span />
        <span />
        <b>yourbusiness.com</b>
      </div>
      <div className="build-preview__page">
        <div className="bp bp--nav">
          <i className="bp-logo" />
          <i />
          <i />
          <i />
        </div>
        <div className="bp bp--title" />
        <div className="bp bp--title bp--short" />
        <div className="bp bp--text" />
        <div className="bp bp--text bp--short" />
        <div className="bp bp--cta">
          Get a quote
          <span className="bp-cursor">
            <svg viewBox="0 0 16 16" width="18" height="18">
              <path d="M2 1l11 6.2-4.8 1.1L6 13z" fill="#fff" stroke="#0b0d12" strokeWidth="1.2" />
            </svg>
          </span>
        </div>
        <div className="bp bp--image" />
        <div className="bp bp--cards">
          <i />
          <i />
          <i />
        </div>
        <div className="bp-toast">New quote request</div>
      </div>
    </div>
  )
}
