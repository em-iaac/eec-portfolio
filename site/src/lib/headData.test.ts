// THE HEAD + SCHEMA VALIDATOR (S3; the D6 economy clause). Runs in `npm
// test` and inside `npm run build`: every public route must emit a complete,
// unique head and its JSON-LD node, sourced from the registry/master files,
// BEFORE the prerenderer ever runs (scripts/prerender.mjs re-asserts the
// same properties on the baked HTML; this catches the drift at the source).
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { PUBLIC_ROUTES, SITE_ORIGIN } from './routes'
import { PILLAR_PATH, PILLAR_PHRASE } from './pillar'
import { headForRoute, ogCardKey, LANDING_TITLE, LANDING_DESCRIPTION } from './headData'

const heads = await Promise.all(
  PUBLIC_ROUTES.map(async (route) => ({ route, head: await headForRoute(route) })),
)

test('every public route emits a title and a description', () => {
  const broken = heads
    .filter(({ head }) => !head.title || !head.description || head.noindex)
    .map(({ route }) => route)
  expect(broken).toEqual([])
})

test('titles are unique across the site (case-insensitive)', () => {
  const seen = new Map<string, string>()
  const dupes: string[] = []
  for (const { route, head } of heads) {
    const key = head.title.toLowerCase()
    if (seen.has(key)) dupes.push(`${route} duplicates ${seen.get(key)}: "${head.title}"`)
    seen.set(key, route)
  }
  expect(dupes).toEqual([])
})

test('descriptions are unique and never the landing fallback on content routes', () => {
  const seen = new Map<string, string>()
  const broken: string[] = []
  for (const { route, head } of heads) {
    if (seen.has(head.description)) broken.push(`${route} duplicates ${seen.get(head.description)}`)
    seen.set(head.description, route)
    // A project or thought description falling back to the landing line
    // means its dek/opening failed to resolve: a silent single-source break.
    if (route !== '/' && /^\/(work|thoughts)\//.test(route) && head.description === LANDING_DESCRIPTION)
      broken.push(`${route}: description fell back to the landing line`)
  }
  expect(broken).toEqual([])
})

test('canonicals are absolute and self-referencing', () => {
  const broken = heads
    .filter(({ route, head }) => head.canonical !== SITE_ORIGIN + (route === '/' ? '/' : route))
    .map(({ route, head }) => `${route} -> ${head.canonical}`)
  expect(broken).toEqual([])
})

test('every route names its share card and the convention matches ogCardKey', () => {
  const broken: string[] = []
  for (const { route, head } of heads) {
    const key = ogCardKey(route)
    const expected = key ? `${SITE_ORIGIN}/og/${key}.png` : `${SITE_ORIGIN}/og.png`
    if (head.ogImage !== expected) broken.push(`${route}: ${head.ogImage} != ${expected}`)
    if (!head.ogImageAlt) broken.push(`${route}: no og:image alt`)
  }
  expect(broken).toEqual([])
})

test('every route carries the one entity graph: Person (+ both names) and its own node', () => {
  const broken: string[] = []
  for (const { route, head } of heads) {
    const graph = (head.jsonLd['@graph'] ?? []) as Record<string, unknown>[]
    const person = graph.find((n) => n['@type'] === 'Person') as
      | { alternateName?: string[]; knowsAbout?: string[]; sameAs?: string[] }
      | undefined
    if (!person) {
      broken.push(`${route}: no Person node`)
      continue
    }
    if (!person.alternateName?.includes('Emilie Chidiac') || !person.alternateName?.includes('Emilie El Chidiac'))
      broken.push(`${route}: alternateName must carry both public name forms`)
    if (!person.knowsAbout?.includes(PILLAR_PHRASE.toLowerCase()))
      broken.push(`${route}: knowsAbout is missing the coined term`)
    if ((person.sameAs?.length ?? 0) < 3) broken.push(`${route}: sameAs profile cluster incomplete`)
    if (graph.length < 3) broken.push(`${route}: no route node in the graph`)
  }
  expect(broken).toEqual([])
})

test('no em dashes anywhere in the head (a FLOORS rule)', () => {
  const broken = heads
    .filter(({ head }) => (head.title + head.description + JSON.stringify(head.jsonLd)).includes('—'))
    .map(({ route }) => route)
  expect(broken).toEqual([])
})

test('the pillar route exists, titled with the exact phrase', async () => {
  expect(PUBLIC_ROUTES).toContain(PILLAR_PATH)
  const head = await headForRoute(PILLAR_PATH)
  expect(head.title.startsWith(PILLAR_PHRASE)).toBe(true)
  expect(head.description.toLowerCase()).toContain(PILLAR_PHRASE.toLowerCase())
})

test('an unknown address gets the not-a-page head: noindex, not indexable', async () => {
  const head = await headForRoute('/definitely-not-a-page')
  expect(head.noindex).toBe(true)
})

// THE DRIFT GUARD: index.html (the pre-JS template every snapshot grows
// from) must carry the same landing title + description headData holds, so
// the two static sources can never disagree.
test('index.html and headData agree on the landing title + description', () => {
  const here = dirname(fileURLToPath(import.meta.url))
  const html = readFileSync(join(here, '..', '..', 'index.html'), 'utf8').replace(/\s+/g, ' ')
  expect(html).toContain(`<title>${LANDING_TITLE}</title>`)
  expect(html).toContain(LANDING_DESCRIPTION)
})
