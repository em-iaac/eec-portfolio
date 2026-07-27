// The mind-graph artwork (Session R1; bimodal since DL-1): SVG idea threads +
// project/thought marks over the mode's ground (light ink on carbon in dark,
// dark ink on cool white in light; lens accents wire/pen via LENS_ACCENT).
// Progressive enhancement on top of the honest DOM hero — a throw
// here degrades to no-graph (wrapped by the cover) while the text hero still
// paints. Interaction: hover (desktop), focus (keyboard), and forgiving tap
// (mobile, nearest-node picking so a fat finger never misses) all bloom a node's
// threads in its lens colour. The draw-in is sequenced (threads sweep in one by
// one, then the marks land on them, then the labels settle) so the field reads
// as being drawn and connected; reduced motion renders the identical final
// composition instantly.
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import { hasMindDrawn, markMindDrawn } from '../lib/develop'
import { vtName } from '../lib/viewTransition'
import { preloadPath } from '../lib/preloadRoute'
import { travelTo } from '../lib/navIntent'
import { LENSES } from '../components/Lens'
import { KEY_TO_LENS, type LensKey } from './palette'
import { MIND, THREADS, VIEWBOX, nodeRoute, spline, starPath, type MindNode } from './mindGraph'

// The mode-aware ink (light ink on carbon, dark ink on cool white): the same
// token the mg-* styles use, so JS-driven blooms match the CSS.
const INK = 'var(--lang-ink)'

// The graph model speaks LensKey ('c'|'p'|'e'); the one lens source speaks
// Lens. The accent is the literal light-dark() pair because it lands on SVG
// presentation attributes, where var() is not reliable (see components/Lens).
const LENS_ACCENT: Record<LensKey, string> = {
  c: LENSES[KEY_TO_LENS.c].accent,
  p: LENSES[KEY_TO_LENS.p].accent,
  e: LENSES[KEY_TO_LENS.e].accent,
}

// THE PHONE FRAME (Emilie's pick B, 2026-07-26). A phone does not see the
// whole canvas: at 390px the full 1440x860 sliced into the 46svh band renders
// every mark at 3.2px, which is a drawing you cannot use. So the phone gets
// its OWN CAMERA on the same drawing: a 557x554 window over the dense middle,
// framing the headline work (Sensi, NeuroSpace, lEgoarCh, The Lungs, The
// Huddle, Ring 4000) and 5 of the 7 award marks, at 0.70 scale instead of
// 0.451 so marks land 56% bigger. It deliberately drops the lower shelf of
// older, smaller work, which is the right thing to lose on a phone.
// A viewBox is a CAMERA, not geometry: no coordinate moves and the frozen
// layout snapshot stays green. The window's aspect ratio matches the phone
// band's exactly, so `slice` crops nothing further.
// (390 / 557 = 0.70 scale. The phone canvas type in index.css is calibrated to
// that number: change this window and those sizes must change with it.)
const PHONE_VIEWBOX = '530 200 557 554'

type Active = { kind: 'node' | 'thread'; id: string } | null

function nodeAria(n: MindNode): string {
  return (
    `${n.label} · ${n.kind === 'project' ? 'project' : 'thought'}` +
    (n.award ? ' (award-winning)' : '') +
    ` · threads: ${n.th.join(', ').toLowerCase()}`
  )
}

// Draw-in choreography (ms). Threads sweep first, staggered; marks land on them a
// beat later, staggered left-to-right; labels settle last. Total ~3.3s.
const THREAD_STEP = 190
const THREAD_DUR = 1400
const NODE_START = 950
const NODE_STEP = 78
const INTRO_MS = 3400

export default function MindGraph() {
  const prm = usePrefersReducedMotion()
  const navigate = useNavigate()
  const svgRef = useRef<SVGSVGElement>(null)
  const [active, setActive] = useState<Active>(null)
  const [armedId, setArmedId] = useState<string | null>(null)
  // THE "START HERE" STATE (REDESIGN-SPEC §3.4, promised and never built).
  // One mark arrives with its NAME showing, so the field says "these dots are
  // things, touch one" before any input. It is NOT the full bloom: setting
  // `active` would switch the stage to is-focus and dim every other thread to
  // 0.08, which is the opposite of the spec's "never a dead grey field". It
  // clears the moment the visitor touches anything.
  // GATED ON THE SAME QUERY AS THE CSS (max-width: 639px), NOT on pointer
  // type. The rest labels disappear because of SCALE, which is a function of
  // viewport width; gating the invitation on `pointer: coarse` instead left a
  // narrow desktop window with no rest labels AND no invitation, i.e. a field
  // of anonymous dots. The two must agree or the phone rules half-apply.
  const [startId, setStartId] = useState<string | null>(null)
  // THE DRAW-IN: an ARRIVAL, not a page load. Once per visit (lib/develop),
  // on its own clock — threads sweep in one by one, the marks land on them,
  // the labels settle, ~3.4s. The landing mounts this component only when the
  // bio section is properly on screen, so the ceremony plays in front of the
  // visitor instead of to an empty room.
  //
  // THE CLEANUP NO LONGER MARKS IT DRAWN, and that is a real bug fix, not
  // tidying (2026-07-27). It used to, on the reasoning that leaving mid-draw
  // still counts as having seen it. But StrictMode double-invokes effects in
  // dev — mount, cleanup, mount — so the cleanup set the flag before the
  // second run ever read it, and every run after the first found
  // hasMindDrawn() already true and killed the intro on the spot. The draw-in
  // could not play in development AT ALL, which is exactly what Emilie kept
  // reporting. The flag is now set only when the ceremony actually finishes.
  const [intro, setIntro] = useState(() => !prm && !hasMindDrawn())
  const lastPointer = useRef<'mouse' | 'touch' | 'pen'>('mouse')

  useEffect(() => {
    if (prm || hasMindDrawn()) {
      setIntro(false)
      markMindDrawn()
      return
    }
    const t = window.setTimeout(() => {
      setIntro(false)
      markMindDrawn()
    }, INTRO_MS)
    return () => window.clearTimeout(t)
  }, [prm])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(max-width: 639px)').matches) return
    const first = MIND.nodes.find((n) => n.award) ?? MIND.nodes[0]
    if (!first) return
    // after the draw-in, so the invitation is the last thing to arrive
    const t = window.setTimeout(() => setStartId(first.id), prm ? 0 : INTRO_MS + 200)
    return () => window.clearTimeout(t)
  }, [prm])

  // the invitation retires the instant the visitor takes it up
  useEffect(() => {
    if (active) setStartId(null)
  }, [active])

  // Which camera. Kept in sync, not read once, so a rotation or a resized
  // window swaps the frame instead of stranding the wrong one.
  //
  // TWO listeners on purpose, and this was CAUGHT IN VERIFICATION, not
  // theorised: `matchMedia('...').matches` flipped to false on a 390 -> 1280
  // resize and the CSS media query re-evaluated correctly, but the
  // MediaQueryList 'change' event never fired, so the phone camera stayed on a
  // desktop viewport. `resize` always fires. The state setter makes this free:
  // React bails out of a re-render when the value is unchanged, so the extra
  // listener costs a boolean compare per resize event and nothing else.
  const [phoneFrame, setPhoneFrame] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 639px)')
    const sync = () => setPhoneFrame(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    window.addEventListener('resize', sync)
    return () => {
      mq.removeEventListener('change', sync)
      window.removeEventListener('resize', sync)
    }
  }, [])

  const byId = useMemo(() => {
    const m = new Map<string, MindNode>()
    MIND.nodes.forEach((n) => m.set(n.id, n))
    return m
  }, [])
  // Left-to-right order so the marks land in a readable sweep, not registry order.
  const xOrder = useMemo(() => {
    const order = new Map<string, number>()
    ;[...MIND.nodes].sort((a, b) => a.x - b.x).forEach((n, i) => order.set(n.id, i))
    return order
  }, [])
  // Index among the award nodes, to desync their glow so they never twinkle in lockstep.
  const awardOrder = useMemo(() => {
    const order = new Map<string, number>()
    MIND.nodes.filter((n) => n.award).forEach((n, i) => order.set(n.id, i))
    return order
  }, [])

  function activateNode(id: string) {
    setActive({ kind: 'node', id })
    // Warm the destination chunk on the SAME beat that arms the morph: a mark
    // is a <g>, so the delegated link warming in App cannot see it.
    const n = byId.get(id)
    if (n) preloadPath(nodeRoute(n))
  }
  function activateThread(id: string) {
    setActive({ kind: 'thread', id })
  }
  const clear = () => setActive(null)

  // ---- derive the bloom from the active target (declarative, no imperative DOM)
  const litThreads = new Set<string>()
  const threadColor: Record<string, string> = {}
  const nodeExtra: Record<string, 'active' | 'member' | 'lit'> = {}
  const coreStyle: Record<string, { fill: string }> = {}
  if (active?.kind === 'node') {
    const n = byId.get(active.id)
    if (n) {
      const color = n.kind === 'project' ? LENS_ACCENT[n.lens] : INK
      n.th.forEach((t) => {
        litThreads.add(t)
        threadColor[t] = color
      })
      nodeExtra[n.id] = 'active'
      if (n.kind === 'project') coreStyle[n.id] = { fill: color }
      MIND.nodes.forEach((m) => {
        if (m.id !== n.id && m.th.some((t) => n.th.includes(t))) nodeExtra[m.id] = 'member'
      })
    }
  } else if (active?.kind === 'thread') {
    litThreads.add(active.id)
    threadColor[active.id] = INK
    MIND.nodes.forEach((m) => {
      if (m.th.includes(active.id)) nodeExtra[m.id] = 'lit'
    })
  }
  const isFocus = active !== null

  // ---- forgiving touch: pick the nearest node to the tap, bloom it, then open
  // it on a second tap of the same node. No dead zones between marks.
  function canvasPoint(clientX: number, clientY: number) {
    const svg = svgRef.current
    const ctm = svg?.getScreenCTM()
    if (!svg || !ctm) return null
    const pt = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse())
    return { x: pt.x, y: pt.y }
  }
  function nearest(x: number, y: number): MindNode | null {
    let best: MindNode | null = null
    let bestD = Infinity
    for (const n of MIND.nodes) {
      const d = (n.x - x) ** 2 + (n.y - y) ** 2
      if (d < bestD) {
        bestD = d
        best = n
      }
    }
    // ~80 canvas units ≈ a comfortably large touch region on a phone-sliced view.
    return best && bestD <= 80 * 80 ? best : null
  }

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    lastPointer.current = e.pointerType as 'mouse' | 'touch' | 'pen'
    if (e.pointerType !== 'touch') return
    if ((e.target as Element).closest('.mg-edge')) return // let thread labels bloom themselves
    const p = canvasPoint(e.clientX, e.clientY)
    if (!p) return
    const n = nearest(p.x, p.y)
    if (!n) {
      setActive(null)
      setArmedId(null)
      return
    }
    e.preventDefault()
    if (armedId === n.id) {
      navigate(travelTo(nodeRoute(n)), { viewTransition: true })
      return
    }
    setActive({ kind: 'node', id: n.id })
    setArmedId(n.id)
  }

  return (
    <svg
      ref={svgRef}
      viewBox={phoneFrame ? PHONE_VIEWBOX : `0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      preserveAspectRatio="xMidYMid slice"
      className={`mg-stage absolute inset-0 block h-full w-full ${intro ? 'mg-intro ' : ''}${
        isFocus ? 'is-focus' : ''
      }`}
      role="group"
      aria-label="Mind graph: six idea threads; projects sit where threads cross, thoughts sit along a thread."
      onPointerDown={onPointerDown}
    >
      <defs>
        {/* soft radial glow reused by every award sparkle (one gradient, cheap) */}
        <radialGradient id="mg-glow-grad">
          <stop offset="0%" style={{ stopColor: INK }} stopOpacity="0.5" />
          <stop offset="100%" style={{ stopColor: INK }} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* threads: sweep in one by one */}
      <g>
        {THREADS.map((t, i) => (
          <path
            key={t.id}
            className={`mg-thread${litThreads.has(t.id) ? ' active' : ''}`}
            d={spline(t.pts)}
            pathLength={1}
            strokeDasharray={1}
            // A NAMED delay, never a raw animationDelay: a bare inline
            // animation-delay applies to EVERY animation the element ever
            // runs, so the intro stagger leaks into any later one.
            style={
              {
                ...(threadColor[t.id] ? { stroke: threadColor[t.id] } : null),
                '--mg-in-delay': `${i * THREAD_STEP}ms`,
                animationDuration: `${THREAD_DUR}ms`,
              } as CSSProperties
            }
          />
        ))}
      </g>

      {/* thread edge labels. Each rides inside a focusable group with an
          invisible hit rect (G4): SVG text hit-tests only its glyph cells,
          so the 8px glyphs alone were a ~9px-tall target; the rect pads the
          control to ~26px rendered without changing what is drawn. */}
      <g>
        {THREADS.filter((t) => t.label).map((t) => (
          <g
            key={t.id}
            className="mg-edge"
            tabIndex={0}
            role="button"
            aria-label={`${t.id} thread. Highlight its projects and thoughts.`}
            onMouseEnter={() => activateThread(t.id)}
            onMouseLeave={clear}
            onFocus={() => activateThread(t.id)}
            onBlur={clear}
            onClick={() => activateThread(t.id)}
            onKeyDown={(e) => {
              // role=button on an SVG group gets no native key activation
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                activateThread(t.id)
              }
            }}
          >
            <rect
              className="mg-edge-hit"
              x={
                t.anchor === 'end'
                  ? t.label![0] - (t.id.length * 7.5 + 12)
                  : t.anchor === 'middle'
                    ? t.label![0] - (t.id.length * 7.5 + 18) / 2
                    : t.label![0] - 6
              }
              y={t.label![1] - 17}
              width={t.id.length * 7.5 + 18}
              height={28}
            />
            <text
              className={`mg-edge-lbl${litThreads.has(t.id) ? ' active' : ''}`}
              x={t.label![0]}
              y={t.label![1]}
              textAnchor={t.anchor}
            >
              {t.id}
            </text>
          </g>
        ))}
      </g>

      {/* nodes: land on the threads, staggered left-to-right */}
      <g>
        {MIND.nodes.map((n) => {
          const extra = nodeExtra[n.id]
          const isProject = n.kind === 'project'
          const delay = NODE_START + (xOrder.get(n.id) ?? 0) * NODE_STEP
          return (
            <g
              key={n.id}
              className={`mg-node${n.rest ? ' rest' : ''}${extra ? ' ' + extra : ''}${
                n.id === startId ? ' start' : ''
              }`}
              tabIndex={0}
              role="link"
              aria-label={nodeAria(n)}
              onMouseEnter={() => activateNode(n.id)}
              onMouseLeave={clear}
              onFocus={() => activateNode(n.id)}
              onBlur={clear}
              onClick={() => {
                if (lastPointer.current === 'touch') return // touch handled on the surface
                navigate(travelTo(nodeRoute(n)), { viewTransition: true })
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate(travelTo(nodeRoute(n)), { viewTransition: true })
                }
              }}
              // The shared-element source: only the ACTIVE node (hover / focus /
              // tap-armed always precedes its click) carries the destination
              // route's view-transition-name, so exactly one candidate exists
              // per state (the one-per-name rule, lib/viewTransition.ts). Where
              // the browser cannot snapshot an inner SVG element this simply
              // degrades to the soft crossfade.
              style={{
                viewTransitionName:
                  active?.kind === 'node' && active.id === n.id ? vtName(nodeRoute(n)) : undefined,
              }}
            >
              {n.award ? (
                <>
                  <circle
                    className="mg-glow"
                    cx={n.x}
                    cy={n.y}
                    r={11}
                    fill="url(#mg-glow-grad)"
                    // A NAMED delay, not a raw animation-delay: a bare inline
                    // animationDelay applies to EVERY animation the element
                    // ever runs, so the desync offset was leaking into the
                    // hover breath and starting it up to 2s late.
                    style={{ '--mg-halo-delay': `${-(awardOrder.get(n.id) ?? 0) * 730}ms` } as CSSProperties}
                  />
                  <path
                    className="mg-core p mg-award"
                    d={starPath(n.x, n.y, 5.6)}
                    style={{ ...(coreStyle[n.id] ?? null), '--mg-in-delay': `${delay}ms` } as CSSProperties}
                  />
                </>
              ) : isProject ? (
                <circle
                  className="mg-core p"
                  cx={n.x}
                  cy={n.y}
                  r={3.6}
                  style={{ ...(coreStyle[n.id] ?? null), '--mg-in-delay': `${delay}ms` } as CSSProperties}
                />
              ) : (
                <circle
                  className="mg-core t"
                  cx={n.x}
                  cy={n.y}
                  r={3.2}
                  style={{ '--mg-in-delay': `${delay}ms` } as CSSProperties}
                />
              )}
              <circle className="mg-hit" cx={n.x} cy={n.y} r={15} />
              <text
                className={`mg-lbl ${isProject ? 'p' : 't'}`}
                x={n.x + n.d[0]}
                y={n.y + n.d[1]}
                textAnchor={n.a}
              >
                {n.label}
              </text>
            </g>
          )
        })}
      </g>

    </svg>
  )
}
