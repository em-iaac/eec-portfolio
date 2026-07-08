// EXPLORE mode: the dark network of projects and thoughts; itself a portfolio
// piece. Full-viewport carbon surface with its own furniture (HUD, legend,
// toggle, info card) · deliberately not SheetPage. The URL is the source of
// truth for focus: /explore/:nodeId focuses that word; the scene only ever
// reports intent. Entry ceremony (the sanctioned SHOWCASE moment) plays once per
// arrival; reduced motion and every other fallback render the static poster.
//
// Session 12: the network itself now lives in ExploreSurface (poster first
// paint, fallback matrix, live scene, SR nav). This page is its first consumer
// and keeps behaving identically; it owns only the page chrome around it.
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ExploreSurface, { fallbackReason } from './ExploreSurface'
import InfoCard from './InfoCard'
import { GRAPH } from './graph'
import { assertPaletteMatchesTheme, LENSES } from './palette'
import { LensTick } from '../components/Lens'
import type { ExploreScene } from './scene'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import { MODE_FADE_MS, MODE_NAVIGATE_MS } from '../hooks/useExploreTransition'

const LENS_KEYS = ['c', 'p', 'e'] as const
const LENS_TO_REPO = { c: 'computation', p: 'practice', e: 'explorations' } as const

export default function ExplorePage() {
  const { nodeId } = useParams()
  const navigate = useNavigate()
  const prm = usePrefersReducedMotion()
  const sceneRef = useRef<ExploreScene | null>(null)
  const [entryDone, setEntryDone] = useState(false)
  const [leaving, setLeaving] = useState(false)
  // Poster-only (no live scene): the HUD drops the drag/click hints. Seeded from
  // the same pure decision the surface makes, then kept in sync (runtime loss).
  const [posterOnly, setPosterOnly] = useState(() => fallbackReason(prm) !== null)
  const leaveTimer = useRef<number | undefined>(undefined)

  const focusedIdx = useMemo(
    () => (nodeId ? GRAPH.nodes.findIndex((n) => n.id === nodeId) : -1),
    [nodeId],
  )

  useEffect(() => {
    document.title = 'EXPLORE | Emilie El Chidiac'
    assertPaletteMatchesTheme()
    const html = document.documentElement
    const prev = html.style.background
    html.style.background = 'var(--color-carbon)'
    return () => {
      html.style.background = prev
      window.clearTimeout(leaveTimer.current)
    }
  }, [])

  // Invalid deep links fall back to the unfocused view.
  useEffect(() => {
    if (nodeId && focusedIdx < 0) navigate('/explore', { replace: true })
  }, [nodeId, focusedIdx, navigate])

  // URL -> scene. Deep links wait for the ceremony (entryDone). No-op in
  // poster-only mode (no scene to drive; the InfoCard still renders).
  useEffect(() => {
    const s = sceneRef.current
    if (!s || !entryDone) return
    if (focusedIdx >= 0) s.focusNode(focusedIdx)
    else s.unfocus()
  }, [focusedIdx, entryDone])

  // Scene -> URL. Push when focusing from unfocused (Back = unfocus); replace
  // when switching or clearing so browsing words does not pile up history.
  const navigateFocus = useCallback(
    (id: string | null) => {
      if (id) navigate(`/explore/${id}`, { replace: focusedIdx >= 0 })
      else navigate('/explore', { replace: true })
    },
    [navigate, focusedIdx],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focusedIdx >= 0) navigateFocus(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focusedIdx, navigateFocus])

  // EXPLORE -> READ: the light table switches back on. Mylar floods the scene
  // over the shared mode timing, then we navigate. The info card's OPEN SHEET
  // link routes through here too (Session 5 bundle), so leaving a focused word
  // for its sheet uses the same ceremony, never the root view transition.
  const leaveTo = useCallback(
    (target: string) => {
      if (prm) {
        navigate(target)
        return
      }
      if (leaving) return
      setLeaving(true)
      sceneRef.current?.setControlsEnabled(false)
      leaveTimer.current = window.setTimeout(() => navigate(target), MODE_NAVIGATE_MS)
    },
    [prm, leaving, navigate],
  )

  function leaveToRead(e: MouseEvent) {
    e.preventDefault()
    leaveTo('/')
  }

  const chromeCls = entryDone || prm ? 'opacity-100' : 'opacity-0'

  return (
    <div className="fixed inset-0 overflow-hidden bg-carbon text-ink-dark" id="main" tabIndex={-1}>
      <ExploreSurface
        onRequestFocus={navigateFocus}
        onEntryDone={() => setEntryDone(true)}
        onModeResolved={setPosterOnly}
        sceneRef={sceneRef}
        dimmed={leaving}
        posterPriority
      />

      <div
        className={`pointer-events-none fixed top-3.5 left-4 z-[3] font-mono text-[10px] leading-loose tracking-[0.12em] text-anno-dark transition-opacity duration-300 ${chromeCls}`}
      >
        EMILIE EL CHIDIAC · <b className="font-medium text-ink-dark">EXPLORE</b>
        <br />
        PROJECTS AND THOUGHTS, CONNECTED BY THEME · EDGES APPEAR WHILE YOU ASK
        <br />
        {posterOnly
          ? 'A STILL OF THE FIELD ON THIS DEVICE · READ HOLDS THE FULL INDEX'
          : 'DRAG ORBIT · CLICK A WORD TO FOLLOW IT · ESC RETURNS'}
      </div>

      <Link
        to="/"
        onClick={leaveToRead}
        className={`fixed top-3.5 right-4 z-[3] -m-2 p-2 font-mono text-[10px] tracking-[0.12em] text-redline-wire underline underline-offset-4 transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-redline-wire ${chromeCls}`}
      >
        ISSUED FOR: READ &gt;
      </Link>

      <div
        className={`pointer-events-none fixed bottom-3.5 left-4 z-[3] flex flex-wrap items-center gap-4 font-mono text-[9px] tracking-[0.1em] text-anno-dark transition-opacity duration-300 ${chromeCls}`}
      >
        {LENS_KEYS.map((k) => (
          <span key={k} className="inline-flex items-center gap-1.5">
            <LensTick lens={LENS_TO_REPO[k]} variant="wire" />
            {LENSES[k].label}
          </span>
        ))}
        <span>MONO CAPS = PROJECT · SERIF ITALIC = THOUGHT</span>
      </div>

      {focusedIdx >= 0 && entryDone && (
        <InfoCard key={focusedIdx} index={focusedIdx} onOpenSheet={leaveTo} />
      )}

      {/* Mylar overlay: the light table switching back on */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] bg-mylar"
        style={{
          opacity: leaving ? 1 : 0,
          transition: prm ? 'none' : `opacity ${MODE_FADE_MS}ms ease`,
        }}
      />
    </div>
  )
}
