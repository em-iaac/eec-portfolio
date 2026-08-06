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
// One chronological rank = one horizontal step. Sized to the SPATIAL SCALE
// (S6-A, Emilie 2026-07-24): at 78 the step was ~57% of the median label width
// (137px), so 90% of time-neighbours could not sit side by side and the layout
// leaned on vertical stagger, which is what kept crowding the labels. 130 lets a
// typical label fit between neighbours, so spacing does the de-crowding
// structurally. Still a FIXED step per rank (append-safe): new work extends the
// right edge, no shipped rank's spacing changes.
export const STEP = 130
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
  /** The SHORT map label for awards (S6-A, Emilie 2026-07-24): the map shows
   *  "issuer + AWARD"; the full recognition (title) rides the card + a11y. */
  mapLabel?: string
  /** A project still live + growing (registry `live`): the world marks it. */
  live?: boolean
  /** A label-ONLY nudge (px) for any resting label that still overlaps a
   *  neighbour (S6-A). Moves the title + date text only; the soma, dendrites
   *  and frozen x/y coordinates never move, so the snapshot stays valid. */
  labelDx?: number
  labelDy?: number
  style: KindStyle
}

// THE SHORT AWARD LABELS (S6-A, Emilie 2026-07-24, "issuer + AWARD"): awards
// stay their own star node beside the project, but the MAP label is trimmed so
// it no longer repeats the project name nor sprawls over neighbours; the full
// recognition still reads in the card + the screen-reader list. draftCopy
// (wording unsigned), keyed by award id.
const AWARD_SHORT: Record<string, string> = {
  'sensi-macad-award': 'MaCAD AWARD',
  'legoarch-jury': 'AIA JURY',
  'lungs-award': 'BIMSC AWARD',
  'huddle-award': 'ACESD AWARD',
  'mars-top50': 'TOP 50',
  tamayouz: 'TAMAYOUZ TOP 100',
  cemetery: 'CEMETERY FINALIST',
}

// Residual label nudges (label-only, snapshot-safe). Re-derived live after the
// award short-labels + always-below landed: dropping the above/below stagger
// left three same-lane touches. Each pushes ONE label of a pair down to clear.
const LABEL_NUDGE: Record<string, { dx?: number; dy?: number }> = {
  cemetery: { dy: 16 }, // clears XR for Education
  cappelletti: { dy: 14 }, // clears Chair Simulation
  'huddle-award': { dy: 14 }, // clears Tsukiji Fish Market
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

// ---- placement by relation, not by kind (Emilie's ruling 2026-08-06) --------
//
// Her brief, verbatim: "there should be no rule on whether the thoughts come
// before or after the project, it should be date based, and based on the
// correlation to the other projects and thoughts ... this will also help read
// things."
//
// WHAT THIS REPLACES. Ties inside a month used to break on kind, alphabetically
// (award < milestone < project < thought), so thoughts always landed last in
// their month whatever they were connected to. And y was a sine of the node's
// RANK, which is a decorative wave: a node's height said nothing about what it
// was threaded to, so a fibre's length and direction were accidents.
//
// WHAT IT IS NOW. This is a layered graph drawing, which is the standard shape
// for a graph whose one axis is fixed:
//   · The LAYER is the month. Time owns x and nothing here may move it.
//   · Within a layer, and then for y, each node is pulled to the BARYCENTRE of
//     its neighbours: the average position of the things it actually threads to.
//     That is the classic crossing-reduction heuristic, and it is exactly her
//     sentence: adjacency sits in relation to narkomfin and urban-risk.
//
// THREE PROPERTIES IT HAS TO KEEP, and all three are load-bearing here:
//   · DETERMINISTIC. No randomness in the solve, fixed iteration count, ties
//     broken by id. The frozen snapshot and the prerender both depend on this.
//   · The KIND BANDS SURVIVE as a soft prior, not a rule. Thoughts still tend
//     high and projects low, so the map still reads in rows at a glance, but a
//     well-connected node is allowed to leave its band to be near its
//     neighbours. The band is where a node starts, not where it must stay.
//   · MILESTONES DO NOT MOVE. They ride the career lanes (LANE_Y) and the
//     skeleton is drawn from them, so they are pinned and act as anchors.
const BAND_Y: Record<string, number> = { thought: 195, project: 395, award: 520 }
const BAND_PULL = 0.22 // how hard a node is held to its own row
const SOLVE_PASSES = 24

// THE BANDS ARE A CLAMP, NOT ONLY A PULL, and that was found by measuring.
// With the pull alone the solve collapsed the free nodes from a 363px spread to
// 170px: every thought is threaded to projects and every project to thoughts, so
// both rows converged on the middle and the map became one flat stripe. The
// legend's whole shape language depends on the rows staying apart.
// So each kind keeps a corridor and relation decides where inside it a node
// sits. The corridors do not touch, and the gap between them (300 to 330) is
// what the eye reads as "these are two different things".
const BAND_RANGE: Record<string, [number, number]> = {
  thought: [100, 300],
  project: [330, 500],
}

/** Neighbours of each id, from the one source of relations (CORRELATIONS). */
function neighbourMap(ids: Set<string>): Map<string, string[]> {
  const m = new Map<string, string[]>()
  const add = (a: string, b: string) => {
    if (!ids.has(a) || !ids.has(b)) return
    const list = m.get(a)
    if (list) list.push(b)
    else m.set(a, [b])
  }
  for (const [a, b] of CORRELATIONS) {
    add(a, b)
    add(b, a)
  }
  // An award is bound to the thing it honours, which is a relation too.
  return m
}

export function buildWorld(): World {
  // Ascending time walk over the world kinds. timelineEntries() sorts DESC by
  // date (stable); the reverse gives ASC.
  const byDate = timelineEntries()
    .filter((e) => WORLD_KINDS.has(e.kind))
    .reverse()
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id < b.id ? -1 : 1))

  const ids = new Set(byDate.map((e) => e.id))
  const nbr = neighbourMap(ids)

  // A first ordinal, id-broken, so every node has a position to average from.
  const seedRank = new Map<string, number>()
  byDate.forEach((e, i) => seedRank.set(e.id, i))

  // ORDER WITHIN EACH MONTH, by the barycentre of a node's neighbours' ranks.
  // A node with no threads keeps its id order, so the result is stable and a
  // lone node never drifts. Two passes: the second sees the first's result.
  const months = [...new Set(byDate.map((e) => e.date))]
  let cast = byDate
  for (let pass = 0; pass < 2; pass++) {
    const rank = new Map(cast.map((e, i) => [e.id, i]))
    const next: typeof byDate = []
    for (const month of months) {
      const group = cast.filter((e) => e.date === month)
      const scored = group.map((e) => {
        const ns = nbr.get(e.id) ?? []
        const bary = ns.length
          ? ns.reduce((s, id) => s + (rank.get(id) ?? seedRank.get(id) ?? 0), 0) / ns.length
          : rank.get(e.id)!
        return { e, bary }
      })
      scored.sort((p, q) => (p.bary !== q.bary ? p.bary - q.bary : p.e.id < q.e.id ? -1 : 1))
      next.push(...scored.map((s) => s.e))
    }
    cast = next
  }

  const w = X0 + cast.length * STEP + MARGIN_R
  const byId = new Map<string, RegistryEntry & { x: number; y: number; rank: number }>()

  // pass 1: rank + x, and a starting y from the node's own band
  const placed = cast.map((e, rank) => {
    const x = X0 + (rank + 0.5) * STEP
    let y: number
    if (e.kind === 'milestone') y = LANE_Y[laneOf(e)]
    else y = BAND_Y[e.kind] ?? 520
    const p = Object.assign({}, e, { x, y, rank })
    byId.set(e.id, p)
    return p
  })

  // pass 1b: SOLVE y. Each free node relaxes toward the mean y of the things it
  // threads to, held back toward its own band so the rows stay legible.
  // Milestones are pinned; awards are placed in pass 2 against their anchor.
  const free = placed.filter((p) => p.kind === 'thought' || p.kind === 'project')
  for (let pass = 0; pass < SOLVE_PASSES; pass++) {
    const snapshot = new Map(placed.map((p) => [p.id, p.y]))
    for (const p of free) {
      const ns = (nbr.get(p.id) ?? []).filter((id) => byId.has(id))
      if (!ns.length) continue
      const mean = ns.reduce((s, id) => s + (snapshot.get(id) ?? 0), 0) / ns.length
      const band = BAND_Y[p.kind] ?? 395
      const next = p.y + (mean - p.y) * (1 - BAND_PULL) * 0.5 + (band - p.y) * BAND_PULL * 0.5
      // Clamp INSIDE the loop, not after it: a node that is allowed to drift out
      // of its corridor mid-solve drags its neighbours with it, and the rows end
      // up merged even if the final positions are clipped back.
      const [lo, hi] = BAND_RANGE[p.kind] ?? [96, 500]
      p.y = Math.max(lo, Math.min(hi, next))
    }
  }
  for (const p of free) p.y = Math.round(p.y * 10) / 10

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
      // Labels always BELOW the dot (S6-A, Emilie 2026-07-24): one consistent
      // side reads calmer than the old above/below stagger.
      labelAbove: false,
      mapLabel: p.kind === 'award' ? AWARD_SHORT[p.id] : undefined,
      live: p.live,
      labelDx: LABEL_NUDGE[p.id]?.dx,
      labelDy: LABEL_NUDGE[p.id]?.dy,
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
