// P-102 · NeuroSpace. Card copy migrated verbatim from data/projects.tsx
// (locked blurb; dek signed 2026-07-10). The spine is TRIMMED from the
// retired P-102 sheet (abstract / method / the honest part): the scoring
// listing did not migrate; the weights live in the public repo where anyone
// can argue with them. SOLO work, authorship woven as an ordinary sentence.
// Verb rule (dossier): NeuroSpace ESTIMATES and SCORES cortisol / circadian /
// cognitive-load effects, never MEASURES; no clinical claims. NO stat by
// ruling: the live app is the stronger proof than any digit.
// Spine prose SIGNED by Emilie (G4, 2026-07-12).
import NB from '../../components/ui/NB'
import type { ProjectMaster } from './types'

const neurospace: ProjectMaster = {
  slug: 'neurospace',
  title: 'NeuroSpace',
  lens: 'computation',
  meta: 'MACAD · SOLO · LIVE APP',
  dek: 'Your room is doing something to you right now: move a slider and watch a browser score it live.',
  dekSigned: true,
  blurb:
    "You're sitting in a room right now, and its defaults are quietly shaping your cortisol, your circadian rhythm, your cognitive load. NeuroSpace makes those effects visible: move a slider, watch the score respond · Rhino.Compute geometry on the server, behavioral scoring live in the browser. It's BIM, reframed as Behavior Information Modeling.",
  tech: 'GRASSHOPPER · RHINO.COMPUTE · VUE 3 · THREE.JS',
  links: [
    { label: 'TRY IT LIVE', href: 'https://hi-em.github.io/neurospace' },
    { label: 'GITHUB', href: 'https://github.com/hi-em/neurospace' },
    { label: 'BLOG', href: 'https://blog.iaac.net/the-data-pipeline-behind-neurospace-from-sliders-to-synapses/' },
  ],
  image: { slug: 'neurospace', name: 'landing', alt: 'NeuroSpace landing page with parametric room and live scores' },
  // G5: the book spread's dominant plate (print-assets.mjs bakes the rung).
  spreadAssets: [{ slug: 'neurospace', name: 'landing' }],

  what: (
    <>
      You are sitting in a room right now, and its defaults are quietly working on you: the
      ceiling height nudging your cortisol, the daylight setting your circadian clock. NeuroSpace
      makes that invisible layer legible: move a slider and the room rebuilds while a score
      answers back, live. I built it on my own: a Grasshopper definition doing the heavy geometry
      on the server through Rhino.Compute, Three.js drawing the room in the browser, and a
      scoring pass that estimates the behavioral effect the moment you let go.
    </>
  ),
  why: (
    <>
      This is the thesis I keep circling: BIM, reframed from Building Information Modeling to
      Behavior Information Modeling. The information that matters is not just what a building is
      made of; it is what the building is doing to the person inside it.
    </>
  ),
  how: [
    <>
      Describe the room as parameters, not geometry: ceiling height, wall count and curvature,
      openings, organic form, plants. Every one is a slider.
    </>,
    <>
      Send the parameters to a Grasshopper definition on the server; Rhino.Compute evaluates it
      and streams the heavy geometry back, so the browser never has to model anything itself.
    </>,
    <>
      Draw the returned room with Three.js. Geometry is the slow path; it only recomputes when
      the shape actually changes.
    </>,
    <>
      Score the behavior on the fast path, in the browser, the instant a slider settles: a
      transparent weighted sum over the dimensions the research cares about. No server round
      trip, so the number answers as fast as you can drag.
    </>,
  ],
  outcome: (
    <>
      The score is a heuristic, not an instrument. It leans on neuroarchitecture research and
      turns it into weights you can read in the public repo, which means you can also argue with
      them.
      <NB note="a score you can argue with beats a number you have to trust." /> It estimates; it
      never measures your body, and it shows every assumption on the way to the number so you are
      free to overrule it.
    </>
  ),
  showcaseDraft: false, // spine signed by Emilie (G4, 2026-07-12)
}

export default neurospace
