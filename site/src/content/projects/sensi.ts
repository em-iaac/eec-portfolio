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
  // · LIVE APP left the meta STRING on 2026-08-20 (her ruling at the moving-
  // parts audit): the sheet's facts grid anchors this row to a TEAM label now,
  // and liveness is not a team fact — the pressable red ● LIVE APP one line
  // below carries it on screen. The BOOK keeps printing the full rail
  // (`liveApp` below; PrintBook appends · LIVE APP), because print has no
  // links row and the plate is its only liveness mention — which is exactly
  // why the segment joined on 2026-08-19 when Sensi moved to her own GitHub
  // and went up as a public demo.
  meta: 'MACAD STUDIO · TEAM OF 4',
  liveApp: true,
  award: 'MACAD AWARDS 2026 · DESIGN COPILOTS · WINNER',
  awardShort: "MACAD '26 WINNER",
  dek: 'Comfort, designed on purpose: a copilot scores a plan across six senses, calibrated to a person, not an average.',
  dekSigned: true,
  // THE QUESTION (D4 round 2, Emilie’s direction 2026-07-14): the lead is the
  // RIPPLE, the coupling of the senses, "understudied in the field" (her
  // words); the searchable people-question moved into alsoAnswers (the
  // question dot). Verb rule holds: score, never measure. Question + dot set SIGNED by Emilie (REINDEX batch A, 2026-07-16).
  question: 'When you fix one sense in a floor plan, what happens to the other five?',
  myPart: 'Project lead, A to Z. Built with a team of four.',
  stat: 'LLM BENCH · 2 PROVIDERS × 3 SCENES',
  tech: 'PYTHON · LANGGRAPH · FASTAPI · REACT',
  // SENSI MOVED HOUSE (2026-08-19). The code used to live in the studio's
  // shared repo, in a team folder under someone else's account
  // (sclebow/AIA26_Studio/tree/main/team_02) — an address that made the
  // project lead look like a contributor, and that she does not control. It
  // is her own repo now, and there is a public demo to press.
  // LIVE APP LEADS, and the label is the house's plain noun for a running
  // deployment — the same one The Lungs wears (her pick, 2026-08-19, over
  // LIVE DEMO and TRY IT LIVE). A verb-led label is spent only where a
  // caveat earns it, which is why NeuroSpace's says ALMOST.
  links: [
    { label: 'LIVE APP', href: 'https://sensi.emiliechidiac.com' },
    { label: 'BLOG', href: 'https://blog.iaac.net/sensi-making-comfort-a-design-layer/' },
    { label: 'GITHUB', href: 'https://github.com/hi-em/sensi' },
  ],
  // THE COVER = THE GALAXY (Emilie’s pick at the desk, 2026-07-14): the sense
  // constellation sits still on the card and ripples on hover, rhyming with
  // the landing mind-graph. app-shape moved into the flip-through.
  image: { slug: 'sensi', name: 'galaxy-cover', alt: "Sensi’s relationship galaxy: six senses as glowing constellations, every thread a coupling between two comfort scores" },
  // G5: the book spread’s dominant plate stays app-shape; scripts/
  // print-assets.mjs bakes the committed print-resolution rung.
  // A PLATE NEVER CROPS (Emilie, 2026-08-12). The plate box is 145 x 96mm,
  // aspect 1.51, and the app screenshot is 1.88ish, so `cover` pushed a fifth of it
  // past the trim. On Sensi that was the entire SENSES / CONFLICTS column,
  // which is the part that proves the tool scores anything.
  // Stretching was drawn and rejected on sight: at 24% horizontal distortion
  // the app’s circular score badges print as ovals.
  // THE IMAGE IS CENTRED, so the ground shows as an equal band above and below
  // (Emilie, 2026-08-12: anchored to the top it "looks wrong", and she is right,
  // a single band under a picture reads as a slip rather than as a frame).
  // That means the ground has to match BOTH edges. Sensi is the plate where it
  // can: measured, the top strip is #151515 and the bottom #110f0e, both nearly
  // flat (variation 6 and 15), so one colour between them disappears at each.
  // spreadFit left at round 2 (Emilie, 2026-08-19): the plate takes the
  // screenshot's own ~1.88 ratio now, so the hero fills with no ground.
  spreadAssets: [{ slug: 'sensi', name: 'app-shape' }],
  // THE BOOK’S PAGE TWO (Emilie, 2026-08-11): "the system, then the thing".
  // act-2-flow leads at full width because Sensi’s explanatory images are
  // dense with small type and stop being information below about 150mm; the
  // three app shots under it are the copilot asking who you are, scoring a
  // real plan, and handing the report back. coupling-map and sensory-layer
  // lost their seats to that width, and the three demo gifs are near
  // duplicates of stills already here.
  // Her ruling: "1 · the system, then the thing". The flowchart leads and the
  // three screens follow it. Nothing was cut here: Sensi already carried
  // exactly four, which is the ceiling the register arithmetic sets.
  // The flowchart is the widest lead in the book at 2.15, so it runs 210mm and
  // stands 98mm, and the meta sits in the 77mm of white beside it.
  bookLead: { slug: 'sensi', name: 'act-2-flow', corner: 'top-outer' },
  bookRegister: [
    { slug: 'sensi', name: 'onboarding' },
    { slug: 'sensi', name: 'green-lens' },
    { slug: 'sensi', name: 'report' },
  ],
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default sensi
