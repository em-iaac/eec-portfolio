// THE REGISTRY VALIDATOR (Session 4). Runs in `npm test` and inside
// `npm run build`: a broken registry join fails the build before it ships a
// blank card, a dead sheet route, a missing figure, or a shifted EXPLORE
// layout. Checks are structural only; copy stays Emilie's problem.
import { existsSync, readFileSync } from 'node:fs'
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
import { loadAllSpines } from '../content/projects'
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
//
// It reads the LAZY half now (2026-08-03): the spine moved into
// <slug>.spine.tsx so a phone stops downloading all 21. loadAllSpines() also
// proves every meta file has a spine file beside it, which is the join the
// split created and the one thing a rename could silently break.
test('every project master file carries WHAT + WHY', async () => {
  const spines = await loadAllSpines()
  const broken = Object.values(PROJECTS_BY_SLUG)
    .filter(p => spines[p.slug]?.what == null || spines[p.slug]?.why == null)
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

// IF A NOTE NAMES IT, A THREAD CARRIES IT (Emilie, 2026-08-04, at the walk).
// A <Ref> inside a note's prose makes that project or note a door, so the
// reader is already told the two belong together. When no correlation backs it
// the map draws no fibre and /work glows no tile, and the page quietly
// contradicts itself. This missed FOUR real relations before it was written:
// `evolutionary search` naming Cappelletti, `heritage meets new tech` naming
// the Bab al-Luq market, `physics solvers` having no Kangaroo project at all,
// and `behavior information modeling` naming Sensi. Parsed from the source
// text rather than rendered, so it holds whatever the components do next.
test('every project or note a thought names in its prose also carries a thread', () => {
  const notesFile = join(dirname(fileURLToPath(import.meta.url)), '..', 'thoughts', 'notes.tsx')
  const src = readFileSync(notesFile, 'utf8').split(/\r?\n/)
  const pairs = new Set(CORRELATIONS.map(([a, b]) => [a, b].sort().join('|')))
  const missing: string[] = []
  let current: string | null = null
  for (const line of src) {
    const key = /^ {2}([a-z-]+): \(/.exec(line)
    if (key) current = key[1] ?? null
    if (!current) continue
    for (const ref of line.matchAll(/<Ref id="([a-z-]+)"/g)) {
      const target = ref[1]
      if (target === current) continue
      if (!pairs.has([current, target].sort().join('|'))) {
        missing.push(`${current} names ${target} in its prose, with no thread`)
      }
    }
  }
  expect([...new Set(missing)]).toEqual([])
})

// THE FIGURE RUN IS A BOOK, NOT A CATALOGUE (Emilie, 2026-08-05: "imagine them
// all piled up in one document as a book of essays"). Plates are numbered 1..N
// across the whole set in reading order, oldest note first, and the run is
// derived from `thoughtIndexEntries()` reversed. That only stays true while the
// declared exceptions match reality: today `charcoal` is the one note with no
// plate, because it carries her actual charcoals on sketch dots instead. If a
// note gains or loses a figure and nobody updates PLATES_PER_THOUGHT, every
// number after it goes quietly wrong, which is the worst kind of wrong.
test('every thought renders exactly the number of plates the figure run expects', () => {
  const notesFile = join(dirname(fileURLToPath(import.meta.url)), '..', 'thoughts', 'notes.tsx')
  const src = readFileSync(notesFile, 'utf8').split(/\r?\n/)
  const rendered: Record<string, number> = {}
  let current: string | null = null
  for (const line of src) {
    const key = /^ {2}([a-z-]+): \(/.exec(line)
    if (key) current = key[1] ?? null
    if (!current) continue
    // A plate reaches a note as `{XxxFigure}`; SketchDot and Ref are not plates.
    for (const _ of line.matchAll(/\{[A-Z]\w*Figure\}/g)) rendered[current] = (rendered[current] ?? 0) + 1
  }
  const thoughts = ENTRIES.filter(e => e.kind === 'thought' && e.note?.status === 'drafted')
  const mismatched = thoughts
    .map(e => ({ id: e.id, actual: rendered[e.id] ?? 0, expected: e.id === 'charcoal' ? 0 : 1 }))
    .filter(r => r.actual !== r.expected)
    .map(r => `${r.id}: renders ${r.actual} plate(s), the run expects ${r.expected}`)
  expect(mismatched).toEqual([])
})

// A PLATE LABEL HAS TO FIT ITS PLATE. Every figure is a 300x170 viewBox, and
// `.thought-fig svg` sets `overflow: visible`, so a label that runs past the
// right edge does not clip: it renders outside the frame, scaled up by however
// wide the plate is drawn (460px on desktop). EIGHT labels were doing this and
// had been since the plates shipped, the worst reaching x=418 in a 300 box,
// which is 39% past the edge. Nothing failed, nothing looked broken in the
// source, and it was only found by measuring the built SVG in a browser.
//
// This guard is a conservative ESTIMATE, not a render: `text.lbl` is Martian
// Mono at 8px with 0.1em tracking, which measures ~10.7px per character, so
// 11 is used as the per-character budget. It cannot catch a label that is
// marginally over, and it does catch every gross case, which is the class of
// bug that actually happened. Measure in the browser when a figure is redrawn.
test('no figure label runs past the right edge of its 300 unit plate', () => {
  const figFile = join(dirname(fileURLToPath(import.meta.url)), '..', 'thoughts', 'figures.tsx')
  const src = readFileSync(figFile, 'utf8')
  const PER_CHAR = 11
  const VIEWBOX_W = 300
  const overflowing: string[] = []
  // x is a QUOTED attribute in this file (x="208"), not a JSX expression. A
  // first version of this pattern expected a bare digit, matched nothing, and
  // passed green while eight labels were overflowing. A guard that matches
  // zero elements proves zero, so the match count is asserted below.
  const labels = [...src.matchAll(/<text className="lbl"[^>]*?\sx=["{](\d+)["}][^>]*>\s*([^<]+?)\s*<\/text>/g)]
  expect(labels.length).toBe((src.match(/<text className="lbl"/g) ?? []).length)
  for (const m of labels) {
    const x = Number(m[1])
    const text = (m[2] ?? '').replace(/\s+/g, ' ').trim()
    const right = x + text.length * PER_CHAR
    if (right > VIEWBOX_W) overflowing.push(`"${text}" at x=${x} reaches ~${right} of ${VIEWBOX_W}`)
  }
  expect(overflowing).toEqual([])
})

// EARLIER FIRST (Emilie, 2026-08-04, "all forward"). The tuple order is the
// direction the thread FIRES on the map: worldGraph builds `pulseD` from a to
// b and nw-travel sweeps a dash along it. Written the other way round, a
// thread travels against the clock, and the map stops reading as a mind
// changing over time. Same-month pairs are legal (the record has no day).
test('every correlation is written earlier-first, so every thread fires forward', () => {
  const dateOf = new Map(ENTRIES.map(e => [e.id, e.date]))
  const backwards = CORRELATIONS.filter(([a, b]) => {
    const da = dateOf.get(a)
    const db = dateOf.get(b)
    return !!da && !!db && da > db
  }).map(([a, b]) => `${a} (${dateOf.get(a)}) -> ${b} (${dateOf.get(b)})`)
  expect(backwards).toEqual([])
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
