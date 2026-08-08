// THE FOLD (Emilie's pick, 2026-08-07): choosing a neuron closes the empty time.
//
// THE PROBLEM. A neighbour can live 3,000 world units away — `what an llm
// actually is` sits 3,510 from Sensi, nine phone screens — so choosing a node
// showed you threads leaving the frame toward things you then had to hunt for.
// At 390px you see 7% of a 5,355px map.
//
// WHY NOT SIMPLY ZOOM OUT, which was the first instinct and is the more honest
// claim: it was measured against this same data and it costs scale 0.19 with
// labels blown from 9.5 to 38.4 just to stay readable. The fold takes out 47%
// of the width first — because almost all of the distance between a node and
// its neighbours is YEARS WITH NOTHING IN THEM — so the camera only has to give
// up 0.35, and the names need three lanes instead of five.
//
// ⚠ THE FINDING THAT SHAPED THE WHOLE THING, and it is not obvious:
// SPREADING NODES APART CANNOT FIX LABEL COLLISION. Push them apart and a
// fit-to-frame camera must pull back by the same factor, so the names collide
// exactly as much; the iteration converges on nothing. Measured before it was
// believed. The only real fixes are fewer labels, shorter labels, or stacking
// the names into LANES — which is why the lane solver below exists and is not
// a nicety.
//
// WHAT IT NEVER DOES. The subject does not move: everything happens around it,
// which is what makes the move undoable in your head. No node changes height —
// height is the axis that now means relatedness, so it is the one thing the
// fold refuses to borrow against. And nothing here touches the frozen layout:
// this is a view, computed per choice, thrown away on release.
import { framedArmLength } from './nearMisses'
import {
  idSeed,
  indexObstacles,
  KIND_STYLE,
  reachFibres,
  weave,
  WORLD,
  type Obstacle,
  type WorldNode,
} from './worldGraph'

/** Where NeuralWorld actually puts a label's baseline. Kept next to the solver
 *  that has to agree with it; if the render ever moves, this moves with it. */
export function labelBaseline(n: WorldNode): number {
  return n.kind === 'milestone' ? n.y + 18 : n.y + KIND_STYLE[n.kind].r + 18
}

/** World units between two folded neighbours. Small on purpose: the lanes, not
 *  the spacing, are what stop the labels touching, and every extra unit here is
 *  paid for twice over by the camera having to pull further back. */
const GAP = 205
/** The label size the map rests at (index.css, `.nw-lbl.p`). */
const BASE_FONT = 9.5
/** Monospace advance, measured off the rendered map rather than assumed. */
/** Fallback advance, used only when a label has not been rendered yet and so
 *  cannot be measured.
 *
 *  ⚠ ESTIMATING THIS AT ALL WAS THE MISTAKE, and it took three goes to see it.
 *  0.62 was 24% too narrow; measuring 40 rendered labels gave a median of 0.818
 *  so 0.88 looked safe; then measuring INSIDE a fold showed the real spread is
 *  0.395 for a serif thought name against ~0.8 for a mono uppercase one — the
 *  map draws its four kinds in different faces. No single number can serve a 2x
 *  spread: too small and names collide, too large and the box inflates, the
 *  camera drops, and everything crowds anyway. So the solver takes a MEASURED
 *  width per label and this constant is only the cold-start guess. */
const CHAR_W = 0.7
const LANE_STEP = 1.42 // multiples of the font size
/** Her ask, in her words: "make their text bigger". A folded name is 25% larger
 *  than the same name at rest — enough to feel chosen, small enough that twelve
 *  of them still fit a 390px frame. */
export const LABEL_GROW = 1.25

export interface FoldMember {
  node: WorldNode
  /** How far this one slides sideways. Zero for the subject, always. */
  dx: number
  /** How far it slides ACROSS relatedness. Zero unless the fold is stretching
   *  that axis to fill a turned frame; zero for the subject, always. */
  dy: number
  /** Which label row it sits in, 0 = closest to the mark. */
  lane: number
  /** A signed thread, an unmade one, or the subject itself. */
  rel: 'thread' | 'near' | 'self'
}

export interface FoldPlan {
  subject: string
  members: FoldMember[]
  /** The folded bounding box, world units. */
  box: { x0: number; x1: number; y0: number; y1: number }
  /** The threads between FOLDED positions. The baked fibres cannot follow a
   *  node that slides, so while folded they hide and these draw — WOVEN by the
   *  same `weave` the resting map uses, never by a simpler curve. That was the
   *  whole of her objection to the first fold: "we lose the poetics of the
   *  connection and we just get plain strings." */
  links: {
    key: string
    fibres: { d: string; w: number }[]
    synapse: { x: number; y: number; r: number }
    strength: number
    /** The travel line, subject-end first. The fold runs it BACKWARDS so every
     *  pulse arrives at the chosen mark instead of leaving it. */
    pulseD: string
  }[]
  /** Two arms and a gap, in the same anatomy. Never dashed. */
  arms: { key: string; paths: { d: string; w: number }[] }[]
}

const BY_ID = new Map(WORLD.nodes.map((n) => [n.id, n]))

/** Everything that touches this node. Same source as the drawing, so the fold
 *  and the map can never disagree about who is a neighbour. */
export function membersOf(id: string): { node: WorldNode; rel: 'thread' | 'near' | 'self' }[] {
  const seen = new Set<string>([id])
  const out: { node: WorldNode; rel: 'thread' | 'near' | 'self' }[] = []
  const self = BY_ID.get(id)
  if (!self) return out
  out.push({ node: self, rel: 'self' })
  const push = (other: string, rel: 'thread' | 'near') => {
    if (seen.has(other)) return
    const n = BY_ID.get(other)
    if (!n) return
    seen.add(other)
    out.push({ node: n, rel })
  }
  for (const l of WORLD.links) {
    if (l.a === id) push(l.b, 'thread')
    else if (l.b === id) push(l.a, 'thread')
  }
  for (const r of WORLD.reaches) {
    if (r.a === id) push(r.b, 'near')
    else if (r.b === id) push(r.a, 'near')
  }
  return out
}

/**
 * @param id     the chosen node
 * @param scale  the camera scale the fold will be viewed at, which decides how
 *               wide a label is in WORLD units and therefore how many lanes are
 *               needed. Chicken and egg by nature: the caller fits the box once
 *               with a provisional scale, then calls again with the real one.
 */
export function planFold(
  id: string,
  scale: number,
  /** Real rendered width of a node's label at a given font size, in world
   *  units. Supplied by the view, which can read it off the DOM. */
  measure?: (nodeId: string, font: number) => number | undefined,
  /** STRETCH THE RELATEDNESS AXIS (Emilie, 2026-08-08, looking at a turned
   *  fold: "it can definitely be stretched sideways for the threads /
   *  connections to be clearer").
   *
   *  The fold has always slid its members along TIME to close the empty years.
   *  Turned, time is the axis running DOWN a 537px frame and relatedness is the
   *  one running across a 390px one — and relatedness was left at its raw
   *  values, which for one mark's neighbourhood span perhaps 50px. So the
   *  camera spent the height and left the width empty, and every thread ran
   *  down the same narrow corridor, on top of the others.
   *
   *  This is the same kind of move `dx` already is: a LINEAR stretch about the
   *  subject, so the order of the neighbourhood and the ratios between its
   *  gaps both survive exactly. It is a lens, not a re-layout — nothing is
   *  reordered and nothing is invented.
   *
   *  1 leaves the axis alone, which is what the flat map always passes. */
  spreadY = 1,
): FoldPlan | null {
  const raw = membersOf(id)
  // A LONE NODE STILL ANSWERS. Refusing to fold below two members made the
  // click dead on Falcon Square, The Encounter and Verve City Walk — the three
  // orphans she ruled on — and on every milestone without an award. A fold of
  // one is a gentle zoom onto the mark with its name and its door, and it tells
  // the truth: this one is not joined to anything yet.
  if (!raw.length) return null

  // slide: close every gap to GAP, in time order
  const ordered = [...raw].sort((p, q) =>
    p.node.x !== q.node.x ? p.node.x - q.node.x : p.node.id < q.node.id ? -1 : 1,
  )
  const target = new Map<string, number>()
  let cursor = ordered[0]!.node.x
  ordered.forEach((m, i) => {
    if (i > 0) cursor += GAP
    target.set(m.node.id, cursor)
  })
  // THE SUBJECT IS THE ANCHOR. Re-zero on it so it does not move a pixel, which
  // is what lets the eye keep hold of where it was.
  const anchor = target.get(id)! - BY_ID.get(id)!.x
  const dxOf = (m: WorldNode) => target.get(m.id)! - m.x - anchor
  // The subject anchors both axes: it does not move a pixel on either.
  const selfY = BY_ID.get(id)!.y
  const dyOf = (m: WorldNode) => (m.y - selfY) * (spreadY - 1)
  const fyOf = (m: WorldNode) => m.y + dyOf(m)

  // LANES, solved greedily rather than by a modulus cycle. A cycle was tried and
  // measured: it still left 2 overlapping pairs out of 66, because it takes no
  // account of the nodes' own heights. Walk left to right, drop each label into
  // the LOWEST lane whose last occupant has already ended.
  const font = (BASE_FONT * LABEL_GROW) / scale
  const lane = new Map<string, number>()
  // The label extents matter as much as the node positions: a wide name on the
  // end node hangs past it, and fitting the camera to the DOTS alone pushed
  // "what an llm actually is" clean off a 390px frame.
  let labX0 = Infinity
  let labX1 = -Infinity

  // ⚠ LANES ARE NOT ROWS, and assuming they were is what left four names
  // overlapping at 390px. A lane is an OFFSET, and every node applies it to its
  // own height — so two labels three lanes apart still collide if their nodes
  // happen to sit that far apart vertically. The only correct test is the one
  // the eye makes: do these two rectangles intersect. So keep the placed boxes
  // and check against all of them.
  const placed: { x0: number; x1: number; y0: number; y1: number }[] = []
  const hits = (a: (typeof placed)[number], b: (typeof placed)[number]) =>
    a.x1 > b.x0 && b.x1 > a.x0 && a.y1 > b.y0 && b.y1 > a.y0
  for (const m of ordered) {
    const label = m.node.mapLabel ?? m.node.title
    const measured = measure?.(m.node.id, font)
    const half = (measured ?? label.length * CHAR_W * font) / 2
    const cx = m.node.x + dxOf(m.node)
    const x0 = cx - half - font * 0.3
    const x1 = cx + half + font * 0.3
    if (cx - half < labX0) labX0 = cx - half
    if (cx + half > labX1) labX1 = cx + half
    let k = 0
    let box = { x0, x1, y0: 0, y1: 0 }
    // Bounded: past a dozen lanes the label is so far from its mark that a
    // leader would be needed, and the fold is the wrong answer for that node.
    // THE LABEL'S REAL BASELINE, not the node's centre. NeuralWorld draws it at
    // `y + r + 18` (and `y + 18` for a milestone), and r differs per kind — so
    // modelling it as the node's own y put every box out by 21 to 25 units and
    // left names touching that the solver believed it had cleared.
    const baseY = labelBaseline(m.node)
    for (; k < 14; k++) {
      const base = baseY + k * font * LANE_STEP
      // 1.30x the font, not 1.10: the rendered box measures 1.15 to 1.26 times
      // the font size depending on the face, and reserving 1.10 left names
      // touching by one or two pixels — solved on paper, wrong on the glass.
      box = { x0, x1, y0: base - font * 0.95, y1: base + font * 0.35 }
      if (!placed.some((p) => hits(p, box))) break
    }
    placed.push(box)
    lane.set(m.node.id, k)
  }

  const members: FoldMember[] = ordered.map((m) => ({
    node: m.node,
    dx: dxOf(m.node),
    dy: dyOf(m.node),
    lane: lane.get(m.node.id)!,
    rel: m.rel,
  }))

  const fx = (n: WorldNode) => n.x + dxOf(n)
  const fy = (n: WorldNode) => fyOf(n)
  const ys = members.map((m) => fy(m.node))
  // the lanes hang below the lowest mark, and the door hangs below those
  const deepest = Math.max(...members.map((m) => m.lane)) * font * LANE_STEP + font * 3.4
  const box = {
    x0: labX0,
    x1: labX1,
    y0: Math.min(...ys) - font,
    y1: Math.max(...ys) + deepest,
  }

  // WHAT THE FOLDED THREADS HAVE TO GET AROUND (Emilie 2026-08-07: "in the
  // isolated mode the thread/connections do not move through obstacle... so we
  // don't have text and thread overlap").
  //
  // The resting map has routed around its labels since the map rework: `weave`
  // takes an obstacle index and nudges its waypoints out of anything they land
  // in. The fold simply never passed one — so it drew the same anatomy with the
  // avoidance switched off, over names that are 25% LARGER than the resting
  // ones and stacked into lanes, which is the worst case for collisions rather
  // than the best.
  // The boxes have to be rebuilt here rather than reused, because nothing about
  // them survives the fold: every x has moved by dx, every baseline has dropped
  // by its lane, and every label has grown. `measure` gives the true rendered
  // width when the view can supply it, and CHAR_W is the cold-start guess.
  const obstacles: Obstacle[] = []
  for (const m of members) {
    const cx = fx(m.node)
    const base = labelBaseline(m.node) + dyOf(m.node) + m.lane * font * LANE_STEP
    const text = m.node.mapLabel ?? m.node.title
    const halfW = (measure?.(m.node.id, font) ?? text.length * font * CHAR_W) / 2
    obstacles.push({ x0: cx - halfW, y0: base - font * 0.95, x1: cx + halfW, y1: base + font * 0.35 })
    // the date rides one line under the name, always seven characters
    const dBase = base + font * 1.2
    const dHalf = (7 * font * 0.76) / 2
    obstacles.push({ x0: cx - dHalf, y0: dBase - font * 0.9, x1: cx + dHalf, y1: dBase + font * 0.3 })
    const r = KIND_STYLE[m.node.kind].r
    obstacles.push({ x0: cx - r, y0: fy(m.node) - r, x1: cx + r, y1: fy(m.node) + r })
  }
  const obs = indexObstacles(obstacles)

  const self = BY_ID.get(id)!
  const links: FoldPlan['links'] = []
  const arms: FoldPlan['arms'] = []
  const sharedWith = new Map<string, number>()
  for (const r of WORLD.reaches) {
    if (r.a === id) sharedWith.set(r.b, r.shared)
    else if (r.b === id) sharedWith.set(r.a, r.shared)
  }
  const strengthOf = new Map<string, number>()
  for (const l of WORLD.links) {
    if (l.a === id) strengthOf.set(l.b, l.strength)
    else if (l.b === id) strengthOf.set(l.a, l.strength)
  }
  for (const m of members) {
    if (m.rel === 'self') continue
    const a: [number, number] = [fx(self), fy(self)]
    const b: [number, number] = [fx(m.node), fy(m.node)]
    const wA = KIND_STYLE[self.kind].baseW
    const wB = KIND_STYLE[m.node.kind].baseW
    if (m.rel === 'thread') {
      // The SAME seed the resting map used, so a thread keeps its own hand
      // through the fold instead of being re-rolled into a stranger.
      const key = `${id}>${m.node.id}`
      const strength = strengthOf.get(m.node.id) ?? 1
      const w = weave(a, b, strength, idSeed(key, 0), wA, wB, self.rank % 2 ? 14 : -14, obs)
      links.push({ key, fibres: w.fibres, synapse: w.synapse, strength, pulseD: w.pulseD })
    } else {
      const key = `${id}~${m.node.id}`
      const seed = idSeed(key, 5)
      // The same grading as the resting map: the arms reach further when more of
      // the record agrees, and never far enough to meet. The fold is where this
      // actually reads — it is the one view that brings both ends near enough to
      // compare one gap against another.
      const dist = Math.hypot(b[0] - a[0], b[1] - a[1])
      const L = framedArmLength(sharedWith.get(m.node.id) ?? 3, dist)
      arms.push({
        key,
        paths: [...reachFibres(a, b, L, seed, wA), ...reachFibres(b, a, L, seed + 31, wB)],
      })
    }
  }
  return { subject: id, members, box, links, arms }
}

/** The two arms of an unmade synapse between two folded points, and the gap
 *  they leave. Kept here so the fold cannot accidentally draw a closed one. */
export function foldArm(
  from: readonly [number, number],
  to: readonly [number, number],
  len: number,
): string {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const d = Math.hypot(dx, dy) || 1
  // Never more than a third of the way, whatever the length asked for: the gap
  // is the claim, and at close range a fixed arm would close it.
  const L = Math.min(len, d / 3)
  return `M ${from[0].toFixed(1)} ${from[1].toFixed(1)} L ${(from[0] + (dx / d) * L).toFixed(1)} ${(from[1] + (dy / d) * L).toFixed(1)}`
}
