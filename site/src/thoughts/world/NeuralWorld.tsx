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
import { LENSES, type Lens } from '../../components/Lens'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import { NOW } from '../../data/now'
import { THOUGHT_OPENINGS } from '../openings'
import { WORLD, starPath, type WorldNode } from './worldGraph'
import { vtName } from '../../lib/viewTransition'
import { preloadPath } from '../../lib/preloadRoute'
import { travelTo } from '../../lib/navIntent'
import { useProximityEngine, TUNE, type ConnHandle, type NodeHandle } from './useProximityEngine'
import WorldSrNav from './WorldSrNav'

// The lens accents come from the one source (components/Lens.tsx): these land
// on SVG presentation attributes, so they must be the literal light-dark()
// pair, never a var().
const lensColor = (lens: Lens | undefined) => (lens ? LENSES[lens].accent : 'var(--lang-ink)')

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
  id: string
  title: string
  date: string
  kind: string
  blurb?: string
  serifTitle: boolean
  red?: boolean
  /** A live + still-growing project: the locked card carries the red note. */
  live?: boolean
  /** Present on routed nodes: the locked card's OPEN button travels here. */
  route?: string
  /** false = the light hover chip (title + kind, no blurb, no button);
   *  true = the clicked, persistent card (blurb + OPEN, pointer-interactive). */
  locked: boolean
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
  // The LOCKED node id lives in a ref (not state) so the mount-time drag/Escape
  // handlers close over a stable handle, never a stale render's card (S6-A,
  // Emilie 2026-07-24: hover glances, a click LOCKS the card, click again /
  // Escape / empty field closes it; travel is the card's OPEN button).
  const lockedId = useRef<string | null>(null)
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
    // (No html-background patch here any more; see LandingCover. `body` paints
    // --lang-ground, so overscroll already matches every surface.)
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
      if ((e.target as Element).closest('.nw-node, a, button')) return
      // a press on empty field closes the locked card (1.4.13; her "empty
      // space closes it")
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

  function cardPos(b: DOMRect, locked: boolean) {
    const left = Math.max(12, Math.min(b.left + b.width / 2 - 150, window.innerWidth - 312))
    // The locked card is taller (blurb + button), so it lifts higher when it
    // must open upward; the light chip sits closer to its node.
    const top = b.top < window.innerHeight * 0.5 ? b.bottom + 14 : b.top - (locked ? 178 : 92)
    return { left, top: Math.max(80, top) }
  }

  // locked=false is the light hover/focus CHIP (title + kind + date, no blurb,
  // no button, non-interactive); locked=true is the clicked, persistent card
  // (blurb + OPEN, pointer-interactive).
  function showCard(n: WorldNode, locked: boolean) {
    const soma = nodesRef.current.get(n.id)?.soma
    if (!soma) return
    const { left, top } = cardPos(soma.getBoundingClientRect(), locked)
    setCard({
      id: n.id,
      title: n.title,
      date: n.date,
      kind: KIND_LABEL[n.kind],
      blurb: locked ? blurbOf(n) : undefined,
      serifTitle: n.kind === 'thought',
      live: n.live,
      route: n.route,
      locked,
      left,
      top,
    })
  }

  function showNowCard(el: SVGGraphicsElement, locked: boolean) {
    const b = el.getBoundingClientRect()
    setCard({
      id: 'now',
      title: 'still growing',
      date: NOW.date,
      kind: 'NOW',
      red: true,
      serifTitle: true,
      blurb: locked ? `building ${NOW.building} · reading ${NOW.reading} · thinking about ${NOW.thinking}` : undefined,
      locked,
      left: Math.max(12, Math.min(b.left - 150, window.innerWidth - 312)),
      top: Math.max(80, b.top - (locked ? 190 : 104)),
    })
  }

  const hideCard = () => setCard(null)

  function setForce(id: string, t: number) {
    const h = nodesRef.current.get(id)
    if (!h) return
    h.forceT = t
    engine.kick()
  }

  // Escape / empty-field press: close the card, release the locked wake
  // (1.4.13). Ref-based (lockedId) so the mount-time handlers never read a
  // stale render's card.
  function dismiss() {
    if (lockedId.current) {
      setForce(lockedId.current, 0)
      lockedId.current = null
    }
    setCard(null)
  }

  function open(n: WorldNode) {
    if (!n.route) return
    preloadPath(n.route)
    navigate(travelTo(n.route), { viewTransition: true })
  }

  // A pointer click LOCKS this node's card (releasing any previously locked
  // node's wake); clicking the locked node again closes it. Travel is the
  // card's OPEN button, so a stray click never jumps the page. Keyboard Enter
  // still opens directly (onKeyDown below), and screen readers travel via
  // WorldSrNav's links.
  function onNodeClick(n: WorldNode) {
    if (lockedId.current === n.id) {
      dismiss()
      return
    }
    if (lockedId.current && lockedId.current !== n.id) setForce(lockedId.current, 0)
    lockedId.current = n.id
    setForce(n.id, 1)
    showCard(n, true)
  }

  // The live NOW tip locks the same way; it has no route, so its card carries
  // no OPEN button (the wake is the beat animation, not a forced energy).
  function onNowClick(el: SVGGraphicsElement) {
    if (lockedId.current === 'now') {
      dismiss()
      return
    }
    if (lockedId.current && lockedId.current !== 'now') setForce(lockedId.current, 0)
    lockedId.current = 'now'
    showNowCard(el, true)
  }

  const sk = WORLD.skeleton

  return (
    // The same frame shell as SheetPage (flex min-h-dvh flex-col) so the
    // sticky header pill sits at the identical position as every other page
    // (the audit fixed the world's pill reading "slightly up", 2026-07-19).
    <div className="flex min-h-dvh flex-col text-[var(--lang-ink)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-redline focus:px-4 focus:py-2 focus:font-mono focus:text-nav focus:text-mylar"
      >
        Skip to content
      </a>
      {/* THE HEADER LINE (the design audit, Emilie 2026-07-19: header + footer
          lines identical everywhere, the canvas clean of chrome): the pill
          left, WATCH IT GROW on the header line right, exactly like every
          other page's tools. */}
      <TitleBlock
        toolsKey="world"
        tools={
          !prm ? (
            <button
              type="button"
              onClick={engine.replay}
              className="inline-flex min-h-8 items-center rounded-[var(--r-pill)] border border-[var(--lang-hairline)] px-3 font-mono text-label tracking-[0.1em] text-[var(--lang-ink)] hover:border-[var(--lang-interaction)] hover:text-[var(--lang-interaction)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]"
            >
              ⟳ WATCH IT GROW
            </button>
          ) : undefined
        }
      />
      <main id="main" tabIndex={-1} className="outline-none">
        {/* THE CLEAR CANVAS (the design audit round 2, Emilie 2026-07-19:
            "remove 'points in time' and the other words from the content
            area; keep the header area clear, no overlap with a node"). The
            title + meta left the canvas entirely; the nav's THOUGHTS door
            names the room, and the h1 survives for screen readers + SEO
            (headData still needs it). The stage itself is inset between the
            header and footer lines (.nw-stage, index.css), so no node ever
            runs under the chrome; the old fade scrims retired (round 3). */}
        <h1 className="sr-only">The mind in time: every project, thought, milestone and award since 2021</h1>

        {/* THE FOOTER LINE (Emilie's pick 2026-07-19: the world's key lives on
            a footer line, no name/contact footer on this immersive page):
            the legend (left) + the drag hint (right), one glass line at the
            footer's height + insets so it reads the same as every page.
            pointer-events-none so a drag still passes through to the stage. */}
        <div className="pointer-events-none fixed inset-x-0 bottom-2 z-[3] px-5 sm:px-8">
          <div className="lang-glass-1 mx-auto flex max-w-[1856px] flex-wrap items-center justify-between gap-x-6 gap-y-1 rounded-[var(--r-card)] px-5 py-2.5 sm:px-7">
            <div
              aria-hidden="true"
              className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-micro tracking-[0.08em] text-[var(--lang-ink-muted)] sm:gap-x-4 sm:text-micro sm:tracking-[0.1em]"
            >
              <span className="inline-flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 16 16" className="overflow-visible">
                  <circle cx="8" cy="8" r="6" fill="var(--lang-ink)" />
                  <circle cx="8" cy="8" r="2.4" fill={LENSES.computation.accent} />
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
                MILESTONE
              </span>
              <span className="text-[var(--lang-interaction)]">RED = LIVE</span>
            </div>
            <p
              aria-hidden="true"
              className="font-mono text-micro tracking-[0.12em] text-[var(--lang-ink-muted)]"
            >
              <b className="font-normal text-[var(--lang-ink)]">DRAG</b> TO EXPLORE ·{' '}
              <b className="font-normal text-[var(--lang-ink)]">IT WAKES WHERE YOU LOOK</b>
            </p>
          </div>
        </div>

        {/* The legibility scrims RETIRED (round 3, Emilie 2026-07-19: the
            fade made top thoughts unreadable). The stage is inset between
            the header and footer lines now (.nw-stage, index.css), so no
            node ever runs under the chrome and nothing needs fading. */}

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
              onMouseEnter={(e) => {
                if (!lockedId.current) showNowCard(e.currentTarget, false)
              }}
              onMouseLeave={() => {
                if (!lockedId.current) hideCard()
              }}
              onClick={(e) => onNowClick(e.currentTarget)}
              onFocus={(e) => {
                if (!lockedId.current) showNowCard(e.currentTarget, false)
              }}
              onBlur={() => {
                if (!lockedId.current) hideCard()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onNowClick(e.currentTarget)
                }
              }}
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
                const col = lensColor(l.lens)
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
                const col = lensColor(n.lens)
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
                      if (n.route) preloadPath(n.route)
                      // While a card is locked, hovering only wakes the
                      // neuron; the light chip stays suppressed so it never
                      // fights the locked card.
                      if (!lockedId.current) showCard(n, false)
                    }}
                    onMouseLeave={() => {
                      if (lockedId.current === n.id) return
                      setForce(n.id, 0)
                      if (!lockedId.current) hideCard()
                    }}
                    onFocus={(e) => {
                      setForce(n.id, 1)
                      if (!lockedId.current) showCard(n, false)
                      // Keyboard focus brings the node into view; a POINTER
                      // click must NOT scroll, or it slides the node out from
                      // under the freshly-placed card (the "opens at a random
                      // place / lagging" bug). :focus-visible is the keyboard
                      // signal, so the card stays pinned to the dot on click.
                      if (e.currentTarget.matches(':focus-visible')) {
                        e.currentTarget.scrollIntoView({
                          block: 'nearest',
                          inline: 'center',
                          behavior: prm ? 'auto' : 'smooth',
                        })
                      }
                    }}
                    onBlur={() => {
                      if (lockedId.current === n.id) return
                      setForce(n.id, 0)
                      if (!lockedId.current) hideCard()
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
                          {/* live + still growing (Emilie 2026-07-24): a red
                              ring marks a deployed, ongoing project. Red =
                              liveness, the governance law; static so it rests
                              calm under reduced motion. */}
                          {n.live && (
                            <circle
                              cx={n.x}
                              cy={n.y}
                              r={o.r + 3.5}
                              fill="none"
                              stroke="var(--lang-interaction)"
                              strokeWidth={1.3}
                            />
                          )}
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
                      x={n.x + (n.labelDx ?? 0)}
                      y={ly + (n.labelDy ?? 0)}
                      textAnchor="middle"
                      style={{ opacity: TUNE.restInk }}
                    >
                      {n.mapLabel ?? n.title}
                    </text>
                    <text
                      className="nw-yr"
                      x={n.x + (n.labelDx ?? 0)}
                      y={yy + (n.labelDy ?? 0)}
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

        {/* the field card: a light CHIP on hover/focus (title + kind + date),
            an interactive LOCKED card on click (blurb + OPEN). Always
            aria-hidden — screen readers travel via WorldSrNav; the OPEN button
            is a pointer affordance (tabIndex -1), and keyboard opens the node
            directly with Enter. */}
        {card && (
          <aside
            aria-hidden="true"
            className={`nw-fieldcard lang-glass-2 infocard-enter fixed z-[6] rounded-[var(--r-sheet)] ${
              card.locked
                ? 'pointer-events-auto max-w-[300px] px-4 py-3.5'
                : 'pointer-events-none max-w-[264px] px-3.5 py-2.5'
            }`}
            // THE MORPH SOURCE (Emilie 2026-07-26): the CARD travels into
            // the page, not the neuron. It is what the reader is looking at
            // when they press OPEN, it already holds the destination's title,
            // and a 300px panel into a title block is a short honest move
            // where a 6px dot into a full hero would be a smear. Only one
            // card exists at a time, so the one-element-per-name rule holds.
            style={{
              left: card.left,
              top: card.top,
              viewTransitionName: card.route ? vtName(card.route) : undefined,
            }}
          >
            <div className="flex justify-between gap-3 font-mono text-micro tracking-[0.08em] text-[var(--lang-ink-muted)]">
              <span>{card.date}</span>
              <span className={card.red ? 'text-[var(--lang-interaction)]' : 'text-[var(--lang-ink)]'}>
                {card.kind}
              </span>
            </div>
            <p
              className={`mt-1.5 leading-snug font-semibold text-[var(--lang-ink)] ${
                card.locked ? 'text-prose' : 'text-body'
              } ${card.serifTitle ? 'font-serif font-medium lowercase italic' : ''}`}
            >
              {card.title}
            </p>
            {card.locked && card.blurb && (
              <p className="mt-1.5 font-serif text-small leading-relaxed text-[var(--lang-ink-muted)]">
                {card.blurb}
              </p>
            )}
            {card.locked && card.live && (
              <p className="mt-2 flex items-center gap-1.5 font-mono text-micro tracking-[0.1em] text-[var(--lang-interaction)]">
                <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-[var(--lang-interaction)]" />
                LIVE · STILL GROWING
              </p>
            )}
            {card.locked && card.route && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => card.route && navigate(travelTo(card.route), { viewTransition: true })}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-[var(--r-pill)] border border-[var(--lang-hairline)] px-3 py-1.5 font-mono text-micro tracking-[0.1em] text-[var(--lang-ink)] transition-colors hover:border-[var(--lang-interaction)] hover:text-[var(--lang-interaction)]"
              >
                OPEN <span aria-hidden="true">›</span>
              </button>
            )}
          </aside>
        )}

        <WorldSrNav />
      </main>
    </div>
  )
}
