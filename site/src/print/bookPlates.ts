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
import { PILLAR_SHORT } from '../lib/pillar'

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

// THE THOUGHT EACH PLATE NAMES (Emilie, 2026-08-16, picked one by one).
//
// The footer rail used to end on a MEASURED NUMBER, and only three of the
// eight had one: five plates carried a visible blank in a slot the eye had
// been trained to read, so five projects looked unmeasured. Filling the blanks
// was the obvious repair and she chose the better one — the rail now names the
// thought the project made her think of.
//
// It is the choice that makes the book argue its own thesis. The cover IS the
// mind graph and the index lists the thoughts; until now a reader had to infer
// that the work and the thinking are one nervous system. Every spread says it
// now, and the three numbers I traced were not wasted: they live on `stat`,
// which the site's own showcase renders.
//
// ⚠ THE DIRECTION IS NOT CONSISTENT, and that is why the rail says MADE ME
// THINK OF rather than LED TO. All seven of Sensi's threads point INTO Sensi —
// the thinking came first and the project applied it — while NeuroSpace points
// OUT to `scoring` and `drawiface`. A causal verb would be false on half the
// plates; an associative one is true on all of them.
//
// Six of these existed already; `soma` and `falcon` are the two threads she
// wrote into CORRELATIONS in the same pass. Several projects carry more than
// one thread (Sensi has seven) and the pick is hers per project, NOT the
// strongest by strength — she overrode that on three of them. printBook's test
// asserts every id here is a real thought AND that the map actually carries a
// thread between the two, so the book can never name a relation the record
// does not have.
export const BOOK_THREAD: Record<string, string> = {
  sensi: 'llm',
  legoarch: 'genai',
  neurospace: 'bim',
  lungs: 'respond',
  huddle: 'rules',
  'ballooning-market': 'solvers',
  'soma-towers': 'xreal',
  falcon: 'drawiface',
}

// THE ONE WORD THE RAIL DOES NOT SHOUT (Emilie, 2026-08-16).
//
// The rail sets every thought's title in caps, which is right for seven of the
// eight and fatal for the eighth: `behavior information modeling` is her
// coinage, and its short form carries a lowercase "e" that is the whole joke,
// because the argument is "keep the letters, change the noun". Uppercased it
// reads BEIM and the coinage dies on the page meant to announce it.
//
// So a thought may declare a printed form here, and a thought that declares one
// is printed VERBATIM rather than uppercased. Deliberately a map and not a
// flag: the next coinage will want its own spelling, not a boolean.
//
// ⚠ THE SPELLING ITSELF IS NOT AUTHORED HERE. The print layer composes and
// never authors (THE ECONOMY), and for one day this file held the string
// 'BeIM' while Pillar.tsx held a second copy typed by hand. Both now read
// PILLAR_SHORT from lib/pillar, beside the full phrase it abbreviates, so the
// lowercase "e" has exactly one place it can be lost.
//
// The pillar is also where the term is INTRODUCED, with a gloss in the
// sentence before it, because her standing rule (WORDS-BRIEF §2) is that the
// coinage never appears without one and a footer cannot carry a gloss. This
// rail is the echo, not the debut.
export const THREAD_LABEL: Record<string, string> = {
  bim: PILLAR_SHORT,
}

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
