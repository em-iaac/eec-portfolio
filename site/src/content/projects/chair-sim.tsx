// P-119 · Chair Simulation (explorations). MaCAD bootcamp mini (2025-11):
// Kangaroo inflation against sitting poses, then voxelation. Authored fresh
// from her boards + gifs at the S2 session, 2026-07-16. A LIGHT entry (D2):
// dek + question + a short WHAT/WHY, honestly thin.
// ALL COPY SIGNED by Emilie (S2 sign-off, 2026-07-17).
import type { ProjectMaster } from './types'

const chairSim: ProjectMaster = {
  slug: 'chair-sim',
  title: 'Chair Simulation',
  lens: 'explorations',
  meta: 'MACAD BOOTCAMP · SIMULATION',
  dek: 'Kangaroo inflates a pillow under eight sitting poses: every posture molds its own voxel chair.',
  dekSigned: true, // SIGNED by Emilie (S2 sign-off, 2026-07-17)
  question: 'Can your sitting posture design its own chair?',
  alsoAnswers: [
    { q: 'How does Kangaroo turn a body pose into furniture?', beat: 'what' },
    { q: 'What does voxelating a soft mesh buy you?', beat: 'what' },
    { q: 'Why simulate a chair instead of drawing one?', beat: 'why' },
    { q: 'What do the two dials, damping and voxel size, actually change?', beat: 'what' },
  ],
  blurb:
    'An inflatable pillow mesh meets a library of sitting poses in Kangaroo; the settled result is voxelated into a soft module chair. Eight poses, two dials, eight different chairs.',
  tech: 'GRASSHOPPER · KANGAROO · VOXELS',
  links: [],
  // S2 fix round cover: the voxel-sizes gif promoted per the gif-cover rule
  // (still = the fine grain pyramid); the matrix leads the strip.
  image: {
    slug: 'chair-sim',
    name: 'voxel-sizes',
    alt: 'The settled chair rebuilt at growing voxel sizes, from fine grain steps to chunky rubber ring modules',
  },

  what: (
    <>
      An inflatable pillow mesh and a set of sitting stance meshes go into Kangaroo: pressure
      goals inflate the pillow, collision with the pose shapes it, and the settled mesh is
      captured as the chair. A voxelation pass then rebuilds it from a soft rubber ring module,
      with damping and voxel size as the two dials. Eight poses in the matrix, eight different
      chairs.
    </>
  ),
  why: (
    <>
      Because the honest way to design for a body is to let the body push back. The simulation
      does the ergonomics; the voxels point it toward something you could assemble from one
      repeated module.
    </>
  ),
  showcaseDraft: false, // spine + credits + alts SIGNED by Emilie (S2 sign-off, 2026-07-17)
}

export default chairSim
