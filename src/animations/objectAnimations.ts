import type { SceneProgress } from '@/animations/scrollTimeline'
import { clamp, remap } from '@/lib/mathUtils'

const MAX_APERTURE_ANGLE = Math.PI / 2.1

/** How far each outer shell panel has rotated open, in radians. */
export function getApertureAngle(scene: SceneProgress): number {
  return scene.aperture * MAX_APERTURE_ANGLE
}

/** Emissive intensity of the inner core as it ignites. */
export function getCoreEmissiveIntensity(scene: SceneProgress): number {
  const idleGlow = 0.15
  return idleGlow + scene.coreIgnite * 3.4
}

/** Core scale — a small "breathing" pulse once ignited. */
export function getCoreScale(scene: SceneProgress): number {
  return 0.82 + scene.coreIgnite * 0.22
}

/** 0-1 visible length of the energy stream growing out of the core. */
export function getStreamLength(scene: SceneProgress): number {
  return scene.streamEmit
}

/** 0-1 position of the stream's leading edge along its path to the receiver. */
export function getStreamHead(scene: SceneProgress): number {
  return scene.streamTravel
}

/** 0-1 fill level inside the receiver crystal. */
export function getReceiverFill(scene: SceneProgress): number {
  return scene.receiverFill
}

/** Spark/impact burst scale at the moment the stream reaches the receiver. */
export function getSplashScale(scene: SceneProgress): number {
  return scene.splash
}

/**
 * A single 0-1 "energy mix" describing how far the lighting story has moved
 * from the dormant blue intro toward the ignited mint/teal peak and back to
 * a neutral, brighter state for the portfolio reveal.
 */
export function getEnergyMix(scene: SceneProgress): number {
  const rampUp = remap(scene.raw, 0.3, 0.55)
  const rampDown = 1 - remap(scene.raw, 0.85, 1)
  return clamp(Math.min(rampUp, rampDown))
}

/** Overall ambient brightness of the environment across the sequence. */
export function getEnvironmentIntensity(scene: SceneProgress): number {
  const base = 0.25 + scene.environment * 0.35
  return base + scene.reveal * 0.6
}

/** Particle field drift/rotation speed multiplier — livelier once ignited. */
export function getParticleEnergy(scene: SceneProgress): number {
  return 0.3 + scene.coreIgnite * 0.7 + scene.splash * 1.5
}
