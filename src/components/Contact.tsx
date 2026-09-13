import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Loader2, Mail, Phone, XCircle } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { GithubIcon, LinkedinIcon } from '@/components/icons/BrandIcons'
import { MagneticButton } from '@/components/MagneticButton'
import { SectionHeading } from '@/components/SectionHeading'
import { personal } from '@/data/personal'
import { social } from '@/data/social'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface FormState {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}
  if (form.name.trim().length < 2) errors.name = 'Enter your name.'
  if (!EMAIL_PATTERN.test(form.email)) errors.email = 'Enter a valid email address.'
  if (form.message.trim().length < 10) errors.message = 'Message should be at least 10 characters.'
  return errors
}

export function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('loading')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error('Request failed')
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="relative bg-bg py-28">
      {/* A static warm glow instead of the animated shader used on the
          Projects/Open Source sections — a plain radial gradient reads
          as a photo-lit backdrop without pulling in WebGL for a section
          that doesn't need the motion. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: 'radial-gradient(700px circle at 50% 0%, rgb(var(--accent-2) / 0.16), transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 sm:px-10 lg:grid-cols-12 lg:px-16">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="Contact" title="Let's build something great." />
          <p className="mt-6 max-w-md text-balance leading-relaxed text-muted">
            Have a project in mind, or just want to talk shop? My inbox is open — I try to reply within a couple of
            days.
          </p>

          <div className="mt-8 space-y-4">
            <a href={`mailto:${social.email}`} data-cursor="EMAIL" className="link-underline flex items-center gap-3 text-sm text-ink">
              <Mail size={16} /> {social.email}
            </a>
            <a href={`tel:${social.phone.replace(/[^+\d]/g, '')}`} data-cursor="CALL" className="link-underline flex items-center gap-3 text-sm text-ink">
              <Phone size={16} /> {social.phone}
            </a>
            <a href={social.github} target="_blank" rel="noopener noreferrer" data-cursor="OPEN" className="link-underline flex items-center gap-3 text-sm text-ink">
              <GithubIcon size={16} /> GitHub
            </a>
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" data-cursor="OPEN" className="link-underline flex items-center gap-3 text-sm text-ink">
              <LinkedinIcon size={16} /> LinkedIn
            </a>
          </div>

          <MagneticButton
            href={personal.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            cursorLabel="OPEN"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-border/40 px-5 py-2.5 text-sm text-ink transition-colors hover:border-accent/50"
          >
            View Resume
          </MagneticButton>
        </div>

        <form onSubmit={handleSubmit} noValidate className="lg:col-span-7">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor="name" className="text-xs font-mono uppercase tracking-widest text-faint">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                aria-invalid={Boolean(errors.name)}
                className="mt-2 w-full rounded-xl border border-border/40 bg-surface/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent/60"
                placeholder="Your name"
              />
              {errors.name ? <p className="mt-1.5 text-xs text-red-400">{errors.name}</p> : null}
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="email" className="text-xs font-mono uppercase tracking-widest text-faint">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                aria-invalid={Boolean(errors.email)}
                className="mt-2 w-full rounded-xl border border-border/40 bg-surface/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent/60"
                placeholder="you@example.com"
              />
              {errors.email ? <p className="mt-1.5 text-xs text-red-400">{errors.email}</p> : null}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="message" className="text-xs font-mono uppercase tracking-widest text-faint">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                aria-invalid={Boolean(errors.message)}
                className="mt-2 w-full resize-none rounded-xl border border-border/40 bg-surface/40 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent/60"
                placeholder="Tell me about your project..."
              />
              {errors.message ? <p className="mt-1.5 text-xs text-red-400">{errors.message}</p> : null}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              type="submit"
              disabled={status === 'loading'}
              data-cursor="SEND"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-bg transition-opacity disabled:opacity-60"
            >
              {status === 'loading' ? (
                <>
                  Sending <Loader2 size={16} className="animate-spin" />
                </>
              ) : (
                <>
                  Send Message
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.span
                  key="success"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="inline-flex items-center gap-1.5 text-sm text-accent2"
                >
                  <CheckCircle2 size={16} /> Message sent — I&apos;ll be in touch.
                </motion.span>
              ) : null}
              {status === 'error' ? (
                <motion.span
                  key="error"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="inline-flex items-center gap-1.5 text-sm text-red-400"
                >
                  <XCircle size={16} /> Something went wrong. Try again.
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </section>
  )
}
