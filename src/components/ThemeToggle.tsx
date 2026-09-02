import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Theme } from '@/hooks/useTheme'

interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={onToggle}
      data-cursor="TOGGLE"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative flex h-8 w-8 items-center justify-center rounded-full border border-border/40 text-muted transition-colors hover:text-ink hover:border-accent/40"
    >
      <motion.span
        initial={false}
        animate={{ rotate: isDark ? 0 : 180, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </motion.span>
    </button>
  )
}
