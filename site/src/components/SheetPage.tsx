import { type ReactNode } from 'react'
import TitleBlock from './TitleBlock'
import Footer from './Footer'

// THE FROZEN FRAME (rebuilt at the design audit, Emilie's ruling round 2,
// 2026-07-19: "header with all info, the footer full bleed, the content in
// the middle, and the header and footer always freeze even if we scroll").
// The page is exactly one viewport tall and never scrolls itself; the header
// LINE and the footer LINE are frozen flex bands, and the CONTENT scrolls
// inside the middle band when it overflows (a long thought), centring when
// it fits (the auto margins do both without the flex-centre clip). One mode,
// whole site; navigation runs the universal soft crossfade.
// (S3: the title is written by lib/routeHead.ts, one source.)
export default function SheetPage({
  children,
  wide = false,
  pillTools,
  center = true,
  footer = true,
  fill = false,
}: {
  children: ReactNode
  /** /work + /cv run full-width (cap 1920); other pages keep the column. */
  wide?: boolean
  /** A page's own tools on the header line, right of the pill. */
  pillTools?: ReactNode
  /** Content centres vertically in the middle band (auto margins); a
      document that reads top-first can opt out. */
  center?: boolean
  /** Pages whose contact/identity already lives elsewhere drop the footer
      to kill repetition (/cv puts it on the header line, /about in the
      middle as the contact sheet). */
  footer?: boolean
  /** The content FILLS the middle band (so its own children can scroll
      inside it, like /cv's per-column scroll) instead of centring. */
  fill?: boolean
}) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[var(--lang-interaction)] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-[var(--lang-ground)]"
      >
        Skip to content
      </a>
      <TitleBlock tools={pillTools} />
      <main
        id="main"
        tabIndex={-1}
        className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-5 outline-none sm:px-8"
      >
        <div
          className={`mx-auto w-full ${wide ? 'max-w-[1920px]' : 'max-w-5xl'} ${
            fill ? 'flex min-h-0 flex-1 flex-col' : center ? 'my-auto' : ''
          }`}
        >
          {children}
        </div>
      </main>
      {footer && <Footer />}
    </div>
  )
}
