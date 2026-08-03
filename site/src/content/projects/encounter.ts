// P-117 · The Encounter (practice). S2 fix round (2026-07-16): the Jemma
// internship year SPLIT into its two competitions at Emilie's call; her role
// title is ARCHITECTURAL DESIGNER (her LinkedIn record, her explicit
// correction of the CV's "Architectural Intern"; CV alignment routed to
// Phase 2). The Anfeh cemetery competition by Ctrl Act Design.
// HONESTY CEILING (certificate on disk): "Shortlisted as finalist", a
// recognition, never a win. Her part, in her words: concept support, the
// landscape planning, the trials for the tomb details, and rendering with
// the team. The FINALIST pill links the certificate raster (her call: no
// public results URL exists); the office's project page is in the links row.
// ALL COPY SIGNED by Emilie (S2 sign-off, 2026-07-17).
import type { ProjectMeta } from './types'

const encounter: ProjectMeta = {
  slug: 'encounter',
  title: 'The Encounter',
  lens: 'practice',
  meta: 'JEMMA CHIDIAC ARCHITECTS · ANFEH · 2022',
  myPart: 'Concept support, landscape planning, tomb detail trials, and renders, as an architectural designer at Jemma Chidiac Architects.',
  dek: 'A cemetery for Anfeh that rotates around life: planted tomb terraces circling a sunken court, shortlisted as finalist.',
  dekSigned: true, // SIGNED by Emilie (S2 sign-off, 2026-07-17)
  question: 'Can a cemetery be designed around life instead of loss?',
  award: 'FINALIST @ CTRL ACT DESIGN',
  // The face's short form (the full line truncated on 390px tiles); the
  // certificate's own words, never "won".
  awardShort: 'SHORTLISTED FINALIST',
  tech: 'SKETCHUP · AUTOCAD · PHOTOSHOP',
  links: [
    { label: 'JEMMA CHIDIAC · PROJECT', href: 'https://jemmachidiacarchitects.com/projects/anfeh-cemetery/' },
  ],
  image: {
    slug: 'encounter',
    name: 'encounter-cover',
    alt: 'The Encounter at a glance: the split bell tower, the tomb terraces from the air, the chapel light and the sunken court',
  },
  // Created crossfade cover: card face ONLY, never a deck page (Emilie's
  // round-3 rule: a cover I assembled is not an asset).
  coverMontage: true,
  showcaseDraft: false, // spine + credits + alts SIGNED by Emilie (S2 sign-off, 2026-07-17)
}

export default encounter
