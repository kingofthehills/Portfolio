import { motion } from 'framer-motion'
import { CHAPTERS } from '@/lib/chapters'

export function ChapterIndicator({ activeChapter }: { activeChapter: string }) {
  return (
    <div aria-hidden className="fixed bottom-8 left-8 z-40 hidden flex-col gap-3 xl:flex">
      {CHAPTERS.map((chapter, index) => {
        const isActive = chapter.id === activeChapter
        return (
          <div key={chapter.id} className="flex items-center gap-3">
            <span
              className={`font-mono text-[11px] tracking-widest transition-colors duration-500 ${
                isActive ? 'text-ink' : 'text-faint'
              }`}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <motion.span
              animate={{ width: isActive ? 28 : 14, opacity: isActive ? 1 : 0.3 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-px bg-accent2"
            />
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 ${
                isActive ? 'text-accent2' : 'text-faint/60'
              }`}
            >
              {chapter.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
