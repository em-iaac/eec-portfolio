// Lens encoding: color NEVER appears without shape + label (governance rule 2).
// LensTick is aria-hidden; LensChip is the only public way to show a lens.
import { Link } from 'react-router-dom'

export type Lens = 'computation' | 'practice' | 'explorations'

export const LENSES: Record<Lens, { label: string; pen: string; wire: string }> = {
  computation: { label: 'Computation & Research', pen: 'var(--color-cyan-pen)', wire: 'var(--color-cyan-wire)' },
  practice: { label: 'Design & Practice', pen: 'var(--color-magenta-pen)', wire: 'var(--color-magenta-wire)' },
  explorations: { label: 'Explorations', pen: 'var(--color-yellow-pen)', wire: 'var(--color-yellow-wire)' },
}

export function LensTick({
  lens,
  size = 9,
  variant = 'pen',
}: {
  lens: Lens
  size?: number
  /** 'pen' on light grounds (default), 'wire' on carbon (EXPLORE legend) */
  variant?: 'pen' | 'wire'
}) {
  const c = LENSES[lens][variant]
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true" className="inline-block shrink-0">
      {lens === 'computation' && <rect x="0.5" y="0.5" width="9" height="9" fill={c} />}
      {lens === 'practice' && <path d="M5 0 L10 5 L5 10 L0 5 Z" fill={c} />}
      {lens === 'explorations' && <path d="M5 0.5 L10 9.5 L0 9.5 Z" fill={c} />}
    </svg>
  )
}

const CHIP_CLS =
  'inline-flex items-center gap-2 border border-ink/30 px-3 py-2 font-mono text-[10px] tracking-[0.08em] text-ink no-underline hover:border-ink focus-visible:outline-2 focus-visible:outline-redline'

function ChipInner({ lens }: { lens: Lens }) {
  return (
    <>
      <LensTick lens={lens} />
      <span>{LENSES[lens].label.toUpperCase()}</span>
    </>
  )
}

/** Same-page anchor chip (Notebook filter: the hash IS the filter state) */
export function LensChipAnchor({ lens }: { lens: Lens }) {
  return (
    <a className={CHIP_CLS} href={`#${lens}`}>
      <ChipInner lens={lens} />
    </a>
  )
}

/** Cross-page router chip (into filtered Notebook views), client-side navigation */
export function LensChipRoute({ lens }: { lens: Lens }) {
  return (
    <Link className={CHIP_CLS} to={`/notebook#${lens}`} viewTransition>
      <ChipInner lens={lens} />
    </Link>
  )
}

export function Legend({ mode }: { mode: 'anchors' | 'route' }) {
  const Chip = mode === 'anchors' ? LensChipAnchor : LensChipRoute
  return (
    <div className="flex flex-wrap gap-2.5">
      {(Object.keys(LENSES) as Lens[]).map(l => (
        <Chip key={l} lens={l} />
      ))}
    </div>
  )
}
