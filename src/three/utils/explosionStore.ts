/**
 * Tracks the one-time Contact finale (charge -> build-up -> blast -> party
 * popper -> confetti). `triggered` flips once and never resets during the
 * session, per the brief's "do not repeat the explosion" requirement.
 */
export const explosionState = {
  triggered: false,
  triggerTime: 0,
}

export const EXPLOSION_TRIGGER_PROGRESS = 0.985

export const PHASES = {
  chargeEnd: 0.7,
  buildEnd: 1.1,
  blastEnd: 1.35,
} as const

export type ExplosionPhase = 'idle' | 'charge' | 'buildup' | 'blast' | 'aftermath'

export function getExplosionPhase(elapsed: number): ExplosionPhase {
  if (!explosionState.triggered) return 'idle'
  if (elapsed < PHASES.chargeEnd) return 'charge'
  if (elapsed < PHASES.buildEnd) return 'buildup'
  if (elapsed < PHASES.blastEnd) return 'blast'
  return 'aftermath'
}
