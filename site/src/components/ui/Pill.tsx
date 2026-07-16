// DESIGN LANGUAGE v2 primitive · Pill (see /DESIGN-LANGUAGE.md §5). The compact
// metadata unit: fully filleted (--r-pill), mode-aware via the --lang-* tokens.
// Lens colour NEVER carries meaning alone — the shape-chip (square / diamond /
// triangle) rides inside the lens pill, the a11y rule carried from Pen Table.
import type { CSSProperties, ElementType, ReactNode } from 'react'
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

// Filter: the interactive facet control (the gallery's lens facets and any
// future filter row). A REAL control, unlike the metadata pills above: the
// visual pill stays compact but the transparent hit area is >= 44px tall
// (touch floor), extended invisibly the way the old header extended its
// links. Active = solid ink; rest = raised glass. Renders as a button by
// default or as any element via `as` (a router Link, an anchor).
export function FilterPill({
  as,
  active = false,
  leading,
  className = '',
  children,
  ...rest
}: {
  as?: ElementType
  active?: boolean
  leading?: ReactNode
  className?: string
  children: ReactNode
  [prop: string]: unknown
}) {
  const Tag = as ?? 'button'
  const skin = active
    ? 'bg-[var(--lang-ink)] text-[var(--lang-ground)] border-[0.5px] border-transparent'
    : 'lang-glass-1 text-[var(--lang-ink-muted)] hover:border-[var(--lang-ink-muted)] hover:text-[var(--lang-ink)]'
  return (
    <Tag
      {...(Tag === 'button' ? { type: 'button' } : {})}
      aria-pressed={Tag === 'button' ? active : undefined}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)] ${className}`}
      {...rest}
    >
      <span className={`${BASE} px-3.5 py-2 font-mono text-[10px] tracking-[0.06em] transition-colors ${skin}`}>
        {leading}
        {children}
      </span>
    </Tag>
  )
}

// Status: a live dot (interaction/liveness colour) or the ink award recognition.
// `solid` swaps the translucent fill for the pre-composited tier fill: a pill
// riding ON A PHOTOGRAPH cannot rely on the ground behind it, so translucency
// would gamble the ink's AA contrast on whatever the image happens to be
// (legibility wins over glass, DESIGN-LANGUAGE §0).
export function StatusPill({
  kind,
  solid = false,
  children,
}: {
  kind: 'live' | 'award'
  solid?: boolean
  children: ReactNode
}) {
  return (
    <span
      className={`${BASE} lang-glass-1 px-2.5 py-1 font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink)]`}
      style={solid ? { background: 'var(--lang-glass-2-solid)' } : undefined}
    >
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

// The filter row's leading mark: the lens shape alone (the pill it rides in
// supplies the label, so shape + label still travel together, a11y rule).
// At rest it wears the lens accent; inside an ACTIVE pill (solid ink fill) it
// inherits currentColor so the chip never fights the fill for contrast.
export function LensMark({ lens, active = false }: { lens: Lens; active?: boolean }) {
  const l = LENS_UI[lens]
  return (
    <span
      aria-hidden="true"
      className="inline-flex"
      style={active ? undefined : ({ color: l.accent } as CSSProperties)}
    >
      <Chip shape={l.shape} />
    </span>
  )
}

export function LensPill({ lens }: { lens: Lens }) {
  const l = LENS_UI[lens]
  return (
    // min-w-0 + a truncating label: inside a tight flex row (the dense index
    // face at phone widths) the PILL gives way with an ellipsis so the row's
    // right-aligned "P-nnn · ✦" meta always renders whole (S2 index fix; the
    // chip + colour survive any truncation, and the full label stays in the
    // accessibility tree).
    <span
      className={`${BASE} lang-glass-1 min-w-0 px-3 py-1.5 font-mono text-[9px] tracking-[0.06em]`}
      style={{ color: l.accent } as CSSProperties}
    >
      <Chip shape={l.shape} />
      <span className="min-w-0 truncate">{l.label.toUpperCase()}</span>
    </span>
  )
}
