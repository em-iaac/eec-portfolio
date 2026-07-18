// THE FOOTER (DL-1, Emilie 2026-07-10, visualised + confirmed): the header
// pill's grounded sibling. One quiet glass card floating above the ground,
// mode-aware via the --lang-* tokens: the name lockup with its mono role
// micro-label on the left, the contact links as glass pills (44px touch
// floor via FilterPill) on the right. Low density; the carbon strip retires
// with the Pen Table chrome.
import { FilterPill } from './ui/Pill'

const LINKS = [
  { label: 'EMAIL', href: 'mailto:chidiacemilie@gmail.com' },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/EmilieElChidiac' },
  { label: 'GITHUB', href: 'https://github.com/hi-em' },
]

// `compact` pulls the footer close for one-screen pages (About's contact
// sheet, 2026-07-12): there the footer IS the sheet's signature line, so the
// long-page breathing margin would just push it past the fold.
// `wide` matches the card to a wide page's column (/work, round 5) so the
// footer stops reading as a narrow centered pill against a full-width grid.
export default function Footer({ compact = false, wide = false }: { compact?: boolean; wide?: boolean }) {
  return (
    <footer
      className={`${compact ? 'mt-4 pb-3' : 'mt-16 pb-4'} ${wide ? 'px-5 sm:px-8' : 'px-3 sm:px-5'}`}
    >
      <div
        className={`lang-glass-1 mx-auto flex flex-wrap items-center gap-x-8 gap-y-3 rounded-[var(--r-card)] px-5 py-4 sm:px-7 ${wide ? 'max-w-[1856px]' : 'max-w-5xl'}`}
      >
        <div className="flex min-w-[180px] flex-1 flex-col">
          <span className="text-[13px] font-semibold tracking-[0.02em] text-[var(--lang-ink)]">
            EMILIE EL CHIDIAC
          </span>
          <span className="mt-0.5 font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink-muted)]">
            DESIGN TECHNOLOGY ARCHITECT
          </span>
        </div>
        <nav aria-label="Contact" className="-mx-1.5 flex flex-wrap items-center">
          {LINKS.map(l => {
            const external = !l.href.startsWith('mailto')
            return (
              <FilterPill
                key={l.label}
                as="a"
                href={l.href}
                target={external ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="px-0.5"
              >
                {l.label}
                {external && <span className="sr-only"> (opens in new tab)</span>}
              </FilterPill>
            )
          })}
        </nav>
      </div>
    </footer>
  )
}
