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
  // THE QUESTION (D4 round 2, Emilie 2026-07-14: she hated the desk line;
  // "this is about how can we build in space? in mars?"). Duo credit binds in
  // the meta row and blurb; the question asks the object. WHAT + WHY spine
  // only, beats stay within those. DRAFT until signed.
  question: 'How do you design a habitat for Mars?',
  alsoAnswers: [
    { q: 'Could AI help design a Mars habitat, years before that was normal?', beat: 'what' },
    { q: 'What does a Mars habitat look like when you design it as a ring?', beat: 'what' },
    { q: 'How early is too early to bet on generative design?', beat: 'why' },
    { q: 'Could generative tools and architecture share a desk?', beat: 'why' },
  ],
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
