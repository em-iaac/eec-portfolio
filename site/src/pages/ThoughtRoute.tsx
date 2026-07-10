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

  const after = drafted[drafted.indexOf(entry) + 1]

  return (
    <ThoughtLeaf
      number={entry.note!.number}
      title={entry.title}
      date={entry.date}
      lens={entry.lens}
      next={after ? { title: after.title, route: after.note!.route } : undefined}
    >
      {body}
    </ThoughtLeaf>
  )
}
