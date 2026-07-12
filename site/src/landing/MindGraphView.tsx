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
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import { vtName } from '../lib/viewTransition'
import { LENS_ACCENT } from './palette'
import { MIND, THREADS, VIEWBOX, nodeRoute, spline, starPath, type MindNode } from './mindGraph'

// The mode-aware ink (light ink on carbon, dark ink on cool white): the same
// token the mg-* styles use, so JS-driven blooms match the CSS.
const INK = 'var(--lang-ink)'

type Active = { kind: 'node' | 'thread'; id: string } | null

function nodeAria(n: MindNode): string {
  return (
    `${n.label} — ${n.kind === 'project' ? 'project' : 'thought'}` +
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
  const [intro, setIntro] = useState(!prm)
  const lastPointer = useRef<'mouse' | 'touch' | 'pen'>('mouse')

  useEffect(() => {
    if (prm) {
      setIntro(false)
      return
    }
    const t = window.setTimeout(() => setIntro(false), INTRO_MS)
    return () => window.clearTimeout(t)
  }, [prm])

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
      navigate(nodeRoute(n), { viewTransition: true })
      return
    }
    setActive({ kind: 'node', id: n.id })
    setArmedId(n.id)
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
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
            style={{
              ...(threadColor[t.id] ? { stroke: threadColor[t.id] } : null),
              animationDelay: `${i * THREAD_STEP}ms`,
              animationDuration: `${THREAD_DUR}ms`,
            }}
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
              className={`mg-node${n.rest ? ' rest' : ''}${extra ? ' ' + extra : ''}`}
              tabIndex={0}
              role="link"
              aria-label={nodeAria(n)}
              onMouseEnter={() => activateNode(n.id)}
              onMouseLeave={clear}
              onFocus={() => activateNode(n.id)}
              onBlur={clear}
              onClick={() => {
                if (lastPointer.current === 'touch') return // touch handled on the surface
                navigate(nodeRoute(n), { viewTransition: true })
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate(nodeRoute(n), { viewTransition: true })
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
                    style={{ animationDelay: `${-(awardOrder.get(n.id) ?? 0) * 730}ms` }}
                  />
                  <path
                    className="mg-core p mg-award"
                    d={starPath(n.x, n.y, 5.6)}
                    style={{ ...(coreStyle[n.id] ?? null), animationDelay: `${delay}ms` }}
                  />
                </>
              ) : isProject ? (
                <circle
                  className="mg-core p"
                  cx={n.x}
                  cy={n.y}
                  r={3.6}
                  style={{ ...(coreStyle[n.id] ?? null), animationDelay: `${delay}ms` }}
                />
              ) : (
                <circle
                  className="mg-core t"
                  cx={n.x}
                  cy={n.y}
                  r={3.2}
                  style={{ animationDelay: `${delay}ms` }}
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
