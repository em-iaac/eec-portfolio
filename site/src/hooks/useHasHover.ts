// CAN THIS DEVICE HOVER? (Emilie's ruling 2026-08-02: "don't load them on
// phones", the /work covers.)
//
// The tile's real cover is a HOVER reveal: it fades in over the ink plate when
// a pointer rests on the tile. A device with no hovering pointer can therefore
// never see it, and every one of those images was still being downloaded and
// laid out. Measured on /work at 390: 21 covers, ~250KB as the page scrolls,
// zero of them ever visible.
//
// THE TEST IS HOVER, NOT WIDTH, and that distinction is the whole reason this
// is its own hook rather than a reuse of useIsDesktop. A tablet with a mouse at
// 900px CAN hover and should keep its covers; a 1200px touch screen cannot and
// should not pay for them. `pointer: fine` joins it because a stylus reports
// hover without being able to rest anywhere.
//
// Read synchronously on first render, like useIsDesktop, so a mouse user never
// gets a frame of the plate-only tile. The server snapshot says true because
// scripts/prerender.mjs drives a desktop-class headless browser, and because
// the cover's alt text belongs in the markup a crawler reads.
import { useSyncExternalStore } from 'react'

const QUERY = '(hover: hover) and (pointer: fine)'

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

export default function useHasHover(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  )
}
