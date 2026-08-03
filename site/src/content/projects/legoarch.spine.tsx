// THE SPINE of legoarch: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of legoarch.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project's prose, not all 21. The meta half stays in
// legoarch.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'What does it take to turn a render into a parts list and a booklet?', beat: 'what' },
    { q: 'How do you verify an AI-generated LEGO design is actually buildable?', beat: 'how' },
    { q: 'What happens when a set comes back structurally sound but visually wrong?', beat: 'outcome' },
    { q: 'Can generative AI and deterministic code share one brick pipeline?', beat: 'why' },
  ],
  what: (
    <>
      A render is a promise, not a product: you cannot snap a JPEG together on your living-room
      floor. lEgoarCh takes a text prompt and returns a LEGO Architecture set that is digitally
      verified buildable: AI imagines it, deterministic code makes it snap together, brick by
      brick, out of real catalog parts. Built with Charles Abi Chahine, end to end as a pair.
    </>
  ),
  why: (
    <>
      The inspired gesture is cheap now; anyone can generate a thousand renders before lunch. The
      interesting problem moved to verification: what does it take to turn a generated image into
      something that provably holds together?
    </>
  ),
  how: [
    <>
      A LoRA tuned on a 40-image dataset teaches FLUX the LEGO Architecture look; the prompt
      becomes a styled render.
    </>,
    <>TRELLIS lifts the render into a 3D mesh, and the mesh is voxelized into brick space.</>,
    <>
      An optimizer places real catalog bricks into the voxels, enforcing connectivity, support,
      and perceptual color accuracy.
    </>,
    <>The set exports as LDraw, the format the brick world already speaks.</>,
  ],
  outcome: (
    <>
      The most instructive moment was a failure: an intermediate model came back connected and
      supported, yet not legible as architecture. Structurally sound and visually wrong is still
      wrong, so legibility joined the constraints. The final pipeline was benched on three
      buildings, and the jury gave it their award.
    </>
  ),
}

export default spine
