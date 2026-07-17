// P-121 · Falcon Square (practice). S2 fix round (2026-07-16): the second
// half of the Jemma split. MIDAN AL SAKR, the office's Moujassam Watan
// competition entry for Al Khobar, Saudi Arabia.
// CREDIT (her LinkedIn record + her explicit confirmation): she LED the
// design from the first aircraft sketches to the proposal ("I was actually
// the one who started the sketches of turning the take-off of an airplane
// and this whole concept... I was part of everything from start to finish"),
// Rhino SubD + ArchViz; the office is the entrant. Role title: architectural
// designer. The office's public project page anchors the links row.
// ALL COPY SIGNED by Emilie (S2 sign-off, 2026-07-17).
import type { ProjectMaster } from './types'

const falcon: ProjectMaster = {
  slug: 'falcon',
  title: 'Falcon Square',
  lens: 'practice',
  meta: 'JEMMA CHIDIAC ARCHITECTS · AL KHOBAR · 2022',
  myPart: 'I led the design from the first aircraft sketches to the proposal, as an architectural designer at Jemma Chidiac Architects.',
  dek: 'An aircraft’s takeoff lines, mirrored twice into a steel falcon: a monument for Al Khobar, led from the first sketch.',
  dekSigned: true, // SIGNED by Emilie (S2 sign-off, 2026-07-17)
  question: "Can an airplane's takeoff become a monument?",
  alsoAnswers: [
    { q: 'What is MIDAN AL SAKR, the Falcon Square of Al Khobar?', beat: 'what' },
    { q: 'How do takeoff angles and control surfaces turn into wings?', beat: 'how' },
    { q: 'Why carry Arabic calligraphy on the wings?', beat: 'why' },
    { q: 'Where did the monument land?', beat: 'outcome' },
  ],
  blurb:
    'MIDAN AL SAKR, the office’s Moujassam Watan entry for a highway roundabout in Al Khobar: an aircraft’s takeoff line drawings, layered and mirrored twice, become a steel falcon whose wings carry pierced Arabic calligraphy. I started the sketches and led the design from brainstorming to the proposal, modeled in Rhino SubD and rendered for the animation set.',
  tech: 'RHINO · SUBD · ARCHVIZ',
  links: [
    { label: 'JEMMA CHIDIAC · PROJECT', href: 'https://jemmachidiacarchitects.com/projects/midan-chahine/' },
  ],
  // Round 3 cover: a 6s cut of HER teaser video (real footage, so it stays
  // a deck page; the earlier created crossfade retired per her rule).
  image: {
    slug: 'falcon',
    name: 'falcon-cover',
    alt: 'The falcon monument in motion: the camera pulls back from the copper calligraphy band to the whole roundabout at dusk',
  },

  what: (
    <>
      A monument for a highway roundabout in Al Khobar: MIDAN AL SAKR, the office&rsquo;s
      Moujassam Watan competition entry. Layered steel blades form a falcon about to take off,
      its two wings carrying pierced Arabic calligraphy over a roundabout re-landscaped in stone
      wedges, lawns and water. As an architectural designer at Jemma Chidiac Architects, I
      started the concept sketches and led the design from brainstorming to the proposal, with
      the model built in Rhino SubD and the visualizations and animations rendered in-house.
    </>
  ),
  why: (
    <>
      The concept began with my ink studies of an aircraft: takeoff angles, control surfaces,
      the lines a plane draws when it leaves the ground. Mirrored once, the drawings opened a
      void; mirrored again, they closed into a falcon, the national bird carrying the national
      script. A monument for a roundabout has one job, to be read at speed, and a takeoff line
      is the fastest line there is.
    </>
  ),
  how: [
    <>Sketch the aircraft in ink: takeoff pitches, primary and secondary control surfaces.</>,
    <>Layer the takeoff traces at different angles, then mirror the set twice, first opening a
      central void, then merging the drawings until no void is read.</>,
    <>Build the layered blades in Rhino SubD, thread the pierced calligraphy panels between
      them, and re-landscape the roundabout so the ground carries the bird.</>,
  ],
  outcome: (
    <>
      The proposal shipped as the office&rsquo;s competition entry and lives on the
      practice&rsquo;s site. The falcon stayed on the drawing board, which is where most
      competition monuments live; the sketches that started it are in the gallery.
    </>
  ),
  showcaseDraft: false, // spine + credits + alts SIGNED by Emilie (S2 sign-off, 2026-07-17)
}

export default falcon
