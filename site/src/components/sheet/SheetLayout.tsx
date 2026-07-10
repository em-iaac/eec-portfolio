// Case-study sheet chrome (paper x lab notebook): nav strip, 1040px sheet
// frame, mono meta row, title, main column + 235px margin column, footer
// rule. Sheets are the deep documentation a mind-graph node or a WORK card
// lands on; the title carries the route's view-transition-name so the
// source morphs into it (src/lib/viewTransition.ts). The carbon-flood
// ceremony retired at DL-1 for the universal soft crossfade.
import { useEffect, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { vtName } from '../../lib/viewTransition'

const RED_LINK =
  'text-redline underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline'

export default function SheetLayout({
  sheetNo,
  title,
  navLabel,
  metaLeft,
  metaRight,
  footerLeft,
  footerRight,
  aside,
  children,
}: {
  sheetNo: string
  title: string
  navLabel: string
  metaLeft: string
  metaRight?: string
  footerLeft: string
  footerRight: string
  aside?: ReactNode
  children: ReactNode
}) {
  // The morph target: /sheets/:sheetId names its title so the opener (a
  // mind-graph node, a WORK link) travels into it. Param-derived, zero
  // per-sheet wiring.
  const { sheetId } = useParams()

  useEffect(() => {
    document.title = `${title} | ${sheetNo}`
  }, [title, sheetNo])

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
          className="w-full max-w-[1040px] px-5 py-8 outline-none sm:px-12 sm:py-11"
        >
          <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-mono text-[9px] tracking-[0.12em] text-anno">
            <span>{metaLeft}</span>
            {metaRight && <span>{metaRight}</span>}
          </div>
          <h1
            className="mb-[18px] max-w-[26ch] text-[30px] leading-[1.2] font-semibold tracking-[-0.01em]"
            style={{ viewTransitionName: sheetId ? vtName(`/sheets/${sheetId}`) : undefined }}
          >
            {title}
          </h1>

            <div className="grid gap-x-9 gap-y-8 lg:grid-cols-[minmax(0,1fr)_235px]">
              <div>{children}</div>
              {aside && (
                <aside
                  aria-label="General notes"
                  className="flex flex-col gap-[15px] lg:pt-[26px]"
                >
                  {aside}
                </aside>
              )}
            </div>

            <div className="mt-[30px] flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-ink/35 pt-3 font-mono text-[9px] tracking-[0.1em] text-anno">
              <span>{footerLeft}</span>
              <span>{footerRight}</span>
            </div>
        </main>
      </div>
    </div>
  )
}

// Shared label style for sheet section headings (ABSTRACT, METHOD, LISTING).
export function SheetLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1.5 font-mono text-[9px] tracking-[0.12em] text-anno">{children}</div>
  )
}
