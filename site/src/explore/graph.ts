// Port of design_handoff_eec_portfolio/explore/data.js: the graph content and
// its DETERMINISTIC layout. Session 12 split it into TWO passes so the shipped
// constellation can be a stable landing surface AND grow safely:
//
//   PASS 1 (frozen). The 21 shipped nodes' coordinates + their mutual edges are
//   read back from frozen-layout.generated.ts (frozen by
//   scripts/freeze-explore-layout.mjs from the original seeded simulation). They
//   never move. `order`/tags of the shipped prefix stay layout INVARIANTS: the
//   snapshot test encodes them and CI fails on drift.
//
//   PASS 2 (append). Nodes appended past the frozen prefix (next `order`) are
//   placed from their own seed and relaxed against the frozen field with a
//   one-sided force pass: appendees move, the frozen 21 do not. A `standalone`
//   appendee is exempt from the implied-edge correction, so a future thought can
//   float unconnected instead of being force-wired to degree 2.
//
// EXPECTED_ID_ORDER is now a PREFIX check: legal appends (a 22nd node, next
// order) no longer throw; only a reorder/rename/tag-edit of the shipped 21 does.
// Pure module: no three.js, no DOM (Node-testable), so the poster generator and
// the freeze script can bundle it under Node.
import { EXPLORE_NODES } from '../data/registry'
import { LENS_TO_KEY, type LensKey } from './palette'
import { FROZEN_EDGES, FROZEN_ID_ORDER, FROZEN_NODES } from './frozen-layout.generated'

export interface GraphNode {
  id: string
  label: string
  kind: 'project' | 'thought'
  lens: LensKey
  tags: string[]
  i: number
  deg: number
  x: number
  y: number
  z: number
}

export interface GraphEdge {
  a: number
  b: number
  w: number
  implied: boolean
}

// The shipped prefix length. The registry's first FROZEN ids must equal
// FROZEN_ID_ORDER; anything past it is an append.
const FROZEN_COUNT = FROZEN_NODES.length

function mulberry32(a: number) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const overlap = (a: GraphNode, b: GraphNode) => a.tags.filter((t) => b.tags.includes(t)).length
const key = (a: string, b: string) => (a < b ? a + '|' + b : b + '|' + a)

export function makeGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const ids = EXPLORE_NODES.map((n) => n.id)
  // Prefix check (was an exact-equality check before Session 12). Appends extend
  // past FROZEN_COUNT; the shipped prefix stays frozen.
  if (ids.length < FROZEN_COUNT) {
    throw new Error(
      `EXPLORE layout invariant broken: ${ids.length} explore nodes, expected at least the ` +
        `${FROZEN_COUNT} frozen ones. Shipped explore entries must not be removed.`,
    )
  }
  if (ids.slice(0, FROZEN_COUNT).join('|') !== FROZEN_ID_ORDER) {
    throw new Error(
      'EXPLORE layout invariant broken: the frozen shipped prefix (order/ids) changed. ' +
        'The first ' +
        FROZEN_COUNT +
        ' explore nodes are frozen; new nodes must APPEND (next order). ' +
        'Fix the registry, or re-run scripts/freeze-explore-layout.mjs to intentionally re-seed.',
    )
  }

  const nodes: GraphNode[] = EXPLORE_NODES.map((n, i) => ({
    id: n.id,
    label: n.label,
    kind: n.kind,
    lens: LENS_TO_KEY[n.lens],
    tags: n.tags,
    i,
    deg: 0,
    x: 0,
    y: 0,
    z: 0,
  }))

  // ---- PASS 1: the frozen field ---------------------------------------------
  for (let i = 0; i < FROZEN_COUNT; i++) {
    const f = FROZEN_NODES[i]!
    const n = nodes[i]!
    n.x = f.x
    n.y = f.y
    n.z = f.z
  }
  const edges: GraphEdge[] = FROZEN_EDGES.map((e) => ({ a: e.a, b: e.b, w: e.w, implied: e.implied }))
  const seen = new Set<string>()
  edges.forEach((e) => seen.add(key(nodes[e.a]!.id, nodes[e.b]!.id)))

  // ---- PASS 2: appended nodes relax against the frozen field ----------------
  const appendees = nodes.slice(FROZEN_COUNT)
  if (appendees.length > 0) {
    // Placement is per-node and seed-stable, so adding node 23 never disturbs
    // node 22 (nor any frozen node): its seed is fixed by its append index.
    for (const n of appendees) {
      const rnd = mulberry32(20260706 + n.i)
      const u = rnd() * 2 - 1,
        th = rnd() * Math.PI * 2,
        r = 90 + rnd() * 30
      const s = Math.sqrt(1 - u * u)
      n.x = r * s * Math.cos(th)
      n.y = r * u
      n.z = r * s * Math.sin(th)
    }

    // Edges from each appendee to the nodes already placed before it (frozen
    // field first, then earlier appendees). Real (>=2 shared tags) edges always
    // form; the implied top-up to degree 2 is skipped for standalone nodes.
    const deg = new Array(nodes.length).fill(0)
    edges.forEach((e) => {
      deg[e.a]++
      deg[e.b]++
    })
    for (const n of appendees) {
      for (let j = 0; j < n.i; j++) {
        const w = overlap(n, nodes[j]!)
        if (w >= 2 && !seen.has(key(n.id, nodes[j]!.id))) {
          edges.push({ a: j, b: n.i, w, implied: false })
          seen.add(key(n.id, nodes[j]!.id))
          deg[n.i]++
          deg[j]++
        }
      }
      const standalone = EXPLORE_NODES[n.i]!.standalone === true
      if (!standalone && deg[n.i] < 2) {
        const cands = nodes
          .slice(0, n.i)
          .map((m, j) => ({ j, w: overlap(n, m) }))
          .filter((c) => c.w >= 1 && !seen.has(key(n.id, nodes[c.j]!.id)))
          .sort((a, b) => b.w - a.w)
        for (let k = 0; k < cands.length && deg[n.i] < 2; k++) {
          const j = cands[k]!.j
          edges.push({ a: j, b: n.i, w: 1, implied: true })
          seen.add(key(n.id, nodes[j]!.id))
          deg[n.i]++
          deg[j]++
        }
      }
    }

    // One-sided relaxation: forces are read from the whole field but written
    // ONLY to appendees, so the frozen 21 stay byte-identical.
    const appendEdges = edges.filter((e) => e.a >= FROZEN_COUNT || e.b >= FROZEN_COUNT)
    for (let it = 0; it < 280; it++) {
      for (const p of appendees) {
        for (let j = 0; j < nodes.length; j++) {
          if (j === p.i) continue
          const q = nodes[j]!
          const dx = q.x - p.x,
            dy = q.y - p.y,
            dz = q.z - p.z
          const d2 = dx * dx + dy * dy + dz * dz + 0.01
          const d = Math.sqrt(d2)
          const f = Math.min(9, 5200 / d2) / d
          p.x -= dx * f
          p.y -= dy * f
          p.z -= dz * f
        }
      }
      for (const e of appendEdges) {
        const a = nodes[e.a]!,
          b = nodes[e.b]!
        const dx = b.x - a.x,
          dy = b.y - a.y,
          dz = b.z - a.z
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01
        const rest = e.implied ? 70 : 58 - 6 * Math.min(e.w, 3)
        const f = (0.02 * (d - rest)) / d
        // Move only the appendee end(s); a frozen anchor stays put.
        if (a.i >= FROZEN_COUNT) {
          a.x += dx * f
          a.y += dy * f
          a.z += dz * f
        }
        if (b.i >= FROZEN_COUNT) {
          b.x -= dx * f
          b.y -= dy * f
          b.z -= dz * f
        }
      }
      for (const p of appendees) {
        p.x *= 0.995
        p.y *= 0.995
        p.z *= 0.995
      }
    }
  }

  // Degrees from the final edge set (matches the frozen degrees when no node is
  // appended).
  const dd = new Array(nodes.length).fill(0)
  edges.forEach((e) => {
    dd[e.a]++
    dd[e.b]++
  })
  nodes.forEach((n, i) => {
    n.deg = dd[i]!
  })
  return { nodes, edges }
}

export function neighbors(g: { edges: GraphEdge[] }, i: number): Set<number> {
  const s = new Set<number>()
  g.edges.forEach((e) => {
    if (e.a === i) s.add(e.b)
    if (e.b === i) s.add(e.a)
  })
  return s
}

// One shared instance: layout is deterministic, so compute once per session.
export const GRAPH = makeGraph()
