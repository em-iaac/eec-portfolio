import type { CSSProperties } from 'react'

// Drawing annotation: dot > leader line > arrowhead > mono note.
// Governance: one Kicker per page maximum.
// When `draw` is set (Session 5 bundle), the leader line inks in once, then the
// dot and arrowhead arrive, sequenced after the header rule via drawDelayMs.
// Reduced motion renders the final state (handled in index.css).
// `dark` (Session 13): the carbon-ground variant for the landing hero, where the
// Kicker rides over the network. Ink/redline flip to their dark-ground tokens.
export default function Kicker({
  lead,
  linkText,
  href,
  note,
  draw = false,
  drawDelayMs = 900,
  dark = false,
}: {
  lead: string
  linkText: string
  href: string
  note?: string
  draw?: boolean
  drawDelayMs?: number
  dark?: boolean
}) {
  const pen = dark ? 'var(--color-redline-wire)' : 'var(--color-redline)'
  return (
    <div
      className={`flex items-start gap-2.5 font-mono text-xs leading-relaxed ${
        dark ? 'text-anno-dark' : 'text-anno'
      }`}
    >
      <svg
        width="46"
        height="22"
        viewBox="0 0 46 22"
        aria-hidden="true"
        className={`mt-0.5 shrink-0 ${draw ? 'kicker-draw' : ''}`}
        style={draw ? ({ '--kicker-delay': `${drawDelayMs}ms` } as CSSProperties) : undefined}
      >
        <circle className="k-dot" cx="3" cy="3" r="2.5" fill={pen} />
        <path className="k-line" d="M 3 6 L 3 18 L 40 18" stroke={pen} strokeWidth="1.2" fill="none" />
        <path className="k-head" d="M 40 15 L 45 18 L 40 21 z" fill={pen} />
      </svg>
      <span>
        {lead}{' '}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`-m-1.5 p-1.5 font-medium underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 ${
            dark
              ? 'text-redline-wire focus-visible:outline-redline-wire'
              : 'text-redline focus-visible:outline-redline'
          }`}
        >
          {linkText}
        </a>
        {note ? <span className={dark ? 'text-anno-dark' : 'text-anno'}> {note}</span> : null}
      </span>
    </div>
  )
}
