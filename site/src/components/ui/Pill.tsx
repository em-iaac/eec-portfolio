// DESIGN LANGUAGE v2 primitive · Pill (see /DESIGN-LANGUAGE.md §5). The compact
// metadata unit: fully filleted (--r-pill), mode-aware via the --lang-* tokens.
// Lens colour NEVER carries meaning alone — the shape-chip (square / diamond /
// triangle) rides inside the lens pill, the a11y rule carried from Pen Table.
import type { CSSProperties, ElementType, ReactNode } from 'react'
import { LENSES, LensGlyph, type Lens } from '../Lens'

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
  const type = mono ? 'font-mono text-label tracking-[0.06em]' : 'text-nav'
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
  dense = false,
  className = '',
  children,
  ...rest
}: {
  as?: ElementType
  active?: boolean
  leading?: ReactNode
  /** THE PHONE'S FILTER ROW (Emilie, 2026-08-02). Five pills on one row at 390
   *  is 427px of pill against 350px of screen even with the short labels, so
   *  the row's own padding is the only place left to find it. 14px -> 8px each
   *  side, which is 12px back per pill. The 44px touch target is untouched: it
   *  lives on the outer element's min-h/min-w, not on this padding. */
  dense?: boolean
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
      {/* DENSE DROPS THE TRACKING (the phone pass, 2026-08-03). The row was
          still 395px against 390 after the short labels and the dense padding,
          so EXPLORATIONS was clipped by 5px and had to be scrolled to be read
          in full. 0.06em at 10px is 0.6px per character across 31 rendered
          characters = 18.6px, which is the whole overflow and more, and at this
          size the letterspacing is doing no optical work: it was inherited from
          the roomier default pill, not designed for a 10px chip. Measured
          after: 377px, so the row FITS at 390 with 13px to spare, and the fade
          mask is now telling the truth when it says there is nothing more.
          Scoped to `dense`, so the normal pill and /lab are untouched. */}
      <span
        className={`${BASE} ${dense ? 'px-2 tracking-normal' : 'px-3.5 tracking-[0.06em]'} py-2 font-mono text-label transition-colors ${skin}`}
      >
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
      className={`${BASE} lang-glass-1 px-2.5 py-1 font-mono text-micro tracking-[0.08em] text-[var(--lang-ink)]`}
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

// THE ONE LENS MARK (the design-system audit, 2026-07-26). Absorbed the old
// Lens.tsx `LensTick` and this file's internal `Chip`, which were the same
// component twice with one consumer each.
//
// The lens shape alone, never a label: whatever it rides in supplies the word,
// so shape + label still travel together (the a11y rule). currentColor lets the
// mode-aware light-dark() accent reach both the shape and its label without
// repeating it, and without light-dark() in an SVG attribute.
//
//   size    7 inside a pill (the filter row), 9 standing beside running text.
//   active  inside a solid-ink pill the mark inherits currentColor instead of
//           its accent, so it never fights the fill for contrast.
export function LensMark({
  lens,
  size = 7,
  active = false,
}: {
  lens: Lens
  size?: number
  active?: boolean
}) {
  const l = LENSES[lens]
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0"
      style={active ? undefined : ({ color: l.accent } as CSSProperties)}
    >
      <svg width={size} height={size} viewBox="0 0 10 10" style={{ fill: 'currentColor' }}>
        <LensGlyph shape={l.shape} />
      </svg>
    </span>
  )
}

export function LensPill({ lens }: { lens: Lens }) {
  const l = LENSES[lens]
  return (
    // min-w-0 + a truncating label: inside a tight flex row (the dense index
    // face at phone widths) the PILL gives way with an ellipsis so the row's
    // right-aligned "P-nnn · ✦" meta always renders whole (S2 index fix; the
    // chip + colour survive any truncation, and the full label stays in the
    // accessibility tree).
    <span
      className={`${BASE} lang-glass-1 min-w-0 px-3 py-1.5 font-mono text-micro tracking-[0.06em]`}
      style={{ color: l.accent } as CSSProperties}
    >
      <LensMark lens={lens} />
      {/* the SHORT lens name: the long one cannot survive a 9px truncating pill */}
      <span className="min-w-0 truncate">{l.short.toUpperCase()}</span>
    </span>
  )
}
