import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { ArrowRight, ChevronDown, Mail } from 'lucide-react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { AvailabilityBadge } from '@/components/AvailabilityBadge'
import { MagneticButton } from '@/components/MagneticButton'
import { HeroCanvas } from '@/components/three/HeroCanvas'
import { personal } from '@/data/personal'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
}

export function Hero() {
  const glowX = useMotionValue(50)
  const glowY = useMotionValue(50)
  const background = useMotionTemplate`radial-gradient(600px circle at ${glowX}% ${glowY}%, rgb(var(--accent) / 0.12), transparent 70%)`

  function handleMouseMove(event: ReactMouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    glowX.set(((event.clientX - rect.left) / rect.width) * 100)
    glowY.set(((event.clientY - rect.top) / rect.height) * 100)
  }

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background }} />
      <div className="absolute inset-0 bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="absolute inset-y-0 right-0 w-full lg:w-[58%]">
        <div className="h-full w-full opacity-90">
          <HeroCanvas />
        </div>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-12 px-6 sm:px-10 lg:grid-cols-12 lg:px-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="lg:col-span-7 xl:col-span-6"
        >
          <motion.div variants={item} className="mb-7">
            <AvailabilityBadge />
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-[clamp(2.6rem,9vw,4.75rem)] leading-[1.05] tracking-tight text-ink"
          >
            Hi, I&apos;m{' '}
            <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
              {personal.name}
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-5 font-display text-xl text-muted sm:text-2xl">
            {personal.role}
          </motion.p>

          <motion.p variants={item} className="mt-6 max-w-lg text-balance text-base leading-relaxed text-muted sm:text-lg">
            {personal.tagline}
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton
              href="#projects"
              cursorLabel="VIEW"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-bg transition-colors"
            >
              View My Work
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton
              href="#contact"
              cursorLabel="SAY HI"
              className="group inline-flex items-center gap-2 rounded-full border border-border/50 px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:border-accent/50"
            >
              <Mail size={16} />
              Let&apos;s Connect
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        data-cursor="SCROLL"
        aria-label="Scroll to About section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-faint transition-colors hover:text-ink"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown size={20} />
        </motion.div>
      </motion.a>
    </section>
  )
}
