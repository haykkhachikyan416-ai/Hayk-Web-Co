import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { Fragment, useRef } from 'react'
import { site } from '../../content/site'

const wrap = (min: number, max: number, value: number) => {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

/**
 * The band under the hero. It drifts on its own, speeds up and leans with
 * scroll velocity, and reverses when the visitor scrolls back up — so it
 * answers the page's movement instead of looping on top of it.
 *
 * Decorative: every item here is also listed as real content below.
 */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduceMotion = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [-1500, 0, 1500], [-5, 0, 5], { clamp: false })
  const skew = useTransform(velocity, [-2500, 0, 2500], [7, 0, -7])
  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`)
  const direction = useRef(1)

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !inView) return
    let move = direction.current * -1.6 * (delta / 1000)
    const factor = boost.get()
    if (factor < 0) direction.current = -1
    else if (factor > 0) direction.current = 1
    move += direction.current * move * factor
    baseX.set(baseX.get() + move)
  })

  const items = [...site.marquee, ...site.marquee]

  return (
    <div className="marquee" ref={ref} aria-hidden="true">
      <motion.div className="marquee__track" style={{ x, skewX: reduceMotion ? 0 : skew }}>
        {items.map((item, index) => (
          <Fragment key={`${item}-${index}`}>
            <span className={index % 2 ? 'marquee__item marquee__item--outline' : 'marquee__item'}>
              {item}
            </span>
            <svg className="marquee__spark" viewBox="0 0 24 24" width="28" height="28">
              <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
            </svg>
          </Fragment>
        ))}
      </motion.div>
    </div>
  )
}
