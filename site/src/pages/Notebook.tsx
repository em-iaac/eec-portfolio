// The full research record (replaces the Work drawing set): every registry
// entry, newest first, grouped by year: the archive behind the Home bench
// roll. Lens chips filter via the URL hash so filtered views stay shareable;
// unlensed entries (milestones, unlensed awards/press) are the spine of the
// timeline and survive every lens. Kinds carry the field-guide mark in the
// date gutter (KindMark, Session 6): projects keep full rows with prose,
// thoughts render serif italic, milestones/awards/press tighten into log
// lines. Same-month sheet issues collapse into one SHEETS ... ISSUED row at
// the render layer (collapseSheetIssues); the registry stays one entry per
// issue.
import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import KindMark, { LOG_KINDS } from '../components/KindMark'
import { Legend, LensTick, LENSES, type Lens } from '../components/Lens'
import { entriesByYear, type RegistryEntry } from '../data/registry'
import { PROJECTS_BY_SLUG } from '../data/projects'
import { collapseSheetIssues } from '../lib/collapseSheets'

// Row hierarchy (Session 6): projects and sheet issues keep full weight;
// log kinds tighten (less padding, dotted lighter rule, slight indent).
const ROW =
  'grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-x-4 border-t first:border-t-0 sm:grid-cols-[4.5rem_minmax(0,1fr)_6.5rem]'
const ROW_FULL = `${ROW} border-ink/20 py-3`
const ROW_LOG = `${ROW} border-dotted border-ink/25 py-1.5 pl-3`

function Gutter({ kind, date }: { kind: RegistryEntry['kind']; date: string }) {
  return (
    <span className="font-mono text-[10px] tracking-[0.08em] text-anno">
      <KindMark kind={kind} /> {date}
    </span>
  )
}

function SheetNo({ e }: { e: RegistryEntry }) {
  if (!e.sheet) return null
  return e.sheet.status === 'issued' ? (
    <span className="text-ink">{e.sheet.number}</span>
  ) : (
    <span className="text-anno">{e.sheet.number} · IN PREP</span>
  )
}

// The collapse row (Session 6): same-month sheet issues read as one line,
// redline as liveness (issue events), each number its own link into its sheet.
function SheetGroupRow({ sheets }: { sheets: RegistryEntry[] }) {
  return (
    <p className="font-mono text-[10px] tracking-[0.1em] text-redline">
      SHEETS{' '}
      {sheets.map((s, i) => (
        <span key={s.id}>
          {i > 0 && ', '}
          {/* Hit area grows vertically only: horizontal stays inside the
              comma gap so adjacent number links never overlap. */}
          <Link
            to={s.sheet!.route}
            viewTransition
            className="-my-2 -mx-1 px-1 py-2 underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline"
          >
            {s.sheet!.number}
          </Link>
        </span>
      ))}{' '}
      ISSUED &gt;
    </p>
  )
}

function RowBody({ e }: { e: RegistryEntry }) {
  if (e.kind === 'project') {
    const p = e.project ? PROJECTS_BY_SLUG[e.project] : undefined
    return (
      <div>
        <p className="flex items-center gap-2 font-semibold leading-6">
          {e.lens && <LensTick lens={e.lens} />}
          {e.sheet ? (
            <Link
              to={e.sheet.route}
              viewTransition
              className="text-ink no-underline hover:underline hover:decoration-redline hover:underline-offset-4"
            >
              {e.title}
            </Link>
          ) : (
            e.title
          )}
        </p>
        {p && (
          <p className="mt-1 line-clamp-2 max-w-[62ch] font-serif text-[15px] leading-relaxed text-ink">
            {p.blurb}
          </p>
        )}
        {p && p.links.length > 0 && (
          <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] tracking-[0.1em]">
            {p.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="-m-2 p-2 text-redline underline underline-offset-4"
              >
                {l.label}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            ))}
          </p>
        )}
      </div>
    )
  }
  if (e.kind === 'thought') {
    return (
      <p className="font-serif text-[15px] italic leading-relaxed text-anno">
        {e.title}
      </p>
    )
  }
  if (e.kind === 'sheet') {
    return (
      <p className="font-mono text-[10px] tracking-[0.1em]">
        <Link
          to={e.sheet!.route}
          viewTransition
          className="-m-2 p-2 text-redline underline underline-offset-4"
        >
          SHEET {e.sheet!.number} ISSUED: {e.title.toUpperCase()} &gt;
        </Link>
      </p>
    )
  }
  // Log lines (milestone/award/press/talk): the gutter mark names the kind
  // (no text prefix since Session 6); milestones stay ink, the spine.
  return (
    <p className="font-mono text-[10px] tracking-[0.08em] leading-relaxed">
      <span className={e.kind === 'milestone' ? 'text-ink' : 'text-anno'}>
        {e.title.toUpperCase()}
      </span>
    </p>
  )
}

export default function Notebook() {
  const { hash } = useLocation()
  const lens = (hash.replace('#', '') || null) as Lens | null
  const activeLens = lens && lens in LENSES ? lens : null

  // The spine rule (Session 6): unlensed entries (milestones, unlensed
  // awards/press) survive every lens; only lensed entries filter.
  const years = entriesByYear()
    .map(([year, entries]) => [
      year,
      collapseSheetIssues(
        activeLens ? entries.filter((e) => !e.lens || e.lens === activeLens) : entries,
      ),
    ] as const)
    .filter(([, items]) => items.length > 0)

  const total = years.reduce(
    (n, [, items]) =>
      n + items.reduce((m, it) => m + (it.type === 'sheetGroup' ? it.sheets.length : 1), 0),
    0,
  )

  // Filter fade (Session 5 bundle): the results fade in ~180ms when the lens
  // changes only. The first paint is not keyed, so landing on the page (or a
  // shared filtered URL) is still; every later lens switch replays the fade.
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
  }, [])

  return (
    <SheetPage title="Notebook">
      <section className="pt-10 pb-4" aria-labelledby="notebook-heading">
        <h1 id="notebook-heading" className="mb-4 text-3xl font-semibold tracking-[-0.01em]">
          Notebook
        </h1>
        <p className="mb-6 max-w-[58ch] font-serif text-[17px] leading-relaxed">
          The running record: projects, thoughts, and the milestones between
          them, newest first. Sheets marked in preparation are written next.
        </p>
        <Legend mode="anchors" />
        <p
          className="mt-4 font-mono text-[10px] tracking-[0.12em] text-anno"
          aria-live="polite"
        >
          {total} ENTRIES
          {activeLens ? ` · ${LENSES[activeLens].label.toUpperCase()}` : ' · ALL'}
          {activeLens && (
            <>
              {' · '}
              {/* Filter-clear, not a page nav: the lens fade handles it, no
                  root view transition (would double up with nb-fade). */}
              <Link to="/notebook" className="-m-2 p-2 text-redline underline underline-offset-4">
                SHOW ALL
              </Link>
            </>
          )}
        </p>
      </section>

      <div key={activeLens ?? 'all'} className={mounted.current ? 'nb-fade' : undefined}>
      {years.map(([year, items]) => (
        <section key={year} aria-label={`Entries from ${year}`} className="pb-6">
          <h2 className="border-t border-ink/35 pt-3 pb-1 font-mono text-xs font-medium tracking-[0.12em]">
            {year}
          </h2>
          <ul className="list-none p-0">
            {items.map((it) =>
              it.type === 'sheetGroup' ? (
                <li key={`sheets-${it.date}`} className={ROW_FULL}>
                  <Gutter kind="sheet" date={it.date} />
                  <SheetGroupRow sheets={it.sheets} />
                  <span className="hidden sm:block" />
                </li>
              ) : (
                <li
                  key={it.e.id}
                  className={LOG_KINDS.has(it.e.kind) ? ROW_LOG : ROW_FULL}
                >
                  <Gutter kind={it.e.kind} date={it.e.date} />
                  <RowBody e={it.e} />
                  <span className="hidden text-right font-mono text-[10px] tracking-[0.08em] sm:block">
                    {it.e.kind === 'project' && <SheetNo e={it.e} />}
                  </span>
                </li>
              ),
            )}
          </ul>
        </section>
      ))}
      </div>
    </SheetPage>
  )
}
