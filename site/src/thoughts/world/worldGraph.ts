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
  nearMissNeighbours,
  armLength,
  nearMissPairs,
  type NearMiss,
} from './nearMisses'
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

export function idSeed(id: string, salt: number): number {
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
  /** the stroke width this kind's THREADS are drawn at */
  baseW: number
  /** soma radius */
  r: number
}

// THE DENDRITES ARE CUT (Emilie, 2026-08-07). Every neuron used to grow four to
// seven wandering branches that connected to nothing — roughly 650 of the
// ~2,250 paths on the page, and the organic half of the ruler-and-nerve
// contract. They went for one reason, and it is not weight: the map now draws
// what is CLOSE BUT NOT JOINED, and the only honest mark for that is an arm
// that reaches out and stops. A neuron already covered in arms that reach out
// and stop makes that mark unreadable. The two could not both exist, so the one
// that means something stayed.
// The contrast survives where it always lived: a milestone is a bare commit dot
// at r 2.6, a project a filled soma at 7.2, so the ruler is still geometric and
// the mind still grows things.
export const KIND_STYLE: Record<'project' | 'thought' | 'award' | 'milestone', KindStyle> = {
  project: { baseW: 1.6, r: 7.2 },
  thought: { baseW: 1.3, r: 5.2 },
  award: { baseW: 0.9, r: 5.2 },
  milestone: { baseW: 0.8, r: 2.6 },
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

/** A rectangle a thread should not run through: a label, a date, or a soma. */
export interface Obstacle {
  x0: number
  y0: number
  x1: number
  y1: number
}

// LABEL METRICS, MEASURED OFF THE RENDERED MAP, not estimated. The four kinds
// are set in two different faces and the difference is nearly 2x, which is the
// same trap that cost three attempts in the fold's lane solver:
//   project   Martian Mono 9.5px, uppercase, 0.1em   advance 0.80  height 12
//   thought   Source Serif 4 italic 12.5px           advance 0.455 height 17.9
//   award     Martian Mono 9px, uppercase            advance 0.781 height 12
//   milestone Martian Mono 9px, uppercase            advance 0.78  height 12
//   the date  9px                                    advance 0.76  height 12
// Exported because the TURNED map needs them too: a name centred under its
// mark has to know its own width before it can be kept inside a 390px frame,
// and every kind is set in a different face at a different size.
export const LABEL_METRIC: Record<WorldKind, { size: number; adv: number; h: number }> = {
  project: { size: 9.5, adv: 0.8, h: 12 },
  thought: { size: 12.5, adv: 0.455, h: 17.9 },
  award: { size: 9, adv: 0.781, h: 12 },
  milestone: { size: 9, adv: 0.78, h: 12 },
}
export const DATE_METRIC = { size: 9, adv: 0.76, h: 12 }

/** Where NeuralWorld puts a node's label baseline. */
export function labelY(kind: WorldKind, y: number): number {
  return kind === 'milestone' ? y + 18 : y + KIND_STYLE[kind].r + 18
}

/** The boxes a thread has to get around: every label, every date, every soma. */
export function obstaclesFor(
  nodes: ReadonlyArray<{ id: string; kind: WorldKind; x: number; y: number; title: string; mapLabel?: string; labelDx?: number; labelDy?: number }>,
): Obstacle[] {
  const out: Obstacle[] = []
  for (const n of nodes) {
    const m = LABEL_METRIC[n.kind]
    const text = n.mapLabel ?? n.title
    const cx = n.x + (n.labelDx ?? 0)
    const ly = labelY(n.kind, n.y) + (n.labelDy ?? 0)
    const halfW = (text.length * m.adv * m.size) / 2
    out.push({ x0: cx - halfW, y0: ly - m.h * 0.8, x1: cx + halfW, y1: ly + m.h * 0.25 })
    const dy = ly + 12
    const dHalf = (7 * DATE_METRIC.adv * DATE_METRIC.size) / 2
    out.push({ x0: cx - dHalf, y0: dy - DATE_METRIC.h * 0.8, x1: cx + dHalf, y1: dy + DATE_METRIC.h * 0.25 })
    const r = KIND_STYLE[n.kind].r
    out.push({ x0: n.x - r, y0: n.y - r, x1: n.x + r, y1: n.y + r })
  }
  return out
}

/**
 * PUSH THE WAYPOINTS OUT OF ANYTHING THEY LAND IN (Emilie, 2026-08-07: the
 * threads "cannot overlap with text and other nodes, so it would kind of go
 * around them").
 *
 * MEASURED FIRST: 97 of the 740 fibres (13.1%) ran through a label or a date,
 * and 25 (3.4%) through an unrelated soma. So this is a polish pass, not a
 * rebuild — which is why it is a local nudge of the existing waypoints rather
 * than a routing algorithm. A visibility graph would give exact clearance and
 * mechanical paths, and mechanical is the one thing this drawing must not be.
 *
 * Vertical exits are preferred over horizontal at nearly 2:1. A label is wide
 * and short, so leaving sideways means running the whole length of the word to
 * get out, while hopping over or under it is a small deflection — and a thread
 * that arcs over a name reads as a thread avoiding it, which is the poetics she
 * is protecting.
 *
 * The ENDPOINTS never move: a fibre has to start on its soma and end at its
 * synapse, or it stops being a connection between those two things.
 */
/** Obstacles bucketed by x so a waypoint only tests its own neighbourhood.
 *  Without it this is 740 fibres x 40 points x 3 passes x 168 boxes = 15M
 *  checks at module load; with it, under a million. */
const BUCKET = 220
export type ObstacleIndex = Map<number, Obstacle[]>
export function indexObstacles(obs: readonly Obstacle[]): ObstacleIndex {
  const m: ObstacleIndex = new Map()
  for (const b of obs) {
    const lo = Math.floor((b.x0 - 8) / BUCKET)
    const hi = Math.floor((b.x1 + 8) / BUCKET)
    for (let k = lo; k <= hi; k++) {
      const list = m.get(k)
      if (list) list.push(b)
      else m.set(k, [b])
    }
  }
  return m
}

/**
 * RESAMPLE, then push. The first version moved only the seven seeded waypoints
 * and it barely helped: 13.1% of fibres crossing type became 10.7%, because on
 * a 1,500-unit thread those points sit ~250 apart while a label is ~140 wide,
 * so most crossings were happening BETWEEN the points being tested. Densifying
 * to a fixed spacing first is what makes the test see what the eye sees.
 */
export function densify(pts: [number, number][], step = 34): [number, number][] {
  if (pts.length < 2) return pts
  const out: [number, number][] = [pts[0]!]
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!
    const b = pts[i]!
    const d = Math.hypot(b[0] - a[0], b[1] - a[1])
    const n = Math.max(1, Math.round(d / step))
    for (let k = 1; k <= n; k++) {
      const t = k / n
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
    }
  }
  return out
}

export function avoid(pts: [number, number][], idx: ObstacleIndex, margin = 10): void {
  if (!idx.size || pts.length < 3) return
  for (let pass = 0; pass < 5; pass++) {
    for (let i = 1; i < pts.length - 1; i++) {
      const p = pts[i]!
      const near = idx.get(Math.floor(p[0] / BUCKET))
      if (!near) continue
      for (const b of near) {
        const x0 = b.x0 - margin
        const x1 = b.x1 + margin
        const y0 = b.y0 - margin
        const y1 = b.y1 + margin
        if (p[0] <= x0 || p[0] >= x1 || p[1] <= y0 || p[1] >= y1) continue
        const up = p[1] - y0
        const down = y1 - p[1]
        const left = p[0] - x0
        const right = x1 - p[0]
        const vert = Math.min(up, down)
        const horz = Math.min(left, right)
        if (vert <= horz * 1.8) p[1] = up < down ? y0 : y1
        else p[0] = left < right ? x0 : x1
      }
    }
  }
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
  obs?: ObstacleIndex,
  route?: { margin?: number; step?: number },
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
  // The twigs branch off the ORIGINAL seven, so the anatomy keeps its shape;
  // only the main run is resampled and pushed.
  const routed = obs ? densify(pts, route?.step) : pts
  if (obs) avoid(routed, obs, route?.margin)
  const twigs: { d: string; w: number }[] = []
  const tw = 1 + Math.floor(rng() * 2)
  for (let k = 0; k < tw; k++) {
    const tp = pts[1 + Math.floor(rng() * (n - 2))]!
    const ang = Math.atan2(dy, dx) + (rng() < 0.5 ? 0.9 : -0.9) + (rng() - 0.5) * 0.4
    const out: [number, number][][] = []
    growBranch(tp[0], tp[1], ang, 16 + rng() * 10, rng, { wobble: 0.9, branch: 0.3, depth: 1 }, 1, out)
    out.forEach((bp) => twigs.push({ d: spline(bp), w: baseW * 0.6 }))
  }
  // k 0.3 -> 0.16 once routed: a loose cardinal spline overshoots its own
  // waypoints, which is how a path can dodge every point and still cut the
  // corner of a label.
  return { main: { d: spline(routed, obs ? 0.16 : 0.3), w: baseW }, twigs, pts }
}

/**
 * THE ONE WEAVER. Two somas in, one braided connection out: the fibres, the
 * synapse where they meet, and the pulse path that fires along them.
 *
 * ⚠ IT EXISTS BECAUSE THE FOLD DREW ITS OWN THREADS AND THEY WERE STRINGS.
 * Emilie, seeing the first fold beside a hovered neuron: "we lose the poetics of
 * the connection and this visual and we just get plain strings." She was right,
 * and the cause was that the folded view had its own quadratic-curve drawing
 * code instead of this one. A thread must be woven the same way wherever it is
 * drawn, or the map has two dialects and one of them is thinner.
 */
export function weave(
  a: readonly [number, number],
  b: readonly [number, number],
  strength: number,
  seed: number,
  wA: number,
  wB: number,
  /** which way the midpoint leans; the world uses the a-end's rank parity */
  lean: number,
  obs?: ObstacleIndex,
  /** How hard to steer around the obstacles. The FOLD needs more than the
   *  resting map: its names are 25% larger and stacked into lanes, so the same
   *  10-unit margin and 34-unit sampling left a third of its threads still
   *  crossing a word (measured: 28 of 82). */
  route?: { margin?: number; step?: number },
): { fibres: WorldLink['fibres']; synapse: { x: number; y: number; r: number }; pulseD: string } {
  const mx = (a[0] + b[0]) / 2 + lean
  const my = (a[1] + b[1]) / 2 - (Math.abs(a[0] - b[0]) > 260 ? 46 : 22)
  const fibres: WorldLink['fibres'] = []
  let primA: [number, number][] = []
  let primB: [number, number][] = []
  for (let f = 0; f < strength; f++) {
    const off = (f - (strength - 1) / 2) * 9
    const fA = fibrePaths(a, [mx, my], seed + f * 7 + 3, off, wA, obs, route)
    const fB = fibrePaths(b, [mx, my], seed + f * 7 + 19, off, wB, obs, route)
    if (f === 0) {
      primA = fA.pts
      primB = fB.pts
    }
    fibres.push({ ...fA.main, side: 'a' }, ...fA.twigs.map((t) => ({ ...t, side: 'a' as const })))
    fibres.push({ ...fB.main, side: 'b' }, ...fB.twigs.map((t) => ({ ...t, side: 'b' as const })))
  }
  return {
    fibres,
    synapse: { x: mx, y: my, r: 2.2 + strength * 0.5 },
    pulseD: spline([...primA, ...primB.slice(0, -1).reverse()], 0.3),
  }
}

/**
 * AN ARM THAT REACHES AND DOES NOT ARRIVE, in the same hand as a real thread.
 *
 * ⚠ THIS REPLACED A DASHED LINE, at her instruction and on the evidence of the
 * map itself: "if you check the first screenshot you can see how the neurons of
 * narkomfin and adjacency are almost touching but not quite, this is how the
 * potential connections should be drawn, not dashed. we should not lose the
 * science and poetics behind it."
 *
 * She is right about where the honesty lives. A dash is a diagram's way of
 * saying "provisional", borrowed from a language this drawing does not speak.
 * What says it here is THE GAP — two arms in the same anatomy, reaching, not
 * meeting, with no synapse between them. Nothing about that is less true than a
 * dash, and it is the only version that still looks like a mind.
 */
export function reachFibres(
  from: readonly [number, number],
  toward: readonly [number, number],
  len: number,
  seed: number,
  baseW: number,
  obs?: ObstacleIndex,
): { d: string; w: number }[] {
  const dx = toward[0] - from[0]
  const dy = toward[1] - from[1]
  const d = Math.hypot(dx, dy) || 1
  // Never past a third of the way: the gap is the claim, and a fixed arm would
  // close it on a close pair.
  const L = Math.min(len, d / 3)
  const stop: [number, number] = [from[0] + (dx / d) * L, from[1] + (dy / d) * L]
  const f = fibrePaths(from, stop, seed, 0, baseW, obs)
  return [f.main, ...f.twigs]
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
  labelAbove: boolean
  /** The SHORT map label for awards (S6-A, Emilie 2026-07-24): the map shows
   *  "issuer + AWARD"; the full recognition (title) rides the card + a11y. */
  mapLabel?: string
  /** A project still live + growing (registry `live`): the world marks it. */
  live?: boolean
  /** A label-ONLY nudge (px) for any resting label that still overlaps a
   *  neighbour (S6-A). Moves the title + date text only; the soma and the
   *  frozen x/y coordinates never move, so the snapshot stays valid. */
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

/** An unmade synapse: two arms that reach and stop, and the gap between them.
 *  Deliberately NOT a WorldLink — no synapse, no pulse, no direction, and no
 *  single path joining the ends. It never fired, so nothing here may be able to
 *  draw it as though it had. */
export interface WorldReach {
  a: string
  b: string
  shared: number
  /** What they have in common, for the card and the screen-reader path. */
  sharedIds: string[]
  /** A fixed-length arm out of each end, aimed at the other, woven in the same
   *  anatomy as a real thread. Not dashed: the GAP is what says "not yet". */
  armA: { d: string; w: number }[]
  armB: { d: string; w: number }[]
  /** How much clear space is left between the two arms, in world units. The
   *  guard asserts this stays above zero: the day it reaches zero the drawing is
   *  claiming a connection that does not exist. */
  gap: number
}

export interface World {
  w: number
  h: number
  nodes: WorldNode[]
  links: WorldLink[]
  /** Close, and not touching. */
  reaches: WorldReach[]
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
const SOLVE_PASSES = 24

// THE CORRIDOR IS A RESCALE, NOT A CLAMP (2026-08-07, and the clamp it replaces
// was measured before it was replaced).
//
// The barycentre solve is a DIFFUSION: replacing every y with a blend of its
// neighbours' has one trivial fixed point, which is "everybody at the same
// height". Twenty-four passes of it on a connected graph converge there, so the
// band pull and the hard clamp existed only to fight that convergence — and a
// clamp fights it by stacking. Counted off the frozen snapshot the map had
// shipped for a day: 18 of the 21 projects sat at EXACTLY y=330, the corridor
// floor, and the other three were the unthreaded ones that never moved at all.
// Free-node spread was 145px. Height carried almost no information.
//
// So the corridor stops clipping and starts SCALING. After each pass the solved
// values of a kind are mapped onto its corridor, which preserves the whole
// ORDER the relations decided while guaranteeing the row is as tall as it is
// allowed to be. Diffusion can no longer collapse anything, because a collapsed
// range is stretched straight back out.
//
// Measured, same 86 threads, before -> after:
//   free-node spread     145px -> 360px
//   thread crossings     346   -> 329   (straight chords, shared endpoints excluded)
//   distinct project ys  2     -> 19
// The compression was pure loss: the map got flatter AND crossed more.
const BAND_SPAN: Record<string, [number, number]> = {
  thought: [110, 290],
  project: [330, 470],
}
// The gap between the corridors (290 to 330) is what the eye reads as "these are
// two different things", and the legend's shape language rests on it.
//
// A near-miss pulls too, at a quarter of a real thread's weight. Nearness on the
// drawing is meant to agree with nearness in idea-space — that is the whole
// point of drawing an unmade connection — but a thread you actually signed must
// always win over one you have not.
const NEAR_PULL = 0.25

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

  // The unmade synapses, from the relation graph only. Computed HERE, before a
  // single coordinate exists, because the solve below uses them: a candidate set
  // that depended on positions would be deciding the positions that decided it.
  // Only thoughts and projects are eligible — an award is bound to one thing by
  // definition and a milestone is a date.
  const freeIds = new Set(byDate.filter((e) => e.kind === 'thought' || e.kind === 'project').map((e) => e.id))
  const nearMisses = nearMissPairs(freeIds)
  const nearNbr = nearMissNeighbours(nearMisses)

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
  // threads to — and, at a quarter weight, of the things it ALMOST threads to.
  // Milestones are pinned; awards are placed in pass 2 against their anchor.
  const free = placed.filter((p) => p.kind === 'thought' || p.kind === 'project')
  const byKind = {
    thought: free.filter((p) => p.kind === 'thought'),
    project: free.filter((p) => p.kind === 'project'),
  }
  for (let pass = 0; pass < SOLVE_PASSES; pass++) {
    const snapshot = new Map(placed.map((p) => [p.id, p.y]))
    for (const p of free) {
      const ns = (nbr.get(p.id) ?? []).filter((id) => byId.has(id))
      const near = (nearNbr.get(p.id) ?? []).filter((id) => byId.has(id))
      const weight = ns.length + near.length * NEAR_PULL
      if (!weight) continue
      const sum =
        ns.reduce((s, id) => s + (snapshot.get(id) ?? 0), 0) +
        near.reduce((s, id) => s + (snapshot.get(id) ?? 0), 0) * NEAR_PULL
      const mean = sum / weight
      p.y = p.y + (mean - p.y) * 0.5
    }
    // THE CORRIDOR IS APPLIED AS A RESCALE, EVERY PASS, and both halves of that
    // matter. Every pass, because the diffusion has to be undone as fast as it
    // happens — leaving it to the end lets the whole set converge on one value
    // first, and rescaling a collapsed range is division by nothing. As a
    // rescale, because clipping stacks nodes on the boundary (18 projects on
    // y=330) while scaling keeps every distinct height the relations produced.
    for (const kind of ['thought', 'project'] as const) {
      const g = byKind[kind]
      if (!g.length) continue
      const [lo, hi] = BAND_SPAN[kind]!
      let min = Infinity
      let max = -Infinity
      for (const p of g) {
        if (p.y < min) min = p.y
        if (p.y > max) max = p.y
      }
      if (max - min < 1e-6) {
        // Fully collapsed (or a single node): spread them evenly rather than
        // divide by zero. Deterministic, because `g` is in rank order.
        g.forEach((p, i) => (p.y = g.length === 1 ? (lo + hi) / 2 : lo + ((hi - lo) * i) / (g.length - 1)))
        continue
      }
      for (const p of g) p.y = lo + ((p.y - min) / (max - min)) * (hi - lo)
    }
  }
  for (const p of free) p.y = Math.round(p.y * 10) / 10

  // pass 2: awards snap beside the work (or milestone) they honour.
  // 58 below, not 64: the project corridor now reaches 470 instead of stacking
  // at 330, so the lowest award sits at 528 and its label lands ~546. The first
  // career lane is at 560. Six pixels of that clearance came from the offset.
  placed.forEach((p) => {
    if (p.kind !== 'award') return
    const anchor = anchorIdOf(p)
    const a = anchor ? byId.get(anchor) : undefined
    if (a) {
      p.x = a.x + 42
      p.y = a.kind === 'milestone' ? a.y - 74 : a.y + 58
    }
  })

  // THE THINGS THREADS HAVE TO GET AROUND. Built here, after pass 2, because it
  // needs every final position — including the awards, which only take theirs
  // once their anchor has one.
  const obstacles = indexObstacles(obstaclesFor(
    placed.map((p) => ({
      id: p.id,
      kind: p.kind as WorldKind,
      x: p.x,
      y: p.y,
      title: p.title,
      mapLabel: p.kind === 'award' ? AWARD_SHORT[p.id] : undefined,
      labelDx: LABEL_NUDGE[p.id]?.dx,
      labelDy: LABEL_NUDGE[p.id]?.dy,
    })),
  ))

  // the unmade synapses, now that both ends have a place to reach FROM.
  // A fixed arm out of each end and whatever is left in between; the gap is
  // recorded rather than assumed, because a guard has to be able to fail on it.
  const reaches: WorldReach[] = nearMisses.flatMap((m: NearMiss) => {
    const a = byId.get(m.a)
    const b = byId.get(m.b)
    if (!a || !b) return []
    const seed = idSeed(`${m.a}~${m.b}`, 5)
    const wA = KIND_STYLE[a.kind as WorldKind].baseW
    const wB = KIND_STYLE[b.kind as WorldKind].baseW
    const dist = Math.hypot(b.x - a.x, b.y - a.y)
    // graded by how much the rest of the map agrees
    const L = armLength(m.shared.length, dist)
    return [
      {
        a: m.a,
        b: m.b,
        shared: m.shared.length,
        sharedIds: m.shared,
        armA: reachFibres([a.x, a.y], [b.x, b.y], L, seed, wA, obstacles),
        armB: reachFibres([b.x, b.y], [a.x, a.y], L, seed + 31, wB, obstacles),
        gap: Math.round((dist - L * 2) * 10) / 10,
      },
    ]
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
      const w = weave(
        [a.x, a.y],
        [b.x, b.y],
        L.strength,
        idSeed(`${L.a}>${L.b}`, 0),
        KIND_STYLE[a.kind as WorldKind].baseW,
        KIND_STYLE[b.kind as WorldKind].baseW,
        a.rank % 2 ? 14 : -14,
        obstacles,
      )
      return {
        a: L.a,
        b: L.b,
        strength: L.strength,
        color: later.lens ? ('lens' as const) : ('ink' as const),
        lens: later.lens ?? a.lens ?? b.lens,
        ...w,
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

  return { w, h: WORLD_H, nodes, links, reaches, skeleton, mainY: Y.main }
}

// One shared instance: the layout is deterministic, build once per session.
export const WORLD = buildWorld()
