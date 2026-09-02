import { Environment, Lightformer } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { getEnvironmentIntensity, getParticleEnergy } from '@/animations/objectAnimations'
import { mapScrollToScene } from '@/animations/scrollTimeline'
import { cinematicProgress } from '@/three/utils/scrollStore'

function DustField({ count }: { count: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 9
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5
      arr[i * 3 + 2] = (Math.random() - 0.5) * 9
    }
    return arr
  }, [count])

  const ref = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)

  useFrame((_, delta) => {
    const scene = mapScrollToScene(cinematicProgress.value)
    const energy = getParticleEnergy(scene)
    if (ref.current) {
      ref.current.rotation.y += delta * 0.015 * energy
    }
    if (materialRef.current) {
      materialRef.current.opacity = 0.3 + scene.environment * 0.35
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={materialRef} color="#8fb3ff" size={0.014} transparent opacity={0.3} depthWrite={false} />
    </points>
  )
}

function Rig() {
  const keyLightRef = useRef<THREE.DirectionalLight>(null)
  const rimLightRef = useRef<THREE.PointLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)

  useFrame(() => {
    const scene = mapScrollToScene(cinematicProgress.value)
    const intensity = getEnvironmentIntensity(scene)
    if (ambientRef.current) ambientRef.current.intensity = 0.12 + intensity * 0.18
    if (keyLightRef.current) keyLightRef.current.intensity = 0.4 + intensity * 0.6
    if (rimLightRef.current) rimLightRef.current.intensity = 0.6 + scene.reveal * 1.2
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.15} />
      <directionalLight ref={keyLightRef} position={[3, 4, 2]} intensity={0.5} color="#e8edff" />
      <pointLight ref={rimLightRef} position={[-3, 1, -3]} color="#35e7b7" intensity={0.6} distance={9} />
    </>
  )
}

export function SceneEnvironment({ particleCount }: { particleCount: number }) {
  return (
    <>
      <color attach="background" args={['#050608']} />
      <fog attach="fog" args={['#050608', 5, 14]} />
      {/* Procedural, network-free environment — cheap to build and lights up
          the receiver's glass transmission without fetching a remote HDRI. */}
      <Environment resolution={32} frames={1}>
        <Lightformer intensity={0.9} color="#4d7fff" position={[3, 2, 2]} scale={[4, 4, 1]} />
        <Lightformer intensity={0.7} color="#35e7b7" position={[-3, -1, -2]} scale={[3, 3, 1]} />
        <Lightformer intensity={0.5} color="#ffffff" position={[0, 3, -3]} scale={[6, 2, 1]} />
      </Environment>
      <Rig />
      <DustField count={particleCount} />
      <gridHelper args={[24, 24, '#233056', '#0d1220']} position={[0, -2.2, 0]} />
      <mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#050608" roughness={0.35} metalness={0.6} />
      </mesh>
    </>
  )
}
