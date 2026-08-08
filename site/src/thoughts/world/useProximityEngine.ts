// THE PROXIMITY ENGINE (the meta build; gate 1 signed 2026-07-11).
// "A simple way to show complexity": at rest the world is quiet points in
// time; neurons NEAR the pointer wake (their dendrites draw out, their
// correlations build to the synapse and fire once), and settle again as
// attention leaves. Emilie's signed feel: RADIUS 180 · BUILD 1400ms ·
// DECAY 3000ms · REST INK 62% · REACH OUT semantics (a waking neuron's
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
  // rest ink is 62% (4.9:1 light / 6.4:1 dark). SIGNED by Emilie (G4,
  // 2026-07-12); the date labels ride the same rest since G4.
  restInk: 0.62,
} as const

export interface NodeHandle {
  id: string
  kind: 'project' | 'thought' | 'award' | 'milestone'
  x: number
  y: number
  el: SVGGElement
  /** the dimmable body (glow + soma + reaches); labels stay OUTSIDE it so
   *  the wake dim never multiplies into the rest ink (AA floor) */
  body: SVGGElement | null
  soma: SVGGraphicsElement | null
  /** THE ARMS TOWARD WHAT THIS ONE IS ALMOST JOINED TO. They FADE IN rather
   *  than draw themselves, and that is the whole distinction: a thread draws
   *  because something made it, over time; nothing made these, so nothing can
   *  be shown making them. It is also what buys the dashes — the drawing
   *  mechanic is stroke-dasharray, so a path cannot both grow and be dashed. */
  reaches: SVGPathElement[]
  /** The near-miss arms, grouped by the mark each one is reaching AT.
   *  ⚠ A REACH HAS TWO ARMS AND THEY BELONG TO DIFFERENT NODES (her flag
   *  2026-08-07: "if we isolate sensi you can see neurospace near miss wake up,
   *  but in the held state nothing in neurospace wakes"). Driving each arm from
   *  its OWN node's wake meant holding Sensi lit Sensi's half and left
   *  Neurospace's half dark — half a gesture, and the half that is missing is
   *  the one that says what the reach is aimed at.
   *  Threads have followed their most awake END since the map was built; this
   *  is the same rule, finally applied to the other kind of connection. */
  arms: { to: string; paths: SVGPathElement[]; applied: number }[]
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
  /** Chronological WATCH IT GROW sweep; settles back to rest after.
   *  Called bare it is the BUTTON's sweep, unchanged. The options exist for the
   *  ARRIVAL sweep (Emilie 2026-08-07), which has to be the same gesture told
   *  more quietly: you asked for the button, you did not ask for the door. */
  replay: (opts?: ReplayOpts) => void
}

export interface ReplayOpts {
  /** ms between one chronological rank and the next. Lower = quicker sweep. */
  step?: number
  /** How awake a node gets as the wave passes it. 1 is the button's full wake. */
  peak?: number
  /** ms a node takes to fall back after the wave has passed. 0 keeps it lit
   *  until the whole sweep ends, which is the button's behaviour: by the last
   *  rank the ENTIRE map is at full wake. A decay makes it a travelling pulse
   *  instead of a rising flood, which is the whole difference between a thing
   *  you asked for and a thing that happened to you. */
  decay?: number
  /** Where the pan comes to rest, in stage scroll px. Defaults to the far end. */
  to?: number
  /** The map is turned: the sweep climbs the Y axis instead of crossing X.
   *  It starts at the BOTTOM, which is the oldest end, and finishes at the top,
   *  which is now — the same journey the horizontal sweep makes, in the
   *  direction this screen actually reads. */
  vertical?: boolean
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
  /** false while a neuron is HELD: the pointer stops proposing others. */
  ambientRef: RefObject<boolean>
  prm: boolean
}): EngineApi {
  const { stageRef, svgRef, nodesRef, connsRef, plumbLineRef, plumbDotRef, worldH, mainY, ranks, ambientRef, prm } = opts

  const api = useRef<EngineApi>({ kick: () => {}, replay: () => {} })

  useEffect(() => {
    const stage = stageRef.current
    const svg = svgRef.current
    if (!stage || !svg) return
    const nodes = nodesRef.current
    const conns = connsRef.current

    const applyGrown = () => {
      nodes.forEach((n) => {
        n.reaches.forEach((p) => (p.style.opacity = '0.55'))
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

    type Replay = {
      t0: number
      until: number
      delay: Map<string, number>
      peak: number
      decay: number
    } | null
    let replayState: Replay = null

    const canvasPoint = (): { x: number; y: number } | null => {
      if (!pointer) return null
      return {
        x: (pointer.cx - stageLeft + stage.scrollLeft) / scale,
        y: (pointer.cy - stageTop) / scale,
      }
    }

    // ---- writes (delta-quantized) ----
    // THE QUANTIZER IS THE THROTTLE (the phone-lag fix, Emilie 2026-08-07:
    // "on the phone it seems a bit laggy"). Every write here is guarded by
    // "has the quantized value changed since last frame", so the step size IS
    // the write budget. At 255 levels a value that is moving at all changes
    // every single frame, so a sweep writes to hundreds of paths per frame and
    // a phone spends the whole animation in style recalculation.
    // Measured at 390x844 with the CPU throttled 6x: the pan alone holds 60fps
    // (median 16.7ms) and the WAKE runs at 15 (median 66.6ms), so the cost is
    // the writes, not the scrolling.
    // During a sweep the values are ramping smoothly across ~900ms, so a
    // coarser ladder is invisible: 48 levels is a 2% step in opacity, under
    // what anyone can see on a fading hairline, and it cuts the writes by
    // roughly five. At rest the full 255 stays, because that is where a single
    // node is tracking a pointer and precision is the whole point.
    // A coarse pointer is a phone, and a phone is where the budget is tight:
    // 20 levels is a 5% opacity step, still invisible on a hairline that is
    // fading over half a second.
    const coarse =
      typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
    const SWEEP_STEPS = coarse ? 20 : 48
    const q = (v: number) => Math.round(v * (replayState ? SWEEP_STEPS : 255))

    const applyFibres = (n: NodeHandle) => {
      const qe = q(n.E)
      if (qe === n.appliedE) return
      n.appliedE = qe
      // REACH_REST is 0, not a dim resting value: an unmade synapse is not part
      // of the map at rest. It is an answer to a question, so it exists only
      // while something is asking.
      const reach = (ease(n.E) * 0.55).toFixed(3)
      for (const p of n.reaches) p.style.opacity = reach
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
      const ink = (rest + (1 - rest) * e).toFixed(3)
      if (n.lbl) n.lbl.style.opacity = ink
      // dates ride the same rest ink as the titles (G4: the old x 0.8 dip
      // landed 2.2:1, under the AA floor on both grounds; the smaller size
      // alone keeps them quieter)
      if (n.yr) n.yr.style.opacity = ink
    }

    /** The travelling wave's value for one mark, undelayed — the same term the
     *  nodes read, so a thread and its ends can never disagree about where the
     *  crest is. 0 when no sweep is running. */
    const waveAt = (id: string, now: number): number => {
      const r = replayState
      if (!r) return 0
      const at = r.delay.get(id)
      if (at == null) return 0
      const age = now - r.t0 - at
      if (age <= 0) return 0
      const lit = r.decay > 0 ? Math.max(0, 1 - age / r.decay) : 1
      return r.peak * lit
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

      // ONE NEURON AT A TIME (Emilie, 2026-08-07: "it should only work on the
      // node we are hovering over not its neighbours, for simplicity").
      //
      // ⚠ MEASURED FIRST: hovering EMPTY SPACE 60px from Sensi woke three
      // neurons, two of them fully. The pointer was on nothing and the map
      // answered as though something had been chosen — which is precisely the
      // "I feel a bit lost". The radius was a field, and a field cannot say
      // what you are pointing at.
      //
      // It is the NEAREST one that wakes, not strictly the one under the
      // cursor: her pick of three. The soft approach is what makes the map feel
      // alive — a neuron begins to answer as you come toward it rather than
      // snapping on at the edge of a 7px dot — and there is no ambiguity left,
      // because only ever one of them is answering.
      let near: NodeHandle | null = null
      let nearD = Infinity
      // AND ONLY WHILE NOTHING IS HELD. Once you have chosen a neuron, the
      // pointer stops proposing others — that is the rule that makes the phases
      // legible, and it lives here rather than in the view because the ambient
      // wake is the engine's own behaviour, not a handler's.
      if (p && ambientRef.current) {
        nodes.forEach((n) => {
          const dx = n.x - p.x
          const dy = n.y - p.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < nearD) {
            nearD = d
            near = n
          }
        })
      }

      nodes.forEach((n) => {
        let t = 0
        if (n === near && nearD <= R) t = Math.min(1, (R - nearD) / edge)
        t = Math.max(t, waveAt(n.id, now))
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

      // THE NEAR-MISS ARMS, AFTER every E has settled this frame. It cannot ride
      // applyFibres: that is gated on THIS node's value changing, and the whole
      // point here is that the OTHER end moved.
      nodes.forEach((n) => {
        for (const a of n.arms) {
          const far = nodes.get(a.to)
          const e = far ? Math.max(n.E, far.E) : n.E
          const qv = q(e)
          if (qv === a.applied) continue
          a.applied = qv
          const v = (ease(e) * 0.55).toFixed(3)
          for (const p of a.paths) p.style.opacity = v
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
        // ⚠ A SWEEP DOES NOT DRAW THE THREADS, AND THAT IS THE DESIGN.
        // Built once and REVERTED ON SIGHT (Emilie, 2026-08-08): letting the
        // wave write a thread outright — skipping the two first-order lags that
        // otherwise leave it 12.5% drawn — made the wiring appear as the crest
        // passed. She had already ruled the opposite, and she was right: "I
        // actually think that's the point, to sometimes see the mind without
        // the connections, like a constellation." The map grows as MARKS; the
        // wiring is what engagement buys. DO NOT RE-PROPOSE IT.
        // A thread still follows its most awake end, so hovering and holding
        // draw it in full — which is the whole of the interaction.
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
    const autopan = (dur: number, to?: number, vertical?: boolean) => {
      cancelAnimationFrame(panRaf)
      const max = vertical
        ? stage.scrollHeight - stage.clientHeight
        : stage.scrollWidth - stage.clientWidth
      if (max <= 0) return
      const end = to == null ? max : Math.max(0, Math.min(max, to))
      // Turned, the record grows UPWARD: it starts at the far end (the oldest
      // work, at the bottom) and arrives at the top, which is now.
      const start = vertical ? max : 0
      const t0 = performance.now()
      if (vertical) stage.scrollTop = start
      else stage.scrollLeft = start
      let stopped = false
      // THE SNAP MUST BE OFF FOR THE WHOLE PAN, not for the first 700ms of it
      // (the phone-lag fix, Emilie 2026-08-07: "on the phone it seems a bit
      // laggy"). `.nw-stage` carries `scroll-snap-type: x proximity` on
      // pointer-coarse, and a sweep writes scrollLeft on every frame across a
      // 5543px scroller — so the browser re-evaluates seven snap targets
      // against a moving scroll position, every frame, for six seconds.
      // Measured at 390x844 with the CPU throttled 6x: a stall of 600-870ms
      // once a second, in a rhythm that starts the instant the arrival's
      // 700ms `is-free` window lapses and the snap re-arms mid-pan. The mean
      // frame during the sweep was 272-483ms; after it ended, 16.7ms.
      // The pan already chose its destination. Snapping cannot improve on a
      // chosen answer, it can only argue with it.
      stage.classList.add('is-free')
      // Any real input takes the wheel back: pointer, wheel, or keyboard. On
      // the arrival sweep this is the ONLY way out, so it also has to end the
      // node wave — otherwise you grab the map and it keeps lighting up
      // underneath you, which is the map arguing with you.
      const release = () => {
        stage.classList.remove('is-free')
        stage.removeEventListener('pointerdown', stop)
        stage.removeEventListener('wheel', stop)
        window.removeEventListener('keydown', stop)
      }
      const stop = () => {
        stopped = true
        replayState = null
        kick()
        release()
      }
      stage.addEventListener('pointerdown', stop)
      stage.addEventListener('wheel', stop)
      window.addEventListener('keydown', stop)
      const step = (now: number) => {
        if (stopped) return
        const k = Math.min(1, (now - t0) / dur)
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
        const at = start + (end - start) * e
        if (vertical) stage.scrollTop = at
        else stage.scrollLeft = at
        if (k < 1) panRaf = requestAnimationFrame(step)
        else release()
      }
      panRaf = requestAnimationFrame(step)
    }

    const replay = (o?: ReplayOpts) => {
      const step = o?.step ?? 130
      const peak = o?.peak ?? 1
      const decay = o?.decay ?? 0
      const delay = new Map<string, number>()
      // Rank is chronological, and chronological is what the wave follows in
      // both orientations — turned, that simply means it climbs.
      ranks.forEach((r) => delay.set(r.id, r.rank * step))
      const total = ranks.length * step
      replayState = {
        t0: performance.now(),
        until: total + (decay > 0 ? decay + 400 : 2200),
        delay,
        peak,
        decay,
      }
      autopan(total + 800, o?.to, o?.vertical)
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
    replay: (o?: ReplayOpts) => api.current.replay(o),
  }
}
