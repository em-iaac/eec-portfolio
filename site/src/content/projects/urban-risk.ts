// P-113 · Encoding Urban Risk (S4b, 2026-07-14). Authored fresh from the
// public blog post (content/blog-catalog.json): no sheet ever existed.
// HONESTY (binding, session gate 2026-07-14): team of four, SHARED framing
// (Emilie declined an individual-slice line at the gate); applied,
// team-context ML, never ML-lead. The honest finding leads: spatial form
// alone predicts crime poorly, and the team says where certainty ends.
import type { ProjectMeta } from './types'

const urbanRisk: ProjectMeta = {
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
  stat: 'TRAINED · ~36,000 STREET SEGMENTS',
  tech: 'PYTHON · OPENSTREETMAP · RANDOM FOREST · SHAP',
  links: [{ label: 'BLOG', href: 'https://blog.iaac.net/encoding-urban-risk-spatial-feature-analysis-and-assessment/' }],
  image: {
    slug: 'urban-risk',
    name: 'assessment-ui',
    alt: "The team's street safety assessment interface scoring a neighborhood's segments from OpenStreetMap features",
  },
  showcaseDraft: false, // spine + credit row signed by Emilie (S4b gate, 2026-07-14)
}

export default urbanRisk
