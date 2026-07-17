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
import type { ProjectMaster } from './types'

const encounter: ProjectMaster = {
  slug: 'encounter',
  title: 'The Encounter',
  lens: 'practice',
  meta: 'JEMMA CHIDIAC ARCHITECTS · ANFEH · 2022',
  myPart: 'Concept support, landscape planning, tomb detail trials, and renders, as an architectural designer at Jemma Chidiac Architects.',
  dek: 'A cemetery for Anfeh that rotates around life: planted tomb terraces circling a sunken court, shortlisted as finalist.',
  dekSigned: true, // SIGNED by Emilie (S2 sign-off, 2026-07-17)
  question: 'Can a cemetery be designed around life instead of loss?',
  alsoAnswers: [
    { q: 'What is The Encounter in Anfeh?', beat: 'what' },
    { q: 'How do planted tomb roofs become a fifth facade?', beat: 'why' },
    { q: 'Why does a cemetery need an epicenter?', beat: 'why' },
    { q: 'What came of the Cemetery Challenge entry?', beat: 'outcome' },
  ],
  award: 'FINALIST @ CTRL ACT DESIGN',
  // The face's short form (the full line truncated on 390px tiles); the
  // certificate's own words, never "won".
  awardShort: 'SHORTLISTED FINALIST',
  blurb:
    'The Encounter, Jemma Chidiac Architects’ entry to Ctrl Act Design’s Cemetery Challenge: a cemetery for Anfeh terraced in crescents of planted tombs rotating around a sunken court, so a visit circles life rather than loss. Shortlisted as finalist; my part was concept support, landscape planning and the tomb detail trials, as an architectural designer at the practice.',
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

  what: (
    <>
      The Encounter, the practice&rsquo;s entry to Ctrl Act Design&rsquo;s Cemetery Challenge for
      Anfeh: concentric crescents of semi-buried, planted tombs rotating around a sunken court,
      with a slit-lit chapel, a condolences hall and a split bell tower crossing the terraces. As
      an architectural designer at Jemma Chidiac Architects, my part was concept support, the
      planning of the landscape, the trials for the tomb details, and rendering alongside the
      team.
    </>
  ),
  why: (
    <>
      The concept turns a cemetery toward the living: the visit circles an epicenter of life
      rather than a field of loss, and the tomb roofs are planted flowerbeds where visitors sow
      their own seeds, a fifth facade that slowly grows into a collective landscape echoing
      Anfeh&rsquo;s salt pans.
    </>
  ),
  outcome: (
    <>
      The entry was shortlisted as finalist and the certificate of achievement carries my name.
      The full project lives on the practice&rsquo;s site.
    </>
  ),
  showcaseDraft: false, // spine + credits + alts SIGNED by Emilie (S2 sign-off, 2026-07-17)
}

export default encounter
