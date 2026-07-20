// THOUGHT LEAF (Session 11; re-skinned G2 "words on the ground"; rebuilt at
// the design audit round 2, 2026-07-19). The reading page for one written
// thought inside the frozen frame (SheetPage): the HEADER LINE carries all
// the thought's info (its meta: kind, date, lens, number) AND the nav
// controls (All Thoughts, In Time, Next, each an icon + its own colour); the
// CONTENT is just the title + the words, scrolling on an invisible wheel
// between the frozen header and footer. The pillar door retired from the
// leaf (Emilie 2026-07-19: "only all thoughts, next and in time"); the
// pillar still links out to its cluster. No panel under the prose (glass is
// for UI, not words); the SKETCH DOT is the one sanctioned figure (S5).
import { type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import { LensPill } from '../components/ui/Pill'
import { type Lens } from '../components/Lens'
import { vtName } from '../lib/viewTransition'

// Each control: an icon + label in its own accessible accent (mode-aware
// light-dark pairs, all clear AA on both grounds). Colour + icon aid the
// scan; the label carries the meaning.
function CtrlIcon({ name }: { name: 'list' | 'clock' | 'arrow' }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
      {name === 'list' && <path {...p} d="M11 3.5L7 8l4 4.5M3 4h4M3 8h4M3 12h3" />}
      {name === 'clock' && (
        <>
          <circle {...p} cx="8" cy="8" r="5.5" />
          <path {...p} d="M8 5v3l2 1.4" />
        </>
      )}
      {name === 'arrow' && <path {...p} d="M3 8h9M8.5 4.5L12 8l-3.5 3.5" />}
    </svg>
  )
}

const CTRL =
  '-m-1 inline-flex min-h-9 items-center gap-1.5 p-1 font-mono text-[10px] tracking-[0.08em] no-underline hover:underline hover:decoration-2 hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'

export default function ThoughtLeaf(props: {
  number?: string
  title: string
  date: string
  lens: Lens
  next?: { title: string; route: string }
  /** Accepted for call-site compatibility; the pillar door retired from the
   *  leaf at the audit (Emilie 2026-07-19). */
  pillarDoor?: boolean
  children: ReactNode
}) {
  const { number, title, date, lens, next, children } = props
  // The morph target: /thoughts/:id names its title so the index row (or the
  // mind-graph node) that opened it travels into it (src/lib/viewTransition.ts).
  const { id } = useParams()

  // THE HEADER INFO + CONTROLS (Emilie's ruling round 2): the thought's meta
  // and the way to leaf through the record both ride the header line.
  const headerInfo = (
    <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
      <div className="flex flex-wrap items-center gap-x-3 font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink-muted)]">
        <span>~ THOUGHT · {date}</span>
        <LensPill lens={lens} />
        {number && <span>{number}</span>}
      </div>
      <span aria-hidden="true" className="h-4 w-px bg-[var(--lang-hairline)]" />
      <nav aria-label="Thought navigation" className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <Link to="/work#thoughts" viewTransition className={CTRL} style={{ color: 'light-dark(#4338ca, #a5b4fc)' }}>
          <CtrlIcon name="list" />
          ALL THOUGHTS
        </Link>
        <Link to={`/thoughts#${id ?? ''}`} className={CTRL} style={{ color: 'light-dark(#a16207, #fbbf24)' }}>
          <CtrlIcon name="clock" />
          IN TIME
        </Link>
        {next && (
          <Link to={next.route} viewTransition className={CTRL} style={{ color: 'light-dark(#0f766e, #5eead4)' }}>
            <CtrlIcon name="arrow" />
            NEXT
          </Link>
        )}
      </nav>
    </div>
  )

  return (
    <SheetPage center={false} pillTools={headerInfo}>
      <article className="mx-auto w-full max-w-[680px] pt-8 pb-12">
        {/* Only the title in the content now (Emilie's ruling round 2): the
            meta moved to the header line. */}
        <h1
          className="mb-6 max-w-[22ch] font-serif text-[27px] leading-[1.22] font-medium lowercase italic tracking-[-0.01em] text-[var(--lang-ink)]"
          style={{ viewTransitionName: id ? vtName(`/thoughts/${id}`) : undefined }}
        >
          {title}
        </h1>

        {/* Words only, on the ground. Child selectors keep the note files
            plain <p> + NB dots. [&_p]:relative anchors the sketch-dot's
            floating drawing to the paragraph's margin (S5). */}
        <div className="max-w-[62ch] font-serif text-[16.5px] leading-[1.75] text-[var(--lang-ink)] [&_p]:relative [&_p]:mb-[1.15em] [&_p:last-child]:mb-0">
          {children}
        </div>
      </article>
    </SheetPage>
  )
}
