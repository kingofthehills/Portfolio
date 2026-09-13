import type { VercelRequest, VercelResponse } from '@vercel/node'
import nodemailer from 'nodemailer'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ContactBody {
  name?: unknown
  email?: unknown
  message?: unknown
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body as ContactBody
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (name.length < 2 || !EMAIL_PATTERN.test(email) || message.length < 10) {
    return res.status(400).json({ error: 'Invalid form data' })
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL } = process.env

  if (!SMTP_USER || !SMTP_PASS) {
    console.error('Missing SMTP_USER / SMTP_PASS environment variables')
    return res.status(500).json({ error: 'Email is not configured' })
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST || 'smtp.gmail.com',
    port: SMTP_PORT ? Number(SMTP_PORT) : 465,
    secure: (SMTP_PORT ? Number(SMTP_PORT) : 465) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${SMTP_USER}>`,
      to: CONTACT_TO_EMAIL || SMTP_USER,
      replyTo: `"${name}" <${email}>`,
      subject: `New portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Failed to send contact email', err)
    return res.status(502).json({ error: 'Failed to send message' })
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
