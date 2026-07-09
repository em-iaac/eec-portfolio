// THE MIND-GRAPH LAYOUT GUARDRAIL (Session R1; migrated from the retired
// explore/graph.test.ts). The mind-graph's coordinates and thread membership are
// layout INVARIANTS: this snapshot ENCODES the shipped composition, it never
// alters it. If it fails you (a) reordered/renamed explore entries, (b) edited a
// node's threads, or (c) moved a coordinate. Appending a new node (next order,
// with its own GEOM entry) is the only sanctioned change; review the .snap diff,
// then refresh with `npm test -- -u` (never in CI: CI fails on stale/missing
// snapshots).
import { expect, test } from 'vitest'
import { buildMindGraph } from './mindGraph'

test('mind-graph layout is frozen (ids + kind + sorted threads + coords)', async () => {
  const { nodes } = buildMindGraph()
  const shape = nodes.map((n) => ({
    id: n.id,
    kind: n.kind,
    lens: n.lens,
    award: n.award,
    threads: [...n.th].sort(),
    x: n.x,
    y: n.y,
  }))
  await expect(JSON.stringify(shape, null, 2) + '\n').toMatchFileSnapshot(
    './__snapshots__/mind-graph-layout.snap.json',
  )
})

test('mind-graph threads are frozen (id + waypoints)', async () => {
  const { threads } = buildMindGraph()
  const shape = threads.map((t) => `${t.id}: ${t.pts.map((p) => p.join(',')).join(' ')}`)
  await expect(shape.join('\n') + '\n').toMatchFileSnapshot(
    './__snapshots__/mind-graph-threads.snap.txt',
  )
})
