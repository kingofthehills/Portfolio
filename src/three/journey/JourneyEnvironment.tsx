import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { getCurrentSectionIndex } from '@/journey/buildWaypoints'
import { SECTION_STAGES } from '@/journey/sectionStages'
import type { Theme } from '@/hooks/useTheme'

const THEME_PALETTES: Record<Theme, { background: string; sectionTints: string[]; dust: string; gridMajor: string; gridMinor: string; keyLight: string }> = {
  dark: {
    background: '#060609',
    sectionTints: ['#2b2050', '#241a44', '#1e1640', '#2b2050', '#1a1338'],
    dust: '#c3b3ff',
    gridMajor: '#33245c',
    gridMinor: '#170f26',
    keyLight: '#efe9ff',
  },
  light: {
    background: '#f4f1fb',
    sectionTints: ['#dcd0f5', '#f3ddac', '#ded3f4', '#dcd0f5', '#f0dcae'],
    dust: '#8a6cff',
    gridMajor: '#d9cdf0',
    gridMinor: '#efe7f8',
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
