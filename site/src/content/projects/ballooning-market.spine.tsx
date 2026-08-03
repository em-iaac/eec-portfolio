// THE SPINE of ballooning-market: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of ballooning-market.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project's prose, not all 21. The meta half stays in
// ballooning-market.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import NB from '../../components/ui/NB'
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'How do you teach digital balloons that they exist?', beat: 'how' },
    { q: 'What turns a mess of balloons into a roof?', beat: 'what' },
    { q: 'Can pneumatic parasitism give a heritage building a third option?', beat: 'why' },
    { q: 'What do the epic fails teach that the final render hides?', beat: 'outcome' },
  ],
  what: (
    <>
      A historic Cairo market receives a new roof of pressure-packed balloons that borrows the
      existing steel frame without modifying it.
      <NB note="the frame is the client, the balloons are the tenants, the solver is the lease." />{' '}
      Each balloon is a Kangaroo body with collision, inflation, and anchor goals; the settled
      cluster is meshed with Dendro and lit through CMY membranes in D5.
    </>
  ),
  why: (
    <>
      A building like Bab al-Luq usually gets offered two futures: a museum piece that can never
      be touched, or a cold glass-and-steel box dropped in the middle and called modern.
      Pneumatic parasitism is the third option: a soft new life that hugs the old bones instead
      of replacing them.
    </>
  ),
  how: [
    <>Trace the frame of Bab al-Luq; mark the nodes that can host anchors.</>,
    <>Seed balloons in the volume; declare radii, no physics yet.</>,
    <>Add collision and inflation goals; anchor the cluster; let the solver settle.</>,
    <>Mesh the settled cluster with Dendro; render daylight through the CMY membranes in D5.</>,
  ],
  outcome: (
    <>
      The first run failed in an instructive way: the balloons had no physical awareness of each
      other, just ghosting through one another in a chaotic, colorful mess. The fail stayed in
      the record on purpose; people read honesty faster than polish. And the tuning became the
      craft: collision too low and they cuddle, too high and they panic. You tune it like a
      thermostat.
    </>
  ),
}

export default spine
