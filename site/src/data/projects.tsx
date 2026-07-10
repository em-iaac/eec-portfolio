// Hero-card copy is LOCKED (content/copy-draft.md, approved 2026-07-06):
// verbatim, no em dashes, defensible verbs only. Session 4 retired the '{'
// em-dash stand-ins from the Session 1 scrub: running prose now uses ':' or
// '·' (punctuation-only change, words untouched; pending Emilie's sign-off).
// Design & Practice + Explorations blurbs are Session 2 DRAFTS in her voice,
// pending Emilie's sign-off (flagged in the session wrap-up).
// Session 7 (Attribution Day, 2026-07-07, Emilie present): meta rows reframed
// (IAAC course codes retired for MACAD + honest team credits), myPart + stat
// fields added per her live rulings. Blurbs untouched.
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
  // Session 7 (Attribution Day, 2026-07-07). Emilie's rulings:
  // `myPart` = the approved answer to "what was your slice" on group work.
  //   It NEVER renders as a labeled line (her call); Sessions 8-14 weave it
  //   into sheet prose as an ordinary sentence. Wording ceilings from the
  //   calibration dossier bind: no percentages, teammates credited by name.
  // `stat` = the card's one defensible number (mono, rendered by ProjectCard
  //   under the tech row). Minimal set only: a stat exists ONLY where the
  //   number is new evidence, never repeating one already in a locked blurb.
  myPart?: string
  stat?: string
  // R2 (WORK gallery). Emilie's rulings, 2026-07-09:
  // `dek` = the card's ONE authored "what it proves" line (a real field, never
  //   a mid-sentence clamp of the blurb). Her voice, no em dashes, defensible
  //   verbs. Every dek is freshly drafted and UNSIGNED: the WORK selector ships
  //   draftCopy: true for the card until she signs the wording (Section 14).
  // `pullQuote` = the listening member's hero line (the podcast has no photo,
  //   so a pull-quote leads its preview instead). Attribution woven, not labeled.
  dek?: string
  pullQuote?: { text: string; source: string }
  // DL-2 (glass re-skin, 2026-07-10). The card FACE carries the least:
  // `awardShort` = the corner pill's wording where the full `award` line is too
  //   long for a pill; the full recognition still renders verbatim in the
  //   preview. Wording is Emilie's to sign (drafted -> the DL-2 copy pass).
  // `dekSigned` = Emilie signed the dek wording in the DL-2 copy pass; absent
  //   or false keeps the WORK card shipping draftCopy: true (Section 14).
  //   All 11 deks + the podcast pull-quote usage were approved AS DRAFTED in
  //   the DL-2 sign-off (Emilie, in chat, 2026-07-10). A future dek starts unsigned.
  awardShort?: string
  dekSigned?: boolean
}

export const HEROES: Project[] = [
  {
    slug: 'sensi',
    title: 'Sensi',
    lens: 'computation',
    // Meta reframed Session 7 (course codes retired for recruiter-readable
    // MACAD + team credits, approved live 2026-07-07). Blurb stays locked.
    meta: 'MACAD STUDIO · TEAM OF 4',
    award: 'MACAD AWARDS 2026 · DESIGN COPILOTS · WINNER',
    // DL-2 corner pill: the full award line above is too long for the face;
    // wording approved by Emilie 2026-07-10 (the full line stays in the preview).
    awardShort: "MACAD '26 WINNER",
    dek: 'Comfort, designed on purpose: a copilot scores a plan across six senses, calibrated to a person, not an average.',
    dekSigned: true,
    // Ceiling locked in the dossier: project lead, team credited, no percentages.
    myPart: 'Project lead, A to Z. Built with a team of four.',
    stat: 'LLM BENCH · 2 PROVIDERS × 3 SCENES',
    draftCopy: true, // covers myPart only (approved live; Session 18 retires the flag)
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
    // No stat by ruling: the live app is stronger proof than any digit
    // (dossier NUM-10; no public defensible number exists).
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
  },
  {
    slug: 'huddle',
    title: 'The Huddle',
    lens: 'computation',
    meta: 'MACAD STUDIO · TEAM OF 4',
    award: 'STUDIO AWARD',
    myPart: 'Team of four, all hands on everything.',
    dek: 'Stop fighting the wind and build with it: modules that grow along the gusts instead of bracing against them.',
    dekSigned: true,
    draftCopy: true, // covers myPart only (approved live; Session 18 retires the flag)
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
    // DATA TEAM OF 3 is deliberate (her ruling): the app and blog are the
    // data team's work; 3 people did not design the whole hyperbuilding.
    meta: 'MACAD STUDIO · DATA TEAM OF 3 · LIVE APP',
    award: 'STUDIO AWARD',
    myPart: 'Data team of three: we built the app that ran the studio.',
    dek: "The studio's data was the architecture: a live app running a hyperbuilding designed to filter a city's air.",
    dekSigned: true,
    stat: 'TRACKED · 3 TEAMS × 10 WEEKS',
    blurb: (
      <>
        Santiago has an air problem, the kind that sits in the valley like a guest who won't leave. The Lungs is a
        hyperbuilding that filters 12 million m³ of air a year. We turned the studio itself into a web app, because the
        data <em>was</em> the architecture.
      </>
    ),
    tech: 'VUE 3 · VITE · TAILWIND · SPECKLE',
    // The cold-start label "LIVE APP · WAKES IN ~30S" is APPROVED (Session 11,
    // batch #1); free-tier Railway sleeps and the label says so. draftCopy
    // stays because it still guards the myPart line (Session 7, unsigned);
    // the blurb above stays locked.
    draftCopy: true,
    links: [
      { label: 'LIVE APP · WAKES IN ~30S', href: 'https://bimscstudiohb1-production.up.railway.app/' },
      { label: 'BLOG', href: 'https://blog.iaac.net/building-the-nervous-system-how-we-turned-a-hyper-building-studio-into-a-web-app/' },
    ],
    image: { slug: 'lungs', name: 'tower', alt: 'The Lungs hyperbuilding tower over Santiago' },
  },
  {
    slug: 'legoarch',
    title: 'lEgoarCh',
    lens: 'computation',
    meta: 'MACAD GENERATIVE AI · WITH CHARLES ABI CHAHINE',
    award: 'JURY AWARD',
    myPart: 'Built with Charles Abi Chahine, end to end as a pair.',
    dek: 'A render is only a promise until the bricks fit: AI imagines the set, code makes it actually buildable.',
    dekSigned: true,
    stat: 'LORA · 40 IMAGES · 3 BENCHMARKS',
    draftCopy: true, // covers myPart only (approved live; Session 18 retires the flag)
    blurb:
      'A render is a promise, not a product: you cannot snap a JPEG together on your living-room floor. lEgoarCh takes a text prompt and returns a LEGO set that actually builds: AI imagines it, deterministic code makes it buildable, brick by brick.',
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
    meta: 'MACAD · SOLO',
    dek: 'Physics is the difference between a mess and a roof: the balloons ghosted through each other until Kangaroo gave them awareness.',
    dekSigned: true,
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
    // Charles co-hosted: the meta row IS the attribution here (her ruling:
    // no separate myPart; SPINE ORIGIN STORY tag retired for row length).
    meta: 'MACAD PODCAST · CO-HOSTED WITH CHARLES ABI CHAHINE',
    dek: 'Where Behavior Information Modeling got its name: why no standard yet asks if a building is good for your brain.',
    dekSigned: true,
    // The listening member's hero: no photo, so a pull-quote leads its preview.
    // Verbatim from the episode with Dr. Cleo Valentine (Cambridge); the
    // pull-quote usage + source line approved by Emilie 2026-07-10 (DL-2).
    pullQuote: {
      text: 'There is no standard, anywhere in the world, that measures whether a building is good for your brain.',
      source: 'Dr. Cleo Valentine, Cambridge',
    },
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
    myPart: 'My part: facade and massing studies in Rhino and Grasshopper, carried into the BIM set.',
    dek: 'A parametric study only counts once it survives a drawing set: four towers carried from Grasshopper into BIM.',
    dekSigned: true,
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
    // Duo credit per the public results page (dossier AWD-05): the entry is
    // "Emilie Chidiac - Charles Abi Chahine". Solo framing retired Session 7.
    meta: 'MARSCEPTION COMPETITION · WITH CHARLES ABI CHAHINE',
    dek: "An early bet that generative tools belonged on an architect's desk, back when that still raised eyebrows.",
    dekSigned: true,
    award: 'TOP 50',
    myPart: 'A two-person entry with Charles Abi Chahine.',
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
    stat: 'LLM BENCH · 2 PROVIDERS × 3 SCENES',
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
    meta: 'MACAD STRUCTURAL OPTIMIZATION · WITH AHMAD BALTAJI',
    myPart: 'A duo with Ahmad Baltaji, shared end to end.',
    dek: 'A pasta shape is quietly structural: evolutionary optimization scaled a cappelletti shell to a 160 kg pavilion.',
    dekSigned: true,
    draftCopy: true,
    blurb:
      'Look closely at a piece of pasta: the curves and hollows are structural engineering in miniature. We scaled up dinner: evolutionary optimization and finite element analysis in Grasshopper brought a cappelletti shell to human scale at roughly 160 kg of material.',
    tech: 'GRASSHOPPER · GALAPAGOS · CRYSTALLON · ALPACA4D',
    links: [{ label: 'BLOG', href: 'https://blog.iaac.net/how-a-pasta-shape-became-a-pavilion-cappelletti/' }],
    image: { slug: 'cappelletti', name: 'poster', alt: 'Cappelletti Pavilion poster with pasta-derived shell structure' },
  },
  {
    slug: 'xr-lab',
    title: 'XR for Education',
    lens: 'explorations',
    meta: 'LAU XR LAB · RESEARCH ASSISTANT · 2021-23',
    dek: 'Where the XR thread started: point a phone at a molecule and watch it react in the room.',
    dekSigned: true,
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
