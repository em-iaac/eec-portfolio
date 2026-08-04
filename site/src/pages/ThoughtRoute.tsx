// /thoughts/:id resolver (Session 11; G2 re-skin): a thought with a drafted
// note renders its words-only leaf; anything else (unknown id, a thought
// whose note is still absent, a note with no body yet) falls back to the
// THOUGHTS index (the shelf it would live on). NEXT walks the drafted notes
// newest-first, the same order as the index, and simply ends at the oldest
// note (no wrap: a shelf has a last book).
import { Navigate, useParams } from 'react-router-dom'
import { ENTRIES, byDateDesc } from '../data/registry'
import ThoughtLeaf from '../thoughts/ThoughtLeaf'
import { THOUGHT_NOTES } from '../thoughts/notes'
import { isPillarRelated } from '../lib/pillar'

export default function ThoughtRoute() {
  const { id = '' } = useParams()
  const drafted = ENTRIES.filter(
    (e) => e.kind === 'thought' && e.note?.status === 'drafted' && THOUGHT_NOTES[e.id],
  ).sort(byDateDesc)

  const entry = drafted.find((e) => e.id === id)
  const body = THOUGHT_NOTES[id]

  if (!entry || !entry.lens || !body) {
    return <Navigate to="/thoughts" replace />
  }

  // The shelf runs newest-first, so `after` is the OLDER note (keep reading) and
  // `before` is the NEWER one. PREVIOUS joined NEXT at her ruling 2026-08-04
  // ("maybe we should have next and previous not only next"): now that both live
  // in the drawer rather than on the header line, a second way to walk costs no
  // chrome at all, and a shelf you can only walk one way is half a shelf.
  // Neither wraps: a shelf has a first book and a last one.
  const idx = drafted.indexOf(entry)
  const after = drafted[idx + 1]
  const before = idx > 0 ? drafted[idx - 1] : undefined

  return (
    <ThoughtLeaf
      number={entry.note!.number}
      title={entry.title}
      date={entry.date}
      lens={entry.lens}
      prev={before ? { title: before.title, route: before.note!.route } : undefined}
      next={after ? { title: after.title, route: after.note!.route } : undefined}
      pillarDoor={isPillarRelated(entry.tags)}
    >
      {body}
    </ThoughtLeaf>
  )
}
