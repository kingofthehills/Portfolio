import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { GithubIcon } from '@/components/icons/BrandIcons'
import type { Project } from '@/data/projects'

interface ProjectCardProps {
  project: Project
  index: number
  onOpen: (project: Project) => void
}

export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  const reversed = index % 2 === 1

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group grid grid-cols-1 items-center gap-8 border-b border-border/20 py-16 first:pt-0 lg:grid-cols-12 lg:gap-6"
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        data-cursor="OPEN"
        aria-label={`Open ${project.title} case study`}
        className={`relative col-span-1 overflow-hidden rounded-2xl border border-border/30 bg-surface-2 text-left lg:col-span-7 ${
          reversed ? 'lg:order-2' : ''
        }`}
      >
        <div className="aspect-[4/3] w-full overflow-hidden">
          <motion.img
            style={{ y: imageY }}
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
            className="h-[115%] w-full scale-105 object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.12]"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-bg/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-500 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-medium text-bg">
            View Case Study <ArrowUpRight size={14} />
          </span>
        </div>
      </button>

      <div className={`col-span-1 lg:col-span-5 ${reversed ? 'lg:order-1' : ''}`}>
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-faint">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span className="h-px w-8 bg-border/40" />
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>

        <h3 className="mt-4 font-display text-2xl text-ink sm:text-3xl">{project.title}</h3>
        <p className="mt-3 max-w-md text-balance leading-relaxed text-muted">{project.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border/30 px-3 py-1 text-[11px] font-mono text-muted"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-5">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="CODE"
            className="link-underline inline-flex items-center gap-1.5 text-sm text-ink"
          >
            <GithubIcon size={15} /> Source
          </a>
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="LIVE"
            className="link-underline inline-flex items-center gap-1.5 text-sm text-ink"
          >
            Live Demo <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  )
}
