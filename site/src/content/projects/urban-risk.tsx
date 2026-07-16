// P-113 · Encoding Urban Risk (S4b, 2026-07-14). Authored fresh from the
// public blog post (content/blog-catalog.json): no sheet ever existed.
// HONESTY (binding, session gate 2026-07-14): team of four, SHARED framing
// (Emilie declined an individual-slice line at the gate); applied,
// team-context ML, never ML-lead. The honest finding leads: spatial form
// alone predicts crime poorly, and the team says where certainty ends.
import type { ProjectMaster } from './types'

const urbanRisk: ProjectMaster = {
  slug: 'urban-risk',
  title: 'Encoding Urban Risk',
  lens: 'computation',
  // Emilie at the constellation gate (2026-07-14): "urban risk was a machine
  // learning project", so the credit row says so in standard vocabulary.
  meta: 'MACAD MACHINE LEARNING · TEAM OF 4',
  myPart: 'Team of four, all hands on everything.',
  dek: 'Street shape alone predicts crime poorly. Saying precisely where the certainty ends was the most honest thing the pipeline produced.',
  dekSigned: true, // Emilie, S4b copy gate, 2026-07-14
  // THE QUESTION (D4 round 2, Emilie's phrasing 2026-07-14: "can we predict
  // crime based on urban features? a machine learning test"). Honest by
  // construction: the page's answer is "poorly, and here is where certainty
  // ends". Team framing binds. Question + dot set SIGNED by Emilie (REINDEX batch D, 2026-07-16).
  question: 'Can we predict crime from urban features? A machine learning test.',
  alsoAnswers: [
    { q: "Can you read a street's safety from a map?", beat: 'what' },
    { q: 'Does the shape of a street make it safe?', beat: 'why' },
    { q: 'How much does a map actually know about crime?', beat: 'outcome' },
    { q: 'What did 36,000 London street segments teach the model, and where did it stop learning?', beat: 'how' },
  ],
  stat: 'TRAINED · ~36,000 STREET SEGMENTS',
  blurb:
    'A machine-learning pipeline that reads street segments from OpenStreetMap (connectivity, visibility, enclosure, transit) and sorts them into risk classes. Trained on roughly 36,000 London segments; the finding is that spatial form alone predicts crime poorly, and the team is explicit about where certainty ends.',
  tech: 'PYTHON · OPENSTREETMAP · RANDOM FOREST · SHAP',
  links: [{ label: 'BLOG', href: 'https://blog.iaac.net/encoding-urban-risk-spatial-feature-analysis-and-assessment/' }],
  image: {
    slug: 'urban-risk',
    name: 'assessment-ui',
    alt: "The team's street safety assessment interface scoring a neighborhood's segments from OpenStreetMap features",
  },

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
  showcaseDraft: false, // spine + credit row signed by Emilie (S4b gate, 2026-07-14)
}

export default urbanRisk
