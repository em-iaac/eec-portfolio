// P-106 · lEgoarCh. Card copy migrated verbatim from data/projects.tsx
// (dek signed 2026-07-10). Spine authored fresh from the public blog + repo.
// HONESTY rules bind hard here: the ceiling is "digitally verified buildable"
// (never claims physical assembly), and the "93% supported" pull-quote
// describes the instructive intermediate FAILURE: the fail is narrated
// WITHOUT its percentage and never as a result (the anti-claim ruling).
// Duo credit woven: built with Charles Abi Chahine, end to end as a pair.
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
import type { ProjectMeta } from './types'

const legoarch: ProjectMeta = {
  slug: 'legoarch',
  title: 'lEgoarCh',
  lens: 'computation',
  meta: 'MACAD GENERATIVE AI · WITH CHARLES ABI CHAHINE',
  award: 'JURY AWARD',
  myPart: 'Built with Charles Abi Chahine, end to end as a pair.',
  dek: 'A render is only a promise until the bricks fit: AI imagines the set, code makes it actually buildable.',
  dekSigned: true,
  // THE QUESTION (D4 round 2, Emilie's direction 2026-07-14): her "how can AI
  // turn text into lego sets" shape. HONESTY: input is a TEXT prompt (her
  // "or images" trimmed: images are the pipeline's intermediate, not its
  // input); ceiling stays digitally verified buildable. Question + dot set SIGNED by Emilie (REINDEX batch A, 2026-07-16).
  question: 'How can AI turn a text prompt into a LEGO set that actually snaps together?',
  stat: 'LORA · 40 IMAGES · 3 BENCHMARKS',
  tech: 'FLUX.2 KLEIN · TRELLIS-2 · LORA · LDRAW',
  links: [
    { label: 'GITHUB', href: 'https://github.com/hi-em/genai-legoarch' },
    { label: 'BLOG', href: 'https://blog.iaac.net/legoarch-behind-the-sets/' },
  ],
  // THE COVER = THE SOLVE, ALIVE (Emilie's ask, 2026-07-15): Saint Basil's
  // solving into its brick layout, still at rest, playing on hover; cut from
  // her sfx demo recording inside the app frame. The golden Sagrada render
  // moved into the flip-through (and stays the book plate below).
  image: { slug: 'legoarch', name: 'demo-cover', alt: "Saint Basil's Cathedral solving into a brick layout in lEgoarCh, the stage with no AI in it on purpose" },
  // G5: the book spread's dominant plate (print-assets.mjs bakes the rung).
  spreadAssets: [{ slug: 'legoarch', name: 'sagrada-render' }],
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default legoarch
