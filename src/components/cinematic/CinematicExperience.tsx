import type { MotionValue } from 'framer-motion'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { memo, useRef, useState } from 'react'
import { AvailabilityBadge } from '@/components/AvailabilityBadge'
import { MagneticButton } from '@/components/MagneticButton'
import { ScrollFrameHero } from '@/components/cinematic/ScrollFrameHero'
import { useIsSmallScreen } from '@/hooks/useIsTouchDevice'
import { personal } from '@/data/personal'
import { setCinematicProgress } from '@/three/utils/scrollStore'

// Pre-extracted from the source video (public/metro-hero-frames), 64
// frames at 8fps — drawn to a canvas instead of scrubbing a <video>,
// since seeking a compressed video is comparatively slow (keyframe
// search + decode) and couldn't keep up with fast scrolling. An
// already-decoded image can be drawn every animation frame with no
// such cost, so the frame tracks scroll exactly with no lag.
const HERO_FRAME_URLS = Array.from(
  { length: 64 },
  (_, i) => `/metro-hero-frames/frame-${String(i + 1).padStart(3, '0')}.webp`,
)

// The door-opening motion should read as finished early in the scroll,
// not stretched across the whole section — only this leading fraction
// of scrollYProgress maps across the frame sequence.
const HERO_FRAMES_SCROLL_END = 0.56
// Everything (door, name, role, badge/tagline/button) is fully settled
// by this point. What's left of the section's scroll range after it
// (REVEAL_COMPLETE to 1) is pure buffer before unsticking into About —
// kept short on purpose so that buffer is only ~2 scrolls, not a long
// stretch of nothing happening.
const REVEAL_COMPLETE = 0.75

/** The scrollYProgress value at which ScrollFrameHero shows the given 1-indexed frame filename (e.g. 42 for frame-042.webp) — inverts its own `index = round((v / scrollEnd) * (frameCount - 1))` mapping. */
function scrollAtFrame(frameNumber: number) {
  return ((frameNumber - 1) / (HERO_FRAME_URLS.length - 1)) * HERO_FRAMES_SCROLL_END
}

interface CinematicExperienceProps {
  onProgress?: (progress: number) => void
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

const SCRAMBLE_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`░▒▓█▀▄■□▪▫●○◆◇◈◊※†‡'

function randomScrambleChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
}

/** Spaces and the middle dot stay put so words don't merge into noise mid-scramble. */
function scrambleText(target: string, progress: number) {
  const reveal = Math.floor(progress * target.length)
  return target
    .split('')
    .map((ch, i) => (i < reveal || ch === ' ' || ch === '·' ? ch : randomScrambleChar()))
    .join('')
}

interface ScrambleRevealProps {
  text: string
  progress: MotionValue<number>
  className?: string
}

/** Decodes `text` from scramble noise into its real characters as `progress` (0..1) advances, instead of on a fixed timer — keyed to the same scroll-driven value already used for this element's opacity. */
function ScrambleReveal({ text, progress, className }: ScrambleRevealProps) {
  const [display, setDisplay] = useState(() => scrambleText(text, progress.get()))

  useMotionValueEvent(progress, 'change', (v) => {
    setDisplay(v >= 1 ? text : scrambleText(text, v))
  })

  return <span className={className}>{display}</span>
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

  // Starts much earlier in the frame sequence (18 instead of 42) and
  // finishes before the very last frame (55, not 64) — gives the
  // decode a long, gradual runway instead of being crammed into the
  // last couple of frames, and it's fully settled with room to spare
  // by the time the door finishes opening, rather than still resolving
  // right up to the last instant. The name itself is no longer
  // scroll-driven — it plays a mount entrance instead (see the h1's
  // initial/animate props below), so it's already there on the very
  // first frame rather than requiring a scroll to appear.
  const roleOpacity = useTransform(scrollYProgress, (v) =>
    piecewise(v, [scrollAtFrame(18), scrollAtFrame(55)], [0, 1]),
  )
  // The badge/tagline/CTA only show once the door has fully opened and
  // the role text has finished decoding — a third beat after the city
  // is already in view, not competing with the door-opening motion.
  const contentOpacity = useTransform(scrollYProgress, (v) =>
    piecewise(v, [HERO_FRAMES_SCROLL_END, REVEAL_COMPLETE], [0, 1]),
  )
  // A near-instant pop instead of contentOpacity's gradual fade —
  // fading light-colored text in via opacity makes it read as gray at
  // partial opacity (the alpha blend with the dark video looks washed
  // out, and only reaches true white once fully opaque), so a long
  // fade shows a visibly gray phase before settling white. This skips
  // straight past that.
  const taglineOpacity = useTransform(scrollYProgress, (v) =>
    piecewise(v, [HERO_FRAMES_SCROLL_END, HERO_FRAMES_SCROLL_END + 0.02], [0, 1]),
  )

  return (
    <section
      id="home"
      ref={wrapperRef}
      className="relative"
      // Scroll range is (height - 100vh) — everything settles by
      // REVEAL_COMPLETE (75% of that range), leaving only the last 25%
      // as buffer before unsticking into About. At these heights that's
      // roughly a couple of scroll-wheel notches, not a long dead
      // stretch.
      style={{ height: isSmallScreen ? '145vh' : '180vh' }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-bg">
        <ScrollFrameHero
          progress={scrollYProgress}
          scrollEnd={HERO_FRAMES_SCROLL_END}
          frameUrls={HERO_FRAME_URLS}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/10 to-bg/70" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
          <motion.div style={{ opacity: contentOpacity }}>
            <AvailabilityBadge />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              // Fully saturated red/blue/green traveling across the whole
              // text (rather than a narrow highlight over a mostly-ink
              // base) so the motion reads clearly instead of as a subtle
              // gloss.
              backgroundImage:
                'linear-gradient(90deg, #ff2d55 0%, #3b82f6 25%, #22e07a 50%, #3b82f6 75%, #ff2d55 100%)',
              backgroundSize: '300% 100%',
              textShadow: '0 0 30px rgb(var(--ink) / 0.35)',
            }}
            className="animate-shine bg-clip-text font-display text-[clamp(2.2rem,7vw,4.5rem)] font-bold uppercase tracking-tight text-transparent"
          >
            {personal.name}
          </motion.h1>
          <motion.p
            style={{
              opacity: roleOpacity,
              color: '#4fd8ff',
              // A dark contact shadow first (guarantees legibility over
              // any part of the busy, brightly-lit city background),
              // then a matching-hue glow on top for a neon-sign pop.
              textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 0 24px rgba(79,216,255,0.65)',
            }}
            className="font-mono text-xl font-bold uppercase tracking-[0.3em] sm:text-2xl"
          >
            <ScrambleReveal text="Full-Stack Developer" progress={roleOpacity} />
          </motion.p>

          <motion.p
            style={{
              opacity: taglineOpacity,
              color: '#ffffff',
              textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.8)',
            }}
            className="max-w-md text-balance text-base font-medium leading-relaxed sm:text-lg"
          >
            {personal.tagline}
          </motion.p>

          <motion.div style={{ opacity: contentOpacity }}>
            <MagneticButton
              href="#projects"
              cursorLabel="VIEW"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-bg"
            >
              Explore My Work
              <ChevronDown size={16} />
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
})
