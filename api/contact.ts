import type { VercelRequest, VercelResponse } from '@vercel/node'
import { parseContactPayload, sendContactEmail } from '../server/mailer.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const payload = parseContactPayload(req.body)
  if (!payload) {
    return res.status(400).json({ error: 'Invalid form data' })
  }

  try {
    await sendContactEmail(payload)
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Failed to send contact email', err)
    return res.status(502).json({ error: 'Failed to send message' })
  }
}
