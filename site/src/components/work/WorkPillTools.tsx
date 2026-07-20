// THE WORK GROUND TOOLS (the design audit, Emilie's ruling round 3,
// 2026-07-19: "on the ground but on the side, so we win vertical
// real-estate and white space"). The full-width WorkHeaderBar and the
// in-pill/docked toolbar experiments all retired; the page's tools (lens
// filters, recognition legend, book download) are a BARE cluster with no
// glass, handed to TitleBlock's `tools` slot: top right on the pill's line
// at >=1400px (zero vertical cost), one thin centred row under the pill
// between lg and 1400, and below lg the page's stacked header (Work.tsx).
// Chrome floats, tools rest on the paper: that material difference is what
// separates the four doors from the page's own controls.
//
// A11y: /work's h1 is ONE element in Work.tsx (visible under the pill on
// small screens, sr-only on lg+ where the lit WORK door already names the
// room). The filter group + legend semantics are unchanged (colour never
// means alone, nor does the ✦).
import { Link } from 'react-router-dom'
import { FilterPill, LensMark } from '../ui/Pill'
import DownloadChip from '../ui/DownloadChip'
import { LENSES, type Lens } from '../Lens'
import { WORK_LENSES } from '../../data/work'

// The lens facet filter (one filter, two frames: the ground cluster on lg+,
// the stacked header below lg). Active reads solid ink, never redline (red
// is liveness, not a category); each lens pill leads with its shape mark so
// colour never means alone. `flat` renders the same semantics with
// display:contents wrappers so each pill wraps independently inside the
// corner cluster (a rigid row block cannot reflow there).
export function WorkFilterRow({ active, flat = false }: { active: Lens | null; flat?: boolean }) {
  return (
    <div className={flat ? 'contents' : '-mx-1 flex flex-wrap items-center'}>
      <div
        className={flat ? 'contents' : 'flex flex-wrap items-center'}
        role="group"
        aria-label="Filter by lens"
      >
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
      {/* The ✦ RECOGNITION legend retired at the audit (Emilie 2026-07-19:
          "it looks weird, it's self-explanatory") : the ✦ on an awarded tile
          reads on its own. */}
    </div>
  )
}

// THE BOOK (G5): the proof room hands out its printed rendition; the PDF
// regenerates on every build from the same masters as the grid. The one
// download affordance sitewide (DownloadChip: a hairline pill + tray icon),
// so /work's book and /cv's + /about's downloads read as one control (the
// audit's consistency ruling, 2026-07-19).
export function BookDownloadLink({ className = '' }: { className?: string }) {
  return (
    <DownloadChip
      href={`${import.meta.env.BASE_URL}assets/portfolio-emilie-el-chidiac.pdf`}
      download="Emilie-El-Chidiac-Portfolio.pdf"
      className={className}
    >
      THE BOOK (PDF)
    </DownloadChip>
  )
}

export default function WorkGroundTools({ active }: { active: Lens | null }) {
  return (
    // /work is the one page that hides its header tools below lg (its
    // stacked mobile header repeats them); every other page keeps its tools
    // on the header line at all sizes.
    <div className="hidden min-w-0 flex-wrap items-center justify-end gap-x-1 gap-y-0.5 lg:flex">
      <WorkFilterRow active={active} flat />
      <BookDownloadLink />
    </div>
  )
}
