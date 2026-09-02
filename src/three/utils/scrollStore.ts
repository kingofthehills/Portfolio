/**
 * A tiny mutable store bridging DOM scroll progress into the R3F render
 * loop. Three.js reads `cinematicProgress.value` inside `useFrame` every
 * frame instead of subscribing to React state — scroll fires far more often
 * than React should re-render, so nothing here triggers a re-render.
 */
export const cinematicProgress = { value: 0 }

export function setCinematicProgress(value: number): void {
  cinematicProgress.value = value
}
