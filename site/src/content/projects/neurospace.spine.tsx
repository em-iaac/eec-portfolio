// THE SPINE of neurospace: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of neurospace.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project’s prose, not all 21. The meta half stays in
// neurospace.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import NB from '../../components/ui/NB'
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: "What if a room could tell you what it’s doing to you, while you design it?", beat: 'what' },
    { q: 'Does ceiling height really change how stressed you are?', beat: 'how' },
    { q: 'Does the score prove the hypothesis, hand you a new one, or the opposite?', beat: 'outcome' },
    { q: 'What happens when BIM starts describing you instead of the building?', beat: 'why' },
  ],
  what: (
    <>
      You are sitting in a room right now, and its defaults are quietly working on you: the
      ceiling height nudging your cortisol, the daylight setting your circadian clock. NeuroSpace
      makes that invisible layer legible: move a slider and the room rebuilds while a score
      answers back, live. I built it on my own: a Grasshopper definition doing the heavy geometry
      on the server through Rhino.Compute, Three.js drawing the room in the browser, and a
      scoring pass that estimates the behavioral effect the moment you let go.
    </>
  ),
  why: (
    <>
      This is the thesis I keep circling: BIM, reframed from Building Information Modeling to
      Behavior Information Modeling. The information that matters is not just what a building is
      made of; it is what the building is doing to the person inside it.
    </>
  ),
  how: [
    <>
      Describe the room as parameters, not geometry: ceiling height, wall count and curvature,
      openings, organic form, plants. Every one is a slider.
    </>,
    <>
      Send the parameters to a Grasshopper definition on the server; Rhino.Compute evaluates it
      and streams the heavy geometry back, so the browser never has to model anything itself.
    </>,
    <>
      Draw the returned room with Three.js. Geometry is the slow path; it only recomputes when
      the shape actually changes.
    </>,
    <>
      Score the behavior on the fast path, in the browser, the instant a slider settles: a
      transparent weighted sum over the dimensions the research cares about. No server round
      trip, so the number answers as fast as you can drag.
    </>,
  ],
  // ✔ SIGNED by Emilie, 2026-08-18 (the book audit): the slot used to carry no
  // event at all; it now leads with the checkable and keeps every honesty line.
  outcome: (
    <>
      It shipped live: the app runs in the browser today, and the weights it scores with sit in
      the public repo, which means you can read them and argue with them.
      <NB note="a score you can argue with beats a number you have to trust." /> The score stays
      a heuristic, not an instrument. It estimates; it never measures your body, and it shows
      every assumption on the way to the number so you are free to overrule it.
    </>
  ),
}

export default spine
