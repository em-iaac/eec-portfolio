// THOUGHT LEAF (Session 11). The words-only page for one written thought: a
// narrow serif column with its own drawing-set chrome (skip link, header
// strip, footer rule; the SheetLayout it once shared retired with the sheet
// tier at G1; this page re-skins at G2). The title is set
// in lowercase serif italic (the thinking voice, not the drawing-set voice)
// and there are NO figures, ever. The T-series number rides the number cell
// (Emilie's ruling 2026-07-08). Sets document.title. n.b. dots are allowed in
// the prose under rule 8's five-per-leaf cap; margin asides and plates are not.
import { useEffect, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import KindMark from '../components/KindMark'
import { LensTick, LENSES, type Lens } from '../components/Lens'
import { vtName } from '../lib/viewTransition'

const RED_LINK =
  'text-redline underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline'

export default function ThoughtLeaf({
  number,
  title,
  date,
  lens,
  navLabel,
  children,
}: {
  number?: string
  title: string
  date: string
  lens: Lens
  navLabel: string
  children: ReactNode
}) {
  // The morph target: /thoughts/:id names its title so the mind-graph node
  // that opened it travels into it (src/lib/viewTransition.ts).
  const { id } = useParams()

  useEffect(() => {
    document.title = number ? `${title} | ${number}` : `${title} | thought note`
  }, [title, number])

  return (
    <div className="flex min-h-dvh flex-col items-center">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-redline focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-mylar"
      >
        Skip to content
      </a>
      <header className="w-full border-b border-ink">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-3 font-mono text-[10px] tracking-[0.1em]">
          <Link to="/" viewTransition className={`-m-2.5 p-2.5 ${RED_LINK}`}>
            &lt; A-000 HOME
          </Link>
          <span className="hidden text-anno sm:block">{navLabel}</span>
          <Link to="/" viewTransition className={`-m-2.5 p-2.5 ${RED_LINK}`}>
            MODE: EXPLORE &gt;
          </Link>
        </div>
      </header>

      <div className="flex w-full flex-1 flex-col items-center">
        <main
            id="main"
            tabIndex={-1}
            className="w-full max-w-[680px] px-5 py-8 outline-none sm:px-8 sm:py-12"
          >
            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-mono text-[9px] tracking-[0.12em] text-anno">
              <span>{number ? `EL CHIDIAC, E. · MACAD · ${number}` : 'EL CHIDIAC, E. · MACAD'}</span>
              <span>THOUGHT NOTE</span>
            </div>

            {/* Dated, with the field-guide thought mark and its lens, one mono
                line: the note knows its place in the record. */}
            <div className="mb-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] tracking-[0.08em] text-anno">
              <span>
                <KindMark kind="thought" /> {date}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <LensTick lens={lens} size={8} />
                {LENSES[lens].label.toUpperCase()}
              </span>
            </div>

            {/* The thinking voice: lowercase serif italic, never the drawing-set
                Archivo of a sheet title. */}
            <h1
              className="mb-[26px] max-w-[22ch] font-serif text-[27px] lowercase italic leading-[1.22] tracking-[-0.01em] text-ink"
              style={{ viewTransitionName: id ? vtName(`/thoughts/${id}`) : undefined }}
            >
              {title}
            </h1>

            {/* Words only. Child selectors keep the note files plain <p>/NBDot. */}
            <article className="max-w-[62ch] font-serif text-[16.5px] leading-[1.75] text-ink [&_p]:mb-[1.15em] [&_p:last-child]:mb-0">
              {children}
            </article>

            <div className="mt-[34px] flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-ink/35 pt-3 font-mono text-[9px] tracking-[0.1em] text-anno">
              <Link to="/notebook" viewTransition className={`-m-2 p-2 ${RED_LINK}`}>
                BACK TO THE NOTEBOOK &gt;
              </Link>
              <span>{number ? `${number} · NOTE` : 'THOUGHT NOTE'}</span>
            </div>
        </main>
      </div>
    </div>
  )
}
