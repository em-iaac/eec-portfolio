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
  // HOW + OUTCOME added 2026-08-21 (her ask: every spine carries all four
  // beats). The function is transcribed from her submission board's Python,
  // the six dials named from the same slide (a b c radii, f d e sweep); the
  // outcome is her own account in the fill-the-spines interview: the
  // realization about found geometry, and the thread to Cappelletti.
  how: [
    <>
      The function, scripted in Python inside Grasshopper: x = a·cos³u·cos³v, y = b·sin³u·cos³v,
      z = c·sin³v. Cubing the sines and cosines is the whole trick: the ellipsoid pulls in toward
      its axes and the star appears.
    </>,
    <>
      Six dials on one surface: the radii a, b and c stretch the star; f, d and e scale how far u
      and v sweep, so the shell can open, close or wrap partway around.
    </>,
    <>
      A point grid evaluates the formula and a NURBS surface lofts through the points. Three
      sweeps of the dials, three stars.
    </>,
    <>
      ReduceMesh facets the chosen star into an envelope; floor plates, a core and a six part
      program are sliced in, and the formula has to answer as a building.
    </>,
  ],
  outcome: (
    <>
      The realization outlived the star: geometry with structure in it is lying around
      everywhere, closed form equations included, and the concavities were rooms before I asked
      them to be. That curiosity is what led to the next found shape, a pasta: the Cappelletti
      Pavilion starts exactly where this exercise ends, with a form nobody drew being taken
      seriously as a building. One function raised the question. The pavilion had to answer it as
      structure.
    </>
  ),
}

export default spine
