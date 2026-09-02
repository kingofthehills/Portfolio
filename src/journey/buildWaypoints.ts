import type { CameraKeyframe } from '@/lib/cameraPath'
import type { Waypoint } from '@/lib/piecewisePath'
import { projects } from '@/data/projects'
import { SECTION_STAGES, getProjectSubOffset } from '@/journey/sectionStages'
import type { JourneySectionRange } from '@/three/utils/journeyStore'
import { journeyProgress } from '@/three/utils/journeyStore'

function getRange(ranges: JourneySectionRange[], id: string) {
  return ranges.find((r) => r.id === id) ?? { id, start: 0, end: 1 }
}

/**
 * Pure functions of `ranges` — called only when the measured section ranges
 * actually change (from useJourneyScroll's scroll/resize handler), NOT once
 * per render frame. Ball.tsx and JourneyCameraRig read the cached result
 * from journeyStore instead of rebuilding these arrays every frame, which
 * was allocating garbage fast enough to visibly stutter on lower-power
 * devices.
 */
export function buildBallWaypoints(ranges: JourneySectionRange[]): Waypoint[] {
  const waypoints: Waypoint[] = []

  for (const stage of SECTION_STAGES) {
    const range = getRange(ranges, stage.id)

    if (stage.id === 'projects' && projects.length > 0) {
      projects.forEach((_, index) => {
        const localT = projects.length <= 1 ? 0.5 : index / (projects.length - 1)
        const t = range.start + (range.end - range.start) * (0.15 + localT * 0.7)
        const offset = getProjectSubOffset(index, projects.length)
        waypoints.push({
          t,
          position: [
            stage.ballPosition[0] + offset[0],
            stage.ballPosition[1] + offset[1],
            stage.ballPosition[2] + offset[2],
          ],
        })
      })
      continue
    }

    const mid = range.start + (range.end - range.start) * 0.5
    waypoints.push({ t: mid, position: stage.ballPosition })
  }

  return waypoints
}

export function buildCameraKeyframes(ranges: JourneySectionRange[]): CameraKeyframe[] {
  return SECTION_STAGES.map((stage) => {
    const range = getRange(ranges, stage.id)
    const mid = range.start + (range.end - range.start) * 0.5
    return { t: mid, position: stage.camera.position, lookAt: stage.camera.lookAt, fov: stage.camera.fov }
  })
}

export function getCurrentSectionIndex(): number {
  const { overall, ranges } = journeyProgress
  for (let i = 0; i < ranges.length; i++) {
    if (overall >= ranges[i].start && overall <= ranges[i].end) return i
  }
  return overall <= 0 ? 0 : ranges.length - 1
}
