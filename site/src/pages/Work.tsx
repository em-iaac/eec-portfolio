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
import WorkCard from '../components/work/WorkCard'
import WorkOverlay from '../components/work/WorkOverlay'
import { FilterPill, LensMark } from '../components/ui/Pill'
import { LENSES, type Lens } from '../components/Lens'
import { WORK_ENTRIES, WORK_LENSES, workEntryById } from '../data/work'

// The lens facet filter: ALL + one pill per lens present, hash-synced so a
// filtered view is shareable (the old notebook's mechanism). Active reads solid
// ink, never redline (red is liveness, not a category, rule 1); each lens
// pill leads with its shape mark so colour never means alone.
function FilterBar({ active }: { active: Lens | null }) {
  return (
    <div className="-mx-1 flex flex-wrap" role="group" aria-label="Filter by lens">
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
  )
}

export default function Work() {
  const { id } = useParams()
  const { hash } = useLocation()
  const navigate = useNavigate()

  const lens = (hash.replace('#', '') || null) as Lens | null
  const activeLens = lens && lens in LENSES ? lens : null

  const entries = activeLens ? WORK_ENTRIES.filter((w) => w.lens === activeLens) : WORK_ENTRIES

  // THE FEATURED TIER (S4, D2): in the unfiltered ALL view the grid splits into
  // FEATURED (leads, larger) + MORE WORK (the rest). A lens-filtered view shows
  // ONE grid (its subset is small; a two-tier split there reads as clutter), in
  // the same featured-first order WORK_ENTRIES already carries.
  const showTiers = !activeLens
  const featured = entries.filter((w) => w.featured)
  const supporting = entries.filter((w) => !w.featured)

  const selected = id ? workEntryById(id) : undefined

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

  // One card in a list item; `priorityCount` eager-loads the first images of a
  // tier (they are above the fold). morphSource yields the entry's
  // view-transition-name to the open overlay (one element per name per state).
  // `dense` renders the compact index face (G-GRID, Emilie 2026-07-14).
  const cards = (list: typeof entries, priorityCount: number, dense = false) =>
    list.map((entry, i) => (
      <li key={entry.id} className="flex">
        <WorkCard
          entry={entry}
          onOpen={() => open(entry.id)}
          priority={i < priorityCount}
          morphSource={selected?.id !== entry.id}
          dense={dense}
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

      {showTiers ? (
        <>
          {/* FEATURED (G-GRID "full index", Emilie 2026-07-14): the strongest
              six still lead the page, three per row on desktop. */}
          <section aria-labelledby="featured-heading" className="pb-2">
            <h2 id="featured-heading" className={SECTION_LABEL}>
              Featured
            </h2>
            <ul className="mt-3 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {cards(featured, 3)}
            </ul>
          </section>
          {/* MORE WORK: the index tail — four per row on desktop, compact
              faces (title + lens), tight gaps, like the printed book's index
              page (her pick over "tighter tail"). */}
          {supporting.length > 0 && (
            <section aria-labelledby="more-heading" className="pt-6 pb-4">
              <h2 id="more-heading" className={SECTION_LABEL}>
                More work
              </h2>
              <ul className="mt-3 grid list-none grid-cols-2 gap-3 p-0 lg:grid-cols-4">
                {cards(supporting, 0, true)}
              </ul>
            </section>
          )}
        </>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-4 p-0 pb-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards(entries, 3)}
        </ul>
      )}

      {selected && <WorkOverlay key={selected.id} entry={selected} onClose={close} />}
    </SheetPage>
  )
}
