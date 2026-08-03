// P-119 · Chair Simulation (explorations). MaCAD bootcamp mini (2025-11):
// Kangaroo inflation against sitting poses, then voxelation. Authored fresh
// from her boards + gifs at the S2 session, 2026-07-16. A LIGHT entry (D2):
// dek + question + a short WHAT/WHY, honestly thin.
// ALL COPY SIGNED by Emilie (S2 sign-off, 2026-07-17).
import type { ProjectMeta } from './types'

const chairSim: ProjectMeta = {
  slug: 'chair-sim',
  title: 'Chair Simulation',
  lens: 'explorations',
  meta: 'MACAD BOOTCAMP · SIMULATION',
  dek: 'Kangaroo inflates a pillow under eight sitting poses: every posture molds its own voxel chair.',
  dekSigned: true, // SIGNED by Emilie (S2 sign-off, 2026-07-17)
  question: 'Can your sitting posture design its own chair?',
  tech: 'GRASSHOPPER · KANGAROO · VOXELS',
  links: [],
  // S2 fix round cover: the voxel-sizes gif promoted per the gif-cover rule
  // (still = the fine grain pyramid); the matrix leads the strip.
  image: {
    slug: 'chair-sim',
    name: 'voxel-sizes',
    alt: 'The settled chair rebuilt at growing voxel sizes, from fine grain steps to chunky rubber ring modules',
  },
  showcaseDraft: false, // spine + credits + alts SIGNED by Emilie (S2 sign-off, 2026-07-17)
}

export default chairSim
