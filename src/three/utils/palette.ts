import * as THREE from 'three'

export const PALETTE = {
  dormant: '#1c2a52',
  accentBlue: '#4d7fff',
  accentMint: '#35e7b7',
  ink: '#f5f5f7',
  void: '#050608',
}

const dormantColor = new THREE.Color(PALETTE.dormant)
const mintColor = new THREE.Color(PALETTE.accentMint)
const blueColor = new THREE.Color(PALETTE.accentBlue)
const mintBright = new THREE.Color('#baffe9')

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
