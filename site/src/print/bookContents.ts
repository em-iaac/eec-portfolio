// G5 · the book's contents, in one place (THE ECONOMY: the validator and
// the census test read this same list; changing the book = editing here).
//
// THE EIGHT (Emilie, 2026-08-11, re-chosen from all 21 against the roles she
// is actually applying for). The book stopped being a lab report and became a
// LEAVE-BEHIND FOR A RECRUITER: selective, skimmable, strongest first.
//
// The old note here said SOMA and Marsception were index-only because the
// `professional` slug had no high-res originals and SOMA's NDA was open. BOTH
// REASONS ARE DEAD: the NDA was lifted in 2026-07, and the `verve` and `mars`
// manifest slugs carry originals up to 9930px. That stale comment is exactly
// why the selection was re-checked against the files on disk rather than
// against the record of a previous decision.
//
// Print feasibility was checked BEFORE choosing, not after. Ruled out on it:
// Chair Simulation (nothing above 1550px), A Playscape (only a Grasshopper
// canvas grab survives), Astroidal Ellipsoid (its one large image is portrait
// and the plate is landscape).
//
// Raised and declined: The Homage, which carries the one recognition a
// stranger can verify in a click (Top 100 of 422 teams). She kept A Ballooning
// Market instead and reaffirmed it after the argument, so The Homage stays in
// the index. Also considered and left out: Encoding Urban Risk, Rings of Mars,
// Tsukiji, Falcon's sibling The Encounter.
//
// EACH PROJECT NOW HOLDS A FACING PAIR: the project page (unchanged, she likes
// it) on the verso, and an asset grid on the facing recto. 8 pairs + cover +
// index + CV + colophon = 20 pages, which is what the object can afford at the
// 10MB ceiling once the index stops embedding 21 covers at four times the
// resolution paper can use.
//
// THE BOOK IS THE ONE EAGER CONSUMER (2026-08-03). The showcase spine is lazy
// everywhere else, but a printed spread cannot await: renderToString in
// printBook.test.tsx and headless Chrome in scripts/render-pdfs.mjs both need
// the prose synchronously. spines.eager.ts exists for exactly this, and the
// cost lands in the book's own lazy chunk, never in the site's.
import { METAS_BY_SLUG, type ProjectMaster } from '../content/projects'
import { SPINES_BY_SLUG } from '../content/projects/spines.eager'
import { WORK_ENTRIES, type WorkEntry } from '../data/work'

// Her order, verbatim: the five MaCAD projects as /work already ranks them,
// then the two practice pages at the end. Verve is delivery inside a big team,
// Falcon she led from the first sketch, and a reader takes those as two
// different answers to "has she done this for real".
//
// The list itself lives in bookPlates.ts with the asset declarations, so the
// bake script can read them without evaluating a spine (see that file).
import { BOOK_SLUGS } from './bookPlates'
export { BOOK_SLUGS }

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
