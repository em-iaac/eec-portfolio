// The network surface, made embeddable (Session 12). "Showcase = the network
// surface wherever it appears": this component is the reusable piece the
// full-page /explore route mounts today and the Session 13 landing hero will
// mount tomorrow. It owns three things and nothing page-specific:
//   1. The poster: the build-time still of the frozen constellation, painted as
//      the pre-WebGL FIRST PAINT (LCP) and as the universal FALLBACK.
//   2. The fallback matrix: no-WebGL / reduced-motion / save-data / low-power /
//      failed-context all resolve to the poster as a designed FINAL STATE, never
//      an error state. See DESIGN-SYSTEM.md "Fallback matrix".
//   3. The live scene (ExploreCanvas) + its screen-reader alternative, mounted
//      only on the WebGL path.
// Page chrome (HUD, mode link, legend, InfoCard, the mylar leave ceremony) stays
// with the consumer, so /explore keeps behaving identically.
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import ExploreCanvas from './ExploreCanvas'
import NetworkSrNav from './NetworkSrNav'
import { POSTER_ALT, POSTER_SRC, fallbackReason } from './poster'
import type { ExploreScene } from './scene'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

// Session 13: the poster src/alt and the fallback decision moved to the
// three-free poster.ts so the landing can use them without loading three.js.
// Re-exported here so /explore (ExplorePage) keeps its import surface unchanged.
export { POSTER_SRC, POSTER_ALT, webglAvailable, fallbackReason } from './poster'
export type { FallbackReason } from './poster'

export default function ExploreSurface({
  onRequestFocus,
  onEntryDone,
  onModeResolved,
  sceneRef,
  dimmed = false,
  posterPriority = false,
  embedded = false,
}: {
  onRequestFocus: (id: string | null) => void
  onEntryDone: () => void
  /** Tells the consumer whether the surface resolved to poster-only, so page
   *  chrome can drop interaction hints. Fires on mount and on runtime loss. */
  onModeResolved?: (posterOnly: boolean) => void
  sceneRef: MutableRefObject<ExploreScene | null>
  dimmed?: boolean
  /** First hero on the page: hint the poster as the LCP image. */
  posterPriority?: boolean
  /** Embedded on the landing hero: disable wheel-zoom/pan so the page scrolls. */
  embedded?: boolean
}) {
  const prm = usePrefersReducedMotion()
  // Decided once per mount so the poster/scene choice never flips mid-session.
  const reason = useMemo(() => fallbackReason(prm), [prm])
  const [contextLost, setContextLost] = useState(false)
  const posterOnly = reason !== null || contextLost

  useEffect(() => {
    onModeResolved?.(posterOnly)
    // onModeResolved is a stable callback from the consumer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posterOnly])

  // In poster-only mode there is no ceremony, so release the consumer's chrome
  // immediately (deep links to a focused word still render their InfoCard over
  // the poster).
  const entryFired = useRef(false)
  useEffect(() => {
    if (posterOnly && !entryFired.current) {
      entryFired.current = true
      onEntryDone()
    }
    // onEntryDone is a stable callback from the consumer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posterOnly])

  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: dimmed ? 0.85 : 1,
        transition: prm ? 'none' : 'opacity 550ms ease',
      }}
    >
      {/* Poster: FIRST PAINT under the live scene, and the whole picture in
          poster-only mode. object-cover so it frames on any viewport. */}
      <img
        src={POSTER_SRC}
        alt={posterOnly ? POSTER_ALT : ''}
        aria-hidden={posterOnly ? undefined : true}
        decoding="async"
        fetchPriority={posterPriority ? 'high' : undefined}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {!posterOnly && (
        <ExploreCanvas
          onRequestFocus={onRequestFocus}
          onEntryDone={onEntryDone}
          onContextLost={() => setContextLost(true)}
          sceneRef={sceneRef}
          embedded={embedded}
        />
      )}

      {/* Screen-reader alternative to the network, travelling with the surface. */}
      <NetworkSrNav />
    </div>
  )
}
