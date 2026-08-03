// THE MASTER CONTENT INDEX (G1). One project per pair of files in this folder;
// this index assembles them in the canonical lens order the old projects store
// used (computation heroes, then practice, then explorations). Adding a project
// = one registry entry + one meta file + one spine file here (THE ECONOMY).
//
// TWO HALVES, TWO LOADING STRATEGIES (2026-08-03, the phone pass; see types.ts
// for the why). The META half is statically barrelled below, because the grid
// face, the CV line, headData, the sitemap and the OG card all read it
// synchronously on routes that never open a project. The SPINE half is reached
// through import.meta.glob in LAZY mode, so opening one project downloads one
// project's prose.
//
// Measured before: `work-*.js` was 61.4KB, every byte of it in the graph of any
// module that touched data/work.ts, and preloaded on /cv and /rights.
//
// This is the same shape thoughts/openings.ts already uses for the notes: the
// index surfaces get the JSX-free half, the leaf gets the prose.
import type { ProjectMeta, ProjectSpine, ProjectMaster } from './types'
import sensi from './sensi'
import neurospace from './neurospace'
import huddle from './huddle'
import lungs from './lungs'
import legoarch from './legoarch'
import ballooningMarket from './ballooning-market'
import podcast from './podcast'
import somaTowers from './soma-towers'
import marsception from './marsception'
import cappelletti from './cappelletti'
import xrLab from './xr-lab'
// S4b · THE FOUR (2026-07-14): the blog projects, appended after the
// existing set (supporting tier; the gallery orders by featured rank + date).
// Pelagñou was pulled at Emilie's gate call: parked as a THOUGHT candidate
// (see the note in data/registry.ts).
import narkomfin from './narkomfin'
import urbanRisk from './urban-risk'
import dataGeometry from './data-geometry'
import tsukiji from './tsukiji'
// S2 · THE NEW WORK (2026-07-16): the LAU thesis, the two Jemma Chidiac
// competitions (split from one entry at Emilie's fix-round call), and the
// three bootcamp mini-explorations (light entries, D2). All copy ships
// draftCopy/showcaseDraft until Emilie signs at the end review.
import homage from './homage'
import encounter from './encounter'
import falcon from './falcon'
import astroidal from './astroidal'
import chairSim from './chair-sim'
import playscape from './playscape'

export type { ProjectMeta, ProjectSpine, ProjectMaster } from './types'

export const ALL_PROJECT_METAS: ProjectMeta[] = [
  sensi,
  neurospace,
  huddle,
  lungs,
  legoarch,
  ballooningMarket,
  podcast,
  somaTowers,
  marsception,
  cappelletti,
  xrLab,
  narkomfin,
  urbanRisk,
  dataGeometry,
  tsukiji,
  homage,
  encounter,
  falcon,
  astroidal,
  chairSim,
  playscape,
]

export const METAS_BY_SLUG: Record<string, ProjectMeta> = Object.fromEntries(
  ALL_PROJECT_METAS.map(p => [p.slug, p]),
)

// ---- The spines -----------------------------------------------------------
// LAZY glob: Vite emits one chunk per spine and nothing here is in the graph
// until a slug is asked for. The key shape is fixed by the glob pattern, so a
// spine file that is renamed or missing fails loudly at load rather than
// silently rendering an empty showcase.
const SPINE_MODULES = import.meta.glob<{ default: ProjectSpine }>('./*.spine.tsx')

const spineCache = new Map<string, Promise<ProjectSpine>>()

/** The four beats for one project. Cached, so re-opening never refetches. */
export function loadSpine(slug: string): Promise<ProjectSpine> {
  const cached = spineCache.get(slug)
  if (cached) return cached
  const load = SPINE_MODULES[`./${slug}.spine.tsx`]
  if (!load) return Promise.reject(new Error(`no spine file for project "${slug}"`))
  const p = load().then(m => m.default)
  spineCache.set(slug, p)
  return p
}

/** Every spine at once. The guard tests only; the book uses the eager barrel. */
export async function loadAllSpines(): Promise<Record<string, ProjectSpine>> {
  const pairs = await Promise.all(
    ALL_PROJECT_METAS.map(async m => [m.slug, await loadSpine(m.slug)] as const),
  )
  return Object.fromEntries(pairs)
}

/** Both halves for one project, for a surface that genuinely needs both. */
export async function loadMaster(slug: string): Promise<ProjectMaster | undefined> {
  const meta = METAS_BY_SLUG[slug]
  if (!meta) return undefined
  return { ...meta, ...(await loadSpine(slug)) }
}
