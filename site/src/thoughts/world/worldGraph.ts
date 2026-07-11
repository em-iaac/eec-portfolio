// THE NEURAL WORLD · the pure model (the meta build, 2026-07-11).
// /thoughts draws the whole record (projects + thoughts + milestones +
// awards) as one anatomical neural map over the career skeleton, horizontal,
// 2021 › NOW. This module owns ALL the geometry: positions, dendrites,
// skeleton lanes, correlation fibres. No DOM, no React (Node-testable, the
// landing mindGraph.ts pattern); NeuralWorld.tsx renders it, the validator
// asserts its joins, worldGraph.test.ts freezes its layout.
//
// THE ECONOMY + THE FREEZE (binding):
// - Node CONTENT comes from the registry (single source). The correlations
//   are registry data too (CORRELATIONS + award refIds).
// - X is a FIXED STEP per chronological rank (never a fraction of a fixed
//   width): the viewBox WIDTH is derived from the census, so new work
//   APPENDS to the right and no shipped coordinate moves. Randomness seeds
//   from the entry ID (never the rank), so an append can never reshuffle an
//   existing neuron's anatomy. Residual contract (documented, snapshot-
//   guarded): inserting an entry with an OLD date shifts the ranks after it;
//   real appends are new work at the newest date, which only extends the
//   right edge.
import {
  CORRELATIONS,
  timelineEntries,
  type EntryKind,
  type RegistryEntry,
} from '../../data/registry'
import {
  AWARD_ANCHOR_OVERRIDE,
  LANE_FORKS,
  LANE_Y,
  MILESTONE_LANE,
  SOMA_MERGE_AT,
  type WorldLane,
} from './skeletonIds'

// ---- the frame --------------------------------------------------------------

export const WORLD_H = 860
export const X0 = 150 // first column
export const STEP = 78 // one chronological rank = one step (frozen)
const MARGIN_R = 210 // room for the open lane tips + NOW/LIVE tags

export const WORLD_KINDS: ReadonlySet<EntryKind> = new Set([
  'project',
  'thought',
  'milestone',
  'award',
])

// ---- seeded randomness (id-keyed, append-safe) ------------------------------

function idSeed(id: string, salt: number): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h ^ salt) >>> 0
}

function rngFrom(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Cardinal spline through waypoints -> smooth cubic path (the house curve).
export function spline(pts: ReadonlyArray<readonly [number, number]>, k = 0.2): string {
  let d = `M ${pts[0]![0].toFixed(1)} ${pts[0]![1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]!
    const p1 = pts[i]!
    const p2 = pts[i + 1]!
    const p3 = pts[Math.min(i + 2, pts.length - 1)]!
    const c1x = p1[0] + (p2[0] - p0[0]) * k
    const c1y = p1[1] + (p2[1] - p0[1]) * k
    const c2x = p2[0] - (p3[0] - p1[0]) * k
    const c2y = p2[1] - (p3[1] - p1[1]) * k
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

// An 8-point star for the award mark (the world's bigger sibling of the
// landing sparkle).
export function starPath(cx: number, cy: number, r: number): string {
  let d = ''
  const inner = r * 0.44
  for (let i = 0; i < 8; i++) {
    const rad = i % 2 === 0 ? r : inner
    const ang = (Math.PI / 4) * i - Math.PI / 2
    d += `${i === 0 ? 'M ' : 'L '}${(cx + Math.cos(ang) * rad).toFixed(1)} ${(cy + Math.sin(ang) * rad).toFixed(1)} `
  }
  return d + 'Z'
}

// ---- the anatomy ------------------------------------------------------------

interface KindStyle {
  count: number
  length: number
  wobble: number
  branch: number
  depth: number
  baseW: number
  r: number
}

// THE CONTRAST IS THE DESIGN: milestones get NO dendrites (count 0), they are
// pure commit dots, so the ruler stays geometric while the mind stays organic.
export const KIND_STYLE: Record<'project' | 'thought' | 'award' | 'milestone', KindStyle> = {
  project: { count: 7, length: 52, wobble: 0.9, branch: 0.6, depth: 2, baseW: 1.6, r: 7.2 },
  thought: { count: 6, length: 42, wobble: 0.9, branch: 0.55, depth: 2, baseW: 1.3, r: 5.2 },
  award: { count: 4, length: 20, wobble: 0.8, branch: 0.3, depth: 1, baseW: 0.9, r: 5.2 },
  milestone: { count: 0, length: 0, wobble: 0, branch: 0, depth: 0, baseW: 0.8, r: 2.6 },
}

function growBranch(
  x: number,
  y: number,
  ang: number,
  len: number,
  rng: () => number,
  o: { wobble: number; branch: number; depth: number },
  depth: number,
  out: [number, number][][],
): void {
  const steps = 3 + Math.floor(rng() * 2)
  const seg = len / steps
  let a = ang
  let cx = x
  let cy = y
  const pts: [number, number][] = [[x, y]]
  for (let s = 0; s < steps; s++) {
    a += (rng() - 0.5) * o.wobble
    const g = seg * (1 - s * 0.14)
    cx += Math.cos(a) * g
    cy += Math.sin(a) * g
    pts.push([cx, cy])
    if (depth < o.depth && s >= 1 && rng() < o.branch) {
      growBranch(cx, cy, a + (rng() < 0.5 ? 0.7 : -0.7), len * 0.55, rng, o, depth + 1, out)
    }
  }
  out.push(pts)
}

function dendritePaths(cx: number, cy: number, seed: number, o: KindStyle): string[] {
  const out: [number, number][][] = []
  const rng = rngFrom(seed)
  for (let i = 0; i < o.count; i++) {
    const ang = (i / o.count) * Math.PI * 2 + (rng() - 0.5) * 0.6
    growBranch(cx, cy, ang, o.length, rng, o, 0, out)
  }
  return out.map((pts) => spline(pts))
}

// One connection fibre: a wandering path soma -> synapse rendered in the SAME
// dendrite grammar (gate 1, Emilie: one anatomy; a connection is a dendrite
// that found a partner). Returns the main path + its side twigs.
function fibrePaths(
  from: readonly [number, number],
  to: readonly [number, number],
  seed: number,
  off: number,
  baseW: number,
): { main: { d: string; w: number }; twigs: { d: string; w: number }[]; pts: [number, number][] } {
  const rng = rngFrom(seed)
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const dd = Math.hypot(dx, dy) || 1
  const px = -dy / dd
  const py = dx / dd
  const pts: [number, number][] = []
  const n = 6
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const env = Math.sin(Math.PI * t)
    pts.push([
      from[0] + dx * t + (rng() - 0.5) * 30 * env + px * off * env,
      from[1] + dy * t - env * 10 + (rng() - 0.5) * 24 * env + py * off * env,
    ])
  }
  const twigs: { d: string; w: number }[] = []
  const tw = 1 + Math.floor(rng() * 2)
  for (let k = 0; k < tw; k++) {
    const tp = pts[1 + Math.floor(rng() * (n - 2))]!
    const ang = Math.atan2(dy, dx) + (rng() < 0.5 ? 0.9 : -0.9) + (rng() - 0.5) * 0.4
    const out: [number, number][][] = []
    growBranch(tp[0], tp[1], ang, 16 + rng() * 10, rng, { wobble: 0.9, branch: 0.3, depth: 1 }, 1, out)
    out.forEach((bp) => twigs.push({ d: spline(bp), w: baseW * 0.6 }))
  }
  return { main: { d: spline(pts, 0.3), w: baseW }, twigs, pts }
}

// ---- the model --------------------------------------------------------------

export type WorldKind = 'project' | 'thought' | 'award' | 'milestone'

export interface WorldNode {
  id: string
  kind: WorldKind
  date: string
  title: string
  lens?: RegistryEntry['lens']
  x: number
  y: number
  rank: number
  lane?: WorldLane // milestones only
  /** Where this piece opens, or undefined for card-only marks (milestones +
   *  awards whose honour has no page). */
  route?: string
  dendrites: string[] // path d strings, hidden at rest, grown by the engine
  labelAbove: boolean
  style: KindStyle
}

export interface WorldLink {
  a: string
  b: string
  strength: number
  color: 'lens' | 'ink'
  lens?: RegistryEntry['lens'] // the later end's lens (colours synapse + pulse)
  fibres: { d: string; w: number; side: 'a' | 'b' }[]
  synapse: { x: number; y: number; r: number }
  pulseD: string
}

export interface WorldSkeleton {
  lanes: { id: WorldLane | 'mainline'; d: string; main: boolean }[]
  tips: { x: number; y: number; live: boolean }[]
  nowAt: { x: number; y: number }
  liveTip: { x: number; y: number }
  years: { x: number; label: string }[]
}

export interface World {
  w: number
  h: number
  nodes: WorldNode[]
  links: WorldLink[]
  skeleton: WorldSkeleton
  mainY: number // the plumb line's landing lane
}

function laneOf(e: RegistryEntry): WorldLane {
  const lane = MILESTONE_LANE[e.id]
  if (!lane) {
    throw new Error(
      `worldGraph: milestone '${e.id}' has no lane. Append it to MILESTONE_LANE ` +
        'in thoughts/world/skeletonIds.ts (appends only).',
    )
  }
  return lane
}

// The award's anchor: the project its refId names, or the explicit override.
function anchorIdOf(e: RegistryEntry): string | undefined {
  return e.refId ?? AWARD_ANCHOR_OVERRIDE[e.id]
}

export function buildWorld(): World {
  // Ascending time walk over the world kinds. timelineEntries() sorts DESC by
  // date (stable); the reverse gives ASC. Ties inside a month keep a stable,
  // documented order: kind (award < milestone < project < thought), then id.
  const cast = timelineEntries()
    .filter((e) => WORLD_KINDS.has(e.kind))
    .reverse()
    .sort((a, b) =>
      a.date < b.date ? -1 : a.date > b.date ? 1 : a.kind < b.kind ? -1 : a.kind > b.kind ? 1 : a.id < b.id ? -1 : 1,
    )

  const w = X0 + cast.length * STEP + MARGIN_R
  const byId = new Map<string, RegistryEntry & { x: number; y: number; rank: number }>()

  // pass 1: rank + x + non-award y
  const placed = cast.map((e, rank) => {
    const x = X0 + (rank + 0.5) * STEP
    const r = rngFrom(idSeed(e.id, 17))()
    let y: number
    if (e.kind === 'thought') y = 170 + 95 * Math.sin(rank * 1.05 + 0.4) + r * 30
    else if (e.kind === 'project') y = 380 + 85 * Math.sin(rank * 0.9 + 2.2) + r * 26
    else if (e.kind === 'milestone') y = LANE_Y[laneOf(e)]
    else y = 520 // award fallback; anchored in pass 2
    const p = Object.assign({}, e, { x, y, rank })
    byId.set(e.id, p)
    return p
  })

  // pass 2: awards snap beside the work (or milestone) they honour
  placed.forEach((p) => {
    if (p.kind !== 'award') return
    const anchor = anchorIdOf(p)
    const a = anchor ? byId.get(anchor) : undefined
    if (a) {
      p.x = a.x + 42
      p.y = a.kind === 'milestone' ? a.y - 74 : a.y + 64
    }
  })

  // nodes
  const nodes: WorldNode[] = placed.map((p) => {
    const style = KIND_STYLE[p.kind as WorldKind]
    let route: string | undefined
    if (p.kind === 'project') route = p.sheet?.route
    else if (p.kind === 'thought') route = p.note?.status === 'drafted' ? p.note.route : undefined
    else if (p.kind === 'award' && p.refId) route = `/work/${p.refId}`
    return {
      id: p.id,
      kind: p.kind as WorldKind,
      date: p.date,
      title: p.title,
      lens: p.lens,
      x: p.x,
      y: p.y,
      rank: p.rank,
      lane: p.kind === 'milestone' ? laneOf(p) : undefined,
      route,
      dendrites: dendritePaths(p.x, p.y, idSeed(p.id, 11), style),
      labelAbove: p.kind === 'thought' || (p.kind === 'project' && p.rank % 2 === 0),
      style,
    }
  })

  // links: the signed CORRELATIONS + the award threads derived from refId /
  // the anchor override (single sources, never duplicated).
  const linkSpecs: { a: string; b: string; strength: number }[] = [
    ...CORRELATIONS.map(([a, b, s]) => ({ a, b, strength: s })),
    ...placed
      .filter((p) => p.kind === 'award' && anchorIdOf(p) && byId.has(anchorIdOf(p)!))
      .map((p) => ({ a: p.id, b: anchorIdOf(p)!, strength: 1 })),
  ]

  const links: WorldLink[] = linkSpecs
    .filter((L) => byId.has(L.a) && byId.has(L.b))
    .map((L) => {
      const a = byId.get(L.a)!
      const b = byId.get(L.b)!
      const later = a.date > b.date ? a : b
      const mx = (a.x + b.x) / 2 + (a.rank % 2 ? 14 : -14)
      const my = (a.y + b.y) / 2 - (Math.abs(a.x - b.x) > 260 ? 46 : 22)
      const seed = idSeed(`${L.a}>${L.b}`, 0)
      const wA = KIND_STYLE[a.kind as WorldKind].baseW
      const wB = KIND_STYLE[b.kind as WorldKind].baseW
      const fibres: WorldLink['fibres'] = []
      let primA: [number, number][] = []
      let primB: [number, number][] = []
      for (let f = 0; f < L.strength; f++) {
        const off = (f - (L.strength - 1) / 2) * 9
        const fA = fibrePaths([a.x, a.y], [mx, my], seed + f * 7 + 3, off, wA)
        const fB = fibrePaths([b.x, b.y], [mx, my], seed + f * 7 + 19, off, wB)
        if (f === 0) {
          primA = fA.pts
          primB = fB.pts
        }
        fibres.push({ ...fA.main, side: 'a' }, ...fA.twigs.map((t) => ({ ...t, side: 'a' as const })))
        fibres.push({ ...fB.main, side: 'b' }, ...fB.twigs.map((t) => ({ ...t, side: 'b' as const })))
      }
      return {
        a: L.a,
        b: L.b,
        strength: L.strength,
        color: later.lens ? ('lens' as const) : ('ink' as const),
        lens: later.lens ?? a.lens ?? b.lens,
        fibres,
        synapse: { x: mx, y: my, r: 2.2 + L.strength * 0.5 },
        pulseD: spline([...primA, ...primB.slice(0, -1).reverse()], 0.3),
      }
    })

  // the skeleton: the CareerGraph language, horizontal. Straight lane runs,
  // one clean S-curve per fork/merge, open ring tips, NOW on the main line,
  // the ONE red LIVE tip on the self-employed lane.
  const XL = X0 - 90
  const XR = w - 60
  const forkX = new Map<WorldLane, number>()
  for (const [id, lane] of Object.entries(LANE_FORKS)) {
    const m = byId.get(id)
    if (!m) throw new Error(`worldGraph: fork milestone '${id}' missing from the registry.`)
    forkX.set(lane, m.x)
  }
  const mergeX = byId.get(SOMA_MERGE_AT)?.x ?? XR
  const hcurve = (x1: number, y1: number, x2: number, y2: number) => {
    const k = Math.min(46, Math.max(18, Math.abs(y1 - y2) * 0.6))
    return `C ${x1 + k} ${y1} ${x2 - k} ${y2} ${x2} ${y2} `
  }
  const Y = LANE_Y
  const lanes: WorldSkeleton['lanes'] = [
    { id: 'mainline', d: `M ${XL} ${Y.main} L ${XR - 14} ${Y.main}`, main: true },
    {
      id: 'self',
      d: `M ${forkX.get('self')! - 56} ${Y.main} ${hcurve(forkX.get('self')! - 56, Y.main, forkX.get('self')!, Y.self)}L ${XR - 44} ${Y.self}`,
      main: false,
    },
    {
      id: 'soma',
      d: `M ${forkX.get('soma')! - 56} ${Y.main} ${hcurve(forkX.get('soma')! - 56, Y.main, forkX.get('soma')!, Y.soma)}L ${mergeX - 80} ${Y.soma} ${hcurve(mergeX - 80, Y.soma, mergeX - 14, Y.main)}`,
      main: false,
    },
    {
      id: 'dyn',
      d: `M ${forkX.get('dyn')! - 56} ${Y.main} ${hcurve(forkX.get('dyn')! - 56, Y.main, forkX.get('dyn')!, Y.dyn)}L ${XR - 14} ${Y.dyn}`,
      main: false,
    },
    {
      id: 'macad',
      d: `M ${forkX.get('macad')! - 56} ${Y.main} ${hcurve(forkX.get('macad')! - 56, Y.main, forkX.get('macad')!, Y.macad)}L ${XR - 14} ${Y.macad}`,
      main: false,
    },
  ]

  const years: WorldSkeleton['years'] = []
  const seen = new Set<string>()
  placed.forEach((p) => {
    const yr = p.date.slice(0, 4)
    if (seen.has(yr)) return
    seen.add(yr)
    years.push({ x: X0 + (p.rank + 0.5) * STEP - 34, label: yr })
  })

  const skeleton: WorldSkeleton = {
    lanes,
    tips: [
      { x: XR - 14, y: Y.main, live: false },
      { x: XR - 14, y: Y.dyn, live: false },
      { x: XR - 14, y: Y.macad, live: false },
    ],
    nowAt: { x: XR - 24, y: Y.main - 10 },
    liveTip: { x: XR - 14, y: Y.self },
    years,
  }

  return { w, h: WORLD_H, nodes, links, skeleton, mainY: Y.main }
}

// One shared instance: the layout is deterministic, build once per session.
export const WORLD = buildWorld()
