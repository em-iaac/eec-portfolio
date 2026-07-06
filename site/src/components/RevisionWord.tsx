// The hand-wobbled redline ellipse around one word: the model holding the
// red pen. HARD CAP: one per page (governance rule 6). Stroke is
// redline-stroke (>= 3px graphic, legacy hue allowed). PRM handled in CSS.
import type { CSSProperties, ReactNode } from 'react'

export default function RevisionWord({
  children,
  delayMs,
}: {
  children: ReactNode
  delayMs?: number
}) {
  const style =
    delayMs != null
      ? ({ '--revision-delay': `${delayMs}ms` } as CSSProperties)
      : undefined
  return (
    <span className="revision-word" style={style}>
      {children}
      <svg viewBox="0 0 120 60" aria-hidden="true">
        <path d="M 8 34 C 2 16, 30 4, 62 6 C 96 8, 118 18, 114 34 C 110 50, 78 58, 48 55 C 20 52, 6 46, 10 30" />
      </svg>
    </span>
  )
}
