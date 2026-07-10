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
// Copy: the intro line + all 11 deks were SIGNED by Emilie in the DL-2 copy
// pass (in chat, 2026-07-10; dekSigned in projects.tsx). New copy on this
// surface ships draftCopy until she signs it, as always (Section 14).
import { useEffect, useRef } from 'react'
// G1 (2026-07-10): the opened card IS the showcase now (WorkOverlay grew the
// signed spine; the Pen Table sheet tier retired, /sheets/* redirects here).
// The intro line was reworded for the model change ("a few open all the way
// to their full page" stopped being true): the NEW wording is draftCopy
// until Emilie signs it; the deks stay signed (dekSigned, content/projects).
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

  // The showcase IS the project's page (G1), so the document title follows
  // the open entry. Runs after SheetPage's own title effect (parent effects
  // fire after children), so this wins while a showcase is open and
  // SheetPage's "Work" returns when it closes via the selected -> undefined
  // pass below.
  useEffect(() => {
    if (selected) document.title = `${selected.title} | Emilie El Chidiac`
    else document.title = 'Work | Emilie El Chidiac'
  }, [selected])

  // viewTransition: the card face morphs into the showcase sheet and back
  // (shared view-transition-name, lib/viewTransition.ts); browsers without
  // the API just swap.
  const open = (entryId: string) => navigate(`/work/${entryId}${hash}`, { viewTransition: true })
  const close = () => navigate(`/work${hash}`, { replace: true, viewTransition: true })

  return (
    <SheetPage title="Work">
      <section className="pt-10 pb-5" aria-labelledby="work-heading">
        <h1
          id="work-heading"
          className="mb-4 text-3xl font-semibold tracking-[-0.01em] text-[var(--lang-ink)]"
        >
          Work
        </h1>
        {/* The intro line retired at G2 (Emilie: no page intros, sitewide;
            titles are self-explanatory). */}
        <FilterBar active={activeLens} />
        <p
          className="mt-4 font-mono text-[10px] tracking-[0.12em] text-[var(--lang-ink-muted)]"
          aria-live="polite"
        >
          {entries.length} {entries.length === 1 ? 'PROJECT' : 'PROJECTS'}
          {activeLens ? ` · ${LENSES[activeLens].label.toUpperCase()}` : ' · ALL'}
        </p>
      </section>

      <ul className="grid list-none grid-cols-1 gap-5 p-0 pb-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, i) => (
          <li key={entry.id} className="flex">
            {/* morphSource yields the entry's view-transition-name to the open
                overlay (one element per name per state, lib/viewTransition.ts) */}
            <WorkCard
              entry={entry}
              onOpen={() => open(entry.id)}
              priority={i < 3}
              morphSource={selected?.id !== entry.id}
            />
          </li>
        ))}
      </ul>

      {selected && <WorkOverlay key={selected.id} entry={selected} onClose={close} />}
    </SheetPage>
  )
}
