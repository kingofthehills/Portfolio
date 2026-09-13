import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ballWorldPosition } from '@/three/journey/Ball'
import { energyColor } from '@/three/utils/palette'
import { explosionState, getExplosionPhase } from '@/three/utils/explosionStore'

const COUNT = 10
const dummy = new THREE.Object3D()

interface FragmentState {
  position: THREE.Vector3
  velocity: THREE.Vector3
  rotation: THREE.Euler
  angularVelocity: THREE.Vector3
}

export function ShellFragments() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null)
  const initialized = useRef(false)

  const fragments = useMemo<FragmentState[]>(
    () =>
      Array.from({ length: COUNT }, () => ({
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        rotation: new THREE.Euler(),
        angularVelocity: new THREE.Vector3(),
      })),
    [],
  )

  useFrame((state, delta) => {
    const elapsedSinceTrigger = explosionState.triggered ? state.clock.elapsedTime - explosionState.triggerTime : -1
    const phase = getExplosionPhase(elapsedSinceTrigger)
    const mesh = meshRef.current
    if (!mesh) return

    if (phase === 'blast' || phase === 'aftermath') {
      if (!initialized.current) {
        initialized.current = true
        fragments.forEach((frag) => {
          frag.position.copy(ballWorldPosition)
          const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.8 + 0.2, Math.random() - 0.5).normalize()
          frag.velocity.copy(dir).multiplyScalar(1.5 + Math.random() * 1.5)
          frag.angularVelocity.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
          )
        })
        if (materialRef.current) materialRef.current.emissive.copy(energyColor(1))
      }

      fragments.forEach((frag, i) => {
        frag.velocity.y -= 2.2 * delta
        frag.velocity.multiplyScalar(0.99)
        frag.position.addScaledVector(frag.velocity, delta)
        frag.rotation.x += frag.angularVelocity.x * delta
        frag.rotation.y += frag.angularVelocity.y * delta
        frag.rotation.z += frag.angularVelocity.z * delta

        dummy.position.copy(frag.position)
        dummy.rotation.copy(frag.rotation)
        dummy.scale.setScalar(1)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      })
      mesh.instanceMatrix.needsUpdate = true
      mesh.visible = true
    } else {
      mesh.visible = false
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} visible={false} frustumCulled={false}>
      <icosahedronGeometry args={[0.13, 0]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color="#180f28"
        metalness={0.8}
        roughness={0.25}
        emissive="#fab044"
        emissiveIntensity={1}
      />
    </instancedMesh>
  )
}
