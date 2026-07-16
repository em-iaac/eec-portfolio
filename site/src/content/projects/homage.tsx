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
// ALL COPY DRAFT: drafted from the boards in automode; Emilie corrects the
// facts and signs at the end-of-session review.
import type { ProjectMaster } from './types'

const homage: ProjectMaster = {
  slug: 'homage',
  title: 'The Homage',
  lens: 'explorations',
  meta: 'LAU THESIS · TRIPOLI · 2023',
  myPart: 'My bachelor thesis at LAU, supervised by Issam Barhouch.',
  dek: 'A homage to Oscar Niemeyer’s unfinished fair in Tripoli: the housing bar brought back to life, past, present and future in one section.',
  dekSigned: false,
  // THE QUESTION (D4, S2 draft): search-shaped, the way someone would ask it.
  question: 'How do you revive an unfinished Niemeyer masterpiece?',
  alsoAnswers: [
    { q: 'What could adaptive reuse do for the Rachid Karami Fair in Tripoli?', beat: 'what' },
    { q: 'Why does Tripoli need its third heart back?', beat: 'why' },
    { q: 'What is the Transfer Box?', beat: 'how' },
    { q: 'What came of a thesis about an unfinished fair?', beat: 'outcome' },
  ],
  award: 'TAMAYOUZ TOP 100',
  blurb:
    'My bachelor thesis at LAU: an adaptive reuse of Oscar Niemeyer’s unfinished Rachid Karami Fair in Tripoli. The surviving collective housing bar is re-inhabited as three homages, the past, the present and the future, threaded together by a rail mounted exhibition box. Selected among the Tamayouz Top 100 graduation projects of 2023.',
  tech: 'ADAPTIVE REUSE · COLLECTIVE HOUSING · EXHIBITION',
  links: [],
  image: {
    slug: 'homage',
    name: 'moonlit-slab',
    alt: 'Moonlit render of the renovated Niemeyer housing bar at the Tripoli fair, a lit interior glowing over the reflecting deck',
  },

  what: (
    <>
      My bachelor thesis at LAU, supervised by Issam Barhouch: an adaptive reuse of Oscar
      Niemeyer&rsquo;s Rachid Karami International Fair in Tripoli, the fairground left unfinished
      when Lebanon&rsquo;s war stopped the works. The intervention re-inhabits the remnants of his
      collective housing bar as three homages at once: the past kept in the original units, the
      present dug into sunken courts that hand the ground back to nature, and the future inserted
      as new unit typologies, workshops and an educational exhibition.
    </>
  ),
  why: (
    <>
      Niemeyer said Tripoli has two hearts, the old city and the port, and that the fair would
      become the third. Half a century later the third heart still is not beating. A homage, the
      thesis argues, is not a museum piece: it is the building lived in again.
    </>
  ),
  how: [
    <>
      Read the site through its own timeline: the 1960 design, decades of piecemeal
      interventions, then the two moves that matter, reconnecting the ground to nature and
      connecting past, present and future in one section.
    </>,
    <>
      Keep the old Niemeyer typology and insert three new unit types alongside it, studios,
      luxury units and affordable artisan apartments with their own workshop space, under planted
      roofs.
    </>,
    <>
      Invent the Transfer Box: a rail mounted glass container that moves materials and artworks
      through an underground gallery and doubles as a moving exhibition room.
    </>,
  ],
  outcome: (
    <>
      The Tamayouz Excellence Award panel selected The Homage among its Top 100 architecture
      graduation projects for 2023, out of 422 entries from 141 universities in 36 countries. It
      is also where this record starts: the first project that asked what a building owes the
      people, and the past, inside it.
    </>
  ),
  draftCopy: true,
  showcaseDraft: true, // S2 automode draft; Emilie reviews + signs at session end
}

export default homage
