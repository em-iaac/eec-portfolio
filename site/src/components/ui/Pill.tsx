// DESIGN LANGUAGE v2 primitive · Pill (see /DESIGN-LANGUAGE.md §5). The compact
// metadata unit: fully filleted (--r-pill), mode-aware via the --lang-* tokens.
// Lens colour NEVER carries meaning alone — the shape-chip (square / diamond /
// triangle) rides inside the lens pill, the a11y rule carried from Pen Table.
import type { CSSProperties, ReactNode } from 'react'
import type { Lens } from '../Lens'

const BASE = 'inline-flex items-center gap-1.5 rounded-[var(--r-pill)] leading-none'

// A neutral tag / filter pill. `active` fills solid ink (the selected facet);
// at rest it is raised glass.
export function Pill({
  active = false,
  leading,
  mono = false,
  className = '',
  children,
}: {
  active?: boolean
  leading?: ReactNode
  mono?: boolean
  className?: string
  children: ReactNode
}) {
  const skin = active
    ? 'bg-[var(--lang-ink)] text-[var(--lang-ground)] border-[0.5px] border-transparent'
    : 'lang-glass-1 text-[var(--lang-ink-muted)]'
  const type = mono ? 'font-mono text-[10px] tracking-[0.06em]' : 'text-[11px]'
  return <span className={`${BASE} px-3 py-1.5 ${type} ${skin} ${className}`}>{leading}{children}</span>
}

// Status: a live dot (interaction/liveness colour) or the ink award recognition.
export function StatusPill({ kind, children }: { kind: 'live' | 'award'; children: ReactNode }) {
  return (
    <span className={`${BASE} lang-glass-1 px-2.5 py-1 font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink)]`}>
      {kind === 'live' ? (
        <span className="inline-block size-1.5 rounded-full" style={{ background: 'var(--lang-interaction)' }} />
      ) : (
        <span aria-hidden="true">✦</span>
      )}
      {children}
    </span>
  )
}

const LENS_UI: Record<Lens, { label: string; accent: string; shape: 'square' | 'diamond' | 'triangle' }> = {
  computation: { label: 'research', accent: 'light-dark(#0e7490, #22d3ee)', shape: 'square' },
  practice: { label: 'practice', accent: 'light-dark(#a8186b, #f472b6)', shape: 'diamond' },
  explorations: { label: 'explorations', accent: 'light-dark(#7a5e00, #facc15)', shape: 'triangle' },
}

// currentColor lets the mode-aware light-dark() accent flow to both the shape
// and the label without repeating it (and without light-dark() in an SVG attr).
function Chip({ shape }: { shape: LensShape }) {
  return (
    <svg width="7" height="7" viewBox="0 0 10 10" aria-hidden="true" style={{ fill: 'currentColor' }}>
      {shape === 'square' && <rect x="0.5" y="0.5" width="9" height="9" />}
      {shape === 'diamond' && <path d="M5 0 L10 5 L5 10 L0 5 Z" />}
      {shape === 'triangle' && <path d="M5 0.5 L10 9.5 L0 9.5 Z" />}
    </svg>
  )
}
type LensShape = 'square' | 'diamond' | 'triangle'

export function LensPill({ lens }: { lens: Lens }) {
  const l = LENS_UI[lens]
  return (
    <span
      className={`${BASE} lang-glass-1 px-3 py-1.5 font-mono text-[9px] tracking-[0.06em]`}
      style={{ color: l.accent } as CSSProperties}
    >
      <Chip shape={l.shape} />
      {l.label.toUpperCase()}
    </span>
  )
}
