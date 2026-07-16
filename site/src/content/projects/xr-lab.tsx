// P-111 · XR for Education (explorations). Card copy migrated verbatim from
// data/projects.tsx (dek signed 2026-07-10). No public artifact exists
// (dossier), so this is the thinnest showcase on the site, on purpose:
// WHAT + WHY, no photo, no numbers, nothing padded.
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
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

  what: (
    <>
      Point a phone at a molecule and watch the reaction happen in the room: AR chemistry lessons
      built as a research assistant at the LAU XR Lab, plus contributions to research on VR in
      education.
    </>
  ),
  why: (
    <>
      This is where the XR thread in my work started: the first time I watched a student
      understand something because the content stood in the room with them, not on a screen in
      front of them.
    </>
  ),
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default xrLab
