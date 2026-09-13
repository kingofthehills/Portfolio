import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ballWorldPosition } from '@/three/journey/Ball'
import { explosionState, getExplosionPhase } from '@/three/utils/explosionStore'

const COUNT = 140
const dummy = new THREE.Object3D()

const PALETTE = ['#8a6cff', '#fab044', '#f6f5fa', '#c3b3ff']

interface Piece {
  position: THREE.Vector3
  velocity: THREE.Vector3
  rotation: THREE.Euler
  angularVelocity: THREE.Vector3
}

export function Confetti() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const initialized = useRef(false)

  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: COUNT }, () => ({
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        rotation: new THREE.Euler(),
        angularVelocity: new THREE.Vector3(),
      })),
    [],
  )

  const colors = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    const color = new THREE.Color()
    for (let i = 0; i < COUNT; i++) {
      color.set(PALETTE[i % PALETTE.length])
      arr[i * 3] = color.r
      arr[i * 3 + 1] = color.g
      arr[i * 3 + 2] = color.b
    }
    return arr
  }, [])

  useEffect(() => {
    const mesh = meshRef.current
    if (mesh) mesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3)
  }, [colors])

  useFrame((state, delta) => {
    const elapsedSinceTrigger = explosionState.triggered ? state.clock.elapsedTime - explosionState.triggerTime : -1
    const phase = getExplosionPhase(elapsedSinceTrigger)
    const mesh = meshRef.current
    if (!mesh) return

    if (phase !== 'aftermath') {
      mesh.visible = false
      return
    }

    if (!initialized.current) {
      initialized.current = true
      pieces.forEach((piece) => {
        piece.position.copy(ballWorldPosition)
        const angle = Math.random() * Math.PI * 2
        const upward = 1.4 + Math.random() * 1.8
        const spread = 0.6 + Math.random() * 1.8
        piece.velocity.set(Math.cos(angle) * spread, upward, Math.sin(angle) * spread)
        piece.angularVelocity.set(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
        )
      })
    }

    mesh.visible = true
    pieces.forEach((piece, i) => {
      piece.velocity.y -= 1.6 * delta
      piece.velocity.x *= 0.995
      piece.velocity.z *= 0.995
      piece.position.addScaledVector(piece.velocity, delta)
      piece.rotation.x += piece.angularVelocity.x * delta
      piece.rotation.y += piece.angularVelocity.y * delta
      piece.rotation.z += piece.angularVelocity.z * delta

      dummy.position.copy(piece.position)
      dummy.rotation.copy(piece.rotation)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} visible={false} frustumCulled={false}>
      <boxGeometry args={[0.07, 0.07, 0.006]} />
      <meshStandardMaterial vertexColors roughness={0.6} metalness={0.05} side={THREE.DoubleSide} />
    </instancedMesh>
  )
}
