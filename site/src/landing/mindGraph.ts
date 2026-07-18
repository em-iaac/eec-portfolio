// THE LANDING MIND-GRAPH · the frozen 2D layout (Session R1).
//
// Productionised from the proven mock design-studio/cover-dark-threads.html.
// This is the IDEA view of the work: projects + thoughts as marks, idea threads
// as curves; a project sits where its threads cross, a thought sits along one.
//
// THE ECONOMY (binding): node CONTENT — which nodes exist, their labels, lens,
// kind, and sheet/note links — comes from the registry (EXPLORE_NODES), the
// single source. This file owns ONLY the hand-authored GEOMETRY and the curated
// thread membership. Those are layout INVARIANTS: mindGraph.test.ts freezes them
// (freeze + snapshot) and validate-registry.test.ts asserts every node has a
// geometry entry (the validator). APPENDS ONLY: a new project/thought adds a
// registry entry + a geometry entry here; the shipped composition never reflows.
//
// Pure module: no DOM, no React (Node-testable), so scripts/generate-landing-
// fallback.mjs can bundle it under Node to regenerate the static fallback.
import { AWARD_WINNER_IDS, EXPLORE_NODES } from '../data/registry'
import { LENS_TO_KEY, type LensKey } from './palette'

// The mock's authoring canvas. Node + thread coords live in this space; the SVG
// viewBox matches it and preserveAspectRatio slices to fill any viewport.
export const VIEWBOX = { w: 1440, h: 860 } as const

// The woven question (LOCKED copy). The fragment runs along the COMFORT thread
// as a textPath (a reward for looking, never a headline); the full sentence is
// the thread's accessible name. No em dashes (voice rule); the apostrophe is a
// real typographic one.
export const QUESTION = 'how will this space make someone feel?'
export const QUESTION_FULL =
  'I started asking buildings a question my software couldn’t answer: how will this space make someone feel?'

// The thread that carries the question; it has no edge label of its own.
export const COMFORT_ID = 'COMFORT'

export type Anchor = 'start' | 'middle' | 'end'

export interface Thread {
  id: string
  // Edge-label anchor point in canvas space; null for COMFORT (the question is
  // its label instead).
  label: readonly [number, number] | null
  anchor: Anchor
  pts: ReadonlyArray<readonly [number, number]>
}

// The six shipped idea threads (a CURATED, OPEN set — a new kind of work may add
// a thread; nothing is re-labelled). Dense crossings sit centre/right/bottom so
// the top-left stays sparse for the text layer.
export const THREADS: readonly Thread[] = [
  // Ends run PAST the right edge (x=1470 > viewBox 1440) so the lines read as
  // flowing off-frame, not stopping at a wall ("infinite lines"). Edge labels
  // stay inside at x=1408.
  {
    id: 'NEURO',
    label: [1408, 236],
    anchor: 'end',
    pts: [[560, 300], [720, 330], [900, 300], [1120, 250], [1300, 262], [1470, 240]],
  },
  {
    id: 'AI',
    label: [1408, 518],
    anchor: 'end',
    // Leads IN from the bottom edge ([434,860]) so the lower-left is no longer empty.
    pts: [[434, 860], [470, 700], [560, 300], [705, 398], [820, 430], [980, 596], [1120, 250], [1300, 470], [1470, 562]],
  },
  {
    id: 'DATA',
    label: [1408, 366],
    anchor: 'end',
    // Leads IN from the bottom edge ([235,860]).
    pts: [[235, 860], [470, 700], [705, 540], [820, 430], [1085, 510], [1150, 545], [1220, 528], [1300, 388], [1470, 375]],
  },
  {
    id: 'GEOMETRY',
    label: [1408, 598],
    anchor: 'end',
    // Reordered into spatial sequence (leads in from the LEFT edge at [0,776];
    // soma -> ballooning -> legoarch -> solvers -> ...) to kill the old
    // [470,700]->[560,748] sharp corner and the 171deg head hairpin. No node moved.
    pts: [
      [0, 776], [420, 760], [560, 748], [655, 592], [705, 540], [740, 624],
      [980, 596], [1030, 545], [1085, 510], [1136, 519], [1300, 600], [1470, 612],
    ],
  },
  {
    id: 'COMFORT',
    label: null,
    anchor: 'start',
    // Exits the BOTTOM edge ([605,860]).
    pts: [[560, 300], [670, 455], [655, 592], [625, 720], [605, 860]],
  },
  {
    id: 'XR',
    label: [1408, 98],
    anchor: 'end',
    // Leads IN from the LEFT edge ([0,135]) along the top so it flows off-frame
    // both ends like the rest; the top strip clears the (vertically-centred) text.
    pts: [[0, 135], [520, 140], [720, 166], [1000, 140], [1240, 120], [1470, 105]],
  },
] as const

// Per-node geometry keyed by REGISTRY id. `th` is the curated thread membership;
// `rest` shows the node's label at rest (~5 always-on labels). `d` is the label
// offset from the node, `a` its text-anchor. Coordinates are frozen (see header).
interface Geom {
  x: number
  y: number
  th: readonly string[]
  a: Anchor
  d: readonly [number, number]
  rest?: boolean
}

// THE APPEND RECIPE (S4b, Emilie's ruling 2026-07-14: metadata decides how a
// new piece connects). Time and idea lineage already derive from the registry
// (`date` places it in the /thoughts world; CORRELATIONS braid it); on THIS
// artwork a new node declares WHICH thread it rides (from its registry tags:
// ai -> AI, data -> DATA, geometry/simulation -> GEOMETRY, neuro -> NEURO,
// comfort -> COMFORT, xr -> XR) and HOW FAR ALONG (arc-length t, 0..1), via
// pointOnThread below, instead of hand-typed pixels. The frozen prefix keeps
// its literal coords; appends only, the shipped composition never reflows.

// Sample the thread's drawn spline (the same cardinal cubics as spline(), so
// the mark sits exactly ON the ink) at arc-length fraction t. Pure and
// deterministic: safe for the frozen snapshot and the Node fallback bundle.
export function pointOnThread(threadId: string, t: number): { x: number; y: number } {
  const thread = THREADS.find((th) => th.id === threadId)
  if (!thread) throw new Error(`pointOnThread: unknown thread '${threadId}'.`)
  const pts = thread.pts
  const k = 0.18
  // The same control points spline() emits, sampled densely.
  const samples: [number, number][] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]!
    const p1 = pts[i]!
    const p2 = pts[i + 1]!
    const p3 = pts[Math.min(i + 2, pts.length - 1)]!
    const c1x = p1[0] + (p2[0] - p0[0]) * k
    const c1y = p1[1] + (p2[1] - p0[1]) * k
    const c2x = p2[0] - (p3[0] - p1[0]) * k
    const c2y = p2[1] - (p3[1] - p1[1]) * k
    for (let s = 0; s <= 64; s++) {
      const u = s / 64
      const v = 1 - u
      samples.push([
        v * v * v * p1[0] + 3 * v * v * u * c1x + 3 * v * u * u * c2x + u * u * u * p2[0],
        v * v * v * p1[1] + 3 * v * v * u * c1y + 3 * v * u * u * c2y + u * u * u * p2[1],
      ])
    }
  }
  let total = 0
  const acc = [0]
  for (let i = 1; i < samples.length; i++) {
    total += Math.hypot(samples[i]![0] - samples[i - 1]![0], samples[i]![1] - samples[i - 1]![1])
    acc.push(total)
  }
  const want = Math.min(Math.max(t, 0), 1) * total
  let lo = acc.findIndex((a) => a >= want)
  if (lo < 0) lo = acc.length - 1
  const p = samples[lo]!
  return { x: Math.round(p[0]), y: Math.round(p[1]) }
}

const GEOM: Record<string, Geom> = {
  // projects
  sensi: { x: 560, y: 300, th: ['NEURO', 'AI', 'COMFORT'], a: 'middle', d: [0, -15], rest: true },
  // th trimmed to only threads this node sits ON (dropped NEURO, off by 110u) so
  // hover never lights a line the mark does not touch.
  neurospace: { x: 820, y: 430, th: ['DATA', 'AI'], a: 'start', d: [15, 5], rest: true },
  podcast: { x: 1120, y: 250, th: ['NEURO', 'AI'], a: 'end', d: [-14, -9] },
  legoarch: { x: 705, y: 540, th: ['GEOMETRY'], a: 'start', d: [13, -9] },
  mars: { x: 980, y: 596, th: ['AI', 'GEOMETRY'], a: 'middle', d: [0, 25] },
  huddle: { x: 1085, y: 510, th: ['GEOMETRY', 'DATA'], a: 'end', d: [-13, -11] },
  lungs: { x: 1030, y: 545, th: ['GEOMETRY'], a: 'end', d: [-13, 20] },
  ballooning: { x: 655, y: 592, th: ['GEOMETRY', 'COMFORT'], a: 'middle', d: [0, -17] },
  soma: { x: 560, y: 748, th: ['GEOMETRY'], a: 'start', d: [10, -17] },
  cappelletti: { x: 1300, y: 600, th: ['GEOMETRY'], a: 'end', d: [-13, -11] },
  xr: { x: 1000, y: 140, th: ['XR'], a: 'middle', d: [0, 25] },
  // thoughts
  bim: { x: 1300, y: 388, th: ['DATA'], a: 'end', d: [-14, -12], rest: true },
  neuroaes: { x: 720, y: 330, th: ['NEURO'], a: 'middle', d: [0, -16] },
  solvers: { x: 740, y: 624, th: ['GEOMETRY'], a: 'middle', d: [0, 21] },
  genai: { x: 705, y: 398, th: ['AI'], a: 'middle', d: [0, -16] },
  xreal: { x: 720, y: 166, th: ['XR'], a: 'middle', d: [0, -16] },
  comfort: { x: 670, y: 455, th: ['COMFORT'], a: 'start', d: [13, 4], rest: true },
  drawiface: { x: 1240, y: 120, th: ['XR'], a: 'end', d: [-13, -14] },
  evosearch: { x: 1300, y: 470, th: ['AI'], a: 'end', d: [-14, 18] },
  heritage: { x: 1136, y: 519, th: ['GEOMETRY'], a: 'start', d: [12, -12] },
  respond: { x: 625, y: 720, th: ['COMFORT'], a: 'start', d: [13, 4] },
  // ---- S4b appends (2026-07-14, placements Emilie's over the proposal
  // board): the five blog projects ride existing threads via the append
  // recipe above. Narkomfin sits at the literal DATA×AI crossing waypoint
  // (ML + graph analysis, her wording at the gate); the rest declare
  // thread + arc-length t. The lower left, empty until now, is where the
  // record grows.
  narkomfin: { x: 470, y: 700, th: ['DATA', 'AI'], a: 'middle', d: [0, -15] },
  'urban-risk': { ...pointOnThread('AI', 0.04), th: ['AI'], a: 'start', d: [13, 5] },
  'data-geometry': { ...pointOnThread('DATA', 0.28), th: ['DATA'], a: 'start', d: [12, 20] },
  tsukiji: { ...pointOnThread('GEOMETRY', 0.18), th: ['GEOMETRY'], a: 'middle', d: [0, -16] },
  // ---- S2 appends (2026-07-16): the pre-IAAC record + the bootcamp minis
  // ride GEOMETRY's lower-left lead-in (the sparse "where the record grows"
  // stretch) via the append recipe. Jemma + The Homage sit earliest (the
  // oldest work, nearest the edge the thread enters from); the two Kangaroo
  // minis land toward the solver corner, A Playscape right by Ballooning
  // Market + the solvers thought, its honest neighbours. Labels alternate
  // above/below the line so the lead-in never stacks text.
  // (S2 fix round: the 'jemma' node became THE ENCOUNTER at the same spot;
  // FALCON SQUARE appends between The Homage and Tsukiji, label above the
  // line where its neighbours sit below.)
  encounter: { ...pointOnThread('GEOMETRY', 0.05), th: ['GEOMETRY'], a: 'start', d: [10, -14] },
  homage: { ...pointOnThread('GEOMETRY', 0.1), th: ['GEOMETRY'], a: 'middle', d: [0, 22] },
  falcon: { ...pointOnThread('GEOMETRY', 0.14), th: ['GEOMETRY'], a: 'middle', d: [0, -16] },
  'chair-sim': { ...pointOnThread('GEOMETRY', 0.22), th: ['GEOMETRY'], a: 'middle', d: [0, 22] },
  astroidal: { ...pointOnThread('GEOMETRY', 0.26), th: ['GEOMETRY'], a: 'middle', d: [0, -16] },
  playscape: { ...pointOnThread('GEOMETRY', 0.4), th: ['GEOMETRY'], a: 'start', d: [12, 12] },
  // ---- S5 appends (2026-07-18, the words session): the three new thoughts
  // ride the append recipe. connecting-the-dots (the 2020 charcoal year)
  // joins GEOMETRY's lead-in among the other early work, label below where
  // astroidal sits above; pelagñou + explaining-things ride AI (the theory
  // reading + the explaining instinct, whose proof is the AI work).
  charcoal: { ...pointOnThread('GEOMETRY', 0.33), th: ['GEOMETRY'], a: 'middle', d: [0, 22] },
  pelagnou: { ...pointOnThread('AI', 0.1), th: ['AI'], a: 'middle', d: [0, -16] },
  explain: { ...pointOnThread('AI', 0.85), th: ['AI'], a: 'start', d: [12, -12] },
}

export interface MindNode {
  id: string
  label: string
  kind: 'project' | 'thought'
  lens: LensKey
  x: number
  y: number
  th: readonly string[]
  a: Anchor
  d: readonly [number, number]
  rest: boolean
  award: boolean
  sheetRoute?: string
  noteRoute?: string
}

const THREAD_IDS = new Set(THREADS.map((t) => t.id))

// Join the frozen geometry to the registry content. Throws loudly if a shipped
// node has no geometry or references a thread that does not exist, so a bad
// append fails the build (validate-registry.test.ts + the app) before it ships a
// node floating at the origin or wired to a phantom thread.
export function buildMindGraph(): { threads: readonly Thread[]; nodes: MindNode[] } {
  const nodes = EXPLORE_NODES.map((n): MindNode => {
    const g = GEOM[n.id]
    if (!g) {
      throw new Error(
        `mindGraph: no geometry for explore node '${n.id}'. Append its coords to ` +
          'GEOM in src/landing/mindGraph.ts (appends only; never reflow the shipped set).',
      )
    }
    for (const t of g.th) {
      if (!THREAD_IDS.has(t)) {
        throw new Error(`mindGraph: node '${n.id}' references unknown thread '${t}'.`)
      }
    }
    return {
      id: n.id,
      label: n.label,
      kind: n.kind,
      lens: LENS_TO_KEY[n.lens],
      x: g.x,
      y: g.y,
      th: g.th,
      a: g.a,
      d: g.d,
      rest: g.rest === true,
      award: AWARD_WINNER_IDS.has(n.id),
      // G1: every project node routes to its showcase at /work/:id (the
      // issued gate retired with the sheet tier; a thin project's showcase
      // is honestly short, never a placeholder).
      sheetRoute: n.sheet?.route,
      noteRoute: n.note?.status === 'drafted' ? n.note.route : undefined,
    }
  })
  return { threads: THREADS, nodes }
}

// One shared instance: the layout is deterministic, so build once per session.
export const MIND = buildMindGraph()

// A node opens to its leaf: a project's showcase at /work/:id (G1), a
// thought's drafted note, else the gallery. Never a dead end. Shared by the
// graph marks and the jump bar so both route a node identically.
export function nodeRoute(n: MindNode): string {
  return n.sheetRoute ?? n.noteRoute ?? '/work'
}

// ---- geometry helpers (shared by the component and the fallback generator) ----

// Cardinal spline through waypoints -> a smooth cubic path string. Ported from
// the mock so the live draw-in and the static fallback trace the SAME curve.
export function spline(pts: ReadonlyArray<readonly [number, number]>, k = 0.18): string {
  let d = `M ${pts[0]![0]} ${pts[0]![1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]!
    const p1 = pts[i]!
    const p2 = pts[i + 1]!
    const p3 = pts[Math.min(i + 2, pts.length - 1)]!
    const c1x = p1[0] + (p2[0] - p0[0]) * k
    const c1y = p1[1] + (p2[1] - p0[1]) * k
    const c2x = p2[0] - (p3[0] - p1[0]) * k
    const c2y = p2[1] - (p3[1] - p1[1]) * k
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0]} ${p2[1]}`
  }
  return d
}

// A star/sparkle path centred at (cx,cy), outer radius r. Defaults to the
// 4-point SPARKLE that marks an award-winning project (Emilie, 2026-07-09):
// equal ink-mass to the r=3.6 project dot (outer r=5.6, inner ratio 0.46 -> area
// ~40.8 vs the dot's ~40.7; the old 0.34 was a thin needle-cross reading small),
// filled, centred on the thread. A recognition, never a stamp.
export function starPath(cx: number, cy: number, r: number, spikes = 4, innerRatio = 0.46): string {
  let d = ''
  const inner = r * innerRatio
  for (let i = 0; i < spikes * 2; i++) {
    const rad = i % 2 === 0 ? r : inner
    const ang = (Math.PI / spikes) * i - Math.PI / 2
    const px = cx + Math.cos(ang) * rad
    const py = cy + Math.sin(ang) * rad
    d += `${i === 0 ? 'M ' : 'L '}${px.toFixed(1)} ${py.toFixed(1)} `
  }
  return d + 'Z'
}
