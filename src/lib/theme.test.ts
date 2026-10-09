import { describe, expect, it } from 'vitest'
import { applyTheme, parseTheme } from './theme'

describe('thème', () => {
  it('accepte clair et sombre, retombe sur système sinon', () => {
    expect(parseTheme('light')).toBe('light')
    expect(parseTheme('dark')).toBe('dark')
    expect(parseTheme('system')).toBe('system')
    expect(parseTheme(undefined)).toBe('system')
    expect(parseTheme('violet')).toBe('system')
    expect(parseTheme(42)).toBe('system')
  })

  it('force le thème par data-theme et le retire pour « système »', () => {
    const attrs = new Map<string, string>()
    const root = {
      setAttribute: (k: string, v: string) => attrs.set(k, v),
      removeAttribute: (k: string) => attrs.delete(k),
    } as unknown as HTMLElement
    applyTheme('dark', root)
    expect(attrs.get('data-theme')).toBe('dark')
    applyTheme('light', root)
    expect(attrs.get('data-theme')).toBe('light')
    applyTheme('system', root)
    expect(attrs.has('data-theme')).toBe(false)
  })
})
