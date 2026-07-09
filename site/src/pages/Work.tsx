// THE GALLERY (Session R2) · /work. The missing surface: a uniform grid of
// every project where a visitor browses the work visually, then opens any card
// as a preview lifted over the dimmed grid. This is the landing's proof path
// (the cover dropped its "SEE THE WORK" button; the emphasised WORK link and
// the tappable nodes route here), so it must be excellent and fast.
//
// One data object drives it: WORK_ENTRIES (data/work.ts), the same object the
// printed book's INDEX page (R7) will reuse. The lens filter is an OPEN facet
// set (a new lens appears by itself). The overlay is URL-addressable at
// /work/:id so a single card is shareable and prerenderable (R9).
//
// Copy in Emilie's voice ships draftCopy: the intro line, and every card dek.
import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import WorkCard from '../components/work/WorkCard'
import WorkOverlay from '../components/work/WorkOverlay'
import { LensTick, LENSES, type Lens } from '../components/Lens'
import { WORK_ENTRIES, WORK_LENSES, workEntryById } from '../data/work'

// The lens facet filter: ALL + one chip per lens present, hash-synced so a
// filtered view is shareable (the Notebook's mechanism). Active reads ink
// emphasis, never redline (red is liveness, not a category, rule 1).
function FilterBar({ active }: { active: Lens | null }) {
  const base = 'inline-flex items-center gap-2 border px-3 py-2 font-mono text-[10px] tracking-[0.08em] no-underline focus-visible:outline-2 focus-visible:outline-redline'
  const on = 'border-ink bg-ink text-mylar'
  const off = 'border-ink/30 text-anno hover:border-ink hover:text-ink'
  return (
    <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter by lens">
      <Link to="/work" className={`${base} ${active === null ? on : off}`} aria-current={active === null ? 'true' : undefined}>
        ALL
      </Link>
      {WORK_LENSES.map((l) => (
        <Link
          key={l}
          to={`/work#${l}`}
          className={`${base} ${active === l ? on : off}`}
          aria-current={active === l ? 'true' : undefined}
        >
          <LensTick lens={l} variant={active === l ? 'wire' : 'pen'} />
          {LENSES[l].label.toUpperCase()}
        </Link>
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

  const open = (entryId: string) => navigate(`/work/${entryId}${hash}`)
  const close = () => navigate(`/work${hash}`, { replace: true })

  return (
    <SheetPage title="Work">
      <section className="pt-10 pb-4" aria-labelledby="work-heading">
        <h1 id="work-heading" className="mb-4 text-3xl font-semibold tracking-[-0.01em]">
          Work
        </h1>
        <p className="mb-6 max-w-[58ch] font-serif text-[17px] leading-relaxed">
          The work, newest first. Open a card to look closer; a few open all the way to their full page.
        </p>
        <FilterBar active={activeLens} />
        <p className="mt-4 font-mono text-[10px] tracking-[0.12em] text-anno" aria-live="polite">
          {entries.length} {entries.length === 1 ? 'PROJECT' : 'PROJECTS'}
          {activeLens ? ` · ${LENSES[activeLens].label.toUpperCase()}` : ' · ALL'}
        </p>
      </section>

      <ul className="grid list-none grid-cols-1 gap-4 p-0 pb-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, i) => (
          <li key={entry.id} className="flex">
            <WorkCard entry={entry} onOpen={() => open(entry.id)} priority={i < 3} />
          </li>
        ))}
      </ul>

      {selected && <WorkOverlay key={selected.id} entry={selected} onClose={close} />}
    </SheetPage>
  )
}
