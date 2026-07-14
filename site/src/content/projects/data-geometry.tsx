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
  // THE QUESTION (D4): DEFERRED to the question-discovery session. Candidate
  // parked: "How does a spreadsheet become something you can stand inside?"
  // The dek serves meanwhile.
  blurb:
    'On Hyperbuilding 01, the data team’s numbers lived in spreadsheets while everyone else made form. Rhino.Inside Revit workflows turned the performance metrics into parametric Revit families: thermal, acoustic, and air KPIs as visible components of the model, exportable as RVT, IFC, or PDF.',
  tech: 'RHINO.INSIDE REVIT · GRASSHOPPER · SPECKLE',
  links: [
    {
      label: 'BLOG',
      href: 'https://blog.iaac.net/turning-data-into-geometry-rhino-inside-revit-workflows-for-modelling-documenting/',
    },
  ],
  image: {
    slug: 'data-geometry',
    name: 'workflow',
    alt: "The data team's workflow: a Speckle model and parameter sheets flowing through Grasshopper into versioned Revit models and IFC",
  },

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
