import type { CSSProperties } from 'react'

// Drawing annotation: dot > leader line > arrowhead > mono note.
// Governance: one Kicker per page maximum.
// When `draw` is set (Session 5 bundle), the leader line inks in once, then the
// dot and arrowhead arrive, sequenced after the header rule via drawDelayMs.
// Reduced motion renders the final state (handled in index.css).
export default function Kicker({
  lead,
  linkText,
  href,
  note,
  draw = false,
  drawDelayMs = 900,
}: {
  lead: string
  linkText: string
  href: string
  note?: string
  draw?: boolean
  drawDelayMs?: number
}) {
  return (
    <div className="flex items-start gap-2.5 font-mono text-xs leading-relaxed text-anno">
      <svg
        width="46"
        height="22"
        viewBox="0 0 46 22"
        aria-hidden="true"
        className={`mt-0.5 shrink-0 ${draw ? 'kicker-draw' : ''}`}
        style={draw ? ({ '--kicker-delay': `${drawDelayMs}ms` } as CSSProperties) : undefined}
      >
        <circle className="k-dot" cx="3" cy="3" r="2.5" fill="var(--color-redline)" />
        <path
          className="k-line"
          d="M 3 6 L 3 18 L 40 18"
          stroke="var(--color-redline)"
          strokeWidth="1.2"
          fill="none"
        />
        <path className="k-head" d="M 40 15 L 45 18 L 40 21 z" fill="var(--color-redline)" />
      </svg>
      <span>
        {lead}{' '}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="-m-1.5 p-1.5 font-medium text-redline underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline"
        >
          {linkText}
        </a>
        {note ? <span className="text-anno"> {note}</span> : null}
      </span>
    </div>
  )
}
