import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { personal } from '@/data/personal'

export function AvailabilityBadge() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        data-cursor="INFO"
        aria-expanded={open}
        className="group inline-flex items-center gap-2 rounded-full border border-border/40 bg-surface/60 px-3.5 py-1.5 text-xs font-mono tracking-wide text-muted transition-colors hover:border-accent2/40 hover:text-ink"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent2 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent2" />
        </span>
        {personal.availability.label.toUpperCase()}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-full z-30 mt-3 w-64 rounded-xl border border-border/50 bg-surface p-4 text-left text-sm text-muted shadow-2xl shadow-black/40"
          >
            {personal.availability.detail}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
