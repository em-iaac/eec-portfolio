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
  // HOW + OUTCOME added 2026-08-21 (her ask: every spine carries all four
  // beats). Her account in the fill-the-spines interview: a real exploration
  // of the Kangaroo physics solver, multiple simulations in one loop
  // (collision, gravity, wind, force), and form finding as the word that
  // mattered.
  how: [
    <>
      Python scripts the base surfaces; Kangaroo pressure goals inflate them into five soft
      mounds.
    </>,
    <>
      Two square rope nets drop in sequence: gravity pulls, collision catches them on the
      inflatables, and they tension into a double layer climbing canopy.
    </>,
    <>
      Wind and force loads shake the settled state to see what holds; anchor heights and net
      rotation are the iteration dials.
    </>,
    <>A section grounds it: padded floors and porthole openings for kids.</>,
  ],
  outcome: (
    <>
      Form finding was the point, and it is the word that mattered: the geometry was never drawn,
      it was negotiated with a physics solver holding pressure, gravity, collision and wind in
      one loop until they agreed. Kangaroo stopped being a plugin and became a counterparty. The
      playground is the byproduct; what stayed is knowing how to ask a solver for a shape, and to
      take its refusals seriously.
    </>
  ),
}

export default spine
