// THE SPINE of lungs: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of lungs.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project’s prose, not all 21. The meta half stays in
// lungs.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'What if the data running a studio was the architecture?', beat: 'why' },
    { q: 'Can a web app run a ten-week studio without the spreadsheets?', beat: 'what' },
    { q: 'How do you put performance data on the geometry instead of beside it?', beat: 'how' },
    { q: 'What does it take to keep three design teams honest for ten weeks?', beat: 'outcome' },
  ],
  what: (
    <>
      Santiago has an air problem, the kind that sits in the valley like a guest who will not
      leave. The Lungs is a hyperbuilding designed to filter 12 million m³ of air a year, and the
      data team of three (María Sánchez Domínguez, Lakzhmy Mari Zaro and me) built the live web
      app the whole studio ran on while designing it.
    </>
  ),
  // ✔ SIGNED by Emilie, 2026-08-18 (the book audit). The WHY lost the dek’s
  // duplicate opening and "in the room"; HOW gained the stress game and lost
  // the second organ metaphor; the outcome ends on the checkable two doors,
  // which are her own facts from the signing interview.
  why: (
    <>
      Three design teams, ten weeks, one shared organism: somebody had to build its nervous
      system, and that turned out to be the most architectural thing we designed.
    </>
  ),
  how: [
    <>
      Build the platform in Vue 3, Vite and Tailwind: KPIs, team status and one timeline per
      team, so the overlaps show before they collide.
    </>,
    <>Stream the 3D models in through Speckle, so performance data sits on geometry, not beside it.</>,
    <>
      Keep it running while the studio designs on top of it: not documentation after the fact,
      the thing the studio ran on.
    </>,
    <>
      Score calm: a stress game the studio actually played, half telemetry (who is really using
      the app), half care (how everyone is holding up).
    </>,
  ],
  outcome: (
    <>
      The platform tracked three design teams across the full ten-week studio, and it is still
      live, with two doors: a public page where anyone can watch the tower’s data, and a
      managerial side behind IAAC emails. Building a platform alongside the project it supports
      is messy, the teams’ data outran the app more than once, and the mess is the lesson: the
      building breathes, so does the app.
    </>
  ),
}

export default spine
