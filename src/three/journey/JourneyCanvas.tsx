import { Suspense, lazy, useEffect, useState } from 'react'
import { CanvasErrorBoundary } from '@/components/three/CanvasErrorBoundary'
import { useIsSmallScreen } from '@/hooks/useIsTouchDevice'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { Theme } from '@/hooks/useTheme'
import { isWebGLAvailable } from '@/lib/webgl'

const JourneyScene = lazy(() => import('./JourneyScene').then((mod) => ({ default: mod.JourneyScene })))

interface JourneyCanvasProps {
  theme: Theme
}

/**
 * Mounted once and left running for the whole session — the Home cinematic
 * has its own fully opaque canvas that visually covers this one while it's
 * in view, so nothing needs to unmount/pause here for correctness. An
 * earlier version paused (and unmounted) this while Home was active to
 * save GPU time, but that introduced a visible gap: a moment right at the
 * Home → About handoff where neither canvas was painting anything, so the
 * background went flat black until this one finished remounting.
 */
export function JourneyCanvas({ theme }: JourneyCanvasProps) {
  const reducedMotion = useReducedMotion()
  const isSmallScreen = useIsSmallScreen(768)
  const [webglOk, setWebglOk] = useState(true)

  useEffect(() => {
    setWebglOk(isWebGLAvailable())
  }, [])

  if (!webglOk || reducedMotion) return null

  return (
    <CanvasErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <JourneyScene particleCount={isSmallScreen ? 100 : 300} theme={theme} />
      </Suspense>
    </CanvasErrorBoundary>
  )
}
