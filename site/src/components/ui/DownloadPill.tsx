// THE DOWNLOAD CHIP (the design audit round 2, Emilie 2026-07-19: "the
// download button is a pill on the CV but just red on /work; decide on one
// consistent way, maybe add an icon"). ONE download affordance sitewide: a
// hairline pill, ink at rest, the interaction hue on hover/focus (download is
// an action, and hover/focus is the interaction, so red enters only there).
// Used by /work (the book), /cv, and /contact.
//
// The LEADING icon tells the two downloads apart (S6-A, Emilie 2026-07-24,
// Board 2): the book download leads with a book, the CV with a document, so a
// row that holds both no longer reads as one thing twice. Callers pass the
// type mark via `icon`; the tray-arrow stays the default for any plain
// download that is neither.
import { type ReactNode } from 'react'

function TrayArrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M8 2.5v7.5M5 7l3 3 3-3" />
      <path d="M3 12.5h10" />
    </svg>
  )
}

// ONE PILL FAMILY (S6-A, Emilie 2026-07-24, /work toolbar option A): the chip
// now mirrors FilterPill's geometry exactly — a COMPACT visible pill (~28px)
// inside a transparent >= 44px hit area — so a download sitting beside the lens
// filters reads as the same size, not a chunky 44px outlier. The hairline (not
// the filter's glass fill) + the type icon keep it legible as "an action, not
// a facet"; hover/focus brings the interaction hue.
export default function DownloadPill({
  href,
  download,
  children,
  icon,
  className = '',
}: {
  href: string
  download: string
  children: ReactNode
  /** The leading type mark (book / document). Defaults to the tray-arrow. */
  icon?: ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      download={download}
      className={`group inline-flex min-h-11 min-w-11 items-center justify-center no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)] ${className}`}
    >
      <span className="inline-flex items-center gap-1.5 rounded-[var(--r-pill)] border border-[var(--lang-hairline)] px-3.5 py-2 font-mono text-label leading-none tracking-[0.1em] text-[var(--lang-ink)] transition-colors group-hover:border-[var(--lang-interaction)] group-hover:text-[var(--lang-interaction)]">
        {icon ?? <TrayArrow />}
        {children}
      </span>
    </a>
  )
}
