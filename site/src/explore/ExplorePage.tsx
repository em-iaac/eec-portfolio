// EXPLORE mode: the dark network of projects and thoughts; itself a
// portfolio piece. Full-viewport carbon surface with its own furniture (HUD,
// legend, toggle, info card) { deliberately not SheetPage. The URL is the
// source of truth for focus: /explore/:nodeId focuses that word; the scene
// only ever reports intent. Entry ceremony (the sanctioned SHOWCASE moment)
// plays once per arrival; reduced motion renders final states instantly.
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ExploreCanvas from './ExploreCanvas'
import InfoCard from './InfoCard'
import ExploreFallback from './ExploreFallback'
import { GRAPH } from './graph'
import { assertPaletteMatchesTheme, LENSES } from './palette'
import { EXPLORE_NODES } from '../data/registry'
import { LensTick } from '../components/Lens'
import type { ExploreScene } from './scene'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import { MODE_FADE_MS, MODE_NAVIGATE_MS } from '../hooks/useExploreTransition'

function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

const LENS_KEYS = ['c', 'p', 'e'] as const
const LENS_TO_REPO = { c: 'computation', p: 'practice', e: 'explorations' } as const

export default function ExplorePage() {
  const { nodeId } = useParams()
  const navigate = useNavigate()
  const prm = usePrefersReducedMotion()
  const webgl = useMemo(webglAvailable, [])
  const sceneRef = useRef<ExploreScene | null>(null)
  const [entryDone, setEntryDone] = useState(false)
  const [leaving, setLeaving] = useState(false)
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

  // URL -> scene. Deep links wait for the ceremony (entryDone).
  useEffect(() => {
    const s = sceneRef.current
    if (!s || !entryDone) return
    if (focusedIdx >= 0) s.focusNode(focusedIdx)
    else s.unfocus()
  }, [focusedIdx, entryDone])

  // Scene -> URL. Push when focusing from unfocused (Back = unfocus);
  // replace when switching or clearing so browsing words does not pile up
  // history.
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

  // EXPLORE -> READ: the light table switches back on. Mylar floods the
  // scene over the shared mode timing, then we navigate home.
  function leaveToRead(e: MouseEvent) {
    e.preventDefault()
    if (prm) {
      navigate('/')
      return
    }
    if (leaving) return
    setLeaving(true)
    sceneRef.current?.setControlsEnabled(false)
    leaveTimer.current = window.setTimeout(() => navigate('/'), MODE_NAVIGATE_MS)
  }

  if (!webgl) return <ExploreFallback />

  const chromeCls = entryDone || prm ? 'opacity-100' : 'opacity-0'

  return (
    <div className="fixed inset-0 overflow-hidden bg-carbon text-ink-dark" id="main" tabIndex={-1}>
      <ExploreCanvas
        onRequestFocus={navigateFocus}
        onEntryDone={() => setEntryDone(true)}
        sceneRef={sceneRef}
        dimmed={leaving}
      />

      <div
        className={`pointer-events-none fixed top-3.5 left-4 z-[3] font-mono text-[10px] leading-loose tracking-[0.12em] text-anno-dark transition-opacity duration-300 ${chromeCls}`}
      >
        EMILIE EL CHIDIAC · <b className="font-medium text-ink-dark">EXPLORE</b>
        <br />
        PROJECTS AND THOUGHTS, CONNECTED BY THEME · EDGES APPEAR WHILE YOU ASK
        <br />
        DRAG ORBIT · CLICK A WORD TO FOLLOW IT · ESC RETURNS
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

      {focusedIdx >= 0 && entryDone && <InfoCard index={focusedIdx} />}

      {/* Screen-reader alternative to the WebGL scene */}
      <nav aria-label="All projects and thoughts" className="sr-only">
        <ul>
          {GRAPH.nodes.map((n, i) => {
            const sheet = EXPLORE_NODES[i]?.sheet
            return (
              <li key={n.id}>
                {n.label} ({n.kind}, {LENSES[n.lens].label}){' '}
                {sheet && sheet.status === 'issued' && (
                  <Link to={sheet.route}>Open sheet {sheet.number}</Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

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
