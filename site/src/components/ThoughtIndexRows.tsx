// THE THOUGHTS index rows (Session 1 REINDEX, 2026-07-16, Emilie's IA gate):
// the T-numbered contents rows the printed book's index page has always
// carried, now ALSO the /work index's THE THOUGHTS section. The reading-room
// list retired in the same gate (/thoughts is the world only), so these rows
// are the site's one thoughts list. ONE component, two skins, one data source
// (registry.thoughtIndexEntries, book order = T-number ascending), so the
// screen index and the print index cannot drift (REDESIGN-SPEC §4: one data
// object, two renditions).
//
// The print skin stays router-free and hook-light: printBook.test.tsx
// renderToString's the book with no router, so the router <Link> renders
// ONLY in the screen skin. Rows without a drafted note (none today) render
// as plain text on screen rather than a dead link.
import { Link } from 'react-router-dom'
import { thoughtIndexEntries, type RegistryEntry } from '../data/registry'
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
function ThoughtMark() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true" className="shrink-0 overflow-visible">
      <circle cx="7" cy="7" r="4.6" fill="none" stroke="var(--lang-ink)" strokeWidth="1.6" />
    </svg>
  )
}

function ScreenRow({ e }: { e: RegistryEntry }) {
  const meta = `${e.note?.number ?? ''} · ${fmtMonthYear(e.date)}`
  const body = (
    <>
      <ThoughtMark />
      <span
        className="min-w-0 flex-1 font-serif text-[17px] leading-snug font-medium lowercase italic tracking-[-0.005em] text-[var(--lang-ink)]"
        style={e.note ? { viewTransitionName: vtName(e.note.route) } : undefined}
      >
        {e.title}
      </span>
      <span className="shrink-0 font-mono text-[9px] tracking-[0.08em] whitespace-nowrap text-[var(--lang-ink-muted)]">
        {meta}
      </span>
    </>
  )
  return (
    <li className="border-b-[0.5px] border-[var(--lang-hairline)]">
      {e.note ? (
        <Link
          to={e.note.route}
          viewTransition
          className="flex min-h-11 items-center gap-3 rounded-[var(--r-control)] px-2 py-2.5 no-underline transition-colors hover:bg-[var(--lang-glass-1)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
        >
          {body}
        </Link>
      ) : (
        <span className="flex min-h-11 items-center gap-3 px-2 py-2.5">{body}</span>
      )}
    </li>
  )
}

export default function ThoughtIndexRows({
  skin,
  lens = null,
}: {
  /** 'print' = the book's pr-* grammar (router-free) · 'screen' = /work */
  skin: 'print' | 'screen'
  /** the /work lens facet reaches the rows too; null = all (print always all) */
  lens?: Lens | null
}) {
  const thoughts = thoughtIndexEntries().filter((t) => !lens || t.lens === lens)

  if (skin === 'print')
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '8mm' }}>
        {thoughts.map((t) => (
          <div key={t.id} className="pr-row">
            <span className="pr-mark pr-mark--thought" />
            <span style={{ display: 'flex', justifyContent: 'space-between', gap: '4mm', alignItems: 'baseline' }}>
              <span className="pr-body" style={{ fontStyle: 'italic' }}>{t.title}</span>
              <span className="pr-mono pr-mono--muted">
                {t.note?.number} · {fmtMonthYear(t.date)}
              </span>
            </span>
          </div>
        ))}
      </div>
    )

  return (
    <ol role="list" className="mt-3 grid list-none grid-cols-1 gap-x-10 p-0 sm:grid-cols-2">
      {thoughts.map((t) => (
        <ScreenRow key={t.id} e={t} />
      ))}
    </ol>
  )
}
