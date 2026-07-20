// THE DOWNLOAD CHIP (the design audit round 2, Emilie 2026-07-19: "the
// download button is a pill on the CV but just red on /work; decide on one
// consistent way, maybe add an icon"). ONE download affordance sitewide: a
// hairline pill with a tray-arrow icon, ink at rest, the interaction hue on
// hover/focus (download is an action, and hover/focus is the interaction, so
// red enters only there). Used by /work (the book), /cv, and /about.
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

export default function DownloadChip({
  href,
  download,
  children,
  className = '',
}: {
  href: string
  download: string
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      download={download}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-[var(--r-pill)] border border-[var(--lang-hairline)] px-3 font-mono text-[10px] tracking-[0.1em] text-[var(--lang-ink)] no-underline hover:border-[var(--lang-interaction)] hover:text-[var(--lang-interaction)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)] ${className}`}
    >
      <TrayArrow />
      {children}
    </a>
  )
}
