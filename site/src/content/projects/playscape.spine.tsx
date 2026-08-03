// THE SPINE of playscape: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of playscape.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project's prose, not all 21. The meta half stays in
// playscape.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'How do you form find a playground in Kangaroo?', beat: 'what' },
    { q: 'Can pressure and gravity design something children would climb?', beat: 'why' },
    { q: 'What do the anchor and rotation dials change?', beat: 'what' },
    { q: 'Why build a playscape just for fun?', beat: 'why' },
  ],
  what: (
    <>
      Python scripted base surfaces are meshed and inflated with Kangaroo pressure goals into
      five soft mounds; then two square rope nets drop in sequence, catch on the inflatables and
      tension into a double layer climbing canopy. Anchor heights and net rotation are the
      iteration dials; a section grounds it with padded floors and porthole openings for kids.
    </>
  ),
  why: (
    <>
      Just for fun, which is the honest reason. But play is a real structural brief: everything
      in the frame is form found, nothing is drawn by hand, and the section still reads like a
      place a kid would run to.
    </>
  ),
}

export default spine
