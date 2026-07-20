// THE FOOTER LINE (DL-1; the design audit round 2, Emilie 2026-07-19: "the
// footer, while frozen and almost full bleed, should still be a PILL, not
// fully full bleed, to keep the same design language"). A frozen wide glass
// pill floating at the foot of the frame: near-full-width with a breath of
// margin, the same stadium the header pill wears, the name lockup + role on
// the left and the contact links on the right. One height on every page that
// carries it (/cv and /about drop it; their contact lives elsewhere).
import { FilterPill } from './ui/Pill'
import LensGroup from './ui/LensGroup'

const LINKS = [
  { label: 'EMAIL', href: 'mailto:chidiacemilie@gmail.com' },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/EmilieElChidiac' },
  { label: 'GITHUB', href: 'https://github.com/hi-em' },
]

export default function Footer() {
  return (
    <footer className="shrink-0 px-3 pt-1 pb-3">
      <div className="lang-glass-1 flex flex-wrap items-center justify-between gap-x-8 gap-y-1 rounded-[var(--r-pill)] px-5 py-2.5 sm:px-7">
        <div className="flex min-w-0 flex-col">
          <span className="text-[13px] font-semibold tracking-[0.02em] text-[var(--lang-ink)]">
            EMILIE EL CHIDIAC
          </span>
          <span className="mt-0.5 font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink-muted)]">
            DESIGN TECHNOLOGY ARCHITECT
          </span>
        </div>
        {/* The magnifier lens rides this cluster too (round 3, Emilie's
            pick): header and footer share one interaction grammar. */}
        <nav aria-label="Contact">
          <LensGroup className="-mx-1.5 flex flex-wrap items-center">
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
          </LensGroup>
        </nav>
      </div>
    </footer>
  )
}
