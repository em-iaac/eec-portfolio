// Lens token mirror for the landing mind-graph (moved here from explore/ in R1
// when the three.js /explore surface retired). The mind-graph is SVG and CAN
// read CSS custom properties, but the fallback generator renders under Node
// (no CSS), so the dark-ground tokens from src/index.css @theme are mirrored
// here as literals: this file is the ONLY sanctioned place for these hex values
// outside @theme. If a token changes there, change it here.
import type { Lens } from '../components/Lens'

export const CARBON = '#0B0E13' // --color-carbon
export const EDGE = '#E8EAED' // --color-ink-dark
export const ANNO_DARK = '#8A919C' // --color-anno-dark
export const REDLINE_WIRE = '#FF4D6D' // --color-redline-wire

export type LensKey = 'c' | 'p' | 'e'

// The dark-ground wire per lens. No `label` here any more (#20 sweep): the
// lens NAMES live once, in components/Lens.tsx, and MindGraphSrNav reads them
// from there. This map stays literal + Node-safe because the prerender bundles
// it (mindGraph.ts imports LENS_TO_KEY below), and Node has no CSS.
export const LENSES: Record<LensKey, { wire: string; tick: 'square' | 'diamond' | 'triangle' }> = {
  c: { wire: '#22D3EE', tick: 'square' }, // --color-cyan-wire
  p: { wire: '#F472B6', tick: 'diamond' }, // --color-magenta-wire
  e: { wire: '#FACC15', tick: 'triangle' }, // --color-yellow-wire
}

export const LENS_TO_KEY: Record<Lens, LensKey> = {
  computation: 'c',
  practice: 'p',
  explorations: 'e',
}

// The inverse, so browser-side consumers of the graph model (which speaks in
// LensKey) can reach the one lens source in components/Lens.tsx.
export const KEY_TO_LENS: Record<LensKey, Lens> = {
  c: 'computation',
  p: 'practice',
  e: 'explorations',
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
      console.warn(`landing/palette.ts drift: ${name} is ${themed} in @theme but ${mirror} in the mirror`)
    }
  }
}
