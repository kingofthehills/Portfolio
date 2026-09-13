import { motion } from 'framer-motion'
import { Award } from 'lucide-react'
import { useState } from 'react'
import { SectionHeading } from '@/components/SectionHeading'
import { TiltCard } from '@/components/TiltCard'
import { certifications } from '@/data/certifications'
import { skillCategories } from '@/data/skills'

export function TechStack() {
  const [activeCategory, setActiveCategory] = useState(skillCategories[0].category)
  const current = skillCategories.find((c) => c.category === activeCategory) ?? skillCategories[0]

  return (
    <section id="skills" className="relative overflow-hidden bg-bg py-28">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/metro-hero-frames/frame-001.webp')" }}
      />
      {/* dark overlay so the tool cards/text stay legible over the photo */}
      <div className="absolute inset-0 bg-bg/55" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <SectionHeading
          eyebrow="Tech Stack"
          title="Tools I reach for."
          description="A working set of technologies I use to take a product from idea to production."
        />

        <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap gap-2">
              {skillCategories.map((cat) => (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setActiveCategory(cat.category)}
                  data-cursor="VIEW"
                  className={`rounded-full border px-4 py-2 text-xs font-mono uppercase tracking-wide transition-colors ${
                    activeCategory === cat.category
                      ? 'border-accent/50 bg-accent/10 text-ink'
                      : 'border-border/30 text-muted hover:text-ink'
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {current.items.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TiltCard className="group h-full overflow-hidden rounded-2xl border border-border/30 bg-surface/40 p-5">
                    <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                      <div className="flex items-center justify-between gap-2">
                        <span className="min-w-0 truncate font-display text-lg text-ink">{skill.name}</span>
                        <span className="shrink-0 whitespace-nowrap rounded-full border border-border/30 px-2 py-0.5 font-mono text-[10px] text-faint">
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {skill.description}
                      </p>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl border border-border/30 bg-surface/40 lg:col-span-4"
          >
            <div className="flex items-center gap-2 border-b border-border/20 px-5 py-4">
              <Award size={16} className="text-accent2" />
              <span className="font-mono text-xs uppercase tracking-widest text-faint">Certifications</span>
            </div>

            <ul className="divide-y divide-border/15">
              {certifications.map((cert) => (
                <li key={cert.id} className="px-5 py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent2">{cert.year}</span>
                  </div>
                  <h3 className="mt-1.5 font-display text-base leading-snug text-ink">{cert.title}</h3>
                  <p className="mt-1 text-sm text-muted">{cert.organization}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
