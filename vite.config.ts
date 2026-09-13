import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
