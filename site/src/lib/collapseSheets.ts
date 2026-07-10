// The collapse rule (Session 6), RENDER LAYER ONLY: the registry logs every
// sheet issue as its own entry (data model unchanged), but the record READS
// by month: same-month issues aggregate into one "SHEETS P-101, P-102
// ISSUED >" row (the CV career graph, since G3). The group is emitted at the
// newest issue's position; a single-issue month stays a plain entry.
import type { RegistryEntry } from '../data/registry'

export type LogItem =
  | { type: 'entry'; e: RegistryEntry }
  | { type: 'sheetGroup'; date: string; sheets: RegistryEntry[] }

export function collapseSheetIssues(entries: RegistryEntry[]): LogItem[] {
  const byMonth = new Map<string, RegistryEntry[]>()
  for (const e of entries) {
    if (e.kind !== 'sheet') continue
    const g = byMonth.get(e.date)
    if (g) g.push(e)
    else byMonth.set(e.date, [e])
  }

  const items: LogItem[] = []
  const emitted = new Set<string>()
  for (const e of entries) {
    if (e.kind !== 'sheet') {
      items.push({ type: 'entry', e })
      continue
    }
    const group = byMonth.get(e.date)!
    if (group.length === 1) {
      items.push({ type: 'entry', e })
    } else if (!emitted.has(e.date)) {
      emitted.add(e.date)
      items.push({ type: 'sheetGroup', date: e.date, sheets: group })
    }
  }
  return items
}
