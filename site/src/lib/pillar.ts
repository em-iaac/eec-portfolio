// THE PILLAR (S3, 2026-07-13; CONTENT-STRATEGY.md D6 "topical authority").
// The one definitive "Behavior Information Modeling" surface: the exact
// phrase lives in this route's slug, <title>, <h1>, first line, and the
// Person node's knowsAbout. The neuro-tagged thoughts and projects each
// carry a door to it, and the pillar links back to every one of them, so
// the coined term has ONE canonical source with the site's whole neuro
// cluster pointing at it. Membership is derived from the registry's 'neuro'
// tag, never listed by hand (THE ECONOMY: a new neuro project joins the
// cluster by being tagged, no wiring). The definitive prose is S5's; this
// module is the technical shell only.
export const PILLAR_PATH = '/behavior-information-modeling'
export const PILLAR_PHRASE = 'Behavior Information Modeling'

// THE SHORT FORM (Emilie, 2026-08-16). "BeIM" had never shipped anywhere — it
// lived only in her strategy notes — until the book's footer rail needed a name
// short enough to fit and the pillar gave it a home with a gloss beside it.
//
// ⚠ It lives HERE, next to the full phrase, and not in the print layer, which
// composes and never authors. It was typed independently in two files for a
// day (the pillar's prose and bookPlates' THREAD_LABEL) and that is exactly the
// drift this module exists to prevent: the lowercase "e" IS the coinage, so a
// second copy is a second chance to lose it.
export const PILLAR_SHORT = 'BeIM'

export function isPillarRelated(tags: readonly string[]): boolean {
  return tags.includes('neuro')
}
