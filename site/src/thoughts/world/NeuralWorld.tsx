// THE NEURAL WORLD (/thoughts, the meta build; every gate signed by Emilie
// 2026-07-11). The whole record — projects, thoughts, milestones, awards —
// drawn as one anatomical neural map over the horizontal career skeleton,
// full-bleed and drag-explorable, 2021 › NOW. At rest it is quiet points in
// time; it WAKES WHERE YOU LOOK (useProximityEngine.ts, the signed feel).
// Kind lives in the neuron (the landing's mark grammar): filled soma + lens
// nucleus = project · ring + core = thought · small star off its work =
// award · bare commit dot ON the lane = milestone. The ruler is geometric
// and faint, the nerve organic and bright; the contrast is the design; the
// mind owns all motion. TWO VIEWS OF ONE MIND: the landing stays the mind
// at rest; this is the mind in time. The words: each thought's own note page
// (/thoughts/:id), listed in /work's THE THOUGHTS section (the reading room
// and its graph<->words switch retired at the reindex, 2026-07-16).
//
// Copy status: kicker/sub/hint/corridor + h1 "points in time" + LIVE ·
// STILL GROWING all SIGNED in-session (gate 6). The NOW card's three lines
// render from data/now.ts (draftCopy there, unsigned).
//
// Anatomy of a node group (the adversarial review's floors):
// - the ref callbacks are memoized ONCE so hover/focus re-renders never
//   detach handles (detaching would wipe the engine's integrated energies);
// - the dimmable body (dendrites + glow + soma) sits in its own .nw-body
//   wrapper so the wake dim NEVER multiplies into the label's rest ink
//   (0.62 group x 0.62 label would land below the AA floor);
// - the fixed chrome sits BEFORE the stage in the DOM (readers meet the
//   page identity before 40 canvas stops);
// - Escape or a tap on empty field dismisses the card and releases the
//   wake (WCAG 1.4.13); arming on touch is announced via a polite live
//   region so a double-tap that arms is never silent.
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TitleBlock from '../../components/TitleBlock'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import { NOW } from '../../data/now'
import { THOUGHT_OPENINGS } from '../openings'
import { WORLD, starPath, type WorldNode } from './worldGraph'
import { useProximityEngine, TUNE, type ConnHandle, type NodeHandle } from './useProximityEngine'
import WorldSrNav from './WorldSrNav'

const LENS_COLOR: Record<string, string> = {
  computation: 'light-dark(#0e7490, #22d3ee)',
  practice: 'light-dark(#a8186b, #f472b6)',
  explorations: 'light-dark(#7a5e00, #facc15)',
}

const KIND_LABEL = {
  project: 'PROJECT',
  thought: 'THOUGHT',
  award: 'RECOGNITION',
  milestone: 'MILESTONE',
} as const

const KIND_NAME = {
  project: 'project',
  thought: 'thought',
  award: 'award',
  milestone: 'milestone',
} as const

// (no em dashes anywhere, aria strings included: the voice rule is binding)
function nodeAria(n: WorldNode): string {
  const base = `${n.title} · ${KIND_NAME[n.kind]}, ${n.date}`
  return n.route ? `${base}. Open it.` : base
}

interface CardState {
  title: string
  date: string
  kind: string
  blurb?: string
  serifTitle: boolean
  red?: boolean
  left: number
  top: number
}

const HIT_R = 34 // 68 canvas units: >= 44px down to ~560px-tall viewports

export default function NeuralWorld() {
  const prm = usePrefersReducedMotion()
  const navigate = useNavigate()
  const stageRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const nodesRef = useRef(new Map<string, NodeHandle>())
  const connsRef = useRef(new Map<string, ConnHandle>())
  const plumbLineRef = useRef<SVGLineElement>(null)
  const plumbDotRef = useRef<SVGCircleElement>(null)
  const [card, setCard] = useState<CardState | null>(null)
  const [announce, setAnnounce] = useState('')
  const armedId = useRef<string | null>(null)
  const lastPointerType = useRef<'mouse' | 'touch' | 'pen'>('mouse')
  // The project deks load AFTER first paint (they live in the /work data
  // chunk; the field card is the only consumer here, and it is hover-gated).
  const dekMap = useRef<Map<string, string> | null>(null)

  const ranks = useMemo(() => WORLD.nodes.map((n) => ({ id: n.id, rank: n.rank })), [])
  const engine = useProximityEngine({
    stageRef,
    svgRef,
    nodesRef,
    connsRef,
    plumbLineRef,
    plumbDotRef,
    worldH: WORLD.h,
    mainY: WORLD.mainY,
    ranks,
    prm,
  })

  useEffect(() => {
    // Paint the whole document with the mode's ground so overscroll matches.
    const html = document.documentElement
    const prev = html.style.background
    html.style.background = 'var(--lang-ground)'
    let on = true
    import('../../data/work').then((m) => {
      if (on) dekMap.current = new Map(m.WORK_ENTRIES.map((w) => [w.id, w.dek]))
    })
    if (import.meta.env.DEV) {
      // dev-only engine probe for verification sessions (tree-shakes away)
      ;(window as unknown as Record<string, unknown>).__nw = { nodes: nodesRef.current, conns: connsRef.current }
    }
    return () => {
      on = false
      html.style.background = prev
    }
  }, [])

  // Arrival: a #<id> deep link centres + wakes its piece (the notes' "SEE
  // THIS THOUGHT IN TIME" corridor); otherwise restore the last scroll (so
  // returning from a note lands where you left), else start mid-world.
  useEffect(() => {
    const stage = stageRef.current
    const svg = svgRef.current
    if (!stage || !svg) return
    const id = window.location.hash.slice(1)
    const target = id ? nodesRef.current.get(id) : undefined
    let wakeTimer = 0
    const raf = requestAnimationFrame(() => {
      const scale = svg.getBoundingClientRect().height / WORLD.h || 1
      if (target) {
        stage.scrollLeft = target.x * scale - stage.clientWidth / 2
        target.forceT = 1
        engine.kick()
        wakeTimer = window.setTimeout(() => {
          target.forceT = 0
          engine.kick()
        }, 2600)
      } else {
        const stored = Number(sessionStorage.getItem('nw-scroll'))
        stage.scrollLeft = Number.isFinite(stored) && stored > 0
          ? stored
          : (stage.scrollWidth - stage.clientWidth) * 0.35
      }
    })
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(wakeTimer)
    }
    // engine is stable; run once on mount.
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Drag-to-pan + non-passive wheel (React's onWheel is passive; the
  // preventDefault needs a real listener) + the scroll-position save (from
  // the live scroll listener: an unmount cleanup would read a detached
  // node's scrollLeft, which is always 0).
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let drag: { x: number; s: number } | null = null
    let saveTimer = 0
    const down = (e: PointerEvent) => {
      lastPointerType.current = (e.pointerType as 'mouse' | 'touch' | 'pen') || 'mouse'
      if ((e.target as Element).closest('.nw-node, a, button')) return
      // a press on empty field dismisses the card + disarms (1.4.13)
      dismiss()
      drag = { x: e.clientX, s: stage.scrollLeft }
      stage.classList.add('dragging')
    }
    const move = (e: PointerEvent) => {
      if (!drag) return
      stage.scrollLeft = drag.s - (e.clientX - drag.x)
    }
    const up = () => {
      drag = null
      stage.classList.remove('dragging')
    }
    const cancel = up // native pan-x can take the gesture mid-drag
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        stage.scrollLeft += e.deltaY
        e.preventDefault()
      }
    }
    const onScroll = () => {
      window.clearTimeout(saveTimer)
      saveTimer = window.setTimeout(() => {
        sessionStorage.setItem('nw-scroll', String(stage.scrollLeft))
      }, 160)
    }
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    stage.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', cancel)
    stage.addEventListener('wheel', wheel, { passive: false })
    stage.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', key)
    return () => {
      window.clearTimeout(saveTimer)
      stage.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', cancel)
      stage.removeEventListener('wheel', wheel)
      stage.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', key)
    }
    // dismiss only touches refs + setState; safe to close over the first one.
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- node registration. The ref callbacks are memoized ONCE: a changing
  // callback identity would make React detach (null) + reattach every
  // render, wiping the engine's integrated energies mid-animation (the
  // adversarial review's critical finding).
  function registerNode(n: WorldNode, el: SVGGElement | null) {
    if (!el) {
      nodesRef.current.delete(n.id)
      return
    }
    nodesRef.current.set(n.id, {
      id: n.id,
      kind: n.kind,
      x: n.x,
      y: n.y,
      el,
      body: el.querySelector('.nw-body'),
      soma: el.querySelector('.nw-soma'),
      fibres: Array.from(el.querySelectorAll<SVGPathElement>('.nw-dendrite')),
      lbl: el.querySelector('.nw-lbl'),
      yr: el.querySelector('.nw-yr'),
      glow: el.querySelector('.nw-glow'),
      E: 0,
      shown: 0,
      appliedE: -1,
      appliedShow: -1,
      forceT: 0,
    })
  }

  function registerConn(key: string, a: string, b: string, el: SVGGElement | null) {
    if (!el) {
      connsRef.current.delete(key)
      return
    }
    connsRef.current.set(key, {
      a,
      b,
      paths: Array.from(el.querySelectorAll<SVGPathElement>('.nw-reach')),
      syn: el.querySelector('.nw-synapse')!,
      pulse: el.querySelector('.nw-pulse')!,
      E: 0,
      applied: -1,
      fired: 0,
    })
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  const nodeRefs = useMemo(
    () => new Map(WORLD.nodes.map((n) => [n.id, (el: SVGGElement | null) => registerNode(n, el)])),
    [],
  )
  const connRefs = useMemo(
    () =>
      new Map(
        WORLD.links.map((l) => {
          const key = `${l.a}>${l.b}`
          return [key, (el: SVGGElement | null) => registerConn(key, l.a, l.b, el)]
        }),
      ),
    [],
  )
  /* eslint-enable react-hooks/exhaustive-deps */

  // ---- the field card ----
  function blurbOf(n: WorldNode): string | undefined {
    if (n.kind === 'project') return dekMap.current?.get(n.id)
    if (n.kind === 'thought') return THOUGHT_OPENINGS[n.id]
    return undefined
  }

  function showCard(n: WorldNode) {
    const h = nodesRef.current.get(n.id)
    const soma = h?.soma
    if (!soma) return
    const b = soma.getBoundingClientRect()
    const left = Math.max(12, Math.min(b.left + b.width / 2 - 150, window.innerWidth - 312))
    const top = b.top < window.innerHeight * 0.5 ? b.bottom + 14 : b.top - 178
    setCard({
      title: n.title,
      date: n.date,
      kind: KIND_LABEL[n.kind],
      blurb: blurbOf(n),
      serifTitle: n.kind === 'thought',
      left,
      top: Math.max(80, top),
    })
  }

  function showNowCard(el: SVGGraphicsElement) {
    const b = el.getBoundingClientRect()
    setCard({
      title: 'still growing',
      date: NOW.date,
      kind: 'NOW',
      red: true,
      serifTitle: true,
      blurb: `building ${NOW.building} · reading ${NOW.reading} · thinking about ${NOW.thinking}`,
      left: Math.max(12, Math.min(b.left - 150, window.innerWidth - 312)),
      top: Math.max(80, b.top - 190),
    })
  }

  const hideCard = () => setCard(null)

  function setForce(id: string, t: number) {
    const h = nodesRef.current.get(id)
    if (!h) return
    h.forceT = t
    engine.kick()
  }

  // Escape / empty-field press: card away, armed wake released (1.4.13).
  function dismiss() {
    if (armedId.current) {
      setForce(armedId.current, 0)
      armedId.current = null
    }
    setCard(null)
    setAnnounce('')
  }

  function open(n: WorldNode) {
    if (!n.route) return
    navigate(n.route, { viewTransition: true })
  }

  // First tap wakes + arms (card shows, politely announced), second tap
  // opens: the landing's shipped armed-tap pattern (gate 5).
  function onNodeClick(n: WorldNode) {
    if (lastPointerType.current === 'touch' && armedId.current !== n.id) {
      if (armedId.current) setForce(armedId.current, 0)
      armedId.current = n.id
      setForce(n.id, 1)
      showCard(n)
      setAnnounce(n.route ? `${n.title} preview shown. Activate again to open.` : `${n.title} preview shown.`)
      return
    }
    open(n)
  }

  const pieces = WORLD.nodes.length
  const sk = WORLD.skeleton

  return (
    <div className="text-[var(--lang-ink)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-redline focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-mylar"
      >
        Skip to content
      </a>
      <TitleBlock />
      <main id="main" tabIndex={-1} className="outline-none">
        {/* the page chrome FIRST in the DOM (identity before the 40 canvas
            stops); everything is position:fixed, so the paint is identical */}
        {/* max-width leaves room for the WATCH IT GROW button on its right;
            kicker in ink-muted (red = liveness/interaction only, DL am.7) */}
        <header className="pointer-events-none fixed top-20 left-6 z-[3] max-w-[min(460px,calc(100vw-190px))] sm:left-9">
          <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--lang-ink-muted)]">
            THOUGHTS · ONE WORLD · EVERYTHING, IN TIME
          </p>
          <h1 className="mt-2 font-serif text-[clamp(22px,2.6vw,30px)] font-medium lowercase italic tracking-[-0.01em] text-[var(--lang-ink)]">
            points in time
          </h1>
          <p className="mt-2 font-mono text-[9px] tracking-[0.1em] text-[var(--lang-ink-muted)]">
            {pieces} PIECES · 2021 › <span className="text-[var(--lang-interaction)]">NOW</span> · PROJECTS +
            THOUGHTS + MILESTONES + AWARDS · EVERY PIECE OPENS
          </p>
          {/* The graph<->words switch RETIRED at the reindex (2026-07-16,
              Emilie's IA gate): the thoughts LIST lives on /work now (THE
              THOUGHTS section); this room is the world only. */}
        </header>

        {!prm && (
          <button
            type="button"
            onClick={engine.replay}
            className="lang-glass-2 fixed top-20 right-6 z-[3] min-h-11 rounded-[var(--r-pill)] px-4 font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink)] hover:text-[var(--lang-interaction)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)] sm:right-9"
          >
            ⟳ WATCH IT GROW
          </button>
        )}

        {/* legend (bottom left) + hint / corridor (bottom right). The legend
            stays on phones too (the kind key must not vanish, gate-2 look);
            its max-width keeps it wrapping clear of the corridor block. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-5 left-6 z-[3] flex max-w-[52vw] flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[8px] tracking-[0.08em] text-[var(--lang-ink-muted)] sm:left-9 sm:gap-x-4 sm:gap-y-2 sm:text-[9px] sm:tracking-[0.1em]"
        >
          <span className="inline-flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 16 16" className="overflow-visible">
              <circle cx="8" cy="8" r="6" fill="var(--lang-ink)" />
              <circle cx="8" cy="8" r="2.4" fill={LENS_COLOR.computation} />
            </svg>
            PROJECT
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" className="overflow-visible">
              <circle cx="7" cy="7" r="4.6" fill="none" stroke="var(--lang-ink)" strokeWidth="1.6" />
            </svg>
            THOUGHT
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" className="overflow-visible">
              <path d={starPath(7, 7, 5.5)} fill="var(--lang-ink)" />
            </svg>
            AWARD
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" className="overflow-visible">
              <circle cx="6" cy="6" r="2.4" fill="var(--lang-ink-muted)" />
            </svg>
            MILESTONE · ON THE CAREER LINE
          </span>
          <span className="text-[var(--lang-interaction)]">ONE RED TIP = LIVE</span>
        </div>

        {/* The words are now reached by the switch up by the title (S4a); this
            corner keeps only the drag hint. */}
        <div className="pointer-events-none fixed right-6 bottom-5 z-[3] max-w-[44vw] text-right font-mono text-[9px] tracking-[0.12em] text-[var(--lang-ink-muted)] sm:right-9">
          {/* emphasis in ink, not red: red = liveness/interaction only */}
          <p aria-hidden="true">
            <b className="font-normal text-[var(--lang-ink)]">DRAG</b> TO EXPLORE ·{' '}
            <b className="font-normal text-[var(--lang-ink)]">IT WAKES WHERE YOU LOOK</b>
          </p>
        </div>

        {/* legibility scrims over the stage's top + bottom edges */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 right-0 left-0 z-[2] h-[150px]"
          style={{
            background:
              'linear-gradient(to bottom, color-mix(in srgb, var(--lang-ground) 92%, transparent), transparent)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed right-0 bottom-0 left-0 z-[2] h-[90px]"
          style={{
            background:
              'linear-gradient(to top, color-mix(in srgb, var(--lang-ground) 88%, transparent), transparent)',
          }}
        />

        {/* the stage: full-bleed, drag/wheel/keyboard panning */}
        <section
          ref={stageRef}
          tabIndex={0}
          className="nw-stage z-0 bg-[var(--lang-ground)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
          aria-label="The whole mind as one neural world: every project, thought, milestone and award in time. It wakes near your pointer; drag sideways to explore."
        >
          <svg ref={svgRef} viewBox={`0 0 ${WORLD.w} ${WORLD.h}`} preserveAspectRatio="xMidYMid meet">
            {/* year columns */}
            <g aria-hidden="true">
              {sk.years.map((y) => (
                <g key={y.label}>
                  <line className="nw-yearline" x1={y.x} y1={96} x2={y.x} y2={WORLD.h - 40} />
                  <text className="nw-yearlbl" x={y.x + 8} y={WORLD.h - 46}>
                    {y.label}
                  </text>
                </g>
              ))}
            </g>

            {/* the career skeleton: the record, drawn with a ruler */}
            <g aria-hidden="true">
              {sk.lanes.map((l) => (
                <path
                  key={l.id}
                  className={`nw-lane${l.main ? ' main' : ''}`}
                  d={l.d}
                  strokeWidth={l.main ? 1.6 : 1.1}
                />
              ))}
              {sk.tips.map((t, i) => (
                <circle
                  key={i}
                  cx={t.x}
                  cy={t.y}
                  r={3}
                  fill="var(--lang-ground)"
                  stroke="var(--lang-ink)"
                  strokeWidth={1.2}
                  opacity={0.7}
                />
              ))}
              <text className="nw-lanelbl" x={sk.nowAt.x} y={sk.nowAt.y} textAnchor="end" fill="var(--lang-ink)">
                NOW
              </text>
              {/* the plumb line (the engine drives it) */}
              <line ref={plumbLineRef} className="nw-plumb" strokeWidth={1} />
              <circle ref={plumbDotRef} r={3} fill="var(--lang-ink)" style={{ opacity: 0 }} />
            </g>

            {/* the ONE red tip: live, still growing; its card is the NOW.
                Only the mark beats (nw-livetip); the tag text stays at full
                red ink (the trough would fall below AA). */}
            <g
              className="nw-node"
              tabIndex={0}
              role="img"
              aria-label={`Live, still growing: the self-employed practice. Now building ${NOW.building}; reading ${NOW.reading}; thinking about ${NOW.thinking}.`}
              onMouseEnter={(e) => showNowCard(e.currentTarget)}
              onMouseLeave={hideCard}
              onFocus={(e) => showNowCard(e.currentTarget)}
              onBlur={hideCard}
            >
              <g className="nw-livetip">
                <line
                  x1={sk.liveTip.x - 30}
                  y1={sk.liveTip.y}
                  x2={sk.liveTip.x - 4}
                  y2={sk.liveTip.y}
                  stroke="var(--lang-interaction)"
                  strokeWidth={1.6}
                />
                <circle
                  className="nw-soma"
                  cx={sk.liveTip.x}
                  cy={sk.liveTip.y}
                  r={3.4}
                  fill="var(--lang-ground)"
                  stroke="var(--lang-interaction)"
                  strokeWidth={1.6}
                />
              </g>
              <circle className="nw-hit" cx={sk.liveTip.x} cy={sk.liveTip.y} r={HIT_R} />
              <text className="nw-livetag" x={sk.liveTip.x - 10} y={sk.liveTip.y - 10} textAnchor="end">
                LIVE · STILL GROWING
              </text>
            </g>

            {/* the correlations: hidden at rest, grown by the engine */}
            <g aria-hidden="true">
              {WORLD.links.map((l) => {
                const key = `${l.a}>${l.b}`
                const col = l.lens ? LENS_COLOR[l.lens] : 'var(--lang-ink)'
                return (
                  <g key={key} ref={connRefs.get(key)}>
                    {l.fibres.map((f, i) => (
                      <path key={i} className="nw-reach" d={f.d} strokeWidth={f.w} pathLength={1} />
                    ))}
                    <circle
                      className="nw-synapse"
                      cx={l.synapse.x}
                      cy={l.synapse.y}
                      r={l.synapse.r}
                      fill="var(--lang-ground)"
                      stroke={col}
                      strokeWidth={1.5}
                    />
                    <path
                      className="nw-pulse"
                      d={l.pulseD}
                      stroke={col}
                      strokeWidth={2.5}
                      pathLength={1}
                      strokeDasharray="0.12 1"
                    />
                  </g>
                )
              })}
            </g>

            {/* the neurons */}
            <g>
              {WORLD.nodes.map((n) => {
                const col = n.lens ? LENS_COLOR[n.lens] : 'var(--lang-ink)'
                const o = n.style
                const above = n.labelAbove
                const ly = n.kind === 'milestone' ? n.y + 18 : above ? n.y - o.r - 12 : n.y + o.r + 18
                const yy = n.kind === 'milestone' ? ly + 12 : above ? ly - 13 : ly + 12
                const kindClass = n.kind === 'project' ? 'p' : n.kind === 'thought' ? 't' : n.kind === 'award' ? 'a' : 'm'
                return (
                  <g
                    key={n.id}
                    ref={nodeRefs.get(n.id)}
                    className={`nw-node${n.route ? '' : ' still'}`}
                    tabIndex={0}
                    role={n.route ? 'link' : 'img'}
                    aria-label={nodeAria(n)}
                    onMouseEnter={() => {
                      setForce(n.id, 1)
                      showCard(n)
                    }}
                    onMouseLeave={() => {
                      setForce(n.id, 0)
                      hideCard()
                    }}
                    onFocus={(e) => {
                      setForce(n.id, 1)
                      showCard(n)
                      e.currentTarget.scrollIntoView({
                        block: 'nearest',
                        inline: 'center',
                        behavior: prm ? 'auto' : 'smooth',
                      })
                    }}
                    onBlur={() => {
                      setForce(n.id, 0)
                      hideCard()
                    }}
                    onClick={() => onNodeClick(n)}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && n.route) {
                        e.preventDefault()
                        open(n)
                      }
                    }}
                  >
                    {/* the dimmable body: the wake dim lives HERE so it never
                        multiplies into the label's rest ink (AA floor) */}
                    <g className="nw-body" style={n.kind !== 'milestone' ? { opacity: TUNE.restInk } : undefined}>
                      {n.dendrites.map((d, i) => (
                        <path key={i} className="nw-dendrite" d={d} strokeWidth={o.baseW} pathLength={1} />
                      ))}
                      {n.kind !== 'milestone' && (
                        <circle className="nw-glow" cx={n.x} cy={n.y} r={o.r * 3} fill="url(#nw-glow-grad)" />
                      )}
                      {n.kind === 'project' ? (
                        <>
                          <circle className="nw-soma" cx={n.x} cy={n.y} r={o.r} fill="var(--lang-ink)" />
                          <circle cx={n.x} cy={n.y} r={2.6} fill={col} />
                        </>
                      ) : n.kind === 'thought' ? (
                        <>
                          <circle
                            className="nw-soma"
                            cx={n.x}
                            cy={n.y}
                            r={o.r}
                            fill="var(--lang-ground)"
                            stroke="var(--lang-ink)"
                            strokeWidth={1.7}
                          />
                          <circle cx={n.x} cy={n.y} r={1.9} fill={col} opacity={0.8} />
                        </>
                      ) : n.kind === 'award' ? (
                        <path className="nw-soma" d={starPath(n.x, n.y, o.r)} fill="var(--lang-ink)" />
                      ) : (
                        <circle className="nw-soma" cx={n.x} cy={n.y} r={o.r} fill="var(--lang-ink-muted)" />
                      )}
                    </g>
                    <circle className="nw-hit" cx={n.x} cy={n.y} r={HIT_R} />
                    {/* initial inline opacities = TUNE.restInk for BOTH texts
                        (G4: dates ride the same rest as titles): the first
                        paint IS the rest state, no post-mount pop */}
                    <text
                      className={`nw-lbl ${kindClass}`}
                      x={n.x}
                      y={ly}
                      textAnchor="middle"
                      style={{ opacity: TUNE.restInk }}
                    >
                      {n.title}
                    </text>
                    <text
                      className="nw-yr"
                      x={n.x}
                      y={yy}
                      textAnchor="middle"
                      style={{ opacity: TUNE.restInk }}
                    >
                      {n.date}
                    </text>
                  </g>
                )
              })}
            </g>

            <defs>
              <radialGradient id="nw-glow-grad">
                <stop offset="0%" stopColor="var(--lang-ink)" stopOpacity={0.32} />
                <stop offset="100%" stopColor="var(--lang-ink)" stopOpacity={0} />
              </radialGradient>
            </defs>
          </svg>
        </section>

        {/* the field card */}
        {card && (
          <aside
            aria-hidden="true"
            className="nw-fieldcard lang-glass-2 infocard-enter pointer-events-none fixed z-[6] max-w-[300px] rounded-[var(--r-sheet)] px-4 py-3.5"
            style={{ left: card.left, top: card.top }}
          >
            <div className="flex justify-between gap-3 font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink-muted)]">
              <span>{card.date}</span>
              <span className={card.red ? 'text-[var(--lang-interaction)]' : 'text-[var(--lang-ink)]'}>
                {card.kind}
              </span>
            </div>
            <p
              className={`mt-2 text-[16px] leading-snug font-semibold text-[var(--lang-ink)] ${
                card.serifTitle ? 'font-serif font-medium lowercase italic' : ''
              }`}
            >
              {card.title}
            </p>
            {card.blurb && (
              <p className="mt-1.5 font-serif text-[13px] leading-relaxed text-[var(--lang-ink-muted)]">
                {card.blurb}
              </p>
            )}
          </aside>
        )}

        {/* the armed-tap announcement (a silent arm would eat a double-tap) */}
        <div aria-live="polite" className="sr-only">
          {announce}
        </div>

        <WorldSrNav />
      </main>
    </div>
  )
}
