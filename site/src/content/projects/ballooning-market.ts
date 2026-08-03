// P-104 · A Ballooning Market. Card copy migrated verbatim from
// data/projects.tsx (locked blurb; dek signed 2026-07-10). The spine is
// TRIMMED from the retired P-104 sheet: the solver-goals listing did not
// migrate (the blog tells the long version). The instructive fail stays
// filed as the outcome, on purpose.
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
import type { ProjectMeta } from './types'

const ballooningMarket: ProjectMeta = {
  slug: 'ballooning-market',
  title: 'A Ballooning Market',
  lens: 'computation',
  meta: 'MACAD · SOLO',
  dek: 'Physics is the difference between a mess and a roof: the balloons ghosted through each other until Kangaroo gave them awareness.',
  dekSigned: true,
  // THE QUESTION (D4 round 2, Emilie 2026-07-14: she hated the mess line as
  // lead, loved the touch-nothing and teach-balloons ones, asked for the
  // pneumatic-simulation register; fused below). Question + dot set SIGNED by Emilie (REINDEX batch C, 2026-07-16).
  question: 'Can balloons roof a historic market without touching it? A pneumatic simulation.',
  tech: 'GRASSHOPPER · KANGAROO · DENDRO · D5',
  links: [
    { label: 'BLOG', href: 'https://blog.iaac.net/a-ballooning-market-why-i-decided-to-fill-a-historic-market-with-balloons-and-how-i-almost-failed/' },
  ],
  // THE COVER = THE INFLATION, ALIVE (Emilie, 2026-07-15): the Kangaroo
  // process gif, still at rest, playing on hover; render-1 moved into the
  // strip and stays the book plate below.
  image: { slug: 'ballooning-market', name: 'process', alt: 'The Kangaroo inflation running: balloons seeding, anchoring and settling into a roof over Bab al-Luq market' },
  // G5: the book spread's dominant plate (print-assets.mjs bakes the rung).
  spreadAssets: [{ slug: 'ballooning-market', name: 'render-1' }],
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default ballooningMarket
