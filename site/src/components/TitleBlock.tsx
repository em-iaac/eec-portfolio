// THE HEADER (DL-0, Emilie 2026-07-10, visualised + confirmed): one floating
// glass pill above every interior page: the EEC mark (routes home, running
// the carbon-flood ceremony), the four doors, a hairline divider, and the
// round 44px ModeToggle. It replaces the drawing-set title block: the logo
// cell + name cell + rules + the hdr-rule/hdr-pen draw-in ceremony retire
// with the Pen Table chrome. The name and role moved out of the chrome (the
// landing carries identity); EXPLORE THE NETWORK is the mark's job now.
// WORK keeps the interaction-colour underline: it is the emphasised proof
// path from every interior page (R2). Every target in the pill is >= 44px.
import type { MouseEvent } from 'react'
import { Link, NavLink } from 'react-router-dom'
import LogoMark from './LogoMark'
import ModeToggle from './ui/ModeToggle'

// De-numbered Session 6: titles only, no 01/02/03 indices.
const NAV: { label: string; to: string; primary?: boolean }[] = [
  { label: 'WORK', to: '/work', primary: true },
  { label: 'NOTEBOOK', to: '/notebook' },
  { label: 'ABOUT', to: '/about' },
  { label: 'CV', to: '/cv' },
]

export default function TitleBlock({
  onExplore,
}: {
  onExplore?: (e?: MouseEvent<HTMLAnchorElement>) => void
}) {
  return (
    // Sticky with a breath of air; the header strip itself lets clicks
    // through, only the pill is interactive.
    <header className="pointer-events-none sticky top-3 z-40 flex justify-center px-3 py-2">
      <div className="lang-glass-2 pointer-events-auto flex max-w-full items-center gap-0.5 rounded-[var(--r-pill)] py-1.5 pr-1.5 pl-2">
        <Link
          to="/"
          viewTransition
          // The carbon-flood ceremony preventDefaults to hold the navigation,
          // so run it only for a plain left click; modified clicks (new tab)
          // keep native behaviour.
          onClick={e => {
            if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey)
              onExplore?.(e)
          }}
          aria-label="Home"
          className="flex size-11 shrink-0 items-center justify-center rounded-[var(--r-pill)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
        >
          <LogoMark size={26} tone="lang" />
        </Link>
        <nav
          aria-label="Primary"
          className="flex min-w-0 items-center font-mono text-[10px] tracking-[0.08em]"
        >
          {NAV.map(item =>
            item.primary ? (
              <NavLink
                key={item.to}
                to={item.to}
                viewTransition
                className="flex h-11 min-w-11 items-center justify-center px-2 font-semibold text-[var(--lang-ink)] underline decoration-[var(--lang-interaction)] decoration-2 underline-offset-4 hover:decoration-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)] sm:px-2.5"
              >
                {item.label}
              </NavLink>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                viewTransition
                className={({ isActive }) =>
                  `flex h-11 min-w-11 items-center justify-center px-2 no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)] sm:px-2.5 ${
                    isActive
                      ? 'text-[var(--lang-ink)] underline underline-offset-4'
                      : 'text-[var(--lang-ink-muted)] hover:text-[var(--lang-ink)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
        <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-[var(--lang-hairline)]" />
        <ModeToggle />
      </div>
    </header>
  )
}
