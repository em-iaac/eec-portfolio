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
import { Link } from 'react-router-dom'
import ExploreCanvas from './ExploreCanvas'
import { GRAPH } from './graph'
import { LENSES } from './palette'
import { EXPLORE_NODES } from '../data/registry'
import type { ExploreScene } from './scene'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

// public/assets/explore-poster.webp, regenerated every build from makeGraph()
// output by scripts/generate-poster.mjs (the standing poster contract).
export const POSTER_SRC = `${import.meta.env.BASE_URL}assets/explore-poster.webp`

const POSTER_ALT =
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

// Pre-emptive fallback signals (failed-context is handled at runtime below).
// Conservative on low-power so capable phones still get the scene: only genuine
// signals (save-data, tiny RAM, <=2 cores) route to the poster.
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

export default function ExploreSurface({
  onRequestFocus,
  onEntryDone,
  onModeResolved,
  sceneRef,
  dimmed = false,
  posterPriority = false,
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
        />
      )}

      {/* Screen-reader alternative to the network, travelling with the surface. */}
      <nav aria-label="All projects and thoughts" className="sr-only">
        <ul>
          {GRAPH.nodes.map((n, i) => {
            const reg = EXPLORE_NODES[i]
            const sheet = reg?.sheet
            const note = reg?.note
            return (
              <li key={n.id}>
                {n.label} ({n.kind}, {LENSES[n.lens].label}){' '}
                {sheet && sheet.status === 'issued' && (
                  <Link to={sheet.route}>Open sheet {sheet.number}</Link>
                )}
                {note && note.status === 'drafted' && <Link to={note.route}>Open note</Link>}
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
