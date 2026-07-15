// P-106 · lEgoarCh. Card copy migrated verbatim from data/projects.tsx
// (dek signed 2026-07-10). Spine authored fresh from the public blog + repo.
// HONESTY rules bind hard here: the ceiling is "digitally verified buildable"
// (never claims physical assembly), and the "93% supported" pull-quote
// describes the instructive intermediate FAILURE: the fail is narrated
// WITHOUT its percentage and never as a result (the anti-claim ruling).
// Duo credit woven: built with Charles Abi Chahine, end to end as a pair.
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
import type { ProjectMaster } from './types'

const legoarch: ProjectMaster = {
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
  // input); ceiling stays digitally verified buildable. DRAFT until signed.
  question: 'How can AI turn a text prompt into a LEGO set that actually snaps together?',
  alsoAnswers: [
    { q: 'What does it take to turn a render into a parts list and a booklet?', beat: 'what' },
    { q: 'How do you verify an AI-generated LEGO design is actually buildable?', beat: 'how' },
    { q: 'What happens when a set comes back structurally sound but visually wrong?', beat: 'outcome' },
    { q: 'Can generative AI and deterministic code share one brick pipeline?', beat: 'why' },
  ],
  stat: 'LORA · 40 IMAGES · 3 BENCHMARKS',
  blurb:
    'A render is a promise, not a product: you cannot snap a JPEG together on your living-room floor. lEgoarCh takes a text prompt and returns a LEGO set that actually builds: AI imagines it, deterministic code makes it buildable, brick by brick.',
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

  what: (
    <>
      A render is a promise, not a product: you cannot snap a JPEG together on your living-room
      floor. lEgoarCh takes a text prompt and returns a LEGO Architecture set that is digitally
      verified buildable: AI imagines it, deterministic code makes it snap together, brick by
      brick, out of real catalog parts. Built with Charles Abi Chahine, end to end as a pair.
    </>
  ),
  why: (
    <>
      The inspired gesture is cheap now; anyone can generate a thousand renders before lunch. The
      interesting problem moved to verification: what does it take to turn a generated image into
      something that provably holds together?
    </>
  ),
  how: [
    <>
      A LoRA tuned on a 40-image dataset teaches FLUX the LEGO Architecture look; the prompt
      becomes a styled render.
    </>,
    <>TRELLIS lifts the render into a 3D mesh, and the mesh is voxelized into brick space.</>,
    <>
      An optimizer places real catalog bricks into the voxels, enforcing connectivity, support,
      and perceptual color accuracy.
    </>,
    <>The set exports as LDraw, the format the brick world already speaks.</>,
  ],
  outcome: (
    <>
      The most instructive moment was a failure: an intermediate model came back connected and
      supported, yet not legible as architecture. Structurally sound and visually wrong is still
      wrong, so legibility joined the constraints. The final pipeline was benched on three
      buildings, and the jury gave it their award.
    </>
  ),
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default legoarch
