import { motion } from 'framer-motion'
import { personal } from '@/data/personal'

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
    >
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-display text-2xl tracking-tight text-ink"
      >
        {personal.initials}
      </motion.span>
      <div className="mt-6 h-px w-40 overflow-hidden rounded-full bg-border/20">
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-accent2"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ transformOrigin: 'left' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={onComplete}
        />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-faint"
      >
        Loading experience
      </motion.span>
    </motion.div>
  )
}
