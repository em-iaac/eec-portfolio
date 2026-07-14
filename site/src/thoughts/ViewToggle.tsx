// THE GRAPH | WORDS SWITCH (S4a, Emilie 2026-07-13, visualised + confirmed:
// "up by the title" in BOTH views, so it reads as one switch, not a dead end).
// It replaces the old one-way "prefer the words? the reading room >" corridor
// link. Two segments, each a real Link (they navigate), so the current view is
// marked with aria-current="page", not aria-pressed (that is for buttons). The
// world lives at /thoughts, the words at /thoughts?view=words; App.tsx runs the
// soft crossfade on the same-path search-param swap.
//
// FLOORS: each segment is a >= 44px touch target and keyboard-focusable; the
// active fill meets AA (ink on ground); colour carries no meaning (labels do).
import { Link } from 'react-router-dom'

const SEG =
  'inline-flex h-11 min-w-11 items-center justify-center px-3.5 no-underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--lang-interaction)]'
const ACTIVE = 'rounded-[var(--r-pill)] bg-[var(--lang-ink)] font-semibold text-[var(--lang-ground)]'
const REST = 'text-[var(--lang-ink-muted)] transition-colors hover:text-[var(--lang-ink)]'

export default function ViewToggle({ current }: { current: 'graph' | 'words' }) {
  return (
    <div
      role="group"
      aria-label="Choose a view"
      className="inline-flex items-center rounded-[var(--r-pill)] border-[0.5px] border-[var(--lang-hairline)] p-0.5 font-mono text-[10px] tracking-[0.1em]"
    >
      <Link
        to="/thoughts"
        viewTransition
        aria-current={current === 'graph' ? 'page' : undefined}
        className={`${SEG} ${current === 'graph' ? ACTIVE : REST}`}
      >
        GRAPH
      </Link>
      <Link
        to="/thoughts?view=words"
        viewTransition
        aria-current={current === 'words' ? 'page' : undefined}
        className={`${SEG} ${current === 'words' ? ACTIVE : REST}`}
      >
        WORDS
      </Link>
    </div>
  )
}
