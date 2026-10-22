import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { Link } from 'react-router-dom'
import { site } from '../../content/site'
import { ChatDemo } from '../ChatDemo'
import { SignalField } from '../effects/SignalField'
import { Magnetic } from '../ui/Magnetic'

const ease = [0.16, 1, 0.3, 1] as const
const featured = site.projects[0]

export function HeroSection() {
  const reduceMotion = useReducedMotion()
  // Pointer position across the hero, -0.5..0.5, eased so the floating
  // cards drift rather than snap.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 18 })
  const sy = useSpring(py, { stiffness: 60, damping: 18 })
  const siteX = useTransform(sx, (v) => v * -28)
  const siteY = useTransform(sy, (v) => v * -20)
  const chatX = useTransform(sx, (v) => v * 36)
  const chatY = useTransform(sy, (v) => v * 26)

  const handlePointer = (event: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - box.left) / box.width - 0.5)
    py.set((event.clientY - box.top) / box.height - 0.5)
  }

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease },
        }

  return (
    <section className="hero" aria-labelledby="hero-title" onPointerMove={handlePointer}>
      <SignalField className="hero__field" />
      <div className="hero__glow" aria-hidden="true" />

      <div className="shell hero__inner">
        <motion.p className="hero__eyebrow" {...rise(0.05)}>
          <i aria-hidden="true" />
          {site.hero.eyebrow}
        </motion.p>

        <h1 id="hero-title" aria-label={site.hero.title}>
          {site.hero.titleLines.map((line, index) => (
            <span
              className={`hero__line${index === site.hero.titleLines.length - 1 ? ' hero__line--signal' : ''}`}
              aria-hidden="true"
              key={line}
            >
              <motion.span
                className="hero__line-inner"
                initial={reduceMotion ? false : { y: '108%', rotate: 2 }}
                animate={{ y: '0%', rotate: 0 }}
                transition={{ duration: 1.1, delay: 0.15 + index * 0.13, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="hero__lower">
          <div className="hero__copy">
            <motion.p className="hero__body" {...rise(0.55)}>
              {site.hero.body}
            </motion.p>

            <motion.div className="hero__actions" {...rise(0.68)}>
              <Magnetic>
                <Link className="button button--glow" to={site.primaryCta.to}>
                  {site.primaryCta.label}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </Magnetic>
              <a className="button button--line" href={site.secondaryCta.to}>
                {site.secondaryCta.label}
                <ArrowDown size={17} aria-hidden="true" />
              </a>
            </motion.div>
            <motion.p className="hero__promise" {...rise(0.8)}>
              {site.responsePromise}
            </motion.p>
          </div>

          {/* Illustration only: the real site is linked properly in the work
            section, and the conversation is a labelled demo. */}
          <div className="hero__stage" aria-hidden="true">
            <motion.div className="hero__float hero__float--site" style={{ x: siteX, y: siteY }}>
              <motion.div
                className="hero-site"
                initial={reduceMotion ? false : { opacity: 0, y: 60, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: -4 }}
                transition={{ duration: 1.2, delay: 0.55, ease }}
              >
                <div className="hero-site__bar">
                  <span />
                  <span />
                  <span />
                  <b>{featured?.domain}</b>
                  <em className="pill pill--live">Live site</em>
                </div>
                <img
                  src={featured?.image}
                  alt=""
                  width={1600}
                  height={1000}
                  // Lazy, not high-priority: the stage is display:none on phones,
                  // and a lazy image inside it is never fetched there. On desktop
                  // it is in the first viewport, so it still loads straight away.
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            </motion.div>
            <motion.div className="hero__float hero__float--chat" style={{ x: chatX, y: chatY }}>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 60, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.1, delay: 0.9, ease }}
              >
                <ChatDemo className="chat-demo--hero" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  )
}
