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
import { useEffect, useRef } from 'react'
// G1 (2026-07-10): the opened card IS the showcase now (WorkOverlay grew the
// signed spine; the Pen Table sheet tier retired, /sheets/* redirects here).
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import ThoughtIndexRows from '../components/ThoughtIndexRows'
import WorkCard from '../components/work/WorkCard'
import WorkOverlay from '../components/work/WorkOverlay'
import { FilterPill, LensMark } from '../components/ui/Pill'
import { LENSES, type Lens } from '../components/Lens'
import { thoughtIndexEntries } from '../data/registry'
import { WORK_ENTRIES, WORK_LENSES, workEntryById } from '../data/work'

// The lens facet filter: ALL + one pill per lens present, hash-synced so a
// filtered view is shareable (the old notebook's mechanism). Active reads solid
// ink, never redline (red is liveness, not a category, rule 1); each lens
// pill leads with its shape mark so colour never means alone.
function FilterBar({ active }: { active: Lens | null }) {
  return (
    <div className="-mx-1 flex flex-wrap items-center">
      <div className="flex flex-wrap items-center" role="group" aria-label="Filter by lens">
      <FilterPill
        as={Link}
        to="/work"
        viewTransition
        active={active === null}
        aria-current={active === null ? 'true' : undefined}
        className="px-1"
      >
        ALL
      </FilterPill>
      {WORK_LENSES.map((l) => (
        <FilterPill
          key={l}
          as={Link}
          to={`/work#${l}`}
          viewTransition
          active={active === l}
          aria-current={active === l ? 'true' : undefined}
          leading={<LensMark lens={l} active={active === l} />}
          className="px-1"
        >
          {LENSES[l].label.toUpperCase()}
        </FilterPill>
      ))}
      </div>
      {/* The printed index's recognition legend, on the filter row but OUTSIDE
          the filter group (REINDEX 2026-07-16: colour never means alone, and
          neither does the star; the ✦ on a tile's meta is named here once).
          Not interactive, so it is not a filter to a screen reader. */}
      <span className="mx-1 font-mono text-[9px] tracking-[0.1em] text-[var(--lang-ink-muted)]">
        ✦ RECOGNITION
      </span>
    </div>
  )
}

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

  // One card in a list item; `priorityCount` eager-loads the first images
  // (they are above the fold). morphSource yields the entry's
  // view-transition-name to the open overlay (one element per name per state).
  // Every face is the compact index face now (dense; the uniform-grid gate).
  const cards = (list: typeof entries, priorityCount: number) =>
    list.map((entry, i) => (
      <li key={entry.id} className="flex">
        <WorkCard
          entry={entry}
          onOpen={() => open(entry.id)}
          priority={i < priorityCount}
          morphSource={selected?.id !== entry.id}
          dense
        />
      </li>
    ))

  const SECTION_LABEL =
    'font-mono text-[10px] tracking-[0.12em] text-[var(--lang-ink-muted)] uppercase'

  return (
    <SheetPage>
      <section className="pt-10 pb-5" aria-labelledby="work-heading">
        {/* The kicker, SIGNED (G4, 2026-07-12: one room-sign grammar
            sitewide, Emilie's ruling). */}
        <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--lang-ink-muted)] uppercase">
          WORK · THE PROOF
        </p>
        <h1
          id="work-heading"
          className="mt-3 mb-4 text-3xl font-semibold tracking-[-0.01em] text-[var(--lang-ink)]"
        >
          Work
        </h1>
        {/* The intro line retired at G2 (Emilie: no page intros, sitewide;
            titles are self-explanatory). */}
        <FilterBar active={activeLens} />
        {/* The count line retired (G-FLUFF, Emilie 2026-07-14: the grid
            already says it). An invisible announcer keeps the filter change
            audible for screen readers; the book link keeps the row. */}
        <p className="sr-only" aria-live="polite">
          {entries.length} {entries.length === 1 ? 'project' : 'projects'}
          {activeLens ? ` · ${LENSES[activeLens].label}` : ''}
        </p>
        <div className="mt-4 flex flex-wrap items-baseline justify-end gap-x-6 gap-y-2">
          {/* THE BOOK (G5): the proof room hands out its printed rendition
              (Emilie's placement pick, 2026-07-12). The PDF regenerates on
              every build from the same master content files as this grid. */}
          <a
            href={`${import.meta.env.BASE_URL}assets/portfolio-emilie-el-chidiac.pdf`}
            download="Emilie-El-Chidiac-Portfolio.pdf"
            className="-m-2 p-2 font-mono text-[10px] tracking-[0.12em] text-[var(--lang-interaction)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]"
          >
            DOWNLOAD THE BOOK (PDF)
          </a>
        </div>
      </section>

      {/* ONE uniform grid, filtered or not (the book index's manner): four
          per row on desktop, two on phones, compact faces, tight gaps. */}
      <ul className="grid list-none grid-cols-2 gap-3 p-0 pb-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards(entries, 4)}
      </ul>

      {/* THE THOUGHTS (REINDEX, Emilie's IA gate 2026-07-16): the printed
          index's T-numbered contents rows, now the site's one thoughts list
          (the reading room retired; /thoughts is the world only). Each row
          opens its note page; the world stays one door over at /thoughts.
          The lens facet reaches the rows too, same as the tiles. */}
      {thoughts.length > 0 && (
        <section id="thoughts" aria-labelledby="thoughts-list-heading" className="pt-8 pb-6">
          <h2 id="thoughts-list-heading" className={SECTION_LABEL}>
            The Thoughts
          </h2>
          <ThoughtIndexRows skin="screen" lens={activeLens} />
        </section>
      )}

      {selected && <WorkOverlay key={selected.id} entry={selected} onClose={close} />}
    </SheetPage>
  )
}
