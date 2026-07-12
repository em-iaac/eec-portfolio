// G5 · THE PRINT-RESOLUTION RUNG (REDESIGN-SPEC §10). The web ladder tops
// out at 1600w; an A4 book plate wants ~300dpi, so the ~6 curated spreads
// get ONE committed print rung each: public/assets/print/<slug>/<name>-print.jpg
// + the src/data/print-images.json manifest (printImage.ts prefers it, the
// book census test (printBook.test.tsx) requires it for every book slug).
//
// MANUAL, like `npm run images`: the originals live in the git-ignored
// incoming/ staging, which CI never sees, so the output is COMMITTED. The
// set is BOUNDED by design: only what src/print/bookContents.ts declares
// (via each master's spreadAssets) is baked; nothing else ever grows here.
// Run `npm run print-assets` after changing a spread's asset, commit both
// the JPEGs and the manifest.
import sharp from 'sharp'
import { build } from 'esbuild'
import { mkdirSync, writeFileSync, existsSync, readdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MANIFEST } from './image-manifest.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const SITE = join(here, '..')
const INCOMING = join(SITE, '..', 'incoming')
const OUT = join(SITE, 'public', 'assets', 'print')
const DATA = join(SITE, 'src', 'data')

// ~300dpi for the plate's printed width (145mm needs ~1700px; 2400 leaves
// headroom for a future full-bleed plate without re-baking).
const PRINT_WIDTH = 2400
const QUALITY = 88

// The book's contents come from the same module the book renders from
// (bundled the way generate-landing-fallback.mjs bundles the mind graph, so
// this script can never drift from the shipped book).
async function loadBook() {
  const result = await build({
    stdin: {
      contents: "export { BOOK_SPREADS } from './src/print/bookContents.ts'",
      resolveDir: SITE,
      loader: 'ts',
    },
    bundle: true,
    format: 'esm',
    platform: 'node',
    jsx: 'automatic',
    define: {
      'import.meta.env.DEV': 'false',
      'import.meta.env.BASE_URL': '"/"',
    },
    write: false,
    logLevel: 'silent',
  })
  const code = result.outputFiles[0].text
  const url = 'data:text/javascript;base64,' + Buffer.from(code).toString('base64')
  return import(url)
}

const { BOOK_SPREADS } = await loadBook()

// PASS 1 · resolve everything BEFORE writing anything, so a missing
// original can never leave the committed set half-rebaked.
const jobs = []
const problems = []
for (const { master } of BOOK_SPREADS) {
  const assets = master.spreadAssets ?? []
  if (assets.length === 0) {
    problems.push(`${master.slug}: no spreadAssets declared (the spread would fall back to the soft web rung)`)
    continue
  }
  for (const { slug, name } of assets) {
    const item = (MANIFEST[slug] ?? []).find(i => i.name === name)
    if (!item) {
      problems.push(`${slug}/${name}: not in image-manifest.mjs, no original to bake from`)
      continue
    }
    const src = join(INCOMING, item.src)
    if (!existsSync(src)) {
      problems.push(`${slug}/${name}: original missing at ${src} (OneDrive dehydrated? incoming/ not synced?)`)
      continue
    }
    jobs.push({ slug, name, src })
  }
}

if (problems.length) {
  console.error('PRINT ASSETS INCOMPLETE (nothing written):')
  for (const p of problems) console.error('  - ' + p)
  process.exitCode = 1
} else {
  // PASS 2 · bake.
  const manifest = {}
  let totalBytes = 0
  for (const { slug, name, src } of jobs) {
    const outDir = join(OUT, slug)
    mkdirSync(outDir, { recursive: true })
    const fileName = `${name}-print.jpg`
    const r = await sharp(src)
      .resize(PRINT_WIDTH, null, { withoutEnlargement: true })
      .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
      .toFile(join(outDir, fileName))
    totalBytes += r.size
    ;(manifest[slug] ??= {})[name] = { file: `assets/print/${slug}/${fileName}`, w: r.width }
    const dpiAt145mm = Math.round(r.width / (145 / 25.4))
    console.log(`${slug}/${name} -> ${r.width}w ${Math.round(r.size / 1024)}KB (~${dpiAt145mm}dpi at the plate width)`)
    if (r.width < 1700) {
      console.warn(`  ! ${slug}/${name} original is only ${r.width}px wide; below ~300dpi at the plate width`)
    }
  }

  // PASS 3 · prune: a slug or asset removed from the book takes its baked
  // rung with it (the set stays BOUNDED by what the manifest names).
  const wanted = new Set(Object.values(manifest).flatMap(byName => Object.values(byName).map(v => v.file)))
  if (existsSync(OUT)) {
    for (const entry of readdirSync(OUT, { withFileTypes: true, recursive: true })) {
      if (!entry.isFile()) continue
      const abs = join(entry.parentPath ?? entry.path, entry.name)
      const rel = 'assets/print/' + abs.slice(OUT.length + 1).replaceAll('\\', '/')
      if (!wanted.has(rel)) {
        rmSync(abs)
        console.log(`pruned ${rel} (no longer in the book)`)
      }
    }
  }

  mkdirSync(DATA, { recursive: true })
  writeFileSync(join(DATA, 'print-images.json'), JSON.stringify(manifest, null, 2) + '\n')
  console.log(`\nTOTAL ${Math.round(totalBytes / 1024)}KB across ${Object.values(manifest).flatMap(Object.keys).length} print plates -> commit public/assets/print/ + src/data/print-images.json`)
}
