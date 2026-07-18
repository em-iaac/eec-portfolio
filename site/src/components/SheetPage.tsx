import { type ReactNode } from 'react'
import TitleBlock from './TitleBlock'
import Footer from './Footer'

// The interior page shell. One mode, whole site (DL-1, 2026-07-10): the DL-0
// light pin retired with the carbon-flood ceremony; the shell follows the
// mode via the token bridge (index.css) until each page re-skins (DL-2..5),
// and navigation runs on the universal soft crossfade (language.css).
// (S3, 2026-07-13: the document.title effect and its title prop retired;
// lib/routeHead.ts is the one title writer, fed by lib/headData.ts.)
export default function SheetPage({
  children,
  footerCompact = false,
  wide = false,
  headerBar,
}: {
  children: ReactNode
  /** One-screen pages pull the footer close (no long-page margin). */
  footerCompact?: boolean
  /** LAYOUT B+ (WORK PAGE · LOOK & ORDER, Emilie's gate 2026-07-18): /work
      runs full-width; every other page keeps the centred column. Additive,
      opt-in. */
  wide?: boolean
  /** Replaces the centred pill with a page-owned header (the /work
      full-width bar, round 4 gate). Omit = the ordinary TitleBlock. */
  headerBar?: ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[var(--lang-interaction)] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-[var(--lang-ground)]"
      >
        Skip to content
      </a>
      {headerBar ?? <TitleBlock />}
      <main
        id="main"
        tabIndex={-1}
        className={`mx-auto w-full flex-1 px-5 outline-none sm:px-8 ${wide ? 'max-w-[1920px]' : 'max-w-5xl'}`}
      >
        {children}
      </main>
      <Footer compact={footerCompact} wide={wide} />
    </div>
  )
}
