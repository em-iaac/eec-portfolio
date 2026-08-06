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
import ReachControls from '../../components/reach/ReachControls'
import type { ReachSet } from '../../components/reach/verbs'
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
import { PRERENDERING } from '../../lib/prerender'

// The lens accents come from the one source (components/Lens.tsx): these land
// on SVG presentation attributes, so they must be the literal light-dark()
// pair, never a var().
const lensColor = (lens: Lens | undefined) => (lens ? LENSES[lens].accent : 'var(--lang-ink)')

// THE KEY, ONE DEFINITION, TWO PLACEMENTS (2026-08-06). It reads at the top on
// phones and rides the foot band from lg up (Emilie's ruling; the reasoning is
// beside each call site). The marks are drawn 1:1 with the field's own, never
// as glyphs, so the key and the map cannot drift apart.
function KeyMarks() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-micro tracking-[0.08em] text-[var(--lang-ink-muted)] sm:gap-x-4 sm:text-micro sm:tracking-[0.1em]"
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
  )
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

// THE DRAWING IS NOT PRERENDERED (Emilie's ruling 2026-08-02, phone pass; the
// full why is in lib/prerender.ts). thoughts.html was 118.5KB gzipped for this
// SVG alone, and a phone paid for it twice: once as document bytes, then again
// when createRoot threw the prerendered DOM away and rebuilt it. WorldSrNav
// below carries the readable record either way, so the snapshot keeps the page
// and the drawing arrives with the JavaScript that was always going to redraw
// it. Nothing about the loaded page changes.
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
  // THE CARD FOLDING AWAY UNDER A DRAG (Emilie, 2026-08-02). `true` for the one
  // beat between a pan starting and the card finishing its retraction; the node
  // it belongs to STAYS locked and lit throughout, which is the whole point.
  // State, not a ref, because it drives a class.
  const [collapsing, setCollapsing] = useState(false)
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
      // The arrival position is chosen, so the year snap must not adjust it.
      stage.classList.add('is-free')
      window.setTimeout(() => stage.classList.remove('is-free'), 700)
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
        // LAND ON TODAY (Emilie's pick 2026-08-02). A first arrival used to
        // start at 35% of the track, which is a number, not a place: a stranger
        // was dropped into the middle of a timeline with no way of knowing
        // which way was forward. The live tip is where the record currently
        // is, so the map opens on the present and reads backwards, the way a
        // record is read. Returning from a note still restores where you were.
        stage.scrollLeft =
          Number.isFinite(stored) && stored > 0
            ? stored
            : Math.max(0, WORLD.skeleton.nowAt.x * scale - stage.clientWidth / 2)
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
    // A TAP ON EMPTY FIELD CLOSES THE CARD. A DRAG DOES NOT (Emilie,
    // 2026-08-02: "when I press I see the connections form but some are out of
    // the screen, and when I swipe to go there it retracts").
    //
    // `dismiss()` used to run on POINTERDOWN, before the gesture had told
    // anyone what it was. With a mouse that is invisible: you click empty space
    // to dismiss, and panning is a separate deliberate act. On a phone, panning
    // IS a press on empty field, so the very gesture for going to look at a
    // connection was the gesture that threw it away. The world could show you a
    // thread to something off screen and then refuse to let you follow it.
    // So the decision waits for pointerUP and only fires if the finger stayed
    // put. Same tap-versus-drag rule as the landing belts (useBeltDrift).
    // THE MAP STICKS TO THE FINGER (Emilie, 2026-08-02, asking to maximise the
    // phone experience). The stage is `overflow-x: auto` with
    // `touch-action: pan-x pan-y`, so the BROWSER already pans it on touch, and
    // this handler was panning it a second time by the same delta. Measured: a
    // 120px swipe moved the world 144px, so the map slid out from under the
    // thumb and a flick's momentum fought the script the whole way.
    // A mouse gets nothing from the browser here and still needs this. Touch
    // needs only the tap-versus-drag bookkeeping, which is why `moved` is
    // tracked for every pointer type while only a mouse drives the scroll.
    let moved = 0
    let scrolls = false
    const down = (e: PointerEvent) => {
      if ((e.target as Element).closest('.nw-node, a, button')) return
      moved = 0
      scrolls = e.pointerType === 'mouse'
      drag = { x: e.clientX, s: stage.scrollLeft }
      if (scrolls) stage.classList.add('dragging')
    }
    const move = (e: PointerEvent) => {
      if (!drag) return
      const dx = e.clientX - drag.x
      const wasStill = moved <= 4
      moved = Math.max(moved, Math.abs(dx))
      // The moment a press becomes a pan, the card folds back into its mark
      // (her ask, same day). The LOCK is untouched, so the node stays awake and
      // its threads stay drawn while you travel along them. Fired once, on the
      // crossing, not on every move event.
      if (wasStill && moved > 4) collapseCard()
      if (scrolls) stage.scrollLeft = drag.s - dx
    }
    const up = () => {
      // 4px, the same slop the belts use to tell a tap from a drag.
      if (drag && moved <= 4) dismiss()
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

  // FOLD THE CARD AWAY, KEEP THE NODE (Emilie, 2026-08-02). Distinct from
  // dismiss() below, and the distinction is the feature: dismiss RELEASES the
  // locked node, this only puts its card away. A pan calls this, so the thread
  // you are following stays lit while the panel stops covering it.
  // Idempotent: a second call mid-retraction is ignored, so a long drag folds
  // the card once rather than restarting the animation every frame.
  const collapseTimer = useRef(0)
  function collapseCard() {
    if (!lockedId.current || collapsing) return
    setCollapsing(true)
    window.clearTimeout(collapseTimer.current)
    // Matches .infocard-exit in index.css. A timer rather than animationend
    // because the element is aria-hidden decoration and a missed event would
    // strand it half-folded.
    collapseTimer.current = window.setTimeout(() => {
      setCard(null)
      setCollapsing(false)
    }, 170)
  }
  useEffect(() => () => window.clearTimeout(collapseTimer.current), [])

  // THE WORLD BRINGS WHAT YOU TAPPED INTO VIEW (Emilie's pick 2026-08-02).
  // A mark near a side edge had most of its threads off screen, and following
  // one meant panning, which is exactly when the card used to vanish. Sliding
  // the tapped mark to the middle means its connections are always reachable in
  // both directions. Reduced motion jumps instead of gliding, and a mark that
  // is already near enough to the middle is left alone: re-centring by 12px is
  // a twitch, not a movement.
  // WHERE THE SNAP POINTS GO, IN CSS PIXELS (2026-08-04). The year rules are
  // SVG inside one <svg>, and an SVG element cannot carry `scroll-snap-align`,
  // so the browser needs seven ordinary elements to snap to. They are absolutely
  // positioned inside the stage, which scrolls them with the content, and that
  // means their offsets have to be REAL PIXELS: a percentage would resolve
  // against the stage's 390px padding box, not against the 5355px of world
  // inside it. The scale comes from the SVG's own rendered width, so a rotation,
  // a resize or a browser zoom simply re-measures — the same reading
  // scrollToWorldX takes, one axis over.
  const [snapAt, setSnapAt] = useState<number[]>([])
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const measure = () => {
      const w = svg.getBoundingClientRect().width
      if (!w) return
      // WORLD.skeleton, not the `sk` alias: that const is declared further down
      // this component, so reading it from a memo or an effect body that runs
      // during the same render is a temporal dead zone error. It cost one blank
      // page to find, and tsc does not catch it.
      setSnapAt(WORLD.skeleton.years.map((y) => (y.x / WORLD.w) * w))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(svg)
    return () => ro.disconnect()
  }, [])

  // WHICH YEAR AM I IN (Emilie's ruling 2026-08-04: a place drawer reads out its
  // position, live, "whether you got there by flick, drag or drawer").
  //
  // The map has no sections to observe, so there is nothing for an
  // IntersectionObserver to watch the way /cv's headings can be watched. But the
  // snap markers ARE the year positions in the same coordinate space the stage
  // scrolls in, already measured, so the reading is one comparison: the year you
  // are in is the last rule at or before the left edge of the screen — exactly
  // where the snap puts it, so the readout and the snapping agree by
  // construction rather than by two separate guesses.
  // Everything past the last rule keeps reading 2026, which is true: that
  // stretch IS 2026 and after.
  const [atYear, setAtYear] = useState<string | null>(null)
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || snapAt.length === 0) return
    const pick = () => {
      // +8px so a year sitting exactly on the edge reads as arrived, not as the
      // one before it.
      const x = stage.scrollLeft + 8
      let cur = WORLD.skeleton.years[0]?.label ?? null
      for (let i = 0; i < snapAt.length; i++) {
        if (snapAt[i]! <= x) cur = WORLD.skeleton.years[i]?.label ?? cur
      }
      setAtYear(cur)
    }
    pick()
    // Coalesced to one read per frame: this fires on every pixel of a drag on a
    // 5355px track, and the answer cannot change faster than the screen redraws.
    let queued = false
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        queued = false
        pick()
      })
    }
    stage.addEventListener('scroll', onScroll, { passive: true })
    return () => stage.removeEventListener('scroll', onScroll)
  }, [snapAt])

  const HORIZON_PX = 90
  // SNAPPING STANDS ASIDE FOR A DELIBERATE MOVE (2026-08-04, with the year
  // snap). Every call below has already chosen an exact position for a reason —
  // a deep link centres its node, TODAY lands on the live tip, and `centreOn`
  // even declines to move a mark that is close enough. Proximity snapping would
  // pull each of those to the nearest year rule a moment later and quietly undo
  // the judgement. The class is cleared on a timer rather than `scrollend`,
  // which Safari did not have until recently and which never fires at all when
  // the requested position is where we already are.
  const freeTimer = useRef(0)
  function freeSnap() {
    const stage = stageRef.current
    if (!stage) return
    stage.classList.add('is-free')
    window.clearTimeout(freeTimer.current)
    freeTimer.current = window.setTimeout(() => stage.classList.remove('is-free'), 700)
  }

  /**
   * `smooth` accepts `'always'` for a move the visitor ASKED for by name
   * (Emilie's ruling 2026-08-04, from the deployed site: "if i stand at 2023 and
   * press 2026 it jumps there instead of sliding through, like from 2023 to
   * 2024, idk why there is this inconsistency").
   *
   * She had found a real seam. The two-screen cut below was written for TAPPING
   * A NODE, where you can already see the thing you tapped and a long ride is
   * just a wait. A drawer press is the opposite gesture: you named a year you
   * cannot see, and the ride between is the only thing that tells you how far
   * apart the years actually are. Measured, that is what made it inconsistent:
   * 2023 → 2024 is 472px and glided, 2023 → 2026 is 1792px and cut, with the
   * threshold at two screens (780px) sitting invisibly between them.
   *
   * Uncapped, at her ruling. The longest possible ride, 2020 → 2026, is 2547px.
   */
  function scrollToWorldX(worldX: number, smooth: boolean | 'always' = true) {
    const stage = stageRef.current
    const svg = svgRef.current
    if (!stage || !svg) return
    freeSnap()
    const scale = svg.getBoundingClientRect().height / WORLD.h || 1
    const target = worldX * scale - stage.clientWidth / 2
    const max = stage.scrollWidth - stage.clientWidth
    const left = Math.max(0, Math.min(max, target))
    const distance = Math.abs(left - stage.scrollLeft)
    if (distance < 8) return
    // A GLIDE ONLY WHERE A GLIDE MEANS SOMETHING. Smooth scrolling a track this
    // wide is a several-second ride: measured, a tap on the far end of the
    // record asked for a 4900px journey, which is not a transition, it is a
    // wait. Under two screens the movement shows you the relationship between
    // where you were and where you are; beyond that it only shows you a blur,
    // so it cuts.
    const glide = smooth === 'always' ? !prm : smooth && !prm && distance < stage.clientWidth * 2
    stage.scrollTo({ left, behavior: glide ? 'smooth' : 'auto' })
  }
  // The years, as the room's verbs. Derived from the same `sk.years` the map
  // draws, so a year can never appear in the drawer that is not on the map.
  const yearsSet: ReachSet = useMemo(
    () => ({
      label: 'Jump to a year',
      handle: 'years',
      // THE ONE ROOM THAT TAKES THE DRAWER TO THE DESKTOP (Emilie, 2026-08-06:
      // "add the feature of the drawer of snapping to years to the desktop
      // version for ease of movement"). The map is 5,355px of stage and no
      // width shows more than a fraction of it, so the seven years are the only
      // complete index of this room and a pointer needs them as much as a thumb.
      wide: true,
      // A PLACE DRAWER: the tab reads the year you are standing in, so on a map
      // 13.7 screens wide you can always tell where you are without opening
      // anything. That is the readout doing the most work it does anywhere on
      // the site — the CV at least has its headings on screen.
      at: atYear ?? undefined,
      // WORLD.skeleton for the same temporal-dead-zone reason as the snap
      // markers above: this memo body runs during the render that declares `sk`.
      verbs: WORLD.skeleton.years.map((y) => ({
        id: y.label,
        label: y.label,
        // The open list lights the same year the closed tab reads, from the one
        // value, so the two can never disagree.
        active: y.label === atYear,
        // 'always': a year named in the drawer always SLIDES, however far, so
        // the drawer behaves one way. See scrollToWorldX for why a tap on a node
        // keeps the two-screen cut and this does not.
        onPress: () => scrollToWorldX(y.x, 'always'),
      })),
    }),
    // scrollToWorldX reads live refs; only the readout changes per render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [atYear],
  )

  function centreOn(id: string) {
    const stage = stageRef.current
    const h = nodesRef.current.get(id)
    if (!stage || !h) return
    const x = h.soma?.getBoundingClientRect().left ?? 0
    // Already comfortably inside the frame: leave it where it is.
    if (x > HORIZON_PX && x < stage.clientWidth - HORIZON_PX) return
    scrollToWorldX(h.x)
  }

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
    // A close during a fold must win outright, or the pending timer would
    // clear a card that has already been replaced by a newly tapped one.
    window.clearTimeout(collapseTimer.current)
    setCollapsing(false)
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
    centreOn(n.id)
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
      {/* ON THE HEADER LINE FROM lg UP, and nowhere near it below (Emilie,
          2026-08-02: "we need to find a better placement for the WATCH IT GROW
          and spacing and size"). Measured at 390: the button was 149x32 with
          its top edge at 70px, which is the pill's bottom edge exactly, so it
          touched the chrome above it AND missed the 44px touch floor by 12px.
          Below lg it moves to the corner (further down), as a round 44px
          control. The header line keeps it where there is room for words. */}
      <TitleBlock
        toolsKey="world"
        tools={
          !prm ? (
            <button
              type="button"
              onClick={engine.replay}
              className="hidden min-h-11 items-center rounded-[var(--r-pill)] border border-[var(--lang-hairline)] px-3 font-mono text-label tracking-[0.1em] text-[var(--lang-ink)] hover:border-[var(--lang-interaction)] hover:text-[var(--lang-interaction)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)] lg:inline-flex"
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
        {/* THE KEY READS AT THE TOP, THE CONTROLS SIT IN THE THUMB (Emilie's
            ruling 2026-08-02, board option C, from her own question: "what
            about the legend at the top below the header and the control below
            as a band?"). They were one band at the foot doing two unrelated
            jobs. Split, each goes where its job belongs: a key is reference you
            glance at, so it sits at the top where the eye starts, and the
            controls are the one thing you TOUCH, so they sit at the bottom,
            which is the only part of a phone a thumb reaches without
            re-gripping. It also gives the world a line above and a line below,
            which is the header-line/footer-line frame the rest of the site
            already wears.
            pointer-events-none on both wrappers so a drag passes through to the
            stage; only the button re-enables its own. */}
        {/* top-[5.5rem] = 88px, an 18px breath under the pill's 70px bottom
            edge (Emilie, 2026-08-02: "the legend at the top doesn't have a gap
            between it and the header"). At 4.25rem it began at 68px and
            actually overlapped the pill by 2px.
            AND IT IS NOT A PILL (her call, same message: "maybe the legend
            doesn't need to be inside a pill for a cleaner look"). She is right,
            and it is safe here in a way it would not have been at the foot: the
            world is inset to start BELOW this band, so nothing passes behind
            these marks and there is nothing for glass to lift them off. A key
            is not chrome, it is a caption; bare on the ground is what a caption
            looks like. The control band at the foot keeps its pill, because
            that one IS chrome and the world does run under it. */}
        {/* THE KEY IS PHONE-ONLY UP HERE NOW (Emilie, 2026-08-06: "the legend
            has to go back to the footing", for the desktop version only).
            Her 2026-08-02 ruling that split the one foot band in two stands
            exactly where its argument was true: on a phone the key is reference
            and the controls are what a thumb reaches, so they belong at opposite
            ends. On a desktop there is no thumb and no reach problem, the foot
            band has a whole empty middle, and the key riding up here costs the
            world 26px of height for nothing. So the split is now what it always
            should have been: a phone rule, not a site rule. */}
        <div className="pointer-events-none fixed inset-x-0 top-[5.5rem] z-[3] px-5 sm:px-8 lg:hidden">
          <div className="mx-auto flex max-w-[1856px] flex-wrap items-center justify-center gap-x-6 gap-y-1 px-1">
            <KeyMarks />
          </div>
        </div>

        {/* THE CONTROL BAND. WATCH IT GROW on the left, the drag hint on the
            right, one line at the foot. The button is a real labelled control
            here rather than the cornered glyph of the previous build: down here
            there is a whole row for it, so it can say what it does. */}
        <div className="pointer-events-none fixed inset-x-0 bottom-2 z-[3] px-5 sm:px-8">
          <div className="lang-glass-1 mx-auto flex max-w-[1856px] flex-wrap items-center justify-between gap-x-6 gap-y-1 rounded-[var(--r-card)] px-5 py-1.5 sm:px-7">
            <span className="flex items-center gap-x-4">
              {!prm && (
                <button
                  type="button"
                  onClick={engine.replay}
                  className="pointer-events-auto inline-flex min-h-11 items-center gap-1.5 font-mono text-micro tracking-[0.12em] text-[var(--lang-ink)] transition-colors hover:text-[var(--lang-interaction)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)] lg:hidden"
                >
                  <span aria-hidden="true">⟳</span> WATCH IT GROW
                </button>
              )}
              {/* THE WAY BACK TO TODAY (Emilie's pick 2026-08-02). The map opens
                  on the present now, but it is a wide thing to pan and there was
                  no way home once you had travelled: you could get lost in 2022
                  and only find your way out by dragging. One tap returns to the
                  live tip. It reads TODAY rather than NOW because NOW is already
                  the name of the mark it travels to, and a control should not
                  share a name with its destination. */}
              <button
                type="button"
                onClick={() => scrollToWorldX(WORLD.skeleton.nowAt.x)}
                className="pointer-events-auto inline-flex min-h-11 items-center gap-1.5 font-mono text-micro tracking-[0.12em] text-[var(--lang-ink-muted)] transition-colors hover:text-[var(--lang-interaction)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
              >
                <span aria-hidden="true">→</span> TODAY
              </button>
            </span>
            {/* THE HINT IS DESKTOP-ONLY NOW (Emilie's ruling 2026-08-04). The
                second clause already waited for sm, because "IT WAKES WHERE YOU
                LOOK" describes a POINTER, which is the one thing a phone does
                not have. What is left below sm is "DRAG TO EXPLORE" — and on a
                map, dragging is the only thing there is to do. It was telling a
                visitor the one thing they were already doing, in 9px, at the
                very bottom edge of the screen, next to a drawer that now names
                seven years. Gone below sm; unchanged from sm up, where the full
                sentence is true and the room to say it exists. */}
            {/* THE KEY RIDES THE MIDDLE OF THIS BAND FROM lg UP (Emilie,
                2026-08-06). The band already had a left end and a right end and
                nothing between them; the key is exactly the width of that gap.
                It is a caption rather than a control, so it stays aria-hidden
                and takes no pointer events, and the band's `justify-between`
                does the placing with no new geometry. */}
            <div className="hidden lg:block">
              <KeyMarks />
            </div>
            <p
              aria-hidden="true"
              className="hidden font-mono text-micro tracking-[0.12em] text-[var(--lang-ink-muted)] sm:block"
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

        {/* THE MAP'S OWN DRAWER (Emilie's ruling 2026-08-04: the drawer becomes
            a real per-room system, "the thoughts page when you open them and
            such things"). This room's verbs are its YEARS — the same seven the
            map already draws, 2020 to 2026 — so the drawer is the deliberate way
            to a year and the snap is the casual one. They use the same
            `scrollToWorldX` the tap-to-centre has always used, so a jump from
            the drawer and a jump from a node behave identically.
            WATCH IT GROW and TODAY STAY AT THE FOOT (her ruling, same message).
            They are not ways of getting somewhere, they are things you do to the
            map, and the foot row is what makes this the one room that already
            reads one-handed. Two systems, two jobs. */}
        <ReachControls set={yearsSet} />

        {/* the stage: full-bleed, drag/wheel/keyboard panning */}
        <section
          ref={stageRef}
          tabIndex={0}
          className="nw-stage z-0 bg-[var(--lang-ground)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
          aria-label="The whole mind as one neural world: every project, thought, milestone and award in time. It wakes near your pointer; drag sideways to explore."
        >
          {/* The seven things a flick can settle on (index.css, .nw-snap).
              Zero-width, 1px tall, pointer-events: none — they exist only so the
              browser's own snapping has somewhere to land, and they sit at the
              same fractions of the world's width as the drawn year rules. */}
          {snapAt.map((x, i) => (
            <div key={i} className="nw-snap" style={{ left: `${x}px` }} aria-hidden="true" />
          ))}
          <svg ref={svgRef} viewBox={`0 0 ${WORLD.w} ${WORLD.h}`} preserveAspectRatio="xMidYMid meet">
            {PRERENDERING ? null : <>
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
            </>}
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
            className={`nw-fieldcard lang-glass-2 fixed z-[6] rounded-[var(--r-sheet)] ${
              collapsing ? 'infocard-exit' : 'infocard-enter'
            } ${
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
            <div className="flex items-start justify-between gap-3 font-mono text-micro tracking-[0.08em] text-[var(--lang-ink-muted)]">
              <span className="flex min-w-0 flex-wrap items-center gap-x-2">
                <span>{card.date}</span>
                <span className={card.red ? 'text-[var(--lang-interaction)]' : 'text-[var(--lang-ink)]'}>
                  {card.kind}
                </span>
              </span>
              {/* A WAY OUT THAT IS NOT A GUESS (Emilie, 2026-08-02: "I want to
                  have an x button on the thought card in case I want to close
                  it"). Until now the ways to close were tapping the same node
                  again, tapping empty field, or Escape, and a phone visitor is
                  told none of them. The date and kind moved onto one line to
                  make room; the glyph is small but its hit box is the 44px
                  `after:` extender the footline and the pill links use, so the
                  target is full size while the card stays a chip.
                  tabIndex -1 like the OPEN button beside it: this whole aside is
                  aria-hidden decoration and the keyboard travels via
                  WorldSrNav, where Escape already closes. */}
              {card.locked && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={dismiss}
                  className="relative -mt-0.5 shrink-0 text-body leading-none text-[var(--lang-ink-muted)] transition-colors after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] hover:text-[var(--lang-ink)]"
                >
                  {/* ✕ (U+2715), not × (U+00D7). This was the odd one out: the
                      showcase sheet and the lightbox have both always used
                      ✕, and the multiplication sign is a lighter, shorter mark
                      that reads as a different control at the same size. One
                      close glyph across all three overlays (2026-08-03). */}
                  <span aria-hidden="true">✕</span>
                </button>
              )}
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
