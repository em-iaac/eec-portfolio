// STATIC-PREFERENCE SIGNAL (Session 8; the useCinematicMode hook it fed
// retired with the sheet cinema at G1). Static when the visitor asked for
// less data, or the device sits in the clearly-weak Chromium tier
// (deviceMemory <= 2, Android Go class). Deliberately NOT read:
// hardwareConcurrency (Safari clamps it for fingerprinting resistance, and
// Apple's low core counts encode nothing about per-core speed) and the
// Battery API (Chromium-only, and degrading UX by battery level is hostile).

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
