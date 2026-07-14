// THE HEADER (DL-0, Emilie 2026-07-10, visualised + confirmed): one floating
// glass pill above every interior page: the EEC mark (routes home), the four
// doors, a hairline divider, and the round 44px ModeToggle. It replaces the
// drawing-set title block: the logo cell + name cell + rules + the
// hdr-rule/hdr-pen draw-in ceremony retire with the Pen Table chrome. The
// name and role moved out of the chrome (the landing carries identity).
// The carbon-flood ceremony retired at DL-1: the mark navigates home on the
// same soft crossfade as everything else (language.css).
// S4a (Emilie, 2026-07-13, visualised + confirmed): WORK is now a plain door
// like the others (its emphasised red underline retired), and the CURRENT page
// wears a quiet "you are here" cue instead: a soft filled pill (option B of
// three she saw). The pill is a subtle ink wash (mode-aware via --lang-ink), so
// it reads on both grounds. Every target stays >= 44px and keyboard-focusable:
// the link is the 44px hit area + focus ring, the inner span carries the pill.
import { Link, NavLink } from 'react-router-dom'
import LogoMark from './LogoMark'
import ModeToggle from './ui/ModeToggle'

// De-numbered Session 6: titles only, no 01/02/03 indices.
// G3 (2026-07-10, Emilie): four doors, NOTEBOOK retired. Since the meta
// build (2026-07-11) THOUGHTS holds the whole record (the neural world;
// /notebook redirects there); the label stays THOUGHTS (gate 7, Emilie).
const NAV: { label: string; to: string }[] = [
  { label: 'WORK', to: '/work' },
  { label: 'THOUGHTS', to: '/thoughts' },
  { label: 'CV', to: '/cv' },
  { label: 'ABOUT', to: '/about' },
]

export default function TitleBlock() {
  return (
    // Sticky with a breath of air; the header strip itself lets clicks
    // through, only the pill is interactive.
    <header className="pointer-events-none sticky top-3 z-40 flex justify-center px-3 py-2">
      <div className="lang-glass-2 pointer-events-auto flex max-w-full items-center gap-0.5 rounded-[var(--r-pill)] py-1.5 pr-1.5 pl-2">
        <Link
          to="/"
          viewTransition
          aria-label="Home"
          className="flex size-11 shrink-0 items-center justify-center rounded-[var(--r-pill)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
        >
          <LogoMark size={26} />
        </Link>
        <nav
          aria-label="Primary"
          className="flex min-w-0 items-center font-mono text-[10px] tracking-[0.08em]"
        >
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              viewTransition
              className="flex h-11 min-w-11 items-center justify-center px-0.5 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)] sm:px-1"
            >
              {({ isActive }) => (
                <span
                  className={
                    isActive
                      ? 'rounded-[var(--r-pill)] bg-[color-mix(in_srgb,var(--lang-ink)_12%,transparent)] px-3 py-1.5 font-semibold text-[var(--lang-ink)]'
                      : 'px-2 py-1.5 text-[var(--lang-ink-muted)] transition-colors hover:text-[var(--lang-ink)]'
                  }
                >
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-[var(--lang-hairline)]" />
        <ModeToggle />
      </div>
    </header>
  )
}
