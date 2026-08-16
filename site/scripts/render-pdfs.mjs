// G5 · THE BUILD-TIME PDFs (REDESIGN-SPEC §9 + §10). Runs AFTER `vite build`
// in the build chain: serves the built dist/, prints /print/book (A4
// landscape) and /print/cv (A4 portrait) with headless Chrome, writes both
// PDFs into dist/assets/ (this build's artifact, what GitHub Pages ships)
// AND public/assets/ (committed: the dev server's copy; regenerated every
// build so it can never go stale), then PROVES the CV's ATS text layer by
// extraction before letting the build pass.
//
// The wait sequence matters: Source Serif is lazy-loaded and
// document.fonts.ready can resolve before the face is ever requested, so
// every printed face is force-loaded explicitly. waitUntil is
// 'domcontentloaded' (never 'load' or networkidle: the async GoatCounter
// script fetch gates the load event, so a stalled gc.zgo.at would fail the
// build); everything the print actually needs is waited for explicitly.
import puppeteer from 'puppeteer'
import { preview } from 'vite'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { addOutline, readLinks, definedDestinations, rasterCensus } from './pdf-outline.mjs'
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const SITE = join(here, '..')
const DIST = join(SITE, 'dist')
const PUBLIC = join(SITE, 'public', 'assets')
const CALIBRATION = join(SITE, '..', 'content', 'RECRUITER-CALIBRATION.md')

const TARGETS = [
  { route: '/print/book', file: 'portfolio-emilie-el-chidiac.pdf', kind: 'book' },
  { route: '/print/cv', file: 'cv-emilie-el-chidiac.pdf', kind: 'cv' },
]

// Every face the print surfaces set (fonts.css); loading is idempotent.
const FACES = [
  '600 16px Archivo',
  '400 16px Archivo',
  '400 16px "Source Serif 4"',
  'italic 400 16px "Source Serif 4"',
  '400 12px "Martian Mono"',
  '400 16px Caveat',
]

const failures = []
const fail = (msg) => {
  failures.push(msg)
  console.error('  ✗ ' + msg)
}

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('render-pdfs: no dist/index.html; run `vite build` first (this script is part of `npm run build`).')
  process.exit(1)
}

// ---- extraction (pdfjs legacy build: the supported Node path; text needs
// no canvas/DOMMatrix). Items are grouped into lines by their rounded y so
// "Emilie El Chidiac" can be asserted contiguous even though Chromium emits
// many small text items per line.
async function pdfText(bytes) {
  const doc = await getDocument({ data: new Uint8Array(bytes) }).promise
  const pages = []
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p)
    const content = await page.getTextContent()
    const lines = new Map()
    for (const item of content.items) {
      if (!('str' in item) || item.str.trim() === '') continue
      const y = Math.round(item.transform[5])
      if (!lines.has(y)) lines.set(y, [])
      lines.get(y).push({ x: item.transform[4], str: item.str })
    }
    const ordered = [...lines.entries()]
      .sort((a, b) => b[0] - a[0]) // PDF y grows upward; read top-down
      .map(([, parts]) =>
        parts
          .sort((a, b) => a.x - b.x)
          .map(p => p.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim(),
      )
    pages.push(ordered)
  }
  return { numPages: doc.numPages, pages }
}

function assertCv(text) {
  const lines = text.pages.flat()
  const all = lines.join('\n')
  const check = (cond, msg) => (cond ? console.log('  ✓ ' + msg) : fail('CV PDF: ' + msg))

  check(text.numPages === 1, 'one page exactly' + (text.numPages === 1 ? '' : ` (got ${text.numPages})`))
  check(lines.some(l => l.includes('Emilie El Chidiac')), 'name reads contiguously in the text layer')
  check(all.includes('chidiacemilie@gmail.com'), 'current email present')
  check(all.includes('Design Technology Architect'), 'anchor title present')
  check(all.includes('Aug 2024 - Present'), 'real "Aug 2024 - Present" dates in the embedded text')
  check(all.includes('Rhino Compute'), '"Rhino Compute" spelled with the space')
  check(!all.includes('—'), 'zero em dashes')

  // Single column ⇒ the sections extract in reading order. The order changed at
  // the CV pass (2026-07-27): education leads, skills moved above the awards,
  // and WRITING & RESEARCH joined. The screen page renders the same sequence.
  // CERTIFICATES left the CV at the same pass; the book still carries it.
  const order = ['EDUCATION', 'EXPERIENCE', 'SKILLS', 'AWARDS & RECOGNITION', 'WRITING & RESEARCH']
  const idx = order.map(h => lines.findIndex(l => l === h))
  check(
    idx.every(i => i >= 0) && idx.every((v, i) => i === 0 || v > idx[i - 1]),
    'sections extract in single-column reading order (EDUCATION → WRITING & RESEARCH)',
  )

  // Keyword spot-check against the LOCAL calibration file (git-ignored;
  // read from disk at run time — nothing from it, not even a heading, is
  // embedded in this committed script). The file opts in by carrying a
  // marker line of the SCRIPT'S OWN grammar: <!-- ats-must-hit: a · b -->.
  // Absent file or absent marker (e.g. CI) = skipped with a note, never a
  // failure.
  if (existsSync(CALIBRATION)) {
    const cal = readFileSync(CALIBRATION, 'utf8')
    const marker = cal.match(/<!--\s*ats-must-hit:\s*([^>]+?)\s*-->/)
    if (marker) {
      const words = marker[1].split('·').map(w => w.trim()).filter(Boolean)
      const lower = all.toLowerCase()
      const missing = words.filter(w => !lower.includes(w.toLowerCase()))
      check(missing.length === 0, `calibration must-hit keywords all present${missing.length ? ` (missing: ${missing.join(', ')})` : ''}`)
    } else {
      console.log('  · calibration file has no <!-- ats-must-hit: ... --> marker; keyword spot-check skipped')
    }
  } else {
    console.log('  · calibration file not on disk (CI?); keyword spot-check skipped')
  }
}

// THE LINKS PASS (Emilie, 2026-08-16), REBUILT 2026-08-17 after an adversarial
// review showed the first version could not fail.
//
// The defect it exists to catch: the book shipped for months with every URL on
// every page printed as dead type, and nothing in the build or on the site said
// so. The first repair asserted a GLOBAL TOTAL against a floor of 40 while the
// real count was 103. Unwiring all 21 index tiles left 82 and passed; all 8
// contents anchors left 95 and passed; all 8 thread links left 95 and passed.
// A guard carrying 2.5x of slack is decoration.
//
// Two things were wrong and both are fixed here.
//   1 - IT COUNTED ANNOTATIONS, NOT LINKS. Chrome emits one /Link per inline
//       TEXT RUN, so `{SITE}/work/{entry.id}` (three JSX children) arrives as
//       three annotations. The floor's units were never the units its own
//       comment reasoned in, and a pure JSX tidy-up would have dropped the
//       total by a third with no signal. Everything below counts DISTINCT
//       targets, so the numbers mean what the assertions say.
//   2 - IT ASSERTED ONE SUM. A surplus on one surface hid the total loss of
//       another. Every surface is asserted on its own now, against the same
//       data the book renders from, so the expectations cannot go stale.
//
// The in-document check is the one that would have caught the subtler bug:
// Chrome writes NO annotation at all for an href whose target id is missing, so
// a renamed anchor deletes its own link silently.
async function assertLinks(bytes, spreads, workCount) {
  const check = (cond, msg) => (cond ? console.log('  ✓ ' + msg) : fail('book PDF: ' + msg))
  const { annots, pages } = await readLinks(bytes)
  const defined = await definedDestinations(bytes)

  const distinct = pages.reduce((n, p) => n + p.uris.length + p.dests.length, 0)
  console.log(`  · ${distinct} distinct link targets across ${annots} annotations`)

  check(pages[0].uris.length >= 1, 'the cover reaches the site')

  const contents = pages[1].dests.length
  check(
    contents === spreads + 1,
    `the contents page opens ${spreads + 1} in-document destinations (found ${contents})`,
  )

  // EVERY in-document link must resolve. This is what makes a renamed anchor
  // loud instead of silent.
  const unresolved = pages.flatMap((p, i) =>
    p.dests.filter(d => !defined.has(d)).map(d => `p${i + 1}:${d}`),
  )
  check(
    unresolved.length === 0,
    `every in-document link resolves${unresolved.length ? ` (dangling: ${unresolved.join(', ')})` : ''}`,
  )

  const plateMisses = []
  for (let i = 2; i < 2 + spreads * 2; i++) {
    if (!pages[i].uris.some(u => u.includes('/work/'))) plateMisses.push(i + 1)
  }
  check(
    plateMisses.length === 0,
    `every project page reaches its own work page${plateMisses.length ? ` (missing on ${plateMisses.join(', ')})` : ''}`,
  )

  const threadMisses = []
  for (let i = 2; i < 2 + spreads * 2; i += 2) {
    if (!pages[i].uris.some(u => u.includes('/thoughts/'))) threadMisses.push(i + 1)
  }
  check(
    threadMisses.length === 0,
    `every plate reaches the thought it names${threadMisses.length ? ` (missing on ${threadMisses.join(', ')})` : ''}`,
  )

  const idx = pages[pages.length - 2].uris.filter(u => u.includes('/work/')).length
  check(idx >= workCount, `the index reaches all ${workCount} projects (found ${idx})`)

  const colo = pages[pages.length - 1].uris
  check(colo.some(u => u.startsWith('mailto:')), 'the colophon carries a live email address')
  check(
    colo.some(u => u.includes('linkedin')) && colo.some(u => u.includes('github')),
    'the colophon carries LinkedIn and GitHub',
  )
}

// THE OUTLINE MUST BE CHECKED AGAINST THE BOOK, NOT AGAINST ITSELF. The first
// version passed the same scraped array to addOutline and to the assertion, so
// it compared pdf-lib's output with pdf-lib's own input: deleting a page's
// data-outline removed it from BOTH sides and the check stayed green. The
// expectation is derived from the book's own contents now, and every bookmark's
// destination page is resolved, so a row pointing at the wrong sheet fails too.
async function assertOutline(bytes, expectedTitles) {
  const check = (cond, msg) => (cond ? console.log('  ✓ ' + msg) : fail('book PDF: ' + msg))
  const doc = await getDocument({ data: new Uint8Array(bytes) }).promise
  const tree = await doc.getOutline()
  const got = (tree ?? []).map(t => t.title)
  check(
    got.length === expectedTitles.length && got.every((t, i) => t === expectedTitles[i]),
    `the bookmark panel is the book's own contents (expected ${expectedTitles.length} rows: ${expectedTitles.join(' | ')}; got ${got.join(' | ') || 'nothing'})`,
  )
  let last = -1
  let ordered = true
  for (const item of tree ?? []) {
    const dest = typeof item.dest === 'string' ? await doc.getDestination(item.dest) : item.dest
    const idx = dest ? await doc.getPageIndex(dest[0]) : -1
    if (idx < last) ordered = false
    if (idx >= 0) last = idx
  }
  check(ordered, 'every bookmark lands on a real page, in reading order')
}

// THE PAGE MUST STILL BE DRAWN (2026-08-17). A dotted leader written as a CSS
// radial-gradient printed as nine tiling patterns, each painting a full-sheet
// bitmap at an effective 72dpi, and it passed every gate this file had: the
// page fit its box, the text layer was intact, the links were up, the weight
// was under target. Nothing looked at whether the page was still DRAWN.
// The cover, the about, the index and the colophon carry no photographs, so an
// image or a pattern on one of them means a CSS construct silently rasterised.
// The same trap waits for filter, box-shadow and backdrop-filter.
async function assertVector(bytes, domPages) {
  const check = (cond, msg) => (cond ? console.log('  ✓ ' + msg) : fail('book PDF: ' + msg))
  const census = await rasterCensus(bytes)
  const textPages = [0, 1, domPages - 2, domPages - 1]
  const dirty = textPages
    .map(i => ({ page: i + 1, ...census[i] }))
    .filter(x => x.images > 0 || x.patterns > 0)
  check(
    dirty.length === 0,
    `the drawn pages are still vector${dirty.length ? ` (rasterised: ${dirty.map(d => `p${d.page} ${d.images}img ${d.patterns}pat`).join(', ')})` : ''}`,
  )
  const anyPattern = census.map((c, i) => (c.patterns ? i + 1 : null)).filter(Boolean)
  check(
    anyPattern.length === 0,
    `no page paints through a tiling pattern${anyPattern.length ? ` (pages ${anyPattern.join(', ')})` : ''}`,
  )
}

function assertBook(text, domPages) {
  const check = (cond, msg) => (cond ? console.log('  ✓ ' + msg) : fail('book PDF: ' + msg))
  check(
    text.numPages === domPages,
    `PDF page count matches the rendered document (${text.numPages} vs ${domPages} pages)`,
  )
  // THE BOOK REWORK (2026-08-11): each project holds a facing pair, so the
  // floor moved from 9 to 20 (cover + 8 pairs + index + CV + colophon).
  check(domPages >= 20, `a whole book (${domPages} pages: cover + about + 8 facing pairs + index + colophon)`)
  const empty = text.pages.map((p, i) => (p.length === 0 ? i + 1 : null)).filter(Boolean)
  // The cover page is allowed to be text-light but never empty (name +
  // rail); any empty page means a layout overflowed or vanished. The asset
  // pages each carry a header line and their captions, so they count too.
  check(empty.length === 0, `no empty pages${empty.length ? ` (pages ${empty.join(', ')})` : ''}`)
  const all = text.pages.flat().join('\n')
  check(!all.includes('—'), 'zero em dashes')
}

// THE WEIGHT (2026-08-11). This book is a LEAVE-BEHIND: it gets attached to
// an application. Above 10MB many corporate mail servers drop the message
// silently and the sender never finds out, and the practical advice for a
// portfolio anyone actually emails is to stay under 5MB. Growing the book
// from 10 to 20 pages made this a real constraint rather than a note, so it
// is a build assertion: HARD FAIL past 9MB, and a loud warning past 5MB so
// the drift is visible long before it is a problem.
const PDF_HARD_MAX = 9 * 1024 * 1024
const PDF_TARGET = 5 * 1024 * 1024
function assertWeight(bytes, kind) {
  const mb = (bytes / 1024 / 1024).toFixed(1)
  // The thresholds are read from the constants, never restated: a message
  // that can disagree with the rule it is reporting is worse than no message.
  const max = (PDF_HARD_MAX / 1024 / 1024).toFixed(0)
  const target = (PDF_TARGET / 1024 / 1024).toFixed(0)
  if (bytes > PDF_HARD_MAX) {
    fail(`${kind} PDF is ${mb}MB, past the ${max}MB ceiling (10MB is where mail servers start dropping it)`)
  } else if (bytes > PDF_TARGET) {
    console.warn(`  ! ${kind} PDF is ${mb}MB, over the ${target}MB target for something she emails`)
  } else {
    console.log(`  ✓ ${mb}MB, inside the ${target}MB target`)
  }
}

// ---- serve + print --------------------------------------------------------
const server = await preview({
  root: SITE,
  preview: { port: 4173, strictPort: false, open: false },
})
const port = server.httpServer.address().port
const origin = `http://localhost:${port}`
console.log(`render-pdfs: dist served at ${origin}`)

// --no-sandbox: ubuntu-24.04 runners restrict unprivileged user namespaces
// (we only ever render our own dist); inert on Windows.
const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
})

try {
  for (const target of TARGETS) {
    console.log(`\n${target.route} -> ${target.file}`)
    const page = await browser.newPage()
    await page.goto(origin + target.route, { waitUntil: 'domcontentloaded', timeout: 60_000 })
    await page.waitForSelector('[data-print-ready]', { timeout: 30_000 })
    await page.evaluate(
      (faces) => Promise.all(faces.map(f => document.fonts.load(f))).then(() => document.fonts.ready),
      FACES,
    )
    await page.waitForFunction(
      () => [...document.images].every(img => img.complete && img.naturalWidth > 0),
      { timeout: 60_000 },
    )
    const domPages = await page.evaluate(() => document.querySelectorAll('.pr-page').length)

    // A page div that overflows its A4 box clips silently (overflow:
    // hidden), never changing the page count: probe scroll sizes so silent
    // clipping fails the build instead of shipping a cropped page.
    const overflowing = await page.evaluate(() =>
      [...document.querySelectorAll('.pr-page')]
        .map((p, i) => ({ page: i + 1, ow: p.scrollWidth - p.clientWidth, oh: p.scrollHeight - p.clientHeight }))
        .filter(x => x.ow > 1 || x.oh > 1),
    )
    if (overflowing.length) {
      fail(
        `${target.route}: content overflows its page box on page(s) ` +
          overflowing.map(x => `${x.page} (${x.ow}x${x.oh}px over)`).join(', '),
      )
    }

    // A BOX THAT MUST CONTAIN ITS OWN CONTENT (2026-08-11). The page probe
    // above only sees content pushed past the SHEET. The CV page's record
    // block failed a different way: its content ran out through its own border
    // and printed on top of the footer, while the page box stayed exactly A4
    // and the probe passed. Anything marked data-must-fit is measured on its
    // own terms, so that class of collision fails the build too.
    const spilling = await page.evaluate(() =>
      [...document.querySelectorAll('[data-must-fit]')]
        .map((el, i) => ({
          i: i + 1,
          cls: el.className,
          ow: el.scrollWidth - el.clientWidth,
          oh: el.scrollHeight - el.clientHeight,
        }))
        .filter(x => x.ow > 1 || x.oh > 1),
    )
    if (spilling.length) {
      fail(
        `${target.route}: content escapes its own box in ` +
          spilling.map(x => `.${x.cls} (${x.ow}x${x.oh}px over)`).join(', '),
      )
    }

    // THE OUTLINE (2026-08-16). Read the chapter names off the printed DOM
    // rather than restating them here: the panel's order is then the book's
    // order by construction, and a page that is added, moved or renamed
    // carries its bookmark with it. Only pages that name themselves count,
    // so the asset pages stay out of the panel.
    const outline = await page.evaluate(() =>
      [...document.querySelectorAll('.pr-page')]
        .map((el, i) => ({ title: el.dataset.outline, page: i + 1 }))
        .filter(x => x.title),
    )

    // THE SECOND OPINION. Everything above is scraped from `data-outline`; the
    // assertions must not be checked against the same scrape or they only prove
    // pdf-lib copied an array. These read the book the way a reader does — the
    // plate TITLES off the printed headings, and the index's project count off
    // the tiles actually drawn on page 19 — so the two routes have to agree.
    const expectedOutline = await page.evaluate(() => {
      const pages = [...document.querySelectorAll('.pr-page')]
      const titles = pages
        .map(p => p.querySelector('.pr-spread__title'))
        .filter(Boolean)
        .map(h => h.textContent.trim())
      return ['Cover', 'About', ...titles, 'Index', 'Contact']
    })
    const indexProjects = await page.evaluate(
      () => document.querySelectorAll('.pr-index__grid > *').length,
    )

    const printed = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      timeout: 60_000,
    })
    await page.close()

    const pdf = target.kind === 'book' ? Buffer.from(await addOutline(printed, outline)) : printed

    // VERIFY BEFORE PUBLISHING: the committed public/ copy is only replaced
    // by a PDF that passed its own checks (a failing build must never
    // overwrite the known-good artifact the dev server serves). The dist/
    // copy always lands: a failed build never deploys anyway.
    const before = failures.length
    const text = await pdfText(pdf)
    if (target.kind === 'cv') assertCv(text)
    else {
      assertBook(text, domPages)
      // (domPages - 4) / 2 = the project count, read off the printed book
      // rather than imported, so this file never needs to know the contents.
      const spreads = (domPages - 4) / 2
      // ⚠ THE OUTLINE EXPECTATION IS READ FROM THE BOOK'S OWN PAGES, not from
      // the `outline` array that wrote the bookmark tree. Passing that array to
      // both sides made the assertion compare pdf-lib's output with pdf-lib's
      // input, so deleting a page's data-outline removed the row from BOTH and
      // the check stayed green. The plate titles come from the rendered page
      // headings, which is a different route to the same truth.
      await assertLinks(pdf, spreads, indexProjects)
      await assertOutline(pdf, expectedOutline)
      await assertVector(pdf, domPages)
    }
    assertWeight(pdf.length, target.kind)
    const ok = failures.length === before && overflowing.length === 0 && spilling.length === 0

    const distOut = join(DIST, 'assets')
    mkdirSync(distOut, { recursive: true })
    writeFileSync(join(distOut, target.file), pdf)
    if (ok) {
      mkdirSync(PUBLIC, { recursive: true })
      writeFileSync(join(PUBLIC, target.file), pdf)
      console.log(`  ${Math.round(pdf.length / 1024)}KB -> dist/assets + public/assets`)
    } else {
      console.error(`  ${Math.round(pdf.length / 1024)}KB -> dist/assets only; public copy left untouched (checks failed)`)
    }
  }
} finally {
  await browser.close()
  await server.close()
}

if (failures.length) {
  console.error(`\nrender-pdfs: ${failures.length} check(s) failed; the build must not ship these PDFs.`)
  process.exitCode = 1
} else {
  console.log('\nrender-pdfs: both PDFs regenerated and verified.')
}
