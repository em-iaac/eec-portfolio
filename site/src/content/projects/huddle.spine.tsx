// THE SPINE of huddle: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of huddle.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project’s prose, not all 21. The meta half stays in
// huddle.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'What does a building look like when the wind designs it with you?', beat: 'what' },
    { q: 'How do you design for a place where the wind never stops?', beat: 'why' },
    { q: 'What happens when wind patterns decide where the modules go?', beat: 'how' },
    { q: 'How does a facade become a readable map of climate?', beat: 'how' },
  ],
  what: (
    <>
      In Punta Arenas the wind never stops, so we stopped fighting it. The Huddle is a research
      and education hub grown from 4×4×4 m modules aggregated along the wind itself, wrapped in
      an envelope of three panel types (Shields, Lenses, Gills), each answering a different face
      of the weather. A team of four, all hands on everything: María Sánchez Domínguez, Lakzhmy
      Mari Zaro, Charles Abi Chahine and me.
    </>
  ),
  why: (
    <>
      Wind is the site’s most abundant force, and the vernacular Kawésqar huts already knew what
      to do with it. Accepting the wind as a design partner, instead of a problem to brace
      against, is the whole project: the harshest thing on the site becomes the thing that
      decides where everything goes.
    </>
  ),
  how: [
    <>
      WASP grows the module cluster along the wind patterns, solar exposure and program, the way
      the Kawésqar huts huddled.
    </>,
    <>Kangaroo settles the layout; Alpaca4D checks the structural behavior of the result.</>,
    <>
      A Global Index algorithm distributes the three envelope panels, so the facade reads the
      climate back to you.
    </>,
    <>
      Vertical turbines sit in the aggregation’s own wind tunnels, harvesting the force the form
      was grown from.
    </>,
  ],
  // The "bill of parts is exact at any moment" claim was CUT at the words pass
  // (2026-08-19): asked to stand behind it, she could not place it, and a claim
  // its author cannot explain does not ship. REDRAFTED next day at her note
  // ("less poetic, more technical and real"): the outcome is the change of
  // controls, physics placing the modules. The close is her own sentence.
  outcome: (
    <>
      Wind is physics, so the planning became physics too: collision and settling dictated the
      groupings, and no module was placed by hand. We controlled the aggregation by tuning the
      forces, which is the only way it did not control us.
    </>
  ),
}

export default spine
