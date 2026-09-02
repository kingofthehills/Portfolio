import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { memo, useRef } from 'react'
import { MagneticButton } from '@/components/MagneticButton'
import { AvailabilityBadge } from '@/components/AvailabilityBadge'
import { useIsSmallScreen } from '@/hooks/useIsTouchDevice'
import { personal } from '@/data/personal'
import { setCinematicProgress } from '@/three/utils/scrollStore'
import { CinematicCanvas } from '@/three/scenes/CinematicCanvas'

interface CinematicExperienceProps {
  onProgress?: (progress: number) => void
}

interface CaptionProps {
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  range: [number, number, number, number]
  align?: 'left' | 'right'
  eyebrow: string
  line: string
}

/**
 * A hand-rolled piecewise-linear map used instead of useTransform's
 * array-input overload, which was observed producing non-monotonic,
 * un-clamped output on the installed framer-motion version (values crept
 * back up past the intended endpoint instead of staying clamped at it).
 * A plain function passed to useTransform sidesteps that entirely.
 */
function piecewise(value: number, stops: number[], outputs: number[]): number {
  if (value <= stops[0]) return outputs[0]
  const last = stops.length - 1
  if (value >= stops[last]) return outputs[last]
  for (let i = 0; i < last; i++) {
    if (value >= stops[i] && value <= stops[i + 1]) {
      const t = (value - stops[i]) / (stops[i + 1] - stops[i])
      return outputs[i] + (outputs[i + 1] - outputs[i]) * t
    }
  }
  return outputs[last]
}

function Caption({ progress, range, align = 'left', eyebrow, line }: CaptionProps) {
  const opacity = useTransform(progress, (v) => piecewise(v, range, [0, 1, 1, 0]))
  const y = useTransform(progress, (v) => piecewise(v, range, [24, 0, 0, -16]))

  return (
    <motion.div
      style={{ opacity, y }}
      className={`pointer-events-none absolute bottom-28 z-10 max-w-sm px-6 sm:px-10 lg:px-16 ${
        align === 'right' ? 'right-0 text-right' : 'left-0 text-left'
      }`}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent2">{eyebrow}</span>
      <p className="mt-3 text-balance font-display text-xl text-ink sm:text-2xl">{line}</p>
    </motion.div>
  )
}

export const CinematicExperience = memo(function CinematicExperience({ onProgress }: CinematicExperienceProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const isSmallScreen = useIsSmallScreen(768)
  const lastBucket = useRef(-1)

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setCinematicProgress(value)
    const bucket = Math.round(value * 24)
    if (bucket !== lastBucket.current) {
      lastBucket.current = bucket
      onProgress?.(value)
    }
  })

  const introOpacity = useTransform(scrollYProgress, (v) => piecewise(v, [0, 0.16, 0.22], [1, 1, 0]))
  const introY = useTransform(scrollYProgress, (v) => piecewise(v, [0, 0.22], [0, -50]))
  const cueOpacity = useTransform(scrollYProgress, (v) => piecewise(v, [0, 0.05], [1, 0]))

  return (
    <section
      id="home"
      ref={wrapperRef}
      className="relative"
      style={{ height: isSmallScreen ? '380vh' : '600vh' }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-bg">
        <div className="absolute inset-0">
          <CinematicCanvas />
        </div>

        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-10 lg:px-16"
        >
          <div className="max-w-xl">
            <div className="mb-6">
              <AvailabilityBadge />
            </div>
            <h1 className="font-display text-[clamp(2.6rem,8vw,4.5rem)] leading-[1.05] tracking-tight text-ink">
              {personal.name}
            </h1>
            <p className="mt-3 font-mono text-sm uppercase tracking-[0.25em] text-accent2 sm:text-base">
              Full-Stack Developer &middot; Creative Technologist
            </p>
            <p className="mt-6 max-w-md text-balance text-base leading-relaxed text-muted sm:text-lg">
              {personal.tagline}
            </p>
            <div className="mt-9">
              <MagneticButton
                href="#projects"
                cursorLabel="VIEW"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-bg"
              >
                Explore My Work
                <ChevronDown size={16} />
              </MagneticButton>
            </div>
          </div>
        </motion.div>

        <Caption
          progress={scrollYProgress}
          range={[0.2, 0.27, 0.36, 0.42]}
          align="right"
          eyebrow="Chapter 01 — The System"
          line="A system built from first principles, opening layer by layer."
        />
        <Caption
          progress={scrollYProgress}
          range={[0.44, 0.51, 0.6, 0.66]}
          align="left"
          eyebrow="Chapter 02 — The Process"
          line="Every idea starts as a spark, then finds its way into something real."
        />
        <Caption
          progress={scrollYProgress}
          range={[0.74, 0.81, 0.89, 0.94]}
          align="right"
          eyebrow="Chapter 02 — Followed Through"
          line="Carried end to end, until it's shipped."
        />

        <motion.div
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-faint"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
})
