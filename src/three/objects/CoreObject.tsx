import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  getApertureAngle,
  getCoreEmissiveIntensity,
  getCoreScale,
  getEnergyMix,
  MAX_APERTURE_ANGLE,
} from '@/animations/objectAnimations'
import { mapScrollToScene } from '@/animations/scrollTimeline'
import { cinematicProgress } from '@/three/utils/scrollStore'
import { energyColor } from '@/three/utils/palette'

const PETAL_COUNT = 8

function ShellPetal({ index }: { index: number }) {
  const pivotRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null)

  const longitudeCenter = (index / PETAL_COUNT) * Math.PI * 2 + Math.PI / PETAL_COUNT
  const phiStart = (index / PETAL_COUNT) * Math.PI * 2
  const phiLength = (Math.PI * 2) / PETAL_COUNT

  const hingeAxis = useMemo(() => {
    const axis = new THREE.Vector3(Math.cos(longitudeCenter + Math.PI / 2), 0, Math.sin(longitudeCenter + Math.PI / 2))
    return axis.normalize()
  }, [longitudeCenter])

  const geometry = useMemo(
    () => new THREE.SphereGeometry(1.1, 24, 24, phiStart, phiLength, 0, Math.PI),
    [phiStart, phiLength],
  )

  useFrame(() => {
    const scene = mapScrollToScene(cinematicProgress.value)
    const angle = getApertureAngle(scene)
    pivotRef.current?.quaternion.setFromAxisAngle(hingeAxis, angle)

    if (materialRef.current) {
      const mix = getEnergyMix(scene)
      const openAmount = angle / MAX_APERTURE_ANGLE
      materialRef.current.emissive.copy(energyColor(Math.max(mix, openAmount * 0.7)))
      materialRef.current.emissiveIntensity = 0.25 + openAmount * 0.6 + mix * 0.9
    }
  })

  return (
    <group ref={pivotRef}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          ref={materialRef}
          color="#150f24"
          metalness={0.6}
          roughness={0.4}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
          emissive="#2b2050"
          emissiveIntensity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function InnerCore() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame((_, delta) => {
    const scene = mapScrollToScene(cinematicProgress.value)
    const scale = getCoreScale(scene)
    const intensity = getCoreEmissiveIntensity(scene)
    const mix = getEnergyMix(scene)
    const color = energyColor(mix)

    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale)
      meshRef.current.rotation.y += delta * 0.4
      meshRef.current.rotation.x += delta * 0.15
    }
    if (materialRef.current) {
      materialRef.current.emissive.copy(color)
      materialRef.current.emissiveIntensity = intensity
    }
    if (lightRef.current) {
      lightRef.current.intensity = intensity * 3.5
      lightRef.current.color.copy(color)
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.55, 3]} />
        <meshStandardMaterial ref={materialRef} color="#0f0b1a" emissive="#2b2050" roughness={0.2} metalness={0.3} />
      </mesh>
      <pointLight ref={lightRef} distance={5} decay={2} />
    </group>
  )
}

export function CoreObject() {
  const petals = useMemo(() => Array.from({ length: PETAL_COUNT }, (_, i) => i), [])

  return (
    <group>
      <InnerCore />
      {petals.map((i) => (
        <ShellPetal key={i} index={i} />
      ))}
    </group>
  )
}
