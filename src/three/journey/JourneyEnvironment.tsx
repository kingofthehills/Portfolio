import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { getCurrentSectionIndex } from '@/journey/buildWaypoints'
import { SECTION_STAGES } from '@/journey/sectionStages'
import type { Theme } from '@/hooks/useTheme'

const THEME_PALETTES: Record<Theme, { background: string; sectionTints: string[]; dust: string; gridMajor: string; gridMinor: string; keyLight: string }> = {
  dark: {
    background: '#050608',
    sectionTints: ['#1c2a52', '#173066', '#12335a', '#1c2a52', '#122a4a'],
    dust: '#8fb3ff',
    gridMajor: '#233056',
    gridMinor: '#0d1220',
    keyLight: '#e8edff',
  },
  light: {
    background: '#eef1f6',
    sectionTints: ['#c8d6ef', '#c3e4de', '#c9d9ee', '#c8d6ef', '#c3d8e8'],
    dust: '#4d7fff',
    gridMajor: '#c3cede',
    gridMinor: '#dbe1ec',
    keyLight: '#ffffff',
  },
}

function DustField({ count, color }: { count: number; color: string }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6
      arr[i * 3 + 2] = -Math.random() * 14
    }
    return arr
  }, [count])

  const ref = useRef<THREE.Points>(null)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.01
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.012} transparent opacity={0.35} depthWrite={false} sizeAttenuation />
    </points>
  )
}

export function JourneyEnvironment({ particleCount, theme }: { particleCount: number; theme: Theme }) {
  const palette = THEME_PALETTES[theme]
  const fogRef = useRef<THREE.Fog>(null)
  const keyLightRef = useRef<THREE.DirectionalLight>(null)
  const currentColor = useRef(new THREE.Color(palette.sectionTints[0]))

  useFrame(() => {
    const index = getCurrentSectionIndex()
    const target = new THREE.Color(palette.sectionTints[index] ?? palette.sectionTints[0])
    currentColor.current.lerp(target, 0.04)
    if (fogRef.current) fogRef.current.color.copy(currentColor.current)
    if (keyLightRef.current) {
      const stage = SECTION_STAGES[index]
      if (stage) keyLightRef.current.position.set(stage.camera.position[0], 3, stage.camera.position[2] + 2)
    }
  })

  return (
    <>
      <color attach="background" args={[palette.background]} />
      <fog ref={fogRef} attach="fog" args={[palette.sectionTints[0], 4, 16]} />
      <ambientLight intensity={theme === 'dark' ? 0.25 : 0.6} />
      <directionalLight ref={keyLightRef} intensity={theme === 'dark' ? 0.5 : 0.8} color={palette.keyLight} />
      <DustField count={particleCount} color={palette.dust} />
      <gridHelper args={[40, 24, palette.gridMajor, palette.gridMinor]} position={[0, -2.4, -6]} />
    </>
  )
}
