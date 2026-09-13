import * as THREE from 'three'

export const PALETTE = {
  dormant: '#2b2050',
  accentBlue: '#8a6cff',
  accentMint: '#fab044',
  ink: '#f6f5fa',
  void: '#060609',
}

const dormantColor = new THREE.Color(PALETTE.dormant)
const mintColor = new THREE.Color(PALETTE.accentMint)
const blueColor = new THREE.Color(PALETTE.accentBlue)
const mintBright = new THREE.Color('#ffd98a')

/** Lerps from the dormant story color, through blue, to ignited mint as `mix` goes 0→1. Used by the Home cinematic's Core/Receiver story. */
export function energyColor(mix: number): THREE.Color {
  const t = Math.min(1, Math.max(0, mix))
  const base = dormantColor.clone().lerp(blueColor, Math.min(1, t * 2))
  return base.lerp(mintColor, Math.max(0, t * 2 - 1))
}

/** Stays a clear mint/emerald green throughout — brightens with energy but
 * never shifts hue to navy/blue — for the persistent journey ball, which
 * should read as a consistent, recognizable "lux green" at rest. */
export function ballColor(energy: number): THREE.Color {
  const t = Math.min(1, Math.max(0, energy))
  return mintColor.clone().lerp(mintBright, t)
}
