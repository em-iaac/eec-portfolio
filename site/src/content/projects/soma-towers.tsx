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
  blurb:
    'Four towers between Dubai and Beirut: Verve at City Walk, Enara, Saria, District O. Facade and massing studies in Rhino and Grasshopper, carried into BIM for delivery. The years where I learned that a parametric study only matters if it survives contact with a drawing set.',
  tech: 'RHINO · GRASSHOPPER · REVIT',
  links: [],
  image: { slug: 'professional', name: 'citywalk', alt: 'City Walk tower facade study, Dubai' },

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
