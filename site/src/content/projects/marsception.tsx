// P-109 · Rings of Mars: Ring 4000 (practice). Card copy migrated verbatim
// from data/projects.tsx (dek signed 2026-07-10). Duo credit per the public
// results page (dossier AWD-05): Charles Abi Chahine, Top 50 stands. A thin
// showcase on purpose: WHAT + WHY, honestly short.
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
import type { ProjectMaster } from './types'

const marsception: ProjectMaster = {
  slug: 'marsception',
  title: 'Rings of Mars: Ring 4000',
  lens: 'practice',
  meta: 'MARSCEPTION COMPETITION · WITH CHARLES ABI CHAHINE',
  dek: "An early bet that generative tools belonged on an architect's desk, back when that still raised eyebrows.",
  dekSigned: true,
  award: 'TOP 50',
  myPart: 'A two-person entry with Charles Abi Chahine.',
  blurb:
    'A habitat ring for Mars, designed with AI-driven workflows back when that still raised eyebrows. My first proof that generative tools and architecture could share a desk.',
  tech: 'AI WORKFLOWS · RHINO · V-RAY',
  links: [],
  // Alt enriched for context + keywords (S1 alt pass, DRAFT pending Emilie's
  // eye on the image): 80-140 chars, describes what is shown, no overclaim.
  image: { slug: 'professional', name: 'marsception', alt: 'Rings of Mars, Ring 4000: a white orbital ring form rendered on black, the Marsception competition entry' },

  what: (
    <>
      A habitat ring for Mars, designed with AI-driven workflows back when that still raised
      eyebrows. A two-person entry with Charles Abi Chahine; it placed in the competition's Top
      50.
    </>
  ),
  why: (
    <>
      My first proof that generative tools and architecture could share a desk. An early bet, and
      it aged well.
    </>
  ),
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default marsception
