import { Suspense, lazy, useEffect, useState } from 'react'
import { useIsSmallScreen } from '@/hooks/useIsTouchDevice'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { isWebGLAvailable } from '@/lib/webgl'
import { CanvasErrorBoundary } from './CanvasErrorBoundary'
import { SceneFallback } from './SceneFallback'

const HeroScene = lazy(() => import('./HeroScene').then((mod) => ({ default: mod.HeroScene })))

export function HeroCanvas() {
  const reducedMotion = useReducedMotion()
  const isSmallScreen = useIsSmallScreen(768)
  const [webglOk, setWebglOk] = useState(true)

  useEffect(() => {
    setWebglOk(isWebGLAvailable())
  }, [])

  if (reducedMotion || !webglOk) {
    return <SceneFallback />
  }

  return (
    <CanvasErrorBoundary fallback={<SceneFallback />}>
      <Suspense fallback={<SceneFallback />}>
        <HeroScene particleCount={isSmallScreen ? 250 : 900} />
      </Suspense>
    </CanvasErrorBoundary>
  )
}
