// Heat gradient: light purple → pink → orange (light and dark versions).
const LIGHT: readonly (readonly [number, number, number])[] = [
  [183, 168, 241],
  [232, 69, 139],
  [255, 154, 31],
]
const DARK: readonly (readonly [number, number, number])[] = [
  [98, 86, 205],
  [217, 58, 133],
  [255, 154, 31],
]

/** CSS colour for an intensity from 0 to 1; null for 0 (uncoloured cell). */
export function heatColor(t: number, dark: boolean): string | null {
  if (!(t > 0)) return null
  const x = (0.1 + 0.9 * Math.min(1, t)) * 2
  const stops = dark ? DARK : LIGHT
  const i = Math.min(1, Math.floor(x))
  const f = x - i
  const [a, b] = [stops[i], stops[i + 1]]
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(',')})`
}
