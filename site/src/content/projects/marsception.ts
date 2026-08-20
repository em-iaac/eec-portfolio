// P-109 · Rings of Mars: Ring 4000 (practice). Duo credit per the public
// results page (dossier AWD-05): Charles Abi Chahine, Top 50 stands.
// S2 FIX ROUND (2026-07-16): full WHAT/WHY/HOW/OUTCOME authored from
// Emilie's own telling ("me and charles made some research about 3d printing
// on mars, and how the structure should be at a specific angle to not need
// support... we designed a ring because we wanted to take advantage of the
// craters... each crater would be a ring to create this future community...
// a mix of rhino modeling and generative ai tools at the early stages...
// a ring felt also suiting for the full ecosystem needed and to also
// include a transportation system") + her LinkedIn line (Rhino parametric,
// SubD, AI tools, V-Ray). Her flattened PSD renders joined the strip; the
// badge frame REMOVED at her call; the TOP 50 pill links her entry's
// gallery anchor on the public results page.
// ALL COPY SIGNED by Emilie (S2 sign-off, 2026-07-17).
import type { ProjectMeta } from './types'

const marsception: ProjectMeta = {
  slug: 'marsception',
  title: 'Rings of Mars: Ring 4000',
  lens: 'practice',
  meta: 'MARSCEPTION COMPETITION · WITH CHARLES ABI CHAHINE',
  dek: "An early bet that generative tools belonged on an architect's desk, back when that still raised eyebrows.",
  dekSigned: true,
  // THE QUESTION (D4 round 2, Emilie 2026-07-14: she hated the desk line;
  // "this is about how can we build in space? in mars?"). Duo credit binds in
  // the meta row and blurb; the question asks the object. Question + dot set
  // SIGNED by Emilie (REINDEX batch C, 2026-07-16); the S2 HOW/OUTCOME
  // beats SIGNED at the S2 sign-off, 2026-07-17.
  question: 'How do you design a habitat for Mars?',
  award: 'TOP 50 @ VOLUME ZERO',
  // Face form signed 2026-08-20 (moving-parts audit, second round): the full
  // line cut 13px on the 390 /work grid, and the first fix — swapping @ for a
  // middot — bought no width, so it still cut. The face carries the least:
  // TOP 50 alone. VOLUME ZERO stays on the sheet's full award line and
  // everywhere else the long form prints.
  awardShort: 'TOP 50',
  myPart: 'A two-person entry with Charles Abi Chahine.',
  tech: 'RHINO · SUBD · AI WORKFLOWS · V-RAY',
  links: [],
  // S2 cover: a crossfade cut of the crater hero, the farming interior, the
  // transfer box and the ring plan (mars-cover-web.webp, derived). Alt SIGNED 2026-07-17.
  image: {
    slug: 'mars',
    name: 'mars-cover',
    alt: 'Ring 4000 at a glance: the ring in its crater, the farming interior, the transfer box and the annotated ring plan',
  },
  // Created crossfade cover: card face ONLY, never a deck page (Emilie's
  // round-3 rule: a cover I assembled is not an asset).
  coverMontage: true,
  showcaseDraft: false, // spine + credits + alts SIGNED by Emilie (S2 sign-off, 2026-07-17)
}

export default marsception
