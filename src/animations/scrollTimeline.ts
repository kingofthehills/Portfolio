import { easeInOutCubic, easeOutCubic, remap } from '@/lib/mathUtils'

/**
 * Every stage of the cinematic sequence is derived from a single 0-1 scroll
 * progress value. Nothing in the 3D scene or UI should compute its own
 * scroll math — it reads the relevant field from SceneProgress instead.
 */
export interface SceneProgress {
  /** Raw, unmodified scroll progress through the cinematic section. */
  raw: number
  /** Environment (fog/floor/particles) fade-in. */
  environment: number
  /** Normalized position along the camera's keyframe path. */
  cameraT: number
  /** Outer shell iris-opening amount. */
  aperture: number
  /** Inner core ignition / emissive intensity. */
  coreIgnite: number
  /** Energy stream length growing out of the core. */
  streamEmit: number
  /** How far the stream's leading edge has traveled toward the receiver. */
  streamTravel: number
  /** Spark/impact burst intensity — peaks briefly on arrival. */
  splash: number
  /** Receiver crystal's internal fill level. */
  receiverFill: number
  /** Final pull-back / dissolve into the portfolio UI. */
  reveal: number
  /** Which cinematic chapter this progress falls into. */
  chapter: 1 | 2
}

export const SCROLL_RANGES = {
  environment: [0, 0.15] as const,
  approach: [0.05, 0.22] as const,
  aperture: [0.2, 0.38] as const,
  ignite: [0.36, 0.48] as const,
  streamEmit: [0.46, 0.58] as const,
  streamTravel: [0.5, 0.78] as const,
  splash: [0.74, 0.83] as const,
  receiverFill: [0.76, 0.92] as const,
  reveal: [0.86, 1] as const,
}

export function mapScrollToScene(progress: number): SceneProgress {
  const raw = Math.min(1, Math.max(0, progress))

  const environment = easeOutCubic(remap(raw, ...SCROLL_RANGES.environment))
  const aperture = easeInOutCubic(remap(raw, ...SCROLL_RANGES.aperture))
  const coreIgnite = easeInOutCubic(remap(raw, ...SCROLL_RANGES.ignite))
  const streamEmit = easeOutCubic(remap(raw, ...SCROLL_RANGES.streamEmit))
  const streamTravel = easeInOutCubic(remap(raw, ...SCROLL_RANGES.streamTravel))
  const receiverFill = easeInOutCubic(remap(raw, ...SCROLL_RANGES.receiverFill))
  const reveal = easeInOutCubic(remap(raw, ...SCROLL_RANGES.reveal))

  const [splashStart, splashEnd] = SCROLL_RANGES.splash
  const splashMid = (splashStart + splashEnd) / 2
  const splash =
    raw < splashStart || raw > splashEnd
      ? 0
      : raw <= splashMid
        ? remap(raw, splashStart, splashMid)
        : 1 - remap(raw, splashMid, splashEnd)

  return {
    raw,
    environment,
    cameraT: raw,
    aperture,
    coreIgnite,
    streamEmit,
    streamTravel,
    splash,
    receiverFill,
    reveal,
    chapter: raw < 0.35 ? 1 : 2,
  }
}
