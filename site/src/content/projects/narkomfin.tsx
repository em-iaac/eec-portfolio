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
  // THE QUESTION (D4): DEFERRED to the question-discovery session. Candidate
  // parked: "What does a building's plan look like as a graph?" (the
  // CONTENT-STRATEGY example for this project). The dek serves meanwhile.
  blurb:
    'Moscow’s Narkomfin building, read as a graph: grid-sampled plans, stair links, centrality, community detection. A pretrained room classifier scored the communal units as rule-breaking, which is the point: Ginzburg meant them to break the rules of home.',
  tech: 'PYTHON · GRAPHSAGE · LOUVAIN',
  links: [{ label: 'BLOG', href: 'https://blog.iaac.net/analyzing-narkomfin-through-its-graph/' }],
  image: {
    slug: 'narkomfin',
    name: 'voxel-graph',
    alt: 'The Narkomfin building rebuilt as translucent voxel volumes on black, spatial graph nodes and edges reaching out of the massing',
  },

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
