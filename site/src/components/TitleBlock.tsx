// Minimal title block (Session 3 memo: furniture reduced): logo cell, name +
// role cell, keynote nav, and the EXPLORE wayfinding link.
// The public open-to status line retired in Session 5 (FLAG-01): the search is
// private, so the header carries no redline at all now. The bottom rule draws
// in once per session with the red pen dot riding its leading edge.
// The landing IS the network surface (R1): the wayfinding cell is a plain link
// to the landing (`/`), running the same carbon-flood ceremony. The old
// "MODE: READ / EXPLORE" toggle framing retired in Session 13.
import { useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import LogoMark from './LogoMark'

// De-numbered Session 6: titles only, no 01/02/03 indices.
// WORK is the emphasised proof path (R2): the same red-pen underline the
// landing gives its WORK door, so the gallery reads as the primary route into
// the work from every interior page.
const NAV: { label: string; to: string; primary?: boolean }[] = [
  { label: 'WORK', to: '/work', primary: true },
  { label: 'NOTEBOOK', to: '/notebook' },
  { label: 'ABOUT', to: '/about' },
  { label: 'CV', to: '/cv' },
]

// Once per session (handoff: one-shot, on load); client-side navigations
// render the rule complete. Dev StrictMode remount may skip it: cosmetic only.
let headerDrawn = false

export default function TitleBlock({ onExplore }: { onExplore?: () => void }) {
  const animateRef = useRef<boolean | null>(null)
  if (animateRef.current === null) {
    animateRef.current = !headerDrawn
    headerDrawn = true
  }
  const animate = animateRef.current

  return (
    <header className="relative bg-mylar">
      <div className="flex flex-wrap items-stretch">
        <Link
          to="/"
          viewTransition
          aria-label="Home"
          className="flex min-w-16 items-center justify-center border-r border-ink/35 px-3.5 py-2.5 focus-visible:outline-2 focus-visible:outline-redline"
        >
          <LogoMark size={34} />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col justify-center border-r-0 px-3.5 py-2.5 sm:flex-none sm:border-r sm:border-ink/35">
          <span className="font-expanded text-xs font-semibold tracking-[0.1em] text-ink">
            EMILIE EL CHIDIAC
          </span>
          <span className="mt-0.5 font-mono text-[9px] leading-relaxed tracking-[0.06em] text-anno">
            DESIGN TECHNOLOGY ARCHITECT
            <br />
            MACAD @ IAAC
          </span>
        </div>
        <nav
          aria-label="Primary"
          className="order-last flex min-w-full flex-1 items-center gap-5 border-t border-ink/20 px-3.5 py-2.5 font-mono text-[10px] tracking-[0.1em] sm:order-none sm:min-w-0 sm:border-t-0"
        >
          {NAV.map(item =>
            item.primary ? (
              <NavLink
                key={item.to}
                to={item.to}
                viewTransition
                className="-m-3 p-3 font-semibold text-ink underline decoration-redline decoration-2 underline-offset-4 hover:decoration-[3px] focus-visible:outline-2 focus-visible:outline-redline"
              >
                {item.label}
              </NavLink>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                viewTransition
                className={({ isActive }) =>
                  `-m-3 p-3 text-ink no-underline hover:text-redline focus-visible:outline-2 focus-visible:outline-redline ${
                    isActive ? 'text-redline underline underline-offset-4' : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="flex w-full items-center px-3.5 pb-2.5 sm:w-auto sm:pb-0">
          <Link
            to="/"
            onClick={onExplore}
            className="-m-2.5 p-2.5 font-mono text-[10px] tracking-[0.12em] whitespace-nowrap text-redline underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline"
          >
            EXPLORE THE NETWORK &gt;
          </Link>
        </div>
      </div>
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 h-px bg-ink ${animate ? 'hdr-rule' : ''}`}
      />
      {animate && (
        <div
          aria-hidden="true"
          className="hdr-pen absolute bottom-[-3px] size-[7px] rounded-full bg-redline-stroke"
        />
      )}
    </header>
  )
}
