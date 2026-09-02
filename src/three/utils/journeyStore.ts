import type { CameraKeyframe } from '@/lib/cameraPath'
import type { Waypoint } from '@/lib/piecewisePath'

export const JOURNEY_SECTION_IDS = ['about', 'projects', 'skills', 'experience', 'contact'] as const
export type JourneySectionId = (typeof JOURNEY_SECTION_IDS)[number]

export interface JourneySectionRange {
  id: JourneySectionId
  start: number
  end: number
}

/**
 * Mirrors src/three/utils/scrollStore.ts's pattern: a plain mutable object
 * the R3F render loop reads every frame, updated imperatively from a DOM
 * scroll listener so 3D updates never depend on a React re-render.
 *
 * `ballWaypoints`/`cameraKeyframes` are cached here too — they only change
 * when the measured section ranges change (a scroll/resize event), not
 * every frame, so the 3D layer reads them instead of rebuilding fresh
 * arrays 60 times a second.
 */
export const journeyProgress = {
  overall: 0,
  ranges: [] as JourneySectionRange[],
  ballWaypoints: [] as Waypoint[],
  cameraKeyframes: [] as CameraKeyframe[],
}

export function setJourneyProgress(
  overall: number,
  ranges: JourneySectionRange[],
  ballWaypoints: Waypoint[],
  cameraKeyframes: CameraKeyframe[],
): void {
  journeyProgress.overall = overall
  journeyProgress.ranges = ranges
  journeyProgress.ballWaypoints = ballWaypoints
  journeyProgress.cameraKeyframes = cameraKeyframes
}

export function updateJourneyOverall(overall: number): void {
  journeyProgress.overall = overall
}

export function getActiveJourneySection(): JourneySectionId | null {
  const { overall, ranges } = journeyProgress
  for (const range of ranges) {
    if (overall >= range.start && overall <= range.end) return range.id
  }
  return null
}
