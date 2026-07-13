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

export function isPillarRelated(tags: readonly string[]): boolean {
  return tags.includes('neuro')
}
