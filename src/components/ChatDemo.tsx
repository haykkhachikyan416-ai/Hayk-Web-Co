import { Bot } from 'lucide-react'
import { useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { site } from '../content/site'
import type { ChatMessage } from '../content/site'

/**
 * An illustrative conversation with a fictional business's AI assistant
 * (`site.demoChat`). Every instance carries a visible `Demo Concept` label and
 * `data-demo`, which a test checks, so a demo can never be mistaken for a real
 * client deployment.
 */
type ChatDemoProps = {
  messages?: ChatMessage[]
  assistantName?: string
  className?: string
}

/**
 * Plays the conversation one message at a time while it is on screen, with a
 * typing indicator before each assistant reply, then loops.
 *
 * Every bubble stays in the layout and only its state changes, so the card
 * never resizes mid-sequence. It starts — and rests — fully shown: the
 * sequence runs only while the card is in view and motion is allowed, so
 * off-screen, reduced-motion, and no-IntersectionObserver visitors all read
 * the whole exchange.
 */
export function ChatDemo({
  messages = site.demoChat,
  assistantName = 'Northline Assistant',
  className,
}: ChatDemoProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const reduceMotion = useReducedMotion()
  const [shown, setShown] = useState(messages.length)
  const [typing, setTyping] = useState(-1)

  useEffect(() => {
    if (!inView || reduceMotion) {
      setShown(messages.length)
      setTyping(-1)
      return
    }
    let cancelled = false
    const timers: number[] = []
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms))
      })

    const run = async () => {
      while (!cancelled) {
        // Each loop opens on the visitor's question rather than an empty
        // card, so a glance at any moment still shows a conversation.
        setShown(1)
        await wait(900)
        for (let index = 1; index < messages.length && !cancelled; index += 1) {
          if (messages[index]?.from === 'ai') {
            setTyping(index)
            await wait(1150)
            if (cancelled) return
            setTyping(-1)
          } else {
            await wait(700)
          }
          setShown(index + 1)
          await wait(400)
        }
        await wait(4000)
      }
    }
    void run()

    return () => {
      cancelled = true
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [inView, reduceMotion, messages])

  return (
    <div className={`chat-demo${className ? ` ${className}` : ''}`} ref={ref} data-demo="true">
      <div className="chat-demo__head">
        <span className="chat-demo__avatar" aria-hidden="true">
          <Bot size={16} />
        </span>
        <span className="chat-demo__name">
          {assistantName}
          <small>
            <i aria-hidden="true" /> Online now
          </small>
        </span>
        <span className="pill pill--demo">Demo Concept</span>
      </div>
      <div className="chat-demo__body">
        {messages.map((message, index) => (
          <div
            className={`chat-demo__slot chat-demo__slot--${message.from}`}
            data-state={index < shown ? 'shown' : typing === index ? 'typing' : 'hidden'}
            key={message.text}
          >
            <p className="chat-demo__bubble">{message.text}</p>
            <span className="chat-demo__typing" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
