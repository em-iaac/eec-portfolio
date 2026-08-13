// G5 · print image resolution. THREE consumers, three different appetites,
// and the differences are the book's whole weight budget:
//
//   PLATE      · a project's dominant image, printed 145mm wide. ~300dpi, so
//                scripts/print-assets.mjs bakes a 2400px rung.
//   GRID       · the facing asset page. ~220dpi at the width each image is
//                actually drawn at, baked per image, aspect recorded so the
//                page can justify its rows without cropping anything.
//   INDEX TILE · 21 covers printed ~36mm wide. These need 480px and were
//                taking 1024, i.e. four and a half times the pixel area paper
//                can use, on 21 images, on one page. That was about 5MB of a
//                7.4MB PDF: the single heaviest thing in the book was its
//                least important page.
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
  index?: Record<string, Record<string, PrintRung>>
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

/**
 * An index tile: the BAKED 480px JPEG, printed about 36mm wide (~339dpi).
 *
 * It has to be baked rather than reused from the web ladder, and the reason
 * is not resolution. The web covers are webp, Chrome cannot pass webp through
 * into a PDF, so it re-encodes every one of them LOSSLESSLY: twenty-six tiles
 * were arriving as 100 to 300KB Flate streams, 2.8MB of a 6.7MB book, for
 * images the size of a postage stamp. Feed Chrome a JPEG and it passes the
 * bytes straight through.
 *
 * (This also corrects a wrong guess made on the way: swapping the animated
 * covers for their static stills, which are forty times lighter on disk, made
 * the PDF BIGGER. The file on disk was never what the PDF was paying for.)
 *
 * Falls back to the smallest web variant that clears the tile width, so a
 * cover added to /work still prints before anyone re-runs the bake.
 */
const INDEX_TILE_MIN_W = 480
export function indexTileSrc(slug: string, name: string): string | undefined {
  const baked = PRINT.index?.[slug]?.[name]
  if (baked) return BASE + baked.file

  const row = webRows(slug).find(r => r.name === name)
  if (!row) return undefined
  const ladder = row.static?.length ? row.static : row.variants
  if (!ladder.length) return undefined
  const big = [...ladder].sort((a, b) => a.w - b.w).find(v => v.w >= INDEX_TILE_MIN_W)
  const pick = big ?? ladder.reduce((a, b) => (b.w > a.w ? b : a))
  return BASE + pick.file
}
