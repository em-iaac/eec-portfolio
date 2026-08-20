// THE REGISTRY · single source of truth for the research record.
// Every dated thing Emilie ships or thinks is ONE entry here; the CV career
// graph, the sheet routes, and the mind graph all read from this file.
// Adding a project = one entry + assets + (later) a sheet file.
//
// CONTRACT INVARIANTS:
// 1. `explore.order` equals the RAW index in
//    design_handoff_eec_portfolio/explore/data.js. The EXPLORE layout is a
//    seeded simulation (mulberry32(20260706)) that consumes nodes in order:
//    reordering or inserting SHIFTS EVERY WORD in the constellation. New
//    nodes append with the next order only.
// 2. Sheet numbers are owned here, never derived. (data.js derived
//    'N-'+(101+i), which would mislabel A Ballooning Market as N-106; the
//    locked number is P-104.)
// 3. Explore lens letters in data.js map c/p/e ->
//    computation/practice/explorations.
//
// `draftCopy: true` marks copy pending her sign-off. It renders normally but is
// greppable.
//
// `dateDraft` IS GONE (2026-08-06, the last pass before print). It marked months
// Emilie had not confirmed, and on 2026-08-06 she confirmed the last six: "all
// unconfirmed project dates are correct". The flag is DELETED rather than set
// false on every entry, because it was never a mechanism, only a note to self:
// it had ZERO consumers, so an unconfirmed month rendered pixel for pixel like a
// confirmed one on the map, in /work, in the head and in the book. A flag that
// changes nothing is a false comfort, and this pass is for removing those.
//
// If an unconfirmed date ever needs marking again, make it visible or make it
// fail a test. Do not reintroduce a silent boolean.
import type { Lens } from '../components/Lens'
import { NOW } from './now'

export type EntryKind =
  | 'sheet'
  | 'project'
  | 'thought'
  | 'milestone'
  | 'award'
  | 'talk'
  | 'press'
  | 'now'

export type SheetStatus = 'issued' | 'in-preparation'

export interface SheetRef {
  number: string
  status: SheetStatus
  route: string
}

// A thought's written note, analogous to a sheet (Session 11). `drafted` = a
// leaf exists at /thoughts/:id and every surface links to it; `absent` = the
// thought carries no note yet (renders as before, no link). The T-series
// number (Emilie's ruling 2026-07-08) rides the leaf's number cell.
export type NoteStatus = 'drafted' | 'absent'

export interface NoteRef {
  number?: string
  status: NoteStatus
  route: string
}

export interface ExploreRef {
  label: string
  nodeKind: 'project' | 'thought'
  order: number
  // Session 12 relic: nothing consumes this since the EXPLORE constellation
  // retired (verified S4b, 2026-07-14). An appended node connects on the
  // landing by riding a thread instead: give it a GEOM entry in
  // landing/mindGraph.ts via the append recipe there (thread + arc-length t).
  standalone?: boolean
}

export interface RegistryEntry {
  id: string // project/thought ids MUST match explore/data.js RAW ids
  kind: EntryKind
  date: string // 'YYYY-MM'
  title: string
  // The CARD FACE's short title where the full one cannot fit (2026-08-20,
  // Emilie's ruling at the moving-parts audit: faces are index entries, so a
  // title that truncates on every face gets a face form instead). Only the
  // /work grid tile and the landing belt tile read it; the sheet, the book,
  // search and the worlds keep `title` whole.
  faceTitle?: string
  lens?: Lens
  tags: string[]
  sheet?: SheetRef
  note?: NoteRef // thought notes (Session 11): the written leaf at /thoughts/:id
  project?: string // slug join into projects.tsx for card data
  refId?: string // an award/press event points back at the project id it recognises (R1: drives the mind-graph award star from this single source; also the FLAG-03 anchor hook)
  live?: boolean // a project still live + growing (a deployed, ongoing thing): the neural world marks it (S6-A, Emilie 2026-07-24)
  image?: { slug: string; name: string; alt: string }
  links?: { label: string; href: string }[]
  draftCopy?: boolean
  explore?: ExploreRef
}

// G1 (2026-07-10): the opened WORK card IS the project's showcase, so a
// sheet ref routes to /work/<project entry id> (the deep-linkable sheet).
// The number survives as the quiet label; old /sheets/<number> URLs are
// shared and citable, so pages/SheetRoute.tsx redirects them here forever.
const sheet = (number: string, status: SheetStatus, workId: string): SheetRef => ({
  number,
  status,
  route: `/work/${workId}`,
})

// The route is derived from the thought id (matches EXPLORE/data.js RAW ids),
// so a note ref never drifts from its /thoughts/:id leaf.
const note = (id: string, number: string, status: NoteStatus = 'drafted'): NoteRef => ({
  number,
  status,
  route: `/thoughts/${id}`,
})

// THE NOW ENTRY (G3, 2026-07-10): derived from now.ts so the About module
// and the record can never drift. PREPENDED, not appended: its date may TIE
// the newest entries (it does today, 2026-07), byDateDesc compares dates
// only, and Array.sort is stable, so first position guarantees NOW renders
// as the newest commit. No `explore` ref, ever (the frozen mind-graph layout
// never sees it); the validator enforces both invariants.
const NOW_ENTRY: RegistryEntry = {
  id: 'now',
  kind: 'now',
  date: NOW.date,
  title: 'Now',
  tags: [],
  draftCopy: true,
}

export const ENTRIES: RegistryEntry[] = [
  NOW_ENTRY,

  // ---- Sheet issues (the lab log's publication events) -------------------
  // These sit in NUMERIC order on purpose: the collapse rule preserves
  // ENTRIES order for same-month issues, so this renders "SHEETS P-101,
  // P-102, P-104 ISSUED >" in numeric order (all three issued 2026-07).
  {
    id: 'p101-issued',
    kind: 'sheet',
    date: '2026-07',
    title: 'Sensi',
    lens: 'computation',
    tags: ['neuro', 'comfort', 'ai', 'research'],
    sheet: sheet('P-101', 'issued', 'sensi'),
    project: 'sensi',
    draftCopy: true, // the P-101 sheet's copy is drafts pending sign-off
  },
  {
    id: 'p102-issued',
    kind: 'sheet',
    date: '2026-07',
    title: 'NeuroSpace',
    lens: 'computation',
    tags: ['neuro', 'geometry', 'simulation', 'data', 'web'],
    sheet: sheet('P-102', 'issued', 'neurospace'),
    project: 'neurospace',
    draftCopy: true, // the P-102 sheet's copy is drafts pending sign-off
  },
  {
    id: 'p104-issued',
    kind: 'sheet',
    date: '2026-07',
    title: 'A Ballooning Market',
    lens: 'computation',
    tags: ['simulation', 'geometry', 'heritage', 'play'],
    sheet: sheet('P-104', 'issued', 'ballooning'),
    project: 'ballooning-market',
  },

  // ---- Projects (explore order 0-10, ids = data.js RAW) ------------------
  {
    id: 'sensi',
    kind: 'project',
    date: '2026-06',
    title: 'Sensi',
    lens: 'computation',
    tags: ['neuro', 'comfort', 'ai', 'research'],
    sheet: sheet('P-101', 'issued', 'sensi'),
    project: 'sensi',
    live: true, // still live + growing (Emilie 2026-07-24)
    image: { slug: 'sensi', name: 'app-shape', alt: 'Sensi interface scoring a floor plan across six senses' },
    explore: { label: 'SENSI', nodeKind: 'project', order: 0 },
  },
  {
    id: 'neurospace',
    kind: 'project',
    date: '2026-02',
    title: 'NeuroSpace',
    lens: 'computation',
    tags: ['neuro', 'geometry', 'simulation', 'data', 'web'],
    sheet: sheet('P-102', 'issued', 'neurospace'),
    project: 'neurospace',
    image: { slug: 'neurospace', name: 'landing', alt: 'NeuroSpace landing page with parametric room and live scores' },
    explore: { label: 'NEUROSPACE', nodeKind: 'project', order: 1 },
  },
  {
    id: 'huddle',
    kind: 'project',
    date: '2025-12',
    title: 'The Huddle',
    lens: 'computation',
    tags: ['geometry', 'simulation', 'climate'],
    sheet: sheet('P-103', 'in-preparation', 'huddle'),
    project: 'huddle',
    image: { slug: 'huddle', name: 'wasp-growth', alt: 'Animated WASP growth study for The Huddle: modules aggregating along the wind across the Punta Arenas plot' },
    explore: { label: 'THE HUDDLE', nodeKind: 'project', order: 2 },
  },
  {
    id: 'lungs',
    kind: 'project',
    date: '2026-03',
    title: 'The Lungs',
    lens: 'computation',
    tags: ['data', 'climate', 'web'],
    sheet: sheet('P-105', 'in-preparation', 'lungs'),
    project: 'lungs',
    // 2026-07-15: the cover is the live KPI-map cut (the collage left the
    // web manifest; it remains the BOOK plate via its print rung).
    image: { slug: 'lungs', name: 'demo-cover', alt: 'The analysis tower in the live viewer, program gradients in red and blue as the timeline scrubs across the studio platform' },
    explore: { label: 'THE LUNGS', nodeKind: 'project', order: 3 },
  },
  {
    id: 'legoarch',
    kind: 'project',
    date: '2026-05',
    title: 'lEgoarCh',
    lens: 'computation',
    tags: ['ai', 'geometry', 'play'],
    sheet: sheet('P-106', 'in-preparation', 'legoarch'),
    project: 'legoarch',
    // 2026-07-15: the cover is the live solve cut (the golden sagrada-render
    // left the web manifest; it remains the BOOK plate via its print rung).
    image: { slug: 'legoarch', name: 'demo-cover', alt: "Saint Basil's Cathedral solving into a brick layout in lEgoarCh, the stage with no AI in it on purpose" },
    explore: { label: 'LEGOARCH', nodeKind: 'project', order: 4 },
  },
  {
    id: 'ballooning',
    kind: 'project',
    date: '2025-12', // CORRECTED by Emilie 2026-08-04 (was 2026-04)
    title: 'A Ballooning Market',
    lens: 'computation',
    tags: ['simulation', 'geometry', 'heritage', 'play'],
    sheet: sheet('P-104', 'issued', 'ballooning'),
    project: 'ballooning-market',
    image: { slug: 'ballooning-market', name: 'process', alt: 'The Kangaroo inflation running: balloons seeding, anchoring and settling into a roof over Bab al-Luq market' },
    explore: { label: 'A BALLOONING MARKET', nodeKind: 'project', order: 5 },
  },
  {
    id: 'podcast',
    kind: 'project',
    date: '2026-01',
    title: 'Optimizing for the Mind',
    lens: 'computation',
    tags: ['neuro', 'ai', 'research', 'future'],
    sheet: sheet('P-107', 'in-preparation', 'podcast'),
    project: 'podcast',
    links: [{ label: 'SPOTIFY', href: 'https://open.spotify.com/episode/6WpF5HmKteEBateSqSWe0D' }],
    explore: { label: 'OPTIMIZING FOR THE MIND', nodeKind: 'project', order: 6 },
  },
  {
    id: 'soma',
    kind: 'project',
    date: '2024-02',
    // S2 fix round (2026-07-16, Emilie's call): Verve City Walk IS the
    // project's name. The id 'soma' stays (permanent URLs; /work/soma has
    // shipped since G1). Cover = the interactive unit-selector capture
    // (her call), cropped clear of the sales platform's panel + watermark.
    title: 'Verve City Walk',
    lens: 'practice',
    tags: ['geometry', 'practice', 'heritage'],
    sheet: sheet('P-108', 'in-preparation', 'soma'),
    project: 'soma-towers',
    image: { slug: 'verve', name: 'unit-selector', alt: 'Screen capture of the interactive 3D unit selector orbiting the twin Verve towers, one unit footprint highlighted' },
    explore: { label: 'VERVE CITY WALK', nodeKind: 'project', order: 7 },
  },
  {
    id: 'mars',
    kind: 'project',
    date: '2023-10',
    title: 'Rings of Mars: Ring 4000',
    // Signed 2026-08-20: the full title truncated on all four card faces
    // (measured -4 to -25px, moving-parts audit).
    faceTitle: 'Rings of Mars',
    lens: 'practice',
    tags: ['ai', 'practice', 'future'],
    sheet: sheet('P-109', 'in-preparation', 'mars'),
    project: 'marsception',
    // S2 enrich (2026-07-16): the real competition board's crater hero
    // replaces the frozen old-site render; alt SIGNED by Emilie (S2 sign-off, 2026-07-17).
    image: { slug: 'mars', name: 'mars-cover', alt: 'Ring 4000 at a glance: the ring in its crater, the farming interior, the transfer box and the annotated ring plan' },
    explore: { label: 'RING 4000', nodeKind: 'project', order: 8 },
  },
  {
    id: 'cappelletti',
    kind: 'project',
    date: '2025-11',
    title: 'Cappelletti Pavilion',
    lens: 'explorations',
    tags: ['geometry', 'simulation', 'play', 'research'],
    sheet: sheet('P-110', 'in-preparation', 'cappelletti'),
    project: 'cappelletti',
    image: { slug: 'cappelletti', name: 'galapagos-run', alt: "Galapagos optimization running live on the Cappelletti lattice, displacement traded against mass for the shell" },
    explore: { label: 'CAPPELLETTI PAVILION', nodeKind: 'project', order: 9 },
  },
  {
    id: 'xr',
    kind: 'project',
    date: '2022-06',
    title: 'XR for Education',
    lens: 'explorations',
    tags: ['xr', 'research', 'play', 'education'],
    sheet: sheet('P-111', 'in-preparation', 'xr'),
    project: 'xr-lab',
    // S2 enrich (2026-07-16): the first real cover for the quiet P-111 tile,
    // from her LAU XR Lab research assets; alt SIGNED by Emilie (S2 sign-off, 2026-07-17).
    image: { slug: 'xr', name: 'reaction-cover', alt: 'An SN2 reaction rendered for AR: the chloride ion leaves the molecule as methanol forms, ball and stick in gray space' },
    explore: { label: 'XR FOR EDUCATION', nodeKind: 'project', order: 10 },
  },

  // ---- S4b · THE FOUR (2026-07-14): the blog projects join the record -----
  // APPENDS ONLY, per the contract note above: explore orders continue at 21,
  // sheet numbers at P-112. Sources are Emilie's public IAAC blog posts
  // (content/blog-catalog.json); team framing per her session-gate rulings
  // (all shared credit, no individual slice). Dates are the blogs' publish
  // months, CONFIRMED by Emilie at the S4b copy gate; deks + spines + credit
  // rows SIGNED at the same gate (2026-07-14).
  {
    id: 'narkomfin',
    kind: 'project',
    // CORRECTED by Emilie 2026-08-06 (was 2026-06): "narkomfin as a graph also
    // 2026 05".
    date: '2026-05',
    title: 'Narkomfin as a Graph',
    lens: 'computation',
    tags: ['data', 'ai', 'heritage', 'research'],
    sheet: sheet('P-112', 'in-preparation', 'narkomfin'),
    project: 'narkomfin',
    image: {
      slug: 'narkomfin',
      name: 'graph-cover',
      alt: 'The Narkomfin voxel graph drawing closer: translucent volumes on black with graph nodes reaching out of the massing',
    },
    explore: { label: 'NARKOMFIN', nodeKind: 'project', order: 21 },
  },
  {
    id: 'urban-risk',
    kind: 'project',
    // CORRECTED by Emilie 2026-08-06 (was 2026-06): "encoding urban risk is
    // 2026-04 so it should move back". Part of clearing the June cluster so
    // Sensi is genuinely the newest project rather than one of three tied.
    date: '2026-04',
    title: 'Encoding Urban Risk',
    lens: 'computation',
    tags: ['data', 'ai', 'research'],
    sheet: sheet('P-113', 'in-preparation', 'urban-risk'),
    project: 'urban-risk',
    image: {
      slug: 'urban-risk',
      name: 'assessment-ui',
      alt: "The team's street safety assessment interface scoring a neighborhood's segments from OpenStreetMap features",
    },
    explore: { label: 'URBAN RISK', nodeKind: 'project', order: 22 },
  },
  {
    id: 'data-geometry',
    kind: 'project',
    date: '2026-03',
    title: 'Data into Geometry',
    lens: 'computation',
    tags: ['data', 'geometry'],
    sheet: sheet('P-114', 'in-preparation', 'data-geometry'),
    project: 'data-geometry',
    image: {
      slug: 'data-geometry',
      name: 'workflow-cover',
      alt: 'The data team workflow drawing closer: Speckle model and parameter sheets flowing through Grasshopper into Revit',
    },
    explore: { label: 'DATA INTO GEOMETRY', nodeKind: 'project', order: 23 },
  },
  {
    id: 'tsukiji',
    kind: 'project',
    date: '2025-12',
    title: 'Tsukiji Fish Market',
    lens: 'computation',
    tags: ['climate', 'simulation', 'geometry'],
    sheet: sheet('P-115', 'in-preparation', 'tsukiji'),
    project: 'tsukiji',
    image: {
      slug: 'tsukiji',
      name: 'form-iterations',
      alt: 'Design exploration iterations reshaping the Tsukiji market hall after small tweaks barely moved environmental performance',
    },
    explore: { label: 'TSUKIJI', nodeKind: 'project', order: 24 },
  },
  // PARKED (S4b gate, Emilie 2026-07-14): Pelagñou (the AI-theory slide piece
  // with Aditya Kossambe + Eleni Maglari, blog.iaac.net/?p=166653) was pulled
  // OUT of the work room at her call: "maybe just a thought, not a project,
  // because it was exploring the work of someone else" (Ari Melenciano's
  // residency essay). Candidate for a future words session: a THOUGHT entry
  // whose note reads her take on the essay (opacity, desire paths, AGI
  // tensions). (S2 note, 2026-07-16: P-116..P-121 now taken by THE NEW WORK
  // below; the next free sheet number is P-122.)

  // ---- S2 · THE NEW WORK (2026-07-16): the pre-IAAC record joins ----------
  // APPENDS ONLY: explore orders continue at 25, sheet numbers at P-116.
  // Sources are Emilie's reorganized incoming/ (academic/lau, academic/iaac,
  // work/); recognition wordings are ceiling-checked against the certificates
  // on disk + the public award pages (see each master file header). Dates:
  // homage = the LAU graduation year (boards dated 2023), jemma = the CV's
  // internship window (Jan-Aug 2022; the cemetery award entry already sat at
  // 2022-06), minis = the bootcamp file dates (Oct-Nov 2025). Dates + copy
  // Copy SIGNED by Emilie (S2 sign-off, 2026-07-17).
  // ALL SIX MONTHS CONFIRMED by Emilie 2026-08-06, the last pass before print:
  // "all unconfirmed project dates are correct". `dateDraft` retired with them,
  // and see the type above for why the flag went rather than being set false.
  {
    id: 'homage',
    kind: 'project',
    date: '2023-06',
    title: 'The Homage',
    lens: 'explorations',
    tags: ['heritage', 'geometry', 'practice'],
    sheet: sheet('P-116', 'in-preparation', 'homage'),
    project: 'homage',
    image: {
      slug: 'homage',
      name: 'homage-cover',
      alt: 'The Homage at a glance: the moonlit housing bar, the dark fair with its one beam of light and the cutaway axonometric',
    },
    explore: { label: 'THE HOMAGE', nodeKind: 'project', order: 25 },
  },
  // (S2 fix round, 2026-07-16: the single "Competitions at Jemma Chidiac"
  // entry SPLIT into its two competitions at Emilie's call. Her role title
  // is architectural designer, her LinkedIn record; the split shipped
  // before any commit, so the never-published 'jemma' id retired cleanly.
  // The Encounter keeps P-117 and explore order 26; Falcon Square appends
  // at P-121 / order 30.)
  {
    id: 'encounter',
    kind: 'project',
    date: '2022-06',
    title: 'The Encounter',
    lens: 'practice',
    tags: ['practice', 'heritage', 'geometry'],
    sheet: sheet('P-117', 'in-preparation', 'encounter'),
    project: 'encounter',
    image: {
      slug: 'encounter',
      name: 'encounter-cover',
      alt: 'The Encounter at a glance: the split bell tower, the tomb terraces from the air, the chapel light and the sunken court',
    },
    explore: { label: 'THE ENCOUNTER', nodeKind: 'project', order: 26 },
  },
  {
    id: 'falcon',
    kind: 'project',
    date: '2022-04',
    title: 'Falcon Square',
    lens: 'practice',
    tags: ['practice', 'geometry'],
    sheet: sheet('P-121', 'in-preparation', 'falcon'),
    project: 'falcon',
    image: {
      slug: 'falcon',
      name: 'falcon-cover',
      alt: 'The falcon monument in motion: the camera pulls back from the copper calligraphy band to the whole roundabout at dusk',
    },
    explore: { label: 'FALCON SQUARE', nodeKind: 'project', order: 30 },
  },
  {
    id: 'astroidal',
    kind: 'project',
    date: '2025-10',
    title: 'Astroidal Ellipsoid',
    lens: 'explorations',
    tags: ['geometry', 'play'],
    sheet: sheet('P-118', 'in-preparation', 'astroidal'),
    project: 'astroidal',
    image: {
      slug: 'astroidal',
      name: 'star-cover',
      alt: 'The three astroidal ellipsoid stars in turn, the same equations wearing three different coefficient sets',
    },
    explore: { label: 'ASTROIDAL ELLIPSOID', nodeKind: 'project', order: 27 },
  },
  {
    id: 'chair-sim',
    kind: 'project',
    date: '2025-11',
    title: 'Chair Simulation',
    lens: 'explorations',
    tags: ['simulation', 'geometry', 'play'],
    sheet: sheet('P-119', 'in-preparation', 'chair-sim'),
    project: 'chair-sim',
    image: {
      slug: 'chair-sim',
      name: 'voxel-sizes',
      alt: 'The settled chair rebuilt at growing voxel sizes, from fine grain steps to chunky rubber ring modules',
    },
    explore: { label: 'CHAIR SIMULATION', nodeKind: 'project', order: 28 },
  },
  {
    id: 'playscape',
    kind: 'project',
    date: '2025-10',
    title: 'A Playscape',
    lens: 'explorations',
    tags: ['simulation', 'geometry', 'play'],
    sheet: sheet('P-120', 'in-preparation', 'playscape'),
    project: 'playscape',
    image: {
      slug: 'playscape',
      name: 'net-settle',
      alt: 'The settled playscape at rest: a double layer climbing net draped by Kangaroo over soft red inflatable mounds',
    },
    explore: { label: 'A PLAYSCAPE', nodeKind: 'project', order: 29 },
  },

  // ---- Thoughts (explore order 11-20; labels verbatim from data.js) -------
  //
  // THE DATES ARE CONFIRMED. Emilie ruled on all eighteen, 2026-08-04, off a
  // drawn timeline of the whole record. This block used to read "dates are
  // Emilie-pending drafts", which was true for a year and was never surfaced:
  // `dateDraft` has no consumers, so ten unconfirmed dates rendered exactly
  // like confirmed ones. The standing rule now is that a NEW thought never
  // ships with a date I chose, because a thought's date is a judgement about
  // when the thinking started and only she can make it.
  //
  // A THOUGHT IS DATED TO WHEN THE THINKING STARTED, NOT WHEN THE NOTE WAS
  // TYPED. Eight moved on that rule, six of them backwards by months or
  // years. Every move is a DIRECTION change too, because the CORRELATIONS
  // tuple order is the direction the thread fires (see the block below).
  {
    id: 'bim',
    kind: 'thought',
    date: '2026-01',
    title: 'behavior information modeling',
    lens: 'computation',
    tags: ['neuro', 'data', 'research', 'future'],
    note: note('bim', 'T-101'),
    explore: { label: 'behavior information modeling', nodeKind: 'thought', order: 11 },
  },
  {
    id: 'neuroaes',
    kind: 'thought',
    date: '2025-12',
    title: 'neuroaesthetics',
    lens: 'computation',
    tags: ['neuro', 'research'],
    note: note('neuroaes', 'T-102'),
    explore: { label: 'neuroaesthetics', nodeKind: 'thought', order: 12 },
  },
  {
    id: 'solvers',
    kind: 'thought',
    date: '2025-11', // CONFIRMED by Emilie 2026-08-04 (was an unconfirmed 2026-04)
    title: 'physics solvers',
    lens: 'explorations',
    tags: ['simulation', 'geometry'],
    note: note('solvers', 'T-103'),
    explore: { label: 'physics solvers', nodeKind: 'thought', order: 13 },
  },
  {
    id: 'genai',
    kind: 'thought',
    date: '2023-12', // CONFIRMED by Emilie 2026-08-04 (was an unconfirmed 2024-06)
    title: 'generative ai',
    lens: 'computation',
    tags: ['ai', 'play', 'future'],
    note: note('genai', 'T-104'),
    explore: { label: 'generative ai', nodeKind: 'thought', order: 14 },
  },
  {
    id: 'xreal',
    kind: 'thought',
    date: '2022-09',
    title: 'extended reality',
    lens: 'explorations',
    tags: ['xr', 'education', 'future'],
    note: note('xreal', 'T-105'),
    explore: { label: 'extended reality', nodeKind: 'thought', order: 15 },
  },
  {
    id: 'comfort',
    kind: 'thought',
    date: '2026-05',
    title: 'comfort as data',
    lens: 'computation',
    tags: ['comfort', 'neuro', 'data'],
    note: note('comfort', 'T-106'),
    explore: { label: 'comfort as data', nodeKind: 'thought', order: 16 },
  },
  {
    id: 'drawiface',
    kind: 'thought',
    date: '2026-03',
    title: 'drawing as interface',
    lens: 'practice',
    tags: ['play', 'practice', 'web'],
    note: note('drawiface', 'T-107'),
    explore: { label: 'drawing as interface', nodeKind: 'thought', order: 17 },
  },
  {
    id: 'evosearch',
    kind: 'thought',
    date: '2025-11',
    title: 'evolutionary search',
    lens: 'explorations',
    tags: ['simulation', 'ai'],
    note: note('evosearch', 'T-108'),
    explore: { label: 'evolutionary search', nodeKind: 'thought', order: 18 },
  },
  {
    id: 'heritage',
    kind: 'thought',
    date: '2025-12', // CONFIRMED by Emilie 2026-08-04 (was an unconfirmed 2026-04)
    title: 'heritage meets new tech',
    lens: 'practice',
    tags: ['heritage', 'practice'],
    note: note('heritage', 'T-109'),
    explore: { label: 'heritage meets new tech', nodeKind: 'thought', order: 19 },
  },
  {
    id: 'respond',
    kind: 'thought',
    date: '2026-06',
    title: 'buildings that respond',
    lens: 'computation',
    tags: ['neuro', 'future', 'data', 'comfort'],
    note: note('respond', 'T-110'),
    explore: { label: 'buildings that respond', nodeKind: 'thought', order: 20 },
  },

  // ---- S5 thoughts (2026-07-18, the words session) -----------------------
  {
    // THE FIRST THOUGHT, by design: her LAU charcoal year, dated before
    // every other entry ("this thought is being written supposedly before
    // every other thought. its the first.", Emilie 2026-07-18). The three
    // sketches reveal via SketchDot (her mechanism, signed same day).
    id: 'charcoal',
    kind: 'thought',
    date: '2020-06', // FULLY CONFIRMED by Emilie 2026-08-04, month included
    // (the `dateDraft` flag retired here: the month was a placeholder from
    // S5 until she ruled on it at the walk)
    title: 'connecting the dots',
    lens: 'explorations',
    tags: ['play', 'practice'],
    note: note('charcoal', 'T-111'),
    // SIGNED by Emilie 2026-07-18 off the live page ("Everything is good").
    explore: { label: 'connecting the dots', nodeKind: 'thought', order: 31 },
  },
  // T-112 pelagñou WAS CUT (Emilie, 2026-07-29, at the walk through the
  // thoughts). It was the only note mostly about other people's ideas and it
  // opened by conceding as much ("only my reading of our reading"), which is a
  // strange thing for a note to have to say about itself. She had already ruled
  // once (S4b, 2026-07-14) that Pelagñou was not her project for the same
  // reason. Offered the choice of halving it to keep the desire-path passage,
  // she cut the whole note.
  //
  // THE ORDERS AFTER IT RENUMBERED, 33..39 down to 32..38. I assumed a gap
  // would be fine and it is not: the validator asserts explore orders are
  // "unique and contiguous from 0", and it caught this. Renumbering is safe
  // here for a reason worth writing down, because the file header warns that
  // reordering "SHIFTS EVERY WORD in the constellation": that was true of the
  // seeded EXPLORE simulation, which retired at S4b. The mind-graph reads
  // GEOM[n.id], keyed by ID and hand-placed, so order now only decides array
  // position and no mark moves. Verified against the layout snapshot.
  //
  // T-NUMBERS DO NOT RENUMBER. There is simply no T-112 any more: those are
  // catalogue numbers on published pieces, and renumbering them would rewrite
  // the record rather than correct it.
  {
    // Her named thought ("how do we explain complex, sometimes boring
    // technical subjects in a fun and captivating way, because it matters"),
    // parked at S4, written S5. SIGNED by Emilie 2026-07-18 ("i like the
    // explaining things. for now.").
    id: 'explain',
    kind: 'thought',
    date: '2026-07',
    title: 'explaining things',
    lens: 'practice',
    tags: ['play', 'education', 'ai'],
    note: note('explain', 'T-113'),
    explore: { label: 'explaining things', nodeKind: 'thought', order: 32 },
  },
  {
    // ---- S7 append (2026-07-26): the MaCAD Module 03 graph work joins the
    // record as a THOUGHT, not a project. Emilie's ruling: the notebook
    // scaffolds came from the IAAC GraphML course and she adapted them, so the
    // honest subject is the analysis and the judgement rather than a build.
    // Dated to the same month as narkomfin (the team project from the same
    // module), so it appends at the newest edge and the world layout barely
    // moves. APPENDS ONLY: explore order continues at 34, note number at T-114.
    id: 'adjacency',
    kind: 'thought',
    date: '2026-06',
    title: 'adjacency is not access',
    lens: 'computation',
    tags: ['data', 'geometry'],
    note: note('adjacency', 'T-114'),
    explore: { label: 'adjacency is not access', nodeKind: 'thought', order: 33 },
    // SIGNED by Emilie at the walk, 2026-07-29.
  },

  // ---- THE WORDS append (2026-07-28): the four vocabulary notes ----------
  //
  // Emilie's ask: technical words from her domain, explained her way, starting
  // from her own seed about experience and data. APPENDS ONLY, per the
  // mind-graph contract: orders continue at 35, note numbers at T-115, and
  // every one has a hand-placed geometry entry in landing/mindGraph.ts.
  //
  // THREAD PLACEMENT WAS MEASURED, NOT GUESSED. A probe walked every thread at
  // 0.02 intervals and reported the nearest shipped mark, the same method the
  // T-114 append used. The four widest gaps on the whole board went to these
  // four: NEURO 0.40 (168 canvas units clear), AI 0.20 (158), GEOMETRY 0.60
  // (106), DATA 0.78 (89). So nothing crowds anything, and the shipped
  // composition does not move.
  //
  // These four were written in 2026-07 and originally DATED to that month too.
  // Emilie re-dated them to when the thinking started at the 2026-08-04 date
  // pass: learning 2026-05, llm 2025-09, latent 2026-04, scoring 2026-04. So
  // they no longer sit together and no longer tie NOW.
  //
  // ALL FOUR SIGNED by Emilie 2026-07-29 ("the 4 new thoughts are signed i
  // liked them"), so the draftCopy flags are retired.
  //
  // STALE LINE REMOVED 2026-08-04: this block used to end "T-114 `adjacency` is
  // NOT signed and keeps its flag". It was written on 2026-07-28 and Emilie
  // signed adjacency the NEXT DAY at the walk (see its own entry above). The
  // contradiction sat here for a week and cost a wrong claim at the 2026-08-04
  // walk. A sign-off note belongs on the entry it signs, never in a neighbour.
  {
    id: 'learning',
    kind: 'thought',
    date: '2026-05', // CONFIRMED by Emilie 2026-08-04 (was the week it was written)
    title: 'experiences are data',
    lens: 'computation',
    tags: ['data', 'neuro', 'research'],
    note: note('learning', 'T-115'),
    explore: { label: 'experiences are data', nodeKind: 'thought', order: 34 },
  },
  {
    id: 'llm',
    kind: 'thought',
    date: '2025-09', // CONFIRMED by Emilie 2026-08-04 (was the week it was written)
    title: 'what an llm actually is',
    lens: 'computation',
    tags: ['ai', 'research'],
    note: note('llm', 'T-116'),
    explore: { label: 'what an llm actually is', nodeKind: 'thought', order: 35 },
    // WITHDRAWN, REWRITTEN, THEN SIGNED. It was signed with the other three on
    // 2026-07-28 and she withdrew it the same day ("I don't love the llm
    // thought and the figure we use here"). The rewrite came off her own
    // diagnosis: open on the joke that the acronym explains nothing, then
    // define it by what it is NOT, and get the facts checked first. The figure
    // was redrawn with it. SIGNED at the walk, 2026-07-29.
  },
  {
    id: 'latent',
    kind: 'thought',
    date: '2026-04', // CONFIRMED by Emilie 2026-08-04 (was the week it was written)
    title: 'latent space',
    lens: 'computation',
    tags: ['ai', 'geometry'],
    note: note('latent', 'T-117'),
    explore: { label: 'latent space', nodeKind: 'thought', order: 36 },
  },
  {
    id: 'scoring',
    kind: 'thought',
    date: '2026-04', // CONFIRMED by Emilie 2026-08-04 (was the week it was written)
    title: 'when the tool scores people',
    lens: 'computation',
    tags: ['neuro', 'comfort', 'research'],
    note: note('scoring', 'T-118'),
    explore: { label: 'when the tool scores people', nodeKind: 'thought', order: 37 },
  },
  {
    // T-119, appended 2026-07-29. She asked for "llm and computation"; the llm
    // note already existed as T-116, so computation is the one that was
    // genuinely missing from the shortlist.
    //
    // THE ID IS `rules`, NOT `computation`, and that is deliberate: the world
    // graph tie-breaks alphabetically within a date, so an id starting with c
    // would sort ahead of `explain` and shove a shipped node sideways. Ids from
    // f to z append cleanly. `rules` is also honestly what the note is about
    // (the rule that decides where the wall goes), and the site already has
    // title/id mismatches by design: bim, charcoal, learning.
    id: 'rules',
    kind: 'thought',
    date: '2025-10', // CONFIRMED by Emilie 2026-08-04 (was the week it was written)
    title: 'computation',
    lens: 'computation',
    tags: ['geometry', 'ai', 'research'],
    note: note('rules', 'T-119'),
    explore: { label: 'computation', nodeKind: 'thought', order: 38 },
    // SIGNED by Emilie at the walk, 2026-07-29 ("I like the computation thought").
  },

  // ---- Milestones (where Em shows up on the record; dates from cv.ts) ----
  {
    id: 'xrlab-start',
    kind: 'milestone',
    date: '2021-09',
    title: 'Research Assistant · LAU XR Lab · Byblos',
    tags: ['xr', 'education'],
  },
  {
    // G2 append: the self-employed line needs its anchor on the record (the
    // notebook's one live branch departs here; date from cv.ts, 2022.01 > NOW).
    id: 'self-open',
    kind: 'milestone',
    date: '2022-01',
    title: 'Self-employed practice opens',
    tags: ['practice'],
  },
  {
    id: 'barch-grad',
    kind: 'milestone',
    date: '2023-06',
    title: "B.ARCH · LAU · Dean's Distinction",
    tags: ['practice'],
  },
  {
    id: 'soma-start',
    kind: 'milestone',
    date: '2023-08',
    title: 'Design Architect · SOMA · Dubai | Beirut',
    tags: ['practice'],
  },
  {
    id: 'dynamic-start',
    kind: 'milestone',
    date: '2024-08',
    // THE TITLE MATCHES THE CV NOW (Emilie, 2026-08-06: "for my job title the
    // cv is correct"). This said "Project Architect" and had done since the
    // milestone shipped, while data/cv.ts has said "Design Technology Architect"
    // since her review on 2026-07-27, with a comment recording that ruling. So
    // the same job carried two titles on two surfaces for six weeks: the map
    // said one and the CV, the book and the <title> said the other. Found by the
    // cross-surface pass, which exists for exactly this.
    title: 'Design Technology Architect · Dynamic Solution · Kuwait',
    tags: ['practice'],
  },
  {
    id: 'macad-start',
    kind: 'milestone',
    date: '2025-10',
    title: 'MaCAD begins · IAAC · Beirut > Barcelona',
    tags: ['research'],
  },
  // ---- TWO CV LINES THE MAP HAD NEVER HEARD OF (Emilie, 2026-08-06) --------
  // The cross-surface audit found both of these living on the CV and nowhere
  // else, so the record said one thing on a page and another on the map. Her
  // ruling: "add the new cv line to the map, make sure it's all reflected
  // always". The guard that keeps it that way from now on is data/reflect.test.ts.
  {
    id: 'licence',
    kind: 'milestone',
    // data/cv.ts, EDUCATION: "Licensed architect, Order of Engineers and
    // Architects of Beirut, issued Mar 2024". The month is on the CV already,
    // so nothing is invented here.
    date: '2024-03',
    title: 'Licensed architect · Order of Engineers and Architects · Beirut',
    tags: ['practice'],
  },
  {
    id: 'gss',
    kind: 'milestone',
    // data/cv.ts carries the YEAR only ("2025 · IAAC Global Summer School,
    // Circular Construction: Shifting Value, Barcelona") and the registry needs
    // YYYY-MM. July was proposed as the month and flagged to her as a guess;
    // CONFIRMED by Emilie 2026-08-06 ("summer school month is correct").
    date: '2025-07',
    title: 'IAAC Global Summer School · Circular Construction · Barcelona',
    tags: ['research', 'practice'],
  },
  {
    id: 'macad-y1',
    kind: 'milestone',
    date: '2026-06',
    title: 'MaCAD Year 1 complete · the technical year',
    tags: ['research'],
  },
  {
    // S4a append (Emilie signed the wording at the gate, 2026-07-13): the
    // portfolio itself joins the record. It rides the self-employed lane (her
    // own thing), the newest milestone, sitting just under the live red tip.
    // The world census derives, so {pieces} and the snapshots grow by one.
    id: 'site-live',
    kind: 'milestone',
    date: '2026-07',
    title: 'emiliechidiac.com goes live',
    tags: ['practice'],
  },

  // ---- Awards + press (the credibility layer; years from cv.ts,
  //      months are drafts) ------------------------------------------------
  {
    id: 'sensi-macad-award',
    kind: 'award',
    date: '2026-06',
    // THE YEAR JOINS THE TITLE (THE SCROLL, 2026-07-27). It was carried by the
    // `date` field alone, which is enough on a chronological surface (the world,
    // the CV graph) and not enough anywhere else. The landing's recognition line
    // reads this title VERBATIM, and the wording every other surface uses is
    // "MACAD AWARDS 2026 · DESIGN COPILOTS · WINNER" (content/projects/sensi.tsx).
    // Putting the year here is what lets the landing quote the record instead of
    // re-typing the claim, so the two can never drift.
    title: 'MaCAD Awards 2026 · Design Copilots · winner (Sensi)',
    lens: 'computation',
    tags: ['ai', 'research'],
    refId: 'sensi',
    // FLAG-03 (CONTENT-STRATEGY.md §3): the award has no public anchor yet.
    // The showcase award pill already reads this entry's refId; the moment
    // Emilie's announcement (LinkedIn post or an IAAC page) is live, add its
    // URL here and the pill LIGHTS UP as a link everywhere, no code change:
    //   links: [{ label: 'ANNOUNCEMENT', href: 'https://...' }],
  },
  {
    id: 'legoarch-jury',
    kind: 'award',
    // ALL FOUR MaCAD AWARDS ARE JUN 2026 (Emilie, 2026-08-06): "all the awards
    // that were macad related were given jun 2026 for the first year of macad
    // 2025-2026 for the yearly exhibition". They were dated to the courses they
    // came out of; they were HANDED OUT together at the annual exhibition, which
    // is the event the record should carry. Was 2026-05.
    date: '2026-06',
    title: 'Jury award · MaCAD Generative AI (lEgoarCh)',
    lens: 'computation',
    tags: ['ai'],
    refId: 'legoarch',
  },
  {
    id: 'lungs-award',
    kind: 'award',
    // Jun 2026, the annual exhibition (see legoarch-jury). Was 2026-03.
    date: '2026-06',
    title: 'Studio award · BIMSC (The Lungs)',
    lens: 'computation',
    tags: ['data'],
    refId: 'lungs',
  },
  {
    id: 'huddle-award',
    kind: 'award',
    // Jun 2026, the annual exhibition (see legoarch-jury). Was 2025-12, which
    // was the PROJECT's date: the cross-surface audit caught the CV filing this
    // award under 2026 while the map filed it under 2025. Her ruling settles
    // both: "the huddle award year is 2026 even if the project was done in 2025".
    date: '2026-06',
    title: 'Studio award · ACESD (The Huddle)',
    lens: 'computation',
    tags: ['simulation'],
    refId: 'huddle',
  },
    // (BIENNALE ARTE 2024 REMOVED, Emilie 2026-08-06: "remove the biennale
    // arte". It was `kind: 'press'`, dated 2024-04, and read "Design project
    // featured · Biennale Arte 2024 · Venice". It had already been cut from the
    // CV at her call during the CV pass.
    //
    // ⚠ IT RENDERED NOWHERE, and I told her the opposite before checking. The
    // audit board said it was "still a node on the map"; it was not.
    // `WORLD_KINDS` (thoughts/world/worldGraph.ts) has only ever contained
    // project, thought, milestone and award, so a 'press' entry is filtered out
    // of the world census; it carried no `explore` field so the landing's mind
    // graph never had it either; and lib/routes.ts only builds routes for
    // projects and drafted thoughts. It was DEAD DATA sitting in the single
    // source of truth, visible to nobody.
    //
    // That is the more useful finding, and it is the case the reflection guard
    // in data/reflect.test.ts now covers: the registry can hold a fact that no
    // surface shows, and nothing used to say so. It was the ONLY 'press' entry,
    // so that kind now has no instances; the union member stays in EntryKind for
    // the next one rather than being removed and re-added.)
  {
    id: 'mars-top50',
    kind: 'award',
    date: '2024-03',
    title: 'Top 50 · Marsception (Ring 4000)',
    lens: 'practice',
    tags: ['ai', 'future'],
    refId: 'mars',
    // S2 (2026-07-16): the public anchor. The Volume Zero results page lists
    // the entry verbatim ("Emilie Chidiac - Charles Abi Chahine / Lebanon
    // MARS246875258") under Top 50; the award pill links here. The
    // certificate of participation on disk does NOT evidence Top 50 and
    // stays off the site (Emilie's plan-gate ruling); the official badge
    // ships as a gallery frame instead.
    links: [
      {
        label: 'RESULTS',
        href: 'https://volumezerocompetitions.com/competitions/result/marsception-2024#gallery-56',
      },
    ],
  },
  {
    id: 'tamayouz',
    kind: 'award',
    date: '2023-09',
    title: 'Tamayouz Excellence · Top 100 graduation projects',
    tags: ['practice'],
    // S2 (2026-07-16): the honoured graduation project (The Homage, P-116) is
    // finally ON the site, so refId can express what the world's override map
    // approximated (the old barch-grad anchor retired from skeletonIds.ts).
    // The link is the AWD-06 grade-A public anchor: the Tamayouz Top-100 page
    // names Emilie, LAU and her supervisor.
    refId: 'homage',
    links: [
      {
        label: 'TAMAYOUZ TOP 100',
        href: 'https://tamayouz-award.com/tamayouz-international-graduation-projects-2023-top100/',
      },
    ],
  },
  {
    id: 'cemetery',
    kind: 'award',
    date: '2022-06',
    title: 'Shortlisted finalist · The Cemetery Challenge',
    tags: ['practice'],
    // S2 fix round (2026-07-16): anchored to The Encounter (P-117). No
    // public results URL exists, so the pill links the certificate raster
    // itself (her call): shipped as a real asset in the encounter slug.
    refId: 'encounter',
    links: [
      { label: 'CERTIFICATE', href: '/assets/projects/encounter-cert/certificate-1600.webp' },
    ],
  },
]

// ---- Selectors ------------------------------------------------------------

export const byDateDesc = (a: RegistryEntry, b: RegistryEntry) =>
  b.date.localeCompare(a.date)

export function timelineEntries(): RegistryEntry[] {
  return [...ENTRIES].sort(byDateDesc)
}

// THE THOUGHTS index rows (Session 1 REINDEX, 2026-07-16): the ONE selector
// behind both index renditions, the /work THE THOUGHTS section and the
// printed book's index page (components/ThoughtIndexRows). Book order =
// T-number ascending, the order Emilie signed on the printed index.
// ORDERED BY DATE, NEWEST FIRST (Emilie, 2026-08-05). It used to sort by
// T-number, which is the order the notes were CATALOGUED, not the order she
// thought them. That was invisible until the 2026-08-04 date pass moved eight
// dates: /work shows a date on every row, so the list started reading JAN 2026,
// DEC 2025, NOV 2025, DEC 2023, SEP 2022 down its first column.
//
// It also makes an existing claim true. ThoughtRoute's comment says NEXT walks
// "the same order as the index", and until now it did not: prev/next ran on
// `byDateDesc` while the index ran on T-number. One order now, everywhere.
//
// TIE-BREAK BY T-NUMBER, DESCENDING, so the run stays deterministic: five pairs
// share a month (JUN 2026, MAY 2026, APR 2026, DEC 2025, NOV 2025) and the
// prerender, the frozen book and the snapshots all need one stable answer.
export function thoughtIndexEntries(): RegistryEntry[] {
  return ENTRIES.filter((e) => e.kind === 'thought').sort(
    (a, b) =>
      byDateDesc(a, b) || (b.note?.number ?? '').localeCompare(a.note?.number ?? ''),
  )
}

// (G3: the unused entriesByYear() selector retired with the notebook sweep;
// it predated the 'now' pseudo-entry and had no consumers.)

// The sheet route resolver returns the PROJECT entry (it carries the image,
// lens, and title the sheet chrome needs), never the sheet-issue log event.
export function getSheetEntry(sheetId: string): RegistryEntry | undefined {
  const wanted = sheetId.toLowerCase()
  return ENTRIES.find(
    (e) => e.kind === 'project' && e.sheet?.number.toLowerCase() === wanted,
  )
}

// ---- EXPLORE contract ------------------------------------------------------
// The EXPLORE graph consumes ONLY this export. Order is the layout invariant
// (see contract note at the top of this file).

export interface ExploreNode {
  id: string
  label: string
  kind: 'project' | 'thought'
  lens: Lens
  tags: string[]
  order: number
  standalone?: boolean
  sheet?: SheetRef
  note?: NoteRef
}

export const EXPLORE_NODES: ExploreNode[] = ENTRIES.filter(
  (e): e is RegistryEntry & { explore: ExploreRef; lens: Lens } =>
    e.explore != null && e.lens != null,
)
  .map((e) => ({
    id: e.id,
    label: e.explore.label,
    kind: e.explore.nodeKind,
    lens: e.lens,
    tags: e.tags,
    order: e.explore.order,
    standalone: e.explore.standalone,
    sheet: e.sheet,
    note: e.note,
  }))
  .sort((a, b) => a.order - b.order)

// The set of explore-node ids that carry a recognition (R1). Derived from the
// award entries' refId so the mind-graph's award star has ONE source of truth
// (the awards already live here) and can never drift from the record. Awards
// read as recognition, never a stamp (REDESIGN-SPEC section 1).
export const AWARD_WINNER_IDS: ReadonlySet<string> = new Set(
  ENTRIES.filter((e) => e.kind === 'award' && e.refId).map((e) => e.refId!),
)

// FLAG-03 anchor hook: the public URL a project's award links to, or undefined
// while none exists (grade C until Emilie posts). Derived from the SAME award
// entries as the star above, so the record stays the single source: give the
// award entry a `links` href and the showcase pill becomes a link on its own.
export function awardHrefFor(projectId: string): string | undefined {
  return ENTRIES.find((e) => e.kind === 'award' && e.refId === projectId)?.links?.[0]?.href
}

// ---- THE CORRELATIONS · which piece builds on which (the meta build) -------
// The neural world's threads. One line per real relation, APPENDS ONLY.
// [earlier, later, strength] · strength 1..3 = how much the two build on each
// other = how many fibres grow from each end toward their synapse (the braid).
// Idea lineage only (thought<->thought, thought<->project): award->work
// threads are NOT listed here, they derive from each award's refId, and the
// one award that honours a milestone (Tamayouz -> the B.Arch) anchors via
// the world's override map (thoughts/world/skeletonIds.ts). Validator-guarded:
// ids resolve, ends are thoughts/projects, no self-links, no duplicate pairs.
// Strengths are Emilie's to tune: edit the number, the braid follows.
//
// EARLIER FIRST IS ENFORCED (Emilie, 2026-08-04, "all forward"). The order
// inside the tuple is not bookkeeping. The world builds `pulseD` from a to b
// and `nw-travel` sweeps one dash along it, so THE TUPLE ORDER IS THE
// DIRECTION THE THREAD FIRES on the map. Seventeen rows had been written
// [later, earlier], so 17 threads travelled against the clock and 28 with it,
// with no rule deciding which. They were flipped IN PLACE: every row keeps its
// append position and its comment, only the pair reversed, so the record still
// reads as the history of when each thread was found. The validator now
// refuses a backwards row. Nothing else was affected: the link's colour is
// computed from the dates (worldGraph L389) and the /work cross-glow is
// direction-blind, so both were already correct.
export type Correlation = readonly [string, string, 1 | 2 | 3]

export const CORRELATIONS: readonly Correlation[] = [
  ['xr', 'xreal', 2], // the XR thought grew out of the lab work
  ['genai', 'drawiface', 1],
  ['genai', 'evosearch', 1],
  ['genai', 'legoarch', 2], // the diffusion half of lEgoarCh
  // (['genai','heritage',1] and ['genai','neurospace',1] CUT at the walk,
  // 2026-08-04. Neither project text supports a generative thread: NeuroSpace
  // is Grasshopper / Rhino.Compute / Vue / Three.js with no generative step
  // anywhere in its spine, and the heritage note is entirely the Ballooning
  // Market, whose computation is Kangaroo pneumatics. Threads have to be
  // readable in the work, not just plausible about it.)
  //
  // (['mars','evosearch',1] RE-ROUTED to ['mars','genai',2] below: Rings of
  // Mars lists AI WORKFLOWS in its tech line and says "generative" three times
  // in its spine, and contains no genetic algorithm at all.)
  ['mars', 'genai', 2], // the early bet, two months before the note about it
  ['evosearch', 'solvers', 2],
  ['neuroaes', 'sensi', 2],
  ['neuroaes', 'podcast', 2],
  ['neuroaes', 'bim', 2],
  ['neuroaes', 'respond', 1],
  ['bim', 'neurospace', 3], // NeuroSpace = the first crack at BIM
  ['bim', 'comfort', 2],
  ['comfort', 'sensi', 3], // Sensi = comfort-as-data made real
  // (['ballooning','comfort',1] CUT at the walk, 2026-08-04. The market's whole
  // spine contains ONE comfort-adjacent word, "daylight", once: nothing
  // thermal, acoustic, olfactory or about a person, against a note whose
  // subject is six senses calibrated to an individual. It read as a thread
  // added to stop a node being lonely, and that node now carries three
  // honest ones: solvers, heritage and computation.
  //
  // Also ruled here: NO DIRECT neuroaes -> comfort thread. The path already
  // exists as neuroaes -> bim -> comfort, and that is the true three-step
  // argument (the research led to the reframing, the reframing led to the
  // scoring). A shortcut would flatten it.
  ['comfort', 'respond', 2],
  ['cappelletti', 'solvers', 2],
  ['huddle', 'heritage', 1],
  // S4b appends (2026-07-14, the set Emilie confirmed at the constellation
  // gate; urban-risk stands alone, no honest thread found):
  // (['huddle','heritage',1] CUT at the walk, 2026-08-04. The Huddle is WASP /
  // Kangaroo / Alpaca4D, its question is about building with the wind, and its
  // spine contains no heritage, historic, existing or preservation language at
  // all. Nothing in either text supported the thread.)
  ['heritage', 'narkomfin', 2], // a 1930 monument read with new tools
  ['evosearch', 'tsukiji', 1], // Galapagos drove the form hunt
  ['bim', 'data-geometry', 1], // building data made legible inside the model
  // S2 appends (2026-07-16, honest-lineage only; jemma + astroidal stand
  // alone like urban-risk, no honest thread found):
  ['homage', 'heritage', 2], // the thesis IS the heritage question, asked first
  ['playscape', 'solvers', 2], // Kangaroo pressure + net goals, solver play
  ['chair-sim', 'solvers', 2], // the same solver curiosity, aimed at a body
  // S5 appends (2026-07-18, Emilie confirmed the set at the batch gate):
  ['charcoal', 'drawiface', 2], // the drawing lesson grew into drawing-as-interface
  ['charcoal', 'solvers', 1], // the pull: tension drawn, then simulated
  // (['genai','pelagnou',1] removed with the note itself, 2026-07-29.)
  ['podcast', 'explain', 2], // explaining on air = the thought lived first
  ['legoarch', 'explain', 1], // the film that made the pipeline captivating
  // THE WORDS appends (2026-07-29, Emilie confirmed the set at the walk). The
  // five notes written this session threaded to NOTHING, which meant they
  // glowed no tiles on /work and grew no fibres in the neural world: five
  // neurons with no synapses, on a site whose whole argument is connection.
  ['comfort', 'learning', 2], // experience-as-data is the premise under scoring a room
  ['learning', 'sensi', 2],
  ['llm', 'sensi', 3], // Sensi IS an LLM copilot: the strongest link of the set
  ['genai', 'llm', 1],
  ['genai', 'latent', 2], // diffusion runs on it
  ['latent', 'legoarch', 1],
  ['scoring', 'comfort', 3], // the ethics thread. SEE THE NOTE: `comfort` says
  // the argument is "its own note now", which reads as a later split, and the
  // dates Emilie confirmed put scoring FIRST. Resolved at the walk: the comfort
  // note now reads "has a note of its own", so the prose makes no claim about
  // which came first and no longer contradicts the map. SIGNED 2026-08-04.
  ['neurospace', 'scoring', 2], // the weights are public so you can disagree
  // COMPUTATION GETS THE WIDER SET (her instruction: "computation gets much
  // more connections in terms of projects"). It is the one note that names a
  // method rather than a subject, so it is upstream of everything built by
  // describing a rule instead of drawing a result. Kept to projects where the
  // RULE is genuinely the artifact, not merely projects that used software.
  //
  // ALL EIGHT NOW RUN OUTWARD, and that is the date ruling, not a rewrite.
  // `rules` was dated to the week it was typed (2026-07), which made it the
  // sink every project drained into. Emilie dated the THINKING to 2025-10, the
  // month MaCAD begins, and the whole set inverted: computation stops being
  // where the work arrives and becomes the thing she learned first and then
  // spent a year applying. The comment above was already claiming "upstream of
  // everything built"; the data now actually says it.
  ['rules', 'legoarch', 2], // the incident the note turns on
  ['rules', 'evosearch', 2],
  ['rules', 'solvers', 2],
  ['rules', 'huddle', 2], // WASP aggregation: the growth rule is the building
  ['rules', 'cappelletti', 2], // the lattice came out of the loop, not the pen
  ['rules', 'ballooning', 1], // Kangaroo gave the balloons their physics
  ['rules', 'playscape', 1], // a same-month tie, written outward with its set
  ['rules', 'drawiface', 1], // the drawing as the place the thinking happens
  // THE WALK appends (2026-08-04). Every note read end to end in date order,
  // one at a time, Emilie ruling each thread from a drawn board.
  ['charcoal', 'explain', 1], // "nobody takes a room in detail by detail; you
  // catch the big picture and your mind fills in the rest" is a theory of
  // explanation, written about charcoal six years before the note on explaining
  //
  // T-105 `extended reality` had ONE thread, inbound from its own project. It
  // is the earliest note that reads as a method rather than a memory, and
  // everything it prefigures sits four years downstream:
  ['xreal', 'comfort', 2], // the body reports fast, and reports the worst thing
  ['xreal', 'learning', 2], // standing in the room IS the instrument
  ['xreal', 'explain', 2], // "impossible to explain and trivial to experience"
  //
  // T-116 `what an llm actually is` moved to 2025-09 at the date ruling, which
  // put it BEFORE MaCAD and before everything it explains. It stops being a
  // reflection and becomes a root, so it now hands three things forward:
  ['llm', 'latent', 2], // "which words tend to follow load bearing" IS the space
  ['llm', 'rules', 2], // one month apart: the machine does what you said, not
  // what you meant. The colleague who never says I do not know, and the brick
  // model that satisfied every constraint and stopped reading as architecture.
  ['llm', 'learning', 1], // the machine the premise is about
  //
  // T-119 `computation`: the purest case of its own thesis was an orphan.
  // (The Kangaroo overlap with `physics solvers` was raised at the walk and
  // Emilie ruled LEAVE BOTH: computation is upstream of all of it, so a project
  // sitting on both notes is honest rather than duplicated.)
  ['rules', 'astroidal', 2], // "can a math equation become a building?"
  //
  // T-108 `evolutionary search` NAMES Cappelletti in its own prose ("it handed
  // us two lattice topologies we'd never have drawn by hand") and had no thread
  // to it. Same class of miss as heritage/ballooning: the note's own worked
  // example, unthreaded. Strength 3 = the project IS the thing (GALAPAGOS sits
  // in its tech line and its spine says evolutionary twice).
  ['evosearch', 'cappelletti', 3],
  // And the note's real argument, escalated: "good has to become a number
  // before the search will believe it, so every quality you cannot count
  // quietly drops out of the competition. Lighter is easy. Legible is not."
  ['evosearch', 'scoring', 2], // the fitness function, aimed at a person
  ['evosearch', 'comfort', 2], // a single number is the wrong shape for a value
  //
  // T-103 `physics solvers` was a PURE SINK: six threads in, none out, on a
  // note that ends "it read the manual I wrote", which is the same idea
  // computation and evolutionary search both turn on. Both of these are
  // Kangaroo work, and `heritage` is the honest replacement for the
  // ['genai','heritage'] thread cut earlier the same day: the market's
  // computation is pneumatics, never diffusion.
  ['solvers', 'ballooning', 2], // "until Kangaroo gave them awareness"
  ['solvers', 'heritage', 2], // "only there to let something light touch
  // something old, very gently"
  //
  // T-102 `neuroaesthetics` was a pure source: four threads out, none in.
  ['neuroaes', 'learning', 2], // "other bodies have been in rooms like this
  // one, here is what happened to them" IS neuroaesthetics described as a
  // dataset, and the research note underneath it was not attached
  ['charcoal', 'neuroaes', 1], // the 2020 perception claim feeding the science
  // of perception in rooms. Its only inbound thread.
  //
  // T-109 `heritage meets new tech` spends its middle paragraph on the Bab
  // al-Luq market and already <Ref>s it in the prose, with no thread to it.
  // Third instance of this exact miss today, after evosearch/cappelletti and
  // the ballooning/solvers gap: A NOTE THAT NAMES A PROJECT IN ITS TEXT SHOULD
  // ALWAYS CARRY THE THREAD. Worth checking the remaining notes for it.
  ['heritage', 'ballooning', 3],
  //
  // T-101 `behavior information modeling`. The Sensi thread is the fourth and
  // last instance the new prose-Ref guard caught: the note says "NeuroSpace was
  // the first crack at it and Sensi was the second", NeuroSpace carried
  // strength 3 and Sensi carried nothing. Same strength, because the note gives
  // them the same standing.
  ['bim', 'sensi', 3],
  ['bim', 'scoring', 2], // "a score you can argue with beats a number you have
  // to trust" (this note) and "the weights are public so you can disagree with
  // them" (that one). The tightest lineage on the site, three months apart.
  ['bim', 'respond', 2], // the same rigor pointed at the body, then a room that
  // acts on it. This note is that note's parent and had no thread to it.
  //
  // T-107 `drawing as interface` was another pure sink, three in and none out.
  // The prose-Ref guard could not catch its biggest miss because the note
  // DESCRIBES the project instead of naming it: "when moving a slider redraws
  // the room and the score answers back" against NeuroSpace's own dek, "move a
  // slider and watch a browser score it live". Inbound, because NeuroSpace is
  // a month earlier: she built the live drawing, then wrote down what it meant.
  ['neurospace', 'drawiface', 2],
  ['drawiface', 'sensi', 2], // the score that answers back, three months on
  ['drawiface', 'explain', 1], // the artifact does the work, never reports it
  //
  // T-117 `latent space`. Fact-checked at the walk and it HOLDS: "the thin
  // parts are exactly where a model will invent something with total
  // confidence" matches the literature on sparse latent regions producing
  // confident output shaped by neighbouring dense ones. No edit.
  ['latent', 'adjacency', 2], // the embeddings the police-station graphs ran on
  ['xreal', 'latent', 1], // the exact negative, four years apart: "you don't
  // read the space, you stand in it" against "you cannot stand in it and it
  // does not care about your body". A contrast, not a descent, hence strength 1.
  //
  // T-118 `when the tool scores people`. The date ruling put it a month BEFORE
  // `comfort as data`, which inverted ['comfort','scoring'] into
  // ['scoring','comfort']. The comfort note's own "its own note now" implied a
  // later split and contradicted that, so those four words were changed at the
  // walk (see notes.tsx). The map shows when she thought it; the prose no
  // longer claims when she wrote it.
  ['scoring', 'urban-risk', 2], // street shape predicting crime IS the worry,
  // built. The most serious pairing on the site, and it closes an orphan.
  ['scoring', 'respond', 2], // "the dumb version of this is surveillance"
  ['scoring', 'sensi', 1], // where "the weights are public" costs something
  //
  // T-115 `experiences are data` had four threads in and one out.
  ['learning', 'respond', 2], // "would you like to know before you pour the
  // concrete?" is the question; respond is the building that answers it
  ['scoring', 'learning', 1], // "nobody curated your training set" against
  // "nobody forwards the methodology": what gets thrown away uncredited
  //
  // T-114 `adjacency is not access` was THE ORPHAN: no fibre on the map, no
  // glow on /work, on a site whose whole argument is connection. Six threads
  // now. Narkomfin is the same MaCAD module and the same method, which made it
  // the most obvious missing thread on the site.
  //
  // BOTH FLIPPED 2026-08-06, and the guard is what found it. They were written
  // adjacency -> project back when all three sat in 2026-06 and the tuple order
  // was a coin toss. Emilie then moved the two projects back (urban-risk to
  // 2026-04, narkomfin to 2026-05), which left the note firing BACKWARDS into
  // its own sources. Reversed, the lineage is also simply true: she built the
  // graphs first and the note came out of them. (The old comment claimed
  // Narkomfin was "the same month" as the note; that stopped being true with
  // the move, so it is gone rather than left to rot.)
  ['narkomfin', 'adjacency', 3],
  ['urban-risk', 'adjacency', 2], // "saying precisely where the certainty ends
  // was the most honest thing the pipeline produced" against "the interesting
  // result was a gap, not a number"
  ['bim', 'adjacency', 2], // every duct to the millimetre and nothing about the
  // person, aimed at a plan instead of a model
  ['rules', 'adjacency', 1], // the leftover after the subtraction IS the rule
  ['scoring', 'adjacency', 1], // "a confident picture of a building that is not
  // there" against "a score is small, portable and confident"
  //
  // T-110 `buildings that respond` had five threads in, none out and NO project
  // at all. Terminal is correct and Emilie confirmed it: the note describes the
  // future she is working toward, so nothing has come after it yet.
  ['lungs', 'respond', 2], // "a live app running a hyperbuilding designed to
  // filter a city's air": a building whose behaviour is the design, running
  // live. Proposal tense on both sides, so the Lungs ceiling holds.
  //
  // (Verve City Walk -> bim was PROPOSED and DECLINED at the walk: delivering a
  // BIM set does not make the tower part of the argument against BIM. That
  // ruling STANDS and no bim thread exists.
  //
  // ⚠ The rest of that note said Verve stayed an orphan "with The Encounter and
  // Falcon Square, all three by ruling". Emilie superseded it for two of the
  // three on 2026-08-16, when the book's footer rail became the thought each
  // project made her think of and two of its eight plates had nothing to name.
  // The two threads below are hers, and neither is the declined one: they make
  // a different claim about a different note. THE ENCOUNTER IS UNTOUCHED and is
  // still an orphan by the original ruling.)
  //
  // T-113 `explaining things`, the last note of the walk. Terminal because it
  // is the newest thing on the record, which is arithmetic and not a gap.
  ['scoring', 'explain', 1], // the note names "standards, data layers, scoring
  // models" as the boring subjects that decide how buildings treat people
  ['bim', 'explain', 1], // "keep the letters, change the noun" is explanation
  // design: this note's thesis, applied to her own coinage
  //
  // THE BOOK ASKED THE RECORD A QUESTION IT COULD NOT ANSWER (Emilie,
  // 2026-08-16). The printed rail now names the thought each project made her
  // think of, and six of the eight plates already had one. Two did not, so the
  // gap was in the record rather than in the page. Both are her calls, both
  // fire forward, and both light their project on the map as a side effect —
  // which is the point: these are threads first and footer lines second.
  ['xreal', 'soma', 2], // SEP 2022 -> FEB 2024. Her thread. The plate earns it
  // in its own words: Revit families built with the visualisation team, "3D
  // prints, renders, a VR walkthrough in Unreal", and a client putting on a
  // headset to walk a tower that did not exist yet. That is the XR note's
  // subject arriving in a delivery job, which is a different claim from the
  // declined bim one above.
  ['falcon', 'drawiface', 1], // APR 2022 -> MAR 2026, so the project is the
  // earlier end and the note is what it grew toward. The whole plate is ink:
  // takeoff pitches sketched by hand, the drawings mirrored twice until the
  // void closed, and the design led from the first sketch to the proposal.
  // Strength 1 by her call: the monument is drawing STEERING a build, where
  // the note is about drawing as the interface itself.
]

// THE PAIRS SHE HAS LOOKED AT AND RULED ARE NOT NEAR-MISSES (2026-08-07).
//
// The map now draws what is close but not yet joined: pairs with no thread
// between them and three or more threads in common (thoughts/world/nearMisses.ts
// derives the whole set — nothing here adds a candidate, this list only takes
// them away). It is an instrument for the writer, so it has to be able to take
// an answer: "I looked, and no."
//
// WITHOUT THIS THE INSTRUMENT IS BROKEN, not merely noisy. Every candidate is
// recomputed from CORRELATIONS on every build, so a pair she has already
// considered and declined would come back and ask again forever, and the list
// would never get shorter no matter how much work she did on it. A decline is a
// judgement she made once; the record keeps it.
//
// It is NOT a place to hide an inconvenient pair. Each row carries the reason,
// the same standard as a cut thread above. Empty is the honest starting state:
// the eighteen candidates have not been walked yet.
export const DECLINED_NEAR: readonly (readonly [string, string])[] = []
