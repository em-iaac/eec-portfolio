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
  // THE QUESTION (D4): DEFERRED to the question-discovery session. Candidate
  // parked: "What does it take to design for weather that changes its mind by
  // lunch?" The dek serves meanwhile.
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
  image: {
    slug: 'tsukiji',
    name: 'site-maps',
    alt: 'The 19-hectare Tsukiji site in Tokyo: location maps, the nearest weather data hub and the 1979 land use plan',
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
