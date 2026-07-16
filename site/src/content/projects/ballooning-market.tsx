// P-104 · A Ballooning Market. Card copy migrated verbatim from
// data/projects.tsx (locked blurb; dek signed 2026-07-10). The spine is
// TRIMMED from the retired P-104 sheet: the solver-goals listing did not
// migrate (the blog tells the long version). The instructive fail stays
// filed as the outcome, on purpose.
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
import NB from '../../components/ui/NB'
import type { ProjectMaster } from './types'

const ballooningMarket: ProjectMaster = {
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
  alsoAnswers: [
    { q: 'How do you teach digital balloons that they exist?', beat: 'how' },
    { q: 'What turns a mess of balloons into a roof?', beat: 'what' },
    { q: 'Can pneumatic parasitism give a heritage building a third option?', beat: 'why' },
    { q: 'What do the epic fails teach that the final render hides?', beat: 'outcome' },
  ],
  blurb:
    'I decided to fill a historic Cairo market with balloons, and I almost failed: at first they had no physical awareness of each other, just ghosting through one another in a chaotic, colorful mess. Kangaroo gave them physics; pneumatic parasitism gave Bab al-Luq a new roof without touching its bones.',
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

  what: (
    <>
      A historic Cairo market receives a new roof of pressure-packed balloons that borrows the
      existing steel frame without modifying it.
      <NB note="the frame is the client, the balloons are the tenants, the solver is the lease." />{' '}
      Each balloon is a Kangaroo body with collision, inflation, and anchor goals; the settled
      cluster is meshed with Dendro and lit through CMY membranes in D5.
    </>
  ),
  why: (
    <>
      A building like Bab al-Luq usually gets offered two futures: a museum piece that can never
      be touched, or a cold glass-and-steel box dropped in the middle and called modern.
      Pneumatic parasitism is the third option: a soft new life that hugs the old bones instead
      of replacing them.
    </>
  ),
  how: [
    <>Trace the frame of Bab al-Luq; mark the nodes that can host anchors.</>,
    <>Seed balloons in the volume; declare radii, no physics yet.</>,
    <>Add collision and inflation goals; anchor the cluster; let the solver settle.</>,
    <>Mesh the settled cluster with Dendro; render daylight through the CMY membranes in D5.</>,
  ],
  outcome: (
    <>
      The first run failed in an instructive way: the balloons had no physical awareness of each
      other, just ghosting through one another in a chaotic, colorful mess. The fail stayed in
      the record on purpose; people read honesty faster than polish. And the tuning became the
      craft: collision too low and they cuddle, too high and they panic. You tune it like a
      thermostat.
    </>
  ),
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default ballooningMarket
