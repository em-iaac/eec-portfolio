// EXPLORE token mirror. three.js materials and canvas textures cannot read
// CSS custom properties, so the dark-ground tokens from src/index.css @theme
// are mirrored here as literals: this file is the ONLY sanctioned place for
// these hex values outside @theme. If a token changes there, change it here.
import type { Lens } from '../components/Lens'

export const CARBON = '#0B0E13' // --color-carbon
export const EDGE = '#E8EAED' // --color-ink-dark
export const ANNO_DARK = '#8A919C' // --color-anno-dark
export const REDLINE_WIRE = '#FF4D6D' // --color-redline-wire

export type LensKey = 'c' | 'p' | 'e'

export const LENSES: Record<LensKey, { wire: string; label: string; tick: 'square' | 'diamond' | 'triangle' }> = {
  c: { wire: '#22D3EE', label: 'COMPUTATION & RESEARCH', tick: 'square' }, // --color-cyan-wire
  p: { wire: '#F472B6', label: 'DESIGN & PRACTICE', tick: 'diamond' }, // --color-magenta-wire
  e: { wire: '#FACC15', label: 'EXPLORATIONS', tick: 'triangle' }, // --color-yellow-wire
}

export const LENS_TO_KEY: Record<Lens, LensKey> = {
  computation: 'c',
  practice: 'p',
  explorations: 'e',
}

// Dev-only drift guard: warn if the mirror and the CSS tokens diverge.
export function assertPaletteMatchesTheme() {
  if (!import.meta.env.DEV || typeof document === 'undefined') return
  const cs = getComputedStyle(document.documentElement)
  const pairs: [string, string][] = [
    ['--color-carbon', CARBON],
    ['--color-ink-dark', EDGE],
    ['--color-anno-dark', ANNO_DARK],
    ['--color-redline-wire', REDLINE_WIRE],
    ['--color-cyan-wire', LENSES.c.wire],
    ['--color-magenta-wire', LENSES.p.wire],
    ['--color-yellow-wire', LENSES.e.wire],
  ]
  for (const [name, mirror] of pairs) {
    const themed = cs.getPropertyValue(name).trim().toLowerCase()
    if (themed && themed !== mirror.toLowerCase()) {
      console.warn(`explore/palette.ts drift: ${name} is ${themed} in @theme but ${mirror} in the mirror`)
    }
  }
}
