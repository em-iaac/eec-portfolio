// THE GALLERY (Session R2, re-skinned DL-2 2026-07-10) · /work. A uniform grid
// of every project where a visitor browses the work visually, then opens any
// card as a glass sheet lifted over the dimmed grid. This is the landing's
// proof path, so it must be excellent and fast.
//
// One data object drives it: WORK_ENTRIES (data/work.ts), the same object the
// printed book's INDEX page (R7) will reuse. The lens filter is an OPEN facet
// set (a new lens appears by itself). The overlay is URL-addressable at
// /work/:id so a single card is shareable and prerenderable (R9).
//
// DL-2: the page simply FOLLOWS the mode (the R2 dark lean retired at DL-1);
// faces are the glass Card primitive, the filter is FilterPill, the preview is
// the glass-2 sheet, and the card <-> sheet <-> page morphs ride the DL-1
// naming convention (lib/viewTransition.ts).
//
// Copy: all 11 deks were SIGNED by Emilie in the DL-2 copy pass (in chat,
// 2026-07-10; dekSigned in the content files); the page's intro line retired
// at G2 (no page intros, sitewide). New copy on this surface ships draftCopy
// until she signs it, as always (Section 14).
import { useEffect, useRef, useState } from 'react'
// G1 (2026-07-10): the opened card IS the showcase now (WorkOverlay grew the
// signed spine; the Pen Table sheet tier retired, /sheets/* redirects here).
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import ThoughtIndexRows from '../components/ThoughtIndexRows'
import WorkCard from '../components/work/WorkCard'
import WorkGroundTools, { BookDownloadLink, WorkFilterRow } from '../components/work/WorkPillTools'
import WorkOverlay from '../components/work/WorkOverlay'
import { LENSES, type Lens } from '../components/Lens'
import { CORRELATIONS, thoughtIndexEntries } from '../data/registry'
import { WORK_ENTRIES, workEntryById } from '../data/work'

// THE CROSS-GLOW (LOOK & ORDER, Emilie's gate 2026-07-18): hovering a thought
// row softly rings the work tiles it is correlated to, the mind-graph's braid
// made visible on the index. Derived once from the registry CORRELATIONS
// (idea lineage only); a thought with no honest thread glows nothing.
const WORK_IDS = new Set(WORK_ENTRIES.map((w) => w.id))
const GLOW_MAP: Record<string, readonly string[]> = (() => {
  const m: Record<string, string[]> = {}
  for (const [a, b] of CORRELATIONS) {
    if (WORK_IDS.has(b) && !WORK_IDS.has(a)) (m[a] ??= []).push(b)
    else if (WORK_IDS.has(a) && !WORK_IDS.has(b)) (m[b] ??= []).push(a)
  }
  return m
})()

// (The lens filter row + book link live in components/work/WorkToolbar:
// one filter, rendered by the lg+ docked row AND the mobile stacked header
// below. The round-4 full-width bar retired at the audit gate, 2026-07-19.)

export default function Work() {
  const { id } = useParams()
  const { hash } = useLocation()
  const navigate = useNavigate()

  const lens = (hash.replace('#', '') || null) as Lens | null
  const activeLens = lens && lens in LENSES ? lens : null

  const entries = activeLens ? WORK_ENTRIES.filter((w) => w.lens === activeLens) : WORK_ENTRIES

  // THE BOOK INDEX (REINDEX, Emilie's gate 2026-07-16): the featured/more-work
  // split retired for ONE uniform grid, every project the same size, like the
  // printed book's index page. The strongest still lead: WORK_ENTRIES carries
  // the featured-first order, and `featured` keeps steering eager loading.

  // The thoughts rows follow the same facet (a lens with no thoughts simply
  // shows none; the section hides rather than sitting empty).
  const thoughts = thoughtIndexEntries().filter((t) => !activeLens || t.lens === activeLens)

  const selected = id ? workEntryById(id) : undefined

  // #thoughts is a section anchor, not a lens facet (the facet parse above
  // ignores it): a note page's "ALL THOUGHTS" corridor lands on the list.
  useEffect(() => {
    if (hash === '#thoughts') {
      document.getElementById('thoughts')?.scrollIntoView({ behavior: 'auto', block: 'start' })
    }
  }, [hash])

  // A bad /work/:id (renamed or typo'd) cleans itself back to the grid rather
  // than showing nothing; IDs are permanent so this is rare, never a 404.
  // On close (an open id -> no id), return focus to the card that opened the
  // preview: the navigate-driven unmount defeats <dialog>'s own focus return,
  // so restore it by hand (keyboard users land back where they were).
  const prevId = useRef<string | undefined>(undefined)
  useEffect(() => {
    if (id && !selected) {
      navigate('/work', { replace: true })
      return
    }
    if (!id && prevId.current) {
      document.querySelector<HTMLElement>(`[data-work-card="${prevId.current}"]`)?.focus()
    }
    prevId.current = id
  }, [id, selected, navigate])

  // (S3: the title-follows-the-showcase effect retired; lib/routeHead.ts
  // sets the title from the /work/:id pathname, same single source.)

  // viewTransition: the card face morphs into the showcase sheet and back
  // (shared view-transition-name, lib/viewTransition.ts); browsers without
  // the API just swap.
  const open = (entryId: string) => navigate(`/work/${entryId}${hash}`, { viewTransition: true })
  const close = () => navigate(`/work${hash}`, { replace: true, viewTransition: true })

  // THE CROSS-GLOW state: the rail lifts the hovered thought id; the tiles it
  // correlates to wear data-glow (language.css draws the quiet ink ring).
  const [glowThought, setGlowThought] = useState<string | null>(null)
  const glowIds = glowThought ? new Set(GLOW_MAP[glowThought] ?? []) : null

  // One card in a list item; `priorityCount` eager-loads the first images
  // (they are above the fold). morphSource yields the entry's
  // view-transition-name to the open overlay (one element per name per state).
  // Every face is the PLATE now (the LOOK & ORDER gate, 2026-07-18).
  const cards = (list: typeof entries, priorityCount: number) =>
    list.map((entry, i) => (
      <li key={entry.id} className="flex" data-glow={glowIds?.has(entry.id) ? '' : undefined}>
        <WorkCard
          entry={entry}
          onOpen={() => open(entry.id)}
          priority={i < priorityCount}
          morphSource={selected?.id !== entry.id}
        />
      </li>
    ))

  const SECTION_LABEL =
    'font-mono text-[10px] tracking-[0.12em] text-[var(--lang-ink-muted)] uppercase'

  return (
    // TOOLS ON THE GROUND, ON THE SIDE (the design audit, Emilie's ruling
    // round 3, 2026-07-19): the nav pill is identical to every room's;
    // /work's tools ride the ground at the pill's line (pillTools ->
    // TitleBlock's slot; placement in .pill-tools, language.css). The grid
    // takes the full width, THE THOUGHTS close the page, and below lg the
    // stacked header returns (minus the retired kicker tier).
    <SheetPage wide pillTools={<WorkGroundTools active={activeLens} />}>
      {/* ONE h1 for every size: visible under the pill on small screens,
          sr-only on lg+ (the lit WORK door on the header line names the room;
          repeating it next to itself is the redundancy this audit retired). */}
      <h1
        id="work-heading"
        className="pt-4 text-3xl font-semibold tracking-[-0.01em] text-[var(--lang-ink)] lg:sr-only lg:pt-0"
      >
        Work
      </h1>
      {/* The stacked tools, MOBILE ONLY (the header line carries them on lg+).
          The room-sign kicker retired at the audit gate (2026-07-19): the
          nav says where you are, the title says it once. */}
      <section className="pt-3 pb-4 lg:hidden" aria-label="Work filters">
        {/* The intro line retired at G2; the count line retired at G-FLUFF. */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <WorkFilterRow active={activeLens} />
          <BookDownloadLink className="-my-2 -mx-2" />
        </div>
      </section>
      {/* An invisible announcer keeps the filter change audible for screen
          readers, in main so it lives in an always-rendered region. */}
      <p className="sr-only" aria-live="polite">
        {entries.length} {entries.length === 1 ? 'project' : 'projects'}
        {activeLens ? ` · ${LENSES[activeLens].label}` : ''}
      </p>

      {/* ONE uniform grid, filtered or not (the book index's manner): two
          per row on phones, the printed index's 7-across on xl (21 tiles =
          exactly 3 rows at 186px, the one-page fit with the bar above). */}
      <ul className="grid list-none grid-cols-2 gap-3 p-0 pb-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7">
        {cards(entries, 7)}
      </ul>

      {/* THE THOUGHTS (REINDEX, Emilie's IA gate 2026-07-16): the printed
          index's T-numbered contents rows, the site's one thoughts list.
          Round 4 (her pick of option B): they CLOSE the page below the grid,
          in three columns on xl so every title holds one line; the rail
          mechanic survives (ink + the verbatim opening + the cross-glow up
          onto the correlated tiles). */}
      {thoughts.length > 0 && (
        // S5: pt/pb trimmed 4 -> 2 when the thoughts grew to 13 (T-111..113)
        // so the one-page promise holds at 1280x800 (was 14px over).
        <section id="thoughts" aria-labelledby="thoughts-list-heading" className="pt-1 pb-0">
          <h2 id="thoughts-list-heading" className={SECTION_LABEL}>
            The Thoughts
          </h2>
          <ThoughtIndexRows
            skin="screen"
            lens={activeLens}
            variant="wide"
            onThoughtHover={setGlowThought}
          />
        </section>
      )}

      {selected && <WorkOverlay key={selected.id} entry={selected} onClose={close} />}
    </SheetPage>
  )
}
