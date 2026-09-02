import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { getEnergyMix, getReceiverFill, getSplashScale } from '@/animations/objectAnimations'
import { mapScrollToScene } from '@/animations/scrollTimeline'
import { energyColor } from '@/three/utils/palette'
import { RECEIVER_ENTRY_POINT, RECEIVER_POSITION, RECEIVER_RADIUS } from '@/three/utils/scenePoints'
import { cinematicProgress } from '@/three/utils/scrollStore'

const SPARK_COUNT = 14
const dummy = new THREE.Object3D()
// SparkBurst renders inside a group already translated to RECEIVER_POSITION,
// so the burst origin needs to be local (relative to that group), not world-space.
const LOCAL_ENTRY_POINT = RECEIVER_ENTRY_POINT.clone().sub(RECEIVER_POSITION)

function SparkBurst() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)

  const directions = useMemo(
    () =>
      Array.from({ length: SPARK_COUNT }, () => {
        const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.6, Math.random() - 0.5)
        return dir.normalize()
      }),
    [],
  )

  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const scene = mapScrollToScene(cinematicProgress.value)
    const splash = getSplashScale(scene)

    if (materialRef.current) {
      materialRef.current.color.copy(energyColor(getEnergyMix(scene)))
      materialRef.current.opacity = splash
    }

    directions.forEach((dir, i) => {
      dummy.position.copy(LOCAL_ENTRY_POINT).addScaledVector(dir, splash * 0.4)
      dummy.scale.setScalar(splash > 0.02 ? 0.025 + splash * 0.02 : 0.0001)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SPARK_COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial ref={materialRef} transparent toneMapped={false} />
    </instancedMesh>
  )
}

export function ReceiverCrystal() {
  const fillRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(() => {
    const scene = mapScrollToScene(cinematicProgress.value)
    const fill = getReceiverFill(scene)
    const color = energyColor(getEnergyMix(scene))

    if (fillRef.current) {
      const height = Math.max(0.001, fill * RECEIVER_RADIUS * 1.5)
      fillRef.current.scale.set(RECEIVER_RADIUS * 0.7, height, RECEIVER_RADIUS * 0.7)
      fillRef.current.position.y = -RECEIVER_RADIUS + height / 2
      const material = fillRef.current.material as THREE.MeshStandardMaterial
      material.emissive.copy(color)
      material.emissiveIntensity = 0.6 + fill * 1.8
    }
    if (lightRef.current) {
      lightRef.current.intensity = fill * 4
      lightRef.current.color.copy(color)
    }
  })

  return (
    <group position={RECEIVER_POSITION}>
      <mesh>
        <icosahedronGeometry args={[RECEIVER_RADIUS, 1]} />
        <meshPhysicalMaterial
          thickness={0.4}
          roughness={0.08}
          transmission={1}
          ior={1.4}
          clearcoat={0.4}
          clearcoatRoughness={0.15}
          color="#e8f0ff"
          attenuationColor="#dfe9ff"
          attenuationDistance={1.2}
        />
      </mesh>
      <mesh ref={fillRef}>
        <cylinderGeometry args={[1, 1, 1, 20]} />
        <meshStandardMaterial color="#0a0e18" emissive="#1c2a52" roughness={0.3} metalness={0.1} />
      </mesh>
      <pointLight ref={lightRef} distance={4} decay={2} position={[0, 0, 0]} />
      <SparkBurst />
    </group>
  )
}
