// THE SPINE of xr-lab: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of xr-lab.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project's prose, not all 21. The meta half stays in
// xr-lab.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'What if the lesson could stand in the room with you?', beat: 'what' },
    { q: 'Can a phone camera make a chemistry reaction visible?', beat: 'what' },
    { q: 'How does a molecule get from Maya into a VR headset?', beat: 'how' },
    { q: 'Did the students actually engage more?', beat: 'outcome' },
  ],
  what: (
    <>
      Research assistant work at the LAU XR Lab, turning chemistry into something you can stand
      inside. We researched the reactions themselves to model them accurately, animated them in
      3ds Max and Maya, and shipped them two ways: as AR lessons a phone summons through QR
      codes, seven reaction models in the set, and as VR experiences built in Unity for Oculus
      headsets. I also contributed to the lab&rsquo;s research papers and documentation on XR in
      education.
    </>
  ),
  why: (
    <>
      Two questions drove the whole experiment. Chemistry students do not always have the best
      visualization skills, so how do you teach them something crucial and deeply technical in a
      visual way? And how do you turn a subject that reads as boring and technical into
      something immersive you can interact with?
    </>
  ),
  how: [
    <>Research each reaction until the chemistry is right, then model and animate it in 3ds Max
      and Maya.</>,
    <>Publish the animations as AR lessons behind QR codes, so the molecule appears in the room
      through a phone camera.</>,
    <>Import the models into Unity and build the VR versions for Oculus headsets, interactive
      and walkable.</>,
  ],
  outcome: (
    <>
      It stayed honestly experimental: the students we tested with were visibly more engaged,
      but the research never went deeper than those trials. I graduated and left the team, and
      the XR thread in my work starts here.
    </>
  ),
}

export default spine
