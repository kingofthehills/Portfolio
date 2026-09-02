import { socialLinks } from '@/data/social'
import { personal } from '@/data/personal'
import { navItems } from '@/data/navigation'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border/20">
      <div className="mx-auto max-w-[1400px] px-6 py-14 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="font-display text-lg text-ink">{personal.name}</span>
            <p className="mt-2 max-w-xs text-sm text-muted">Designed &amp; built with curiosity.</p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2">
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="link-underline text-sm text-muted">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {socialLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                target={link.key === 'email' ? undefined : '_blank'}
                rel={link.key === 'email' ? undefined : 'noopener noreferrer'}
                data-cursor="OPEN"
                className="link-underline text-sm text-muted"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-4 border-t border-border/10 pt-6 text-xs text-faint sm:flex-row sm:items-center">
          <span>© {year} {personal.name}. All rights reserved.</span>
          <span className="font-mono uppercase tracking-widest">Built with React · Three.js · Framer Motion</span>
        </div>
      </div>
    </footer>
  )
}
