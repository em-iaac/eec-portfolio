// THE SPINE of chair-sim: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of chair-sim.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project's prose, not all 21. The meta half stays in
// chair-sim.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'How does Kangaroo turn a body pose into furniture?', beat: 'what' },
    { q: 'What does voxelating a soft mesh buy you?', beat: 'what' },
    { q: 'Why simulate a chair instead of drawing one?', beat: 'why' },
    { q: 'What do the two dials, damping and voxel size, actually change?', beat: 'what' },
  ],
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
}

export default spine
