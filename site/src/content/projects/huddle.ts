// P-103 · The Huddle. Card copy migrated verbatim from data/projects.tsx
// (dek signed 2026-07-10). The spine is authored fresh from the public blog
// post (content/blog-catalog.json): no sheet ever existed. Attribution woven
// per the Session 7 ruling: team of four, all hands on everything.
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
import type { ProjectMeta } from './types'

const huddle: ProjectMeta = {
  slug: 'huddle',
  title: 'The Huddle',
  lens: 'computation',
  meta: 'MACAD STUDIO · TEAM OF 4',
  award: 'STUDIO AWARD',
  myPart: 'Team of four, all hands on everything.',
  dek: 'Stop fighting the wind and build with it: modules that grow along the gusts instead of bracing against them.',
  dekSigned: true,
  // THE QUESTION (D4 round 2, Emilie 2026-07-14: "okay", lead kept; team of
  // four, the question claims the idea, never an individual slice). The
  // alsoAnswers feed the question dot. Question + dot set SIGNED by Emilie (REINDEX batch B, 2026-07-16).
  question: 'What if you built with the wind instead of bracing against it?',
  tech: 'WASP · KANGAROO · ALPACA4D',
  links: [{ label: 'BLOG', href: 'https://blog.iaac.net/the-huddle-wind-adaptive-research-hub-in-punta-arenas-chile/' }],
  // THE COVER = THE GROWTH, ALIVE (Emilie, 2026-07-15): the WASP aggregation
  // gif, still at rest, playing on hover; axonometric moved into the strip
  // and stays the book plate below.
  image: { slug: 'huddle', name: 'wasp-growth', alt: 'Animated WASP growth study for The Huddle: modules aggregating along the wind across the Punta Arenas plot' },
  // G5: the book spread's dominant plate (print-assets.mjs bakes the rung).
  spreadAssets: [{ slug: 'huddle', name: 'axonometric' }],
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default huddle
