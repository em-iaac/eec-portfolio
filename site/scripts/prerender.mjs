// S3 · THE PER-ROUTE PRERENDER (CONTENT-STRATEGY.md D6; REDESIGN-SPEC R9 +
// section 11). Runs AFTER `vite build`, BEFORE render-pdfs.mjs in the build
// chain. Serves the built dist/ (same vite-preview + puppeteer pattern as
// the PDFs) and:
//
//   1. screenshots ONE 1200x630 share card per project / thought / the
//      pillar from /print/og/:cardKey into dist/og/<key>.png;
//   2. snapshots EVERY public route (src/lib/routes.ts, esbuild-loaded so
//      the registry stays the single source) to a real static .html file
//      with the per-route title / description / canonical / OG / JSON-LD
//      baked in. The snapshot is taken only after lib/routeHead.ts stamps
//      data-eec-head for the route, so the HTML crawlers read is BY
//      CONSTRUCTION the same head the SPA maintains: one source, no drift.
//      Files are FLAT (/work/sensi -> work/sensi.html): GitHub Pages serves
//      the extensionless URL with a 200 and no trailing-slash redirect, so
//      the canonical URL is exactly what gets served;
//   3. writes sitemap.xml at the address robots.txt already references;
//   4. snapshots the warm 404 into 404.html, so an unknown address returns
//      a REAL http 404 with the signed page (the old copy-of-index.html
//      soft-404 retired with this script);
//   5. writes a meta-refresh stub for every retired-but-citable address
//      (/notebook, /explore/*, /sheets/*), canonical pointing at the target;
//   6. VALIDATES all of it (the D6 economy clause): every route emitted,
//      titles + descriptions unique, canonical self-referencing, JSON-LD
//      parses with the Person node, the OG file each route names exists,
//      real body content, no em dashes. Any failure fails the build.
import puppeteer from 'puppeteer'
import { preview } from 'vite'
import { build } from 'esbuild'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const SITE = join(here, '..')
const DIST = join(SITE, 'dist')

const failures = []
const fail = (msg) => {
  failures.push(msg)
  console.error('  ✗ ' + msg)
}
const ok = (msg) => console.log('  ✓ ' + msg)

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('prerender: no dist/index.html; run `vite build` first (this script is part of `npm run build`).')
  process.exit(1)
}

// ---- the route manifest (single source: src/lib/routes.ts) -----------------
// Same esbuild trick as generate-landing-fallback.mjs: bundle the DOM-free
// manifest module and import it under Node, so the script can never hold a
// second route list.
async function loadRoutes() {
  const result = await build({
    stdin: {
      contents:
        "export { PUBLIC_ROUTES, LEGACY_REDIRECTS, PROJECT_IDS, THOUGHT_IDS, SITE_ORIGIN } from './src/lib/routes.ts'",
      resolveDir: SITE,
      loader: 'ts',
    },
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    logLevel: 'silent',
  })
  const code = result.outputFiles[0].text
  const url = 'data:text/javascript;base64,' + Buffer.from(code).toString('base64')
  return import(url)
}

const { PUBLIC_ROUTES, LEGACY_REDIRECTS, PROJECT_IDS, THOUGHT_IDS, SITE_ORIGIN } =
  await loadRoutes()

// One generated share card per project / thought + the pillar (headData's
// ogCardKey convention; the per-route og:image -> file assertion below
// catches any drift between the two).
const OG_KEYS = [
  ...PROJECT_IDS.map((id) => `work-${id}`),
  ...THOUGHT_IDS.map((id) => `thought-${id}`),
  'pillar',
  'home',
]

// Every face a card or page sets (fonts.css); loading is idempotent.
const FACES = [
  '600 16px Archivo',
  '400 16px Archivo',
  '400 16px "Source Serif 4"',
  'italic 400 16px "Source Serif 4"',
  '400 12px "Martian Mono"',
  '400 16px Caveat',
]

// ---- tiny extractors (our own baked head, controlled markup) ---------------
const getTitle = (html) => html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
const getMeta = (html, attr, key) => {
  // routeHead writes attribute-first tags; the index.html template may hold
  // multi-line tags, so match both orders inside one element.
  const re = new RegExp(`<meta[^>]*${attr}="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`, 'i')
  const tag = html.match(re)?.[0]
  return tag?.match(/content="([^"]*)"/)?.[1]
}
const getCanonical = (html) =>
  html.match(/<link[^>]*rel="canonical"[^>]*>/i)?.[0]?.match(/href="([^"]*)"/)?.[1]
const getJsonLd = (html) => {
  const m = html.match(/<script[^>]*id="eec-schema"[^>]*>([\s\S]*?)<\/script>/)
  if (!m) return null
  try {
    return JSON.parse(m[1])
  } catch {
    return null
  }
}

const routeToFile = (route) => (route === '/' ? 'index.html' : route.slice(1) + '.html')

// THE CONTENT FLOOR (the phone pass, 2026-08-02). The old body assertion was
// `<div id="root"></div>`, which only ever caught a LITERALLY empty root. When
// the Suspense hold got snapshotted instead, the root held one empty div, the
// check passed, and six routes shipped a 29-word shell (the noscript line and
// nothing else) to crawlers. This counts the words a crawler actually reads in
// the built FILE, which is the thing that ships, and is exactly the measurement
// that found the bug. The floor sits between the two populations with room on
// both sides: the broken shell was 29 words, the thinnest GENUINE page is
// /contact at 107 (it is a form, it is meant to be short) and everything else
// is 160+. 60 is double the shell and leaves /contact 47 words of headroom, so
// editing the contact copy can never fail the build by accident.
const MIN_BODY_WORDS = 60
function visibleWords(html) {
  const body = html.slice(html.indexOf('<body'))
  return body
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .split(/\s+/)
    .filter(Boolean).length
}

// ---- serve + drive ----------------------------------------------------------
const server = await preview({
  root: SITE,
  preview: { port: 4174, strictPort: false, open: false },
})
const port = server.httpServer.address().port
const origin = `http://localhost:${port}`
console.log(`prerender: dist served at ${origin}`)

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
})

async function preparedPage(width, height) {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  // THE PRERENDER FLAG (Emilie's ruling 2026-08-02). A component may opt its
  // purely DECORATIVE markup out of the snapshot when that markup is large and
  // a crawler cannot read it anyway. The only consumer today is the neural
  // world's SVG, which took /thoughts to 118.5KB gzipped for a drawing the SPA
  // immediately rebuilt (NeuralWorld.tsx has the full why). The readable
  // content must never opt out: WorldSrNav still carries every node.
  // evaluateOnNewDocument runs before any page script, so the flag is set by
  // first render, and it exists ONLY in this headless build browser.
  await page.evaluateOnNewDocument(() => {
    window.__EEC_PRERENDER__ = true
  })
  // Honest reduced-motion states are complete states (a FLOORS rule), so
  // prerendering under them bakes finished layouts, never a mid-animation
  // frame. Visitors with motion get the ceremonies live from the SPA boot.
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  return page
}

async function settleFonts(page) {
  await page.evaluate(
    (faces) => Promise.all(faces.map((f) => document.fonts.load(f))).then(() => document.fonts.ready),
    FACES,
  )
}

try {
  // ---- 1 · the share cards -------------------------------------------------
  console.log(`\nshare cards (${OG_KEYS.length})`)
  mkdirSync(join(DIST, 'og'), { recursive: true })
  {
    const page = await preparedPage(1200, 630)
    for (const key of OG_KEYS) {
      await page.goto(`${origin}/print/og/${key}`, { waitUntil: 'domcontentloaded', timeout: 60_000 })
      await page.waitForSelector('[data-print-ready]', { timeout: 30_000 })
      await settleFonts(page)
      const png = await page.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 630 } })
      writeFileSync(join(DIST, 'og', `${key}.png`), png)
    }
    await page.close()
    ok(`${OG_KEYS.length} cards -> dist/og/`)
  }

  // ---- 2 · the route snapshots ----------------------------------------------
  console.log(`\nroutes (${PUBLIC_ROUTES.length})`)
  const seenTitles = new Map()
  const seenDescriptions = new Map()
  const page = await preparedPage(1280, 900)

  async function snapshot(route) {
    await page.goto(origin + route, { waitUntil: 'domcontentloaded', timeout: 60_000 })
    // The head contract: routeHead stamps the pathname once the FINAL head
    // (including the lazily resolved description) is applied.
    await page.waitForFunction(
      (r) => document.documentElement.dataset.eecHead === r,
      { timeout: 30_000 },
      route,
    )
    // The body contract: no route ships its Suspense hold; the showcase
    // dialog and the note article must be mounted where they are the page.
    // THE ATTRIBUTE IS THE CONTRACT (the phone pass, 2026-08-02). This used to
    // read `div[aria-hidden="true"].bg-mylar`. That class was renamed in
    // App.tsx and the selector was never followed, so it matched nothing, the
    // wait resolved instantly, and every route WITHOUT a second wait below
    // snapshotted its loading state. Six of them shipped 29 words to crawlers
    // for weeks. Wait on data-route-hold, which exists only to be waited on.
    await page.waitForFunction(() => !document.querySelector('[data-route-hold]'), {
      timeout: 30_000,
    })
    if (/^\/work\/[^/]+$/.test(route)) {
      // AND its prose. The showcase spine became a lazy per-project chunk on
      // 2026-08-03 (the phone pass), so `dialog[open]` alone would now snapshot
      // the plate WITHOUT what/why/how/outcome: about 80 words instead of 300,
      // which is the same class of silent regression the empty-body bug was.
      // WorkOverlay stamps data-spine-ready once the chunk has landed.
      await page.waitForSelector('dialog[open][data-spine-ready]', { timeout: 30_000 })
    }
    if (/^\/thoughts\/[^/]+$/.test(route)) {
      await page.waitForSelector('article', { timeout: 30_000 })
    }
    await settleFonts(page)
    // Two frames of settle so layout effects (dialog open, view-transition
    // names) land before capture.
    await page.evaluate(
      () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
    )
    return page.evaluate(() => {
      // The stamp is a runtime handshake, not content; the booted SPA
      // re-stamps it on its own.
      document.documentElement.removeAttribute('data-eec-head')
      return '<!doctype html>\n' + document.documentElement.outerHTML
    })
  }

  function validate(route, html) {
    const before = failures.length
    const title = getTitle(html)
    const description = getMeta(html, 'name', 'description') ?? ''
    const canonical = getCanonical(html)
    const expected = SITE_ORIGIN + (route === '/' ? '/' : route)

    if (!title) fail(`${route}: empty <title>`)
    if (!description) fail(`${route}: no meta description`)
    const tkey = title.toLowerCase()
    if (seenTitles.has(tkey)) fail(`${route}: duplicate title with ${seenTitles.get(tkey)} ("${title}")`)
    seenTitles.set(tkey, route)
    if (seenDescriptions.has(description)) fail(`${route}: duplicate description with ${seenDescriptions.get(description)}`)
    seenDescriptions.set(description, route)
    if (canonical !== expected) fail(`${route}: canonical "${canonical}" != "${expected}"`)
    if (getMeta(html, 'property', 'og:url') !== expected) fail(`${route}: og:url != canonical`)
    if (title.includes('—') || description.includes('—')) fail(`${route}: em dash in the head`)

    const ogImage = getMeta(html, 'property', 'og:image') ?? ''
    if (!ogImage.startsWith(SITE_ORIGIN + '/')) {
      fail(`${route}: og:image is not absolute on the site origin (${ogImage})`)
    } else {
      const rel = ogImage.slice(SITE_ORIGIN.length + 1)
      if (!existsSync(join(DIST, ...rel.split('/')))) fail(`${route}: og:image file missing in dist (${rel})`)
    }
    if (!getMeta(html, 'property', 'og:image:alt')) fail(`${route}: no og:image:alt`)

    // The D6 economy clause: every public route emits its schema.
    const jsonLd = getJsonLd(html)
    if (!jsonLd) {
      fail(`${route}: JSON-LD missing or unparseable`)
    } else {
      const graph = jsonLd['@graph'] ?? []
      const person = graph.find((n) => n['@type'] === 'Person')
      if (!person) fail(`${route}: no Person node in the entity graph`)
      else if (!(person.sameAs?.length >= 3)) fail(`${route}: Person.sameAs incomplete`)
      if (graph.length < 3) fail(`${route}: entity graph has no route node (${graph.length} nodes)`)
    }

    const words = visibleWords(html)
    if (/<div id="root">\s*<\/div>/.test(html)) fail(`${route}: empty #root (the SPA shell, not real content)`)
    if (words < MIN_BODY_WORDS) {
      fail(
        `${route}: only ${words} visible words in the body (floor ${MIN_BODY_WORDS}). ` +
          `The snapshot caught a loading state, not the page.`,
      )
    }
    if (failures.length === before) ok(`${route} -> ${routeToFile(route)}  ·  ${words}w  ·  "${title}"`)
  }

  for (const route of PUBLIC_ROUTES) {
    const html = await snapshot(route)
    const file = join(DIST, ...routeToFile(route).split('/'))
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, html)
    validate(route, html)
  }

  // ---- 3 · sitemap.xml -------------------------------------------------------
  const urlset = PUBLIC_ROUTES.map(
    (r) => `  <url><loc>${SITE_ORIGIN + (r === '/' ? '/' : r)}</loc></url>`,
  ).join('\n')
  writeFileSync(
    join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`,
  )
  ok(`sitemap.xml: ${PUBLIC_ROUTES.length} routes`)

  // ---- 4 · the real 404 ------------------------------------------------------
  {
    const html = await snapshot('/this-address-is-not-a-page')
    const noindex = getMeta(html, 'name', 'robots') === 'noindex'
    const signed = html.includes('this thought wandered off')
    const noCanonical = !getCanonical(html)
    if (!noindex) fail('404.html: missing robots noindex')
    if (!signed) fail('404.html: the signed 404 line is not in the snapshot')
    if (!noCanonical) fail('404.html: must not carry a canonical link')
    writeFileSync(join(DIST, '404.html'), html)
    if (noindex && signed && noCanonical) ok('404.html: the signed page, noindex, no canonical (GH Pages serves it with a real 404 status)')
  }

  await page.close()

  // ---- 5 · redirect stubs ----------------------------------------------------
  for (const { from, to } of LEGACY_REDIRECTS) {
    const target = SITE_ORIGIN + (to === '/' ? '/' : to)
    const file = join(DIST, ...(from.slice(1) + '.html').split('/'))
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(
      file,
      `<!doctype html>\n<html lang="en"><head><meta charset="utf-8">` +
        `<title>Emilie El Chidiac</title>` +
        `<meta name="robots" content="noindex">` +
        `<meta http-equiv="refresh" content="0;url=${target}">` +
        `<link rel="canonical" href="${target}">` +
        `</head><body><p><a href="${target}">This address moved: ${target}</a></p></body></html>\n`,
    )
  }
  ok(`${LEGACY_REDIRECTS.length} retired addresses -> meta-refresh stubs (canonical at the target)`)
} finally {
  await browser.close()
  await server.close()
}

if (failures.length) {
  console.error(`\nprerender: ${failures.length} check(s) failed; the build must not ship.`)
  process.exitCode = 1
} else {
  console.log(`\nprerender: ${PUBLIC_ROUTES.length} routes + ${OG_KEYS.length} cards + sitemap + 404 + stubs, all verified.`)
}
