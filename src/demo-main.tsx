import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MetroHero } from '@/components/MetroHero'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MetroHero />
  </StrictMode>,
)
