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
import { useMemo, type ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
// ONE DATE GRAMMAR (Emilie, 2026-08-05). A note page printed the raw registry
// string, "~ THOUGHT · 2026-01", while /work and the book both rendered
// "JAN 2026" through this formatter. Same fact, two grammars, and the machine
// one was on the page whose whole job is to be read.
import { fmtMonthYear } from '../components/ThoughtIndexRows'
import { FigNumberContext } from './figures'
import useIsDesktop from '../hooks/useIsDesktop'
import type { ReachSet } from '../components/reach/verbs'
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

// (CTRL retired 2026-08-06 with the header-line nav it styled. The drawer's own
// `.reach-drawer__row` is the one rendition of these controls now.)

export default function ThoughtLeaf(props: {
  number?: string
  title: string
  date: string
  lens: Lens
  /** The NEWER note. Added 2026-08-04 with the drawer: on the header line there
   *  was never room for a fourth control, in the drawer there is. */
  prev?: { title: string; route: string }
  next?: { title: string; route: string }
  children: ReactNode
}) {
  const { number, title, date, lens, prev, next, children } = props
  // The morph target: /thoughts/:id names its title so the index row (or the
  // mind-graph node) that opened it travels into it (src/lib/viewTransition.ts).
  const { id } = useParams()

  // THE HEADER EMPTIES ON A PHONE (Emilie's ruling 2026-08-04, from the
  // consistency sweep). Measured at 390px, a note's header band was 131px
  // against every other room's 76: the pill already fills the line at 366px, so
  // these tools had nowhere to go but a second row, and they wrapped into a
  // third. 55px of chrome, on the one page whose entire job is to be read.
  //
  // The two halves go different ways, because they are different things:
  //   · THE META is information about this note, so it goes back into the
  //     article, above the title, where it costs the same pixels once and then
  //     scrolls away. (It rode the header from her ruling of 2026-07-19, which
  //     was a desktop-era decision about a frozen frame; below lg there is no
  //     frozen frame any more.)
  //   · THE THREE CONTROLS are verbs — ways on to another note — so they go
  //     into the room's drawer, in the thumb arc, where every other room's verbs
  //     now live. They also gain 8px each: 36px was under the floor.
  // From lg up NOTHING changes: the header line has room there, and that is the
  // composition she signed.
  const isDesktop = useIsDesktop()

  const headerInfo = (
    <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
      <div className="flex flex-wrap items-center gap-x-3 font-mono text-micro tracking-[0.08em] text-[var(--lang-ink-muted)]">
        <span>~ THOUGHT · {fmtMonthYear(date)}</span>
        <LensPill lens={lens} />
        {number && <span>{number}</span>}
      </div>
      {/* THE FOUR VERBS LEFT THIS LINE (Emilie, 2026-08-06): "since in the
          mobile we use a drawer, to unify let's have the drawer in the web, and
          use the same color and glyph in the desktop and the mobile version."
          They lived here from lg up and in the drawer below it, which meant two
          renditions of one control set that had to be kept in step by hand. Now
          there is ONE set, the drawer's, at every width — so "the same colour
          and glyph" is true by construction rather than by maintenance.
          What stays here is only the META, which is information about the note
          and not a verb. */}
    </div>
  )

  // THE ROOM'S VERBS (Emilie's ruling 2026-08-04: the drawer becomes a real
  // per-room system). A note's verbs are its three ways onward, which is
  // exactly what was crowding the header. `leaf` is not new wording: it is the
  // word this file has used for these controls since it was written ("the way
  // to leaf through the record", above).
  const reachSet: ReachSet = useMemo(
    () => ({
      label: 'Leaf through the record',
      handle: 'leaf',
      // AT EVERY WIDTH NOW (her ruling 2026-08-06). The note is the one room
      // whose verbs were rendered twice, once on the header line and once in the
      // drawer; this is the single set, so the desktop and the phone cannot
      // drift apart.
      wide: true,
      // Centred on the edge from lg up (her ruling, same message): a note is a
      // page you read, so its way onward sits beside the text, not in a corner.
      place: 'middle',
      // Order is the reading order, not the alphabet: the two ways ALONG the
      // shelf first, then the two ways off it. PREVIOUS goes BACK in time and
      // NEXT goes FORWARD (she corrected the direction on 2026-08-06; the shelf
      // array runs newest-first, which is the opposite of the labels, and
      // ThoughtRoute carries the note about it).
      // Either can be absent at the ends of the shelf; neither wraps.
      //
      // THE GLYPHS AND THEIR ACCENTS COME WITH THEM, which is the other half of
      // "the same colour and glyph": the marks that used to ride the header line
      // now ride the drawer rows, same icon, same light-dark pair. The arrow is
      // mirrored for PREVIOUS, because it is the same movement the other way.
      verbs: [
        ...(prev
          ? [
              {
                id: 'prev',
                label: 'Previous',
                to: prev.route,
                mark: (
                  <span className="inline-flex -scale-x-100" style={{ color: 'light-dark(#0f766e, #5eead4)' }}>
                    <CtrlIcon name="arrow" />
                  </span>
                ),
              },
            ]
          : []),
        ...(next
          ? [
              {
                id: 'next',
                label: 'Next',
                to: next.route,
                mark: (
                  <span className="inline-flex" style={{ color: 'light-dark(#0f766e, #5eead4)' }}>
                    <CtrlIcon name="arrow" />
                  </span>
                ),
              },
            ]
          : []),
        {
          id: 'time',
          label: 'In time',
          to: `/thoughts#${id ?? ''}`,
          mark: (
            <span className="inline-flex" style={{ color: 'light-dark(#a16207, #fbbf24)' }}>
              <CtrlIcon name="clock" />
            </span>
          ),
        },
        {
          id: 'all',
          label: 'All thoughts',
          to: '/work#thoughts',
          mark: (
            <span className="inline-flex" style={{ color: 'light-dark(#4338ca, #a5b4fc)' }}>
              <CtrlIcon name="list" />
            </span>
          ),
        },
      ],
    }),
    [id, prev, next],
  )

  return (
    <SheetPage
      center={false}
      pillTools={isDesktop ? headerInfo : undefined}
      toolsKey="leaf"
      reach={reachSet}
    >
      <article className="mx-auto w-full max-w-[680px] pt-8 pb-12">
        {/* THE META, ON A PHONE ONLY (2026-08-04). Same three facts the header
            carries from lg up, in the same order and the same words; here they
            simply belong to the article, which is why they may scroll away.
            Rendered from the identical values, so the two can never disagree. */}
        {!isDesktop && (
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-micro tracking-[0.08em] text-[var(--lang-ink-muted)]">
            <span>~ THOUGHT · {fmtMonthYear(date)}</span>
            <LensPill lens={lens} />
            {number && <span>{number}</span>}
          </div>
        )}
        {/* Only the title in the content on desktop (Emilie's ruling round 2):
            the meta moved to the header line there. */}
        <h1
          className="mb-6 max-w-[22ch] font-serif text-display leading-[1.22] font-medium lowercase italic tracking-[-0.01em] text-[var(--lang-ink)]"
          style={{ viewTransitionName: id ? vtName(`/thoughts/${id}`) : undefined }}
        >
          {title}
        </h1>

        {/* Words only, on the ground. Child selectors keep the note files
            plain <p> + NB dots. [&_p]:relative anchors the sketch-dot's
            floating drawing to the paragraph's margin (S5). */}
        <div className="prose-rag max-w-[62ch] font-serif text-prose leading-[1.75] text-[var(--lang-ink)] [&_p]:relative [&_p]:mb-[1.15em] [&_p:last-child]:mb-0">
          {/* Every plate inside this note finds its place in the running figure
              count from here. The value is the THOUGHT ID, not the T-number:
              numbering is a book-wide sequence in date order, so the plate has
              to look itself up in that run rather than read a local label. */}
          <FigNumberContext.Provider value={id ?? null}>{children}</FigNumberContext.Provider>
        </div>
      </article>
    </SheetPage>
  )
}
