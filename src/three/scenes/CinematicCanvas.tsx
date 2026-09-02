import { Suspense, lazy, useEffect, useState } from 'react'
import { CanvasErrorBoundary } from '@/components/three/CanvasErrorBoundary'
import { SceneFallback } from '@/components/three/SceneFallback'
import { useIsSmallScreen } from '@/hooks/useIsTouchDevice'
import { isWebGLAvailable } from '@/lib/webgl'

const CinematicScene = lazy(() =>
  import('./CinematicScene').then((mod) => ({ default: mod.CinematicScene })),
)

export function CinematicCanvas() {
  const isSmallScreen = useIsSmallScreen(768)
  const [webglOk, setWebglOk] = useState(true)

  useEffect(() => {
    setWebglOk(isWebGLAvailable())
  }, [])

  if (!webglOk) {
    return <SceneFallback />
  }

  return (
    <CanvasErrorBoundary fallback={<SceneFallback />}>
      <Suspense fallback={<SceneFallback />}>
        <CinematicScene particleCount={isSmallScreen ? 150 : 500} />
      </Suspense>
    </CanvasErrorBoundary>
  )
}
