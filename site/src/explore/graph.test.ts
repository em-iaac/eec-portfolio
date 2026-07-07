// The EXPLORE layout guardrail (Session 4). The seeded simulation consumes
// registry nodes in order, so node ids, tags, and the relaxed coordinates are
// layout INVARIANTS: this snapshot ENCODES the frozen 21, it never alters
// them. If it fails you (a) reordered/renamed explore entries, (b) edited
// tags, or (c) changed the algorithm. Appending a new node (next order) is
// the only sanctioned change; review the .snap.json diff, then refresh with
// `npm test -- -u` (never in CI: CI fails on stale/missing snapshots).
import { expect, test } from 'vitest'
import { makeGraph } from './graph'

const round1 = (v: number) => Math.round(v * 10) / 10

test('EXPLORE graph layout is frozen (ids + sorted tags + coords)', async () => {
  const { nodes } = makeGraph()
  const shape = nodes.map(n => ({
    id: n.id,
    tags: [...n.tags].sort(),
    x: round1(n.x),
    y: round1(n.y),
    z: round1(n.z),
  }))
  await expect(JSON.stringify(shape, null, 2) + '\n').toMatchFileSnapshot(
    './__snapshots__/graph-layout.snap.json',
  )
})

test('EXPLORE graph edges are frozen (pairs + weights)', async () => {
  const { nodes, edges } = makeGraph()
  const pairs = edges.map(
    e => `${nodes[e.a]?.id} - ${nodes[e.b]?.id} w${e.w}${e.implied ? ' implied' : ''}`,
  )
  await expect(pairs.join('\n') + '\n').toMatchFileSnapshot(
    './__snapshots__/graph-edges.snap.txt',
  )
})
