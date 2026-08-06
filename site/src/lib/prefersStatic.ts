// STATIC-PREFERENCE SIGNAL (Session 8). Static when the visitor asked for
// less data, or the device sits in the clearly-weak Chromium tier
// (deviceMemory <= 2, Android Go class). Deliberately NOT read:
// hardwareConcurrency (Safari clamps it for fingerprinting resistance, and
// Apple's low core counts encode nothing about per-core speed) and the
// Battery API (Chromium-only, and degrading UX by battery level is hostile).
//
// It lived at hooks/useCinematicMode.ts until 2026-08-07, which was wrong on
// both halves of the name: there is no hook in here (nothing calls React, and
// a `use*` filename in a hooks folder tells every reader and every lint rule
// otherwise), and the cinematic mode it was named after retired with the sheet
// cinema at G1. A plain predicate belongs in lib/, under what it does.

type NavigatorSignals = Navigator & {
  connection?: { saveData?: boolean }
  deviceMemory?: number
}

// Save-data / reduced-data / clearly-weak-device signal, PRM aside. ONE
// definition of "this visitor wants less" for SheetVideo's autoplay-loop
// gate (a muted loop is still a download and still motion).
export function prefersStatic(): boolean {
  const nav = navigator as NavigatorSignals
  return (
    nav.connection?.saveData === true ||
    (typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-data: reduce)').matches) ||
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 2)
  )
}
