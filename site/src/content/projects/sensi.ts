// P-101 · Sensi. Card copy migrated verbatim from data/projects.tsx (locked
// blurb; dek + awardShort signed 2026-07-10). The spine is TRIMMED from the
// retired P-101 sheet (abstract / method / bench findings): listings and the
// cinema plates did not migrate; the code lives in the public repo, the long
// read on the blog. Attribution woven per the Session 7 ceiling: project
// lead, team credited, team of four, no percentages, never a labeled line.
// Verb rule: Sensi SCORES and ESTIMATES comfort, never measures.
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
import type { ProjectMeta } from './types'

const sensi: ProjectMeta = {
  slug: 'sensi',
  title: 'Sensi',
  lens: 'computation',
  meta: 'MACAD STUDIO · TEAM OF 4',
  award: 'MACAD AWARDS 2026 · DESIGN COPILOTS · WINNER',
  awardShort: "MACAD '26 WINNER",
  dek: 'Comfort, designed on purpose: a copilot scores a plan across six senses, calibrated to a person, not an average.',
  dekSigned: true,
  // THE QUESTION (D4 round 2, Emilie's direction 2026-07-14): the lead is the
  // RIPPLE, the coupling of the senses, "understudied in the field" (her
  // words); the searchable people-question moved into alsoAnswers (the
  // question dot). Verb rule holds: score, never measure. Question + dot set SIGNED by Emilie (REINDEX batch A, 2026-07-16).
  question: 'When you fix one sense in a floor plan, what happens to the other five?',
  myPart: 'Project lead, A to Z. Built with a team of four.',
  stat: 'LLM BENCH · 2 PROVIDERS × 3 SCENES',
  tech: 'PYTHON · LANGGRAPH · FASTAPI · REACT',
  links: [
    { label: 'BLOG', href: 'https://blog.iaac.net/sensi-making-comfort-a-design-layer/' },
    { label: 'GITHUB', href: 'https://github.com/sclebow/AIA26_Studio/tree/main/team_02' },
  ],
  // THE COVER = THE GALAXY (Emilie's pick at the desk, 2026-07-14): the sense
  // constellation sits still on the card and ripples on hover, rhyming with
  // the landing mind-graph. app-shape moved into the flip-through.
  image: { slug: 'sensi', name: 'galaxy-cover', alt: "Sensi's relationship galaxy: six senses as glowing constellations, every thread a coupling between two comfort scores" },
  // G5: the book spread's dominant plate stays app-shape; scripts/
  // print-assets.mjs bakes the committed print-resolution rung.
  spreadAssets: [{ slug: 'sensi', name: 'app-shape' }],
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default sensi
