// P-116 · The Homage (explorations, Emilie's lens call at the S2 plan gate).
// Her LAU bachelor final-year thesis: adaptive reuse of Oscar Niemeyer's
// Rachid Karami International Fair in Tripoli. Authored fresh from her thesis
// boards (incoming/academic/lau/) at the S2 session, 2026-07-16.
// HONESTY CEILING (verified against the certificate on disk AND
// tamayouz-award.com, 2026-07-16): the recognition is Top 100 Architecture
// Graduation Projects 2023 (the public page's own stats: 422 teams and
// individuals, 141 universities, 36 countries), NEVER "winner".
// (The "1960 design" date in HOW narrates her own board's timeline strip;
// public histories date Niemeyer's commission 1962: hers to settle.)
// Supervisor Issam Barhouch credited (named on the public Tamayouz page).
// ALL COPY SIGNED by Emilie (S2 sign-off, 2026-07-17), the board-sourced
// facts reviewed by her (incl. the 1960 board date + the tech row).
import type { ProjectMeta } from './types'

const homage: ProjectMeta = {
  slug: 'homage',
  title: 'The Homage',
  lens: 'explorations',
  meta: 'LAU THESIS · TRIPOLI · 2023',
  myPart: 'My bachelor thesis at LAU, supervised by Issam Barhouch.',
  dek: 'A homage to Oscar Niemeyer’s unfinished fair in Tripoli: the housing bar brought back to life, past, present and future in one section.',
  dekSigned: true, // SIGNED by Emilie (S2 sign-off, 2026-07-17)
  // THE QUESTION (D4, S2 draft): search-shaped, the way someone would ask it.
  question: 'How do you revive an unfinished Niemeyer masterpiece?',
  award: 'TOP 100 @ TAMAYOUZ',
  tech: 'ADAPTIVE REUSE · COLLECTIVE HOUSING · EXHIBITION',
  links: [],
  // S2 fix round cover: the crossfade cut (still = the moonlit slab).
  image: {
    slug: 'homage',
    name: 'homage-cover',
    alt: 'The Homage at a glance: the moonlit housing bar, the dark fair with its one beam of light and the cutaway axonometric',
  },
  // Created crossfade cover: card face ONLY, never a deck page (Emilie's
  // round-3 rule: a cover I assembled is not an asset).
  coverMontage: true,
  showcaseDraft: false, // spine + credits + alts SIGNED by Emilie (S2 sign-off, 2026-07-17)
}

export default homage
