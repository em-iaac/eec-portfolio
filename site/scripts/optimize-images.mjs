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
const results = only.length ? JSON.parse(readFileSync(join(DATA, 'images.json'), 'utf8')) : {}
let totalBytes = 0

for (const [slug, items] of Object.entries(MANIFEST)) {
  if (only.length && !only.includes(slug)) continue
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

    const variants = []
    for (const w of widths) {
      const name = `${item.name}-${w}.webp`
      const out = join(outDir, name)
      const r = await sharp(src, { animated: isGif, limitInputPixels: false })
        .resize(w, null, { withoutEnlargement: true })
        .webp({ quality: isGif ? 74 : 80, effort: 4 })
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
          .resize(w, null, { withoutEnlargement: true })
          .webp({ quality: 80, effort: 4 })
          .toFile(out)
        totalBytes += r.size
        statics.push({ w, file: `assets/projects/${slug}/${name}`, kb: Math.round(r.size / 1024) })
      }
    }

    results[slug].push({
      name: item.name,
      role: item.role,
      // S4b: authored alt (80-140 chars) rides the manifest into images.json;
      // data/work.ts prefers it over the derived strip alt.
      ...(item.alt ? { alt: item.alt } : {}),
      aspect: +(meta.width / (isGif ? meta.pageHeight ?? meta.height : meta.height)).toFixed(4),
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
