// THE THOUGHTS index rows (Session 1 REINDEX, 2026-07-16, Emilie's IA gate):
// the T-numbered contents rows the printed book's index page has always
// carried, now ALSO the /work index's THE THOUGHTS section. The reading-room
// list retired in the same gate (/thoughts is the world only), so these rows
// are the site's one thoughts list. ONE component, two skins, one data source
// (registry.thoughtIndexEntries, ordered BY DATE newest-first since Emilie's
// ruling of 2026-08-05; it was T-number ascending until then), so the
// screen index and the print index cannot drift (REDESIGN-SPEC §4: one data
// object, two renditions; since the 2026-07-18 LOOK & ORDER gate the shared
// contract is the DATA + row grammar, while /work presents them as a RAIL).
//
// THE RAIL MECHANIC (WORK PAGE · LOOK & ORDER, Emilie's gate 2026-07-18,
// her pick "ink + opening + cross-glow"): hovering or focusing a row fills
// the ring, inks the title, and unfolds the thought's VERBATIM opening
// (openings.ts, the sanctioned index-surface source; no copy duplicated).
// onThoughtHover lifts the hovered id so /work can glow the correlated
// tiles. All of it is hover/focus progressive enhancement: touch visitors
// keep the plain rows, reduced motion unfolds without animation.
//
// The print skin stays router-free and hook-light: printBook.test.tsx
// renderToString's the book with no router, so the router <Link> renders
// ONLY in the screen skin. Rows without a drafted note (none today) render
// as plain text on screen rather than a dead link.
import { Link } from 'react-router-dom'
// The print skin renders into a PDF that travels off the site, so its hrefs
// must be absolute. (The screen skin routes; only this one needs an origin.)
// One origin for the whole site — it was briefly a third private copy here.
import { SITE_ORIGIN } from '../lib/routes'
import { thoughtIndexEntries, type RegistryEntry } from '../data/registry'
import { THOUGHT_OPENINGS } from '../thoughts/openings'
import type { Lens } from './Lens'
import { vtName } from '../lib/viewTransition'


const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
// 'YYYY-MM' -> 'JUL 2026' (the book's date grammar; PrintBook reuses this).
export function fmtMonthYear(yyyymm: string): string {
  const [y, m] = yyyymm.split('-')
  const mi = Number(m) - 1
  return `${MONTHS[mi] ?? ''} ${y}`.trim()
}

// The hollow ring = THOUGHT, the same mark the neural world's legend names
// (one mark grammar sitewide). Decorative here: the T-number says it too.
// The rail mechanic fills it on hover (language.css .thought-ring).
function ThoughtMark() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 14 14"
      aria-hidden="true"
      className="thought-ring shrink-0 overflow-visible"
    >
      <circle cx="7" cy="7" r="4.6" fill="none" stroke="var(--lang-ink)" strokeWidth="1.6" />
    </svg>
  )
}

function ScreenRow({
  e,
  onThoughtHover,
}: {
  e: RegistryEntry
  onThoughtHover?: (id: string | null) => void
}) {
  // THE T-NUMBER RETIRED from the screen row (Emilie's cut, 2026-07-27, THE
  // SCROLL gate), alongside the P-numbers on the work faces. The PRINT skin
  // below keeps it: the book is an archive with a contents page, and a
  // contents page is exactly where a catalogue number earns its line.
  const meta = fmtMonthYear(e.date)
  const opening = THOUGHT_OPENINGS[e.id]
  const body = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        <ThoughtMark />
        <span
          className="thought-title min-w-0 flex-1 font-serif text-prose leading-snug font-medium lowercase italic tracking-[-0.005em] text-[var(--lang-ink)]"
          // Declares, does not wear: see WorkCard and lib/morphName.ts. These
          // 18 titles were the other half of the 40 orphan groups.
          data-morph={e.note ? vtName(e.note.route) : undefined}
        >
          {e.title}
        </span>
        <span className="shrink-0 font-mono text-micro tracking-[0.08em] whitespace-nowrap text-[var(--lang-ink-muted)]">
          {meta}
        </span>
      </span>
      {opening && (
        <span className="thought-open text-nav leading-relaxed text-[var(--lang-ink-muted)]">
          <span className="line-clamp-2">{opening}</span>
        </span>
      )}
    </>
  )
  // TOUCH IS NOT HOVER (2026-08-09): pointerenter FIRES ON TOUCH, and a tap
  // focuses the <Link> before the route changes, so on a phone BOTH triggers
  // were lighting the cross-glow on the way out of the page. The two gates
  // here are the JS half of the CSS pair in language.css and must stay in
  // step with it: mouse-only for the pointer, :focus-visible for the focus
  // (a tap focuses the link, a keyboard focuses it VISIBLY). Leave always
  // clears — an ungated null can only ever turn the glow off.
  const hoverProps = onThoughtHover
    ? {
        onPointerEnter: (ev: React.PointerEvent) => {
          if (ev.pointerType === 'mouse') onThoughtHover(e.id)
        },
        onPointerLeave: (ev: React.PointerEvent) => {
          if (ev.pointerType === 'mouse') onThoughtHover(null)
        },
        onFocus: (ev: React.FocusEvent<HTMLElement>) => {
          if (ev.currentTarget.matches(':focus-visible')) onThoughtHover(e.id)
        },
        onBlur: () => onThoughtHover(null),
      }
    : undefined
  return (
    <li className="thought-row border-b-[0.5px] border-[var(--lang-hairline)]">
      {e.note ? (
        <Link
          to={e.note.route}
          viewTransition
          {...hoverProps}
          className="flex min-h-11 flex-col justify-center rounded-[var(--r-control)] px-2 py-1 no-underline transition-colors hover:bg-[var(--lang-glass-1)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
        >
          {body}
        </Link>
      ) : (
        <span {...hoverProps} className="flex min-h-11 flex-col justify-center px-2 py-2">
          {body}
        </span>
      )}
    </li>
  )
}

export default function ThoughtIndexRows({
  skin,
  lens = null,
  variant = 'bottom',
  limit,
  columns = 4,
  onThoughtHover,
}: {
  /** 'print' = the book's pr-* grammar (router-free) · 'screen' = /work */
  skin: 'print' | 'screen'
  /** print only · show the first N rows (the list is newest first, so this is
      "the latest N" without a second judgement about which ones). The book's
      index takes 10 of 18; the rest are a line away on the site. */
  limit?: number
  /** print only · how many columns the rows run in. */
  columns?: number
  /** the /work lens facet reaches the rows too; null = all (print always all) */
  lens?: Lens | null
  /** screen only · 'wide' = the /work closing block (round 4, option B:
      three columns on xl so every title holds one line); 'bottom' = the
      original two-column closing list */
  variant?: 'bottom' | 'wide'
  /** screen only · lifts the hovered/focused thought id (null on leave) so
      the caller can cross-glow the correlated work tiles */
  onThoughtHover?: (id: string | null) => void
}) {
  const thoughts = thoughtIndexEntries().filter((t) => !lens || t.lens === lens)

  if (skin === 'print')
    return (
      // S5: 2 -> 3 columns when the thoughts grew 10 -> 13; at two columns
      // the extra rows overflowed the index page's A4 box by 26px (the
      // build's overflow probe caught it and refused the PDF).
      //
      // THE WORDS (2026-07-29): 3 -> 4 when they grew 14 -> 19, same probe,
      // 21px over. Margin was already spent on the 18-note overrun, so this
      // round takes the structural fix instead: 19 rows across four columns is
      // five rows rather than seven.
      //
      // THE DATE CAME OFF, AND HAS NOW COME BACK (Emilie, 2026-08-11). The
      // 2026-07-29 note below is kept because its reasoning is what changed,
      // not its arithmetic: the T-number won that round because "the book's
      // index is ordered by it", and since her ruling of 2026-08-05 it is not.
      // These rows are ordered by DATE, newest first, so the date is now the
      // column that explains the order and the T-number is the one that does
      // not. Only ONE of them ships, which is what keeps the cell inside its
      // width; the stamp went from about 8mm ("T-118") to about 13mm
      // ("JUL 2026") against roughly 55mm of text column, and the build's
      // overflow probe is the check on that.
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, columnGap: '7mm' }}>
        {(limit ? thoughts.slice(0, limit) : thoughts).map((t) => {
          // THE LINKS PASS (Emilie, 2026-08-16). The printed index listed its
          // thoughts as dead type like every other URL in the book. These are
          // PLAIN <a href> and never the router's <Link>: the print skin is
          // renderToString'd with no router by printBook.test.tsx, and a
          // <Link> there throws. A row whose thought has no note stays a
          // <div>, so the book can never print a link to a page that is not
          // written yet.
          const row = (
            <>
              <span className="pr-mark pr-mark--thought" />
              <span style={{ display: 'flex', justifyContent: 'space-between', gap: '2.5mm', alignItems: 'baseline' }}>
                <span className="pr-body" style={{ fontStyle: 'italic' }}>{t.title}</span>
                <span className="pr-mono pr-mono--muted" style={{ whiteSpace: 'nowrap' }}>
                  {fmtMonthYear(t.date)}
                </span>
              </span>
            </>
          )
          return t.note ? (
            <a key={t.id} href={`${SITE_ORIGIN}${t.note.route}`} className="pr-row pr-link">
              {row}
            </a>
          ) : (
            <div key={t.id} className="pr-row">
              {row}
            </div>
          )
        })}
      </div>
    )

  // S5 (2026-07-18): xl went 3 -> 4 columns when the thoughts grew 10 -> 13
  // (T-111..T-113); at three columns the extra row broke /work's one-page
  // promise by 11px at 1280x800. Four columns holds 13 in the same height.
  const cols =
    variant === 'wide'
      ? 'thought-rail grid-cols-1 gap-x-6 sm:grid-cols-2 xl:grid-cols-4'
      : 'grid-cols-1 gap-x-10 sm:grid-cols-2'
  return (
    <ol role="list" className={`mt-2 grid list-none p-0 ${cols}`}>
      {thoughts.map((t) => (
        <ScreenRow key={t.id} e={t} onThoughtHover={onThoughtHover} />
      ))}
    </ol>
  )
}
