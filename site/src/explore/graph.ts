// Port of design_handoff_eec_portfolio/explore/data.js { the graph content
// and its DETERMINISTIC layout. The node list derives from the registry
// (EXPLORE_NODES, sorted by the frozen `order`); the seeded simulation
// (mulberry32(20260706)) consumes nodes in order, so node order and tags are
// layout INVARIANTS: any reorder/insert/tag edit moves every word. The
// algorithm below must stay semantically identical to data.js { same
// floating-point operations in the same order.
// Pure module: no three.js, no DOM (Node-testable).
import { EXPLORE_NODES } from '../data/registry'
import { LENS_TO_KEY, type LensKey } from './palette'

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

// The RAW id order from data.js, frozen. If this throws, someone reordered
// or renamed registry explore entries { fix the registry, not this string.
const EXPECTED_ID_ORDER =
  'sensi|neurospace|huddle|lungs|legoarch|ballooning|podcast|soma|mars|cappelletti|xr|' +
  'bim|neuroaes|solvers|genai|xreal|comfort|drawiface|evosearch|heritage|respond'

function mulberry32(a: number) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function makeGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const ids = EXPLORE_NODES.map((n) => n.id).join('|')
  if (ids !== EXPECTED_ID_ORDER) {
    throw new Error(
      'EXPLORE layout invariant broken: registry explore order/ids changed. ' +
        'New nodes must APPEND (next order); existing ids/orders are frozen.',
    )
  }

  const rnd = mulberry32(20260706)
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
  for (const n of nodes) {
    const u = rnd() * 2 - 1,
      th = rnd() * Math.PI * 2,
      r = 90 + rnd() * 30
    const s = Math.sqrt(1 - u * u)
    n.x = r * s * Math.cos(th)
    n.y = r * u
    n.z = r * s * Math.sin(th)
  }
  const overlap = (a: GraphNode, b: GraphNode) => a.tags.filter((t) => b.tags.includes(t)).length
  const key = (a: string, b: string) => (a < b ? a + '|' + b : b + '|' + a)
  const seen = new Set<string>()
  const edges: GraphEdge[] = []
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const w = overlap(nodes[i], nodes[j])
      if (w >= 2) {
        edges.push({ a: i, b: j, w, implied: false })
        seen.add(key(nodes[i].id, nodes[j].id))
      }
    }
  }
  const deg = new Array(nodes.length).fill(0)
  edges.forEach((e) => {
    deg[e.a]++
    deg[e.b]++
  })
  nodes.forEach((n, i) => {
    if (deg[i] < 2) {
      const cands = nodes
        .map((m, j) => ({ j, w: i === j ? -1 : overlap(n, m) }))
        .filter((c) => c.w >= 1 && !seen.has(key(n.id, nodes[c.j].id)))
        .sort((a, b) => b.w - a.w)
      for (let k = 0; k < cands.length && deg[i] < 2; k++) {
        edges.push({ a: i, b: cands[k].j, w: 1, implied: true })
        seen.add(key(n.id, nodes[cands[k].j].id))
        deg[i]++
        deg[cands[k].j]++
      }
    }
  })
  // Force relaxation (deterministic)
  for (let it = 0; it < 280; it++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i],
          b = nodes[j]
        const dx = b.x - a.x,
          dy = b.y - a.y,
          dz = b.z - a.z
        const d2 = dx * dx + dy * dy + dz * dz + 0.01
        const d = Math.sqrt(d2)
        const f = Math.min(9, 5200 / d2) / d
        a.x -= dx * f
        a.y -= dy * f
        a.z -= dz * f
        b.x += dx * f
        b.y += dy * f
        b.z += dz * f
      }
    }
    for (const e of edges) {
      const a = nodes[e.a],
        b = nodes[e.b]
      const dx = b.x - a.x,
        dy = b.y - a.y,
        dz = b.z - a.z
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01
      const rest = e.implied ? 70 : 58 - 6 * Math.min(e.w, 3)
      const f = (0.02 * (d - rest)) / d
      a.x += dx * f
      a.y += dy * f
      a.z += dz * f
      b.x -= dx * f
      b.y -= dy * f
      b.z -= dz * f
    }
    for (const n of nodes) {
      n.x *= 0.995
      n.y *= 0.995
      n.z *= 0.995
    }
  }
  const dd = new Array(nodes.length).fill(0)
  edges.forEach((e) => {
    dd[e.a]++
    dd[e.b]++
  })
  nodes.forEach((n, i) => {
    n.deg = dd[i]
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
