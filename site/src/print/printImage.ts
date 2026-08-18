// G5 · print image resolution. TWO consumers, two different appetites, and
// the differences are the book's whole weight budget:
//
//   PLATE · a project's dominant image, printed 145mm wide. ~300dpi, so
//           scripts/print-assets.mjs bakes a 1800px rung.
//   GRID  · the facing asset page. ~220dpi at the width each image is
//           actually drawn at, baked per image, aspect recorded so the
//           page can justify its rows without cropping anything.
//
// (An INDEX TILE rung existed until the guards audit, 2026-08-18. The index
// page's tiles became her drawn partis on 2026-08-11, which left indexTileSrc
// with zero call sites and 21 baked JPEGs the book never referenced; both are
// gone, and the bake prunes the committed tiles.)
import images from '../data/images.json'
import printImages from '../data/print-images.json'

const BASE = import.meta.env.BASE_URL

interface WebVariant {
  w: number
  file: string
}
interface WebImage {
  name: string
  alt?: string
  animated?: boolean
  /** The poster frame derived for animated covers. */
  static?: WebVariant[]
  variants: WebVariant[]
}
export interface PrintRung {
  file: string
  w: number
  h: number
}

// print-images.json: { plates: {slug: {name: rung}}, grid: {slug: {name: rung}} }
const PRINT = printImages as {
  plates?: Record<string, Record<string, PrintRung>>
  grid?: Record<string, Record<string, PrintRung>>
}

const webRows = (slug: string) => (images as Record<string, WebImage[]>)[slug] ?? []

/** The dominant plate: the baked 300dpi rung, the largest web rung otherwise. */
export function printImageSrc(slug: string, name: string): string | undefined {
  const rung = PRINT.plates?.[slug]?.[name]
  if (rung) return BASE + rung.file

  const row = webRows(slug).find(r => r.name === name)
  if (!row?.variants.length) return undefined
  const largest = row.variants.reduce((a, b) => (b.w > a.w ? b : a))
  return BASE + largest.file
}

/**
 * An asset-page image, with the geometry the row needs to justify itself.
 * No web fallback on purpose: the census test requires a baked rung for every
 * declared asset, so a silent fallback would only ever hide a missing bake.
 */
export function gridImage(
  slug: string,
  name: string,
): (PrintRung & { src: string; alt: string }) | undefined {
  const rung = PRINT.grid?.[slug]?.[name]
  if (!rung) return undefined
  // The caption is the alt Emilie already signed in image-manifest.mjs
  // (80-140 chars, context not contents). It is what turns the asset page
  // from a mood board into evidence, and it was sitting unused in print.
  const alt = webRows(slug).find(r => r.name === name)?.alt ?? ''
  return { ...rung, src: BASE + rung.file, alt }
}
