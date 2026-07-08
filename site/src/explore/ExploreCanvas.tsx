// Thin mount for the imperative scene. StrictMode-safe: the scene checks its
// disposed flag after the async font load, so a dev double-mount only costs
// a restarted ceremony.
import { useEffect, useRef, type MutableRefObject } from 'react'
import { ExploreScene } from './scene'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

export default function ExploreCanvas({
  onRequestFocus,
  onEntryDone,
  onContextLost,
  sceneRef,
}: {
  onRequestFocus: (id: string | null) => void
  onEntryDone: () => void
  onContextLost?: () => void
  sceneRef: MutableRefObject<ExploreScene | null>
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const leaderRef = useRef<HTMLCanvasElement>(null)
  const lblRef = useRef<HTMLDivElement>(null)
  const prm = usePrefersReducedMotion()
  const cb = useRef({ onRequestFocus, onEntryDone, onContextLost })
  cb.current = { onRequestFocus, onEntryDone, onContextLost }

  useEffect(() => {
    const scene = new ExploreScene(containerRef.current!, leaderRef.current!, lblRef.current!, {
      prm,
      onRequestFocus: (id) => cb.current.onRequestFocus(id),
      onEntryDone: () => cb.current.onEntryDone(),
      onContextLost: () => cb.current.onContextLost?.(),
    })
    sceneRef.current = scene
    void scene.init()
    return () => {
      sceneRef.current = null
      scene.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div ref={containerRef} className="absolute inset-0" />
      <canvas ref={leaderRef} className="pointer-events-none absolute inset-0" />
      <div
        ref={lblRef}
        className="pointer-events-none absolute hidden font-mono text-[9px] tracking-[0.12em] whitespace-nowrap text-redline-wire"
        style={{ display: 'none' }}
      />
    </div>
  )
}
