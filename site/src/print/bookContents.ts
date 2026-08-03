// G5 · the book's contents, in one place (THE ECONOMY: the validator and
// the census test read this same list; changing the book = editing here).
//
// THE FLAGSHIP SIX (proposed this session; Emilie's pick at the G5 gate):
// the two flagships + the three awarded studio projects + one solo
// exploration. SOMA / Marsception stay index-only: the `professional` slug
// has no local high-res originals (and SOMA's NDA check is still open), so
// neither can carry a 300dpi dominant image honestly.
//
// THE BOOK IS THE ONE EAGER CONSUMER (2026-08-03). The showcase spine is lazy
// everywhere else, but a printed spread cannot await: renderToString in
// printBook.test.tsx and headless Chrome in scripts/render-pdfs.mjs both need
// the prose synchronously. spines.eager.ts exists for exactly this, and the
// cost lands in the book's own lazy chunk, never in the site's.
import { METAS_BY_SLUG, type ProjectMaster } from '../content/projects'
import { SPINES_BY_SLUG } from '../content/projects/spines.eager'
import { WORK_ENTRIES, type WorkEntry } from '../data/work'

export const BOOK_SLUGS = [
  'sensi',
  'neurospace',
  'legoarch',
  'lungs',
  'huddle',
  'ballooning-market',
] as const

export interface SpreadData {
  master: ProjectMaster
  entry: WorkEntry
}

// The spread reads BOTH renditions of the one master: the entry (number,
// date, tech, recognition, spine) and the master itself (meta, stat,
// spreadAssets). Missing joins throw at module load, which the census test
// and the registry validator both surface long before a PDF renders.
export function spreadData(slug: string): SpreadData {
  const meta = METAS_BY_SLUG[slug]
  const spine = SPINES_BY_SLUG[slug]
  const entry = WORK_ENTRIES.find(w => w.slug === slug)
  if (!meta || !spine || !entry)
    throw new Error(`book spread "${slug}" is not a project the registry knows`)
  return { master: { ...meta, ...spine }, entry }
}

export const BOOK_SPREADS: SpreadData[] = BOOK_SLUGS.map(spreadData)
