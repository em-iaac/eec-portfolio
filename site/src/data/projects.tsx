// Hero-card copy is LOCKED (content/copy-draft.md, approved 2026-07-06):
// verbatim, no em dashes, defensible verbs only. The '{' separators are the
// approved em-dash replacements from the Session 1 scrub.
// Design & Practice + Explorations blurbs are Session 2 DRAFTS in her voice,
// pending Emilie's sign-off (flagged in the session wrap-up).
import type { ReactNode } from 'react'
import type { Lens } from '../components/Lens'

export interface Project {
  slug: string
  title: string
  lens: Lens
  meta: string
  award?: string
  blurb: ReactNode
  tech: string
  links: { label: string; href: string }[]
  // `position` = CSS object-position for the uniform 4:3 crop (escape hatch
  // when center-crop cuts the important part of a wide screenshot).
  image?: { slug: string; name: string; alt: string; position?: string }
  draftCopy?: boolean
}

export const HEROES: Project[] = [
  {
    slug: 'sensi',
    title: 'Sensi',
    lens: 'computation',
    meta: 'AIA STUDIO · GROUP',
    award: 'MACAD AWARDS 2026 · DESIGN COPILOTS · WINNER',
    blurb:
      "Comfort is usually the thing we hope shows up after the design is done. Sensi makes it a design layer: a copilot that reads your floor plan and scores it across six senses (thermal, visual, acoustic, spatial, olfactory, tactile), calibrated to a person, not an average. Because you don't walk into a room and average your experience; the thing that's wrong is the thing you notice.",
    tech: 'PYTHON · LANGGRAPH · FASTAPI · REACT',
    links: [
      { label: 'BLOG', href: 'https://blog.iaac.net/sensi-making-comfort-a-design-layer/' },
      { label: 'GITHUB', href: 'https://github.com/sclebow/AIA26_Studio/tree/main/team_02' },
    ],
    image: { slug: 'sensi', name: 'app-shape', alt: 'Sensi interface scoring a floor plan across six senses' },
  },
  {
    slug: 'neurospace',
    title: 'NeuroSpace',
    lens: 'computation',
    meta: 'CLOUD DATA MGMT · SOLO · LIVE APP',
    blurb:
      "You're sitting in a room right now, and its defaults are quietly shaping your cortisol, your circadian rhythm, your cognitive load. NeuroSpace makes those effects visible: move a slider, watch the score respond { Rhino.Compute geometry on the server, behavioral scoring live in the browser. It's BIM, reframed as Behavior Information Modeling.",
    tech: 'GRASSHOPPER · RHINO.COMPUTE · VUE 3 · THREE.JS',
    links: [
      { label: 'TRY IT LIVE', href: 'https://hi-em.github.io/neurospace' },
      { label: 'GITHUB', href: 'https://github.com/hi-em/neurospace' },
      { label: 'BLOG', href: 'https://blog.iaac.net/the-data-pipeline-behind-neurospace-from-sliders-to-synapses/' },
    ],
    image: { slug: 'neurospace', name: 'landing', alt: 'NeuroSpace landing page with parametric room and live scores' },
  },
  {
    slug: 'huddle',
    title: 'The Huddle',
    lens: 'computation',
    meta: 'ACESD STUDIO · GROUP',
    award: 'STUDIO AWARD',
    blurb:
      'In Punta Arenas the wind never stops, so we stopped fighting it. The Huddle aggregates 4×4×4 m modules along the wind itself: WASP grows the cluster, Kangaroo settles it, and a three-panel envelope (Shields, Lenses, Gills) turns the facade into a readable map of climatic forces.',
    tech: 'WASP · KANGAROO · ALPACA4D',
    links: [{ label: 'BLOG', href: 'https://blog.iaac.net/the-huddle-wind-adaptive-research-hub-in-punta-arenas-chile/' }],
    image: { slug: 'huddle', name: 'axonometric', alt: 'Axonometric of The Huddle wind-adaptive module cluster' },
  },
  {
    slug: 'lungs',
    title: 'The Lungs',
    lens: 'computation',
    meta: 'BIMSC STUDIO · GROUP · LIVE APP',
    award: 'STUDIO AWARD',
    blurb: (
      <>
        Santiago has an air problem, the kind that sits in the valley like a guest who won't leave. The Lungs is a
        hyperbuilding that filters 12 million m³ of air a year. We turned the studio itself into a web app, because the
        data <em>was</em> the architecture.
      </>
    ),
    tech: 'VUE 3 · VITE · TAILWIND · SPECKLE',
    links: [
      { label: 'LIVE APP', href: 'https://bimscstudiohb1-production.up.railway.app/' },
      { label: 'BLOG', href: 'https://blog.iaac.net/building-the-nervous-system-how-we-turned-a-hyper-building-studio-into-a-web-app/' },
    ],
    image: { slug: 'lungs', name: 'tower', alt: 'The Lungs hyperbuilding tower over Santiago' },
  },
  {
    slug: 'legoarch',
    title: 'lEgoarCh',
    lens: 'computation',
    meta: 'AIA GENERATIVE AI · WITH CHARLES ABI CHAHINE',
    award: 'JURY AWARD',
    blurb:
      'A render is a promise, not a product: you cannot snap a JPEG together on your living-room floor. lEgoarCh takes a text prompt and returns a LEGO set that actually builds { AI imagines it, deterministic code makes it buildable, brick by brick.',
    tech: 'FLUX.2 KLEIN · TRELLIS-2 · LORA · LDRAW',
    links: [
      { label: 'GITHUB', href: 'https://github.com/hi-em/genai-legoarch' },
      { label: 'BLOG', href: 'https://blog.iaac.net/legoarch-behind-the-sets/' },
    ],
    image: { slug: 'legoarch', name: 'sagrada-render', alt: 'lEgoarCh generated LEGO set of the Sagrada Familia' },
  },
  {
    slug: 'ballooning-market',
    title: 'A Ballooning Market',
    lens: 'computation',
    meta: 'COMPLEX FORMING · SOLO',
    blurb:
      'I decided to fill a historic Cairo market with balloons, and I almost failed: at first they had no physical awareness of each other, just ghosting through one another in a chaotic, colorful mess. Kangaroo gave them physics; pneumatic parasitism gave Bab al-Luq a new roof without touching its bones.',
    tech: 'GRASSHOPPER · KANGAROO · DENDRO · D5',
    links: [
      { label: 'BLOG', href: 'https://blog.iaac.net/a-ballooning-market-why-i-decided-to-fill-a-historic-market-with-balloons-and-how-i-almost-failed/' },
    ],
    image: { slug: 'ballooning-market', name: 'render-1', alt: 'CMY balloons packed into the steel frame of Bab al-Luq market' },
  },
  {
    slug: 'podcast',
    title: 'Optimizing for the Mind',
    lens: 'computation',
    meta: 'BIMSC THEORY · PODCAST · SPINE ORIGIN STORY',
    blurb: (
      <>
        The conversation with Dr. Cleo Valentine (Cambridge, architectural neuroimmunology) where Behavior Information
        Modeling was born. "There is no standard, anywhere in the world, that measures whether a building is good for
        your brain." We think there should be.
      </>
    ),
    tech: 'GENAI · GAME ENGINES · BIM',
    links: [
      { label: 'SPOTIFY', href: 'https://open.spotify.com/episode/6WpF5HmKteEBateSqSWe0D' },
      { label: 'BLOG', href: 'https://blog.iaac.net/optimizing-for-the-mind-integrating-generative-ai-and-game-engines-into-bim/' },
    ],
  },
]

export const PRACTICE: Project[] = [
  {
    slug: 'soma-towers',
    title: 'Towers at SOMA',
    lens: 'practice',
    meta: 'SOMA · DUBAI | BEIRUT · 2023-24',
    draftCopy: true,
    blurb:
      'Four towers between Dubai and Beirut: Verve at City Walk, Enara, Saria, District O. Facade and massing studies in Rhino and Grasshopper, carried into BIM for delivery. The years where I learned that a parametric study only matters if it survives contact with a drawing set.',
    tech: 'RHINO · GRASSHOPPER · REVIT',
    links: [],
    image: { slug: 'professional', name: 'citywalk', alt: 'City Walk tower facade study, Dubai' },
  },
  {
    slug: 'marsception',
    title: 'Rings of Mars: Ring 4000',
    lens: 'practice',
    meta: 'MARSCEPTION COMPETITION · SELF-EMPLOYED',
    award: 'TOP 50',
    draftCopy: true,
    blurb:
      'A habitat ring for Mars, designed with AI-driven workflows back when that still raised eyebrows. My first proof that generative tools and architecture could share a desk.',
    tech: 'AI WORKFLOWS · RHINO · V-RAY',
    links: [],
    image: { slug: 'professional', name: 'marsception', alt: 'Rings of Mars competition entry visualization' },
  },
]
// NOTE: Session 1 locked Design & Practice to Marsception + SOMA only.
// Dynamic Solution appears in the CV experience list, not the Work lens.

// The Home proof pair, per the Session 3 handoff (Site Home.dc.html): the
// SAME two heroes with the condensed locked card copy of the adjusted A-000.
// Full blurbs above remain the Notebook/archive versions.
export const HOME_FEATURED: Project[] = [
  {
    slug: 'sensi',
    title: 'Sensi',
    lens: 'computation',
    meta: 'MACAD AWARDS 2026 · WINNER',
    blurb:
      'Comfort is usually the thing we hope shows up after the design is done. Sensi makes it a design layer: a copilot that reads your floor plan and scores it across six senses (thermal, visual, acoustic, spatial, olfactory, tactile), calibrated to a person, not an average.',
    tech: 'PYTHON · LANGGRAPH · FASTAPI · REACT',
    links: [
      { label: 'BLOG', href: 'https://blog.iaac.net/sensi-making-comfort-a-design-layer/' },
      { label: 'GITHUB', href: 'https://github.com/sclebow/AIA26_Studio/tree/main/team_02' },
    ],
    image: { slug: 'sensi', name: 'app-shape', alt: 'Sensi interface scoring a floor plan across six senses' },
  },
  {
    slug: 'neurospace',
    title: 'NeuroSpace',
    lens: 'computation',
    meta: 'SOLO · LIVE APP',
    blurb:
      "You're sitting in a room right now, and its defaults are quietly shaping your cortisol, your circadian rhythm, your cognitive load. NeuroSpace makes those effects visible: move a slider, watch the score respond. It's BIM, reframed as Behavior Information Modeling.",
    tech: 'GRASSHOPPER · RHINO.COMPUTE · VUE 3 · THREE.JS',
    links: [
      { label: 'TRY IT LIVE', href: 'https://hi-em.github.io/neurospace' },
      { label: 'GITHUB', href: 'https://github.com/hi-em/neurospace' },
    ],
    image: { slug: 'neurospace', name: 'landing', alt: 'NeuroSpace landing page with parametric room and live scores' },
  },
]

export const EXPLORATIONS: Project[] = [
  {
    slug: 'cappelletti',
    title: 'Cappelletti Pavilion',
    lens: 'explorations',
    meta: 'STRUCTURAL OPTIMIZATION · WITH AHMAD BALTAJI',
    draftCopy: true,
    blurb:
      'Look closely at a piece of pasta: the curves and hollows are structural engineering in miniature. We scaled up dinner { evolutionary optimization and finite element analysis in Grasshopper brought a cappelletti shell to human scale at roughly 160 kg of material.',
    tech: 'GRASSHOPPER · GALAPAGOS · CRYSTALLON · ALPACA4D',
    links: [{ label: 'BLOG', href: 'https://blog.iaac.net/how-a-pasta-shape-became-a-pavilion-cappelletti/' }],
    image: { slug: 'cappelletti', name: 'poster', alt: 'Cappelletti Pavilion poster with pasta-derived shell structure' },
  },
  {
    slug: 'xr-lab',
    title: 'XR for Education',
    lens: 'explorations',
    meta: 'LAU XR LAB · RESEARCH ASSISTANT · 2021-23',
    draftCopy: true,
    blurb:
      'Point a phone at a molecule and watch the reaction happen in the room: AR chemistry lessons built at the LAU XR Lab, plus contributions to research on VR in education. Where the XR thread in my work started.',
    tech: 'AR · VR · 3D ANIMATION',
    links: [],
  },
]

// Registry joins: every project addressable by slug (Notebook + sheet stubs).
export const ALL_PROJECTS: Project[] = [...HEROES, ...PRACTICE, ...EXPLORATIONS]

export const PROJECTS_BY_SLUG: Record<string, Project> = Object.fromEntries(
  ALL_PROJECTS.map((p) => [p.slug, p]),
)
