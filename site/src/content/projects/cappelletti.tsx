// P-110 · Cappelletti Pavilion (explorations). Card copy migrated verbatim
// from data/projects.tsx (dek signed 2026-07-10). Spine authored fresh from
// the public blog post. Duo credit woven: Ahmad Baltaji, shared end to end.
// Numbers per the dossier: ~160 kg and the two lattice topologies are the
// blog's own, nothing else claimed.
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
import type { ProjectMaster } from './types'

const cappelletti: ProjectMaster = {
  slug: 'cappelletti',
  title: 'Cappelletti Pavilion',
  lens: 'explorations',
  meta: 'MACAD STRUCTURAL OPTIMIZATION · WITH AHMAD BALTAJI',
  myPart: 'A duo with Ahmad Baltaji, shared end to end.',
  dek: 'A pasta shape is quietly structural: evolutionary optimization scaled a cappelletti shell to a 160 kg pavilion.',
  dekSigned: true,
  // THE QUESTION (D4 round 2, Emilie 2026-07-14: "good" to the pavilion
  // phrasing; aligns with the blog title that already ranks). Question + dot
  // set SIGNED by Emilie (REINDEX batch C, 2026-07-16).
  question: 'Can a pasta shape hold up a pavilion?',
  alsoAnswers: [
    { q: 'Is a piece of pasta secretly a structure?', beat: 'what' },
    { q: 'What happens when you scale dinner up to architecture?', beat: 'how' },
    { q: 'Can evolutionary optimization turn pasta math into a standing shell?', beat: 'how' },
    { q: 'How much material does a pasta pavilion actually need?', beat: 'outcome' },
  ],
  blurb:
    'Look closely at a piece of pasta: the curves and hollows are structural engineering in miniature. We scaled up dinner: evolutionary optimization and finite element analysis in Grasshopper brought a cappelletti shell to human scale at roughly 160 kg of material.',
  tech: 'GRASSHOPPER · GALAPAGOS · CRYSTALLON · ALPACA4D',
  links: [{ label: 'BLOG', href: 'https://blog.iaac.net/how-a-pasta-shape-became-a-pavilion-cappelletti/' }],
  // THE COVER = THE OPTIMIZATION, ALIVE (Emilie, 2026-07-15): the Galapagos
  // run gif, still at rest, playing on hover; the poster render moved into
  // the strip.
  image: { slug: 'cappelletti', name: 'galapagos-run', alt: "Galapagos optimization running live on the Cappelletti lattice, displacement traded against mass for the shell" },

  what: (
    <>
      Look closely at a piece of pasta: the curves, ridges, and hollows are structural
      engineering in miniature. We scaled up dinner: the equations describing a cappelletti
      became a pavilion shell at human scale, in glass-reinforced recycled PET. A duo with Ahmad
      Baltaji, shared end to end.
    </>
  ),
  why: (
    <>
      If a simple pasta shape holds the code for a stable structure, what other everyday objects
      are hiding blueprints? The pavilion is the serious answer to a playful question.
    </>
  ),
  how: [
    <>Describe the cappelletti mathematically in Grasshopper, as equations rather than a mesh.</>,
    <>
      Let Galapagos run evolutionary optimization against finite element analysis in Alpaca4D:
      minimize material, keep the shell standing.
    </>,
    <>Lattice the surviving shell with Crystallon and detail it for fabrication.</>,
  ],
  outcome: (
    <>
      The optimization refused to pick one winner: it produced two distinct lattice topologies
      that both hold, at roughly 160 kg of material. Evolution, given a fair fitness function, is
      happy to disagree with itself.
    </>
  ),
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default cappelletti
