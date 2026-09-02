import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { FileText, Menu, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { MagneticButton } from '@/components/MagneticButton'
import { ThemeToggle } from '@/components/ThemeToggle'
import { navItems } from '@/data/navigation'
import { personal } from '@/data/personal'
import type { Theme } from '@/hooks/useTheme'

interface NavbarProps {
  activeSection: string
  theme: Theme
  onToggleTheme: () => void
  onOpenPalette: () => void
}

export function Navbar({ activeSection, theme, onToggleTheme, onOpenPalette }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const logoClicks = useRef(0)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24)
  })

  function handleLogoClick() {
    logoClicks.current += 1
    if (logoClicks.current >= 5) {
      logoClicks.current = 0
      console.log(
        '%cStill here? Respect.',
        'font-size:16px;font-weight:700;color:#35e7b7;',
        `\n${personal.name} — ${personal.role}\nReach out any time: check the contact section.`,
      )
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6"
      >
        <nav
          className={`flex w-full max-w-5xl items-center justify-between rounded-full border transition-all duration-500 ${
            scrolled
              ? 'border-border/40 bg-surface/70 px-4 py-2.5 shadow-lg shadow-black/20 backdrop-blur-xl'
              : 'border-transparent bg-transparent px-4 py-3.5'
          }`}
        >
          <button
            type="button"
            onClick={handleLogoClick}
            data-cursor="HI"
            className="font-display text-sm font-semibold tracking-tight text-ink"
            aria-label="Logo — click for a surprise"
          >
            {personal.initials}
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((navItem) => (
              <li key={navItem.id}>
                <a
                  href={`#${navItem.id}`}
                  data-cursor="GO"
                  className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors ${
                    activeSection === navItem.id ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {activeSection === navItem.id ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-surface-2"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">{navItem.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPalette}
              data-cursor="⌘K"
              className="hidden items-center gap-1.5 rounded-full border border-border/40 px-3 py-1.5 font-mono text-[11px] text-faint transition-colors hover:text-ink lg:flex"
            >
              <span>⌘</span>K
            </button>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <MagneticButton
              href={personal.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              cursorLabel="OPEN"
              className="hidden items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-bg sm:flex"
            >
              <FileText size={13} />
              Resume
            </MagneticButton>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 text-ink md:hidden"
            >
              <Menu size={16} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <MobileMenu activeSection={activeSection} onClose={() => setMenuOpen(false)} />
        ) : null}
      </AnimatePresence>
    </>
  )
}

function MobileMenu({ activeSection, onClose }: { activeSection: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[90] flex flex-col bg-bg/98 backdrop-blur-xl md:hidden"
    >
      <div className="flex items-center justify-between px-6 pt-6">
        <span className="font-display text-sm font-semibold text-ink">{personal.initials}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border/40 text-ink"
        >
          <X size={18} />
        </button>
      </div>

      <motion.ul
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
        className="flex flex-1 flex-col items-start justify-center gap-2 px-8"
      >
        {navItems.map((navItem) => (
          <motion.li
            key={navItem.id}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href={`#${navItem.id}`}
              onClick={onClose}
              className={`font-display text-4xl tracking-tight transition-colors ${
                activeSection === navItem.id ? 'text-ink' : 'text-faint'
              }`}
            >
              {navItem.label}
            </a>
          </motion.li>
        ))}
      </motion.ul>

      <div className="flex items-center justify-between border-t border-border/30 px-8 py-6">
        <a href={personal.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-muted">
          Resume ↗
        </a>
        <span className="font-mono text-xs text-faint">{personal.availability.label}</span>
      </div>
    </motion.div>
  )
}
