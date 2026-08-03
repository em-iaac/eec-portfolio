// THE SPINE of astroidal: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of astroidal.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project's prose, not all 21. The meta half stays in
// astroidal.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'What is an astroidal ellipsoid?', beat: 'what' },
    { q: 'How do you script a parametric surface in Python inside Grasshopper?', beat: 'what' },
    { q: 'Why reduce a smooth surface to a low poly mesh?', beat: 'why' },
    { q: 'Where does the floor plan go in a star shaped shell?', beat: 'why' },
  ],
  what: (
    <>
      The astroidal ellipsoid equations scripted in Python inside Grasshopper: a point grid built
      from cubed sines and cosines, six coefficients to pull on, a NURBS surface lofted through
      the points. Three sweeps of the coefficients give three different stars; ReduceMesh turns
      the chosen one into a faceted envelope with floor plates, a core and a six part program
      sliced in.
    </>
  ),
  why: (
    <>
      A light exercise with a serious point: the distance between a formula and a floor plan is
      shorter than it looks, if you take the last step seriously.
    </>
  ),
}

export default spine
