import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.2 })

  return (
    <div
      aria-hidden
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 h-40 w-px bg-border/10 hidden md:block"
    >
      <motion.div
        style={{ scaleY, transformOrigin: 'top' }}
        className="w-px h-full bg-gradient-to-b from-accent to-accent2"
      />
    </div>
  )
}
