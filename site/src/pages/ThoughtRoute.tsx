// /thoughts/:id resolver (Session 11; G2 re-skin): a thought with a drafted
// note renders its words-only leaf; anything else (unknown id, a thought
// whose note is still absent, a note with no body yet) falls back to the
// THOUGHTS index (the shelf it would live on). NEXT walks the drafted notes
// newest-first, the same order as the index, and simply ends at the oldest
// note (no wrap: a shelf has a last book).
import { Navigate, useParams } from 'react-router-dom'
import { thoughtIndexEntries } from '../data/registry'
import ThoughtLeaf from '../thoughts/ThoughtLeaf'
import { THOUGHT_NOTES } from '../thoughts/notes'

export default function ThoughtRoute() {
  const { id = '' } = useParams()
  // ONE SHELF ORDER, and this file's own comment above has been claiming it for
  // a while without it being true. It sorted by `byDateDesc` alone; the index
  // (`thoughtIndexEntries`) sorts by date AND tie-breaks on T-number, which five
  // months need because they hold two notes each. So inside a tied month the
  // shelf you walk with NEXT and the shelf you see on /work could disagree.
  // Reading from the index selector makes the claim true rather than aspirational.
  const drafted = thoughtIndexEntries().filter(
    (e) => e.note?.status === 'drafted' && THOUGHT_NOTES[e.id],
  )

  const entry = drafted.find((e) => e.id === id)
  const body = THOUGHT_NOTES[id]

  if (!entry || !entry.lens || !body) {
    return <Navigate to="/thoughts" replace />
  }

  // NEXT GOES FORWARD IN TIME, PREVIOUS GOES BACK (Emilie, 2026-08-06: "next
  // should take you forward, and previous backward in time").
  //
  // THEY WERE THE WRONG WAY ROUND, and the reason is worth keeping because it is
  // an easy mistake to make again: the shelf array runs NEWEST-FIRST, so the
  // node at `idx + 1` is the OLDER note. That was being handed to `next` purely
  // because it is the next element in the array. Reading order in an array and
  // direction in time are opposite here, and the label follows TIME, which is
  // what a reader means by "next" on a site whose whole argument is chronology.
  // Neither wraps: a shelf has a first book and a last one.
  const idx = drafted.indexOf(entry)
  const older = drafted[idx + 1]
  const newer = idx > 0 ? drafted[idx - 1] : undefined

  return (
    <ThoughtLeaf
      number={entry.note!.number}
      title={entry.title}
      date={entry.date}
      lens={entry.lens}
      prev={older ? { title: older.title, route: older.note!.route } : undefined}
      next={newer ? { title: newer.title, route: newer.note!.route } : undefined}
    >
      {body}
    </ThoughtLeaf>
  )
}
