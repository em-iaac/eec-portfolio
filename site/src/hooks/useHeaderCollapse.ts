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
// BELOW lg ONLY on interior pages, and that is not a style choice. From lg up
// the frame is `h-dvh` + `overflow-hidden` with `#main` doing the scrolling, so
// `window.scrollY` never moves there and this would simply never fire; worse,
// it would be reading the wrong scroller if the frame ever changed. The landing
// is a scrolling document at every width and passes `enabled` true always.
//
// Nothing is lost when it collapses: a page's own tools live OUTSIDE the pill
// (TitleBlock's `tools` slot, .pill-tools), so /work's and a thought note's
// controls stay put while the doors squeeze away.
import { useEffect, useState } from 'react'
import usePrefersReducedMotion from './usePrefersReducedMotion'

export default function useHeaderCollapse(enabled = true): [boolean, () => void] {
  const prm = usePrefersReducedMotion()
  const [collapsed, setCollapsed] = useState(false)
  useEffect(() => {
    if (prm || !enabled) {
      setCollapsed(false)
      return
    }
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y < 140) setCollapsed(false)
      else if (y > last + 6) setCollapsed(true)
      else if (y < last - 6) setCollapsed(false)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [prm, enabled])
  return [collapsed, () => setCollapsed(false)]
}
