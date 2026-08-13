// G5 · THE PRINT-RESOLUTION RUNGS (REDESIGN-SPEC §10). The web ladder tops
// out at 1600w; the book needs its own. TWO rungs since THE BOOK REWORK
// (2026-08-11), because the book now has two kinds of image:
//
//   PLATE  · the dominant image on a project's page one. ~300dpi at the
//            145mm plate width, so 2400px with headroom. Eight of them.
//   GRID   · the images on the facing asset page. ~220dpi, which is
//            invisible on screen and on any office printer, and is what
//            makes 20 pages affordable: eight extra pages of images at full
//            print resolution would push the PDF past the 10MB ceiling where
//            corporate mail servers start silently dropping attachments.
//
// Each grid image is baked to THE WIDTH IT IS ACTUALLY DRAWN AT. bookAssets
// declares rows, a row justifies (widths divide in proportion to each
// image's aspect ratio), so the share of the page a given image occupies is
// computable here. That is the whole weight strategy: no image carries
// pixels the paper cannot use.
//
// MANUAL, like `npm run images`: the originals live in the git-ignored
// incoming/ staging, which CI never sees, so the output is COMMITTED. The
// set is BOUNDED by design: only what src/print/bookContents.ts declares is
// baked; anything else is pruned. Run `npm run print-assets` after changing
// the book, and commit both the JPEGs and the manifest.
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

// 1800px is ~315dpi at the 145mm plate width, comfortably past the 300
// standard. It was 2400 (420dpi), which was headroom for a hypothetical
// full-bleed plate that never arrived; at eight plates instead of six that
// headroom cost about a megabyte of a document she emails. The census test's
// 1700px floor still binds, so this cannot quietly slide further.
const PLATE_WIDTH = 1800
const QUALITY = 88
const GRID_QUALITY = 84
const INDEX_QUALITY = 78

// ⚠ THE PAGE GEOMETRY IS NOT COPIED HERE ANY MORE. It is imported from
// src/print/assetGeometry.ts, the same module the renderer and the census test
// use, because a wrong number in THIS file fails nothing: it silently bakes an
// image for a width it is not drawn at, and softness at A4 is invisible on a
// screen. See loadBook() below.
const GRID_DPI = 220
const PX_PER_MM = GRID_DPI / 25.4

// BOOK-ONLY PLATES. Two images deliberately left the web gallery but stayed
// the book's plate (each is noted at its slug in image-manifest.mjs). They
// have no manifest row to bake from, which is why `npm run print-assets`
// refused to write ANYTHING before 2026-08-11: one unresolvable asset aborts
// the whole run by design, and nobody had run it since the gallery changed.
// Declaring their originals here restores the bake and keeps the reason
// written down next to the exception.
const BOOK_ONLY = {
  'lungs/tower': 'academic/iaac/lungs/Lungs_Hero1.png',
  // The mirroring board: an 8001px process sheet the SITE has never shown, and
  // the only asset in the project that states its whole idea, an aircraft's
  // take-off line mirrored twice into a falcon. It joined the book on
  // 2026-08-14 as Falcon's page-two lead.
  'falcon/process-01-mirroring':
    'work/jemma-chidiac-office-work/round-about-chahine/final-assets/process-01-mirroring.png',
}

// The book's contents come from the same modules the book renders from
// (bundled the way generate-landing-fallback.mjs bundles the mind graph, so
// this script can never drift from the shipped book).
//
// It reads bookPlates.ts, NOT bookContents.ts: the latter joins the spine
// prose, which is reached through `import.meta.glob`, a Vite construct that
// does not exist in Node. The glob is still shimmed below because the project
// barrel declares one at module scope; it resolves to an empty map here and
// nothing in this script ever reads a spine.
async function loadBook() {
  const result = await build({
    stdin: {
      contents: [
        "export { BOOK_PLATES, INDEX_TILES } from './src/print/bookPlates.ts'",
        "export { registerRowHeight, leadDrawnWidth, PAGE_W_MM, BOUND_MARGIN_MM, OUTER_MARGIN_MM, GAP_MM } from './src/print/assetGeometry.ts'",
      ].join('\n'),
      resolveDir: SITE,
      loader: 'ts',
    },
    bundle: true,
    format: 'esm',
    platform: 'node',
    jsx: 'automatic',
    banner: { js: 'const __noGlob = () => ({});' },
    define: {
      'import.meta.env.DEV': 'false',
      'import.meta.env.BASE_URL': '"/"',
      'import.meta.glob': '__noGlob',
    },
    write: false,
    logLevel: 'silent',
  })
  const code = result.outputFiles[0].text
  const url = 'data:text/javascript;base64,' + Buffer.from(code).toString('base64')
  return import(url)
}

const { BOOK_PLATES, INDEX_TILES, registerRowHeight, leadDrawnWidth, PAGE_W_MM, BOUND_MARGIN_MM, OUTER_MARGIN_MM, GAP_MM } =
  await loadBook()

const problems = []

// THE DIMENSIONS AN ASSET WILL ACTUALLY HAVE once its crop and trim are applied.
// ⚠ Sizing a register from the ORIGINAL aspect is wrong the moment an asset is
// cropped: cropping the baked headings off A Ballooning Market's sheets takes
// one from 2.07 to 4.4, and a justified row hands out width by aspect, so the
// bake asked for 90mm while the page drew 150. Measured here as arithmetic
// rather than by cropping twice.
function effectiveSize(meta, job) {
  const c = job.crop ?? {}
  let w = meta.width * (1 - (c.left ?? 0) - (c.right ?? 0))
  let h = meta.height * (1 - (c.top ?? 0) - (c.bottom ?? 0))
  if (job.trim > 0) {
    const inset = Math.min(w, h) * job.trim
    w -= inset * 2
    h -= inset * 2
  }
  return { width: Math.round(w), height: Math.round(h) }
}

// Resolve one declared asset to an original on disk, or record why not.
function resolve({ slug, name, invert, trim, figure, crop }) {
  // A FIGURE IS DRAWN, NOT BAKED. It has no original on disk, so resolving it
  // as one would report a missing file and abort the whole run.
  if (figure) return null
  const bookOnly = BOOK_ONLY[`${slug}/${name}`]
  const rel = bookOnly ?? (MANIFEST[slug] ?? []).find(i => i.name === name)?.src
  if (!rel) {
    problems.push(`${slug}/${name}: not in image-manifest.mjs and not declared in BOOK_ONLY, no original to bake from`)
    return null
  }
  const src = join(INCOMING, rel)
  if (!existsSync(src)) {
    problems.push(`${slug}/${name}: original missing at ${src} (OneDrive dehydrated? incoming/ not synced?)`)
    return null
  }
  return { slug, name, src, invert: invert === true, trim: typeof trim === 'number' ? trim : 0, crop: crop ?? null }
}

// PASS 1 · resolve everything BEFORE writing anything, so a missing original
// can never leave the committed set half-rebaked.
const jobs = []
for (const master of BOOK_PLATES) {
  const plates = master.spreadAssets
  if (plates.length === 0) {
    problems.push(`${master.slug}: no spreadAssets declared (the plate would fall back to the soft web rung)`)
  }
  for (const ref of plates) {
    const hit = resolve(ref)
    if (hit) jobs.push({ ...hit, kind: 'plate', width: PLATE_WIDTH })
  }

  // PAGE TWO, as a LEAD and a REGISTER (2026-08-12). The register is one
  // justified row: each image's width is its share, and the shares divide in
  // proportion to the aspect ratios. The lead is promoted and much larger, so
  // it is sized separately against the same arithmetic the renderer uses.
  // Originals are read first so every share comes from real geometry rather
  // than from a guess.
  const register = master.bookRegister
  if (register.length === 0) {
    problems.push(`${master.slug}: no bookRegister declared (its facing asset page would be empty)`)
  }
  // ⚠ A FIGURE IN THE REGISTER RESOLVES TO NULL BY DESIGN, because it is drawn
  // rather than baked. It has to come OUT before the null check below, or one
  // drawn asset silently skips the sizing of every photograph beside it.
  const bakeable = register.filter(a => !a.figure)
  const resolved = bakeable.map(resolve)
  if (!resolved.some(r => r === null)) {
    const rawMetas = await Promise.all(resolved.map(r => sharp(r.src).metadata()))
    const metas = rawMetas.map((m, i) => effectiveSize(m, resolved[i]))
    const aspects = metas.map(m => m.width / m.height)
    const rowH = registerRowHeight(aspects, master.bookRegisterScale ?? 1)
    resolved.forEach((r, i) => {
      const drawnMm = aspects[i] * rowH
      jobs.push({ ...r, kind: 'grid', width: Math.ceil(drawnMm * PX_PER_MM), drawnMm })
    })
    // The lead is 159 to 210mm wide, far wider than any register image, which
    // is why it cannot share the register's rung. Its drawn width comes from
    // the SAME function the renderer calls, so the two cannot diverge.
    const lead = master.bookLead
    const leadHit = lead ? resolve(lead) : null
    if (leadHit) {
      const lm = effectiveSize(await sharp(leadHit.src).metadata(), leadHit)
      const drawnMm = leadDrawnWidth(lead.corner, lm.width / lm.height, rowH)
      jobs.push({ ...leadHit, kind: 'grid', width: Math.ceil(drawnMm * PX_PER_MM), drawnMm })
    }

    // A COLUMN ASSET stands under the head at the head's own width, which is
    // whatever the lead does not use. Sized here rather than assumed, so the
    // bake matches the width the page actually draws it at.
    const col = master.bookColumn
    const colHit = col ? resolve(col) : null
    if (colHit && leadHit) {
      const lm = effectiveSize(await sharp(leadHit.src).metadata(), leadHit)
      const leadMm = leadDrawnWidth(lead.corner, lm.width / lm.height, rowH)
      const colMm = PAGE_W_MM - BOUND_MARGIN_MM - OUTER_MARGIN_MM - leadMm - GAP_MM * 2
      jobs.push({ ...colHit, kind: 'grid', width: Math.ceil(colMm * PX_PER_MM), drawnMm: colMm })
    }
  }
}

// The index page's 21 tiles, printed ~36mm wide. 480px is ~339dpi there.
const INDEX_TILE_W = 480
for (const ref of INDEX_TILES) {
  const hit = resolve(ref)
  if (hit) jobs.push({ ...hit, kind: 'index', width: INDEX_TILE_W })
}

if (problems.length) {
  console.error('PRINT ASSETS INCOMPLETE (nothing written):')
  for (const p of problems) console.error('  - ' + p)
  process.exitCode = 1
} else {
  // PASS 2 · bake. A plate and a grid image can be the same asset in
  // principle, so the output name carries the rung.
  const manifest = {}
  let totalBytes = 0
  for (const job of jobs) {
    const { slug, name, src, kind, width } = job
    const outDir = join(OUT, slug)
    mkdirSync(outDir, { recursive: true })
    const suffix = { plate: 'print', grid: 'grid', index: 'tile' }[kind]
    const fileName = `${name}-${suffix}.jpg`
    // INVERT, in three operations, and each one is load-bearing:
    //
    //   flatten on BLACK · the sources are white strokes on a TRANSPARENT
    //     background, not on black. Without this, negate lightens a field that
    //     is still transparent and the JPEG encoder then composites it back
    //     onto black, which is how the first attempt silently produced exactly
    //     the black rectangles it was meant to remove. It looked right in a
    //     PNG test only because PNG kept the alpha and the viewer happened to
    //     composite it on white.
    //   negate · white strokes on black become dark strokes on white.
    //   hue 180 · a straight negative takes a red annotation to cyan; this
    //     puts her red back where the pen put it.
    // TRIM BEFORE RESIZE, so the fraction is measured against the original and
    // the crop is exact rather than resampled twice.
    let pipe = sharp(src)
    // PER-EDGE CROP, for assets that carry their own baked headings and labels.
    // Applied before the symmetric trim and before the resize, so the fractions
    // are measured against the original.
    if (job.crop) {
      const meta = await sharp(src).metadata()
      const t = Math.round((job.crop.top ?? 0) * meta.height)
      const bm = Math.round((job.crop.bottom ?? 0) * meta.height)
      const l = Math.round((job.crop.left ?? 0) * meta.width)
      const r = Math.round((job.crop.right ?? 0) * meta.width)
      pipe = pipe.extract({
        left: l,
        top: t,
        width: meta.width - l - r,
        height: meta.height - t - bm,
      })
      pipe = sharp(await pipe.toBuffer())
    }
    if (job.trim > 0) {
      const meta = await sharp(src).metadata()
      const inset = Math.round(Math.min(meta.width, meta.height) * job.trim)
      pipe = pipe.extract({
        left: inset,
        top: inset,
        width: meta.width - inset * 2,
        height: meta.height - inset * 2,
      })
    }
    pipe = pipe.resize(width, null, { withoutEnlargement: true })
    if (job.invert) {
      pipe = pipe.flatten({ background: '#000000' }).negate({ alpha: false }).modulate({ hue: 180 })
    }
    const r = await pipe
      .jpeg({
        quality: { plate: QUALITY, grid: GRID_QUALITY, index: INDEX_QUALITY }[kind],
        progressive: true,
        mozjpeg: true,
      })
      .toFile(join(outDir, fileName))
    totalBytes += r.size
    const bucket = (manifest[{ plate: 'plates', grid: 'grid', index: 'index' }[kind]] ??= {})
    ;(bucket[slug] ??= {})[name] = {
      file: `assets/print/${slug}/${fileName}`,
      w: r.width,
      h: r.height,
    }
    if (kind === 'plate') {
      const dpi = Math.round(r.width / (145 / 25.4))
      console.log(`PLATE ${slug}/${name} -> ${r.width}w ${Math.round(r.size / 1024)}KB (~${dpi}dpi at the plate width)`)
      if (r.width < 1700) {
        console.warn(`  ! ${slug}/${name} original is only ${r.width}px wide; below ~300dpi at the plate width`)
      }
    } else if (kind === 'index') {
      console.log(`tile  ${slug}/${name} -> ${r.width}w ${Math.round(r.size / 1024)}KB`)
    } else {
      const dpi = Math.round(r.width / (job.drawnMm / 25.4))
      console.log(
        `grid  ${slug}/${name} -> ${r.width}w ${Math.round(r.size / 1024)}KB ` +
          `(drawn ${job.drawnMm.toFixed(0)}mm, ~${dpi}dpi)`,
      )
      if (dpi < 150) {
        console.warn(`  ! ${slug}/${name} lands at ~${dpi}dpi; the original is too small for the width it is drawn at`)
      }
    }
  }

  // PASS 3 · prune: an asset removed from the book takes its baked rung with
  // it (the set stays BOUNDED by what the book declares).
  const wanted = new Set(
    Object.values(manifest).flatMap(byslug =>
      Object.values(byslug).flatMap(byName => Object.values(byName).map(v => v.file)),
    ),
  )
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
  console.log(
    `\nTOTAL ${Math.round(totalBytes / 1024)}KB across ${jobs.length} baked images ` +
      `-> commit public/assets/print/ + src/data/print-images.json`,
  )
}
