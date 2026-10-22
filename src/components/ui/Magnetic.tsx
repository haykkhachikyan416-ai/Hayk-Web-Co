import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import type { PropsWithChildren } from 'react'

/**
 * Pulls its child a few pixels toward a mouse pointer, then springs back.
 *
 * Mouse only: touch has no hover, and a pen or a keyboard user should get a
 * button that stays exactly where they aimed. Reduced motion turns it off.
 */
export function Magnetic({ children, strength = 0.3 }: PropsWithChildren<{ strength?: number }>) {
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 })

  const handleMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - (box.left + box.width / 2)) * strength)
    y.set((event.clientY - (box.top + box.height / 2)) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      className="magnetic"
      style={{ x: springX, y: springY }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  )
}
