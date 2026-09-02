import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { CoreObject } from '@/three/objects/CoreObject'
import { EnergyStream } from '@/three/objects/EnergyStream'
import { ReceiverCrystal } from '@/three/objects/ReceiverCrystal'
import { SceneEnvironment } from '@/three/objects/SceneEnvironment'
import { CameraRig } from '@/three/scenes/CameraRig'

export function CinematicScene({ particleCount = 500 }: { particleCount?: number }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.85,
      }}
      camera={{ position: [0, 0.6, 7.2], fov: 38 }}
    >
      <SceneEnvironment particleCount={particleCount} />
      <CoreObject />
      <EnergyStream />
      <ReceiverCrystal />
      <CameraRig />
    </Canvas>
  )
}
