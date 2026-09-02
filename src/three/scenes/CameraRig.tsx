import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { getCameraTransform } from '@/animations/cameraAnimations'
import { mapScrollToScene } from '@/animations/scrollTimeline'
import { cinematicProgress } from '@/three/utils/scrollStore'

const targetPosition = new THREE.Vector3()
const targetLookAt = new THREE.Vector3()

export function CameraRig({ damping = 4.5 }: { damping?: number }) {
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((state, delta) => {
    const scene = mapScrollToScene(cinematicProgress.value)
    const transform = getCameraTransform(scene.cameraT)

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
