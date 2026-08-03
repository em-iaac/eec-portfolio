// P-112 · Narkomfin as a Graph (S4b, 2026-07-14). Authored fresh from the
// public blog post (content/blog-catalog.json): no sheet ever existed.
// HONESTY (binding): applied, team-context ML, never ML-lead framing; the
// accuracy figures are the TEAM's results, woven as prose, and the model
// scoring the communal units as rule-breaking is the finding, not a win.
// Emilie at the S4b copy gate (2026-07-14) chose the SHARED credit over the
// dossier's individual-slice line, knowing the tradeoff; recorded for the
// next dossier extension. Dek + spine + credit row SIGNED at the same gate.
import type { ProjectMeta } from './types'

const narkomfin: ProjectMeta = {
  slug: 'narkomfin',
  title: 'Narkomfin as a Graph',
  lens: 'computation',
  meta: 'MACAD GRAPH ML · TEAM OF 4',
  myPart: 'Team of four, all hands on everything.',
  dek: 'Read a 1930 experiment in communal living as a graph and its real spatial units turn out to be vertical slices, not rooms.',
  dekSigned: true, // Emilie, S4b copy gate, 2026-07-14
  // THE QUESTION (D4 round 2, Emilie 2026-07-14: "okay" to the one-word tune;
  // "floor plan" is the literature's own search token). alsoAnswers feed the
  // question dot; team framing binds every wording. Question + dot set SIGNED by Emilie (REINDEX batch D, 2026-07-16).
  question: "What does a building's floor plan look like as a graph?",
  tech: 'PYTHON · GRAPHSAGE · LOUVAIN',
  links: [{ label: 'BLOG', href: 'https://blog.iaac.net/analyzing-narkomfin-through-its-graph/' }],
  // S2 fix round (2026-07-16, Emilie's gif-cover rule applied to all
  // stills): a slow zoom cut of the same voxel graph; still at rest is the
  // graph as before. Cover alt SIGNED by Emilie (S2 sign-off, 2026-07-17).
  image: {
    slug: 'narkomfin',
    name: 'graph-cover',
    alt: 'The Narkomfin voxel graph drawing closer: translucent volumes on black with graph nodes reaching out of the massing',
  },
  // Created zoom cover: card face ONLY, never a deck page (Emilie's round-3
  // rule; the real voxel-graph still remains the first deck page).
  coverMontage: true,
  showcaseDraft: false, // spine + credit row signed by Emilie (S4b gate, 2026-07-14)
}

export default narkomfin
