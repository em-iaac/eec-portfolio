// THE PROXIMITY ENGINE (the meta build; gate 1 signed 2026-07-11).
// "A simple way to show complexity": at rest the world is quiet points in
// time; neurons NEAR the pointer wake (their dendrites draw out, their
// correlations build to the synapse and fire once), and settle again as
// attention leaves. Emilie's signed feel: RADIUS 180 · BUILD 1400ms ·
// DECAY 3000ms · REST INK 55% · REACH OUT semantics (a waking neuron's
// threads build all the way to their far ends; the far label brightens and
// names the correlation).
//
// Mechanics (pressure-tested): ONE rAF loop; per-node + per-connection
// energies integrated toward their targets; the pointer is sampled IN the
// loop (drag/wheel move the world under a still pointer); canvas mapping
// from a cached stage rect + scale (no per-frame getScreenCTM); writes are
// delta-quantized stroke-dashoffset / opacity only (paint-only properties);
// dt is clamped; the loop self-suspends when everything is settled and no
// input arrives, and pauses with the tab. Reduced motion: the engine never
// starts; the component renders the fully-grown still.
import { useEffect, useRef, type RefObject } from 'react'

export const TUNE = {
  radius: 180, // canvas units (viewBox space)
  build: 1400, // ms from 0 to fully grown under full attention
  decay: 3000, // ms from grown back to rest
  // Label ink at rest. Emilie's dial said 55%, which holds AA on the dark
  // ground (5.4:1) but lands 3.9:1 on light; the a11y floor is binding, so
  // rest ink is 62% (4.9:1 light / 6.4:1 dark). Flagged in the sign-offs.
  restInk: 0.62,
} as const

export interface NodeHandle {
  id: string
  kind: 'project' | 'thought' | 'award' | 'milestone'
  x: number
  y: number
  el: SVGGElement
  /** the dimmable body (dendrites + glow + soma); labels stay OUTSIDE it so
   *  the wake dim never multiplies into the rest ink (AA floor) */
  body: SVGGElement | null
  soma: SVGGraphicsElement | null
  fibres: SVGPathElement[]
  lbl: SVGTextElement | null
  yr: SVGTextElement | null
  glow: SVGCircleElement | null
  E: number
  shown: number // last written ink energy (E or a connection floor)
  appliedE: number
  appliedShow: number
  forceT: number // 1 while hovered / focused / armed
}

export interface ConnHandle {
  a: string
  b: string
  paths: SVGPathElement[]
  syn: SVGCircleElement
  pulse: SVGPathElement
  E: number
  applied: number
  fired: number
}

export interface EngineApi {
  /** Wake the loop after any input (focus, hover, scroll, replay). */
  kick: () => void
  /** Chronological WATCH IT GROW sweep; settles back to rest after. */
  replay: () => void
}

const ease = (e: number) => e * e * (3 - 2 * e) // smoothstep

export function useProximityEngine(opts: {
  stageRef: RefObject<HTMLDivElement | null>
  svgRef: RefObject<SVGSVGElement | null>
  nodesRef: RefObject<Map<string, NodeHandle>>
  connsRef: RefObject<Map<string, ConnHandle>>
  plumbLineRef: RefObject<SVGLineElement | null>
  plumbDotRef: RefObject<SVGCircleElement | null>
  worldH: number
  mainY: number
  ranks: ReadonlyArray<{ id: string; rank: number }>
  prm: boolean
}): EngineApi {
  const { stageRef, svgRef, nodesRef, connsRef, plumbLineRef, plumbDotRef, worldH, mainY, ranks, prm } = opts

  const api = useRef<EngineApi>({ kick: () => {}, replay: () => {} })

  useEffect(() => {
    const stage = stageRef.current
    const svg = svgRef.current
    if (!stage || !svg) return
    const nodes = nodesRef.current
    const conns = connsRef.current

    const applyGrown = () => {
      nodes.forEach((n) => {
        n.fibres.forEach((p) => (p.style.strokeDashoffset = '0'))
        if (n.lbl) n.lbl.style.opacity = '1'
        if (n.yr) n.yr.style.opacity = '1'
        if (n.glow) n.glow.style.opacity = '1'
        if (n.body) n.body.style.opacity = '1'
      })
      conns.forEach((c) => {
        c.paths.forEach((p) => (p.style.strokeDashoffset = '0'))
        c.syn.style.opacity = '1'
        c.syn.style.transform = 'scale(1)'
      })
    }

    if (prm) {
      // The honest still: the fully-grown, connected, labelled map. No loop,
      // no pulses, no listeners — and the api goes inert so a hover's kick()
      // can never resurrect a previous engine's loop under reduced motion.
      applyGrown()
      api.current = { kick: () => {}, replay: () => {} }
      return
    }

    // ---- cached geometry (updated on resize; scrollLeft read per frame) ----
    let stageLeft = 0
    let stageTop = 0
    let scale = 1
    const measure = () => {
      const r = stage.getBoundingClientRect()
      stageLeft = r.left
      stageTop = r.top
      scale = svg.getBoundingClientRect().height / worldH || 1
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage)

    // ---- input ----
    let pointer: { cx: number; cy: number } | null = null
    let running = false
    let rafId = 0
    let lastT = 0

    type Replay = { t0: number; until: number; delay: Map<string, number> } | null
    let replayState: Replay = null

    const canvasPoint = (): { x: number; y: number } | null => {
      if (!pointer) return null
      return {
        x: (pointer.cx - stageLeft + stage.scrollLeft) / scale,
        y: (pointer.cy - stageTop) / scale,
      }
    }

    // ---- writes (delta-quantized) ----
    const q = (v: number) => Math.round(v * 255)

    const applyFibres = (n: NodeHandle) => {
      const qe = q(n.E)
      if (qe === n.appliedE) return
      n.appliedE = qe
      const off = (1 - ease(n.E)).toFixed(4)
      for (const p of n.fibres) p.style.strokeDashoffset = off
      if (n.glow) n.glow.style.opacity = ease(n.E).toFixed(3)
      // the body dim rides the same rest constant as the ink, so somas and
      // labels wake in lockstep (labels live outside the body: no multiply)
      if (n.body && n.kind !== 'milestone')
        n.body.style.opacity = (TUNE.restInk + (1 - TUNE.restInk) * ease(n.E)).toFixed(3)
    }

    const applyInk = (n: NodeHandle) => {
      const qs = q(n.shown)
      if (qs === n.appliedShow) return
      n.appliedShow = qs
      const rest = TUNE.restInk
      const e = ease(n.shown)
      if (n.lbl) n.lbl.style.opacity = (rest + (1 - rest) * e).toFixed(3)
      if (n.yr) n.yr.style.opacity = (rest * 0.8 + (1 - rest * 0.8) * e).toFixed(3)
    }

    const applyConn = (c: ConnHandle) => {
      const qe = q(c.E)
      if (qe === c.applied) return
      c.applied = qe
      const e = ease(c.E)
      const off = (1 - e).toFixed(4)
      for (const p of c.paths) p.style.strokeDashoffset = off
      const syn = c.E > 0.82 ? (c.E - 0.82) / 0.18 : 0
      c.syn.style.opacity = syn.toFixed(3)
      c.syn.style.transform = `scale(${(0.4 + 0.6 * syn).toFixed(3)})`
    }

    const fireMaybe = (c: ConnHandle, now: number) => {
      if (c.E > 0.985 && now - c.fired > 2600) {
        c.fired = now
        c.pulse.classList.remove('firing')
        void c.pulse.getBoundingClientRect()
        c.pulse.classList.add('firing')
      }
    }

    const moveToward = (E: number, t: number, dt: number) =>
      t > E ? Math.min(t, E + dt / TUNE.build) : Math.max(t, E - dt / TUNE.decay)

    // ---- the loop ----
    const tick = (now: number) => {
      const dt = Math.min(50, now - (lastT || now))
      lastT = now

      const p = canvasPoint()
      const R = TUNE.radius
      const edge = R * 0.45
      let hot: NodeHandle | null = null
      let hotE = 0
      let settled = true

      nodes.forEach((n) => {
        let t = 0
        if (p) {
          const dx = n.x - p.x
          const dy = n.y - p.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d <= R) t = Math.min(1, (R - d) / edge)
        }
        if (replayState) {
          const at = replayState.delay.get(n.id)
          if (at != null && now - replayState.t0 > at) t = 1
        }
        if (n.forceT > t) t = n.forceT
        if (n.E !== t) settled = false
        n.E = moveToward(n.E, t, dt)
        n.shown = n.E
        applyFibres(n)
        if (n.E > hotE && n.kind !== 'milestone') {
          hotE = n.E
          hot = n
        }
      })

      conns.forEach((c) => {
        const na = nodes.get(c.a)
        const nb = nodes.get(c.b)
        if (!na || !nb) return
        // REACH OUT (gate 1): the connection follows its MOST awake end all
        // the way, so a waking neuron names its far correlations.
        const t = Math.max(na.E, nb.E)
        if (c.E !== t) settled = false
        c.E = moveToward(c.E, t, dt)
        applyConn(c)
        fireMaybe(c, now)
        // the far end's ink brightens as the thread arrives
        const floor = ease(c.E) * 0.8
        if (floor > na.shown) na.shown = floor
        if (floor > nb.shown) nb.shown = floor
      })

      nodes.forEach(applyInk)

      // the plumb line follows the hottest waking piece of the mind
      const line = plumbLineRef.current
      const dot = plumbDotRef.current
      if (line && dot) {
        if (hot !== null && hotE > 0.55) {
          const h: NodeHandle = hot
          line.setAttribute('x1', String(h.x))
          line.setAttribute('y1', String(h.y + 14))
          line.setAttribute('x2', String(h.x))
          line.setAttribute('y2', String(mainY - 6))
          line.style.opacity = (hotE * 0.45).toFixed(3)
          dot.setAttribute('cx', String(h.x))
          dot.setAttribute('cy', String(mainY))
          dot.style.opacity = hotE.toFixed(3)
        } else {
          line.style.opacity = '0'
          dot.style.opacity = '0'
        }
      }

      if (replayState && now - replayState.t0 > replayState.until) replayState = null

      // self-suspend: nothing moving, nothing forcing, no attention parked on
      // a not-yet-settled field.
      if (settled && !replayState) {
        running = false
        return
      }
      rafId = requestAnimationFrame(tick)
    }

    const kick = () => {
      if (running || document.hidden) return
      running = true
      lastT = 0
      rafId = requestAnimationFrame(tick)
    }

    // ---- listeners ----
    const onMove = (e: PointerEvent) => {
      pointer = { cx: e.clientX, cy: e.clientY }
      kick()
    }
    const onDown = (e: PointerEvent) => {
      pointer = { cx: e.clientX, cy: e.clientY }
      kick()
    }
    const onLeave = (e: PointerEvent) => {
      // A lifted finger fires pointerleave too, but the signed touch model
      // PARKS attention where you tapped until the next touch; only a real
      // cursor leaving the page clears the point.
      if (e.pointerType === 'touch') return
      pointer = null
      kick()
    }
    const onScroll = () => kick()
    const onVis = () => {
      if (document.hidden) {
        if (running) {
          cancelAnimationFrame(rafId)
          running = false
        }
      } else kick()
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    document.documentElement.addEventListener('pointerleave', onLeave)
    stage.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVis)

    // ---- replay: WATCH IT GROW (signed, gate 6) ----
    let panRaf = 0
    const autopan = (dur: number) => {
      cancelAnimationFrame(panRaf)
      const max = stage.scrollWidth - stage.clientWidth
      if (max <= 0) return
      const t0 = performance.now()
      stage.scrollLeft = 0
      let stopped = false
      // any real input takes the wheel back: pointer, wheel, or keyboard
      const stop = () => {
        stopped = true
        stage.removeEventListener('pointerdown', stop)
        stage.removeEventListener('wheel', stop)
        window.removeEventListener('keydown', stop)
      }
      stage.addEventListener('pointerdown', stop)
      stage.addEventListener('wheel', stop)
      window.addEventListener('keydown', stop)
      const step = (now: number) => {
        if (stopped) return
        const k = Math.min(1, (now - t0) / dur)
        stage.scrollLeft = max * (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2)
        if (k < 1) panRaf = requestAnimationFrame(step)
        else stop()
      }
      panRaf = requestAnimationFrame(step)
    }

    const replay = () => {
      const delay = new Map<string, number>()
      ranks.forEach((r) => delay.set(r.id, r.rank * 130))
      const total = ranks.length * 130
      replayState = { t0: performance.now(), until: total + 2200, delay }
      autopan(total + 800)
      kick()
    }

    api.current = { kick, replay }
    kick() // settle the initial writes (labels to rest ink)

    return () => {
      cancelAnimationFrame(rafId)
      cancelAnimationFrame(panRaf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      stage.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVis)
    }
    // ranks derives from the frozen world; prm is the one live dependency.
  }, [prm]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    kick: () => api.current.kick(),
    replay: () => api.current.replay(),
  }
}
