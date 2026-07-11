// THE NEURAL WORLD LAYOUT GUARDRAIL (the meta build). The world's positions
// are a frozen composition: X is a fixed step per chronological rank and the
// viewBox width DERIVES from the census, so appending new work at the newest
// date only extends the right edge and adds rows here. If this snapshot fails
// you (a) inserted an entry with an old date (shifting ranks: a sanctioned,
// reviewed change), (b) changed a correlation, or (c) touched the layout
// math. Review the .snap diff, then refresh with `npm test -- -u` (never in
// CI: CI fails on stale/missing snapshots).
import { expect, test } from 'vitest'
import { buildWorld, STEP, X0 } from './worldGraph'

test('world layout is frozen (ids + kind + coords + routes)', async () => {
  const { nodes, w, h } = buildWorld()
  const shape = {
    w,
    h,
    nodes: nodes.map((n) => ({
      id: n.id,
      kind: n.kind,
      date: n.date,
      x: Math.round(n.x * 10) / 10,
      y: Math.round(n.y * 10) / 10,
      route: n.route ?? null,
    })),
  }
  await expect(JSON.stringify(shape, null, 2) + '\n').toMatchFileSnapshot(
    './__snapshots__/world-layout.snap.json',
  )
})

test('world links are frozen (pairs + strength + synapse)', async () => {
  const { links } = buildWorld()
  const shape = links.map(
    (l) =>
      `${l.a} <-> ${l.b} ·${l.strength} @ ${Math.round(l.synapse.x)},${Math.round(l.synapse.y)} (${l.fibres.length} fibres)`,
  )
  await expect(shape.join('\n') + '\n').toMatchFileSnapshot(
    './__snapshots__/world-links.snap.txt',
  )
})

test('the x walk is a fixed step (append-safe by construction)', () => {
  const { nodes } = buildWorld()
  const sorted = [...nodes].sort((a, b) => a.rank - b.rank)
  sorted.forEach((n) => {
    expect(n.kind === 'award' ? true : n.x === X0 + (n.rank + 0.5) * STEP).toBe(true)
  })
})
