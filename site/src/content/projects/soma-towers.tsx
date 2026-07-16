// P-108 · Towers at SOMA (practice). Card copy migrated verbatim from
// data/projects.tsx (dek signed 2026-07-10).
// S2 ENRICH (2026-07-16): the NDA on Verve City Walk imagery is LIFTED
// (Emilie, 2026-07-16), so the frozen old-site placeholder retires and the
// real SOMA portfolio material ships (cover + strip via the new `verve`
// slug), with the public developer + architect pages in the links row. Her
// role stays exactly ROL-02: design architect, facade + massing studies
// carried into the BIM set; the TG renders are the project's marketing
// imagery, never presented as personal renders. Spine was SIGNED at G4;
// the S2 additions re-flag it showcaseDraft pending her re-sign.
import type { ProjectMaster } from './types'

const somaTowers: ProjectMaster = {
  slug: 'soma-towers',
  title: 'Towers at SOMA',
  lens: 'practice',
  meta: 'SOMA · DUBAI | BEIRUT · 2023-24',
  myPart: 'My part: facade and massing studies in Rhino and Grasshopper, carried into the BIM set.',
  dek: 'A parametric study only counts once it survives a drawing set: four towers carried from Grasshopper into BIM.',
  dekSigned: true,
  // THE QUESTION (D4 round 2, Emilie 2026-07-14: "good", lead kept). This
  // spine is WHAT + WHY only, so the dot's beats stay within those. Question
  // + dot set SIGNED by Emilie (REINDEX batch C, 2026-07-16).
  question: 'What survives when a parametric study meets a real drawing set?',
  alsoAnswers: [
    { q: 'Does parametric design actually get built?', beat: 'what' },
    { q: 'What does it take to carry a Grasshopper facade study into BIM delivery?', beat: 'what' },
    { q: 'How does a facade study survive the door schedule?', beat: 'why' },
    { q: 'What did four towers teach about the distance between a definition and a drawing?', beat: 'why' },
  ],
  blurb:
    'Four towers between Dubai and Beirut: Verve at City Walk, Enara, Saria, District O. Facade and massing studies in Rhino and Grasshopper, carried into BIM for delivery. The years where I learned that a parametric study only matters if it survives contact with a drawing set.',
  tech: 'RHINO · GRASSHOPPER · REVIT',
  // The public anchors (NDA lifted): the developer's project page and SOMA's
  // own Verve City Walk page.
  links: [
    { label: 'MERAAS · VERVE', href: 'https://www.meraas.com/en/project/verve-city-walk' },
    { label: 'SOMA · VERVE', href: 'https://soma.us/verve-city-walk/' },
  ],
  // S2 cover: the real Verve dusk render (project imagery). Alt DRAFT.
  image: {
    slug: 'verve',
    name: 'dusk-facade',
    alt: 'Dusk render of the Verve facade above the fog, double height planted terraces with Burj Khalifa in the distance',
  },

  what: (
    <>
      Four towers between Dubai and Beirut: Verve at City Walk, Enara, Saria, District O. My part
      was the facade and massing studies in Rhino and Grasshopper, carried into the BIM set for
      delivery. Verve, the one shown here, is the two tower high-rise SOMA designed at City
      Walk in Dubai: a shared amenities podium under both towers, and balconies cut into the
      facade rather than hung off it.
    </>
  ),
  why: (
    <>
      These are the years where I learned that a parametric study only matters if it survives
      contact with a drawing set. Practice is where the elegant definition meets the door
      schedule, and both have to win.
    </>
  ),
  draftCopy: true,
  showcaseDraft: true, // S2 enrich: the Verve sentence + cover + links await Emilie's re-sign
}

export default somaTowers
