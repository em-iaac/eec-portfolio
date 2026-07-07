// The full research record (replaces the Work drawing set): every registry
// entry, newest first, grouped by year: the archive behind the Home bench
// roll. Lens chips filter via the URL hash so filtered views stay shareable.
// Entry kinds render distinctly: projects as titled rows with prose, thoughts
// as serif italic, milestones/awards as mono log lines (shape + label, never
// color alone).
import { Link, useLocation } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import { Legend, LensTick, LENSES, type Lens } from '../components/Lens'
import { entriesByYear, type RegistryEntry } from '../data/registry'
import { PROJECTS_BY_SLUG } from '../data/projects'

const KIND_PREFIX: Partial<Record<RegistryEntry['kind'], string>> = {
  award: 'AWARD',
  talk: 'TALK',
  press: 'PRESS',
  milestone: 'MILESTONE',
}

function SheetNo({ e }: { e: RegistryEntry }) {
  if (!e.sheet) return null
  return e.sheet.status === 'issued' ? (
    <span className="text-ink">{e.sheet.number}</span>
  ) : (
    <span className="text-anno">{e.sheet.number} · IN PREP</span>
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
          className="-m-2 p-2 text-redline underline underline-offset-4"
        >
          SHEET {e.sheet!.number} ISSUED: {e.title.toUpperCase()} &gt;
        </Link>
      </p>
    )
  }
  const prefix = KIND_PREFIX[e.kind]
  return (
    <p className="font-mono text-[10px] tracking-[0.08em] leading-relaxed">
      {prefix && <span className="font-medium text-ink">{prefix} · </span>}
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

  const years = entriesByYear()
    .map(([year, entries]) => [
      year,
      activeLens ? entries.filter((e) => e.lens === activeLens) : entries,
    ] as const)
    .filter(([, entries]) => entries.length > 0)

  const total = years.reduce((n, [, entries]) => n + entries.length, 0)

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
              <Link to="/notebook" className="-m-2 p-2 text-redline underline underline-offset-4">
                SHOW ALL
              </Link>
            </>
          )}
        </p>
      </section>

      {years.map(([year, entries]) => (
        <section key={year} aria-label={`Entries from ${year}`} className="pb-6">
          <h2 className="border-t border-ink/35 pt-3 pb-1 font-mono text-xs font-medium tracking-[0.12em]">
            {year}
          </h2>
          <ul className="list-none p-0">
            {entries.map((e) => (
              <li
                key={e.id}
                className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-x-4 border-t border-ink/20 py-3 first:border-t-0 sm:grid-cols-[4.5rem_minmax(0,1fr)_6.5rem]"
              >
                <span className="font-mono text-[10px] tracking-[0.08em] text-anno">
                  {e.date}
                </span>
                <RowBody e={e} />
                <span className="hidden text-right font-mono text-[10px] tracking-[0.08em] sm:block">
                  {e.kind === 'project' && <SheetNo e={e} />}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </SheetPage>
  )
}
