// P-115 · Tsukiji Fish Market (S4b, 2026-07-14). Authored fresh from the
// public blog post (content/blog-catalog.json): no sheet ever existed.
// HONESTY (binding, session gate 2026-07-14): team of four, SHARED framing
// per Emilie's gate ruling. The instructive part leads: the polite tweaks
// changed nothing, so the form itself had to give.
import type { ProjectMaster } from './types'

const tsukiji: ProjectMaster = {
  slug: 'tsukiji',
  title: 'Tsukiji Fish Market',
  lens: 'computation',
  meta: 'MACAD ENVIRONMENTAL · TEAM OF 4',
  myPart: 'Team of four, all hands on everything.',
  dek: 'Tokyo’s climate stress-tested a 19-hectare market hall, and the polite tweaks changed nothing: the form itself had to give.',
  dekSigned: true, // Emilie, S4b copy gate, 2026-07-14
  // THE QUESTION (D4 round 2, Emilie 2026-07-14: "okay" to the fusion; the
  // field's name + her lunch line). Team framing binds. DRAFT until signed.
  question: 'Can environmental analysis keep up with weather that changes its mind by lunch?',
  alsoAnswers: [
    { q: 'Can thermal, daylight, and wind simulation reshape a building form?', beat: 'what' },
    { q: "How do you keep 19 hectares of market comfortable in Tokyo's climate?", beat: 'why' },
    { q: 'What happens when the simulations say your polite fixes changed nothing?', beat: 'how' },
    { q: 'When does environmental analysis get to change the design, not just grade it?', beat: 'outcome' },
  ],
  stat: 'SIMULATED · 19 HECTARES',
  blurb:
    'An environmental analysis of the Tsukiji fish market redevelopment: thermal comfort, daylight, wind, and heat under Tokyo’s swing-everything climate. The team’s first hypothesis, that minor modifications to the form would suffice, failed the simulations, so the building form itself was reshaped.',
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
  showcaseDraft: false, // spine + credit row signed by Emilie (S4b gate, 2026-07-14)
}

export default tsukiji
