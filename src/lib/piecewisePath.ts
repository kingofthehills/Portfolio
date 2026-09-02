import { easeInOutCubic } from '@/lib/mathUtils'

export interface Waypoint {
  t: number
  position: [number, number, number]
}

/**
 * Bounded per-segment eased lerp between two waypoints — deliberately NOT a
 * spline across all points. An earlier Catmull-Rom implementation for the
 * hero camera path overshot badly between unevenly-spaced keyframes (the
 * camera flew closer to the object than any keyframe intended). A plain
 * lerp between the two bounding points guarantees the result never leaves
 * their range, at the cost of a very slight tangent kink at each waypoint —
 * imperceptible once combined with per-frame damping.
 */
export function interpolateWaypoints(waypoints: Waypoint[], progress: number): [number, number, number] {
  const t = Math.min(1, Math.max(0, progress))

  let index = 0
  for (let i = 0; i < waypoints.length - 1; i++) {
    index = i
    if (t <= waypoints[i + 1].t) break
  }

  const start = waypoints[index]
  const end = waypoints[Math.min(waypoints.length - 1, index + 1)]
  const span = end.t - start.t
  const segmentT = span > 0 ? (t - start.t) / span : 0
  const eased = easeInOutCubic(segmentT)

  return [
    start.position[0] + (end.position[0] - start.position[0]) * eased,
    start.position[1] + (end.position[1] - start.position[1]) * eased,
    start.position[2] + (end.position[2] - start.position[2]) * eased,
  ]
}

/** Piecewise-linear scalar map — see CinematicExperience's `piecewise` for
 * why this hand-rolled version is used instead of framer-motion's
 * array-input useTransform overload (which produced unclamped, non-
 * monotonic output on the installed version). */
export function piecewiseScalar(value: number, stops: number[], outputs: number[]): number {
  if (value <= stops[0]) return outputs[0]
  const last = stops.length - 1
  if (value >= stops[last]) return outputs[last]
  for (let i = 0; i < last; i++) {
    if (value >= stops[i] && value <= stops[i + 1]) {
      const t = (value - stops[i]) / (stops[i + 1] - stops[i])
      return outputs[i] + (outputs[i + 1] - outputs[i]) * t
    }
  }
  return outputs[last]
}
