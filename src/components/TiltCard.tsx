import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  maxTilt?: number
}

export function TiltCard({ children, className = '', maxTilt = 10 }: TiltCardProps) {
  const isTouch = useIsTouchDevice()
  const reducedMotion = useReducedMotion()
  const disabled = isTouch || reducedMotion

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 280, damping: 22 })
  const springY = useSpring(rotateY, { stiffness: 280, damping: 22 })

  const glowX = useMotionValue(50)
  const glowY = useMotionValue(50)
  const glow = useMotionTemplate`radial-gradient(220px circle at ${glowX}% ${glowY}%, rgb(var(--accent) / 0.14), transparent 70%)`

  function handleMouseMove(event: ReactMouseEvent<HTMLDivElement>) {
    if (disabled) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * maxTilt * 2)
    rotateX.set((0.5 - py) * maxTilt * 2)
    glowX.set(px * 100)
    glowY.set(py * 100)
  }

  function handleMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 800 }}
      className={`relative ${className}`}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glow }} />
      {children}
    </motion.div>
  )
}
