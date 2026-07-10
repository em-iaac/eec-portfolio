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
import { ALL_PROJECT_MASTERS, MASTERS_BY_SLUG, type ProjectMaster } from '../content/projects'

// The historical name: consumers typed against `Project`; the master file is
// a superset (card fields + the G1 showcase spine).
export type Project = ProjectMaster

export const ALL_PROJECTS: Project[] = ALL_PROJECT_MASTERS

export const PROJECTS_BY_SLUG: Record<string, Project> = MASTERS_BY_SLUG
