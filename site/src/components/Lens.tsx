// Lens encoding: color NEVER appears without shape + label (governance rule 2).
// LensTick is aria-hidden and only ever rides next to a text label.
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

// (G3: the LensChipAnchor / LensChipRoute / Legend chips retired as dead
// code with the notebook door; they were unimported and hardlinked the old
// /notebook#<lens> hashes. LensTick + LENSES above are the living exports.)
