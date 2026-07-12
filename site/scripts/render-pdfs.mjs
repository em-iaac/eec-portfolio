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

  // Single column ⇒ the sections extract in reading order.
  const order = ['EDUCATION', 'EXPERIENCE', 'AWARDS & RECOGNITION', 'SKILLS', 'CERTIFICATES']
  const idx = order.map(h => lines.findIndex(l => l === h))
  check(
    idx.every(i => i >= 0) && idx.every((v, i) => i === 0 || v > idx[i - 1]),
    'sections extract in single-column reading order (EDUCATION → CERTIFICATES)',
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

function assertBook(text, domPages) {
  const check = (cond, msg) => (cond ? console.log('  ✓ ' + msg) : fail('book PDF: ' + msg))
  check(
    text.numPages === domPages,
    `PDF page count matches the rendered document (${text.numPages} vs ${domPages} pages)`,
  )
  check(domPages >= 9, `a whole book (${domPages} pages: cover + spreads + index + record + colophon)`)
  const empty = text.pages.map((p, i) => (p.length === 0 ? i + 1 : null)).filter(Boolean)
  // The cover page is allowed to be text-light but never empty (name +
  // rail); any empty page means a layout overflowed or vanished.
  check(empty.length === 0, `no empty pages${empty.length ? ` (pages ${empty.join(', ')})` : ''}`)
  const all = text.pages.flat().join('\n')
  check(!all.includes('—'), 'zero em dashes')
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

    const pdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      timeout: 60_000,
    })
    await page.close()

    // VERIFY BEFORE PUBLISHING: the committed public/ copy is only replaced
    // by a PDF that passed its own checks (a failing build must never
    // overwrite the known-good artifact the dev server serves). The dist/
    // copy always lands: a failed build never deploys anyway.
    const before = failures.length
    const text = await pdfText(pdf)
    if (target.kind === 'cv') assertCv(text)
    else assertBook(text, domPages)
    const ok = failures.length === before && overflowing.length === 0

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
