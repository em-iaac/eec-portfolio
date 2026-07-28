// THE CV GUARDS (board B1 + B2, 2026-07-28). Runs in `npm test` and inside
// `npm run build`.
//
// The web CV's two interactive moves both depend on prose staying in a shape
// nothing in the type system can enforce: a bullet must still OPEN with the
// project name a link is keyed to, and the writing line must still join back
// to the exact string the printed PDF and its ATS parse test read. Both are
// one careless reword away from breaking silently — a dead link that still
// renders, or a PDF that quietly says something else. These fail the build
// instead.
import { expect, test } from 'vitest'
import {
  CV_PROJECT_LINKS,
  EDUCATION,
  EXPERIENCE,
  ESSAY_COUNT,
  BLOG_COUNT,
  WRITING,
  WRITING_PARTS,
  splitProjectLink,
} from './cv'
import { WORK_ENTRIES } from './work'

const BULLETS = [...EDUCATION, ...EXPERIENCE].flatMap(e => e.projects ?? [])

test('every linked project name leads exactly one CV bullet', () => {
  const broken = Object.keys(CV_PROJECT_LINKS)
    .map(name => {
      const hits = BULLETS.filter(b => splitProjectLink(b)?.name === name)
      return hits.length === 1 ? null : `${name}: leads ${hits.length} bullets, expected 1`
    })
    .filter(Boolean)
  expect(broken).toEqual([])
})

test('every linked project name resolves to a real work showcase', () => {
  const ids = new Set(WORK_ENTRIES.map(w => w.id))
  const broken = Object.entries(CV_PROJECT_LINKS)
    .filter(([, id]) => !ids.has(id))
    .map(([name, id]) => `${name} -> /work/${id}`)
  expect(broken).toEqual([])
})

// The split must hand back the whole bullet: name + rest, nothing dropped and
// nothing duplicated, or the rendered line would silently lose a word.
test('splitProjectLink is lossless', () => {
  const broken = BULLETS.map(b => {
    const hit = splitProjectLink(b)
    if (!hit) return null
    return hit.name + hit.rest === b ? null : b
  }).filter(Boolean)
  expect(broken).toEqual([])
})

// B2: the parts are the source, and WRITING is assembled from them. This pins
// the assembled string so an edit to a part cannot change what the PDF prints
// without someone seeing this line and deciding to.
test('WRITING assembles to the exact printed string', () => {
  expect(WRITING).toBe(
    `${ESSAY_COUNT} essays at emiliechidiac.com/thoughts · ${BLOG_COUNT} project write-ups on blog.iaac.net · MaCAD Theory Podcast, co-hosted with Charles Abi Chahine: Optimizing for the Mind, with Dr. Cleo Valentine`,
  )
})

test('every writing part carries exactly one destination', () => {
  const broken = WRITING_PARTS.filter(p => Boolean(p.to) === Boolean(p.href)).map(p => p.link)
  expect(broken).toEqual([])
})

test('every internal writing destination is a route the site owns', () => {
  const workRoutes = new Set(WORK_ENTRIES.map(w => `/work/${w.id}`))
  const broken = WRITING_PARTS.filter(
    p => p.to && p.to !== '/thoughts' && !workRoutes.has(p.to),
  ).map(p => p.to!)
  expect(broken).toEqual([])
})
