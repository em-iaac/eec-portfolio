// THE HEADER THAT READS THE SCROLL (Emilie, 2026-07-27, for the landing;
// extended to every page at her ruling 2026-08-04, the phone pass part three:
// "the landing's header hides on scroll down and returns on scroll up, I want
// that behaviour on every page").
//
// Down collapses the pill to the mark alone, up opens it again. She was shown
// what the landing actually does before choosing — measured, the pill goes
// 366px → 63px wide while its height and the 76px band stay put, so it shrinks
// rather than leaves — and she was shown the alternative of sliding the whole
// band away for 76px back. She chose this one, so the site keeps ONE header
// grammar rather than gaining a second.
//
// Three things keep it honest, all three carried over from the landing:
//   · REDUCED MOTION NEVER COLLAPSES. The pill simply stays open. A header that
//     resizes itself as you read is motion, and the floor is that reduced
//     motion rests calm and complete.
//   · It is always open near the top, so the first screen is never met by a
//     stub.
//   · It is always open on focus — the caller wires `onFocusCapture` to
//     `open()` — because "scroll up" is not a gesture a keyboard has.
// A 6px dead band stops a trackpad's jitter from flickering it open and shut.
//
// IT READS WHICHEVER ELEMENT ACTUALLY SCROLLS (Emilie's ruling 2026-08-06, the
// last pass: "the header with the pill and the jump bar should behave the same
// on scroll down and up like the landing page on all pages").
//
// This used to be phone-only on interior pages, and the reason was real rather
// than stylistic: from lg up the frame is `h-dvh` + `overflow-hidden` with
// `#main` doing the scrolling, so `window.scrollY` never moves and a window
// listener would never fire. The fix is therefore not "turn it on everywhere",
// which would have shipped a dead listener — it is to READ THE RIGHT SCROLLER.
// The caller names it: the landing is a scrolling document at every width and
// says `window`; SheetPage says `main` from lg up and `window` below it, which
// is exactly where its frame freezes and unfreezes.
//
// /thoughts is deliberately not wired. Its stage pans SIDEWAYS and the page has
// no vertical scroll at all, so there is no gesture for a collapse to answer.
//
// Nothing is lost when it collapses: a page's own tools live OUTSIDE the pill
// (TitleBlock's `tools` slot, .pill-tools), so /work's filter row and a thought
// note's controls stay put while the doors squeeze away. The site search DOES
// collapse with it, to the "/" stub, because it rides inside that slot's right
// edge and shrinking to its own keyboard shortcut is its designed compact form.
import { useEffect, useState } from 'react'
import usePrefersReducedMotion from './usePrefersReducedMotion'

export default function useHeaderCollapse(
  enabled = true,
  /** Which element's scroll position drives it. 'main' is the frozen frame's
   *  middle band (`#main`), which is the only thing that moves from lg up. */
  scroller: 'window' | 'main' = 'window',
): [boolean, () => void] {
  const prm = usePrefersReducedMotion()
  const [collapsed, setCollapsed] = useState(false)
  useEffect(() => {
    if (prm || !enabled) {
      setCollapsed(false)
      return
    }
    // Resolved inside the effect, not during render: on the first pass #main is
    // a sibling being rendered by the very component that calls this hook, so it
    // does not exist yet. By the time effects run it does.
    const el: HTMLElement | Window =
      scroller === 'main' ? (document.getElementById('main') ?? window) : window
    const readY = () => (el === window ? window.scrollY : (el as HTMLElement).scrollTop)

    // Switching scrollers mid-life (a resize across lg) must not leave the pill
    // stuck collapsed against a scroller that is now at 0.
    setCollapsed(false)
    let last = readY()
    const onScroll = () => {
      const y = readY()
      if (y < 140) setCollapsed(false)
      else if (y > last + 6) setCollapsed(true)
      else if (y < last - 6) setCollapsed(false)
      last = y
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [prm, enabled, scroller])
  return [collapsed, () => setCollapsed(false)]
}
