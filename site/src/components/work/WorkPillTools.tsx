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
import DownloadPill from '../ui/DownloadPill'
import { BookGlyph } from '../ui/glyphs'
import { LENSES, type Lens } from '../Lens'
import { WORK_LENSES } from '../../data/work'

// The lens facet filter (one filter, two frames: the ground cluster on lg+,
// the stacked header below lg). Active reads solid ink, never redline (red
// is liveness, not a category); each lens pill leads with its shape mark so
// colour never means alone. `flat` renders the same semantics with
// display:contents wrappers so each pill wraps independently inside the
// corner cluster (a rigid row block cannot reflow there).
export function WorkFilterRow({
  active,
  flat = false,
  nowrap = false,
}: {
  active: Lens | null
  flat?: boolean
  /** THE PHONE'S ROW DOES NOT WRAP (Emilie's ruling 2026-08-02). Wrapped, four
   *  lenses took three lines and 148px of a 844px screen; on one row that runs
   *  off the frame they take 52. The caller owns the scrolling and the bleed;
   *  this only has to stop the pills folding and stop them being squeezed. */
  nowrap?: boolean
}) {
  const rowCls = nowrap ? 'flex items-center' : 'flex flex-wrap items-center'
  return (
    <div className={flat ? 'contents' : `-mx-1 ${rowCls}`}>
      <div
        className={flat ? 'contents' : rowCls}
        role="group"
        aria-label="Filter by lens"
      >
        <FilterPill
          as={Link}
          to="/work"
          viewTransition
          active={active === null}
          aria-current={active === null ? 'true' : undefined}
          dense={nowrap}
          className={nowrap ? 'shrink-0 px-0.5' : 'px-1'}
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
            dense={nowrap}
            className={nowrap ? 'shrink-0 px-0.5' : 'px-1'}
            // THE SHORT FORM ON THE CHIP (Emilie, 2026-08-02: "let's have alias
            // for the filters so they fit, so research, practice, instead of
            // the full names"). No new wording was needed: components/Lens.tsx
            // has carried both forms since 2026-07-26 and says why, that the
            // long name is what a screen reader hears and the short one is what
            // a chip can hold. The filter row had simply been using the long
            // one, which took three wrapped lines at 390 and still ran off the
            // frame once flattened to a row. `aria-label` keeps the long name
            // where that file says it belongs.
            aria-label={LENSES[l].label}
          >
            {LENSES[l].short.toUpperCase()}
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
// download affordance sitewide (DownloadPill: a hairline pill + tray icon),
// so /work's book and /cv's + /contact's downloads read as one control (the
// audit's consistency ruling, 2026-07-19).
export function BookDownloadLink({ className = '' }: { className?: string }) {
  return (
    <DownloadPill
      href={`${import.meta.env.BASE_URL}assets/portfolio-emilie-el-chidiac.pdf`}
      download="Emilie-El-Chidiac-Portfolio.pdf"
      icon={<BookGlyph />}
      className={className}
    >
      THE BOOK (PDF)
    </DownloadPill>
  )
}

export default function WorkGroundTools({ active }: { active: Lens | null }) {
  return (
    // /work is the one page that hides its header tools below lg (its
    // stacked mobile header repeats them); every other page keeps its tools
    // on the header line at all sizes.
    //
    // THE BOOK LEFT THIS ROW (her call 2026-07-28), and with it the divider
    // that existed only to mark the shift from facets to action. It now rides
    // the footer, centred, exactly as /cv's CV (PDF) does — the two rooms that
    // hand out a PDF hand it out from the same place. What is left here is
    // what the header line should have held all along: the page's FILTER and
    // nothing else.
    <div className="hidden min-w-0 flex-wrap items-center justify-end gap-x-1 gap-y-0.5 lg:flex">
      <WorkFilterRow active={active} flat />
    </div>
  )
}
