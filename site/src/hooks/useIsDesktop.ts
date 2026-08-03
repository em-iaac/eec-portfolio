// THE lg BREAKPOINT, AS A HOOK (the phone pass, 2026-08-02).
//
// The landing carries two complete belt systems: the desktop's two drifting
// columns and the phone's two thumb-driven rows. Until now BOTH were always in
// the DOM and one was switched off with `display: none`, which is the right
// default for small differences and the wrong one here. Measured on the landing
// at 390x844: 1150 of the page's 1980 nodes, and 40 of its 60 `<img>` elements,
// belonged to the desktop columns a phone can never show. Fifty-eight per cent
// of the landing's DOM, parsed and laid out on the device with the least to
// spend, to be hidden.
//
// `display: none` does stop the images downloading, so this is DOM and layout
// cost rather than network cost. On a phone that is still the cost worth
// refusing, and it is the exact question this pass keeps asking: should this
// element behave the same, differently, or not appear at all.
//
// Read SYNCHRONOUSLY on first render (useSyncExternalStore's getSnapshot runs
// before paint), so a desktop visitor never sees a frame of the phone layout.
// The server snapshot returns true because scripts/prerender.mjs drives a
// 1280px viewport: the prerendered HTML should hold the desktop composition,
// which is also the one whose markup a crawler reads.
//
// It matches Tailwind's `lg` exactly. If that breakpoint ever moves, this moves
// with it, and the two must never disagree.
import { useSyncExternalStore } from 'react'

const QUERY = '(min-width: 1024px)'

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

export default function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  )
}
