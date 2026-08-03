// P-115 · Tsukiji Fish Market (S4b, 2026-07-14). Authored fresh from the
// public blog post (content/blog-catalog.json): no sheet ever existed.
// HONESTY (binding, session gate 2026-07-14): team of four, SHARED framing
// per Emilie's gate ruling. The instructive part leads: the polite tweaks
// changed nothing, so the form itself had to give.
import type { ProjectMeta } from './types'

const tsukiji: ProjectMeta = {
  slug: 'tsukiji',
  title: 'Tsukiji Fish Market',
  lens: 'computation',
  meta: 'MACAD ENVIRONMENTAL · TEAM OF 4',
  myPart: 'Team of four, all hands on everything.',
  dek: 'Tokyo’s climate stress-tested a 19-hectare market hall, and the polite tweaks changed nothing: the form itself had to give.',
  dekSigned: true, // Emilie, S4b copy gate, 2026-07-14
  // THE QUESTION (D4 round 2, Emilie 2026-07-14: "okay" to the fusion; the
  // field's name + her lunch line). Team framing binds. Question + dot set SIGNED by Emilie (REINDEX batch D, 2026-07-16).
  question: 'Can environmental analysis keep up with weather that changes its mind by lunch?',
  stat: 'SIMULATED · 19 HECTARES',
  tech: 'LADYBUG · INFRARED.CITY · GALAPAGOS',
  links: [
    {
      label: 'BLOG',
      href: 'https://blog.iaac.net/revitalizing-the-tsukiji-fish-market-an-environmental-analysis-of-tokyo/',
    },
  ],
  // THE COVER = THE FORM GIVING, ALIVE (Emilie, 2026-07-15): the design
  // exploration gif, still at rest, playing on hover; the site-maps board
  // moved into the strip.
  image: {
    slug: 'tsukiji',
    name: 'form-iterations',
    alt: 'Design exploration iterations reshaping the Tsukiji market hall after small tweaks barely moved environmental performance',
  },
  showcaseDraft: false, // spine + credit row signed by Emilie (S4b gate, 2026-07-14)
}

export default tsukiji
