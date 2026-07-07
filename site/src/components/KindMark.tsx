// The field-guide grammar (Session 6): every text row in the record carries
// a mono kind-mark in its date gutter. The key:
//   filled ink square = project   (a CSS block, not a font glyph, so it
//                                  renders crisp at gutter sizes)
//   #  = sheet issue              (REDLINE: issue events are liveness, rule 1)
//   ~  = thought
//   +  = milestone
//   *  = award
//   ¶  = press
//   "  = talk (reserved; none live yet)
// Marks are ink except the sheet '#'. No visible text label rides along
// (Session 6 ruling: the marks carry the meaning); the sr-only kind name
// keeps screen readers informed. Project IMAGE CARDS (bench roll, mobile
// feed) skip the mark: the card is self-evident.
import type { EntryKind } from '../data/registry'

const GLYPH: Record<Exclude<EntryKind, 'project'>, string> = {
  sheet: '#',
  thought: '~',
  milestone: '+',
  award: '*',
  press: '¶',
  talk: '"',
}

const SR: Record<EntryKind, string> = {
  project: 'project',
  sheet: 'sheet issue',
  thought: 'thought',
  milestone: 'milestone',
  award: 'award',
  press: 'press',
  talk: 'talk',
}

// The tightened log tier (Session 6 hierarchy): projects and sheet issues
// keep full row weight everywhere; these kinds read as marginalia.
export const LOG_KINDS: ReadonlySet<EntryKind> = new Set([
  'thought',
  'milestone',
  'award',
  'press',
  'talk',
])

export default function KindMark({ kind }: { kind: EntryKind }) {
  return (
    <>
      {kind === 'project' ? (
        <span aria-hidden="true" className="inline-block size-[7px] bg-ink" />
      ) : (
        <span aria-hidden="true" className={kind === 'sheet' ? 'text-redline' : 'text-ink'}>
          {GLYPH[kind]}
        </span>
      )}
      <span className="sr-only">{SR[kind]} </span>
    </>
  )
}
