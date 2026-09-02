import { motion } from 'framer-motion'
import {
  Copy,
  Eye,
  EyeOff,
  FileText,
  Moon,
  Navigation,
  Search,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { GithubIcon, LinkedinIcon } from '@/components/icons/BrandIcons'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { navItems } from '@/data/navigation'
import { personal } from '@/data/personal'
import { social } from '@/data/social'
import type { Theme } from '@/hooks/useTheme'

type IconComponent = (props: { size?: number; className?: string }) => ReactNode

interface Command {
  id: string
  label: string
  hint?: string
  icon: IconComponent
  action: () => void
}

interface CommandPaletteProps {
  onClose: () => void
  theme: Theme
  onToggleTheme: () => void
  reducedMotion: boolean
  onToggleMotion: () => void
  soundEnabled: boolean
  onToggleSound: () => void
}

export function CommandPalette({
  onClose,
  theme,
  onToggleTheme,
  reducedMotion,
  onToggleMotion,
  soundEnabled,
  onToggleSound,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useLockBodyScroll(true)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const commands = useMemo<Command[]>(() => {
    const navCommands: Command[] = navItems.map((item) => ({
      id: `nav-${item.id}`,
      label: `Go to ${item.label}`,
      hint: 'Navigate',
      icon: Navigation,
      action: () => {
        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
      },
    }))

    return [
      ...navCommands,
      {
        id: 'resume',
        label: 'Download Resume',
        hint: 'Open PDF',
        icon: FileText,
        action: () => window.open(personal.resumeUrl, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'github',
        label: 'Open GitHub',
        hint: 'External link',
        icon: GithubIcon,
        action: () => window.open(social.github, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'linkedin',
        label: 'Open LinkedIn',
        hint: 'External link',
        icon: LinkedinIcon,
        action: () => window.open(social.linkedin, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'theme',
        label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        hint: 'Toggle theme',
        icon: theme === 'dark' ? Sun : Moon,
        action: onToggleTheme,
      },
      {
        id: 'copy-email',
        label: 'Copy Email Address',
        hint: social.email,
        icon: Copy,
        action: () => void navigator.clipboard.writeText(social.email),
      },
      {
        id: 'sound',
        label: soundEnabled ? 'Turn Sound Off' : 'Turn Sound On',
        hint: 'Ambient audio',
        icon: soundEnabled ? Volume2 : VolumeX,
        action: onToggleSound,
      },
      {
        id: 'motion',
        label: reducedMotion ? 'Disable Reduced Motion' : 'Enable Reduced Motion',
        hint: 'Cinematic sequence',
        icon: reducedMotion ? Eye : EyeOff,
        action: onToggleMotion,
      },
    ]
  }, [theme, onToggleTheme, soundEnabled, onToggleSound, reducedMotion, onToggleMotion])

  const filtered = useMemo(
    () => commands.filter((cmd) => cmd.label.toLowerCase().includes(query.toLowerCase())),
    [commands, query],
  )

  useEffect(() => {
    setSelected(0)
  }, [query])

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        setSelected((i) => Math.min(i + 1, filtered.length - 1))
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        setSelected((i) => Math.max(i - 1, 0))
      } else if (event.key === 'Enter') {
        event.preventDefault()
        const command = filtered[selected]
        if (command) {
          command.action()
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [filtered, selected, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-start justify-center bg-bg/70 px-4 pt-24 backdrop-blur-md sm:pt-32"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border/40 bg-surface shadow-2xl shadow-black/50"
      >
        <div className="flex items-center gap-3 border-b border-border/20 px-4 py-3.5">
          <Search size={16} className="text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            placeholder="Type a command or search..."
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint"
          />
          <kbd className="rounded border border-border/40 px-1.5 py-0.5 font-mono text-[10px] text-faint">ESC</kbd>
        </div>

        <ul className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-faint">No matching commands.</li>
          ) : (
            filtered.map((command, index) => {
              const Icon = command.icon
              return (
                <li key={command.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setSelected(index)}
                    onClick={() => {
                      command.action()
                      onClose()
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                      selected === index ? 'bg-surface-2 text-ink' : 'text-muted'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={15} />
                      {command.label}
                    </span>
                    {command.hint ? <span className="font-mono text-[10px] text-faint">{command.hint}</span> : null}
                  </button>
                </li>
              )
            })
          )}
        </ul>
      </motion.div>
    </motion.div>
  )
}
