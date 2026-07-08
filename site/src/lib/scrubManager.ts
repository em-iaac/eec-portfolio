// THE SCRUB MANAGER (Session 8; motion unlock (a) + the Sheet cinema
// addendum in DESIGN-SYSTEM.md). One singleton drives every cinema plate on
// the page: ONE passive scroll listener (attached only while plates are
// registered, so plateless pages pay nothing), ONE rAF, ONE
// IntersectionObserver gating which plates are near the viewport (and
// toggling .plate-live for scoped will-change). The document's scroll is
// NEVER intercepted (addendum a11y floor): the manager only reads scroll
// position and writes CSS custom properties, so a dropped frame lags the
// scrub, never the scroll. Update loop is reads-then-writes against cached
// tops (no layout thrash); tops refresh on resize/orientationchange and
// section resize, never per frame.
import { useEffect, useRef, type RefObject } from 'react'

type ScrubEntry = {
  el: HTMLElement
  onFrame: (p: number) => void
  start: number
  span: number
  active: boolean
  lastP: number
}

const entries = new Set<ScrubEntry>()
let io: IntersectionObserver | null = null
let ro: ResizeObserver | null = null
let scheduled = false
let listening = false

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

// Two progress geometries. PINNED: p covers exactly the pin, 0 when the
// sticky stage pins, 1 when it releases. FLOW: p covers the viewport
// traversal, 0 when the top enters at the bottom edge, 1 when the bottom
// leaves at the top. The pick mirrors the ACTUAL CSS pin (the stage is
// `position: sticky` only for >=lg non-flow plates; flow plates have no
// `.plate-stage` at all), read from the stage's computed position so it
// tracks the breakpoint for free on the resize/RO remeasure path. Inferring
// from height alone breaks a landscape phone or a tall flow plate. Clamped,
// so iOS rubber-band overscroll cannot push p out of range.
function measure(e: ScrubEntry) {
  const r = e.el.getBoundingClientRect()
  const vh = window.innerHeight
  const top = r.top + window.scrollY
  const stage = e.el.querySelector('.plate-stage')
  const pinned = stage != null && getComputedStyle(stage).position === 'sticky'
  if (pinned && r.height > vh + 1) {
    e.start = top
    e.span = r.height - vh
  } else {
    e.start = top - vh
    e.span = vh + r.height
  }
}

function update() {
  scheduled = false
  const y = window.scrollY
  for (const e of entries) {
    if (!e.active) continue
    const p = clamp01((y - e.start) / e.span)
    if (Math.abs(p - e.lastP) < 0.001) continue
    e.lastP = p
    e.onFrame(p)
  }
}

function schedule() {
  if (!scheduled) {
    scheduled = true
    requestAnimationFrame(update)
  }
}

function remeasureAll() {
  for (const e of entries) measure(e)
  schedule()
}

function attach() {
  if (listening) return
  listening = true
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', remeasureAll)
  window.addEventListener('orientationchange', remeasureAll)
  // Webfonts swap in after first paint (font-display: swap) and reflow the
  // prose ABOVE a plate, moving its cached top without changing the plate's
  // own box (so the per-plate ResizeObserver never fires). Remeasure once
  // fonts settle. The documentElement RO below catches other above-plate
  // reflows (late images, async content).
  if (typeof document !== 'undefined' && 'fonts' in document) {
    document.fonts.ready.then(() => {
      if (listening) remeasureAll()
    })
  }
}

function detach() {
  if (!listening) return
  listening = false
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', remeasureAll)
  window.removeEventListener('orientationchange', remeasureAll)
}

export function registerPlate(
  el: HTMLElement,
  onFrame: (p: number) => void,
): () => void {
  // No observer support: final state immediately, nothing registers (the
  // CSS var fallbacks already read as final; this makes it explicit).
  if (
    typeof IntersectionObserver === 'undefined' ||
    typeof ResizeObserver === 'undefined'
  ) {
    onFrame(1)
    return () => {}
  }

  const entry: ScrubEntry = { el, onFrame, start: 0, span: 1, active: false, lastP: -1 }
  entries.add(entry)

  io ??= new IntersectionObserver(
    (observations) => {
      for (const o of observations) {
        for (const e of entries) {
          if (e.el === o.target) {
            e.active = o.isIntersecting
            e.el.classList.toggle('plate-live', o.isIntersecting)
          }
        }
      }
      schedule()
    },
    { rootMargin: '50% 0px' },
  )
  if (!ro) {
    ro = new ResizeObserver(remeasureAll)
    // Any content-height change above a plate (font swap, late image, async
    // content) shifts its cached top; documentElement height moves with it.
    ro.observe(document.documentElement)
  }

  io.observe(el)
  ro.observe(el)
  measure(entry)
  attach()

  // Initial paint regardless of IO timing: POP navigations restore scroll
  // mid-plate and hash landings start deep; never wait for the first
  // scroll event to show the right frame.
  entry.lastP = clamp01((window.scrollY - entry.start) / entry.span)
  onFrame(entry.lastP)

  return () => {
    entries.delete(entry)
    io?.unobserve(el)
    ro?.unobserve(el)
    // Fully tear down when the last plate leaves, so the documentElement RO
    // does not keep firing across non-sheet routes; a fresh register rebuilds.
    if (entries.size === 0) {
      detach()
      io?.disconnect()
      ro?.disconnect()
      io = null
      ro = null
    }
  }
}

// React binding. onFrame identity is intentionally unstable-safe: the latest
// callback is read through a ref, so plates can pass inline closures without
// re-registering every render.
export function useScrollScrub(
  ref: RefObject<HTMLElement | null>,
  onFrame: (p: number) => void,
  enabled = true,
) {
  const cb = useRef(onFrame)
  cb.current = onFrame
  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return
    return registerPlate(el, (p) => cb.current(p))
  }, [ref, enabled])
}
