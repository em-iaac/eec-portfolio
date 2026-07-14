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
  // THE QUESTION (D4): DEFERRED to the question-discovery session (Emilie,
  // 2026-07-13). Candidate parked: "Is a piece of pasta secretly a
  // structure?". The signed dek serves meanwhile.
  blurb:
    'Look closely at a piece of pasta: the curves and hollows are structural engineering in miniature. We scaled up dinner: evolutionary optimization and finite element analysis in Grasshopper brought a cappelletti shell to human scale at roughly 160 kg of material.',
  tech: 'GRASSHOPPER · GALAPAGOS · CRYSTALLON · ALPACA4D',
  links: [{ label: 'BLOG', href: 'https://blog.iaac.net/how-a-pasta-shape-became-a-pavilion-cappelletti/' }],
  image: { slug: 'cappelletti', name: 'poster', alt: 'Cappelletti Pavilion poster with pasta-derived shell structure' },

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
