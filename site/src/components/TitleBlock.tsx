// THE HEADER (DL-0, Emilie 2026-07-10; the design audit, 2026-07-19). One
// floating glass pill above every interior page: the EEC mark (routes home),
// the four doors, a hairline divider, the round 44px ModeToggle. The pill is
// PIXEL-IDENTICAL on every page; a page's own tools ride the ground on the
// header line's right (the `tools` slot, .pill-tools in language.css), never
// inside the pill, so the pill never grows or morphs between rooms.
//
// THE MAGNIFIER (Emilie's ruling round 2, 2026-07-19: "the highlight works
// like a magnifying glass, liquid glass; on hover it slides between the page
// names; click takes you there, a smooth transition between pages"). The
// active-door cue is a liquid-glass LENS (.nav-lens) that rests on the
// current room and SLIDES to whatever door the pointer is over, magnifying
// the label beneath it; it returns to the active room on pointer-leave.
// Clicking navigates on the universal soft crossfade. Motion never means
// alone: the active label stays bold ink, so a no-JS / reduced-motion /
// first-paint visitor still reads "you are here" without the lens.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import LogoMark from './LogoMark'
import ModeToggle from './ui/ModeToggle'

const NAV: { label: string; to: string }[] = [
  { label: 'WORK', to: '/work' },
  { label: 'THOUGHTS', to: '/thoughts' },
  { label: 'CV', to: '/cv' },
  { label: 'ABOUT', to: '/about' },
]

// Which door owns the current path (deep pages light their door: /work/sensi
// lights WORK). Non-door rooms (the pillar, 404) light nothing.
function activeDoor(pathname: string): number {
  return NAV.findIndex(n => pathname === n.to || pathname.startsWith(n.to + '/'))
}

// The magnifier tracks the HOME MARK (index 0) + the four doors (1..4), so
// hovering the logo magnifies it too (Emilie's bonus ask, 2026-07-19). The
// lens rests on the active room and slides to whatever the pointer is over.
export function HeaderNav() {
  const { pathname } = useLocation()
  const activeIdx = activeDoor(pathname)

  const navRef = useRef<HTMLElement | null>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [rects, setRects] = useState<{ left: number; width: number }[]>([])
  const [hover, setHover] = useState<number | null>(null)

  const measure = useCallback(() => {
    const nav = navRef.current
    if (!nav) return
    const n = nav.getBoundingClientRect()
    setRects(
      itemRefs.current.map(el => {
        if (!el) return { left: 0, width: 0 }
        const r = el.getBoundingClientRect()
        return { left: r.left - n.left, width: r.width }
      }),
    )
  }, [])

  useLayoutEffect(() => {
    measure()
  }, [measure, pathname])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const ro = new ResizeObserver(measure)
    ro.observe(nav)
    document.fonts?.ready.then(measure).catch(() => {})
    return () => ro.disconnect()
  }, [measure])

  // Door index -> tracked index (the mark is 0, so doors shift by 1). The
  // lens rests on the active room and follows the pointer to the mark or any
  // door.
  const activeTracked = activeIdx >= 0 ? activeIdx + 1 : null
  const target = hover ?? activeTracked
  const lens = target != null ? rects[target] : null

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      onPointerLeave={() => setHover(null)}
      className="nav-mag relative flex min-w-0 items-center font-mono text-[10px] tracking-[0.08em]"
    >
      {lens && lens.width > 0 && (
        <span
          aria-hidden="true"
          className="nav-lens pointer-events-none absolute"
          style={{ left: lens.left, width: lens.width }}
        />
      )}
      <Link
        to="/"
        viewTransition
        aria-label="Home"
        ref={el => {
          itemRefs.current[0] = el
        }}
        onPointerEnter={() => setHover(0)}
        className="relative z-[1] flex size-11 shrink-0 items-center justify-center no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
      >
        <span data-mag={target === 0 ? '' : undefined} className="nav-label flex items-center justify-center">
          <LogoMark size={26} />
        </span>
      </Link>
      {NAV.map((item, i) => (
        <NavLink
          key={item.to}
          to={item.to}
          viewTransition
          ref={el => {
            itemRefs.current[i + 1] = el
          }}
          onPointerEnter={() => setHover(i + 1)}
          className="relative z-[1] flex h-11 min-w-11 items-center justify-center px-0.5 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)] sm:px-1"
        >
          {({ isActive }) => (
            <span
              data-mag={target === i + 1 ? '' : undefined}
              className={
                isActive
                  ? 'nav-label px-3 py-1.5 font-semibold text-[var(--lang-ink)]'
                  : 'nav-label px-3 py-1.5 text-[var(--lang-ink-muted)]'
              }
            >
              {item.label}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default function TitleBlock({ tools }: { tools?: React.ReactNode }) {
  return (
    // The frozen frame (SheetPage) keeps this header put; the pill floats
    // with a breath of air, anchored LEFT on every page (Emilie 2026-07-19:
    // the pill never moves between rooms, so the crossfade is seamless). The
    // strip lets clicks through; only the pill and the ground tools interact.
    <header className="pointer-events-none relative z-40 flex shrink-0 flex-wrap items-center justify-start px-3 pt-3 pb-1.5">
      <div className="nav-pill lang-glass-2 pointer-events-auto flex max-w-full items-center gap-0.5 rounded-[var(--r-pill)] py-1.5 pr-1.5 pl-2">
        <HeaderNav />
        <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-[var(--lang-hairline)]" />
        <ModeToggle />
      </div>
      {tools && <div className="pill-tools pointer-events-auto">{tools}</div>}
    </header>
  )
}
