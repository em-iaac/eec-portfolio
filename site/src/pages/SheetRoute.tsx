// /sheets/:sheetId resolver: issued sheets render their content component;
// registry entries still in preparation get the enriched MiniSheet placeholder
// (blurb, figures, tags, links, EXPLORE deep link); unknown numbers land on
// the Notebook.
import { Suspense } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { getSheetEntry } from '../data/registry'
import { SHEETS } from '../sheets'
import MiniSheet from '../components/sheet/MiniSheet'

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

  return <MiniSheet entry={entry} />
}
