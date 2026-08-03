// THE SPINE of encounter: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of encounter.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project's prose, not all 21. The meta half stays in
// encounter.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'What is The Encounter in Anfeh?', beat: 'what' },
    { q: 'How do planted tomb roofs become a fifth facade?', beat: 'why' },
    { q: 'Why does a cemetery need an epicenter?', beat: 'why' },
    { q: 'What came of the Cemetery Challenge entry?', beat: 'outcome' },
  ],
  what: (
    <>
      The Encounter, the practice&rsquo;s entry to Ctrl Act Design&rsquo;s Cemetery Challenge for
      Anfeh: concentric crescents of semi-buried, planted tombs rotating around a sunken court,
      with a slit-lit chapel, a condolences hall and a split bell tower crossing the terraces. As
      an architectural designer at Jemma Chidiac Architects, my part was concept support, the
      planning of the landscape, the trials for the tomb details, and rendering alongside the
      team.
    </>
  ),
  why: (
    <>
      The concept turns a cemetery toward the living: the visit circles an epicenter of life
      rather than a field of loss, and the tomb roofs are planted flowerbeds where visitors sow
      their own seeds, a fifth facade that slowly grows into a collective landscape echoing
      Anfeh&rsquo;s salt pans.
    </>
  ),
  outcome: (
    <>
      The entry was shortlisted as finalist and the certificate of achievement carries my name.
      The full project lives on the practice&rsquo;s site.
    </>
  ),
}

export default spine
