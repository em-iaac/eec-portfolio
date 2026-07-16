// P-118 · Astroidal Ellipsoid (explorations). MaCAD bootcamp mini (seminar 3,
// 2025-10): the scripted-surface one-pager, authored fresh from her submission
// board at the S2 session, 2026-07-16. A LIGHT entry on purpose (D2): dek +
// question + a short WHAT/WHY, honestly thin, never dressed up as a hero.
// ALL COPY DRAFT: automode; Emilie signs at the end review.
import type { ProjectMaster } from './types'

const astroidal: ProjectMaster = {
  slug: 'astroidal',
  title: 'Astroidal Ellipsoid',
  lens: 'explorations',
  meta: 'MACAD BOOTCAMP · SEMINAR 3',
  dek: 'Six coefficients, one scripted surface: an astroidal ellipsoid pushed until it can hold a floor plan.',
  dekSigned: false,
  question: 'Can a math equation become a building?',
  alsoAnswers: [
    { q: 'What is an astroidal ellipsoid?', beat: 'what' },
    { q: 'How do you script a parametric surface in Python inside Grasshopper?', beat: 'what' },
    { q: 'Why reduce a smooth surface to a low poly mesh?', beat: 'why' },
    { q: 'Where does the floor plan go in a star shaped shell?', beat: 'why' },
  ],
  blurb:
    'A bootcamp exercise in scripted geometry: the astroidal ellipsoid equations written in Python inside Grasshopper, six coefficients swept into a family of star surfaces, one reduced to a low poly envelope and read as a small house.',
  tech: 'GRASSHOPPER · PYTHON · NURBS',
  links: [],
  image: {
    slug: 'astroidal',
    name: 'iterations',
    alt: 'Three astroidal ellipsoid surface iterations, the cubed sine and cosine equations pushed through different coefficients',
  },

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
  draftCopy: true,
  showcaseDraft: true, // S2 automode draft; Emilie reviews + signs at session end
}

export default astroidal
