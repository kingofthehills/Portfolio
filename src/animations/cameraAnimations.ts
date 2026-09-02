import type { CameraKeyframe } from '@/lib/cameraPath'
import { interpolateCameraKeyframes } from '@/lib/cameraPath'

export type { CameraKeyframe, CameraTransform } from '@/lib/cameraPath'

/**
 * The camera's path through the cinematic sequence. Each keyframe is pinned
 * to a scroll-progress value (0-1). See interpolateCameraKeyframes for how
 * segments are interpolated (bounded per-segment eased lerp — a Catmull-Rom
 * spline was tried first but overshot badly between these unevenly-spaced
 * keyframes).
 */
export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  { t: 0, position: [0, 0.6, 7.2], lookAt: [0, 0, 0], fov: 38 }, // wide establishing shot
  { t: 0.1, position: [0.2, 0.4, 5], lookAt: [0, 0, 0], fov: 38 }, // camera approaches
  { t: 0.2, position: [2.1, 0.75, 3.3], lookAt: [0, 0, 0], fov: 36 }, // orbits around object
  { t: 0.3, position: [1.35, 0.3, 1.9], lookAt: [0.25, 0, 0.2], fov: 32 }, // close-up of mechanism
  { t: 0.4, position: [0.55, 0.1, 1.05], lookAt: [0, 0, 0.1], fov: 28 }, // extreme close-up, ignition
  { t: 0.5, position: [0.95, -0.05, 0.55], lookAt: [0.7, -0.15, 0], fov: 32 }, // tracks the stream departing
  { t: 0.65, position: [1.85, -0.3, -0.55], lookAt: [2.2, -0.5, -1.15], fov: 34 }, // travels toward the receiver
  { t: 0.8, position: [2.75, -0.05, 0.75], lookAt: [2.35, -0.5, -1.2], fov: 32 }, // arrives at the receiver
  { t: 0.9, position: [0.6, 1.0, 5.1], lookAt: [0.5, -0.1, -0.4], fov: 38 }, // pulls back
  { t: 1, position: [0, 1.15, 6.6], lookAt: [0, 0, -0.3], fov: 40 }, // final composition
]

export function getCameraTransform(progress: number) {
  return interpolateCameraKeyframes(CAMERA_KEYFRAMES, progress)
}
