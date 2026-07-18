// THE WORK BAR (LOOK & ORDER round 4, Emilie's gate 2026-07-18): on lg+ the
// /work page's whole header stack (the centered pill + kicker + h1 + filter
// row + book link) collapses into ONE full-width glass bar, reclaiming
// ~110-150px of vertical space for the one-page index. Below lg nothing
// changes: the bar renders the ordinary centered pill and the page keeps its
// stacked header (Work.tsx wraps it lg:hidden). Every other page keeps the
// centered pill identity untouched (SheetPage's headerBar slot is /work-only).
//
// A11y: the bar's "Work" stays a REAL h1 (heading navigation is document
// order, not landmark-scoped); the page's mobile h1 and this one are never
// displayed together (CSS lg switch, display:none removes the hidden one
// from the accessibility tree), and they carry distinct ids. Keyboard order:
// emblem, four doors, filters, book link, mode toggle; every target keeps
// the 44px floor. The bar wraps to two compact rows when the window is too
// narrow for one (flex-wrap, no measuring).
import { Link } from 'react-router-dom'
import TitleBlock, { HeaderNav } from '../TitleBlock'
import ModeToggle from '../ui/ModeToggle'
import { FilterPill, LensMark } from '../ui/Pill'
import { LENSES, type Lens } from '../Lens'
import { WORK_LENSES } from '../../data/work'

// The lens facet filter (moved out of Work.tsx at the bar gate; the mobile
// stacked header imports it too, one filter, two frames). Active reads solid
// ink, never redline (red is liveness, not a category); each lens pill leads
// with its shape mark so colour never means alone.
export function WorkFilterRow({ active }: { active: Lens | null }) {
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
          neither does the star). Not interactive, so not a filter to a
          screen reader. */}
      <span className="mx-1 font-mono text-[9px] tracking-[0.1em] text-[var(--lang-ink-muted)]">
        ✦ RECOGNITION
      </span>
    </div>
  )
}

// THE BOOK (G5): the proof room hands out its printed rendition; the PDF
// regenerates on every build from the same masters as the grid. min-h-11 =
// the 44px floor.
export function BookDownloadLink({ className = '' }: { className?: string }) {
  return (
    <a
      href={`${import.meta.env.BASE_URL}assets/portfolio-emilie-el-chidiac.pdf`}
      download="Emilie-El-Chidiac-Portfolio.pdf"
      className={`inline-flex min-h-11 items-center px-2 font-mono text-[10px] tracking-[0.12em] text-[var(--lang-interaction)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)] ${className}`}
    >
      DOWNLOAD THE BOOK (PDF)
    </a>
  )
}

export default function WorkHeaderBar({ active }: { active: Lens | null }) {
  return (
    <>
      {/* Below lg: today's centered pill, untouched. */}
      <div className="lg:hidden">
        <TitleBlock />
      </div>
      {/* lg+: the one full-width bar. Glass tier 2 like the pill it replaces;
          square, edge to edge, a bottom hairline only. */}
      <header className="lang-glass-2 sticky top-0 z-40 hidden border-0 border-b-[0.5px] border-solid border-b-[var(--lang-glass-2-border)] lg:block">
        {/* TRULY full width (round 5, her screenshot note: no centered cap,
            the bar runs edge to edge like a drawing sheet's title strip; on
            wide screens everything holds ONE row). */}
        <div className="flex w-full flex-wrap items-center gap-x-4 px-5 py-1.5 sm:px-8">
          <HeaderNav />
          <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-[var(--lang-hairline)]" />
          {/* The room sign, compact: the kicker (SIGNED, G4) over the page's
              real h1, restyled small for the bar. */}
          <span className="mr-2">
            <span className="block font-mono text-[8px] tracking-[0.13em] text-[var(--lang-ink-muted)] uppercase">
              WORK · THE PROOF
            </span>
            <h1
              id="work-heading-lg"
              className="m-0 text-[15px] leading-tight font-semibold tracking-[-0.01em] text-[var(--lang-ink)]"
            >
              Work
            </h1>
          </span>
          <WorkFilterRow active={active} />
          <BookDownloadLink className="ml-auto" />
          <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-[var(--lang-hairline)]" />
          <ModeToggle />
        </div>
      </header>
    </>
  )
}
