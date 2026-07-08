// THE NOTEBOOK REGISTRY · single source of truth for the research record.
// Every dated thing Emilie ships or thinks is ONE entry here; the Home bench
// roll, the Notebook archive, the sheet routes, and the EXPLORE graph all
// read from this file. Adding a project = one entry + assets + (later) a
// sheet file.
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
// `dateDraft: true` marks months Emilie has not confirmed; `draftCopy: true`
// marks copy pending her sign-off. Both render normally but are greppable.
import type { Lens } from '../components/Lens'

export type EntryKind =
  | 'sheet'
  | 'project'
  | 'thought'
  | 'milestone'
  | 'award'
  | 'talk'
  | 'press'

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
  // Session 12: an APPENDED node (order past the frozen 21) opts out of the
  // implied-edge correction, so it can float unconnected instead of being
  // force-wired to degree 2. Ignored for the frozen prefix (their edges are
  // baked into frozen-layout.generated.ts).
  standalone?: boolean
}

export interface RegistryEntry {
  id: string // project/thought ids MUST match explore/data.js RAW ids
  kind: EntryKind
  date: string // 'YYYY-MM'
  dateDraft?: boolean
  title: string
  lens?: Lens
  tags: string[]
  sheet?: SheetRef
  note?: NoteRef // thought notes (Session 11): the written leaf at /thoughts/:id
  project?: string // slug join into projects.tsx for card data
  image?: { slug: string; name: string; alt: string }
  links?: { label: string; href: string }[]
  draftCopy?: boolean
  explore?: ExploreRef
}

const sheet = (number: string, status: SheetStatus): SheetRef => ({
  number,
  status,
  route: `/sheets/${number.toLowerCase()}`,
})

// The route is derived from the thought id (matches EXPLORE/data.js RAW ids),
// so a note ref never drifts from its /thoughts/:id leaf.
const note = (id: string, number: string, status: NoteStatus = 'drafted'): NoteRef => ({
  number,
  status,
  route: `/thoughts/${id}`,
})

export const ENTRIES: RegistryEntry[] = [
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
    sheet: sheet('P-101', 'issued'),
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
    sheet: sheet('P-102', 'issued'),
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
    sheet: sheet('P-104', 'issued'),
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
    sheet: sheet('P-101', 'issued'),
    project: 'sensi',
    image: { slug: 'sensi', name: 'app-shape', alt: 'Sensi interface scoring a floor plan across six senses' },
    explore: { label: 'SENSI', nodeKind: 'project', order: 0 },
  },
  {
    id: 'neurospace',
    kind: 'project',
    date: '2026-02',
    dateDraft: true,
    title: 'NeuroSpace',
    lens: 'computation',
    tags: ['neuro', 'geometry', 'simulation', 'data', 'web'],
    sheet: sheet('P-102', 'issued'),
    project: 'neurospace',
    image: { slug: 'neurospace', name: 'landing', alt: 'NeuroSpace landing page with parametric room and live scores' },
    explore: { label: 'NEUROSPACE', nodeKind: 'project', order: 1 },
  },
  {
    id: 'huddle',
    kind: 'project',
    date: '2025-12',
    dateDraft: true,
    title: 'The Huddle',
    lens: 'computation',
    tags: ['geometry', 'simulation', 'climate'],
    sheet: sheet('P-103', 'in-preparation'),
    project: 'huddle',
    image: { slug: 'huddle', name: 'axonometric', alt: 'Axonometric of The Huddle wind-adaptive module cluster' },
    explore: { label: 'THE HUDDLE', nodeKind: 'project', order: 2 },
  },
  {
    id: 'lungs',
    kind: 'project',
    date: '2026-03',
    dateDraft: true,
    title: 'The Lungs',
    lens: 'computation',
    tags: ['data', 'climate', 'web'],
    sheet: sheet('P-105', 'in-preparation'),
    project: 'lungs',
    image: { slug: 'lungs', name: 'tower', alt: 'The Lungs hyperbuilding tower over Santiago' },
    explore: { label: 'THE LUNGS', nodeKind: 'project', order: 3 },
  },
  {
    id: 'legoarch',
    kind: 'project',
    date: '2026-05',
    dateDraft: true,
    title: 'lEgoarCh',
    lens: 'computation',
    tags: ['ai', 'geometry', 'play'],
    sheet: sheet('P-106', 'in-preparation'),
    project: 'legoarch',
    image: { slug: 'legoarch', name: 'sagrada-render', alt: 'lEgoarCh generated LEGO set of the Sagrada Familia' },
    explore: { label: 'LEGOARCH', nodeKind: 'project', order: 4 },
  },
  {
    id: 'ballooning',
    kind: 'project',
    date: '2026-04',
    dateDraft: true,
    title: 'A Ballooning Market',
    lens: 'computation',
    tags: ['simulation', 'geometry', 'heritage', 'play'],
    sheet: sheet('P-104', 'issued'),
    project: 'ballooning-market',
    image: { slug: 'ballooning-market', name: 'render-1', alt: 'CMY balloons packed into the steel frame of Bab al-Luq market' },
    explore: { label: 'A BALLOONING MARKET', nodeKind: 'project', order: 5 },
  },
  {
    id: 'podcast',
    kind: 'project',
    date: '2026-01',
    dateDraft: true,
    title: 'Optimizing for the Mind',
    lens: 'computation',
    tags: ['neuro', 'ai', 'research', 'future'],
    sheet: sheet('P-107', 'in-preparation'),
    project: 'podcast',
    links: [{ label: 'SPOTIFY', href: 'https://open.spotify.com/episode/6WpF5HmKteEBateSqSWe0D' }],
    explore: { label: 'OPTIMIZING FOR THE MIND', nodeKind: 'project', order: 6 },
  },
  {
    id: 'soma',
    kind: 'project',
    date: '2024-02',
    dateDraft: true,
    title: 'Towers at SOMA',
    lens: 'practice',
    tags: ['geometry', 'practice', 'heritage'],
    sheet: sheet('P-108', 'in-preparation'),
    project: 'soma-towers',
    image: { slug: 'professional', name: 'citywalk', alt: 'City Walk tower facade study, Dubai' },
    explore: { label: 'TOWERS AT SOMA', nodeKind: 'project', order: 7 },
  },
  {
    id: 'mars',
    kind: 'project',
    date: '2023-10',
    dateDraft: true,
    title: 'Rings of Mars: Ring 4000',
    lens: 'practice',
    tags: ['ai', 'practice', 'future'],
    sheet: sheet('P-109', 'in-preparation'),
    project: 'marsception',
    image: { slug: 'professional', name: 'marsception', alt: 'Rings of Mars competition entry visualization' },
    explore: { label: 'RING 4000', nodeKind: 'project', order: 8 },
  },
  {
    id: 'cappelletti',
    kind: 'project',
    date: '2025-11',
    dateDraft: true,
    title: 'Cappelletti Pavilion',
    lens: 'explorations',
    tags: ['geometry', 'simulation', 'play', 'research'],
    sheet: sheet('P-110', 'in-preparation'),
    project: 'cappelletti',
    image: { slug: 'cappelletti', name: 'poster', alt: 'Cappelletti Pavilion poster with pasta-derived shell structure' },
    explore: { label: 'CAPPELLETTI PAVILION', nodeKind: 'project', order: 9 },
  },
  {
    id: 'xr',
    kind: 'project',
    date: '2022-06',
    dateDraft: true,
    title: 'XR for Education',
    lens: 'explorations',
    tags: ['xr', 'research', 'play', 'education'],
    sheet: sheet('P-111', 'in-preparation'),
    project: 'xr-lab',
    explore: { label: 'XR FOR EDUCATION', nodeKind: 'project', order: 10 },
  },

  // ---- Thoughts (explore order 11-20; labels verbatim from data.js;
  //      dates are Emilie-pending drafts) ----------------------------------
  {
    id: 'bim',
    kind: 'thought',
    date: '2026-01',
    dateDraft: true,
    draftCopy: true,
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
    dateDraft: true,
    draftCopy: true,
    title: 'neuroaesthetics',
    lens: 'computation',
    tags: ['neuro', 'research'],
    note: note('neuroaes', 'T-102'),
    explore: { label: 'neuroaesthetics', nodeKind: 'thought', order: 12 },
  },
  {
    id: 'solvers',
    kind: 'thought',
    date: '2026-04',
    dateDraft: true,
    draftCopy: true,
    title: 'physics solvers',
    lens: 'explorations',
    tags: ['simulation', 'geometry'],
    note: note('solvers', 'T-103'),
    explore: { label: 'physics solvers', nodeKind: 'thought', order: 13 },
  },
  {
    id: 'genai',
    kind: 'thought',
    date: '2024-06',
    dateDraft: true,
    draftCopy: true,
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
    dateDraft: true,
    draftCopy: true,
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
    dateDraft: true,
    draftCopy: true,
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
    dateDraft: true,
    draftCopy: true,
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
    dateDraft: true,
    draftCopy: true,
    title: 'evolutionary search',
    lens: 'explorations',
    tags: ['simulation', 'ai'],
    note: note('evosearch', 'T-108'),
    explore: { label: 'evolutionary search', nodeKind: 'thought', order: 18 },
  },
  {
    id: 'heritage',
    kind: 'thought',
    date: '2026-04',
    dateDraft: true,
    draftCopy: true,
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
    dateDraft: true,
    draftCopy: true,
    title: 'buildings that respond',
    lens: 'computation',
    tags: ['neuro', 'future', 'data', 'comfort'],
    note: note('respond', 'T-110'),
    explore: { label: 'buildings that respond', nodeKind: 'thought', order: 20 },
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
    id: 'barch-grad',
    kind: 'milestone',
    date: '2023-06',
    dateDraft: true,
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
    title: 'Project Architect · Dynamic Solution · Kuwait',
    tags: ['practice'],
  },
  {
    id: 'macad-start',
    kind: 'milestone',
    date: '2025-10',
    dateDraft: true,
    title: 'MaCAD begins · IAAC · Beirut > Barcelona',
    tags: ['research'],
  },
  {
    id: 'macad-y1',
    kind: 'milestone',
    date: '2026-06',
    dateDraft: true,
    title: 'MaCAD Year 1 complete · the technical year',
    tags: ['research'],
  },

  // ---- Awards + press (the credibility layer; years from cv.ts,
  //      months are drafts) ------------------------------------------------
  {
    id: 'sensi-macad-award',
    kind: 'award',
    date: '2026-06',
    dateDraft: true,
    title: 'MaCAD Awards · Design Copilots · winner (Sensi)',
    lens: 'computation',
    tags: ['ai', 'research'],
  },
  {
    id: 'legoarch-jury',
    kind: 'award',
    date: '2026-05',
    dateDraft: true,
    title: 'Jury award · AIA Generative AI (lEgoarCh)',
    lens: 'computation',
    tags: ['ai'],
  },
  {
    id: 'lungs-award',
    kind: 'award',
    date: '2026-03',
    dateDraft: true,
    title: 'Studio award · BIMSC (The Lungs)',
    lens: 'computation',
    tags: ['data'],
  },
  {
    id: 'huddle-award',
    kind: 'award',
    date: '2025-12',
    dateDraft: true,
    title: 'Studio award · ACESD (The Huddle)',
    lens: 'computation',
    tags: ['simulation'],
  },
  {
    id: 'biennale',
    kind: 'press',
    date: '2024-04',
    dateDraft: true,
    title: 'Design project featured · Biennale Arte 2024 · Venice',
    tags: ['practice'],
  },
  {
    id: 'mars-top50',
    kind: 'award',
    date: '2024-03',
    dateDraft: true,
    title: 'Top 50 · Marsception (Ring 4000)',
    lens: 'practice',
    tags: ['ai', 'future'],
  },
  {
    id: 'tamayouz',
    kind: 'award',
    date: '2023-09',
    dateDraft: true,
    title: 'Tamayouz Excellence · Top 100 graduation projects',
    tags: ['practice'],
  },
  {
    id: 'cemetery',
    kind: 'award',
    date: '2022-06',
    dateDraft: true,
    title: 'Shortlisted finalist · The Cemetery Challenge',
    tags: ['practice'],
  },
]

// ---- Selectors ------------------------------------------------------------

export const byDateDesc = (a: RegistryEntry, b: RegistryEntry) =>
  b.date.localeCompare(a.date)

export function timelineEntries(): RegistryEntry[] {
  return [...ENTRIES].sort(byDateDesc)
}

export function entriesByYear(): [string, RegistryEntry[]][] {
  const years = new Map<string, RegistryEntry[]>()
  for (const e of timelineEntries()) {
    const y = e.date.slice(0, 4)
    const list = years.get(y)
    if (list) list.push(e)
    else years.set(y, [e])
  }
  return [...years.entries()]
}

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
