// THE SPINE of narkomfin: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of narkomfin.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project's prose, not all 21. The meta half stays in
// narkomfin.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'Can a machine tell what a room is for just from where it sits?', beat: 'how' },
    { q: "What does a floor plan know that it isn't telling you?", beat: 'why' },
    { q: 'What happens when a rule-following classifier meets a building built to break the rules of home?', beat: 'outcome' },
    { q: 'How do centrality and community detection read a 1930 experiment in communal living?', beat: 'how' },
  ],
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
}

export default spine
