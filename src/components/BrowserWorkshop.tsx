import { motion, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { ARROW_UP_RIGHT } from '../lib/glyphs'

export function BrowserWorkshop() {
  const reduceMotion = useReducedMotion()
  const frame = useRef<HTMLDivElement>(null)

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5
    frame.current?.style.setProperty('--tilt-x', `${y}deg`)
    frame.current?.style.setProperty('--tilt-y', `${x}deg`)
  }

  const resetPointer = () => {
    frame.current?.style.setProperty('--tilt-x', '0deg')
    frame.current?.style.setProperty('--tilt-y', '0deg')
  }

  return (
    <div
      className="workshop-stage"
      role="img"
      aria-label="An unfinished website transforming into a polished local business website"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="workshop-orbit" aria-hidden="true" />
      <motion.div
        ref={frame}
        className="workshop-window"
        initial={reduceMotion ? false : { opacity: 0, y: 28, rotateX: -4 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="browser-bar">
          <span />
          <span />
          <span />
          <div className="browser-address">northlinebuild.com</div>
          <div className="browser-status">
            <i /> LIVE
          </div>
        </div>
        <div className="workshop-canvas workshop-canvas--rough" aria-hidden="true">
          <div className="rough-nav" />
          <div className="rough-copy">
            <i />
            <i />
            <i />
          </div>
          <div className="rough-image" />
          <div className="rough-button" />
          <span className="rough-label">UNCLEAR / SLOW / FORGOTTEN</span>
        </div>
        <motion.div
          className="workshop-canvas workshop-canvas--finished"
          aria-hidden="true"
          initial={reduceMotion ? false : { clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 1.15, delay: 0.8, ease: [0.77, 0, 0.18, 1] }}
        >
          <div className="finished-nav">
            <b>NORTHLINE</b>
            <span>Services&nbsp;&nbsp; Work&nbsp;&nbsp; Contact</span>
          </div>
          <div className="finished-copy">
            <small>LOCAL CONSTRUCTION, DONE RIGHT</small>
            <strong>Build with confidence.</strong>
            <p>Clear estimates. Skilled crews. A jobsite you can trust.</p>
            <div>
              GET A QUOTE <span>{ARROW_UP_RIGHT}</span>
            </div>
          </div>
          <div className="finished-image">
            <span>
              RESIDENTIAL
              <br />
              CONSTRUCTION
            </span>
          </div>
          <div className="finished-proof">
            <b>LICENSED</b>
            <b>LOCAL</b>
            <b>STRAIGHTFORWARD</b>
          </div>
        </motion.div>
        <motion.div
          className="build-line"
          aria-hidden="true"
          initial={reduceMotion ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.15, delay: 0.8, ease: [0.77, 0, 0.18, 1] }}
        >
          <span>BUILD</span>
        </motion.div>
      </motion.div>
      <motion.div
        className="workshop-note workshop-note--top"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        01 / TRUST
      </motion.div>
      <motion.div
        className="workshop-note workshop-note--bottom"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.65 }}
      >
        MOBILE READY {ARROW_UP_RIGHT}
      </motion.div>
    </div>
  )
}
