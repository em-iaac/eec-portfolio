// THE SPINE of sensi: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of sensi.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project’s prose, not all 21. The meta half stays in
// sensi.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import NB from '../../components/ui/NB'
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'Can a copilot score how a floor plan will feel, before anyone builds it?', beat: 'what' },
    { q: 'What does comfort look like when it is scored for you, not the average?', beat: 'why' },
    { q: 'Can AI read a floor plan and tell you where the comfort breaks?', beat: 'how' },
    { q: 'How do you bench an LLM’s judgment before trusting its comfort scores?', beat: 'outcome' },
  ],
  what: (
    <>
      Every tool in the stack could tell us how a building performs. None of them would say how a
      room feels. Sensi closes that gap: a copilot that reads a floor plan and scores comfort
      across six senses (thermal, visual, acoustic, spatial, olfactory, tactile), calibrated to
      one person at a time, not an average. It was prototyped first as an MCP tool, then rebuilt
      as a standalone app. Project lead, A to Z, built by a team of four: Lakzhmy Mari Zaro,
      María Sánchez Domínguez, Charles Abi Chahine and me.
    </>
  ),
  why: (
    <>
      Comfort is usually the thing we hope shows up after the design is done. I wanted it to be a
      layer you can interrogate while the plan is still soft, because you do not walk into a room
      and average your experience: the thing that is wrong is the thing you notice. And nothing
      you fix stays fixed alone: the whole project is the ripple, what a change drags along.
    </>
  ),
  how: [
    <>
      Onboarding calibrates the copilot to one person, their thermal grudges, their noise
      tolerance.
    </>,
    <>
      One action classifier, a single LLM call per turn, routes each request through a LangGraph
      state graph: analyze, edit, preview, audit.
    </>,
    <>
      A coupling matrix ripples every change into the neighboring senses, so a fix that quietly
      breaks another score gets flagged, not hidden.
      <NB note={'the six scores argue like a family. the coupling matrix is the dinner table.'} />
    </>,
    <>
      The copilot suggests edits the layout can absorb and previews them without committing: a
      vision model redraws the room’s atmosphere while keeping its structure, then hands over the
      comparison and the report.
    </>,
  ],
  outcome: (
    <>
      We benched the judgment before trusting it: two LLM providers scored the same three scenes
      end to end, including a living room arranged to fail. They mostly agreed, and it would have
      been easy to call that validation. We wrote agreement is not truth into the notes instead,
      and kept every disagreement as data.
    </>
  ),
}

export default spine
