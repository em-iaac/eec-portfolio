// THE SPINE of soma-towers: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of soma-towers.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project’s prose, not all 21. The meta half stays in
// soma-towers.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: 'Does parametric design actually get built?', beat: 'what' },
    { q: 'What does it take to carry a Grasshopper facade study into BIM delivery?', beat: 'what' },
    { q: 'How does a facade study survive the door schedule?', beat: 'why' },
    { q: 'What did four towers teach about the distance between a definition and a drawing?', beat: 'why' },
  ],
  what: (
    <>
      Verve is a two-tower high-rise in Dubai: a shared amenities podium under both towers,
      balconies cut into the facade rather than hung off it. As a design architect at SOMA I ran
      the parametric facade studies in Rhino and Grasshopper, then carried what survived into
      the Revit model: floorplans, facade strategies, the interiors of a residential tower. The
      same desk carried District O, Enara and Saria from massing studies into their BIM sets.
    </>
  ),
  why: (
    <>
      These are the years when I learned that a parametric study only matters if it survives
      contact with a drawing set. Practice is where the elegant definition meets the door
      schedule, and both have to win.
    </>
  ),
  // ✔ SIGNED by Emilie, 2026-08-14. HOW and WHAT CAME OF IT were new to this
  // spine (it stopped at WHY, and the book’s project page renders all four
  // beats, so Verve could not hold a page without them). They went through three
  // versions and the last one is hers: the facts are her account of the actual
  // workflow, and the voice is the emilie-voice calibration rather than mine.
  // ⚠ REWRITTEN TWICE FROM HER OWN ACCOUNT (Emilie, 2026-08-12, then again on
  // 2026-08-14 through the emilie-voice skill). Round one replaced a draft that
  // was telling the wrong story: it had her inventing a facade rule that drove
  // the elevation and repeating the exercise on three more towers, where the
  // real shape is a PHASE HANDOVER and a delivery chain. Round two is the same
  // facts in her voice rather than in mine, with the vocabulary a BIM delivery
  // actually uses (design development, floor plates, families, MEP, submission)
  // and the joke she told me: at university nobody pays for the square metres,
  // so nobody counts them, and then suddenly GFA is the only number that
  // matters. That joke is doing real work in the outcome, not decorating it:
  // it is a self-correction about her own history, which is one of her moves.
  // Her workflow, verbatim, for anyone editing this later: "the massing would be
  // the actual workflow it turned out to be a different story: it had her
  // inventing a facade rule and three follow-on projects, where the real shape
  // is a PHASE HANDOVER (Rhino and Grasshopper for concept, Revit for
  // development) and a delivery that ends in VR rather than in a drawing set.
  // explored through rhino and grasshopper, once we got out of the concept phase
  // and into the development phase we would switch to revit and actually work on
  // the planning of the landscape and the interior typical plans of this luxury
  // tower, then from there we would coordinate with the visualization team to
  // prepare the revit families for that, also prepare 3d printing, vr set up
  // with unreal engine, and with other consultants to make sure everything was
  // up to date in the revit file as the final submission."
  // STILL draftCopy: this is my edit of her account, not her sentence.
  how: [
    <>
      Concept stays in Rhino and Grasshopper, where the massing can still change its mind:
      plot, podium, unit mix, all of it still cheap to move.
    </>,
    <>
      Design development, and everything moves into Revit: landscape planning, the typical
      floor plates, the interior layouts of a luxury tower. This is where gross floor area
      starts running the project.
    </>,
    <>
      Revit families built with the visualization team, and the same model going out three
      ways: 3D prints, renders, a VR walkthrough in Unreal.
    </>,
    <>
      Then every consultant back into the file, structure, MEP, facade, because the Revit model
      is the submission and it has to be true on the day it leaves.
    </>,
  ],
  // ✔ RE-SIGNED by Emilie, 2026-08-18 (the book audit): slimmed by a third, US
  // spelling per her ruling, the facade clause kept once (in WHAT), and the
  // slot now ends on the checkable headset day.
  outcome: (
    <>
      At university nobody pays for the square meters, so nobody counts them. Then you are in
      practice and gross floor area is the only number in the room: every balcony, every core
      shifted, every planted terrace, weighed against that one figure. I used to think that was
      the boring part. It turns out to be the part that decides what gets built. The proof of
      the coordination came the day a client put on a headset and walked a tower that did not
      exist yet.
    </>
  ),
}

export default spine
