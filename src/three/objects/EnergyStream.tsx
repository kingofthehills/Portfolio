import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { getEnergyMix, getStreamHead, getStreamLength } from '@/animations/objectAnimations'
import { mapScrollToScene } from '@/animations/scrollTimeline'
import { energyColor } from '@/three/utils/palette'
import { cinematicProgress } from '@/three/utils/scrollStore'
import { STREAM_CURVE } from '@/three/utils/scenePoints'

const INSTANCE_COUNT = 48
const TRAIL_SPAN = 0.32
const dummy = new THREE.Object3D()

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

export function EnergyStream() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)

  const gradient = useMemo(() => {
    const colors = new Float32Array(INSTANCE_COUNT * 3)
    for (let i = 0; i < INSTANCE_COUNT; i++) {
      const brightness = 0.25 + (i / (INSTANCE_COUNT - 1)) * 0.85
      colors[i * 3] = brightness
      colors[i * 3 + 1] = brightness
      colors[i * 3 + 2] = brightness
    }
    return colors
  }, [])

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    mesh.instanceColor = new THREE.InstancedBufferAttribute(gradient, 3)
  }, [gradient])

  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh) return

    const scene = mapScrollToScene(cinematicProgress.value)
    const frontT = getStreamHead(scene)
    const tailFraction = getStreamLength(scene)
    const span = TRAIL_SPAN * tailFraction
    const backT = Math.max(0, frontT - span)

    if (materialRef.current) {
      materialRef.current.color.copy(energyColor(getEnergyMix(scene)))
      materialRef.current.opacity = frontT > 0.002 ? 1 : 0
    }

    for (let i = 0; i < INSTANCE_COUNT; i++) {
      const t = i / (INSTANCE_COUNT - 1)
      const visible = t >= backT && t <= frontT && frontT > 0.002

      if (!visible) {
        dummy.scale.setScalar(0)
      } else {
        const point = STREAM_CURVE.getPointAt(Math.min(1, Math.max(0, t)))
        dummy.position.copy(point)
        const edgeFade = Math.min(smoothstep(backT, backT + 0.03, t), 1 - smoothstep(frontT - 0.03, frontT, t))
        const scale = 0.035 + edgeFade * 0.05
        dummy.scale.setScalar(Math.max(0.001, scale))
      }
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, INSTANCE_COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial ref={materialRef} vertexColors transparent toneMapped={false} />
    </instancedMesh>
  )
}
