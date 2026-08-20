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
import { designCensus, channelDelta } from './pdf-design.mjs'
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

// THE FONTS MUST ACTUALLY EXIST (the guards audit, 2026-08-18). This list and
// fonts.css can drift apart silently: document.fonts.load() on a family no
// stylesheet declares resolves EMPTY rather than rejecting, so a renamed face
// would ship the whole book in Times with every other check green. Two guards:
//   1 - here, FACES is reconciled against the families fonts.css declares, in
//       both directions, so the list cannot go stale.
//   2 - in the page, after fonts.ready, document.fonts.check() must be true
//       for every face (see the print loop), so a face that failed to LOAD
//       (missing woff2, bad path) is named instead of silently substituted.
const FONTS_CSS = join(SITE, 'src', 'styles', 'fonts.css')
const faceFamily = (face) => face.match(/"([^"]+)"\s*$/)?.[1] ?? face.split(' ').pop()
{
  const cssFamilies = new Set(
    [...readFileSync(FONTS_CSS, 'utf8').matchAll(/font-family:\s*'([^']+)'/g)].map(m => m[1]),
  )
  for (const face of FACES) {
    if (!cssFamilies.has(faceFamily(face))) {
      fail(`FACES lists "${faceFamily(face)}" but fonts.css declares no such family`)
    }
  }
  for (const fam of cssFamilies) {
    if (!FACES.some(f => faceFamily(f) === fam)) {
      fail(`fonts.css declares "${fam}" but FACES never loads it, so the print never waits for it`)
    }
  }
}

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('render-pdfs: no dist/index.html; run `vite build` first (this script is part of `npm run build`).')
  process.exit(1)
}

// ---- extraction (pdfjs legacy build: the supported Node path; text needs
// no canvas/DOMMatrix). Items are grouped into lines by their rounded y so
// "Emilie El Chidiac" can be asserted contiguous even though Chromium emits
// many small text items per line.
//
// ⚠ THE RUNS ARE JOINED BY THEIR GEOMETRY, NOT BLINDLY BY A SPACE
// (2026-08-19, the CV's links pass). This used to be `.join(' ')`, which was a
// guess that held only because nothing had ever split a run mid-word. Chrome
// emits a separate text run per inline box, and where the source has a space
// at that boundary it does NOT emit a space CHARACTER — it advances the pen
// instead. Measured on the printed CV, at the writing line:
//   "Charles Abi Chahine:" | gap 2.054pt | "Optimizing for the Mind" | gap
//   0.003pt | ", with Dr. Cleo Valentine"
// One of those boundaries is a space and the other is not, and they are
// indistinguishable to a rule that inserts a space at every seam: linking the
// podcast title made the plain-text CV read "the Mind , with Dr.", which is
// what an ATS would have parsed. Measuring the gap tells the two apart, and it
// is also simply what the bytes say — pdf.js's own text-layer builder and
// pdfminer both position runs rather than assuming separators.
// The threshold is a quarter of the smallest space on the sheet (7pt mono
// measures 2.05pt), which sits an order of magnitude clear of both cases.
// PROVEN NON-DESTRUCTIVE: re-extracted under this rule, the CV printed BEFORE
// any link existed reads character-for-character as it did under `.join(' ')`.
const RUN_GAP_PT = 0.6
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
      lines.get(y).push({ x: item.transform[4], w: item.width, str: item.str })
    }
    const ordered = [...lines.entries()]
      .sort((a, b) => b[0] - a[0]) // PDF y grows upward; read top-down
      .map(([, parts]) =>
        parts
          .sort((a, b) => a.x - b.x)
          .reduce(
            (line, part, i, all) =>
              i === 0
                ? part.str
                : line + (part.x - (all[i - 1].x + all[i - 1].w) > RUN_GAP_PT ? ' ' : '') + part.str,
            '',
          )
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

  // THE TEXT LAYER SURVIVED THE LINKS (2026-08-19). Wrapping the four
  // addresses in <a> elements splits one paragraph into four inline boxes, and
  // Chrome emits a separate text run per box. This extractor joins the runs on
  // a line with a single space, so a link boundary that falls anywhere OTHER
  // than an existing space would insert one — "Optimizing for the Mind ,
  // with Dr. Cleo Valentine" — and the plain-text CV an ATS reads would quietly
  // stop matching the page. The contact row is the densest case (four links and
  // three separators on one justified line) and it is asserted whole: if the
  // links ever fracture the text layer, this is where it shows first.
  check(
    lines.some(
      l =>
        l ===
        'chidiacemilie@gmail.com · linkedin.com/in/EmilieElChidiac · github.com/hi-em · emiliechidiac.com',
    ),
    'the contact row extracts as one unbroken line, links and all',
  )
  // The writing line's third part links a title MID-SENTENCE, which is the
  // only boundary on the page that does not fall on a space. Its two halves are
  // asserted contiguous for the same reason.
  check(
    all.includes('18 essays at emiliechidiac.com/thoughts'),
    'the writing line still reads through its first link',
  )
  check(
    all.includes('Optimizing for the Mind, with Dr. Cleo Valentine'),
    'the podcast title still reads into the words after it (no space before the comma)',
  )

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

// THE CV'S LINKS (Emilie, 2026-08-19). The book learned to carry real link
// annotations at the links pass; the CV never did, and it is the one document
// in the set whose entire job is to be followed up on. Measured before the
// repair: 1 page, 0 annotations, 0 targets — every address on it dead type.
//
// ⚠ THE GRAMMAR IS THE BOOK'S, deliberately, because the book's was argued
// down twice already (see assertLinks below): DISTINCT TARGETS, never
// annotation counts — Chrome emits one /Link per inline text run, so a JSX
// tidy-up moves the annotation total and means nothing — and PER SURFACE,
// never one global sum, because a surplus on one surface hides the total loss
// of another.
//
// The load-bearing check is the two-way agreement with the printed DOM.
// Chrome writes NO annotation at all for an href it cannot resolve: a link
// that dies dies SILENTLY, leaving type that still looks like an address.
// Comparing the page's own hrefs against the targets actually in the bytes is
// the only thing that sees that, and it cannot go stale, because both sides
// are read off this build.
//
// ⚠ AND A SCRAPE THAT RETURNS NOTHING MUST NOT PASS. `[...] .every()` over an
// empty list is true, so a rotted `.pr-ats a[href]` selector would make the
// agreement check vacuous and green. The four contact targets are therefore
// restated LITERALLY here — they are the page's fixed furniture, unchanged
// since the CV pass — and the per-surface counts are pinned, so the scrape has
// to be alive before its own assertion means anything.
const CV_CONTACT_TARGETS = [
  'mailto:chidiacemilie@gmail.com',
  'https://linkedin.com/in/EmilieElChidiac',
  'https://github.com/hi-em',
  'https://emiliechidiac.com',
]
// 8 project bullets (data/cv.ts's CV_PROJECT_LINKS, whose count and one-bullet
// -each uniqueness cv.test.ts pins independently) + the podcast in the writing
// line = 9 distinct /work/ doors.
const CV_WORK_TARGETS = 9
// Chrome normalises a bare origin to a trailing slash in the annotation URI,
// so the two sides are compared without one.
const trimSlash = (u) => u.replace(/\/$/, '')

async function assertCvLinks(bytes, domHrefs) {
  const check = (cond, msg) => (cond ? console.log('  ✓ ' + msg) : fail('CV PDF: ' + msg))
  const { annots, pages } = await readLinks(bytes)
  const uris = new Set(pages.flatMap(p => p.uris).map(trimSlash))
  const dests = pages.flatMap(p => p.dests)
  console.log(`  · ${uris.size} distinct link targets across ${annots} annotations`)

  const want = new Set(domHrefs.map(trimSlash))
  check(want.size > 0, `the printed CV declares link hrefs at all (found ${want.size})`)

  const dropped = [...want].filter(h => !uris.has(h))
  check(
    dropped.length === 0,
    `every href the page declares became a real annotation${dropped.length ? ` (Chrome dropped: ${dropped.join(', ')})` : ''}`,
  )
  const stray = [...uris].filter(u => !want.has(u))
  check(
    stray.length === 0,
    `the PDF reaches nothing the page does not declare${stray.length ? ` (stray: ${stray.join(', ')})` : ''}`,
  )

  const missingContact = CV_CONTACT_TARGETS.filter(t => !uris.has(trimSlash(t)))
  check(
    missingContact.length === 0,
    `the contact row reaches all four addresses${missingContact.length ? ` (missing: ${missingContact.join(', ')})` : ''}`,
  )

  const works = [...uris].filter(u => u.includes('/work/'))
  check(
    works.length === CV_WORK_TARGETS,
    `the record reaches ${CV_WORK_TARGETS} project pages (found ${works.length}: ${works.map(w => w.split('/work/')[1]).join(', ')})`,
  )

  const writing = ['/thoughts', 'blog.iaac.net', '/work/podcast']
  const missingWriting = writing.filter(w => ![...uris].some(u => u.includes(w)))
  check(
    missingWriting.length === 0,
    `the writing line reaches all three of its destinations${missingWriting.length ? ` (missing: ${missingWriting.join(', ')})` : ''}`,
  )

  // A one-page document has nowhere to jump, so the five section headings are
  // NOT anchors here (they are on screen, where the record is four screens
  // long). An in-document destination on this sheet means someone wired a
  // link from a heading to itself.
  check(
    dests.length === 0,
    `nothing links inside the sheet${dests.length ? ` (in-document destinations: ${dests.join(', ')})` : ''}`,
  )
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
async function assertLinks(bytes, spreads, workCount, footWorkHrefs) {
  const check = (cond, msg) => (cond ? console.log('  ✓ ' + msg) : fail('book PDF: ' + msg))
  const { annots, pages } = await readLinks(bytes)
  const defined = await definedDestinations(bytes)

  const distinct = pages.reduce((n, p) => n + p.uris.length + p.dests.length, 0)
  console.log(`  · ${distinct} distinct link targets across ${annots} annotations`)

  // The ORIGIN, not just any URI: "some annotation exists" would be satisfied
  // by a mailto or a stray thought link, while the cover's one job is to hand
  // the reader the site. The domain is the apex the whole repo deploys to
  // (lib/routes' SITE_ORIGIN, live since 2026-07-12), restated here because
  // this script cannot import a .ts module.
  check(
    pages[0].uris.some(u => u.includes('emiliechidiac.com')),
    'the cover reaches the site origin',
  )

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

  // ITS OWN work page, not just any /work/ (the guards audit, 2026-08-18):
  // "some /work/ link" is satisfied when every footer points at Sensi. The
  // expected id per page is scraped off the printed DOM's own foot, so the
  // order of the plates is read from the book rather than restated here.
  const plateMisses = []
  for (let i = 2; i < 2 + spreads * 2; i++) {
    const id = footWorkHrefs[i]?.match(/\/work\/([^/?#]+)/)?.[1]
    if (!id) {
      plateMisses.push(`p${i + 1} (no /work/ href in its printed foot; selector rot?)`)
      continue
    }
    if (!pages[i].uris.some(u => u.includes(`/work/${id}`))) {
      plateMisses.push(`p${i + 1} (does not reach /work/${id})`)
    }
  }
  check(
    plateMisses.length === 0,
    `every project page reaches its OWN work page${plateMisses.length ? ` (${plateMisses.join(', ')})` : ''}`,
  )

  const threadMisses = []
  for (let i = 2; i < 2 + spreads * 2; i += 2) {
    if (!pages[i].uris.some(u => u.includes('/thoughts/'))) threadMisses.push(i + 1)
  }
  check(
    threadMisses.length === 0,
    `every plate reaches the thought it names${threadMisses.length ? ` (missing on ${threadMisses.join(', ')})` : ''}`,
  )

  // workCount is scraped off the DOM's tile grid, so a rotted selector would
  // report 0 and ">= 0" would pass. The registry's own count is pinned at
  // exactly 21 in validate-registry.test.ts; restating it here as an
  // independent expectation makes the scrape falsifiable.
  check(workCount === 21, `the index page draws all 21 project tiles (found ${workCount})`)
  const idx = pages[pages.length - 2].uris.filter(u => u.includes('/work/')).length
  check(idx === workCount, `the index reaches exactly ${workCount} projects (found ${idx})`)

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
  // A bookmark whose destination resolves to NO page used to pass here: idx
  // came back -1 and the order loop simply skipped it, so a bookmark pointing
  // into the void was indistinguishable from a good one. Dangling rows are
  // named now, and named failures are the whole point of this file.
  let last = -1
  let ordered = true
  const dangling = []
  for (const item of tree ?? []) {
    let idx = -1
    try {
      const dest = typeof item.dest === 'string' ? await doc.getDestination(item.dest) : item.dest
      idx = dest ? await doc.getPageIndex(dest[0]) : -1
    } catch {
      idx = -1
    }
    if (idx === -1) dangling.push(item.title)
    if (idx < last && idx >= 0) ordered = false
    if (idx >= 0) last = idx
  }
  check(
    dangling.length === 0,
    `every bookmark resolves to a real page${dangling.length ? ` (dangling: ${dangling.join(' | ')})` : ''}`,
  )
  check(ordered, 'the bookmarks land in reading order')
}

// THE PAGE MUST STILL BE DRAWN (2026-08-17). A dotted leader written as a CSS
// radial-gradient printed as nine tiling patterns, each painting a full-sheet
// bitmap at an effective 72dpi, and it passed every gate this file had: the
// page fit its box, the text layer was intact, the links were up, the weight
// was under target. Nothing looked at whether the page was still DRAWN.
// The cover, the about, the index and the colophon carry no photographs, so an
// image or a pattern on one of them means a CSS construct silently rasterised.
// The same trap waits for filter, box-shadow and backdrop-filter.
async function assertVector(bytes, domPages, domImgCounts) {
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
  // THE PER-PAGE BASELINE (the guards audit, 2026-08-18). The four text pages
  // above are the pages that carry NO photographs; the plate and asset pages
  // legitimately carry several, which is exactly where a CSS construct
  // rasterising would have hidden. Every page's image-XObject count is held to
  // the number of <img> elements the rendered DOM actually declares on it: one
  // more raster than the page has photographs means something that should have
  // been drawn was painted as a bitmap. (This is the check that would have
  // caught the gradient regression on a page that also had pictures.)
  const excess = census
    .map((c, i) => ({ page: i + 1, pdf: c.images, dom: domImgCounts[i] ?? 0 }))
    .filter(x => x.pdf > x.dom)
  check(
    excess.length === 0,
    `no page carries more rasters than the images it declares${excess.length ? ` (${excess.map(x => `p${x.page} ${x.pdf} rasters vs ${x.dom} imgs`).join(', ')})` : ''}`,
  )
  const anyPattern = census.map((c, i) => (c.patterns ? i + 1 : null)).filter(Boolean)
  check(
    anyPattern.length === 0,
    `no page paints through a tiling pattern${anyPattern.length ? ` (pages ${anyPattern.join(', ')})` : ''}`,
  )
}

// THE HOUSE STYLE (the consistency pass, Emilie's rulings, 2026-08-19). Five
// agents measured the built book — footer geometry, margins as spreads, a font
// census, a color census, baseline rhythm — and every drift they found was
// ruled on. These four laws are the rulings, re-measured from the PDF BYTES on
// every build so none of them can reopen quietly:
//   1 · THE FOOT. It used to JUMP 6.1mm at every page turn (plates derived
//       theirs from flow padding, asset pages pinned theirs to a hemline) and
//       the folio wandered between three distances from the trim. One
//       baseline now, one folio edge — and after her judgment round
//       (2026-08-19, "i want things centered") no parity mirror either.
//   2 · THE UNIFORM FRAME. 12mm on every side of every page (her ruling,
//       2026-08-19: "top, bottom, left, right, all margin at 12mm"). This
//       replaced the bound-book mirror (18mm gutter / 12mm outer, flipping
//       by parity), which on screens read as the footer wandering.
//   3 · THE FONT ALLOWLIST. Four families, and a pinned size set: the index
//       deks printed at a size no stylesheet declared for MONTHS before the
//       census caught it. Pages whose DOM carries drawn <svg> text (the cover
//       art, the two drawn figures) are checked by family only — their sizes
//       are viewBox units scaled by the page, not typography.
//   4 · THE COLOR ALLOWLIST. The site's tokens plus the print pens, exactly.
//       The book carried THREE faint grays within one bit of each other until
//       this pass; a color a hair off its token now fails by name. The red is
//       law: #be123c bit-exact, and anything NEAR red fails harder.
const MMPT = 72 / 25.4
// The foot rule sits ON the 12mm bottom-margin line; the text hangs below it
// in the margin, folio-fashion, baseline ~5mm above the trim (measured 14.0pt).
const FOOT_BASELINE_BAND = [12.5, 16] // pt above trim
const FOLIO_EDGE_MM = { odd: 12, even: 12 } // one frame, no parity (2026-08-19)
// Hyphen-tolerant: the embedded names arrive as "Martian-Mono-SemiExpanded",
// "SourceSerif4-Italic" or variable-instance names like "16pt-Italic",
// depending on which face and which resolution path served them.
const FAMILY_RE = /Archivo|Source[- ]?Serif|Martian[- ]?Mono|Caveat|^\d{1,2}pt\b/
// Family -> the pt sizes the book is allowed to set it at (±0.15pt). Archivo
// 20 is the index title, RULED at 20 (her F ruling, 2026-08-19, after seeing
// both: 20pt stays, the page got air between its two sections instead);
// Source Serif 7.6 is the index dek her G ruling wired.
const SIZE_ALLOW = [
  { key: /Archivo/, sizes: [8, 10, 20, 26, 38] },
  { key: /Martian[- ]?Mono/, sizes: [5.6, 6.2, 7.5] },
  { key: /Caveat/, sizes: [10.5] },
  // 20 = the about page's voice headline, sanctioned for exactly that one
  // line (her C pick at the about-page audit, 2026-08-19).
  // 14 joined 2026-08-20 (her ruling): the plate question's own rung —
  // the scale had nothing between the dek's 11.5 and the title-sized 20.
  { key: /./, sizes: [7.6, 9, 10, 11.5, 14, 20] }, // Source Serif 4 + its optical instances
]
const COLOR_ALLOW = new Set([
  '#16181d', '#565b63', '#8a919c', '#f5f6f7', // ink · muted · faint · ground
  '#ffffff', '#000000', // paper + Chrome's reset-to-black around image draws
  '#be123c', // the red: threads, the emblem's node, the dotted link marks
  '#0e7490', '#a8186b', '#7a5e00', // the print lens pens (cyan/magenta/yellow)
  '#c8ccd2', '#eceef0', // the drawn hairline grey + the tile ground
])
// RULED, TWICE (Emilie, 2026-08-19): the NeuroSpace drawn figure's
// app-sampled palette. Her first E1 vote asked for the pen grammar; shown
// that it reversed her own 2026-08-12 pick of the app-UI treatment ("maybe
// the design should look a bit more like the UI of the app"), she re-ruled:
// "keep the app colors." This set is the ONE sanctioned exception to the
// color law, and it is closed — do not re-propose recoloring the figure.
const HELD_APP_SAMPLE = new Set([
  '#2b2f36', '#b9c0c9', '#3b7fb0', '#d55109', '#6f66a9', '#379e59', '#66b768', '#c0392b',
])

async function assertHouseStyle(bytes, svgTextCounts) {
  const check = (cond, msg) => (cond ? console.log('  ✓ ' + msg) : fail('book PDF: ' + msg))
  const { numPages, pages } = await designCensus(bytes)

  // 1 · THE FOOT HEMLINE. Every page but the cover and the colophon carries a
  // folio; its baseline is the foot's baseline. One band, no jumps.
  const folios = []
  const folioless = []
  for (let p = 2; p <= numPages - 1; p++) {
    const want = String(p).padStart(2, '0')
    // Exact match only: the about page's contents rows print the same padded
    // numbers ("03", "05", ...) higher up, so the folio is the LOWEST match.
    const f = pages[p - 1].texts
      .filter(t => t.str.trim() === want || t.str.trim() === String(p))
      .sort((a, b) => a.y - b.y)[0]
    if (f) folios.push({ page: p, ...f })
    else folioless.push(p)
  }
  check(folioless.length === 0, `every page but the cover and colophon prints its folio${folioless.length ? ` (missing on ${folioless.join(', ')})` : ''}`)
  if (folios.length) {
    const ys = folios.map(f => f.y)
    const spread = Math.max(...ys) - Math.min(...ys)
    check(
      spread <= 1.2,
      `every foot sits on ONE baseline (spread ${spread.toFixed(2)}pt across pages ${folios[0].page}-${folios[folios.length - 1].page})`,
    )
    const off = folios.filter(f => f.y < FOOT_BASELINE_BAND[0] || f.y > FOOT_BASELINE_BAND[1])
    check(
      off.length === 0,
      `the foot baseline hangs in the 12mm bottom margin${off.length ? ` (off: ${off.map(f => `p${f.page}@${f.y.toFixed(1)}pt`).join(', ')})` : ''}`,
    )
    // The folio's OUTER edge mirrors with the binding: 12mm from the right
    // trim on odd pages, 18mm on even (the bound edge), each parity to 1.2pt.
    for (const [parity, mm] of Object.entries(FOLIO_EDGE_MM)) {
      const own = folios.filter(f => (f.page % 2 === 1) === (parity === 'odd'))
      if (!own.length) continue
      const edges = own.map(f => pages[f.page - 1].width - (f.x + f.w))
      const drift = Math.max(...edges) - Math.min(...edges)
      const target = mm * MMPT
      const worst = Math.max(...edges.map(e => Math.abs(e - target)))
      check(
        drift <= 1.2 && worst <= 2.5,
        `${parity}-page folios all sit ${mm}mm off the trim (drift ${drift.toFixed(2)}pt, worst |Δ| ${worst.toFixed(2)}pt)`,
      )
    }
  }

  // 1b · THE FOOT RULE. The baseline law alone let the two hairlines sit
  // 0.8mm apart across every spread (found by measuring, after the "all
  // green" run): the rule hangs from padding-top, the baseline from
  // padding-bottom, and only one of them was law. Both are now: every page's
  // foot rule on the same line — the 12mm bottom-margin line since the
  // uniform frame (2026-08-19; it was the 196mm line before).
  const ruleYs = []
  const ruleMisses = []
  for (let p = 2; p <= numPages - 1; p++) {
    const rules = pages[p - 1].footRules
    if (rules.length !== 1) ruleMisses.push(`p${p} (${rules.length} rules in the foot band)`)
    else ruleYs.push({ page: p, y: rules[0] })
  }
  const ruleSpread = ruleYs.length ? Math.max(...ruleYs.map(r => r.y)) - Math.min(...ruleYs.map(r => r.y)) : 0
  // AT the line, not merely on ONE line: a spread-only check would bless the
  // whole frame drifting together.
  const ruleWorst = ruleYs.length
    ? Math.max(...ruleYs.map(r => Math.abs(r.y - 12 * MMPT)))
    : 0
  check(
    ruleMisses.length === 0 && ruleSpread <= 1.2 && ruleWorst <= 1.5,
    `every foot rule sits on the 12mm bottom-margin line (spread ${ruleSpread.toFixed(2)}pt, worst |Δ| ${ruleWorst.toFixed(2)}pt)${ruleMisses.length ? ` (${ruleMisses.join('; ')})` : ''}`,
  )

  // 2 · THE MARGIN MIRROR, measured on the FOOT FRAME, not the text bbox.
  // The first run of this guard measured min/max over every text item and
  // tripped on two DELIBERATE things: the about title's 11mm optical inset
  // and the drawn figure's art text inside p8's bleeding lead. The frame the
  // law actually rules is the foot — its left slot starts at the page's left
  // margin and its folio ends at the right one, it exists on every page but
  // the cover and colophon, and it measured machine-still (0.0pt drift within
  // type) in the audit. A padding regression moves the foot with the body, so
  // nothing the old bbox caught is lost — only the false alarms are.
  // Law: the uniform 12mm frame, both sides, every page (2026-08-19).
  const MARGIN_MM = { odd: { left: 12, right: 12 }, even: { left: 12, right: 12 } }
  const marginMisses = []
  for (let p = 2; p <= numPages - 1; p++) {
    const pg = pages[p - 1]
    const band = pg.texts.filter(t => t.y >= FOOT_BASELINE_BAND[0] - 3 && t.y <= FOOT_BASELINE_BAND[1] + 3)
    if (!band.length) {
      marginMisses.push(`p${p} (no foot band to measure)`)
      continue
    }
    const left = Math.min(...band.map(t => t.x))
    const right = pg.width - Math.max(...band.map(t => t.x + t.w))
    const want = MARGIN_MM[p % 2 === 1 ? 'odd' : 'even']
    const dl = Math.abs(left - want.left * MMPT)
    const dr = Math.abs(right - want.right * MMPT)
    if (dl > 1.5 || dr > 1.5) {
      marginMisses.push(
        `p${p} (L ${(left / MMPT).toFixed(1)}mm vs ${want.left}, R ${(right / MMPT).toFixed(1)}mm vs ${want.right})`,
      )
    }
  }
  check(
    marginMisses.length === 0,
    `the foot frame holds the uniform 12mm margin on both sides of every page${marginMisses.length ? ` (${marginMisses.join('; ')})` : ''}`,
  )

  // 3 · THE FONT ALLOWLIST.
  const fontMisses = []
  for (let p = 1; p <= numPages; p++) {
    const artPage = (svgTextCounts[p - 1] ?? 0) > 0
    for (const t of pages[p - 1].texts) {
      if (!FAMILY_RE.test(t.font)) {
        fontMisses.push(`p${p}: "${t.font}" is not a book family (sets "${t.str.slice(0, 24)}")`)
        continue
      }
      if (artPage) continue // drawn artwork: sizes are scaled viewBox units
      const rule = SIZE_ALLOW.find(r => r.key.test(t.font))
      if (rule && !rule.sizes.some(s => Math.abs(s - t.size) <= 0.15)) {
        fontMisses.push(`p${p}: ${t.font} at ${t.size}pt is not an allowed size (sets "${t.str.slice(0, 24)}")`)
      }
    }
  }
  const uniqFontMisses = [...new Set(fontMisses)]
  check(
    uniqFontMisses.length === 0,
    `every face and size is on the allowlist${uniqFontMisses.length ? ` (${uniqFontMisses.slice(0, 6).join('; ')}${uniqFontMisses.length > 6 ? ` … +${uniqFontMisses.length - 6}` : ''})` : ''}`,
  )

  // 4 · THE COLOR ALLOWLIST + the red's purity.
  const colorMisses = []
  const nearRed = []
  for (let p = 1; p <= numPages; p++) {
    for (const c of pages[p - 1].colors) {
      if (c !== '#be123c' && channelDelta(c, '#be123c') <= 20) nearRed.push(`p${p}: ${c}`)
      if (COLOR_ALLOW.has(c) || HELD_APP_SAMPLE.has(c)) continue
      const near = [...COLOR_ALLOW].find(t => channelDelta(c, t) <= 12)
      colorMisses.push(`p${p}: ${c}${near ? ` (a hair off token ${near} — snap it)` : ''}`)
    }
  }
  const uniqColorMisses = [...new Set(colorMisses)]
  check(
    uniqColorMisses.length === 0,
    `every vector color is a token or a held exemption${uniqColorMisses.length ? ` (${uniqColorMisses.slice(0, 6).join('; ')}${uniqColorMisses.length > 6 ? ` … +${uniqColorMisses.length - 6}` : ''})` : ''}`,
  )
  check(
    nearRed.length === 0,
    `nothing prints NEAR the red — #be123c stays bit-exact and alone${nearRed.length ? ` (${[...new Set(nearRed)].join('; ')})` : ''}`,
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
  // The floor is THREE text lines per page, not merely "not empty" (the
  // guards audit, 2026-08-18): a page that lost its whole layout but kept a
  // folio still extracted one line and passed. The emptiest page the book
  // legitimately prints is the colophon (the caption line, the address row,
  // the copyright), which is exactly three; anything under that has lost a
  // block, not a word.
  const thin = text.pages.map((p, i) => (p.length < 3 ? i + 1 : null)).filter(Boolean)
  check(thin.length === 0, `every page carries at least 3 text lines${thin.length ? ` (thin: pages ${thin.join(', ')})` : ''}`)
  const all = text.pages.flat().join('\n')
  check(!all.includes('—'), 'zero em dashes')
}

// THE WEIGHT (2026-08-11, tightened at the guards audit 2026-08-18). This
// book is a LEAVE-BEHIND: it gets attached to an application, and the
// practical advice for a portfolio anyone actually emails is to stay under
// 5MB. The ceiling used to be 9MB "because mail servers drop at 10", which on
// a book that really weighs ~3.6MB was 2.5x of decorative slack: the tile
// regression that motivated the raster census could have doubled the file and
// still shipped. The ceiling is the emailability line itself now, and the
// target sits close enough over today's weight that drift is loud.
const PDF_HARD_MAX = 5 * 1024 * 1024
const PDF_TARGET = 4.5 * 1024 * 1024
function assertWeight(bytes, kind) {
  const mb = (bytes / 1024 / 1024).toFixed(1)
  // The thresholds are read from the constants, never restated: a message
  // that can disagree with the rule it is reporting is worse than no message.
  const max = PDF_HARD_MAX / 1024 / 1024
  const target = PDF_TARGET / 1024 / 1024
  if (bytes > PDF_HARD_MAX) {
    fail(`${kind} PDF is ${mb}MB, past the ${max}MB ceiling (the line above which a portfolio stops being emailable)`)
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
    // THE BIGGEST HOLE THE AUDIT FOUND: fonts.load() on an undeclared family
    // resolves EMPTY, fonts.ready resolves regardless, and the book would ship
    // in Times with every check green. check() is the assertion load() is not:
    // it answers whether the face is actually available to render with.
    const missingFaces = await page.evaluate(
      (faces) => faces.filter(f => !document.fonts.check(f)),
      FACES,
    )
    if (missingFaces.length) {
      fail(`${target.route}: font face(s) never became available: ${missingFaces.join(' | ')} (the page would print in a fallback face)`)
    }
    // A broken image used to surface as an opaque 60s timeout on the wait
    // below, naming nothing. On timeout the failure now lists the files.
    try {
      await page.waitForFunction(
        () => [...document.images].every(img => img.complete && img.naturalWidth > 0),
        { timeout: 60_000 },
      )
    } catch {
      const broken = await page.evaluate(() =>
        [...document.images]
          .filter(img => !img.complete || img.naturalWidth === 0)
          .map(img => img.currentSrc || img.src || '(no src)'),
      )
      fail(
        `${target.route}: image(s) never loaded: ${broken.join(', ') || '(none still broken; the wait timed out for another reason)'}`,
      )
    }
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
    // ⚠ Only the raw titles come out of the page here; the expectation is
    // assembled BELOW, after the selector is proven alive against the spread
    // count. Assembling it in-page let a rotted .pr-spread__title selector
    // return zero titles, and two arrays that were both wrong compared equal.
    const plateTitles = await page.evaluate(() =>
      [...document.querySelectorAll('.pr-page .pr-spread__title')].map(h => h.textContent.trim()),
    )
    const indexProjects = await page.evaluate(
      () => document.querySelectorAll('.pr-index__grid > *').length,
    )
    // The raster census baseline: how many photographs each page really
    // declares, so the PDF cannot carry more rasters than the DOM has images.
    const domImgCounts = await page.evaluate(() =>
      [...document.querySelectorAll('.pr-page')].map(p => p.querySelectorAll('img').length),
    )
    // The font law's artwork map: pages whose DOM draws <svg> text (the cover
    // art, the drawn figures) set type in viewBox units scaled by the page, so
    // those pages are held to the family law only, never the size law.
    const svgTextCounts = await page.evaluate(() =>
      [...document.querySelectorAll('.pr-page')].map(p => p.querySelectorAll('svg text').length),
    )
    // Every href the printed CV declares, so the link assertion compares the
    // bytes against the page rather than against a list in this file. Empty on
    // the book route, which never renders .pr-ats.
    const atsHrefs = await page.evaluate(() =>
      [...document.querySelectorAll('.pr-ats a[href]')].map(a => a.href),
    )
    // Each project page's own /work/ door, read off its printed foot, so the
    // per-plate link assertion knows WHICH id page i must reach.
    const footWorkHrefs = await page.evaluate(() =>
      [...document.querySelectorAll('.pr-page')].map(
        p =>
          p
            .querySelector('.pr-spread__foot a[href*="/work/"], .pr-assets__foot a[href*="/work/"]')
            ?.getAttribute('href') ?? null,
      ),
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
    if (target.kind === 'cv') {
      assertCv(text)
      await assertCvLinks(pdf, atsHrefs)
    } else {
      assertBook(text, domPages)
      // (domPages - 4) / 2 = the project count, read off the printed book
      // rather than imported, so this file never needs to know the contents.
      // ⚠ Every positional assertion below (pages[1] is the contents,
      // length - 2 is the index, 2..2+spreads*2 are the pairs) leans on that
      // structure, so the structure itself is asserted first: a book that no
      // longer decomposes as cover + about + facing pairs + index + colophon
      // fails HERE with one clear message instead of as a cascade of
      // misdirected page checks.
      if ((domPages - 4) % 2 !== 0 || domPages < 20) {
        fail(
          `book: ${domPages} pages does not decompose as cover + about + facing pairs + index + colophon; ` +
            'every per-page assertion assumes that structure, so they were skipped',
        )
      } else {
        const spreads = (domPages - 4) / 2
        // ⚠ THE OUTLINE EXPECTATION IS READ FROM THE BOOK'S OWN PAGES, not from
        // the `outline` array that wrote the bookmark tree. Passing that array to
        // both sides made the assertion compare pdf-lib's output with pdf-lib's
        // input, so deleting a page's data-outline removed the row from BOTH and
        // the check stayed green. The plate titles come from the rendered page
        // headings, which is a different route to the same truth.
        // ⚠ AND THE SCRAPE MUST BE ALIVE: with .pr-spread__title matching zero
        // elements the old expectation was ['Cover','About','Index','Contact'],
        // a plausible-looking array built from nothing. The selector has to
        // find exactly one title per spread before its output means anything.
        if (plateTitles.length !== spreads) {
          fail(
            `book: .pr-spread__title matched ${plateTitles.length} headings across ${spreads} spreads; ` +
              'the selector or the page markup rotted, so the outline expectation cannot be built',
          )
        } else {
          const expectedOutline = ['Cover', 'About', ...plateTitles, 'Index', 'Contact']
          await assertLinks(pdf, spreads, indexProjects, footWorkHrefs)
          await assertOutline(pdf, expectedOutline)
        }
        await assertVector(pdf, domPages, domImgCounts)
        await assertHouseStyle(pdf, svgTextCounts)
      }
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
