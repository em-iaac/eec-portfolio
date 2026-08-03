// P-114 · Data into Geometry (S4b, 2026-07-14). Authored fresh from the
// public blog post (content/blog-catalog.json): no sheet ever existed.
// HONESTY (binding, session gate 2026-07-14): the same data team of three as
// The Lungs (María, Lakzhmy, Emilie), SHARED framing per her gate ruling
// ("keep it shared for now"). The dropped blog hero (image-309) is credited
// to the structure/façade team, so it never ships on this project's surfaces.
import type { ProjectMeta } from './types'

const dataGeometry: ProjectMeta = {
  slug: 'data-geometry',
  title: 'Data into Geometry',
  lens: 'computation',
  meta: 'MACAD BIM · DATA TEAM OF 3',
  myPart: 'Data team of three, shared end to end.',
  dek: 'The data team does not produce geometry, so we turned the numbers into it: KPIs you can stand inside the Revit model and see.',
  dekSigned: true, // Emilie, S4b copy gate, 2026-07-14
  // THE QUESTION (D4 round 2, Emilie 2026-07-14: "good" to the Revit tune).
  // alsoAnswers feed the question dot; data-team framing binds. Question +
  // dot set SIGNED by Emilie (REINDEX batch D, 2026-07-16).
  question: 'How do you turn a spreadsheet into Revit geometry you can stand inside?',
  tech: 'RHINO.INSIDE REVIT · GRASSHOPPER · SPECKLE',
  links: [
    {
      label: 'BLOG',
      href: 'https://blog.iaac.net/turning-data-into-geometry-rhino-inside-revit-workflows-for-modelling-documenting/',
    },
  ],
  // S2 fix round (2026-07-16, Emilie's gif-cover rule applied to all
  // stills): a slow zoom cut of the same workflow board; still at rest is
  // the board as before. Cover alt SIGNED by Emilie (S2 sign-off, 2026-07-17).
  image: {
    slug: 'data-geometry',
    name: 'workflow-cover',
    alt: 'The data team workflow drawing closer: Speckle model and parameter sheets flowing through Grasshopper into Revit',
  },
  // Created zoom cover: card face ONLY, never a deck page (Emilie's round-3
  // rule; the real workflow board remains the first deck page).
  coverMontage: true,
  showcaseDraft: false, // spine + credit row signed by Emilie (S4b gate, 2026-07-14)
}

export default dataGeometry
