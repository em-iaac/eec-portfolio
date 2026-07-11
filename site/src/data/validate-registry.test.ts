// THE REGISTRY VALIDATOR (Session 4). Runs in `npm test` and inside
// `npm run build`: a broken registry join fails the build before it ships a
// blank card, a dead sheet route, a missing figure, or a shifted EXPLORE
// layout. Checks are structural only; copy stays Emilie's problem.
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { AWARD_WINNER_IDS, CORRELATIONS, ENTRIES, EXPLORE_NODES, timelineEntries } from './registry'
import {
  AWARD_ANCHOR_OVERRIDE,
  LANE_FORKS,
  MILESTONE_LANE,
  SOMA_MERGE_AT,
} from '../thoughts/world/skeletonIds'
import { buildWorld, WORLD_KINDS } from '../thoughts/world/worldGraph'
import { buildMindGraph } from '../landing/mindGraph'
import { PROJECTS_BY_SLUG } from './projects'
import { WORK_ENTRIES } from './work'
import { THOUGHT_NOTES } from '../thoughts/notes'
import images from './images.json'
import videos from './videos.json'

const hasImage = (slug: string, name: string) =>
  (images as Record<string, { name: string }[]>)[slug]?.some(i => i.name === name) ?? false

test('every entry.project resolves in PROJECTS_BY_SLUG', () => {
  const broken = ENTRIES.filter(e => e.project && !PROJECTS_BY_SLUG[e.project]).map(
    e => `${e.id} -> ${e.project}`,
  )
  expect(broken).toEqual([])
})

// G1: the sheet tier retired; every sheet ref must route to the SHOWCASE of
// a real project entry (/work/<project entry id>), so a career-graph row, a
// mind-graph node, or an old /sheets redirect can never land on nothing.
test('every sheet ref routes to an existing project entry showcase', () => {
  const projectIds = new Set(ENTRIES.filter(e => e.kind === 'project').map(e => e.id))
  const broken = ENTRIES.filter(e => {
    if (!e.sheet) return false
    const m = /^\/work\/(.+)$/.exec(e.sheet.route)
    return !m || !projectIds.has(m[1]!)
  }).map(e => `${e.id} -> ${e.sheet?.route}`)
  expect(broken).toEqual([])
})

// THE MASTER CONTENT FILE (G1, §11): every project must carry the signed
// spine's required beats. WHAT + WHY are authored for every project (Emilie's
// ruling); HOW and OUTCOME stay optional (a thin showcase is honest).
test('every project master file carries WHAT + WHY', () => {
  const broken = Object.values(PROJECTS_BY_SLUG)
    .filter(p => p.what == null || p.why == null)
    .map(p => p.slug)
  expect(broken).toEqual([])
})

test('every image ref exists in images.json', () => {
  const broken: string[] = []
  for (const e of ENTRIES)
    if (e.image && !hasImage(e.image.slug, e.image.name))
      broken.push(`registry ${e.id} -> ${e.image.slug}/${e.image.name}`)
  for (const p of Object.values(PROJECTS_BY_SLUG))
    if (p.image && !hasImage(p.image.slug, p.image.name))
      broken.push(`project ${p.slug} -> ${p.image.slug}/${p.image.name}`)
  expect(broken).toEqual([])
})

// Thought notes (Session 11) resolve like sheets: a drafted note must belong
// to a thought, point at its own /thoughts/:id leaf, and have a body to render.
test('every note ref is a thought pointing at its own leaf', () => {
  const broken = ENTRIES.filter(
    e => e.note && (e.kind !== 'thought' || e.note.route !== `/thoughts/${e.id}`),
  ).map(e => `${e.id} -> ${e.note?.route}`)
  expect(broken).toEqual([])
})

test('every drafted note has its THOUGHT_NOTES body', () => {
  const broken = ENTRIES.filter(
    e => e.note?.status === 'drafted' && !THOUGHT_NOTES[e.id],
  ).map(e => e.id)
  expect(broken).toEqual([])
})

test('explore orders are unique and contiguous from 0', () => {
  const orders = EXPLORE_NODES.map(n => n.order).sort((a, b) => a - b)
  expect(orders).toEqual(orders.map((_, i) => i))
})

// The mind-graph layout must COVER the registry: every explore node needs a
// geometry entry in landing/mindGraph.ts, and every node's threads must exist
// (buildMindGraph throws otherwise). An append that forgets its coords fails the
// build here, before it ships a node floating at the origin.
test('every explore node has mind-graph geometry (coverage)', () => {
  const build = () => buildMindGraph()
  expect(build).not.toThrow()
  expect(build().nodes.length).toBe(EXPLORE_NODES.length)
})

// Dates are the record's spine and every sort is a bare localeCompare, which
// is only chronological for zero-padded 'YYYY-MM'. now.ts is hand-edited
// every time life moves, so the format contract is enforced here, not just
// commented (G3 review finding).
test('every entry date is zero-padded YYYY-MM', () => {
  const broken = ENTRIES.filter(e => !/^\d{4}-(0[1-9]|1[0-2])$/.test(e.date)).map(
    e => `${e.id} -> ${e.date}`,
  )
  expect(broken).toEqual([])
})

// The neural world joins the registry by string id (lane forks, milestone
// lanes, the soma merge, the one award-anchor override); a rename in the
// registry must fail the build, not silently blank a lane or orphan a star
// (the G3 guarantee, carried onto the world).
test('every world skeleton id resolves in the registry', () => {
  const ids = new Set(ENTRIES.map(e => e.id))
  const wanted = [
    ...Object.keys(LANE_FORKS),
    ...Object.keys(MILESTONE_LANE),
    ...Object.keys(AWARD_ANCHOR_OVERRIDE),
    ...Object.values(AWARD_ANCHOR_OVERRIDE),
    SOMA_MERGE_AT,
  ]
  const broken = wanted.filter(id => !ids.has(id))
  expect(broken).toEqual([])
})

// Every milestone must know its lane (a new milestone without a lane would
// throw at build time; this fails first, with a readable list).
test('every milestone has a world lane', () => {
  const broken = ENTRIES.filter(e => e.kind === 'milestone' && !MILESTONE_LANE[e.id]).map(e => e.id)
  expect(broken).toEqual([])
})

// The skeleton draws exactly the four forked lanes; a deleted LANE_FORKS row
// would pass the id checks above (they only iterate existing keys) and leave
// buildWorld drawing NaN paths, so the coverage is pinned here.
test('the four forked lanes are all anchored', () => {
  expect(new Set(Object.values(LANE_FORKS))).toEqual(new Set(['self', 'soma', 'dyn', 'macad']))
})

// THE CORRELATIONS (the meta build): the world's threads are registry data.
// Both ends must resolve, ends are idea kinds only (thought/project: award
// threads derive from refId, never duplicated here), no self-links, no
// duplicate pairs in either direction, strength 1..3.
test('every correlation is a valid idea-lineage pair', () => {
  const byId = new Map(ENTRIES.map(e => [e.id, e]))
  const broken: string[] = []
  const seen = new Set<string>()
  for (const [a, b, s] of CORRELATIONS) {
    const ea = byId.get(a)
    const eb = byId.get(b)
    if (!ea) broken.push(`${a} (missing)`)
    if (!eb) broken.push(`${b} (missing)`)
    if (a === b) broken.push(`${a} (self-link)`)
    if (ea && ea.kind !== 'thought' && ea.kind !== 'project') broken.push(`${a} (${ea.kind}: idea kinds only)`)
    if (eb && eb.kind !== 'thought' && eb.kind !== 'project') broken.push(`${b} (${eb.kind}: idea kinds only)`)
    if (!(s >= 1 && s <= 3)) broken.push(`${a}<->${b} (strength ${s})`)
    const key = [a, b].sort().join('|')
    if (seen.has(key)) broken.push(`${a}<->${b} (duplicate pair)`)
    seen.add(key)
  }
  expect(broken).toEqual([])
})

// The world must COVER the record: every entry of a world kind renders as a
// node (the census), and the model builds without throwing (missing lanes /
// forks throw inside buildWorld).
test('the world covers every project, thought, milestone and award', () => {
  const world = buildWorld()
  const wanted = ENTRIES.filter(e => WORLD_KINDS.has(e.kind))
  expect(world.nodes.length).toBe(wanted.length)
  const nodeIds = new Set(world.nodes.map(n => n.id))
  expect(wanted.filter(e => !nodeIds.has(e.id)).map(e => e.id)).toEqual([])
})

// Route model (gate 3): projects and drafted thoughts open their pages,
// awards open the showcase their refId names; milestones and unanchored
// awards are the only card-only marks.
test('every world node routes somewhere or is a sanctioned card-only mark', () => {
  const world = buildWorld()
  const broken = world.nodes
    .filter(n => !n.route)
    .filter(n => !(n.kind === 'milestone' || (n.kind === 'award' && !ENTRIES.find(e => e.id === n.id)?.refId)))
    .map(n => n.id)
  expect(broken).toEqual([])
})

// THE NOW ENTRY (G3; the world since the meta build): exactly one, always
// the newest thing in the record (the world's red LIVE tip carries the NOW
// card; a stale NOW would lie about the present), and never an explore node
// (the frozen mind-graph layout must not see it).
test('the NOW entry is the single newest timeline item', () => {
  const nows = ENTRIES.filter(e => e.kind === 'now')
  expect(nows.map(e => e.id)).toEqual(['now'])
  expect(nows[0]!.explore).toBeUndefined()
  expect(timelineEntries()[0]!.id).toBe('now')
})

// The award star derives from award entries' refId, so each refId must resolve
// to a real project entry (else the star points at nothing / drifts).
test('every award refId resolves to a project entry', () => {
  const projectIds = new Set(ENTRIES.filter(e => e.kind === 'project').map(e => e.id))
  const broken = [...AWARD_WINNER_IDS].filter(id => !projectIds.has(id))
  expect(broken).toEqual([])
})

// THE WORK RENDITION (Session R2). The gallery + the book index reuse
// WORK_ENTRIES; these clauses keep that rendition honest, the same way the
// sheet/note renditions are guarded above (Section 11: every rendition gets a
// validator clause).

// Coverage: every project entry must render as a card, which requires a dek.
// A project whose dek is missing is dropped by the selector and caught here
// (before it ships a gap in the grid).
test('every project entry renders as a WorkEntry with a dek', () => {
  const projectEntries = ENTRIES.filter(e => e.kind === 'project')
  expect(WORK_ENTRIES.length).toBe(projectEntries.length)
  const missingDek = WORK_ENTRIES.filter(w => !w.dek?.trim()).map(w => w.id)
  expect(missingDek).toEqual([])
})

// Recognition never drifts from the record: a card shows a recognition line
// exactly when the project is an award winner (the star's single source).
test('a WorkEntry shows a recognition line iff it is an award winner', () => {
  const broken = WORK_ENTRIES.filter(
    w => Boolean(w.recognition) !== AWARD_WINNER_IDS.has(w.id),
  ).map(w => `${w.id}: recognition=${Boolean(w.recognition)} winner=${AWARD_WINNER_IDS.has(w.id)}`)
  expect(broken).toEqual([])
})


// Video binaries are committed by hand (the pipeline runs locally, never in
// CI), so the manifest can silently outrun the repo: every file videos.json
// promises must exist under public/ (Session 8).
test('every videos.json file exists on disk', () => {
  const pub = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public')
  const broken: string[] = []
  type VideoRef = { file: string }
  type VideoEntry = { name: string; sources: VideoRef[]; poster: VideoRef[] }
  for (const [slug, list] of Object.entries(videos as Record<string, VideoEntry[]>))
    for (const v of list)
      for (const f of [...v.sources, ...v.poster])
        if (!existsSync(join(pub, f.file))) broken.push(`${slug}/${v.name} -> ${f.file}`)
  expect(broken).toEqual([])
})

// (G1: the sheet-source video-ref scan retired with the sheet tier; the
// showcase's hero video is data-driven from videos.json itself, so a rename
// can no longer strand a JSX ref.)
