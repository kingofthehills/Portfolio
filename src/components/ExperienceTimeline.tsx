import { motion, useScroll, useTransform } from 'framer-motion'
import { Award, Briefcase, Code2, GraduationCap } from 'lucide-react'
import { useRef } from 'react'
import { ConstellationGrid } from '@/components/ConstellationGrid'
import { SectionHeading } from '@/components/SectionHeading'
import { experience } from '@/data/experience'
import type { MilestoneType } from '@/data/experience'

const icons: Record<MilestoneType, typeof GraduationCap> = {
  education: GraduationCap,
  work: Briefcase,
  project: Code2,
  certification: Award,
}

export function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 75%', 'end 40%'] })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="experience" className="relative overflow-hidden bg-bg py-28">
      {/* bg-bg above occludes the site's global fixed 3D JourneyCanvas
          background for this section specifically — it has no opaque
          background of its own, so without this the 3D scene was
          showing through and clashing with the grid below. */}
      <ConstellationGrid className="pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <SectionHeading eyebrow="Experience" title="A developer's journey." description="Education, projects, and milestones along the way." />

        <div ref={containerRef} className="relative mt-16 pl-10 sm:pl-14">
          <div className="absolute left-[7px] top-0 h-full w-px bg-border/20 sm:left-[11px]" />
          <motion.div
            style={{ scaleY: lineScale, transformOrigin: 'top' }}
            className="absolute left-[7px] top-0 h-full w-px bg-gradient-to-b from-accent via-accent2 to-transparent sm:left-[11px]"
          />

          <div className="space-y-14">
            {experience.map((milestone, index) => {
              const Icon = icons[milestone.type]
              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  <span className="absolute -left-10 top-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-accent/50 bg-bg sm:-left-14 sm:h-6 sm:w-6">
                    <Icon size={11} className="text-accent" />
                  </span>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-accent2">{milestone.year}</span>
                    <span className="rounded-full border border-border/30 px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-faint">
                      {milestone.type}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-xl text-ink sm:text-2xl">{milestone.title}</h3>
                  <p className="mt-1 text-sm text-muted">{milestone.organization}</p>
                  <p className="mt-3 max-w-xl text-balance leading-relaxed text-muted">{milestone.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
