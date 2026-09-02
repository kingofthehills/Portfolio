import type { JourneySectionId } from '@/three/utils/journeyStore'

export interface SectionStage {
  id: JourneySectionId
  /** Where the ball settles while this section is active. */
  ballPosition: [number, number, number]
  /** Camera position + lookAt + fov while this section is active. */
  camera: {
    position: [number, number, number]
    lookAt: [number, number, number]
    fov: number
  }
}

/**
 * The abstract 3D "world" the ball travels through — one stage per section,
 * each with its own camera framing per the brief: About is a side-follow,
 * Projects an orbit/follow, Skills a top-down orbital view, Experience a
 * side tracking shot, Contact a front cinematic hero shot. Purely abstract
 * coordinates (this is a separate scene/canvas from the Home cinematic),
 * receding in -z as the journey progresses so it reads as "traveling
 * forward" through one continuous space.
 */
export const SECTION_STAGES: SectionStage[] = [
  {
    id: 'about',
    ballPosition: [0, 0, 0],
    camera: { position: [3.6, 0.8, 2.2], lookAt: [0, 0, 0], fov: 32 },
  },
  {
    id: 'projects',
    ballPosition: [0, 0.2, -3],
    camera: { position: [2, 2.2, -0.5], lookAt: [0, 0.2, -3], fov: 34 },
  },
  {
    id: 'skills',
    ballPosition: [0, 0.4, -6],
    camera: { position: [0, 5.3, -6.4], lookAt: [0, 0.4, -6], fov: 36 },
  },
  {
    id: 'experience',
    ballPosition: [0, 0, -9],
    camera: { position: [3.6, 0.65, -9], lookAt: [0, 0, -9], fov: 30 },
  },
  {
    id: 'contact',
    ballPosition: [0, 0, -12],
    camera: { position: [0, 0.4, -8.6], lookAt: [0, 0, -12], fov: 32 },
  },
]

/** Sub-stops within Projects so the ball visits each project in turn. */
export function getProjectSubOffset(index: number, count: number): [number, number, number] {
  if (count <= 1) return [0, 0, 0]
  const span = 2.2
  const x = -span / 2 + (span / (count - 1)) * index
  return [x, 0, index % 2 === 0 ? 0 : 0.3]
}
