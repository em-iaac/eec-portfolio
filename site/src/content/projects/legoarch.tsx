// P-106 · lEgoarCh. Card copy migrated verbatim from data/projects.tsx
// (dek signed 2026-07-10). Spine authored fresh from the public blog + repo.
// HONESTY rules bind hard here: the ceiling is "digitally verified buildable"
// (never claims physical assembly), and the "93% supported" pull-quote
// describes the instructive intermediate FAILURE: the fail is narrated
// WITHOUT its percentage and never as a result (the anti-claim ruling).
// Duo credit woven: built with Charles Abi Chahine, end to end as a pair.
// Spine prose is showcaseDraft until Emilie signs it (Section 14).
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
  stat: 'LORA · 40 IMAGES · 3 BENCHMARKS',
  draftCopy: true, // covers myPart only (approved live; Session 18 retires the flag)
  blurb:
    'A render is a promise, not a product: you cannot snap a JPEG together on your living-room floor. lEgoarCh takes a text prompt and returns a LEGO set that actually builds: AI imagines it, deterministic code makes it buildable, brick by brick.',
  tech: 'FLUX.2 KLEIN · TRELLIS-2 · LORA · LDRAW',
  links: [
    { label: 'GITHUB', href: 'https://github.com/hi-em/genai-legoarch' },
    { label: 'BLOG', href: 'https://blog.iaac.net/legoarch-behind-the-sets/' },
  ],
  image: { slug: 'legoarch', name: 'sagrada-render', alt: 'lEgoarCh generated LEGO set of the Sagrada Familia' },

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
  showcaseDraft: true,
}

export default legoarch
