import { motion } from 'framer-motion'
import { useState } from 'react'
import { SectionHeading } from '@/components/SectionHeading'
import { TiltCard } from '@/components/TiltCard'
import { skillCategories } from '@/data/skills'

export function TechStack() {
  const [activeCategory, setActiveCategory] = useState(skillCategories[0].category)
  const current = skillCategories.find((c) => c.category === activeCategory) ?? skillCategories[0]

  return (
    <section id="skills" className="relative mx-auto max-w-[1400px] px-6 py-28 sm:px-10 lg:px-16">
      <SectionHeading
        eyebrow="Tech Stack"
        title="Tools I reach for."
        description="A working set of technologies I use to take a product from idea to production."
      />

      <div className="mt-10 flex flex-wrap gap-2">
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
        className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
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
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg text-ink">{skill.name}</span>
                  <span className="rounded-full border border-border/30 px-2 py-0.5 font-mono text-[10px] text-faint">
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
    </section>
  )
}
