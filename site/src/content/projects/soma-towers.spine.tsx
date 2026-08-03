// THE SPINE of soma-towers: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of soma-towers.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project's prose, not all 21. The meta half stays in
// soma-towers.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'Does parametric design actually get built?', beat: 'what' },
    { q: 'What does it take to carry a Grasshopper facade study into BIM delivery?', beat: 'what' },
    { q: 'How does a facade study survive the door schedule?', beat: 'why' },
    { q: 'What did four towers teach about the distance between a definition and a drawing?', beat: 'why' },
  ],
  what: (
    <>
      Verve City Walk is the two tower high-rise SOMA designed at City Walk in Dubai: a shared
      amenities podium under both towers, balconies cut into the facade rather than hung off it.
      As a design architect at SOMA I ran design exploration and parametric facade studies in
      Rhino and Grasshopper, and carried them into the Revit BIM model for floorplans, facade
      strategies and interior layouts of the residential towers. The same year carried three
      more Dubai towers, District O, Enara and Saria, from massing studies into their BIM sets.
    </>
  ),
  why: (
    <>
      These are the years where I learned that a parametric study only matters if it survives
      contact with a drawing set. Practice is where the elegant definition meets the door
      schedule, and both have to win.
    </>
  ),
}

export default spine
