// P-120 · A Playscape (explorations). MaCAD bootcamp mini (2025-10, her
// folder name: "just for fun"): Kangaroo pressure mounds + two dropped nets.
// Authored fresh from her gifs + section at the S2 session, 2026-07-16. A
// LIGHT entry (D2): dek + question + a short WHAT/WHY, honestly thin.
// ALL COPY SIGNED by Emilie (S2 sign-off, 2026-07-17).
import type { ProjectMaster } from './types'

const playscape: ProjectMaster = {
  slug: 'playscape',
  title: 'A Playscape',
  lens: 'explorations',
  meta: 'MACAD BOOTCAMP · JUST FOR FUN',
  dek: 'Pressure goals inflate the mounds, two nets drop and settle on top: a playground form found in Kangaroo, just for fun.',
  dekSigned: true, // SIGNED by Emilie (S2 sign-off, 2026-07-17)
  question: 'What happens when you drop a climbing net on balloons?',
  alsoAnswers: [
    { q: 'How do you form find a playground in Kangaroo?', beat: 'what' },
    { q: 'Can pressure and gravity design something children would climb?', beat: 'why' },
    { q: 'What do the anchor and rotation dials change?', beat: 'what' },
    { q: 'Why build a playscape just for fun?', beat: 'why' },
  ],
  blurb:
    'Kangaroo pressure goals inflate five soft mounds; two climbing nets drop, catch and tension over them into a double layer canopy. A playground found by simulation, built just for fun.',
  tech: 'GRASSHOPPER · KANGAROO · PYTHON',
  links: [],
  image: {
    slug: 'playscape',
    name: 'net-settle',
    alt: 'The settled playscape at rest: a double layer climbing net draped by Kangaroo over soft red inflatable mounds',
  },

  what: (
    <>
      Python scripted base surfaces are meshed and inflated with Kangaroo pressure goals into
      five soft mounds; then two square rope nets drop in sequence, catch on the inflatables and
      tension into a double layer climbing canopy. Anchor heights and net rotation are the
      iteration dials; a section grounds it with padded floors and porthole openings for kids.
    </>
  ),
  why: (
    <>
      Just for fun, which is the honest reason. But play is a real structural brief: everything
      in the frame is form found, nothing is drawn by hand, and the section still reads like a
      place a kid would run to.
    </>
  ),
  showcaseDraft: false, // spine + credits + alts SIGNED by Emilie (S2 sign-off, 2026-07-17)
}

export default playscape
