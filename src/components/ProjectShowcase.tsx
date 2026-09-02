import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ProjectCard } from '@/components/ProjectCard'
import { ProjectModal } from '@/components/ProjectModal'
import { SectionHeading } from '@/components/SectionHeading'
import { projects } from '@/data/projects'
import type { Project } from '@/data/projects'

export function ProjectShowcase() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  return (
    <section id="projects" className="relative mx-auto max-w-[1400px] px-6 py-28 sm:px-10 lg:px-16">
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
    </section>
  )
}
