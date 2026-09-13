import { motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { useEffect } from 'react'
import { GithubIcon } from '@/components/icons/BrandIcons'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import type { Project } from '@/data/projects'

interface ProjectModalProps {
  project: Project
  onClose: () => void
}

function DetailBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <h4 className="font-mono text-xs uppercase tracking-widest text-accent">{label}</h4>
      <p className="mt-2 text-balance leading-relaxed text-muted">{text}</p>
    </div>
  )
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useLockBodyScroll(true)

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[150] flex items-start justify-center overflow-y-auto bg-bg/80 px-4 py-8 backdrop-blur-md sm:px-6 sm:py-16"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-border/30 bg-surface"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close case study"
          data-cursor="CLOSE"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border/40 bg-bg/60 text-ink backdrop-blur"
        >
          <X size={16} />
        </button>

        <div className="aspect-[16/9] w-full overflow-hidden bg-surface-2">
          <img src={project.image} alt={`${project.title} hero`} className="h-full w-full object-cover" />
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-widest text-faint">
            <span>{project.category}</span>
            <span className="h-1 w-1 rounded-full bg-faint/50" />
            <span>{project.year}</span>
          </div>

          <h3 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{project.title}</h3>
          <p className="mt-4 max-w-2xl text-balance leading-relaxed text-muted">{project.longDescription}</p>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <DetailBlock label="Problem" text={project.problem} />
            <DetailBlock label="Solution" text={project.solution} />
            <DetailBlock label="Architecture" text={project.architecture} />
            <DetailBlock label="Challenges" text={project.challenges} />
          </div>

          <div className="mt-8">
            <h4 className="font-mono text-xs uppercase tracking-widest text-accent">Key Features</h4>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {project.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <DetailBlock label="Results" text={project.results} />
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="rounded-full border border-border/30 px-3 py-1 text-[11px] font-mono text-muted">
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4 border-t border-border/20 pt-6">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border/40 px-5 py-2.5 text-sm text-ink transition-colors hover:border-accent/50"
            >
              <GithubIcon size={15} /> View Source
            </a>
            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-bg"
              >
                Live Demo <ArrowUpRight size={15} />
              </a>
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
