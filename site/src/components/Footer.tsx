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

export default function Footer() {
  return (
    <footer className="mt-16 px-3 pb-4 sm:px-5">
      <div className="lang-glass-1 mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 gap-y-3 rounded-[var(--r-card)] px-5 py-4 sm:px-7">
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
