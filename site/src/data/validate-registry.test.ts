// THE REGISTRY VALIDATOR (Session 4). Runs in `npm test` and inside
// `npm run build`: a broken registry join fails the build before it ships a
// blank card, a dead sheet route, a missing figure, or a shifted EXPLORE
// layout. Checks are structural only; copy stays Emilie's problem.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { AWARD_WINNER_IDS, ENTRIES, EXPLORE_NODES } from './registry'
import { buildMindGraph } from '../landing/mindGraph'
import { PROJECTS_BY_SLUG } from './projects'
import { SHEETS } from '../sheets'
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

test('every issued sheet has its SHEETS component', () => {
  const broken = ENTRIES.filter(
    e => e.sheet?.status === 'issued' && !SHEETS[e.sheet.number.toLowerCase()],
  ).map(e => `${e.id} -> ${e.sheet?.number}`)
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

// The award star derives from award entries' refId, so each refId must resolve
// to a real project entry (else the star points at nothing / drifts).
test('every award refId resolves to a project entry', () => {
  const projectIds = new Set(ENTRIES.filter(e => e.kind === 'project').map(e => e.id))
  const broken = [...AWARD_WINNER_IDS].filter(id => !projectIds.has(id))
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

// Sheet video refs live in JSX (SheetVideo slug/name, CinemaPlate video
// media), so a rename in the manifest would silently blank a plate while the
// build stays green. Scan the sheet sources and assert each ref resolves in
// videos.json, mirroring the image check (Session 8, from the code review).
test('every sheet video ref resolves in videos.json', () => {
  const sheetsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'sheets')
  const hasVideo = (slug: string, name: string) =>
    (videos as Record<string, { name: string }[]>)[slug]?.some(v => v.name === name) ?? false
  const broken: string[] = []
  for (const file of readdirSync(sheetsDir).filter(f => f.endsWith('.tsx'))) {
    const src = readFileSync(join(sheetsDir, file), 'utf8')
    // <SheetVideo ... slug="x" ... name="y" ...> (repo convention: slug first)
    for (const m of src.matchAll(/<SheetVideo\b[^>]*?\bslug="([^"]+)"[^>]*?\bname="([^"]+)"/g))
      if (!hasVideo(m[1]!, m[2]!)) broken.push(`${file}: SheetVideo ${m[1]}/${m[2]}`)
    // CinemaPlate media={{ kind: 'video', slug: 'x', name: 'y', ... }}
    for (const m of src.matchAll(/kind:\s*'video'[^}]*?\bslug:\s*'([^']+)'[^}]*?\bname:\s*'([^']+)'/g))
      if (!hasVideo(m[1]!, m[2]!)) broken.push(`${file}: plate ${m[1]}/${m[2]}`)
  }
  expect(broken).toEqual([])
})
