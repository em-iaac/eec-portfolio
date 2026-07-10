// /sheets/:sheetId · the PERMANENT REDIRECT (G1, 2026-07-10). The Pen Table
// sheet tier retired when the opened WORK card became the project's whole
// showcase; sheet numbers survive as quiet labels and old /sheets/p-101
// URLs are shared and citable, so they land on the project's showcase at
// /work/:id forever, never a 404 (IDs are permanent, REDESIGN-SPEC §11).
// Unknown numbers fall back to the gallery.
import { Navigate, useParams } from 'react-router-dom'
import { getSheetEntry } from '../data/registry'

export default function SheetRoute() {
  const { sheetId = '' } = useParams()
  const entry = getSheetEntry(sheetId.toLowerCase())

  return <Navigate to={entry ? `/work/${entry.id}` : '/work'} replace />
}
