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
  { label: 'CONTACT', to: '/contact' },
]

// Which door owns the current path (deep pages light their door: /work/sensi
// lights WORK). Non-door rooms (the pillar, 404) light nothing.
function activeDoor(pathname: string): number {
  return NAV.findIndex(n => pathname === n.to || pathname.startsWith(n.to + '/'))
}

// WHERE THE LENS WAS, ACROSS A ROUTE CHANGE (2026-08-03, her report: "the
// magnifier is not sliding").
//
// It used to slide because `chrome-lens` was a named view-transition element and
// the browser morphed the old snapshot into the new one. Phones stopped using
// view transitions today (lib/pageMotion.ts, and see the ladder in
// language.css), and the header REMOUNTS on every navigation — measured, the
// pill and the lens are different elements before and after — so the new lens
// simply appeared at the new door with nothing to animate from.
//
// So the geometry outlives the component. On the first frame after a remount the
// lens renders at the position it had in the LAST room, then a frame later it is
// given its real position, and `.nav-lens`'s own CSS transition does the sliding.
// One module-level value, no timers, and it degrades to "just appear" on a cold
// load where there is no previous position to come from.
let lastLensRect: { left: number; width: number } | null = null

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

  // THE MAGNIFIER HESITATES BETWEEN ROOMS (her report 2026-08-03, and it still
  // happened with `?vt=off`, so it is this measurement and not the transition).
  //
  // The lens only renders while `lens.width > 0`. A measurement taken at the
  // wrong moment of a route change returns zeros — the nav itself is laid out
  // but an item ref is momentarily null, or the whole header has just been
  // swapped (the landing has its OWN header component, so travelling to or from
  // it remounts every ref). The lens then UNMOUNTS and remounts at the new door
  // instead of sliding to it, and an unmounted element cannot run its 300ms CSS
  // transition. That is the hesitation: it disappears, then reappears.
  //
  // So a degenerate reading is DISCARDED rather than stored. The lens keeps the
  // last good geometry, stays mounted, and slides. Nothing is lost: the real
  // measurement lands on the next pass (the layout effect, the ResizeObserver,
  // or fonts.ready), and until then the previous rects are the correct answer,
  // because the pill's own geometry does not change between rooms.
  const measure = useCallback(() => {
    const nav = navRef.current
    if (!nav) return
    const n = nav.getBoundingClientRect()
    if (n.width === 0) return
    const next = itemRefs.current.map(el => {
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { left: r.left - n.left, width: r.width }
    })
    // Every tracked item has to have real geometry, or this is a transient
    // frame and the reading is worthless.
    if (next.some(r => r === null || r.width === 0)) return
    setRects(next as { left: number; width: number }[])
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

  // THE SLIDE ACROSS A REMOUNT (see lastLensRect above). One frame at the old
  // room's position, then the real one, so the CSS transition has two values to
  // move between instead of appearing at the destination.
  const [arriving, setArriving] = useState(() => lastLensRect !== null)
  useLayoutEffect(() => {
    if (!arriving) return
    const id = requestAnimationFrame(() => setArriving(false))
    return () => cancelAnimationFrame(id)
  }, [arriving])
  useEffect(() => {
    if (lens && lens.width > 0) lastLensRect = lens
  })
  const shownLens = arriving && lastLensRect ? lastLensRect : lens

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      // MOUSE ONLY (her report 2026-08-03: "the magnifier hesitates", and it
      // still did with `?vt=off`, so it was never the transition).
      //
      // THE SEQUENCE ON A TAP, before this: `pointerenter` fires for TOUCH too,
      // so touching a door set `hover` and the lens began sliding toward it.
      // Then the finger lifted, `pointerleave` fired on this nav, `hover` went
      // back to null, and the target reverted to the door still marked active —
      // the one you were LEAVING — so the lens slid BACK. Only when the
      // navigation landed did it set off again.
      // Move, snap back, move. That is the hesitation, exactly.
      //
      // The rest of the site already knows this rule: WorkCard, the belt tiles
      // and useBeltDrift all gate their hover reveals on `pointerType ===
      // 'mouse'` for the same reason. The lens was the one that missed it.
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setHover(null)
      }}
      className="nav-mag relative flex min-w-0 items-center font-mono text-label tracking-[0.08em]"
    >
      {shownLens && shownLens.width > 0 && (
        <span
          aria-hidden="true"
          className="nav-lens pointer-events-none absolute"
          // The magnifier is the one thing in the chrome that MOVES between
          // rooms: named, it SLIDES from the old door to the new one across
          // the navigation instead of cross-dissolving in place. This is her
          // own magnifier grammar (DL amendment 17) carried across the seam.
          style={{ left: shownLens.left, width: shownLens.width, viewTransitionName: 'chrome-lens' }}
        />
      )}
      <Link
        to="/"
        viewTransition
        aria-label="Home"
        ref={el => {
          itemRefs.current[0] = el
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') setHover(0)
        }}
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
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse') setHover(i + 1)
          }}
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
            the mark and nothing else, which is the whole point of collapsing.
            THE CUT MOON (Emilie, 2026-08-02, phone pass). This wrapper clips
            (it has to, that is how the squeeze reads as a squeeze), and it was
            the ONLY flex item in the pill without shrink-0. At 390px the mark +
            four doors + divider + toggle ask for more than the pill's 366px, so
            flex took the difference out of the one item that would give: the
            wrapper collapsed 44 -> 40.7px and sliced 3.3px off the right of the
            circle. Invisible in light (the sun is an outline), obvious in dark
            (the moon is a filled shape). shrink-0 is the fix: the round control
            is a 44px touch target, not slack. The pill's real crowding at phone
            widths is a separate, larger question. */}
        <div
          inert={collapsed}
          className={`flex shrink-0 items-center overflow-hidden transition-[max-width,opacity] duration-300 ease-[var(--ease-soft)] motion-reduce:transition-none ${
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
