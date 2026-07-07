// THE REGISTRY VALIDATOR (Session 4). Runs in `npm test` and inside
// `npm run build`: a broken registry join fails the build before it ships a
// blank card, a dead sheet route, a missing figure, or a shifted EXPLORE
// layout. Checks are structural only; copy stays Emilie's problem.
import { expect, test } from 'vitest'
import { ENTRIES, EXPLORE_NODES } from './registry'
import { PROJECTS_BY_SLUG } from './projects'
import { SHEETS } from '../sheets'
import images from './images.json'

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

test('explore orders are unique and contiguous from 0', () => {
  const orders = EXPLORE_NODES.map(n => n.order).sort((a, b) => a - b)
  expect(orders).toEqual(orders.map((_, i) => i))
})
