import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { interpolateCameraKeyframes } from '@/lib/cameraPath'
import { journeyProgress } from '@/three/utils/journeyStore'

const targetPosition = new THREE.Vector3()
const targetLookAt = new THREE.Vector3()

export function JourneyCameraRig({ damping = 4.5 }: { damping?: number }) {
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((state, delta) => {
    const keyframes = journeyProgress.cameraKeyframes
    if (keyframes.length === 0) return
    const transform = interpolateCameraKeyframes(keyframes, journeyProgress.overall)

    targetPosition.set(...transform.position)
    targetLookAt.set(...transform.lookAt)

    const t = 1 - Math.exp(-damping * delta)
    state.camera.position.lerp(targetPosition, t)
    currentLookAt.current.lerp(targetLookAt, t)
    state.camera.lookAt(currentLookAt.current)

    if (state.camera instanceof THREE.PerspectiveCamera) {
      state.camera.fov += (transform.fov - state.camera.fov) * t
      state.camera.updateProjectionMatrix()
    }
  })

  return null
}
