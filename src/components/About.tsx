import { motion } from 'framer-motion'
import { MapPin, Sparkles } from 'lucide-react'
import { SectionHeading } from '@/components/SectionHeading'
import { Stats } from '@/components/Stats'
import { personal } from '@/data/personal'

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-[1400px] px-6 py-28 sm:px-10 lg:px-16">
      <SectionHeading eyebrow="About" title="The developer behind the pixels." />

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
    </section>
  )
}
