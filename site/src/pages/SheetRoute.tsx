// /sheets/:sheetId resolver: issued sheets render their content component;
// registry entries still in preparation get an honest stub (the same
// wording EXPLORE uses); unknown numbers land on the Notebook.
import { Suspense } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getSheetEntry } from '../data/registry'
import { PROJECTS_BY_SLUG } from '../data/projects'
import { SHEETS } from '../sheets'
import SheetLayout from '../components/sheet/SheetLayout'

function SheetLoading() {
  return <div className="min-h-dvh bg-mylar" aria-hidden="true" />
}

export default function SheetRoute() {
  const { sheetId = '' } = useParams()
  const key = sheetId.toLowerCase()
  const entry = getSheetEntry(key)

  if (!entry || !entry.sheet) return <Navigate to="/notebook" replace />

  const Sheet = SHEETS[key]
  if (entry.sheet.status === 'issued' && Sheet) {
    return (
      <Suspense fallback={<SheetLoading />}>
        <Sheet />
      </Suspense>
    )
  }

  // IN PREPARATION stub: status is a fact, not an interaction, so the stamp
  // is ink (dashed, drafting-style), never redline.
  const number = entry.sheet.number
  const p = entry.project ? PROJECTS_BY_SLUG[entry.project] : undefined
  return (
    <SheetLayout
      sheetNo={number}
      title={entry.title}
      navLabel={`EMILIE EL CHIDIAC · WORK / ${entry.title.toUpperCase()} · SHEET ${number}`}
      metaLeft={`EL CHIDIAC, E. · ${number}`}
      metaRight="STATUS: IN PREPARATION"
      footerLeft={p?.tech ?? ''}
      footerRight={`${number} · 0 OF 1`}
    >
      <div className="mb-6 inline-block border border-dashed border-ink px-5 py-3 font-mono text-[10px] tracking-[0.12em] text-ink">
        SHEET: IN PREPARATION
      </div>
      {p && (
        <p className="mb-6 max-w-[62ch] font-serif text-[15.5px] leading-[1.65]">{p.blurb}</p>
      )}
      <p className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] tracking-[0.1em]">
        {p?.links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="-m-2 p-2 text-redline underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline"
          >
            {l.label}
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        ))}
        <Link
          to="/notebook"
          viewTransition
          className="-m-2 p-2 text-redline underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline"
        >
          BACK TO THE NOTEBOOK &gt;
        </Link>
      </p>
    </SheetLayout>
  )
}
