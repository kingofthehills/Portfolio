import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { ballWorldPosition } from '@/three/journey/Ball'
import { explosionState, getExplosionPhase } from '@/three/utils/explosionStore'

export function PartyPopper() {
  const groupRef = useRef<THREE.Group>(null)
  const originRef = useRef<THREE.Vector3 | null>(null)

  useFrame((state) => {
    const elapsedSinceTrigger = explosionState.triggered ? state.clock.elapsedTime - explosionState.triggerTime : -1
    const phase = getExplosionPhase(elapsedSinceTrigger)
    const group = groupRef.current
    if (!group) return

    if (phase !== 'aftermath') {
      group.visible = false
      originRef.current = null
      return
    }

    if (!originRef.current) {
      originRef.current = ballWorldPosition.clone()
    }

    group.visible = true
    group.position.copy(originRef.current)

    const localT = Math.min(1, (elapsedSinceTrigger - 1.35) / 0.3)
    const pop = 1 - Math.pow(1 - localT, 3)
    group.scale.setScalar(pop)
    group.rotation.z = Math.sin(elapsedSinceTrigger * 3) * 0.08
  })

  return (
    <group ref={groupRef} visible={false}>
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.16, 0.4, 16, 1, true]} />
        <meshStandardMaterial color="#8a6cff" roughness={0.4} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#fab044" emissive="#fab044" emissiveIntensity={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}
