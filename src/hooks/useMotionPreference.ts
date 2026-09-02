import { useCallback, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const STORAGE_KEY = 'motion-preference-override'

function getStoredOverride(): boolean | null {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'reduced') return true
  if (stored === 'full') return false
  return null
}

/**
 * Combines the OS-level `prefers-reduced-motion` setting with an optional
 * manual override (toggleable from the command palette), so a visitor can
 * opt into or out of the cinematic sequence regardless of their system
 * setting. The override persists across visits via localStorage.
 */
export function useMotionPreference() {
  const systemReducedMotion = useReducedMotion()
  const [override, setOverride] = useState<boolean | null>(getStoredOverride)

  const reducedMotion = override ?? systemReducedMotion

  const toggle = useCallback(() => {
    setOverride((current) => {
      const currentValue = current ?? systemReducedMotion
      const next = !currentValue
      window.localStorage.setItem(STORAGE_KEY, next ? 'reduced' : 'full')
      return next
    })
  }, [systemReducedMotion])

  return { reducedMotion, toggle }
}
