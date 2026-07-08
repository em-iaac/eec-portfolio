// /thoughts/:id resolver (Session 11): a thought with a drafted note renders
// its words-only leaf; anything else (unknown id, a thought whose note is
// still absent, a note with no body yet) falls back to the Notebook, mirroring
// SheetRoute's in-preparation handling.
import { Navigate, useParams } from 'react-router-dom'
import { ENTRIES } from '../data/registry'
import ThoughtLeaf from '../thoughts/ThoughtLeaf'
import { THOUGHT_NOTES } from '../thoughts/notes'

export default function ThoughtRoute() {
  const { id = '' } = useParams()
  const entry = ENTRIES.find((e) => e.kind === 'thought' && e.id === id)
  const body = THOUGHT_NOTES[id]

  if (!entry || !entry.lens || entry.note?.status !== 'drafted' || !body) {
    return <Navigate to="/notebook" replace />
  }

  return (
    <ThoughtLeaf
      number={entry.note.number}
      title={entry.title}
      date={entry.date}
      lens={entry.lens}
      navLabel={`EMILIE EL CHIDIAC · THOUGHT / ${entry.title.toUpperCase()}${
        entry.note.number ? ` · ${entry.note.number}` : ''
      }`}
    >
      {body}
    </ThoughtLeaf>
  )
}
