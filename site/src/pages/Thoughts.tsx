// THE THOUGHTS INDEX (G2, 2026-07-10, Emilie's rulings in-session): the
// READING ROOM of the two-room model (NOTEBOOK = the time drawing, THOUGHTS =
// the writing). The form she picked is "the contents, no lead": editorial
// rows on the ground, hairlines instead of boxes, each row carrying the
// note's real opening sentences so the index is itself a reading surface.
// Glass appears only on touch (row hover/focus wash). No filters at ten
// notes, and NO intro paragraph (Emilie, G2: titles are self-explanatory,
// sitewide). The corridor line at the foot deep-links into the notebook's
// thoughts facet: her "two lenses" delivered as two rooms with a corridor,
// not a toggle.
import { Link } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import { LensTick, LENSES } from '../components/Lens'
import { ENTRIES, byDateDesc, type RegistryEntry } from '../data/registry'
import { THOUGHT_OPENINGS } from '../thoughts/openings'
import { vtName } from '../lib/viewTransition'

function noteEntries(): RegistryEntry[] {
  return ENTRIES.filter(
    (e) => e.kind === 'thought' && e.note?.status === 'drafted' && THOUGHT_OPENINGS[e.id],
  ).sort(byDateDesc)
}

function LeafRow({ e }: { e: RegistryEntry }) {
  return (
    <li className="border-t-[0.5px] border-[var(--lang-hairline)] first:border-t-0">
      {/* One link, one tab stop; the wash is the glass-on-touch moment. */}
      <Link
        to={e.note!.route}
        viewTransition
        className="grid grid-cols-1 gap-x-5 rounded-[var(--r-control)] px-2 py-5 no-underline transition-colors hover:bg-[var(--lang-glass-1)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--lang-interaction)] sm:grid-cols-[92px_minmax(0,1fr)]"
      >
        {/* Quiet, but still text: ink-muted holds AA at 9px (ink-faint is
            reserved for decoration, it fails contrast as type). */}
        <span className="flex gap-3 pt-1 font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink-muted)] sm:flex-col sm:gap-1.5">
          <span>{e.date}</span>
          <span>{e.note!.number}</span>
        </span>
        <span className="mt-2 block min-w-0 sm:mt-0">
          <h2
            className="font-serif text-[23px] leading-[1.25] font-medium lowercase italic tracking-[-0.005em] text-[var(--lang-ink)]"
            style={{ viewTransitionName: vtName(e.note!.route) }}
          >
            {e.title}
          </h2>
          <p className="mt-1.5 line-clamp-2 max-w-[58ch] font-serif text-[15px] leading-relaxed text-[var(--lang-ink-muted)]">
            {THOUGHT_OPENINGS[e.id]}
          </p>
          <span className="mt-2.5 flex items-center gap-3 font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink-muted)]">
            {e.lens && (
              <>
                <LensTick lens={e.lens} size={7} />
                <span>{LENSES[e.lens].label.toUpperCase()}</span>
              </>
            )}
            <span className="text-[var(--lang-interaction)]">READ ›</span>
          </span>
        </span>
      </Link>
    </li>
  )
}

export default function Thoughts() {
  const notes = noteEntries()

  return (
    <SheetPage title="Thoughts">
      <div className="mx-auto w-full max-w-[760px]">
        <section className="pt-10 pb-2" aria-labelledby="thoughts-heading">
          <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--lang-ink-muted)] uppercase">
            THOUGHTS · THE WRITING
          </p>
          {/* The room's title in the thinking voice (draftCopy until signed). */}
          <h1
            id="thoughts-heading"
            className="mt-3 mb-2 font-serif text-[30px] font-medium lowercase italic tracking-[-0.01em] text-[var(--lang-ink)]"
          >
            what i keep thinking about
          </h1>
          <p className="mt-4 font-mono text-[9px] tracking-[0.1em] text-[var(--lang-ink-muted)]">
            {notes.length} NOTES · NEWEST FIRST
          </p>
        </section>

        <ol className="mt-4 list-none p-0">
          {notes.map((e) => (
            <LeafRow key={e.id} e={e} />
          ))}
        </ol>

        {/* The corridor: the same record, read in time, one tap away. */}
        <p className="mt-8 border-t-[0.5px] border-[var(--lang-hairline)] pt-4 pb-12 font-mono text-[9px] tracking-[0.08em]">
          <Link
            to="/notebook#thoughts"
            viewTransition
            className="-m-2 p-2 text-[var(--lang-interaction)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]"
          >
            SEE THE THOUGHTS IN TIME · THE NOTEBOOK ›
          </Link>
        </p>
      </div>
    </SheetPage>
  )
}
