// THE BOOK'S CONTENTS, WITHOUT THE PROSE (2026-08-11).
//
// This module exists so `scripts/print-assets.mjs` can learn what to bake
// without evaluating a single spine. The spines are reached through
// `import.meta.glob`, which is a Vite construct and simply does not exist in
// Node, so any script bundling `bookContents.ts` died on it. That is one of
// two independent reasons the manual bake had become unrunnable, and neither
// was visible from the site: the committed JPEGs kept the tests passing while
// the command that regenerates them could not complete.
//
// So the book's MEMBERSHIP and its ASSET DECLARATIONS live here (data only,
// no prose, no glob), and bookContents.ts joins the spines on top for the
// renderer. One source, still.
import { METAS_BY_SLUG } from '../content/projects'
import type { BookAsset, BookCorner } from '../content/projects/types'
import { WORK_ENTRIES } from '../data/work'

export const BOOK_SLUGS = [
  'sensi',
  'legoarch',
  'neurospace',
  'lungs',
  'huddle',
  'ballooning-market',
  'soma-towers',
  'falcon',
] as const

export interface BookPlate {
  slug: string
  title: string
  /** The dominant image on the project's page one. */
  spreadAssets: { slug: string; name: string }[]
  /** Page two's promoted asset, and the corner it bleeds from. */
  bookLead?: BookAsset & { corner: BookCorner }
  /** Page two's subordinate justified row. */
  bookRegister: BookAsset[]
  /** An asset standing in the head column, if the page declares one. */
  bookColumn?: BookAsset
  /** How much of the measure the register row spends. */
  bookRegisterScale?: number
}

// THE INDEX TILES (2026-08-11). Every project's cover, printed about 36mm
// wide on the index page. These get BAKED like everything else in the book,
// and the reason is specific: the web covers are webp, Chrome cannot pass
// webp through into a PDF, so it re-encodes each one LOSSLESSLY. Twenty-six
// tiles were arriving as 100 to 300KB Flate streams, 2.8MB in total, for
// images printed the size of a postage stamp. As baked JPEG they cost a
// fraction of that and look identical on paper.
export const INDEX_TILES: { slug: string; name: string }[] = WORK_ENTRIES.flatMap(w =>
  w.cover ? [{ slug: w.cover.slug, name: w.cover.name }] : [],
)

export const BOOK_PLATES: BookPlate[] = BOOK_SLUGS.map(slug => {
  const meta = METAS_BY_SLUG[slug]
  if (!meta) throw new Error(`book slug "${slug}" is not a project the registry knows`)
  return {
    slug,
    title: meta.title,
    spreadAssets: meta.spreadAssets ?? [],
    bookLead: meta.bookLead,
    bookRegister: meta.bookRegister ?? [],
    bookColumn: meta.bookColumn,
    bookRegisterScale: meta.bookRegisterScale,
  }
})

/** Every image page two draws, lead first. What the bake script walks. */
export function bookPageTwoAssets(p: BookPlate): BookAsset[] {
  const all = p.bookLead ? [p.bookLead, ...p.bookRegister] : [...p.bookRegister]
  if (p.bookColumn) all.push(p.bookColumn)
  return all
}
