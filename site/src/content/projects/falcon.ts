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
import type { ProjectMeta } from './types'

const falcon: ProjectMeta = {
  slug: 'falcon',
  title: 'Falcon Square',
  lens: 'practice',
  meta: 'JEMMA CHIDIAC ARCHITECTS · AL KHOBAR · 2022',
  myPart: 'I led the design from the first aircraft sketches to the proposal, as an architectural designer at Jemma Chidiac Architects.',
  dek: 'An aircraft’s takeoff lines, mirrored twice into a steel falcon: a monument for Al Khobar, led from the first sketch.',
  dekSigned: true, // SIGNED by Emilie (S2 sign-off, 2026-07-17)
  question: "Can an airplane's takeoff become a monument?",
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
  showcaseDraft: false, // spine + credits + alts SIGNED by Emilie (S2 sign-off, 2026-07-17)
}

export default falcon
