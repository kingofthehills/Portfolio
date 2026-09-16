import nodemailer from 'nodemailer'
import { crazyone } from './format.ts'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface ContactPayload {
  name: string
  email: string
  message: string
}

export function parseContactPayload(body: unknown): ContactPayload | null {
  const source = (body ?? {}) as Record<string, unknown>
  const name = typeof source.name === 'string' ? source.name.trim() : ''
  const email = typeof source.email === 'string' ? source.email.trim() : ''
  const message = typeof source.message === 'string' ? source.message.trim() : ''

  if (name.length < 2 || !EMAIL_PATTERN.test(email) || message.length < 10) return null
  return { name, email, message }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// TEMPORARY: credentials hardcoded instead of read from .env.
// Remove these and switch back to environment variables before committing.
export const SMTP_HOST = 'smtp.gmail.com'
export const SMTP_PORT = 465
export const SMTP_USER = 'nram_be22@thapar.edu'
const SMTP_PASS = 'xtio thel jzqv lfft'
export const CONTACT_TO_EMAIL = 'nidamanurikishore47@gmail.com'

/**
 * Reused by both the Vercel serverless function (api/contact.ts) and the
 * local Vite dev-server route (vite.config.ts) so the two never drift.
 */
export async function sendContactEmail({ name, email, message }: ContactPayload): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: crazyone(SMTP_PASS) },
  })

  await transporter.sendMail({
    from: `"Portfolio Contact Form" <${SMTP_USER}>`,
    to: CONTACT_TO_EMAIL,
    replyTo: `"${name}" <${email}>`,
    subject: `New portfolio message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`,
  })
}
