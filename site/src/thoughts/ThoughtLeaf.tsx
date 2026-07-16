// THOUGHT LEAF (Session 11; re-skinned G2, 2026-07-10, Emilie's ruling:
// "words on the ground"). The reading page for one written thought: the
// standard glass chrome (SheetPage pill header + footer), then nothing but
// type on the page ground: a mono meta line, the lowercase serif italic
// title (the thinking voice), a 62ch serif column, and a quiet endmatter row.
// NO panel under the prose (glass is for UI, not for words), NO figures,
// ever. n.b. hover dots stay under rule 8's five-per-leaf cap. The endmatter
// carries the two corridors (retargeted at the reindex, 2026-07-16): back to
// the thoughts LIST in /work's THE THOUGHTS section, and this thought's
// place in time — the neural world at /thoughts, centred + woken on this
// very neuron via the #id hash.
import { type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import { LensPill } from '../components/ui/Pill'
import { type Lens } from '../components/Lens'
import { vtName } from '../lib/viewTransition'
import { PILLAR_PATH } from '../lib/pillar'

const RED_LINK =
  '-m-2 p-2 text-[var(--lang-interaction)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'

export default function ThoughtLeaf({
  number,
  title,
  date,
  lens,
  next,
  pillarDoor = false,
  children,
}: {
  number?: string
  title: string
  date: string
  lens: Lens
  next?: { title: string; route: string }
  /** S3 (D6 topical authority): a neuro-tagged note carries a door to the
   *  Behavior Information Modeling pillar; the pillar links back. */
  pillarDoor?: boolean
  children: ReactNode
}) {
  // The morph target: /thoughts/:id names its title so the index row (or the
  // mind-graph node) that opened it travels into it (src/lib/viewTransition.ts).
  const { id } = useParams()

  return (
    <SheetPage>
      <article className="mx-auto w-full max-w-[680px] pt-10 pb-16">
        {/* The note knows its place in the record: kind + date, the lens
            (shape + label, never colour alone), the quiet T-number. */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink-muted)]">
          <span>~ THOUGHT · {date}</span>
          <LensPill lens={lens} />
          {number && <span className="ml-auto">{number}</span>}
        </div>

        <h1
          className="mt-4 mb-6 max-w-[22ch] font-serif text-[27px] leading-[1.22] font-medium lowercase italic tracking-[-0.01em] text-[var(--lang-ink)]"
          style={{ viewTransitionName: id ? vtName(`/thoughts/${id}`) : undefined }}
        >
          {title}
        </h1>

        {/* Words only, on the ground. Child selectors keep the note files
            plain <p> + NB dots. */}
        <div className="max-w-[62ch] font-serif text-[16.5px] leading-[1.75] text-[var(--lang-ink)] [&_p]:mb-[1.15em] [&_p:last-child]:mb-0">
          {children}
        </div>

        <div className="mt-9 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t-[0.5px] border-[var(--lang-hairline)] pt-3.5 font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink-muted)]">
          {/* The list moved to /work at the reindex (2026-07-16): #thoughts
              is the THE THOUGHTS section anchor, not a lens facet. */}
          <Link to="/work#thoughts" viewTransition className={RED_LINK}>
            ‹ ALL THOUGHTS
          </Link>
          <Link to={`/thoughts#${id ?? ''}`} className={RED_LINK}>
            SEE THIS THOUGHT IN TIME ›
          </Link>
          {pillarDoor && (
            <Link to={PILLAR_PATH} viewTransition className={RED_LINK}>
              BEHAVIOR INFORMATION MODELING ›
            </Link>
          )}
          {next && (
            <Link to={next.route} viewTransition className={RED_LINK}>
              NEXT THOUGHT ›
            </Link>
          )}
          <span className="ml-auto">{number ? `${number} · NOTE` : 'NOTE'}</span>
        </div>
      </article>
    </SheetPage>
  )
}
