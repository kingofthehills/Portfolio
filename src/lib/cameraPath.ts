import { interpolateWaypoints } from '@/lib/piecewisePath'

export interface CameraKeyframe {
  t: number
  position: [number, number, number]
  lookAt: [number, number, number]
  fov: number
}

export interface CameraTransform {
  position: [number, number, number]
  lookAt: [number, number, number]
  fov: number
}

/** Shared by the Home cinematic camera and the section-journey camera. */
export function interpolateCameraKeyframes(keyframes: CameraKeyframe[], progress: number): CameraTransform {
  const t = Math.min(1, Math.max(0, progress))

  let index = 0
  for (let i = 0; i < keyframes.length - 1; i++) {
    index = i
    if (t <= keyframes[i + 1].t) break
  }

  const start = keyframes[index]
  const end = keyframes[Math.min(keyframes.length - 1, index + 1)]
  const span = end.t - start.t
  const segmentT = span > 0 ? (t - start.t) / span : 0

  return {
    position: interpolateWaypoints(
      [
        { t: 0, position: start.position },
        { t: 1, position: end.position },
      ],
      segmentT,
    ),
    lookAt: interpolateWaypoints(
      [
        { t: 0, position: start.lookAt },
        { t: 1, position: end.lookAt },
      ],
      segmentT,
    ),
    fov: start.fov + (end.fov - start.fov) * segmentT,
  }
}
