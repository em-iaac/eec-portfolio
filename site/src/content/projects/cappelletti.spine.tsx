// THE SPINE of cappelletti: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of cappelletti.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project's prose, not all 21. The meta half stays in
// cappelletti.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'Is a piece of pasta secretly a structure?', beat: 'what' },
    { q: 'What happens when you scale dinner up to architecture?', beat: 'how' },
    { q: 'Can evolutionary optimization turn pasta math into a standing shell?', beat: 'how' },
    { q: 'How much material does a pasta pavilion actually need?', beat: 'outcome' },
  ],
  what: (
    <>
      Look closely at a piece of pasta: the curves, ridges, and hollows are structural
      engineering in miniature. We scaled up dinner: the equations describing a cappelletti
      became a pavilion shell at human scale, in glass-reinforced recycled PET. A duo with Ahmad
      Baltaji, shared end to end.
    </>
  ),
  why: (
    <>
      If a simple pasta shape holds the code for a stable structure, what other everyday objects
      are hiding blueprints? The pavilion is the serious answer to a playful question.
    </>
  ),
  how: [
    <>Describe the cappelletti mathematically in Grasshopper, as equations rather than a mesh.</>,
    <>
      Let Galapagos run evolutionary optimization against finite element analysis in Alpaca4D:
      minimize material, keep the shell standing.
    </>,
    <>Lattice the surviving shell with Crystallon and detail it for fabrication.</>,
  ],
  outcome: (
    <>
      The optimization refused to pick one winner: it produced two distinct lattice topologies
      that both hold, at roughly 160 kg of material. Evolution, given a fair fitness function, is
      happy to disagree with itself.
    </>
  ),
}

export default spine
