// G5 · print image resolution. The ~6 dominant spread images need real
// print resolution (the web ladder tops out at 1600w; A4 at 300dpi wants
// ~2600px), which `scripts/print-assets.mjs` bakes from the local originals
// into public/assets/print/ + the committed print-images.json manifest (a
// BOUNDED set: only the curated spreads, never the whole library).
//
// Everything else in the book (index tiles at ~35mm) prints fine from the
// largest existing web variant, so this resolver prefers the print rung and
// falls back to the web ladder. The book census test (printBook.test.tsx)
// pins the book slugs to the print rung, so the fallback never quietly
// ships a soft spread.
import images from '../data/images.json'
import printImages from '../data/print-images.json'

const BASE = import.meta.env.BASE_URL

interface WebVariant {
  w: number
  file: string
}
interface WebImage {
  name: string
  variants: WebVariant[]
}

// print-images.json: { [slug]: { [name]: { file, w } } }
const PRINT_MANIFEST = printImages as Record<string, Record<string, { file: string; w: number }>>

export function printImageSrc(slug: string, name: string): string | undefined {
  const printHit = PRINT_MANIFEST[slug]?.[name]
  if (printHit) return BASE + printHit.file

  const rows = (images as Record<string, WebImage[]>)[slug]
  const row = rows?.find(r => r.name === name)
  if (!row?.variants.length) return undefined
  const largest = row.variants.reduce((a, b) => (b.w > a.w ? b : a))
  return BASE + largest.file
}
