// P-102 · NeuroSpace. Card copy migrated verbatim from data/projects.tsx
// (locked blurb; dek signed 2026-07-10). The spine is TRIMMED from the
// retired P-102 sheet (abstract / method / the honest part): the scoring
// listing did not migrate; the weights live in the public repo where anyone
// can argue with them. SOLO work, authorship woven as an ordinary sentence.
// Verb rule (dossier): NeuroSpace ESTIMATES and SCORES cortisol / circadian /
// cognitive-load effects, never MEASURES; no clinical claims. NO stat by
// ruling: the live app is the stronger proof than any digit.
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
import type { ProjectMeta } from './types'

const neurospace: ProjectMeta = {
  slug: 'neurospace',
  title: 'NeuroSpace',
  lens: 'computation',
  meta: 'MACAD · SOLO · LIVE APP',
  dek: 'Your room is doing something to you right now: move a slider and watch a browser score it live.',
  dekSigned: true,
  // THE QUESTION (D4 round 2, Emilie's direction 2026-07-14): visualize the
  // parameters + test the hypothesis. The QUESTION may ask "makes you feel"
  // (the locked hero asks the same); the TOOL's claim stays score/estimate in
  // the dek and spine, never measure. Question + dot set SIGNED by Emilie (REINDEX batch A, 2026-07-16).
  question: 'Can you visualize the parameters that affect how a room makes you feel?',
  tech: 'GRASSHOPPER · RHINO.COMPUTE · VUE 3 · THREE.JS',
  links: [
    // THE HONEST LABEL (2026-07-26). IAAC's Rhino Compute server is gone, so the
    // room geometry never renders: the sliders, the score and the report still
    // work because the scoring runs in the browser. The link stays, because the
    // working half is the interesting half, but nobody should click into a
    // half-broken demo unwarned. Emilie's voice for it ("maybe try it, almost").
    // CONSTRAINT: `live` must survive as a standalone word or the red liveness
    // dot in the links row (WorkOverlay's /\blive\b/i test) silently vanishes.
    { label: 'TRY IT LIVE, ALMOST · NO 3D', href: 'https://hi-em.github.io/neurospace' },
    { label: 'GITHUB', href: 'https://github.com/hi-em/neurospace' },
    { label: 'BLOG', href: 'https://blog.iaac.net/the-data-pipeline-behind-neurospace-from-sliders-to-synapses/' },
  ],
  // THE COVER = THE ROOM, ALIVE (Emilie's pick, 2026-07-15): a still of the
  // red parametric room at rest, morphing under a slider drag on hover; cut
  // from the demo recording inside the app frame (never the browser chrome).
  // The landing screenshot moved into the flip-through.
  image: { slug: 'neurospace', name: 'demo-cover', alt: 'The red parametric room of NeuroSpace mid-morph, the live NeuroScore answering a slider drag' },
  // G5: the book spread's dominant plate (print-assets.mjs bakes the rung).
  spreadAssets: [{ slug: 'neurospace', name: 'landing' }],
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default neurospace
