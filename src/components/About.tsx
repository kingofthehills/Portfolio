import { motion } from 'framer-motion'
import { MapPin, Sparkles } from 'lucide-react'
import { SectionHeading } from '@/components/SectionHeading'
import { Stats } from '@/components/Stats'
import { TextReveal } from '@/components/TextReveal'
import { personal } from '@/data/personal'

const TICKER_ITEMS = [
  'SOFTWARE DEVELOPER',
  'FULL-STACK ENGINEERING',
  'AI-POWERED FEATURES',
  'REACT & NODE.JS',
  `${personal.location.split(',')[0].toUpperCase()} → ANYWHERE`,
]

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-bg py-28">
      {/* A locally stronger grid than the shared .bg-grid utility (used
          faintly elsewhere on Hero/SceneFallback), but dialed back from
          an earlier too-strong pass — visible without fighting the
          text sitting on top of it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(var(--border) / 0.16) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgb(var(--border) / 0.16) 1.5px, transparent 1.5px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* giant, near-invisible name bleeding off both edges — a quiet
          signature sitting behind the actual content, not competing
          with it */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden">
        <span className="block translate-y-[18%] whitespace-nowrap font-display text-[16vw] font-black uppercase leading-none tracking-tighter text-ink/[0.05]">
          {personal.name}
        </span>
      </div>

      <div className="relative z-10 mb-14 w-[106%] -translate-x-[3%] -rotate-1 overflow-hidden border-y border-border/20 bg-surface/60 py-3">
        <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-10 font-mono text-xs uppercase tracking-[0.2em] text-faint">
              {item}
              <span className="text-accent2">+</span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <SectionHeading
          eyebrow="About"
          title={
            <TextReveal
              as="span"
              text="The developer behind the pixels."
              fontSize="clamp(1.875rem, 5vw, 3rem)"
              color="rgb(var(--ink))"
              hoverColor="#d4a017"
              className="font-display normal-case tracking-tight"
            />
          }
        />

        <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 lg:col-span-7"
          >
            <p className="text-balance text-lg leading-relaxed text-ink sm:text-xl">{personal.about.intro}</p>
            <p className="text-balance leading-relaxed text-muted">{personal.about.philosophy}</p>
            <p className="text-balance leading-relaxed text-muted">{personal.about.focus}</p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-faint">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} /> {personal.location}
              </span>
              <span className="h-1 w-1 rounded-full bg-faint/50" />
              <span>{personal.timezone}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl border border-border/30 bg-surface/40 lg:col-span-5"
          >
            <div className="flex items-center gap-1.5 border-b border-border/20 px-5 py-3">
              <span className="h-2 w-2 rounded-full bg-red-400/60" />
              <span className="h-2 w-2 rounded-full bg-yellow-400/60" />
              <span className="h-2 w-2 rounded-full bg-accent2/60" />
              <span className="ml-3 font-mono text-[10px] uppercase tracking-widest text-faint">
                creator_profile.sys
              </span>
            </div>

            <div className="space-y-2.5 px-5 pt-5 font-mono text-xs">
              {[
                { key: 'NAME', value: personal.name },
                { key: 'ROLE', value: personal.role },
                { key: 'LOCATION', value: personal.location },
                { key: 'TIMEZONE', value: personal.timezone },
              ].map((row) => (
                <div key={row.key} className="flex items-baseline gap-3">
                  <span className="w-24 shrink-0 text-faint">{row.key}</span>
                  <span className="text-ink">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-border/20 px-5 py-5">
              <div className="mb-4 flex items-center gap-2 text-accent">
                <Sparkles size={16} />
                <span className="font-mono text-xs uppercase tracking-widest">What I enjoy building</span>
              </div>
              <ul className="space-y-3">
                {personal.about.enjoys.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="mt-16">
          <Stats />
        </div>
      </div>
    </section>
  )
}
