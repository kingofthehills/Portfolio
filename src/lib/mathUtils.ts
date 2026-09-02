export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value))
}

export function remap(
  value: number,
  inMin: number,
  inMax: number,
  outMin = 0,
  outMax = 1,
): number {
  const t = clamp((value - inMin) / (inMax - inMin))
  return outMin + t * (outMax - outMin)
}

export function easeInOutCubic(t: number): number {
  const x = clamp(t)
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export function easeOutCubic(t: number): number {
  const x = clamp(t)
  return 1 - Math.pow(1 - x, 3)
}

export function easeInOutQuad(t: number): number {
  const x = clamp(t)
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}
