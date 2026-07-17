// P-114 · Data into Geometry (S4b, 2026-07-14). Authored fresh from the
// public blog post (content/blog-catalog.json): no sheet ever existed.
// HONESTY (binding, session gate 2026-07-14): the same data team of three as
// The Lungs (María, Lakzhmy, Emilie), SHARED framing per her gate ruling
// ("keep it shared for now"). The dropped blog hero (image-309) is credited
// to the structure/façade team, so it never ships on this project's surfaces.
import type { ProjectMaster } from './types'

const dataGeometry: ProjectMaster = {
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
  alsoAnswers: [
    { q: 'Can a KPI be a building component instead of a row you have to believe?', beat: 'what' },
    { q: 'What happens when the data team has to show up in the model?', beat: 'why' },
    { q: 'How do Rhino.Inside Revit workflows turn performance data into parametric families?', beat: 'how' },
    { q: 'How does analysis data stay visible all the way to RVT, IFC, and PDF?', beat: 'outcome' },
  ],
  blurb:
    'On Hyperbuilding 01, the data team’s numbers lived in spreadsheets while everyone else made form. Rhino.Inside Revit workflows turned the performance metrics into parametric Revit families: thermal, acoustic, and air KPIs as visible components of the model, exportable as RVT, IFC, or PDF.',
  tech: 'RHINO.INSIDE REVIT · GRASSHOPPER · SPECKLE',
  links: [
    {
      label: 'BLOG',
      href: 'https://blog.iaac.net/turning-data-into-geometry-rhino-inside-revit-workflows-for-modelling-documenting/',
    },
  ],
  // S2 fix round (2026-07-16, Emilie's gif-cover rule applied to all
  // stills): a slow zoom cut of the same workflow board; still at rest is
  // the board as before. Cover alt DRAFT pending her eye.
  image: {
    slug: 'data-geometry',
    name: 'workflow-cover',
    alt: 'The data team workflow drawing closer: Speckle model and parameter sheets flowing through Grasshopper into Revit',
  },
  // Created zoom cover: card face ONLY, never a deck page (Emilie's round-3
  // rule; the real workflow board remains the first deck page).
  coverMontage: true,

  what: (
    <>
      On Hyperbuilding 01, the Santiago megastructure studio, the data team does not generate
      architectural geometry, and that was the problem: if we do not produce geometry, how can
      our work be read spatially inside the model? We built Rhino.Inside Revit workflows that
      turn the studio’s performance metrics into parametric Revit families, so thermal comfort,
      acoustic impact, and air purification become visible components of the architecture. The
      same data team of three as The Lungs, shared end to end: María Sánchez Domínguez, Lakzhmy
      Mari Zaro, and me.
    </>
  ),
  why: (
    <>
      Numbers in a spreadsheet do not change a design meeting; geometry in the model does.
      Making the KPIs legible exactly where the architects already look closes the gap between
      analysis and decision.
    </>
  ),
  how: [
    <>Bring the studio’s models and KPI data together through Speckle.</>,
    <>
      Drive parametric Revit families from Grasshopper via Rhino.Inside, shared parameters
      carrying the analysis results into the model.
    </>,
    <>
      Automate the views, sheets, and filters, so the model documents itself as RVT, IFC, and
      PDF.
    </>,
  ],
  outcome: (
    <>
      The model ends up both design artifact and data visualization: the building’s performance
      indicators are components you can see, not rows you have to believe. The workflow carried
      across the studio’s teams through Speckle.
    </>
  ),
  showcaseDraft: false, // spine + credit row signed by Emilie (S4b gate, 2026-07-14)
}

export default dataGeometry
