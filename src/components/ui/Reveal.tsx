import type { CSSProperties, PropsWithChildren } from 'react'

export type RevealVariant = 'rise' | 'scale' | 'wipe' | 'blur'

type RevealProps = PropsWithChildren<{
  className?: string
  variant?: RevealVariant
  /** Position in a row of siblings; nudges its scroll range so a row cascades. */
  order?: number
  as?: 'div' | 'li' | 'header'
}>

/**
 * Scroll-linked entrance, driven entirely by CSS `animation-timeline: view()`.
 *
 * There is no JavaScript gate, so content can never be stranded invisible:
 * browsers without scroll-driven animations, reduced-motion visitors, and
 * test environments simply render it in place. Where it is supported, the
 * animation is tied to scroll position rather than fired once, so it feels
 * attached to the page instead of replayed on top of it.
 */
export function Reveal({
  children,
  className,
  variant = 'rise',
  order = 0,
  as = 'div',
}: RevealProps) {
  const Tag = as
  return (
    <Tag
      className={className}
      data-reveal={variant}
      style={order ? ({ '--reveal-order': order } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
