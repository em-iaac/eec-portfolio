// G5 · THE BOOK CENSUS + PRINT-RUNG GUARDRAILS (REDESIGN-SPEC §11: every
// rendition gets a validator clause). Runs in `vitest run`, which gates BOTH
// `npm test` and `npm run build`, so a spread that loses its plate, an index
// that drops a project, or a missing committed print JPEG fails CI before
// headless Chrome ever prints a stale book.
//
// The pages are rendered DIRECTLY with renderToString (never through the
// lazy() route, which would only render its Suspense fallback and assert
// nothing). PrintContext is on, exactly as the real routes mount them.
import { describe, expect, test } from 'vitest'
import { renderToString } from 'react-dom/server'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PrintContext } from './PrintContext'
import PrintBook, { BOOK_PAGE_COUNT } from './PrintBook'
import PrintCV from './PrintCV'
import { BOOK_SLUGS, BOOK_SPREADS } from './bookContents'
import printImages from '../data/print-images.json'
import { WORK_ENTRIES } from '../data/work'
import { ENTRIES } from '../data/registry'
import { EDUCATION, EXPERIENCE } from '../data/cv'

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public')

const bookHtml = renderToString(
  <PrintContext.Provider value={true}>
    <PrintBook />
  </PrintContext.Provider>,
)
const cvHtml = renderToString(
  <PrintContext.Provider value={true}>
    <PrintCV />
  </PrintContext.Provider>,
)

const count = (haystack: string, needle: string) => haystack.split(needle).length - 1

describe('the book contents', () => {
  test('every book slug resolves to a master + a WORK entry', () => {
    // bookContents throws at import on a bad slug; reaching here proves the
    // joins, this pins the shape.
    expect(BOOK_SPREADS).toHaveLength(BOOK_SLUGS.length)
    expect(BOOK_SLUGS.length).toBe(6)
  })

  test('every spread has a committed print rung (manifest + file on disk + width floor)', () => {
    const manifest = printImages as Record<string, Record<string, { file: string; w: number }>>
    // The ~300dpi floor at the plate width. Two originals are honestly
    // smaller (AI renders are 1024-native; the Sensi shot is a 1388px
    // screenshot) — SANCTIONED at their real widths, so a REGRESSION below
    // what exists today still fails while the known softness does not.
    const PRINT_MIN_W = 1700
    const SANCTIONED_SOFT = new Map([
      ['legoarch/sagrada-render', 1024],
      ['sensi/app-shape', 1388],
    ])
    for (const { master } of BOOK_SPREADS) {
      expect(master.spreadAssets, `${master.slug} declares spreadAssets`).toBeTruthy()
      expect(master.spreadAssets!.length, `${master.slug} spreadAssets not empty`).toBeGreaterThan(0)
      for (const { slug, name } of master.spreadAssets!) {
        const rung = manifest[slug]?.[name]
        expect(rung, `${slug}/${name} in print-images.json (run npm run print-assets)`).toBeTruthy()
        expect(
          existsSync(join(PUBLIC, rung!.file)),
          `${rung!.file} committed on disk (run npm run print-assets)`,
        ).toBe(true)
        const floor = SANCTIONED_SOFT.get(`${slug}/${name}`) ?? PRINT_MIN_W
        expect(
          rung!.w,
          `${slug}/${name} print rung at least ${floor}px wide (got ${rung!.w})`,
        ).toBeGreaterThanOrEqual(floor)
      }
    }
  })
})

describe('the book census', () => {
  test(`the book is whole: ${BOOK_PAGE_COUNT} pages`, () => {
    expect(count(bookHtml, 'pr-page--landscape')).toBe(BOOK_PAGE_COUNT)
  })

  test('every spread carries its title and the full spine grammar', () => {
    for (const { master } of BOOK_SPREADS) {
      expect(bookHtml).toContain(master.title)
    }
    // All six gated spreads have complete spines (WHAT/WHY/HOW/OUTCOME).
    expect(count(bookHtml, '>WHAT<')).toBe(6)
    expect(count(bookHtml, '>WHY<')).toBe(6)
    expect(count(bookHtml, '>HOW<')).toBe(6)
    expect(count(bookHtml, '>WHAT CAME OF IT<')).toBe(6)
  })

  test('the index lists every project and every thought', () => {
    for (const w of WORK_ENTRIES) expect(bookHtml).toContain(w.title)
    for (const t of ENTRIES.filter(e => e.kind === 'thought')) {
      expect(bookHtml).toContain(t.title)
    }
  })

  test('the CV tail and the colophon are present', () => {
    expect(bookHtml).toContain('EDUCATION')
    expect(bookHtml).toContain('EXPERIENCE')
    // The colophon closes with the landing's signed caption (escaped by
    // renderToString, so match around the apostrophe).
    expect(bookHtml).toContain('this is what')
    expect(bookHtml).toContain('on my mind')
  })

  test('no em dashes anywhere in the printed book', () => {
    expect(bookHtml).not.toContain('—')
  })
})

describe('the ATS CV page', () => {
  test('one portrait page with the plain record', () => {
    expect(count(cvHtml, 'pr-page--portrait')).toBe(1)
    expect(cvHtml).toContain('Emilie El Chidiac')
    expect(cvHtml).toContain('chidiacemilie@gmail.com')
    for (const e of [...EDUCATION, ...EXPERIENCE]) {
      expect(cvHtml).toContain(e.dates)
    }
    expect(cvHtml).toContain('Rhino Compute')
    expect(cvHtml).not.toContain('—')
  })
})
