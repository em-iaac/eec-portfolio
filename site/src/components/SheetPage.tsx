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
}: {
  children: ReactNode
  /** One-screen pages pull the footer close (no long-page margin). */
  footerCompact?: boolean
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[var(--lang-interaction)] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-[var(--lang-ground)]"
      >
        Skip to content
      </a>
      <TitleBlock />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-5xl flex-1 px-5 outline-none sm:px-8">
        {children}
      </main>
      <Footer compact={footerCompact} />
    </div>
  )
}
