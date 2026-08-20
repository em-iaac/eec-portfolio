// THE SHEET'S NEIGHBORHOOD (Emilie's rulings, 2026-08-20, the template round:
// felt on three live mockups, her pick a mix — "d2 rails with d1 drawer for
// thoughts"). Two kinds of travel away from an open project, both read from
// the record:
//
//   - PREV / NEXT is the /work reading order (featured tier first, then
//     newest-first — the same order the grid presents), wrapping at the ends
//     the way the belts loop.
//   - MADE ME THINK OF is the registry's CORRELATIONS: every thought tied to
//     this project, strength-ordered (3..1), newest first within a strength.
//     Nothing is authored here — a thread that is not in the record does not
//     exist, and the one thought the BOOK names per project (bookPlates'
//     BOOK_THREAD, her pick) is a curation of this same set.
//
// The rule that put these OFF the card and onto the chrome (the organized-card
// board she signed off to build): everything on the card is this project;
// everything that leaves the project rides the chrome.
import { CORRELATIONS, ENTRIES } from '../../data/registry'
import { WORK_ENTRIES, type WorkEntry } from '../../data/work'

export type RelatedThought = { id: string; title: string; route: string; strength: number }

const THOUGHTS_BY_ID = new Map(
  ENTRIES.filter((e) => e.kind === 'thought').map((e) => [e.id, e] as const),
)

/** The thoughts correlated with a project, strength-ordered. Only thoughts
 *  with a written note qualify (a row must open somewhere). */
export function relatedThoughts(projectId: string): RelatedThought[] {
  const rows: RelatedThought[] = []
  for (const [a, b, strength] of CORRELATIONS) {
    const otherId = a === projectId ? b : b === projectId ? a : null
    if (!otherId) continue
    const t = THOUGHTS_BY_ID.get(otherId)
    if (!t?.note?.route) continue
    rows.push({ id: t.id, title: t.title, route: t.note.route, strength })
  }
  return rows.sort(
    (x, y) =>
      y.strength - x.strength ||
      (THOUGHTS_BY_ID.get(y.id)!.date > THOUGHTS_BY_ID.get(x.id)!.date ? 1 : -1),
  )
}

/** The open sheet's neighbors in the /work reading order, wrapping. */
export function neighborsOf(entryId: string): { prev: WorkEntry; next: WorkEntry } | null {
  const i = WORK_ENTRIES.findIndex((e) => e.id === entryId)
  if (i === -1 || WORK_ENTRIES.length < 2) return null
  const n = WORK_ENTRIES.length
  return { prev: WORK_ENTRIES[(i - 1 + n) % n]!, next: WORK_ENTRIES[(i + 1) % n]! }
}
