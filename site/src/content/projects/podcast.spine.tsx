// THE SPINE of podcast: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of podcast.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project's prose, not all 21. The meta half stays in
// podcast.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'Why does no building code ask whether a space is good for your brain?', beat: 'why' },
    { q: 'Where did Behavior Information Modeling come from?', beat: 'what' },
    { q: 'Is a facade a public health decision?', beat: 'why' },
    { q: 'What would it take for cognitive performance to become a building standard?', beat: 'why' },
  ],
  what: (
    <>
      A conversation with Dr. Cleo Valentine, a design researcher at HKS and affiliate lecturer at
      Cambridge who is building the field of architectural neuroimmunology, for the MaCAD Theory
      Podcast, co-hosted with Charles Abi Chahine. Her research studies how architectural geometry
      affects neuroinflammation and stress regulation; we asked what it would take for cognitive
      performance to become a building standard.
    </>
  ),
  why: (
    <>
      A facade is not just an aesthetic choice; it is a public health decision. Codes certify
      energy, fire, and structure, yet nothing certifies what a building does to your brain. We
      argued the field deserves a data layer for exactly that.
    </>
  ),
  outcome: (
    <>
      The layer needed a name, so we coined one on air: Behavior Information Modeling. Cleo's
      reply is the reason it stuck, "I hope that catches on because that's a really, really
      elegant and articulate way of describing what we're trying to do." It became the spine of
      my year; NeuroSpace demonstrates it live, Sensi turns it into a copilot, and the thesis
      keeps circling it.
    </>
  ),
}

export default spine
