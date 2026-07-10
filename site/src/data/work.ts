// THE WORK RENDITION (Session R2) · the gallery's card object.
//
// ONE CONTENT, TWO RENDITIONS: this file derives the exact card object that
// both the /work grid AND the printed book's INDEX page (R7) map over. The
// registry stays the single source (project entries, sheet number/status, the
// award refIds); projects.tsx carries the card copy (title, lens, tech, award
// wording, blurb, the dek). Nothing is authored here; it is composed here.
//
// THE HERO RULE (Emilie, 2026-07-09): the opened preview leads with the work,
// and one hero is chosen by a fixed priority from the assets a project has:
//
//     video  >  live app  >  photo  >  audio  >  text
//
// Everything else falls into supporting roles (extra photos -> strip, award ->
// recognition line, tech -> mono row). The rule is data-driven, so a new
// project picks its member automatically and the gallery needs zero layout
// work per entry (THE ECONOMY: cheap to update from the registry).
//
// PREVIEW, NOT PAGE: the card is a preview. Depth (code, findings, cinema)
// lives on the full project page, linked ONLY where an issued sheet exists, so
// the link can never dead-end into a placeholder. The rich card-as-experience
// is a later, dedicated session.
import type { ReactNode } from 'react'
import type { Lens } from '../components/Lens'
import { ENTRIES, type RegistryEntry, type SheetStatus } from './registry'
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
  slug: string // projects.tsx slug
  number: string // quiet label, e.g. 'P-101'
  status: SheetStatus // 'issued' | 'in-preparation'
  date: string // 'YYYY-MM', drives newest-first
  title: string
  lens: Lens
  tags: string[]
  dek: string // the one authored "what it proves" line (draftCopy)
  tech: string // the mono tech row
  recognition?: string // award wording where real; ink, no box, never red
  awardFace?: string // the face's corner-pill short wording (DL-2; falls back to recognition)
  hasFullPage: boolean // a real deep page exists (issued sheet)
  fullPageRoute?: string // set ONLY where hasFullPage, so it never dead-ends
  // hero + supporting slots, resolved by the hero rule above
  hero: HeroKind
  cover?: WorkPicture // the 4:3 grid tile (undefined -> typographic tile)
  heroVideo?: { slug: string; name: string; ariaLabel: string }
  live?: { href: string; label: string } // TRY IT LIVE launch (live hero)
  audio?: { href: string; label: string } // Spotify (audio hero)
  pullQuote?: { text: string; source: string } // the audio hero's lead line
  strip: WorkPicture[] // supporting pictures
  links: { label: string; href: string }[] // links not already used as hero
  story: ReactNode // the project blurb, reused verbatim
  draftCopy: boolean // the dek is unsigned until Emilie approves it
}

type ImgRow = { name: string }

// Slugs referenced by more than one project (only 'professional' today: SOMA +
// Marsception share a folder). A shared slug shows NO strip, so one project
// never borrows the other's frames. Mirrors MiniSheet's SHARED_SLUGS rule.
const SHARED_SLUGS = (() => {
  const count = new Map<string, number>()
  for (const e of ENTRIES) {
    if (e.image) count.set(e.image.slug, (count.get(e.image.slug) ?? 0) + 1)
  }
  return new Set([...count].filter(([, n]) => n > 1).map(([slug]) => slug))
})()

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

  const issued = entry.sheet.status === 'issued'
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
    tech: p.tech,
    // Recognition wording lives with the card copy; membership is guaranteed
    // to agree with AWARD_WINNER_IDS by the registry validator (never drifts).
    // The face's corner pill takes the short form where one exists (DL-2: the
    // face carries the least); the preview renders the full line verbatim.
    recognition: p.award,
    awardFace: p.awardShort ?? p.award,
    hasFullPage: issued,
    fullPageRoute: issued ? entry.sheet.route : undefined,
    hero,
    cover,
    heroVideo,
    live,
    audio,
    pullQuote: p.pullQuote,
    strip: stripFor(p.image?.slug, p.image?.name, p.title),
    links: p.links.filter((l) => l.href !== consumedHref),
    story: p.blurb,
    // A dek ships unsigned (Section 14) until Emilie signs it in a copy pass
    // (dekSigned, projects.tsx); the flag retires per project, never in bulk.
    draftCopy: !p.dekSigned,
  }
}

// The gallery's single export: every project, newest first. Consumed by the
// /work grid and (R7) the book index page unchanged.
export const WORK_ENTRIES: WorkEntry[] = ENTRIES.filter((e) => e.kind === 'project')
  .map(toWorkEntry)
  .filter((w): w is WorkEntry => w !== null)
  .sort((a, b) => b.date.localeCompare(a.date))

export function workEntryById(id: string): WorkEntry | undefined {
  return WORK_ENTRIES.find((w) => w.id === id)
}

// The lens facets present in the gallery, in the canonical order, filtered to
// those actually used. An OPEN SET: a new lens appears here automatically.
const LENS_ORDER: Lens[] = ['computation', 'practice', 'explorations']
export const WORK_LENSES: Lens[] = LENS_ORDER.filter((l) =>
  WORK_ENTRIES.some((w) => w.lens === l),
)
