// The poster + fallback decision, kept THREE-FREE (Session 13). ExploreSurface
// pulls in three.js (via ExploreCanvas), so anything the landing needs before it
// decides to load the live scene lives here instead: the poster src/alt and the
// pre-emptive fallback signals. This lets Home paint the poster as the LCP and
// route poster-only devices (PRM / no-WebGL / save-data / low-power) to it
// WITHOUT ever downloading the scene chunk (save-data especially must not pay for
// three.js it will never run). ExploreSurface re-exports these so /explore is
// unchanged.

// public/assets/explore-poster.webp, regenerated every build from makeGraph()
// output by scripts/generate-poster.mjs (the standing poster contract).
export const POSTER_SRC = `${import.meta.env.BASE_URL}assets/explore-poster.webp`

// Alt text APPROVED Session 13 (opening batch, Emilie: keep). The poster is a
// designed FINAL STATE, never an error state, so the alt describes the picture;
// the full navigable list (NetworkSrNav) travels alongside it in poster-only mode.
export const POSTER_ALT =
  'A dark constellation of Emilie El Chidiac’s projects and thoughts, connected by shared themes.'

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export type FallbackReason = 'no-webgl' | 'reduced-motion' | 'save-data' | 'low-power' | null

// Pre-emptive fallback signals (failed-context is handled at runtime in the
// scene). Conservative on low-power so capable phones still get the scene: only
// genuine signals (save-data, tiny RAM, <=2 cores) route to the poster.
export function fallbackReason(prm: boolean): FallbackReason {
  if (prm) return 'reduced-motion'
  if (!webglAvailable()) return 'no-webgl'
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean }
    deviceMemory?: number
  }
  if (nav.connection?.saveData) return 'save-data'
  if ((nav.deviceMemory && nav.deviceMemory <= 1) || navigator.hardwareConcurrency <= 2)
    return 'low-power'
  return null
}
