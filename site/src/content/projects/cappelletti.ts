// P-110 · Cappelletti Pavilion (explorations). Card copy migrated verbatim
// from data/projects.tsx (dek signed 2026-07-10). Spine authored fresh from
// the public blog post. Duo credit woven: Ahmad Baltaji, shared end to end.
// Numbers per the dossier: ~160 kg and the two lattice topologies are the
// blog's own, nothing else claimed.
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
import type { ProjectMeta } from './types'

const cappelletti: ProjectMeta = {
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
  tech: 'GRASSHOPPER · GALAPAGOS · CRYSTALLON · ALPACA4D',
  links: [{ label: 'BLOG', href: 'https://blog.iaac.net/how-a-pasta-shape-became-a-pavilion-cappelletti/' }],
  // THE COVER = THE OPTIMIZATION, ALIVE (Emilie, 2026-07-15): the Galapagos
  // run gif, still at rest, playing on hover; the poster render moved into
  // the strip.
  image: { slug: 'cappelletti', name: 'galapagos-run', alt: "Galapagos optimization running live on the Cappelletti lattice, displacement traded against mass for the shell" },
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default cappelletti
