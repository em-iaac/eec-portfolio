// The neural world's registry joins (the meta build). Every id here is a
// STRING JOIN into registry.ts: the horizontal career skeleton anchors its
// fork geometry on the four departure milestones, each milestone rides a
// named lane, and one award anchors to a milestone that refId cannot express
// (refId must point at a project; Tamayouz honours the B.Arch). The registry
// validator asserts each id resolves, so a rename/removal fails the build
// instead of silently blanking a lane or orphaning a star.
// JSX-free so the validator and worldGraph import it without any UI weight.

export type WorldLane = 'main' | 'self' | 'soma' | 'dyn' | 'macad'

// Canvas y per lane (the record runs beneath the mind; viewBox height 860).
export const LANE_Y: Record<WorldLane, number> = {
  main: 660,
  self: 600,
  soma: 722,
  dyn: 762,
  macad: 560,
}

// A departure milestone sits ON the main line and forks its lane off.
// (The CV graph's bim stub retired with it; the world draws the four lanes
// whose eras carry the work.)
export const LANE_FORKS: Record<string, WorldLane> = {
  'self-open': 'self',
  'soma-start': 'soma',
  'dynamic-start': 'dyn',
  'macad-start': 'macad',
}

// Which lane each milestone's commit dot rides.
export const MILESTONE_LANE: Record<string, WorldLane> = {
  'xrlab-start': 'main',
  'self-open': 'self',
  'barch-grad': 'main',
  'soma-start': 'soma',
  'dynamic-start': 'dyn',
  'macad-start': 'macad',
  'macad-y1': 'macad',
  'site-live': 'self',
}

// The soma lane merges back into the main line at this milestone's column.
export const SOMA_MERGE_AT = 'dynamic-start'

// An award normally hangs off the project its refId names. This override
// anchors an award whose honour is a milestone, not a project. (S2,
// 2026-07-16: the map emptied. Tamayouz honoured the B.Arch graduation
// project, which now lives ON the site as The Homage (P-116), so its refId
// expresses the anchor directly and the barch-grad approximation retired.)
export const AWARD_ANCHOR_OVERRIDE: Record<string, string> = {}
