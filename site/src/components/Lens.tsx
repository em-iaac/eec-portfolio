// Lens encoding: color NEVER appears without shape + label (governance rule 2).
// LensTick is aria-hidden and only ever rides next to a text label.
//
// THE ONE CONSUMER-SIDE SOURCE for lens identity (#20 sweep, 2026-07-26).
// Before this file, the same three hexes were hand-typed in seven places and
// the three label sets disagreed. Everything a consumer needs lives here:
//
//   label   the LONG name. Cards, the /work filter, the screen-reader nav.
//   short   the CHIP name. A 9px pill cannot carry "Computation & Research".
//           The two forms are DELIBERATE (Emilie, 2026-07-26), not drift: the
//           long form is what a screen reader hears, the short one is what a
//           chip can hold. Neither may be edited without the other.
//   shape   the a11y chip; colour never travels alone.
//   pen     var() form, light ground. CSS declarations + inline styles.
//   wire    var() form, dark ground.
//   accent  the LITERAL light-dark() pair, identical in value to --color-*-pen.
//           The only form that survives an SVG PRESENTATION ATTRIBUTE
//           (fill="...", stroke="..."), where var() is not reliable. If a
//           token changes in @theme, change the pair here too.
//
// Two copies remain outside this file, both sanctioned, both because they
// render where CSS custom properties do not exist: landing/palette.ts (bundled
// under Node for the prerender, and drift-guarded at runtime) and
// print/print.css (paper). Nowhere else may spell a lens hex.
export type Lens = 'computation' | 'practice' | 'explorations'
export type LensShape = 'square' | 'diamond' | 'triangle'

export const LENSES: Record<
  Lens,
  { label: string; short: string; shape: LensShape; pen: string; wire: string; accent: string }
> = {
  computation: {
    label: 'Computation & Research',
    short: 'research',
    shape: 'square',
    pen: 'var(--color-cyan-pen)',
    wire: 'var(--color-cyan-wire)',
    accent: 'light-dark(#0e7490, #22d3ee)',
  },
  practice: {
    label: 'Design & Practice',
    short: 'practice',
    shape: 'diamond',
    pen: 'var(--color-magenta-pen)',
    wire: 'var(--color-magenta-wire)',
    accent: 'light-dark(#a8186b, #f472b6)',
  },
  explorations: {
    label: 'Explorations',
    short: 'explorations',
    shape: 'triangle',
    pen: 'var(--color-yellow-pen)',
    wire: 'var(--color-yellow-wire)',
    accent: 'light-dark(#7a5e00, #facc15)',
  },
}

/** The three lens marks, ONE geometry, drawn by shape rather than by lens.
 *  This is the only place the shapes are described. The component that puts
 *  them on screen is LensMark (components/ui/Pill.tsx). There used to be four
 *  things here: LensGlyph, LensTick, Pill's internal Chip, and LensMark. The
 *  audit (2026-07-26) found LensTick and LensMark were the same component with
 *  different plumbing and one consumer each. */
export function LensGlyph({ shape, fill }: { shape: LensShape; fill?: string }) {
  return (
    <>
      {shape === 'square' && <rect x="0.5" y="0.5" width="9" height="9" fill={fill} />}
      {shape === 'diamond' && <path d="M5 0 L10 5 L5 10 L0 5 Z" fill={fill} />}
      {shape === 'triangle' && <path d="M5 0.5 L10 9.5 L0 9.5 Z" fill={fill} />}
    </>
  )
}

// (G3: the LensChipAnchor / LensChipRoute / Legend chips retired as dead code
// with the notebook door. LensTick retired at the 2026-07-26 audit, folded
// into LensMark. LensGlyph + LENSES above are the living exports.)
