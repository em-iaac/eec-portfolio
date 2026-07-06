// Minimal title block (Session 3 memo: furniture reduced): logo cell, name +
// status cell, keynote nav, and the mode toggle as a plain mono redline link.
// The sheet-number cell and ISSUED-FOR stamp are removed. The bottom rule
// draws in once per session with the red pen dot riding its leading edge.
import { useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import LogoMark from './LogoMark'
import { preloadExplore } from '../explore/preload'

const NAV = [
  { n: '01', label: 'NOTEBOOK', to: '/notebook' },
  { n: '02', label: 'ABOUT', to: '/about' },
  { n: '03', label: 'CV', to: '/cv' },
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
            MACAD @ IAAC · <span className="text-redline">OPEN TO R&D ROLES IN EUROPE</span>
          </span>
        </div>
        <nav
          aria-label="Primary"
          className="order-last flex min-w-full flex-1 items-center gap-5 border-t border-ink/20 px-3.5 py-2.5 font-mono text-[10px] tracking-[0.1em] sm:order-none sm:min-w-0 sm:border-t-0"
        >
          {NAV.map(item => (
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
              <span className="mr-1 text-anno">{item.n}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex w-full items-center px-3.5 pb-2.5 sm:w-auto sm:pb-0">
          <Link
            to="/explore"
            onClick={onExplore}
            onPointerEnter={() => preloadExplore()}
            onFocus={() => preloadExplore()}
            className="-m-2.5 p-2.5 font-mono text-[10px] tracking-[0.12em] whitespace-nowrap text-redline underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline"
          >
            MODE: <b className="font-medium">READ</b> / EXPLORE &gt;
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
