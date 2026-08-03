// THE SPINE of data-geometry: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of data-geometry.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project's prose, not all 21. The meta half stays in
// data-geometry.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'Can a KPI be a building component instead of a row you have to believe?', beat: 'what' },
    { q: 'What happens when the data team has to show up in the model?', beat: 'why' },
    { q: 'How do Rhino.Inside Revit workflows turn performance data into parametric families?', beat: 'how' },
    { q: 'How does analysis data stay visible all the way to RVT, IFC, and PDF?', beat: 'outcome' },
  ],
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
}

export default spine
