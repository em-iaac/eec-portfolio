// P-112 · Narkomfin as a Graph (S4b, 2026-07-14). Authored fresh from the
// public blog post (content/blog-catalog.json): no sheet ever existed.
// HONESTY (binding): applied, team-context ML, never ML-lead framing; the
// accuracy figures are the TEAM's results, woven as prose, and the model
// scoring the communal units as rule-breaking is the finding, not a win.
// Emilie at the S4b copy gate (2026-07-14) chose the SHARED credit over the
// dossier's individual-slice line, knowing the tradeoff; recorded for the
// next dossier extension. Dek + spine + credit row SIGNED at the same gate.
import type { ProjectMaster } from './types'

const narkomfin: ProjectMaster = {
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
  alsoAnswers: [
    { q: 'Can a machine tell what a room is for just from where it sits?', beat: 'how' },
    { q: "What does a floor plan know that it isn't telling you?", beat: 'why' },
    { q: 'What happens when a rule-following classifier meets a building built to break the rules of home?', beat: 'outcome' },
    { q: 'How do centrality and community detection read a 1930 experiment in communal living?', beat: 'how' },
  ],
  blurb:
    'Moscow’s Narkomfin building, read as a graph: grid-sampled plans, stair links, centrality, community detection. A pretrained room classifier scored the communal units as rule-breaking, which is the point: Ginzburg meant them to break the rules of home.',
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

  what: (
    <>
      The Narkomfin building (Ginzburg and Milinis, 1930) is the constructivist experiment in
      communal living. We converted its Type K and Type F duplex units from Rhino geometry into
      spatial graphs, grid sampling the plans, ray casting the connections, adding the stairs as
      vertical links, then read the building through centrality, shortest paths, and community
      detection. A team of four, all hands on everything: Lakzhmy Mari Zaro, María Sánchez
      Domínguez, Charles Abi Chahine, and me.
    </>
  ),
  why: (
    <>
      A floor plan shows you a corridor. The graph shows that every single path runs through it.
      Reading a canonical building as data is a way to test whether the numbers can see what the
      architecture is doing on purpose.
    </>
  ),
  how: [
    <>
      Sample each level into a walkable grid from the Rhino model, ray casting for connections and
      adding stairs as the vertical links.
    </>,
    <>
      Read the graph: closeness and betweenness centrality, shortest paths, and Louvain community
      detection over both unit types.
    </>,
    <>
      Run a GraphSAGE room classifier pretrained on Swiss apartments across the building and
      compare how each unit type reads.
    </>,
  ],
  outcome: (
    <>
      The communities land as vertical, corridor-bound slices, not rooms or floors. The team’s
      classifier read the conventional Type F rooms at 91.3% but the communal Type K at only
      67.9%, and the low number is the finding: the model telling you this building does not
      follow the domestic rules, exactly as its architects intended.
    </>
  ),
  showcaseDraft: false, // spine + credit row signed by Emilie (S4b gate, 2026-07-14)
}

export default narkomfin
