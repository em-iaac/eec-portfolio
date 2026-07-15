// incoming/<slug>/... (git-ignored staging) -> public/assets/projects/<slug>/
// Responsive webp ladder per role + animated webp for gifs, PLUS a static
// first-frame ladder for every animated image (reduced-motion rendering).
// Emits src/data/images.json for srcset building in components.
// Optional slug args (`npm run images -- cappelletti`) process only those
// slugs and MERGE into the existing manifest; no args = full regeneration.
import sharp from 'sharp'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MANIFEST, SIZES } from './image-manifest.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const INCOMING = join(here, '..', '..', 'incoming')
const OUT = join(here, '..', 'public', 'assets', 'projects')
const DATA = join(here, '..', 'src', 'data')

const only = process.argv.slice(2)
const existing = JSON.parse(readFileSync(join(DATA, 'images.json'), 'utf8'))
const results = only.length ? existing : {}
let totalBytes = 0

// Slugs whose ORIGINAL sources left the repo (the old-site /images folder was
// removed in the 2026-07-12 hygiene cleanup): their baked webps + manifest
// entries carry forward untouched on every run. Re-cutting them means
// restaging sources into incoming/ and removing the slug from this set.
const FROZEN = new Set(['professional'])

for (const [slug, items] of Object.entries(MANIFEST)) {
  if (only.length && !only.includes(slug)) continue
  if (FROZEN.has(slug)) {
    if (!existing[slug]) throw new Error(`frozen slug ${slug} has no entries in images.json to carry forward`)
    results[slug] = existing[slug]
    console.log(slug, '(frozen: sources archived, entries carried forward)')
    continue
  }
  const outDir = join(OUT, slug)
  mkdirSync(outDir, { recursive: true })
  results[slug] = []

  for (const item of items) {
    const src = join(INCOMING, item.src)
    const isGif = item.role === 'gif'
    // limitInputPixels: a long animated gif's frames count toward sharp's
    // default pixel cap (S4b hit it); outputs stay bounded by the resize
    // ladder, so lifting the INPUT cap is safe for our own curated sources.
    const img = sharp(src, { animated: isGif, limitInputPixels: false })
    const meta = await img.metadata()
    const widths = SIZES[item.role].filter(w => w <= meta.width)
    if (widths.length === 0) widths.push(meta.width)

    // frame16x9 (Emilie's fit ruling, 2026-07-15): a cover that is not
    // 16:9-native composites onto an exact 16:9 canvas filled with its OWN
    // background color (item.bg), so the 16:9 grid card shows the whole
    // asset with no crop and no visible letterbox. Applies to every rung
    // including the static first-frame ladders.
    const frameBg = item.frame16x9
      ? {
          r: parseInt(item.bg.slice(1, 3), 16),
          g: parseInt(item.bg.slice(3, 5), 16),
          b: parseInt(item.bg.slice(5, 7), 16),
          alpha: 1,
        }
      : undefined
    const resizeArgs = (w) =>
      item.frame16x9
        ? [w, Math.round((w * 9) / 16), { fit: 'contain', background: frameBg }]
        : [w, null, { withoutEnlargement: true }]

    const variants = []
    for (const w of widths) {
      const name = `${item.name}-${w}.webp`
      const out = join(outDir, name)
      const r = await sharp(src, { animated: isGif, limitInputPixels: false })
        .resize(...resizeArgs(w))
        .webp({ quality: isGif ? 74 : 82, effort: 4 })
        .toFile(out)
      totalBytes += r.size
      variants.push({ w, file: `assets/projects/${slug}/${name}`, kb: Math.round(r.size / 1024) })
    }

    // Static first frame for animated images: prefers-reduced-motion renders
    // this ladder instead of the looping webp (Img.tsx picks it).
    let statics
    if (isGif) {
      statics = []
      for (const w of widths) {
        const name = `${item.name}-static-${w}.webp`
        const out = join(outDir, name)
        const r = await sharp(src, { limitInputPixels: false }) // omitting the animated option reads frame one only
          .resize(...resizeArgs(w))
          .webp({ quality: 80, effort: 4 })
          .toFile(out)
        totalBytes += r.size
        statics.push({ w, file: `assets/projects/${slug}/${name}`, kb: Math.round(r.size / 1024) })
      }
    }

    // Every animated entry MUST carry a static first-frame ladder: it is the
    // reduced-motion rendering AND the grid's still-at-rest cover (Img.tsx).
    if (isGif && (!statics || statics.length === 0)) {
      throw new Error(`${slug}/${item.name}: animated entry has no static ladder`)
    }

    results[slug].push({
      name: item.name,
      role: item.role,
      // S4b: authored alt (80-140 chars) rides the manifest into images.json;
      // data/work.ts prefers it over the derived strip alt.
      ...(item.alt ? { alt: item.alt } : {}),
      aspect: item.frame16x9
        ? 1.7778
        : +(meta.width / (isGif ? meta.pageHeight ?? meta.height : meta.height)).toFixed(4),
      animated: isGif || undefined,
      variants,
      ...(statics ? { static: statics } : {}),
    })
    console.log(slug, item.name, variants.map(v => `${v.w}w:${v.kb}KB`).join(' '))
  }
}

mkdirSync(DATA, { recursive: true })
writeFileSync(join(DATA, 'images.json'), JSON.stringify(results, null, 2))
console.log(`\nTOTAL ${Math.round(totalBytes / 1024)}KB across ${Object.values(results).flat().length} images`)
