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
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PrintContext } from './PrintContext'
import PrintBook, { BOOK_PAGE_COUNT } from './PrintBook'
import PrintCV from './PrintCV'
import { BOOK_SLUGS, BOOK_SPREADS } from './bookContents'
import { BOOK_THREAD, THREAD_LABEL } from './bookPlates'
import { PRINT_FIGURES } from './figures'
import printImages from '../data/print-images.json'
import { WORK_ENTRIES } from '../data/work'
import { ENTRIES, CORRELATIONS, thoughtIndexEntries } from '../data/registry'
import { fmtMonthYear } from '../components/ThoughtIndexRows'
import { BIO, BIO_VARIABLES } from '../landing/identity'
import { layoutAssetPage, registerRowHeight, leadDrawnWidth } from './assetGeometry'
import { EDUCATION, EXPERIENCE, ESSAY_COUNT, BLOG_COUNT } from '../data/cv'

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

type Rung = { file: string; w: number; h: number }
const manifest = printImages as {
  plates?: Record<string, Record<string, Rung>>
  grid?: Record<string, Record<string, Rung>>
}

describe('the book contents', () => {
  test('every book slug resolves to a master + a WORK entry', () => {
    // bookContents throws at import on a bad slug; reaching here proves the
    // joins, this pins the shape.
    expect(BOOK_SPREADS).toHaveLength(BOOK_SLUGS.length)
    // THE BOOK REWORK (Emilie, 2026-08-11): six became eight, each holding a
    // facing pair, and the two new ones are the practice pages.
    expect(BOOK_SLUGS.length).toBe(8)
    expect(BOOK_SLUGS).toContain('soma-towers')
    expect(BOOK_SLUGS).toContain('falcon')
  })

  test('every plate has a committed print rung (manifest + file on disk + width floor)', () => {
    // The ~300dpi floor at the plate width. One original is honestly smaller
    // (the Sensi shot is a 1388px screenshot) — SANCTIONED at its real width,
    // so a REGRESSION below what exists today still fails while the known
    // softness does not. lEgoarCh's 1024px sagrada render left this list when
    // its plate moved to `outputs`, which is the point of pinning them.
    const PRINT_MIN_W = 1700
    // ⚠ TWO SANCTIONS, both real originals rather than excuses:
    //   sensi/app-shape is a 1388px screenshot, all that exists.
    //   verve/dusk-facade is an 880px square export, and so is every Verve
    //     render. Emilie asked for it as the plate, was shown that it lands near
    //     154dpi filled, and asked again. Sanctioned at what it really is.
    //     ⚠ The justification here USED to end "it FITS instead, which draws it
    //     98mm wide and takes it to about 228dpi". That is not true of the
    //     built book: soma-towers declares no `spreadFit`, so the plate does
    //     not fit, it FILLS — PrintBook only adds pr-spread__figure--fit when
    //     spreadFit is set. The sanction stands on her decision, which is real;
    //     the arithmetic that dressed it up described a page that was never
    //     built. If the softness ever matters, the honest fix is a bigger
    //     export, not a better sentence.
    const SANCTIONED_SOFT = new Map([
      ['sensi/app-shape', 1388],
      ['verve/dusk-facade', 880],
    ])
    for (const { master } of BOOK_SPREADS) {
      expect(master.spreadAssets, `${master.slug} declares spreadAssets`).toBeTruthy()
      expect(master.spreadAssets!.length, `${master.slug} spreadAssets not empty`).toBeGreaterThan(0)
      for (const { slug, name } of master.spreadAssets!) {
        const rung = manifest.plates?.[slug]?.[name]
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

  // THE ASSET PAGE'S OWN FLOOR (2026-08-11, recomputed 2026-08-12 for the lead
  // and register). Grid images are baked to the width they are actually DRAWN
  // at, so a fixed pixel floor would say nothing: 444px is correct for a 51mm
  // plan and far too small for a 200mm KPI map. The floor that means something
  // is DPI AT THE DRAWN WIDTH, recomputed here from the SAME geometry
  // layoutAssetPage and print-assets.mjs use, so all three have to agree. A
  // lead is 159 to 210mm wide, which is where this guard now bites hardest.
  test('every asset-page image has a committed rung at a usable resolution', () => {
    // 150dpi is the honest floor for a page read on screen and printed on an
    // office laser.
    //
    // ⚠ THE SANCTION LIST IS EMPTY NOW, and that is the point. It held exactly
    // two entries, neurospace/pipeline and neurospace/score-formula, both 875px
    // originals drawn far wider than they could carry. On 2026-08-12 they were
    // replaced by ONE drawn figure, so the exception did not have to be renewed:
    // it stopped existing. Do not add to this set to make a page fit. A picture
    // that cannot hold its width is either drawn smaller, re-exported, or
    // redrawn as a figure.
    const MIN_DPI = 150
    const SANCTIONED_SOFT = new Set<string>()
    const rungOf = (slug: string, name: string) => {
      const rung = manifest.grid?.[slug]?.[name]
      // (figures never reach here: they are filtered out before this is called)
      expect(rung, `${slug}/${name} in print-images.json grid (run npm run print-assets)`).toBeTruthy()
      expect(
        existsSync(join(PUBLIC, rung!.file)),
        `${rung!.file} committed on disk (run npm run print-assets)`,
      ).toBe(true)
      return rung!
    }
    const checkDpi = (slug: string, name: string, w: number, drawnMm: number) => {
      if (SANCTIONED_SOFT.has(`${slug}/${name}`)) return
      const dpi = w / (drawnMm / 25.4)
      expect(
        Math.round(dpi),
        `${slug}/${name} drawn ${drawnMm.toFixed(0)}mm wide, needs at least ${MIN_DPI}dpi`,
      ).toBeGreaterThanOrEqual(MIN_DPI)
    }

    for (const { master } of BOOK_SPREADS) {
      const register = master.bookRegister
      expect(register, `${master.slug} declares bookRegister`).toBeTruthy()
      expect(register!.length, `${master.slug} bookRegister not empty`).toBeGreaterThan(0)
      // A DRAWN FIGURE HAS NO RUNG AND NO DPI. It is checked for the one thing
      // that can be wrong about it, that figures.tsx exports the id it names,
      // and then left out of the resolution walk.
      for (const a of register!.filter(a => a.figure)) {
        expect(
          PRINT_FIGURES[a.figure!],
          `${master.slug}: register names figure "${a.figure}", which figures.tsx does not export`,
        ).toBeTruthy()
      }
      const photos = register!.filter(a => !a.figure)
      const rungs = photos.map(({ slug, name }) => rungOf(slug, name))
      // The SAME functions the renderer and the bake script call, imported
      // rather than re-derived. This test used to re-implement the arithmetic,
      // which meant it could agree with itself and disagree with the page.
      const aspects = rungs.map(r => r.w / r.h)
      const rowH = registerRowHeight(aspects)
      photos.forEach(({ slug, name }, i) => {
        checkDpi(slug, name, rungs[i]!.w, aspects[i]! * rowH)
      })

      const lead = master.bookLead
      expect(lead, `${master.slug} declares a bookLead`).toBeTruthy()
      // ⚠ A DRAWN LEAD HAS NO RUNG AND NO DPI, so it is checked for the one
      // thing that CAN be wrong about it: that the figure it names exists. A
      // typo'd id would otherwise render an empty box and the page would print
      // blank where its argument should be.
      if (lead!.figure) {
        expect(
          PRINT_FIGURES[lead!.figure],
          `${master.slug}: bookLead names figure "${lead!.figure}", which figures.tsx does not export`,
        ).toBeTruthy()
      } else {
        const lr = rungOf(lead!.slug, lead!.name)
        checkDpi(lead!.slug, lead!.name, lr.w, leadDrawnWidth(lead!.corner, lr.w / lr.h, rowH))
      }
    }
  })

  // ONE CAPTION LINE PER ROW (Emilie, 2026-08-12: "the captions for the
  // secondary assets should be all at the same height and same size ... assets
  // should follow some type of alignment rule sometimes, or break the alignment
  // purposely").
  //
  // Checked in the GEOMETRY rather than on the rendered page, because that is
  // where it can actually be guaranteed: a justified row hands out different
  // WIDTHS, so the images have slightly different heights, and captions hung off
  // each image's own bottom would drift by a millimetre or two per page. The
  // layout returns ONE captionY for the row and every box shares one y.
  //
  // The column asset is deliberately NOT in this: it stands in another zone of
  // the page, so aligning it to a row it is not part of would be a false
  // alignment rather than a true one.
  test('every register row sits on one line, and its captions on one more', () => {
    for (const { master } of BOOK_SPREADS) {
      const sized = (a: { slug: string; name: string }) => {
        const rung = manifest.grid?.[a.slug]?.[a.name]
        return rung ? { w: rung.w, h: rung.h, src: rung.file, alt: '' } : null
      }
      const register = master.bookRegister!.map(sized).filter(Boolean) as {
        w: number
        h: number
        src: string
        alt: string
      }[]
      if (register.length === 0) continue
      const leadRung = master.bookLead!.figure ? null : sized(master.bookLead!)
      const lead = leadRung
        ? { ...leadRung, corner: master.bookLead!.corner }
        : { w: 900, h: 420, src: '', alt: '', corner: master.bookLead!.corner }
      const col = master.bookColumn ? sized(master.bookColumn) : null
      const laid = layoutAssetPage(lead, register, true, col)
      const ys = new Set(laid.register.map(b => b.y.toFixed(3)))
      expect(ys.size, `${master.slug}: the register row sits on ${ys.size} different lines`).toBe(1)
      const bottoms = laid.register.map(b => b.y + b.h)
      expect(
        Math.max(...bottoms) - Math.min(...bottoms),
        `${master.slug}: justified row images differ in height, so a per-image caption would drift`,
      ).toBeLessThan(1.5)
      expect(laid.captionY, `${master.slug}: the row has one caption line`).toBeGreaterThan(
        Math.max(...bottoms) - 0.01,
      )
      // A COLUMN ASSET JOINS THAT LINE. It sits in another zone of the page, so
      // it is the one image whose alignment could drift unnoticed; anchoring it
      // to the row's bottom edge is what puts its caption on the row's caption
      // line, and this is what stops that being undone by accident.
      if (laid.column) {
        expect(
          Math.abs(laid.column.y + laid.column.h - Math.max(...bottoms)),
          `${master.slug}: the column asset does not sit on the register's baseline`,
        ).toBeLessThan(0.5)
        expect(
          laid.column.y,
          `${master.slug}: the column asset starts too high and would meet the head`,
        ).toBeGreaterThan(44)
      }
    }
  })

  test('an asset page never repeats its own plate', () => {
    for (const { master } of BOOK_SPREADS) {
      const plates = new Set(master.spreadAssets!.map(a => `${a.slug}/${a.name}`))
      const page2 = [master.bookLead!, ...master.bookRegister!]
      for (const a of page2) {
        expect(
          plates.has(`${a.slug}/${a.name}`),
          `${master.slug}: ${a.name} is both the plate and an asset-page image`,
        ).toBe(false)
      }
    }
  })

  // THE FOUR-ASSET CEILING (2026-08-12), measured rather than judged. A
  // register row of three is 42 to 46mm tall at this measure and a row of two
  // is 65 to 73mm, so at five or six assets the lead collapses below the point
  // where it is leading anything. This guard is what stops a future asset being
  // quietly appended and taking the lead down with it.
  test('page two never carries more than a lead and three', () => {
    for (const { master } of BOOK_SPREADS) {
      expect(
        master.bookRegister!.length,
        `${master.slug}: a register of more than three shrinks the lead below 60mm`,
      ).toBeLessThanOrEqual(3)
    }
  })

  // EVERY LEAD BLEEDS OFF A TRIM EDGE, and the book alternates which one
  // (Emilie, 2026-08-12: "we are always using the hero on the left side, we can
  // switch sometimes"). A run of identical corners is the thing she asked to
  // fix, so it fails here rather than being noticed on paper.
  test('the leads alternate the edge they bleed from', () => {
    const sides = BOOK_SPREADS.map(({ master }) =>
      master.bookLead!.corner.endsWith('-outer') ? 'outer' : 'bound',
    )
    for (let i = 1; i < sides.length; i += 1) {
      expect(sides[i], `book pages ${i} and ${i + 1} both bleed ${sides[i]}`).not.toBe(sides[i - 1])
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
    // Every gated project has a complete spine (WHAT/WHY/HOW/OUTCOME). This
    // is what caught Verve joining the book with a spine that stopped at WHY:
    // its page would have rendered two beats short of every other one.
    const n = BOOK_SLUGS.length
    expect(count(bookHtml, '>WHAT<')).toBe(n)
    expect(count(bookHtml, '>WHY<')).toBe(n)
    expect(count(bookHtml, '>HOW<')).toBe(n)
    expect(count(bookHtml, '>WHAT CAME OF IT<')).toBe(n)
  })

  test('every project is followed by its asset page, captions and all', () => {
    // One asset page per project, and each carries every caption it declares.
    // The captions are the alts Emilie signed in image-manifest.mjs, so this
    // also pins that the book keeps reading them from the one source.
    expect(count(bookHtml, 'pr-assets__lead"')).toBe(BOOK_SLUGS.length)
    for (const { master } of BOOK_SPREADS) {
      for (const a of [master.bookLead!, ...master.bookRegister!]) {
        if (a.figure) {
          // A figure leaves no file to look for, so the page is checked for a
          // string only that drawing carries.
          const marker: Record<string, string> = {
            'neuro-two-paths': 'THE FAST PATH',
            'verve-stack': 'AMENITIES PODIUM',
          }
          expect(bookHtml, `${master.slug}: the ${a.figure} figure is drawn`).toContain(
            marker[a.figure]!,
          )
          continue
        }
        const rung = manifest.grid?.[a.slug]?.[a.name]
        expect(bookHtml, `${a.slug}/${a.name} drawn on an asset page`).toContain(rung!.file)
      }
    }
  })

  test('the index lists every project, and the nine latest thoughts', () => {
    for (const w of WORK_ENTRIES) expect(bookHtml).toContain(w.title)

    // THE THOUGHTS ARE NOW A SELECTION (Emilie, 2026-08-12): nine of eighteen,
    // because the full list was most of why the page read as busy. The rows
    // are ordered newest first, so "the latest nine" is the top of the list and
    // not a second judgement about which essays matter.
    const thoughts = thoughtIndexEntries()
    const shown = thoughts.slice(0, 9)
    const hidden = thoughts.slice(9)
    for (const t of shown) expect(bookHtml, `${t.title} is on the index`).toContain(t.title)

    // AND THE PAGE MUST NOT CLAIM TO BE COMPLETE. A book that prints ten and
    // implies eighteen is the kind of quiet dishonesty this project does not
    // ship, so the foot states the real total next to what it shows.
    expect(hidden.length, 'some thoughts are genuinely omitted').toBeGreaterThan(0)
    // Matched against the markup with comments stripped: renderToString puts a
    // <!-- --> between two adjacent expressions, so the raw HTML carries
    // "18<!-- --> THOUGHTS" and a naive contains() would never fire.
    const text = bookHtml.replace(/<!--.*?-->/g, '')
    expect(text, 'the foot states the real total, not the number shown').toContain(
      `${thoughts.length} THOUGHTS`,
    )
  })

  // THE ABOUT PAGE REPLACED THE CV PAGE (Emilie, 2026-08-12). This test used to
  // assert EDUCATION and EXPERIENCE, the CV sheet's own headings; the sheet
  // left the book and those words left with it. What page 2 must now prove is
  // that its prose is the SIGNED landing bio rendered verbatim rather than
  // anything newly written for print, which is the entire reason the page ships
  // without draftCopy.
  test('the about page carries the signed bio verbatim, and the colophon closes', () => {
    // renderToString inserts <!-- --> between adjacent expressions, and the bio
    // is split per word to italicise its two variables, so strip the markup
    // before matching prose. (This is exactly how an earlier "18 THOUGHTS"
    // assertion failed against markup reading "18<!-- --> THOUGHTS".)
    // ...and renderToString escapes apostrophes to &#x27;, which is what made
    // the first version of this assertion fail on the one bio paragraph that
    // contains one ("which is counterintuitive isn't it?").
    const prose = bookHtml
      .replace(/<[^>]*>/g, '')
      .replace(/<!--.*?-->/g, '')
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
    for (const para of BIO) {
      const plain = para.replace(/<[^>]*>/g, '')
      expect(prose, 'the book prints the landing bio verbatim').toContain(plain)
    }
    // The two variables are set in italic, the same rendering the landing does.
    for (const v of BIO_VARIABLES) expect(bookHtml).toContain(`<em>${v}</em>`)
    // The CV sheet is GONE from the book, not merely moved.
    expect(bookHtml, 'the CV sheet left the book').not.toContain('pr-cv2')
    // The colophon closes with the landing's signed caption (escaped by
    // renderToString, so match around the apostrophe).
    expect(bookHtml).toContain('this is what')
    expect(bookHtml).toContain('on my mind')
  })

  // THE CONTENTS ON PAGE 2 MUST NAME REAL PAGES. A page number that drifts is
  // the one error in a contents list a reader always catches and never
  // forgives, and it cannot be caught by eye across twenty pages.
  test('the contents points at the page each project actually opens on', () => {
    BOOK_SPREADS.forEach((d, i) => {
      const page = String(3 + i * 2).padStart(2, '0')
      expect(
        bookHtml,
        `${d.master.title} is listed at page ${page}`,
      ).toContain(`>${page}</span>`)
    })
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
    // Education carries no dates by design since the CV pass (2026-07-27):
    // years live in EXPERIENCE and AWARDS, where a reader computes tenure.
    // Every entry that DOES declare dates must still print them.
    const dated = [...EDUCATION, ...EXPERIENCE].filter(e => e.dates)
    expect(dated.length).toBe(EXPERIENCE.length)
    for (const e of dated) {
      expect(cvHtml).toContain(e.dates)
    }
    expect(cvHtml).toContain('Rhino Compute')
    expect(cvHtml).not.toContain('—')
  })

  // THE WRITING COUNTS CANNOT GO STALE. cv.ts states them as literals so the
  // CV bundle never has to import the content graph; these two assertions are
  // what make the literals safe. Publish an essay or add a blog link and the
  // build fails here until cv.ts is corrected.
  test('the writing counts still match the real sources', () => {
    const essays = ENTRIES.filter(e => e.kind === 'thought').length
    expect(ESSAY_COUNT).toBe(essays)

    // The META half (<slug>.ts) is where `links` lives. This used to scan
    // '.tsx' back when one file held both halves; after the 2026-08-03 spine
    // split the .tsx files are spines and carry no links, so the scan silently
    // found zero. Excluding the folder's own .ts modules keeps it to projects.
    const mastersDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'projects')
    const NOT_A_PROJECT = new Set(['index.ts', 'types.ts', 'spines.eager.ts'])
    const metaFiles = readdirSync(mastersDir).filter(
      f => f.endsWith('.ts') && !f.endsWith('.spine.ts') && !NOT_A_PROJECT.has(f),
    )
    expect(metaFiles.length).toBe(21)
    const withBlog = metaFiles.filter(f =>
      readFileSync(join(mastersDir, f), 'utf8').includes('blog.iaac.net'),
    ).length
    expect(BLOG_COUNT).toBe(withBlog)
  })

  // THE RAIL CANNOT CLAIM A RELATION THE RECORD DOES NOT HAVE (2026-08-16).
  // Every plate's footer names the thought that project made her think of.
  // That line is a CLAIM about the map, so it is checked against the map: the
  // id must be a real thought, and CORRELATIONS must actually carry a thread
  // between the two. Without this, renaming or cutting a thread would leave
  // the printed book asserting a connection the site no longer draws — and a
  // PDF people keep is the worst place to find that out.
  test('every plate names a thought the map really threads to it', () => {
    const thoughts = new Set(ENTRIES.filter(e => e.kind === 'thought').map(e => e.id))
    for (const { master, entry } of BOOK_SPREADS) {
      const thoughtId = BOOK_THREAD[master.slug]
      expect(thoughtId, `${master.slug} has no thread chosen for its rail`).toBeTruthy()
      expect(thoughts.has(thoughtId!), `${master.slug} names "${thoughtId}", which is not a thought`).toBe(true)
      const threaded = CORRELATIONS.some(
        ([a, b]) =>
          (a === entry.id && b === thoughtId) || (b === entry.id && a === thoughtId),
      )
      expect(threaded, `the book says ${entry.id} -> ${thoughtId}, but the map carries no such thread`).toBe(true)
    }
  })

  // The rail is ONE LINE by construction (see PrintBook: a second line starves
  // the two-column spine, which then opens a third column off the sheet). The
  // build's overflow probe is the real guard, but it only runs when a PDF is
  // rendered; this catches the same mistake in a two-second unit run, and names
  // the ceiling so the next person editing a tech string knows one exists.
  test('no plate rail can outgrow its one line', () => {
    // THE RAIL IS ONE MEASURE SHARED BY TWO CELLS, which is why an earlier
    // version of this guard was wrong in both directions: it used a single
    // character ceiling, let a 96-character line through, and then failed
    // Sensi at 80 characters even though Sensi fits.
    //
    // The right-hand cell (url · date) sizes to its content and the LEFT cell
    // takes what is left, because the left one carries `flex: 1; min-width: 0`
    // and the right one has no flex at all. NeuroSpace has the longest URL in
    // the book, which is exactly why it was the plate that broke: same measure,
    // less of it left over.
    //
    // ⚠ NOT because the right cell is nowrap. An earlier version of this note
    // said so and it is false: print.css scopes `white-space: nowrap` to
    // `.pr-spread__foot > :last-child`, and the last child is the FOLIO, not
    // the url. The behaviour is right; the reason given for it was wrong.
    //
    // Calibrated from the browser, not guessed. The mono advances 7.6px per
    // character at 7.5pt with the rail's tracking, and NeuroSpace's left cell
    // measured 599px against its 44-character right cell, so the two cells
    // together hold about 121 characters. Every other plate agrees: Verve's
    // shorter URL measured 644px of left cell, which is the same total.
    const RAIL_CHARS = 121
    for (const { master, entry } of BOOK_SPREADS) {
      const id = BOOK_THREAD[master.slug]
      // Must mirror PrintBook's threadTitle: a declared spelling prints as it
      // is written, everything else is shouted. Measuring the wrong string
      // would make this guard agree with a book that overflows.
      const title = THREAD_LABEL[id!] ?? (ENTRIES.find(e => e.id === id)?.title ?? '').toUpperCase()
      const left = `${master.tech} · MADE ME THINK OF: ${title}`
      const right = `emiliechidiac.com/work/${entry.id} · ${fmtMonthYear(entry.date)}`
      const total = left.length + right.length
      expect(
        total,
        `${master.slug}'s rail needs ${total} characters (${left.length} left + ${right.length} right): "${left}"`,
      ).toBeLessThanOrEqual(RAIL_CHARS)
    }
  })
})
