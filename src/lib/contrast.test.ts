/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { contrastRatio } from './contrast'
import { heatColor } from './heatColor'

// Lecture directe du fichier : un import `?raw` passerait par le plugin Tailwind et serait transformé.
const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8').replace(/\r\n/g, '\n')

/** Variables --nom: #rrggbb du premier bloc qui correspond au motif. */
function theme(pattern: RegExp): Record<string, string> {
  const body = css.match(pattern)?.[1]
  if (!body) throw new Error(`Bloc introuvable : ${pattern}`)
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]))
}

/** 'rgb(r,g,b)' → '#rrggbb', pour comparer les couleurs de la heatmap avec la palette. */
const rgbToHex = (rgb: string): string => {
  const [r, g, b] = (rgb.match(/\d+/g) ?? []).map(Number)
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}

const light = theme(/^:root \{([^}]*)\}/m)
const dark = theme(/^:root\[data-theme='dark'\] \{([^}]*)\}/m)
const systemDark = theme(/prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme='light'\]\) \{([^}]*)\}/)

describe('contraste (WCAG)', () => {
  describe('calcul', () => {
    it('noir sur blanc vaut 21, deux couleurs identiques valent 1', () => {
      expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1)
      expect(contrastRatio('#336699', '#336699')).toBe(1)
    })
    it('est symétrique', () => {
      expect(contrastRatio('#3b2ec9', '#f1f3f8')).toBe(contrastRatio('#f1f3f8', '#3b2ec9'))
    })
  })

  describe.each([
    ['clair', light],
    ['sombre', dark],
  ])('thème %s', (_name, t) => {
    it.each([
      ['ink', 'bg'],
      ['ink', 'surface'],
      ['ink2', 'bg'],
      ['ink2', 'surface'],
      ['muted', 'bg'],
      ['muted', 'surface'],
      ['accent', 'bg'],
      ['accent', 'surface'],
      ['accent-ink', 'accent'],
      ['brand-ink', 'brand'],
      ['danger', 'bg'],
      ['danger', 'surface'],
      ['accent-ink', 'danger'],
    ])('texte %s sur %s : au moins 4,5:1', (fg, bg) => {
      expect(contrastRatio(t[fg], t[bg])).toBeGreaterThanOrEqual(4.5)
    })

    it('les muscles principal et secondaire se distinguent du gris des muscles non travaillés', () => {
      expect(contrastRatio(t['m-primary'], t.m0)).toBeGreaterThanOrEqual(1.5)
      expect(contrastRatio(t['m-secondary'], t.m0)).toBeGreaterThanOrEqual(1.5)
    })

    it('le premier palier de la heatmap se distingue du gris des muscles non travaillés', () => {
      const dark = _name === 'sombre'
      const first = heatColor(0.05, dark)
      expect(first).not.toBeNull()
      expect(contrastRatio(rgbToHex(first as string), t.m0)).toBeGreaterThanOrEqual(1.5)
    })

    it('le gris des muscles non travaillés se distingue de la silhouette et du fond', () => {
      expect(contrastRatio(t.m0, t.body)).toBeGreaterThanOrEqual(1.1)
      expect(contrastRatio(t.m0, t.bg)).toBeGreaterThanOrEqual(1.3)
    })

    it('le violet des boutons se distingue du fond, et le filet or aussi (décoratif, 1,5:1 minimum)', () => {
      expect(contrastRatio(t.brand, t.bg)).toBeGreaterThanOrEqual(1.8)
      expect(contrastRatio(t.gold, t.bg)).toBeGreaterThanOrEqual(1.5)
    })

    it.each([['chart-1'], ['chart-2']])('la série %s des graphiques est lisible comme un trait (3:1) sur la carte et le fond', (token) => {
      expect(contrastRatio(t[token], t.surface)).toBeGreaterThanOrEqual(3)
      expect(contrastRatio(t[token], t.bg)).toBeGreaterThanOrEqual(3)
    })

    it('principal et secondaire se distinguent entre eux', () => {
      expect(contrastRatio(t['m-primary'], t['m-secondary'])).toBeGreaterThanOrEqual(1.4)
    })
  })

  it('le thème sombre automatique (système) est identique au thème sombre forcé', () => {
    expect(systemDark).toEqual(dark)
  })
})
