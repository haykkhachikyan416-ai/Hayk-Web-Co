import { motion, useReducedMotion } from 'motion/react'
import type { PropsWithChildren } from 'react'

type RevealProps = PropsWithChildren<{ className?: string; delay?: number }>

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      data-reveal="true"
      initial={false}
      whileInView={reduceMotion ? undefined : { opacity: [0.88, 1], y: [12, 0] }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
