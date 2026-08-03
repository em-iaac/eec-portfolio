// THE PROJECTS BARREL (G1, 2026-07-10). The per-project card copy that lived
// here moved into ONE MASTER FILE PER PROJECT under src/content/projects/
// (REDESIGN-SPEC §11: the master file feeds the /work card, the showcase,
// and later the book spread + CV line). This barrel preserves the import
// paths every consumer already uses; nothing was reworded in the move.
//
// Retired with the move (dead since R1 replaced the old Home): the
// HEROES / PRACTICE / EXPLORATIONS groupings and HOME_FEATURED. The lens
// grouping survives as each master's `lens` field; Design & Practice stays
// locked to Marsception + SOMA only (Session 1 ruling; Dynamic Solution
// appears in the CV experience list, not the Work lens).
//
// SINCE 2026-08-03 THIS IS THE META HALF ONLY. The showcase spine moved into
// <slug>.spine.tsx and is loaded lazily (content/projects/index.ts, loadSpine).
// `Project` therefore no longer carries what/why/how/outcome. Every consumer
// here needed metadata and nothing else; the one surface that reads the prose
// is WorkOverlay, which asks for it by slug when a project is opened.
import { METAS_BY_SLUG, type ProjectMeta } from '../content/projects'

// The historical name: consumers typed against `Project`.
export type Project = ProjectMeta

export const PROJECTS_BY_SLUG: Record<string, Project> = METAS_BY_SLUG
