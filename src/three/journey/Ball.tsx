import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { getCurrentSectionIndex } from '@/journey/buildWaypoints'
import { interpolateWaypoints } from '@/lib/piecewisePath'
import { ballColor, energyColor } from '@/three/utils/palette'
import { journeyProgress } from '@/three/utils/journeyStore'
import { EXPLOSION_TRIGGER_PROGRESS, explosionState, getExplosionPhase } from '@/three/utils/explosionStore'

const RADIUS = 0.5
const UP = new THREE.Vector3(0, 1, 0)

export const ballWorldPosition = new THREE.Vector3(0, 0, 0)

export function Ball() {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null)
  const rimLightRef = useRef<THREE.PointLight>(null)

  const prevPosition = useRef(new THREE.Vector3(0, 0, 0))
  const lastSectionIndex = useRef(-1)
  const pulseUntil = useRef(0)

  const trailPositions = useMemo(() => new Float32Array(24 * 3), [])
  const trailRef = useRef<THREE.Points>(null)
  const trailHistory = useRef<THREE.Vector3[]>(Array.from({ length: 24 }, () => new THREE.Vector3()))

  useFrame((state, delta) => {
    const t = journeyProgress.overall
    const waypoints = journeyProgress.ballWaypoints
    if (waypoints.length === 0 || !groupRef.current || !meshRef.current) return
    const target = interpolateWaypoints(waypoints, t)

    const group = groupRef.current
    const nextPos = new THREE.Vector3(...target)

    // gentle idle bob layered on top of the travel position
    const bob = Math.sin(state.clock.elapsedTime * 1.4) * 0.05
    nextPos.y += bob

    const velocity = nextPos.clone().sub(prevPosition.current)
    const speed = velocity.length()

    group.position.copy(nextPos)
    ballWorldPosition.copy(nextPos)

    if (speed > 0.0001) {
      const axis = new THREE.Vector3().crossVectors(UP, velocity.clone().normalize())
      if (axis.lengthSq() > 0.00001) {
        axis.normalize()
        const angle = (speed / RADIUS) * 18
        group.rotateOnWorldAxis(axis, angle)
      }
    } else {
      group.rotation.y += delta * 0.15
    }

    prevPosition.current.copy(nextPos)

    // one-time contact finale trigger
    if (!explosionState.triggered && t >= EXPLOSION_TRIGGER_PROGRESS) {
      explosionState.triggered = true
      explosionState.triggerTime = state.clock.elapsedTime
    }
    const elapsedSinceTrigger = explosionState.triggered ? state.clock.elapsedTime - explosionState.triggerTime : -1
    const phase = getExplosionPhase(elapsedSinceTrigger)

    if (phase === 'charge') {
      const chargeT = Math.min(1, elapsedSinceTrigger / 0.7)
      const jitter = 0.015 * chargeT
      group.position.x += (Math.random() - 0.5) * jitter
      group.position.y += (Math.random() - 0.5) * jitter
      meshRef.current.scale.setScalar(1 + chargeT * 0.06)
      const glow = energyColor(1)
      if (materialRef.current) {
        materialRef.current.emissive.copy(glow)
        materialRef.current.emissiveIntensity = 0.6 + chargeT * 2.5
      }
      if (rimLightRef.current) {
        rimLightRef.current.color.copy(glow)
        rimLightRef.current.intensity = 2.2 + chargeT * 6
      }
      return
    }
    if (phase === 'buildup') {
      const buildT = Math.min(1, (elapsedSinceTrigger - 0.7) / 0.4)
      meshRef.current.scale.setScalar(1.06 - buildT * 0.3)
      if (materialRef.current) materialRef.current.emissiveIntensity = 3 + buildT * 2
      if (rimLightRef.current) rimLightRef.current.intensity = 8 + buildT * 6
      return
    }
    if (phase === 'blast' || phase === 'aftermath') {
      meshRef.current.visible = false
      if (rimLightRef.current) rimLightRef.current.intensity = 0
      return
    }

    // section-change activation pulse
    const sectionIndex = getCurrentSectionIndex()
    if (sectionIndex !== lastSectionIndex.current) {
      lastSectionIndex.current = sectionIndex
      pulseUntil.current = state.clock.elapsedTime + 0.9
    }
    const pulseRemaining = Math.max(0, pulseUntil.current - state.clock.elapsedTime)
    const pulse = pulseRemaining > 0 ? Math.sin((pulseRemaining / 0.9) * Math.PI) : 0

    const energy = Math.min(1, Math.min(1, speed * 6) * 0.5 + pulse * 0.6)
    const color = ballColor(energy)

    if (materialRef.current) {
      materialRef.current.emissive.copy(color)
      materialRef.current.emissiveIntensity = 0.7 + pulse * 1.1
    }
    if (rimLightRef.current) {
      rimLightRef.current.color.copy(color)
      rimLightRef.current.intensity = 1.8 + pulse * 3
    }

    meshRef.current.scale.setScalar(1 + pulse * 0.12)

    // trailing dust particles
    trailHistory.current.pop()
    trailHistory.current.unshift(nextPos.clone())
    trailHistory.current.forEach((p, i) => {
      trailPositions[i * 3] = p.x
      trailPositions[i * 3 + 1] = p.y - 0.05
      trailPositions[i * 3 + 2] = p.z
    })
    if (trailRef.current) {
      const attr = trailRef.current.geometry.getAttribute('position') as THREE.BufferAttribute
      attr.needsUpdate = true
    }
  })

  return (
    <>
      <group ref={groupRef}>
        <mesh ref={meshRef} castShadow>
          <sphereGeometry args={[RADIUS, 48, 48]} />
          <meshPhysicalMaterial
            ref={materialRef}
            color="#b5730f"
            metalness={0.4}
            roughness={0.42}
            clearcoat={0.35}
            clearcoatRoughness={0.5}
            emissive="#fab044"
            emissiveIntensity={0.7}
          />
        </mesh>
        <pointLight ref={rimLightRef} color="#fab044" distance={3.5} decay={2} intensity={1.8} />
      </group>

      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[trailPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#fab044" size={0.05} transparent opacity={0.35} depthWrite={false} sizeAttenuation />
      </points>
    </>
  )
}
