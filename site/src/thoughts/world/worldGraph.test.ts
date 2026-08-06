// THE NEURAL WORLD LAYOUT GUARDRAIL (the meta build). The world's positions
// are a frozen composition: X is a fixed step per chronological rank and the
// viewBox width DERIVES from the census, so appending new work at the newest
// date only extends the right edge and adds rows here. If this snapshot fails
// you (a) inserted an entry with an old date (shifting ranks: a sanctioned,
// reviewed change), (b) changed a correlation, or (c) touched the layout
// math. Review the .snap diff, then refresh with `npm test -- -u` (never in
// CI: CI fails on stale/missing snapshots).
import { expect, test } from 'vitest'
import { CORRELATIONS, DECLINED_NEAR } from '../../data/registry'
import { NEAR_MIN_SHARED, pairKey } from './nearMisses'
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

// THE ROWS MUST BREATHE. This is the guard that did not exist, and its absence
// is why the map shipped for a day as three flat rails: 18 of the 21 projects
// stacked on the corridor floor at y=330 and the free-node spread was 145px.
// Nothing failed, because nothing was watching height.
//
// PROVEN TO FAIL, which is the only reason to trust it: re-clamping the solve
// the old way (Math.max(lo, Math.min(hi, next)) instead of the rescale) drops
// projects to 2 distinct heights and the spread to 145, and every one of these
// three assertions fires. Verified before this line was written.
test('the free rows are spread, not stacked', () => {
  const { nodes } = buildWorld()
  const ys = (kind: string) => nodes.filter((n) => n.kind === kind).map((n) => n.y)
  const thought = ys('thought')
  const project = ys('project')
  const span = (a: number[]) => Math.max(...a) - Math.min(...a)

  // No kind may collapse onto a handful of lines. A stacked row is the exact
  // failure mode the clamp produced, and counting distinct heights is the only
  // measure that catches it — the SPAN alone stayed 65px while 18 of 21
  // projects sat on one value.
  expect(new Set(project).size).toBeGreaterThanOrEqual(project.length - 3)
  expect(new Set(thought).size).toBeGreaterThanOrEqual(thought.length - 3)

  // And the whole field has to use the height it is given.
  expect(span([...thought, ...project])).toBeGreaterThan(300)
  expect(span(project)).toBeGreaterThan(100)
  expect(span(thought)).toBeGreaterThan(100)
})

// The rows stay two things, and nothing lands on the career lanes.
test('the corridors do not touch, and awards clear the lanes', () => {
  const { nodes } = buildWorld()
  const ys = (kind: string) => nodes.filter((n) => n.kind === kind).map((n) => n.y)
  const topLane = Math.min(...ys('milestone'))
  expect(Math.min(...ys('project'))).toBeGreaterThan(Math.max(...ys('thought')) + 24)
  // 30 of clear air below the lowest award mark, so its label (which hangs
  // ~23px under the mark) never lands on the first lane.
  expect(Math.max(...ys('award'))).toBeLessThan(topLane - 30)
})

// ---- the unmade synapses ----

// Frozen like the nodes and the links, and for the same reason: the set is
// derived, so it MOVES when she signs a thread — and that movement is exactly
// what she should be made to look at. A pair leaving this file means a thread
// closed it; a pair arriving means the record grew a new near miss.
test('the unmade synapses are frozen', async () => {
  const { reaches } = buildWorld()
  const shape = reaches.map((r) => `${r.a} ~ ${r.b} ·${r.shared} gap ${r.gap} via ${r.sharedIds.join(',')}`)
  await expect(shape.join('\n') + '\n').toMatchFileSnapshot('./__snapshots__/world-reaches.snap.txt')
})

test('a near-miss is never also a thread', () => {
  const { reaches } = buildWorld()
  const real = new Set(CORRELATIONS.map(([a, b]) => pairKey(a, b)))
  reaches.forEach((r) => {
    expect(real.has(pairKey(r.a, r.b))).toBe(false)
  })
})

test('every near-miss earns its place, counted not written', () => {
  const { reaches, nodes } = buildWorld()
  const nbr = new Map<string, Set<string>>()
  const ids = new Set(nodes.filter((n) => n.kind === 'thought' || n.kind === 'project').map((n) => n.id))
  for (const [a, b] of CORRELATIONS) {
    if (!ids.has(a) || !ids.has(b)) continue
    if (!nbr.has(a)) nbr.set(a, new Set())
    if (!nbr.has(b)) nbr.set(b, new Set())
    nbr.get(a)!.add(b)
    nbr.get(b)!.add(a)
  }
  expect(reaches.length).toBeGreaterThan(0)
  reaches.forEach((r) => {
    // recomputed here from CORRELATIONS, so a hand-written `shared` count or a
    // stale candidate list cannot pass
    const shared = [...(nbr.get(r.a) ?? [])].filter((x) => nbr.get(r.b)?.has(x))
    expect(shared.length).toBe(r.shared)
    expect(shared.sort()).toEqual([...r.sharedIds].sort())
    expect(r.shared).toBeGreaterThanOrEqual(NEAR_MIN_SHARED)
    // both ends must be things that can be almost-joined
    expect(ids.has(r.a) && ids.has(r.b)).toBe(true)
  })
})

test('a pair she has declined never comes back', () => {
  const { reaches } = buildWorld()
  const drawn = new Set(reaches.map((r) => pairKey(r.a, r.b)))
  DECLINED_NEAR.forEach(([a, b]) => {
    expect(drawn.has(pairKey(a, b))).toBe(false)
  })
})

// THE GAP IS THE CLAIM. Two arms that met would be drawing a connection that
// does not exist, which is the honesty floor stated as geometry. Proven to
// fail by raising REACH_LEN past half the shortest pair's separation.
test('an unmade synapse never closes', () => {
  const { reaches } = buildWorld()
  reaches.forEach((r) => {
    expect(r.gap).toBeGreaterThan(0)
  })
})
