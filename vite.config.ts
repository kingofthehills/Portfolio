import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { CONTACT_TO_EMAIL, SMTP_USER, parseContactPayload, sendContactEmail } from './server/mailer.ts'

/**
 * Serves POST /api/contact locally under plain `npm run dev`, running the
 * exact same logic as the Vercel function (api/contact.ts) so the two
 * can't drift — Vite's dev server has no knowledge of the api/ folder on
 * its own, that routing only exists once deployed to Vercel (or under
 * `vercel dev`), so without this the contact form 404s locally.
 */
function contactApiDevMiddleware(): Plugin {
  return {
    name: 'contact-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Allow', 'POST')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const raw = Buffer.concat(chunks).toString('utf8')
          const body = raw ? JSON.parse(raw) : {}

          const payload = parseContactPayload(body)
          if (!payload) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'Invalid form data' }))
            return
          }

          await sendContactEmail(payload)
          console.log(`[dev] Contact email sent to ${CONTACT_TO_EMAIL}`)
          res.statusCode = 200
          res.end(JSON.stringify({ ok: true }))
        } catch (err) {
          console.error('[dev] Failed to send contact email', err)
          res.statusCode = 502
          // Surface the real reason in dev — the generic message alone
          // makes SMTP failures (bad credentials, blocked port, etc.)
          // impossible to diagnose from the client side.
          res.end(
            JSON.stringify({
              error: 'Failed to send message',
              detail: err instanceof Error ? err.message : String(err),
              smtpUser: SMTP_USER,
            }),
          )
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), contactApiDevMiddleware()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    // ngrok's free tier assigns a new random *.ngrok-free.dev subdomain
    // each time the tunnel restarts — allowing the whole suffix means
    // this doesn't need updating every time you get a new tunnel URL.
    allowedHosts: ['.ngrok-free.dev'],
  },
})
