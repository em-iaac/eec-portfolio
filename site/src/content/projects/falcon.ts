// P-121 · Falcon Square (practice). S2 fix round (2026-07-16): the second
// half of the Jemma split. MIDAN AL SAKR, the office’s Moujassam Watan
// competition entry for Al Khobar, Saudi Arabia.
// CREDIT (her LinkedIn record + her explicit confirmation): she LED the
// design from the first aircraft sketches to the proposal ("I was actually
// the one who started the sketches of turning the take-off of an airplane
// and this whole concept... I was part of everything from start to finish"),
// Rhino SubD + ArchViz; the office is the entrant. Role title: architectural
// designer. The office’s public project page anchors the links row.
// ALL COPY SIGNED by Emilie (S2 sign-off, 2026-07-17).
import type { ProjectMeta } from './types'

const falcon: ProjectMeta = {
  slug: 'falcon',
  title: 'Falcon Square',
  lens: 'practice',
  // AL KHOBAR CAME OUT (2026-08-12, the project-page audit): the dek below
  // already says "a monument for Al Khobar", so the meta line was printing the
  // place twice within 25mm of itself. The meta states the SETTING and nothing
  // else — where, with whom, when — which is the rule the other seven pages
  // were already following. Her role stays in the dek ("led from the first
  // sketch"), woven as an ordinary sentence, which is where the brief’s floor
  // puts a credit and why no page gains a PROJECT LEAD chip.
  meta: 'JEMMA CHIDIAC ARCHITECTS · 2022',
  myPart: 'I led the design from the first aircraft sketches to the proposal, as an architectural designer at Jemma Chidiac Architects.',
  dek: 'An aircraft’s takeoff lines become a steel falcon: a monument for Al Khobar, led from the first sketch.',
  dekSigned: true, // SIGNED by Emilie (S2 sign-off, 2026-07-17)
  question: "Can an airplane’s takeoff become a monument?",
  tech: 'RHINO · SUBD · ARCHVIZ',
  // THE BOOK (2026-08-11). Falcon joined this session as the second practice
  // page: Verve is delivery inside a big team, this one she led from the first
  // sketch, and a reader takes those as two different answers. PAGE TWO is
  // "her hand, then the geometry": both sketch sheets, then the wings pulled
  // apart and the plan they land in. The three 8000px process boards were left
  // out on purpose. Resolution is not their problem; their stage captions are
  // about half a percent of the image width, which lands near 1.8pt on paper,
  // so they can only work if one of them takes most of a page alone.
  spreadAssets: [{ slug: 'falcon', name: 'storm-takeoff-view' }],
  // INVERTED for print (Emilie, 2026-08-11). On screen these are white ink
  // flooded on black; on a page that is two large black rectangles, and an
  // office printer would hate them. Inverted they are what they always were,
  // pencil on paper with red annotations.
  // The captions are her signed alts with ONE clause changed, the one that
  // names a ground the printed version no longer has. draftCopy until signed.
  //
  // Her ruling: "1 · her hand, then the geometry". Already four, so nothing is
  // cut. At 1.36 the first sheet is the NARROWEST lead in the book (159mm),
  // which leaves the widest meta column of the eight: this is the one page
  // where the words sit properly beside the drawing rather than under it.
  // ⚠ THE MIRRORING BOARD LEADS (Emilie, 2026-08-14), and it is new to the book.
  // An 8001px process sheet that the SITE has never shown either, found while
  // looking for something to fill this page’s empty column.
  //
  // WHY IT EARNS THE LEAD. Falcon’s standfirst says the monument is "an
  // aircraft’s takeoff lines, mirrored twice into a steel falcon", and until now
  // NO IMAGE ON THE SPREAD SHOWED THAT. The sketches show her hand, the site
  // plan shows the result, the render shows the finished thing. This board shows
  // the move itself.
  //
  // ⚠ IT STAYS BLACK, and that knowingly reverses the reasoning three lines
  // below about the sketch sheets. They were inverted because a page carrying
  // TWO large black rectangles is hard on an office printer and unlike the
  // pencil drawings they really are. Her ruling: "I like the black as well, it
  // gives character." One black board against three white drawings is a
  // different proposition from a page of black, and it is her call.
  // It also keeps its own baked stage captions: at 185mm they land near 2.6pt,
  // so they read as texture in the graphic rather than as labels. Left alone at
  // her instruction to keep it as is.
  //
  // ⚠ THE EXPLODED AXO LEFT THE PAGE. At 101mm it was mostly white with thin red
  // slivers, and it was the only image here that is neither her hand nor the
  // finished thing.
  bookLead: {
    slug: 'falcon',
    name: 'process-01-mirroring',
    corner: 'top-bound',
    // draftCopy: restates the signed dek.
    caption: 'An aircraft takeoff line becoming the falcon',
  },
  bookRegister: [
    {
      slug: 'falcon',
      name: 'aircraft-anatomy-sketches',
      invert: true,
      caption:
        'Sketches studying aircraft anatomy: control surfaces, flaps and spoilers, and the pitch, roll and yaw axes',
    },
    {
      slug: 'falcon',
      name: 'takeoff-angle-sketches',
      invert: true,
      caption:
        "Sketches of jets and a takeoff diagram, tracing climb angles, flaps and slats that seed the monument’s lines",
    },
    { slug: 'falcon', name: 'site-plan' },
  ],
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
  showcaseDraft: false, // spine + credits + alts SIGNED by Emilie (S2 sign-off, 2026-07-17)
}

export default falcon
