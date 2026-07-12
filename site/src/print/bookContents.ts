// G5 · the book's contents, in one place (THE ECONOMY: the validator and
// the census test read this same list; changing the book = editing here).
//
// THE FLAGSHIP SIX (proposed this session; Emilie's pick at the G5 gate):
// the two flagships + the three awarded studio projects + one solo
// exploration. SOMA / Marsception stay index-only: the `professional` slug
// has no local high-res originals (and SOMA's NDA check is still open), so
// neither can carry a 300dpi dominant image honestly.
import { MASTERS_BY_SLUG, type ProjectMaster } from '../content/projects'
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
  const master = MASTERS_BY_SLUG[slug]
  const entry = WORK_ENTRIES.find(w => w.slug === slug)
  if (!master || !entry) throw new Error(`book spread "${slug}" is not a project the registry knows`)
  return { master, entry }
}

export const BOOK_SPREADS: SpreadData[] = BOOK_SLUGS.map(spreadData)
