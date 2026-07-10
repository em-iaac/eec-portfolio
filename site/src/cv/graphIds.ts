// The career graph's registry joins (G3). Every id here is a STRING JOIN
// into registry.ts: the drawing anchors its fork geometry on the five
// milestone ids, and BRANCH_OF / FORKS assign entries to lanes by id. The
// registry validator asserts each one resolves, so a rename/removal in the
// registry fails the build instead of silently blanking the rail or
// mis-laning an entry (the same guarantee every other cross-file join has).
// JSX-free so the validator can import it without pulling the graph chunk.

export type BranchId = 'main' | 'self' | 'bim' | 'soma' | 'dyn' | 'macad'

// Entries that do NOT follow the date rule (the date rule: MaCAD era after
// 2025-10, everything else the main line). Projects ride the branch they
// were made on; awards/press ride the branch of the work they recognise.
// NOW rides the live lane: it is what the red tip is doing.
export const BRANCH_OF: Record<string, BranchId> = {
  soma: 'soma',
  mars: 'self',
  'mars-top50': 'self',
  biennale: 'self',
  cemetery: 'self',
  now: 'self',
}

// A departure milestone sits ON the main line and forks its branch off.
export const FORKS: Record<string, BranchId> = {
  'self-open': 'self',
  'soma-start': 'soma',
  'dynamic-start': 'dyn',
  'macad-start': 'macad',
}

// buildGeom() anchors the drawn fork/merge geometry on these five rows.
export const GEOMETRY_ANCHOR_IDS = [
  'self-open',
  'soma-start',
  'dynamic-start',
  'macad-start',
  'barch-grad',
] as const
