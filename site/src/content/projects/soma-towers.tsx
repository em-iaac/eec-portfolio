// P-108 · Towers at SOMA (practice). Card copy migrated verbatim from
// data/projects.tsx (dek signed 2026-07-10). A thin showcase ON PURPOSE:
// professional record, NDA check on imagery still open (dossier), so the
// spine is WHAT + WHY only, honestly short. myPart woven into WHAT.
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
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
  // spine is WHAT + WHY only, so the dot's beats stay within those. DRAFT
  // until signed.
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
  links: [],
  // Alt enriched for context + keywords (S1 alt pass, DRAFT pending Emilie's
  // eye on the image): 80-140 chars, describes the view, no overclaim.
  image: { slug: 'professional', name: 'citywalk', alt: 'Towers at SOMA: a dusk view of the City Walk high-rise cluster in Dubai, a facade and massing study' },

  what: (
    <>
      Four towers between Dubai and Beirut: Verve at City Walk, Enara, Saria, District O. My part
      was the facade and massing studies in Rhino and Grasshopper, carried into the BIM set for
      delivery.
    </>
  ),
  why: (
    <>
      These are the years where I learned that a parametric study only matters if it survives
      contact with a drawing set. Practice is where the elegant definition meets the door
      schedule, and both have to win.
    </>
  ),
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default somaTowers
