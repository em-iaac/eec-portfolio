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
  // THE QUESTION (D4): DEFERRED to the question-discovery session (Emilie,
  // 2026-07-13). Candidate parked: "What if the lesson could stand in the room
  // with you?". The signed dek serves meanwhile.
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
