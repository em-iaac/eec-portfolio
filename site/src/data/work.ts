// THE WORK RENDITION (Session R2, grown into the SHOWCASE at G1).
//
// ONE CONTENT, TWO RENDITIONS: this file derives the exact object that both
// the /work grid AND the printed book's INDEX page (R7) map over. The
// registry stays the single source (project entries, sheet number/status,
// the award refIds); the MASTER CONTENT FILES (src/content/projects/, G1)
// carry everything the project says: card copy AND the showcase spine.
// Nothing is authored here; it is composed here.
//
// THE HERO RULE (Emilie, 2026-07-09): the opened showcase leads with the
// work, and one hero is chosen by a fixed priority from the assets a project
// has:
//
//     video  >  live app  >  photo  >  audio  >  text
//
// Everything else falls into supporting roles (extra photos -> strip, award ->
// recognition line, tech -> mono row). The rule is data-driven, so a new
// project picks its member automatically and the gallery needs zero layout
// work per entry (THE ECONOMY: cheap to update from the registry).
//
// THE SHOWCASE, NOT A PREVIEW (G1, Emilie's model change executed): the
// opened card IS the project's whole page, deep-linkable at /work/:id. Its
// spine (signed 2026-07-10): WHAT · WHY · HOW · WHAT CAME OF IT, then tools,
// then links OUT to repo / blog / live. Depth stays in the linked repo/blog;
// the Pen Table sheet tier retired with G1 (/sheets/* redirects here).
import type { ReactNode } from 'react'
import type { Lens } from '../components/Lens'
import { ENTRIES, awardHrefFor, type RegistryEntry, type SheetStatus } from './registry'
import { PROJECTS_BY_SLUG, type Project } from './projects'
import images from './images.json'
import videos from './videos.json'

export type HeroKind = 'video' | 'live' | 'photo' | 'audio' | 'text'

export interface WorkPicture {
  slug: string
  name: string
  alt: string
}

export interface WorkEntry {
  id: string // registry project id (permanent; citations resolve for years)
  slug: string // master file slug (content/projects)
  number: string // quiet label, e.g. 'P-101'
  status: SheetStatus // 'issued' | 'in-preparation'
  date: string // 'YYYY-MM', drives newest-first
  title: string
  lens: Lens
  tags: string[]
  dek: string // the one authored "what it proves" line; the showcase's claim
  question?: string // D4 (S4/S5): the one question the project answers; headData prefers it as the meta description
  meta: string // the plate's credit/context row (e.g. 'MACAD STUDIO · TEAM OF 4')
  tech: string // the mono tech row
  stat?: string // Session 7: the one defensible number, data-plate style
  recognition?: string // award wording where real; ink, no box, never red
  awardFace?: string // the face's corner-pill short wording (DL-2; falls back to recognition)
  awardHref?: string // FLAG-03: the announcement/IAAC URL once it exists; the pill becomes a link (registry is the single source)
  // hero + supporting slots, resolved by the hero rule above
  hero: HeroKind
  cover?: WorkPicture // the 4:3 grid tile (undefined -> typographic tile)
  heroVideo?: { slug: string; name: string; ariaLabel: string }
  live?: { href: string; label: string } // TRY IT LIVE launch (live hero)
  audio?: { href: string; label: string } // Spotify (audio hero)
  pullQuote?: { text: string; source: string } // the audio hero's lead line
  strip: WorkPicture[] // supporting pictures
  links: { label: string; href: string }[] // links not already used as hero
  // The showcase spine (G1, signed): WHAT + WHY always present; HOW and
  // OUTCOME only where real material exists (a thin showcase is honest).
  what: ReactNode
  why: ReactNode
  how?: ReactNode[]
  outcome?: ReactNode
  showcaseDraft: boolean // the spine prose is unsigned until Emilie signs it
  featured: boolean // S4 (D2): in the /work featured tier (leads, larger)
}

type ImgRow = { name: string }

// Slugs referenced by more than one project (only 'professional' today: SOMA +
// Marsception share a folder). A shared slug shows NO strip, so one project
// never borrows the other's frames.
const SHARED_SLUGS = (() => {
  const count = new Map<string, number>()
  for (const e of ENTRIES) {
    if (e.image) count.set(e.image.slug, (count.get(e.image.slug) ?? 0) + 1)
  }
  return new Set([...count].filter(([, n]) => n > 1).map(([slug]) => slug))
})()

// THE FEATURED TIER (S4, D2; Emilie signed the set + the order at the gate,
// 2026-07-13). ONE source of truth for "featured", by slug (not "top N by
// date"), so it stays stable when S4b appends the supporting blog projects.
// The award + live-app + research core, strongest three first. The gallery
// leads with these at full size; the landing mind-graph and the /thoughts
// world still show EVERYTHING (this is a /work reading order only).
const FEATURED_SLUGS: readonly string[] = [
  'sensi',
  'neurospace',
  'legoarch',
  'lungs',
  'huddle',
  'podcast',
]
// rank within the tier; Infinity = supporting (sorts after, by date).
const featuredRank = (slug: string): number => {
  const i = FEATURED_SLUGS.indexOf(slug)
  return i === -1 ? Infinity : i
}

const humanize = (name: string) => name.replace(/-/g, ' ')

// The supporting strip: every other frame in the cover's own folder, hero
// excluded, shared folders suppressed. Alt text is derived, never blank.
function stripFor(slug: string | undefined, coverName: string | undefined, title: string): WorkPicture[] {
  if (!slug || SHARED_SLUGS.has(slug)) return []
  const all = (images as Record<string, ImgRow[]>)[slug] ?? []
  return all
    .filter((i) => i.name !== coverName)
    .map((i) => ({ slug, name: i.name, alt: `${title}: ${humanize(i.name)}` }))
}

// The hero rule, applied to one project's assets. Returns the winning member
// plus whichever link it consumed (so the links row does not repeat it).
function resolveHero(p: Project): {
  hero: HeroKind
  heroVideo?: WorkEntry['heroVideo']
  live?: WorkEntry['live']
  audio?: WorkEntry['audio']
  consumedHref?: string
} {
  const vids = (videos as Record<string, ImgRow[]>)[p.slug]
  if (vids?.length) {
    return {
      hero: 'video',
      heroVideo: { slug: p.slug, name: vids[0]!.name, ariaLabel: `${p.title} demo` },
    }
  }
  // A hero consumes its link (drops it from the links row) ONLY when it can
  // actually render: the live launch needs the cover to sit behind it, the
  // listening hero needs its pull-quote. Otherwise fall through, leaving the
  // link in the row so it never disappears.
  const live = p.links.find((l) => /\blive\b/i.test(l.label))
  if (live && p.image) return { hero: 'live', live: { href: live.href, label: live.label }, consumedHref: live.href }
  if (p.image) return { hero: 'photo' }
  const audio = p.links.find((l) => /spotify/i.test(l.label))
  if (audio && p.pullQuote) {
    return { hero: 'audio', audio: { href: audio.href, label: audio.label }, consumedHref: audio.href }
  }
  return { hero: 'text' }
}

function toWorkEntry(entry: RegistryEntry): WorkEntry | null {
  const p = entry.project ? PROJECTS_BY_SLUG[entry.project] : undefined
  if (!p || !entry.sheet || !entry.lens || !p.dek) return null

  const { hero, heroVideo, live, audio, consumedHref } = resolveHero(p)
  const cover = p.image
    ? { slug: p.image.slug, name: p.image.name, alt: p.image.alt }
    : undefined

  return {
    id: entry.id,
    slug: p.slug,
    number: entry.sheet.number,
    status: entry.sheet.status,
    date: entry.date,
    title: p.title,
    lens: entry.lens,
    tags: entry.tags,
    dek: p.dek,
    question: p.question,
    // The plate rows (S4a): the showcase now mirrors the printed spread, so
    // it reads the same meta credit line + stat the book plate prints.
    meta: p.meta,
    tech: p.tech,
    stat: p.stat,
    // Recognition wording lives with the card copy; membership is guaranteed
    // to agree with AWARD_WINNER_IDS by the registry validator (never drifts).
    // The face's corner pill takes the short form where one exists (DL-2: the
    // face carries the least); the showcase renders the full line verbatim.
    recognition: p.award,
    awardFace: p.awardShort ?? p.award,
    awardHref: awardHrefFor(entry.id),
    hero,
    cover,
    heroVideo,
    live,
    audio,
    pullQuote: p.pullQuote,
    strip: stripFor(p.image?.slug, p.image?.name, p.title),
    links: p.links.filter((l) => l.href !== consumedHref),
    what: p.what,
    why: p.why,
    how: p.how,
    outcome: p.outcome,
    // The G1 spine prose ships flagged until Emilie signs it. (The dek flag
    // left this object at G4: every dek is dekSigned in its content file, and
    // nothing ever consumed the derived field.)
    showcaseDraft: p.showcaseDraft,
    featured: featuredRank(p.slug) !== Infinity,
  }
}

// The gallery's single export, in READING ORDER (S4, D2): the featured tier
// first (by its signed rank), then everything else newest-first. The /work
// grid splits it into the two tiers; the book index reuses it in this same
// strongest-first order. When both entries are supporting, featuredRank is
// Infinity for each, so the rank branch is skipped and date decides.
export const WORK_ENTRIES: WorkEntry[] = ENTRIES.filter((e) => e.kind === 'project')
  .map(toWorkEntry)
  .filter((w): w is WorkEntry => w !== null)
  .sort((a, b) => {
    const ra = featuredRank(a.slug)
    const rb = featuredRank(b.slug)
    if (ra !== rb) return ra - rb
    return b.date.localeCompare(a.date)
  })

export function workEntryById(id: string): WorkEntry | undefined {
  return WORK_ENTRIES.find((w) => w.id === id)
}

// The lens facets present in the gallery, in the canonical order, filtered to
// those actually used. An OPEN SET: a new lens appears here automatically.
const LENS_ORDER: Lens[] = ['computation', 'practice', 'explorations']
export const WORK_LENSES: Lens[] = LENS_ORDER.filter((l) =>
  WORK_ENTRIES.some((w) => w.lens === l),
)
