// P-118 · Astroidal Ellipsoid (explorations). MaCAD bootcamp mini (seminar 3,
// 2025-10): the scripted-surface one-pager, authored fresh from her submission
// board at the S2 session, 2026-07-16. A LIGHT entry on purpose (D2): dek +
// question + a short WHAT/WHY, honestly thin, never dressed up as a hero.
// ALL COPY SIGNED by Emilie (S2 sign-off, 2026-07-17).
import type { ProjectMeta } from './types'

const astroidal: ProjectMeta = {
  slug: 'astroidal',
  title: 'Astroidal Ellipsoid',
  lens: 'explorations',
  meta: 'MACAD BOOTCAMP · SEMINAR 3',
  dek: 'Six coefficients, one scripted surface: an astroidal ellipsoid pushed until it can hold a floor plan.',
  dekSigned: true, // SIGNED by Emilie (S2 sign-off, 2026-07-17)
  question: 'Can a math equation become a building?',
  tech: 'GRASSHOPPER · PYTHON · NURBS',
  links: [],
  // S2 fix round cover: the three stars crossfade (still = star one).
  image: {
    slug: 'astroidal',
    name: 'star-cover',
    alt: 'The three astroidal ellipsoid stars in turn, the same equations wearing three different coefficient sets',
  },
  // Created crossfade cover: card face ONLY, never a deck page (Emilie's
  // round-3 rule: a cover I assembled is not an asset).
  coverMontage: true,
  // WHAT/WHY + credits + alts signed at S2 (2026-07-17); the HOW + OUTCOME
  // added 2026-08-21 from her interview (the function, the six dials, the
  // Cappelletti thread) await her read.
  showcaseDraft: true,
}

export default astroidal
