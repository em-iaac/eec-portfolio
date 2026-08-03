// THE SPINE of tsukiji: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of tsukiji.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project's prose, not all 21. The meta half stays in
// tsukiji.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'Can thermal, daylight, and wind simulation reshape a building form?', beat: 'what' },
    { q: "How do you keep 19 hectares of market comfortable in Tokyo's climate?", beat: 'why' },
    { q: 'What happens when the simulations say your polite fixes changed nothing?', beat: 'how' },
    { q: 'When does environmental analysis get to change the design, not just grade it?', beat: 'outcome' },
  ],
  what: (
    <>
      A computational environmental analysis of the proposed 19-hectare redevelopment of Tokyo’s
      Tsukiji fish market site. We simulated thermal comfort, daylight, wind, and heat mitigation
      under a climate that swings from wet and cold to hot and humid inside a single day. A team
      of four, all hands on everything: María Sánchez Domínguez, Charles Abi Chahine, Lakzhmy
      Mari Zaro, and me.
    </>
  ),
  why: (
    <>
      If it is hard to simply dress for Tokyo’s weather, imagine designing a 19-hectare venue for
      it. Environmental analysis is where a form’s good intentions meet a climate that does not
      care.
    </>
  ),
  how: [
    <>
      Model the site and venue in Rhino and run Ladybug and Infrared.City across thermal comfort,
      daylight, wind, and heat.
    </>,
    <>Test the starting hypothesis: that minor modifications to the original form would be enough.</>,
    <>
      When they were not, reshape the form itself, with Galapagos searching the roof geometry for
      a shape that performs.
    </>,
  ],
  outcome: (
    <>
      The simulations killed the polite version: minor modifications had minimal impact on
      environmental performance, so the massing changed. The honest lesson is that environmental
      analysis is a design partner, not a report you attach at the end.
    </>
  ),
}

export default spine
