import { motion, useMotionValue, useSpring } from 'framer-motion'
import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface MagneticButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  strength?: number
  as?: 'a' | 'button'
  cursorLabel?: string
  target?: string
  rel?: string
  ariaLabel?: string
}

export function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  strength = 0.35,
  as,
  cursorLabel,
  target,
  rel,
  ariaLabel,
}: MagneticButtonProps) {
  const isTouch = useIsTouchDevice()
  const reducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 })

  const disableMagnet = isTouch || reducedMotion

  function handleMouseMove(event: ReactMouseEvent<HTMLElement>) {
    if (disableMagnet) return
    const rect = event.currentTarget.getBoundingClientRect()
    const relX = event.clientX - (rect.left + rect.width / 2)
    const relY = event.clientY - (rect.top + rect.height / 2)
    x.set(relX * strength)
    y.set(relY * strength)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  const Tag = motion[as ?? (href ? 'a' : 'button')] as typeof motion.a

  return (
    <Tag
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      data-cursor={cursorLabel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </Tag>
  )
}
