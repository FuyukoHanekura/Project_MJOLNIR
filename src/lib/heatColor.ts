// Dégradé de chaleur du prototype : violet clair → rose → orange (versions claire et sombre).
const LIGHT: readonly (readonly [number, number, number])[] = [
  [217, 210, 250],
  [232, 69, 139],
  [255, 154, 31],
]
const DARK: readonly (readonly [number, number, number])[] = [
  [75, 63, 168],
  [217, 58, 133],
  [255, 154, 31],
]

/** Couleur CSS pour une intensité de 0 à 1 ; null pour 0 (case non colorée). */
export function heatColor(t: number, dark: boolean): string | null {
  if (!(t > 0)) return null
  const x = (0.1 + 0.9 * Math.min(1, t)) * 2
  const stops = dark ? DARK : LIGHT
  const i = Math.min(1, Math.floor(x))
  const f = x - i
  const [a, b] = [stops[i], stops[i + 1]]
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(',')})`
}
