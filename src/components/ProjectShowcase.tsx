import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ProjectCard } from '@/components/ProjectCard'
import { ProjectModal } from '@/components/ProjectModal'
import { SectionHeading } from '@/components/SectionHeading'
import { ShaderBackground } from '@/components/ui/shader-background'
import { projects } from '@/data/projects'
import type { Project } from '@/data/projects'

export function ProjectShowcase() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  return (
    <section id="projects" className="relative py-28">
      {/* z-0 (not negative) — see the identical note on JourneyCanvas in
          App.tsx: this section is `relative` but has no z-index of its
          own, so it never establishes a stacking context, and a negative
          z-index here would resolve against a much higher ancestor and
          get painted below the page's own opaque body background instead
          of just behind this section's content. The max-width/padding
          that used to live on the section itself now lives only on the
          content wrapper below, so this canvas spans the full browser
          width instead of being boxed into the 1400px content column. */}
      <ShaderBackground className="pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work."
          description="A handful of products I've designed, built, and shipped end to end."
        />

        <div className="mt-14">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} onOpen={setActiveProject} />
          ))}
        </div>

        <AnimatePresence>
          {activeProject ? (
            <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  )
}
