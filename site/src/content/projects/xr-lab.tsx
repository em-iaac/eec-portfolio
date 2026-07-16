// P-111 · XR for Education (explorations). Card copy migrated verbatim from
// data/projects.tsx (dek signed 2026-07-10).
// S2 ENRICH (2026-07-16): the quiet P-111 tile gains its first real cover +
// gallery from her LAU XR Lab research assets (incoming/academic/lau/
// xr-education/): a hover-play cut of the SN2 reaction render, the AR
// reactions board, and an SN1 before/after pair. Kept modest on purpose
// (she plans to expand this project later); the dead QR links never ship.
// HONESTY: the lab's workshop curriculum teaches Unity and C#; per the
// standing red line, no personal C# claim appears anywhere in this copy.
// EVIDENCE for "seven reaction models": the Chem101 reference PDF on disk
// (incoming/academic/lau/xr-education/) lists seven AR reactions (SN1, SN2,
// SN2 with energy, SN1/SN2/E1/E2 alcohol); the shipped board shows three.
// Spine was SIGNED at G4; the S2 sentence re-flags it pending her re-sign.
import type { ProjectMaster } from './types'

const xrLab: ProjectMaster = {
  slug: 'xr-lab',
  title: 'XR for Education',
  lens: 'explorations',
  meta: 'LAU XR LAB · RESEARCH ASSISTANT · 2021-23',
  dek: 'Where the XR thread started: point a phone at a molecule and watch it react in the room.',
  dekSigned: true,
  // THE QUESTION (D4 round 2, Emilie 2026-07-14: "this is about how XR and VR
  // can help in education"; she will expand this project eventually). The
  // question asks; the thin spine answers only from her lab years, no
  // measured-outcome claims. WHAT + WHY beats only. Question + dot set SIGNED by Emilie (REINDEX batch C, 2026-07-16).
  question: 'Can AR and VR change how we learn?',
  alsoAnswers: [
    { q: 'What if the lesson could stand in the room with you?', beat: 'what' },
    { q: 'Can a phone camera make a chemistry reaction visible?', beat: 'what' },
    { q: 'What changes when the molecule is in the room, not on the screen?', beat: 'why' },
    { q: 'How do you build an AR lesson a student can walk around?', beat: 'what' },
  ],
  blurb:
    'Point a phone at a molecule and watch the reaction happen in the room: AR chemistry lessons built at the LAU XR Lab, plus contributions to research on VR in education. Where the XR thread in my work started.',
  tech: 'AR · VR · 3D ANIMATION',
  links: [],
  // S2 cover: a hover-play cut of the SN2 reaction render (still at rest).
  image: {
    slug: 'xr',
    name: 'reaction-cover',
    alt: 'An SN2 reaction rendered for AR: the chloride ion leaves the molecule as methanol forms, ball and stick in grey space',
  },

  what: (
    <>
      Point a phone at a molecule and watch the reaction happen in the room: AR chemistry lessons
      built as a research assistant at the LAU XR Lab, plus contributions to research on VR in
      education. The chemistry set grew to seven reaction models students could summon through QR
      codes, each animated in ball and stick.
    </>
  ),
  why: (
    <>
      This is where the XR thread in my work started: the first time I watched a student
      understand something because the content stood in the room with them, not on a screen in
      front of them.
    </>
  ),
  draftCopy: true,
  showcaseDraft: true, // S2 enrich: the reactions sentence + cover await Emilie's re-sign
}

export default xrLab
