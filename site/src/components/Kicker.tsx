// Drawing annotation: dot > leader line > arrowhead > mono note.
// Governance: one Kicker per page maximum.
export default function Kicker({
  lead,
  linkText,
  href,
  note,
}: {
  lead: string
  linkText: string
  href: string
  note?: string
}) {
  return (
    <div className="flex items-start gap-2.5 font-mono text-xs leading-relaxed text-anno">
      <svg width="46" height="22" viewBox="0 0 46 22" aria-hidden="true" className="mt-0.5 shrink-0">
        <circle cx="3" cy="3" r="2.5" fill="var(--color-redline)" />
        <path d="M 3 6 L 3 18 L 40 18" stroke="var(--color-redline)" strokeWidth="1.2" fill="none" />
        <path d="M 40 15 L 45 18 L 40 21 z" fill="var(--color-redline)" />
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
