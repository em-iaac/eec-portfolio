// THE PUBLIC ROUTE MANIFEST (S3, 2026-07-13; REDESIGN-SPEC R9 / D6).
// Every crawlable route the site owns, derived from the registry so a new
// project or drafted note joins the prerender, the sitemap, and the head
// validator by existing (THE ECONOMY). Three consumers, one list:
//   - lib/headData.ts (the client per-route head + JSON-LD),
//   - scripts/prerender.mjs (esbuild-loads this module at build time to
//     know what to snapshot and what the sitemap lists),
//   - lib/headData.test.ts (the validator clause: every route here must
//     emit a complete, unique head + schema).
// DOM-free on purpose: the prerender script runs it under Node.
import { ENTRIES } from '../data/registry'
import { PILLAR_PATH } from './pillar'

export const SITE_ORIGIN = 'https://emiliechidiac.com'

export const PROJECT_IDS: string[] = ENTRIES.filter((e) => e.kind === 'project').map(
  (e) => e.id,
)

// Only thoughts with a drafted note have a real /thoughts/:id leaf; an
// absent note falls back to the index (ThoughtRoute), which must never be
// prerendered as if it were a page of its own.
export const THOUGHT_IDS: string[] = ENTRIES.filter(
  (e) => e.kind === 'thought' && e.note?.status === 'drafted',
).map((e) => e.id)

export const STATIC_ROUTES = ['/', '/work', '/thoughts', '/about', '/cv', PILLAR_PATH]

export const PUBLIC_ROUTES: string[] = [
  ...STATIC_ROUTES,
  ...PROJECT_IDS.map((id) => `/work/${id}`),
  ...THOUGHT_IDS.map((id) => `/thoughts/${id}`),
]

// Retired-but-citable addresses (G1/G3 promises: shared links never die).
// The SPA redirects them client-side; the prerender writes each one a tiny
// meta-refresh stub so a JS-less visitor or crawler lands on the target
// too, with a canonical pointing at the real page and noindex on the stub.
// Sheet stubs use the CITED uppercase form (P-101); other casings fall to
// the 404 page, whose SPA still redirects a human.
export const LEGACY_REDIRECTS: { from: string; to: string }[] = [
  { from: '/notebook', to: '/thoughts' },
  { from: '/explore', to: '/' },
  ...ENTRIES.filter((e) => e.explore != null).map((e) => ({
    from: `/explore/${e.id}`,
    to: '/',
  })),
  ...ENTRIES.filter((e) => e.kind === 'project' && e.sheet != null).map((e) => ({
    from: `/sheets/${e.sheet!.number}`,
    to: e.sheet!.route,
  })),
]
