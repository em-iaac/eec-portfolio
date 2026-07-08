// CINEMATIC OR STATIC (Session 8; the addendum's fallback clause). Static
// when the visitor asked for less motion or less data, or the device sits
// in the clearly-weak Chromium tier (deviceMemory <= 2, Android Go class).
// Deliberately NOT read: hardwareConcurrency (Safari clamps it for
// fingerprinting resistance, and Apple's low core counts encode nothing
// about per-core speed) and the Battery API (Chromium-only, and degrading
// UX by battery level is hostile). Mid-range phones get cinematic; the perf
// bar (>= 30fps at 4x CPU throttle) is the guarantee mechanism, not runtime
// detection. The device answer latches once per visit so the mode never
// flips mid-scroll; a live PRM change still drops to static immediately
// (honoring the request beats the latch).
import usePrefersReducedMotion from './usePrefersReducedMotion'

type NavigatorSignals = Navigator & {
  connection?: { saveData?: boolean }
  deviceMemory?: number
}

let latched: boolean | null = null

// Save-data / reduced-data / clearly-weak-device signal, PRM aside. Exported
// so SheetVideo shares ONE definition of "this visitor wants less" for its
// autoplay-loop gate (a muted loop is still a download and still motion).
export function prefersStatic(): boolean {
  const nav = navigator as NavigatorSignals
  return (
    nav.connection?.saveData === true ||
    (typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-data: reduce)').matches) ||
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 2)
  )
}

export default function useCinematicMode(): boolean {
  const prm = usePrefersReducedMotion()
  latched ??= prefersStatic()
  return !prm && !latched
}
