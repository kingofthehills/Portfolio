import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import type { Theme } from '@/hooks/useTheme'
import { Ball } from '@/three/journey/Ball'
import { Confetti } from '@/three/journey/Confetti'
import { JourneyCameraRig } from '@/three/journey/JourneyCameraRig'
import { JourneyEnvironment } from '@/three/journey/JourneyEnvironment'
import { PartyPopper } from '@/three/journey/PartyPopper'
import { ShellFragments } from '@/three/journey/ShellFragments'

interface JourneySceneProps {
  particleCount?: number
  theme: Theme
}

export function JourneyScene({ particleCount = 300, theme }: JourneySceneProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
      }}
      camera={{ position: [2.6, 0.6, 1.6], fov: 34 }}
    >
      <JourneyEnvironment particleCount={particleCount} theme={theme} />
      <Ball />
      <ShellFragments />
      <PartyPopper />
      <Confetti />
      <JourneyCameraRig />
    </Canvas>
  )
}
