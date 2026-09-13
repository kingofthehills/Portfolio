import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

export function EasterEggs() {
  const [message, setMessage] = useState<string | null>(null)
  const konamiIndex = useRef(0)
  const typedBuffer = useRef('')

  useEffect(() => {
    console.log(
      '%c👋 Poking around the console?',
      'font-size:14px;font-weight:600;color:#8a6cff;',
      '\nLet\'s talk: see the contact section, or open the command palette with ⌘K / Ctrl K.',
    )
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA'

      if (event.key === KONAMI[konamiIndex.current]) {
        konamiIndex.current += 1
        if (konamiIndex.current === KONAMI.length) {
          konamiIndex.current = 0
          setMessage('Konami accepted — you have earned nothing but respect.')
        }
      } else {
        konamiIndex.current = event.key === KONAMI[0] ? 1 : 0
      }

      if (!isTyping && event.key.length === 1) {
        typedBuffer.current = (typedBuffer.current + event.key).slice(-4).toLowerCase()
        if (typedBuffer.current === 'sudo') {
          setMessage('sudo: permission granted. Still just a portfolio, though.')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!message) return
    const timeout = window.setTimeout(() => setMessage(null), 3200)
    return () => window.clearTimeout(timeout)
  }, [message])

  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: -16, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -16, x: '-50%' }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed left-1/2 top-6 z-[300] rounded-full border border-accent/30 bg-surface/95 px-5 py-2.5 font-mono text-xs text-ink shadow-2xl shadow-black/40 backdrop-blur"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
