import { describe, expect, it } from 'vitest'
import { TABS } from '../nav'
import en from '../i18n/en.json'
import fr from '../i18n/fr.json'
import { estimateOneRepMax } from '../lib/tracking'
import { GLOSSARY_IDS, isGlossaryId } from './glossary'

const LANGS = { en, fr } as const

describe('glossary', () => {
  it.each(Object.entries(LANGS))('has a name, a short text and a body for every term in %s', (_lang, json) => {
    const terms = json.help.terms as Record<string, { name: string; short: string; body: string }>
    for (const id of GLOSSARY_IDS) {
      expect(terms[id]?.name, id).toBeTruthy()
      expect(terms[id]?.short, id).toBeTruthy()
      expect(terms[id]?.body, id).toBeTruthy()
    }
    expect(Object.keys(terms).sort()).toEqual([...GLOSSARY_IDS].sort())
  })

  it('keeps tooltip texts short enough to read in a small panel', () => {
    for (const json of Object.values(LANGS)) {
      const terms = json.help.terms as Record<string, { short: string }>
      for (const id of GLOSSARY_IDS) expect(terms[id].short.length, id).toBeLessThanOrEqual(120)
    }
  })

  it('describes every whole RPE value from 6 to 10 in both languages', () => {
    for (const json of Object.values(LANGS)) {
      for (const v of [6, 7, 8, 9, 10]) expect((json.help.rpeScale as Record<string, string>)[v], String(v)).toBeTruthy()
    }
  })

  it('has the same placeholders in both languages', () => {
    const holes = (s: string) => (s.match(/{{\w+}}/g) ?? []).sort().join()
    expect(holes(en.help.e1rmExample)).toBe(holes(fr.help.e1rmExample))
    expect(holes(en.help.tip.label)).toBe(holes(fr.help.tip.label))
  })

  it('matches the formula used for the worked example', () => {
    expect(estimateOneRepMax(80, 8)).toBe(101.3)
  })

  it('recognises glossary ids', () => {
    expect(isGlossaryId('rpe')).toBe(true)
    expect(isGlossaryId('nope')).toBe(false)
    expect(isGlossaryId(undefined)).toBe(false)
  })
})

describe('tabs', () => {
  it('has six tabs with a label in both languages, help last', () => {
    expect(TABS).toHaveLength(6)
    expect(TABS[5].id).toBe('help')
    for (const tab of TABS) {
      const id = tab.id as keyof typeof en.nav
      expect(en.nav[id], tab.id).toBeTruthy()
      expect(fr.nav[id], tab.id).toBeTruthy()
    }
  })
})
