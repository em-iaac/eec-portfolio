// P-108 · Verve City Walk (practice). S2 FIX ROUND (2026-07-16): retitled
// from "Towers at SOMA" at Emilie's call: Verve City Walk is the project's
// name; the entry id 'soma' and this file's slug stay (permanent URLs).
// Verve leads; District O, Enara and Saria stay woven with their public
// links (her pick at the gate). Responsibilities woven from her LinkedIn
// record (Design Architect, SOMA, Aug 2023 - Jul 2024: Rhino + Grasshopper
// design exploration and parametric facade studies; Revit BIM for
// floorplans, facade strategies and interior layouts of the residential
// towers). The TG renders are project marketing imagery, never personal
// renders; the NDA on Verve imagery was lifted 2026-07-16.
// ALL COPY DRAFT pending her re-sign (dek re-drafted for the rename).
import type { ProjectMaster } from './types'

const somaTowers: ProjectMaster = {
  slug: 'soma-towers',
  title: 'Verve City Walk',
  lens: 'practice',
  meta: 'SOMA · DESIGN ARCHITECT · 2023-24',
  myPart: 'Design architect at SOMA: parametric facade studies in Rhino and Grasshopper, carried into the Revit BIM set.',
  dek: 'Verve at City Walk, from parametric facade studies to the BIM set, with three more Dubai towers behind it.',
  dekSigned: true, // SIGNED by Emilie (S2 sign-off, 2026-07-17)
  // THE QUESTION (D4 round 2, Emilie 2026-07-14: "good", lead kept; still
  // true of the retitled entry). Question + dot set SIGNED by Emilie
  // (REINDEX batch C, 2026-07-16).
  question: 'What survives when a parametric study meets a real drawing set?',
  alsoAnswers: [
    { q: 'Does parametric design actually get built?', beat: 'what' },
    { q: 'What does it take to carry a Grasshopper facade study into BIM delivery?', beat: 'what' },
    { q: 'How does a facade study survive the door schedule?', beat: 'why' },
    { q: 'What did four towers teach about the distance between a definition and a drawing?', beat: 'why' },
  ],
  blurb:
    'Verve City Walk, the two tower high-rise SOMA designed in Dubai: design exploration and parametric facade studies in Rhino and Grasshopper, carried into the Revit BIM model for floorplans, facade strategies and interior layouts. Behind it, the same year carried District O, Enara and Saria from massing studies into BIM.',
  tech: 'RHINO · GRASSHOPPER · REVIT',
  // The public anchors (NDA lifted): the developer's page, SOMA's own
  // project pages, and the three sibling towers from the same year.
  links: [
    { label: 'VERVE @ MERAAS', href: 'https://www.meraas.com/en/project/verve-city-walk' },
    { label: 'VERVE @ SOMA', href: 'https://soma.us/verve-city-walk/' },
    { label: 'DISTRICT O @ SOMA', href: 'https://www.soma.us/district-o/p5y5k8ohl72r1mkk68pe5zxuikfcby' },
    { label: 'ENARA @ SOMA', href: 'https://www.soma.us/office-tower' },
    { label: 'SARIA @ BEYOND', href: 'https://beyonddevelopments.ae/en/new-launches/saria' },
  ],
  // S2 fix round cover: the interactive 3D unit selector capture (cropped to
  // the viewport; the sales platform's panel and watermark never ship).
  image: {
    slug: 'verve',
    name: 'unit-selector',
    alt: 'Screen capture of the interactive 3D unit selector orbiting the twin Verve towers, one unit footprint highlighted',
  },

  what: (
    <>
      Verve City Walk is the two tower high-rise SOMA designed at City Walk in Dubai: a shared
      amenities podium under both towers, balconies cut into the facade rather than hung off it.
      As a design architect at SOMA I ran design exploration and parametric facade studies in
      Rhino and Grasshopper, and carried them into the Revit BIM model for floorplans, facade
      strategies and interior layouts of the residential towers. The same year carried three
      more Dubai towers, District O, Enara and Saria, from massing studies into their BIM sets.
    </>
  ),
  why: (
    <>
      These are the years where I learned that a parametric study only matters if it survives
      contact with a drawing set. Practice is where the elegant definition meets the door
      schedule, and both have to win.
    </>
  ),
  showcaseDraft: false, // spine + credits + alts SIGNED by Emilie (S2 sign-off, 2026-07-17)
}

export default somaTowers
