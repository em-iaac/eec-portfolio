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
export function HeaderNav({ collapsed = false }: { collapsed?: boolean }) {
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
  // Collapsed, the doors have no width, so a lens resting on one would be a
  // stray 0px sliver. The mark keeps its own.
  const lens = target != null && (!collapsed || target === 0) ? rects[target] : null

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      onPointerLeave={() => setHover(null)}
      className="nav-mag relative flex min-w-0 items-center font-mono text-label tracking-[0.08em]"
    >
      {lens && lens.width > 0 && (
        <span
          aria-hidden="true"
          className="nav-lens pointer-events-none absolute"
          // The magnifier is the one thing in the chrome that MOVES between
          // rooms: named, it SLIDES from the old door to the new one across
          // the navigation instead of cross-dissolving in place. This is her
          // own magnifier grammar (DL amendment 17) carried across the seam.
          style={{ left: lens.left, width: lens.width, viewTransitionName: 'chrome-lens' }}
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
      {/* THE COLLAPSE (the landing's scrolling header, 2026-07-27). The doors
          are never unmounted, they are SQUEEZED: max-width to zero with the
          overflow clipped, so the pill contracts around the mark as one smooth
          width change instead of items popping out of existence. The DOM stays
          stable, which matters because the magnifier measures these rects.
          `inert` (React 19) is what makes it honest: it removes them from the
          tab order AND the accessibility tree in one go, so there is never a
          focusable link inside something a screen reader is told to skip. */}
      {NAV.map((item, i) => (
        <NavLink
          key={item.to}
          to={item.to}
          viewTransition
          inert={collapsed}
          ref={el => {
            itemRefs.current[i + 1] = el
          }}
          onPointerEnter={() => setHover(i + 1)}
          className={`relative z-[1] flex h-11 items-center justify-center overflow-hidden no-underline transition-[max-width,opacity] duration-300 ease-[var(--ease-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)] motion-reduce:transition-none ${
            collapsed
              ? 'max-w-0 px-0 opacity-0'
              : 'max-w-[10rem] min-w-11 px-0.5 opacity-100 sm:px-1'
          }`}
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

export default function TitleBlock({
  tools,
  toolsKey = 'page',
  collapsed = false,
}: {
  tools?: React.ReactNode
  /** THE LANDING ONLY (2026-07-27). Scrolling DOWN squeezes the pill to the
   *  mark alone and the tools to their compact form; scrolling UP opens it
   *  again. Every interior page is a frozen frame that never scrolls, so it
   *  never passes this and its header is untouched. */
  collapsed?: boolean
  /** The IDENTITY of this tool set, not its route. Two surfaces share a key
   *  only when their tools are literally the same thing (/work and /work/:id
   *  render the same filter row). Everything else gets its own key, because a
   *  SHARED view-transition-name across differently-sized boxes makes the
   *  browser MORPH one into the other: /work's 794px filter row was being
   *  squashed into /thoughts' 149px WATCH IT GROW button, stretching the old
   *  snapshot to 19% of its width while it faded. That squash is what read as
   *  lag (Emilie, 2026-07-26). Distinct keys leave each set to fade in place
   *  at its own size, which is what the frame's stillness actually needs. */
  toolsKey?: string
}) {
  return (
    // The frozen frame (SheetPage) keeps this header put; the pill floats
    // with a breath of air, anchored LEFT on every page (Emilie 2026-07-19:
    // the pill never moves between rooms, so the crossfade is seamless). The
    // strip lets clicks through; only the pill and the ground tools interact.
    <header className="pointer-events-none relative z-40 flex shrink-0 flex-wrap items-center justify-start px-3 pt-3 pb-1.5">
      <div
        className={`nav-pill lang-glass-2 pointer-events-auto flex max-w-full items-center gap-0.5 rounded-[var(--r-pill)] py-1.5 transition-[padding] duration-300 ease-[var(--ease-soft)] motion-reduce:transition-none ${
          collapsed ? 'pr-1.5 pl-1.5' : 'pr-1.5 pl-2'
        }`}
      >
        <HeaderNav collapsed={collapsed} />
        <span
          aria-hidden="true"
          className={`h-6 w-px shrink-0 bg-[var(--lang-hairline)] transition-[margin,opacity] duration-300 ease-[var(--ease-soft)] motion-reduce:transition-none ${
            collapsed ? 'mx-0 opacity-0' : 'mx-1 opacity-100'
          }`}
        />
        {/* The mode toggle squeezes out with the doors: collapsed, the pill is
            the mark and nothing else, which is the whole point of collapsing. */}
        <div
          inert={collapsed}
          className={`flex items-center overflow-hidden transition-[max-width,opacity] duration-300 ease-[var(--ease-soft)] motion-reduce:transition-none ${
            collapsed ? 'max-w-0 opacity-0' : 'max-w-16 opacity-100'
          }`}
        >
          <ModeToggle />
        </div>
      </div>
      {tools && (
        <div
          className="pill-tools pointer-events-auto"
          style={{ viewTransitionName: `page-tools-${toolsKey}` }}
        >
          {tools}
        </div>
      )}
    </header>
  )
}
