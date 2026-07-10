// P-103 · The Huddle. Card copy migrated verbatim from data/projects.tsx
// (dek signed 2026-07-10). The spine is authored fresh from the public blog
// post (content/blog-catalog.json): no sheet ever existed. Attribution woven
// per the Session 7 ruling: team of four, all hands on everything.
// Spine prose is showcaseDraft until Emilie signs it (Section 14).
import type { ProjectMaster } from './types'

const huddle: ProjectMaster = {
  slug: 'huddle',
  title: 'The Huddle',
  lens: 'computation',
  meta: 'MACAD STUDIO · TEAM OF 4',
  award: 'STUDIO AWARD',
  myPart: 'Team of four, all hands on everything.',
  dek: 'Stop fighting the wind and build with it: modules that grow along the gusts instead of bracing against them.',
  dekSigned: true,
  draftCopy: true, // covers myPart only (approved live; Session 18 retires the flag)
  blurb:
    'In Punta Arenas the wind never stops, so we stopped fighting it. The Huddle aggregates 4×4×4 m modules along the wind itself: WASP grows the cluster, Kangaroo settles it, and a three-panel envelope (Shields, Lenses, Gills) turns the facade into a readable map of climatic forces.',
  tech: 'WASP · KANGAROO · ALPACA4D',
  links: [{ label: 'BLOG', href: 'https://blog.iaac.net/the-huddle-wind-adaptive-research-hub-in-punta-arenas-chile/' }],
  image: { slug: 'huddle', name: 'axonometric', alt: 'Axonometric of The Huddle wind-adaptive module cluster' },

  what: (
    <>
      In Punta Arenas the wind never stops, so we stopped fighting it. The Huddle is a research
      and education hub grown from 4×4×4 m modules aggregated along the wind itself, wrapped in
      an envelope of three panel types (Shields, Lenses, Gills) that turns the facade into a
      readable map of climatic forces. A team of four, all hands on everything: María Sánchez
      Domínguez, Lakzhmy Mari Zaro, Charles Abi Chahine, and me.
    </>
  ),
  why: (
    <>
      Wind is the site's most abundant force, and the vernacular Kawesqar huts already knew what
      to do with it. Accepting the wind as a design partner, instead of a problem to brace
      against, turns the harshest constraint into the organizing logic of the whole building.
    </>
  ),
  how: [
    <>
      WASP grows the module cluster along the wind patterns, solar exposure, and program, the way
      the Kawesqar huts huddled.
    </>,
    <>Kangaroo settles the layout; Alpaca4D checks the structural behavior of the result.</>,
    <>
      A Global Index algorithm distributes the three envelope panels, so the facade reads the
      climate back to you.
    </>,
    <>
      Vertical turbines sit in the aggregation's own wind tunnels, harvesting the force the form
      was grown from.
    </>,
  ],
  outcome: (
    <>
      Because the building is an aggregation of known parts, the exact number of parts is known
      at any moment: the architecture stays buildable arithmetic, not a sculpture. Wind, once a
      problem, ends up the project's material.
    </>
  ),
  showcaseDraft: true,
}

export default huddle
