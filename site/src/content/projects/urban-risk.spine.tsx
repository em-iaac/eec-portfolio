// THE SPINE of urban-risk: WHAT / WHY / HOW / WHAT CAME OF IT.
// Split out of urban-risk.tsx on 2026-08-03 (the phone pass). This module is
// LAZY: content/projects/index.ts reaches it through import.meta.glob, so a
// visitor downloads one project's prose, not all 21. The meta half stays in
// urban-risk.ts and is still statically barrelled, because the grid, the plate
// face, the CV line, headData and the OG card all need it synchronously.
import type { ProjectSpine } from './types'

const spine: ProjectSpine = {
  alsoAnswers: [
    { q: "Can you read a street's safety from a map?", beat: 'what' },
    { q: 'Does the shape of a street make it safe?', beat: 'why' },
    { q: 'How much does a map actually know about crime?', beat: 'outcome' },
    { q: 'What did 36,000 London street segments teach the model, and where did it stop learning?', beat: 'how' },
  ],
  what: (
    <>
      An applied machine-learning pipeline that classifies street segments into low, medium, and
      high risk from morphological features: connectivity, visibility, enclosure, proximity to
      transit. It trains on roughly 36,000 London street segments and stands on the urban safety
      literature, Jacobs to Space Syntax, encoded as measurable features. A team of four, all
      hands on everything: María Sánchez Domínguez, Charles Abi Chahine, Lakzhmy Mari Zaro, and
      me.
    </>
  ),
  why: (
    <>
      You cannot design collective efficacy, but you can design a street. If public map data
      carries any signal about safety, the people shaping streets should know how much, and how
      much is none.
    </>
  ),
  how: [
    <>
      Encode each street segment from OpenStreetMap into spatial features grounded in the safety
      literature.
    </>,
    <>
      Test the model family honestly: regressions, decision trees, random forests, clustering,
      and a Kohonen map, with SHAP explaining every prediction.
    </>,
    <>
      Wrap the pipeline in a usable assessment interface, so a neighborhood can be scored without
      opening a notebook.
    </>,
  ],
  outcome: (
    <>
      Spatial form alone predicts crime poorly; crime is social and economic before it is
      geometric. What the features do organize is coherent street typologies that transfer
      across cities. Being precise about where the uncertainty begins is the most honest
      contribution the project makes.
    </>
  ),
}

export default spine
