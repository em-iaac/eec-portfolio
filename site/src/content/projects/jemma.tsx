// P-117 · Competitions at Jemma Chidiac (practice). Her internship year in
// Beirut (CV of record: Architectural Intern, Jan-Aug 2022), authored fresh
// from the office archive (incoming/work/jemma-chidiac-office-work/) at the
// S2 session, 2026-07-16. Both competitions ship (Emilie's plan-gate answer).
// HONESTY CEILINGS (verified on disk, 2026-07-16): the Cemetery Challenge
// certificate reads "Shortlisted as finalist" (Ctrl Act Design), a
// RECOGNITION, never a win; the CV title "Architectural Intern" binds until
// Emilie retitles; her slice = pre-concept design (CV wording).
// ALL COPY DRAFT: automode; Emilie corrects facts + signs at the end review.
import type { ProjectMaster } from './types'

const jemma: ProjectMaster = {
  slug: 'jemma',
  title: 'Competitions at Jemma Chidiac',
  lens: 'practice',
  meta: 'JEMMA CHIDIAC ARCHITECTS · BEIRUT · 2022',
  myPart: 'An internship year at Jemma Chidiac Architects: pre-concept design on both entries.',
  dek: 'An internship year in Beirut, two competition entries: a cemetery that rotates around life, and a falcon built from takeoff lines.',
  dekSigned: false,
  // THE QUESTION (D4, S2 draft).
  question: 'What does an architecture internship actually produce?',
  alsoAnswers: [
    { q: 'Can a cemetery be designed around life instead of loss?', beat: 'what' },
    { q: 'How does an aircraft’s takeoff line become a monument?', beat: 'what' },
    { q: 'What do a cemetery and a national monument teach in one summer?', beat: 'why' },
    { q: 'What came of the two entries?', beat: 'outcome' },
  ],
  award: 'SHORTLISTED FINALIST',
  blurb:
    'Two competitions during an internship year at Jemma Chidiac Architects in Beirut. The Encounter terraces a cemetery for Anfeh in crescents of planted tombs around a sunken court, shortlisted as finalist at Ctrl Act Design’s Cemetery Challenge. Falcon Square, the office’s Moujassam Watan entry for Al Khobar, mirrors an aircraft’s takeoff lines into a steel falcon carrying pierced Arabic calligraphy.',
  tech: 'SKETCHUP · AUTOCAD · PHOTOSHOP',
  links: [],
  image: {
    slug: 'jemma',
    name: 'bell-tower',
    alt: 'Looking up at the split bell tower of the Anfeh cemetery chapel, two concrete blades carrying the bells and the cross',
  },

  what: (
    <>
      An internship year at Jemma Chidiac Architects in Beirut, spent largely on two competition
      entries; my part was pre-concept design on both. The Encounter, for Ctrl Act Design&rsquo;s
      Cemetery Challenge, terraces a cemetery for Anfeh in crescents of planted tombs rotating
      around a sunken court, so a visit circles life rather than loss. Falcon Square, the
      office&rsquo;s Moujassam Watan entry for Al Khobar, layers an aircraft&rsquo;s takeoff line
      drawings, mirrored twice, into a steel falcon whose wings carry pierced Arabic calligraphy.
    </>
  ),
  why: (
    <>
      An internship year teaches how an idea survives a deadline, an office and a jury. A
      cemetery and a national monument are about as different as two briefs get, and both had to
      land in the same summer.
    </>
  ),
  outcome: (
    <>
      The Encounter was shortlisted as finalist and the certificate of achievement carries my
      name. The falcon stayed on the drawing board, which is where most competition monuments
      live.
    </>
  ),
  draftCopy: true,
  showcaseDraft: true, // S2 automode draft; Emilie reviews + signs at session end
}

export default jemma
