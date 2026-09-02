import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, [data-cursor]'

export function CustomCursor() {
  const isTouch = useIsTouchDevice()
  const reducedMotion = useReducedMotion()
  const enabled = !isTouch && !reducedMotion

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 400, damping: 35, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 400, damping: 35, mass: 0.6 })
  const dotX = useSpring(x, { stiffness: 900, damping: 40, mass: 0.3 })
  const dotY = useSpring(y, { stiffness: 900, damping: 40, mass: 0.3 })

  const [hovering, setHovering] = useState(false)
  const [label, setLabel] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('custom-cursor')
      return
    }
    document.documentElement.classList.add('custom-cursor')

    function handleMove(event: MouseEvent) {
      x.set(event.clientX)
      y.set(event.clientY)
      setVisible(true)
    }

    function handleOver(event: MouseEvent) {
      const target = (event.target as HTMLElement)?.closest?.(INTERACTIVE_SELECTOR)
      if (target) {
        setHovering(true)
        setLabel(target.getAttribute('data-cursor'))
      }
    }

    function handleOut(event: MouseEvent) {
      const target = (event.target as HTMLElement)?.closest?.(INTERACTIVE_SELECTOR)
      if (target) {
        setHovering(false)
        setLabel(null)
      }
    }

    function handleLeaveWindow() {
      setVisible(false)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)
    document.addEventListener('mouseleave', handleLeaveWindow)

    return () => {
      document.documentElement.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
      document.removeEventListener('mouseleave', handleLeaveWindow)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]" style={{ opacity: visible ? 1 : 0 }}>
      <motion.div
        style={{ x: dotX, y: dotY }}
        className="absolute top-0 left-0 h-1.5 w-1.5 -ml-[3px] -mt-[3px] rounded-full bg-accent"
      />
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: hovering ? (label ? 2.4 : 1.6) : 1,
          opacity: hovering ? 1 : 0.6,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="absolute top-0 left-0 flex items-center justify-center h-9 w-9 -ml-[18px] -mt-[18px] rounded-full border border-ink/40 bg-bg/10 backdrop-blur-[1px]"
      >
        {label ? (
          <span className="font-mono text-[8px] tracking-widest uppercase text-ink" style={{ transform: 'scale(0.42)' }}>
            {label}
          </span>
        ) : null}
      </motion.div>
    </div>
  )
}
