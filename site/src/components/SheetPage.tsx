import { useEffect, type ReactNode } from 'react'
import TitleBlock from './TitleBlock'
import Footer from './Footer'
import {
  ExploreExitContext,
  ExploreOverlay,
  liftStyle,
  useExploreTransition,
} from '../hooks/useExploreTransition'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

export default function SheetPage({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const { leaving, beginExit } = useExploreTransition()
  const prm = usePrefersReducedMotion()

  useEffect(() => {
    document.title = title ? `${title} | Emilie El Chidiac` : 'Emilie El Chidiac | Design Technology Architect'
  }, [title])

  return (
    <ExploreExitContext.Provider value={beginExit}>
      {/* TEMPORARY light pin (DL-0): the sheet pages still speak Pen Table
          (ink-on-mylar constants), so the mode-aware chrome inside must
          resolve light here or a dark-glass header would sit on mylar.
          Each page drops this pin as it re-skins (DL-1..DL-5). */}
      <div data-theme="light" className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-redline focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-mylar"
        >
          Skip to content
        </a>
        <TitleBlock onExplore={beginExit} />
        <div className="flex flex-1 flex-col" style={liftStyle(leaving, prm)}>
          <main id="main" tabIndex={-1} className="mx-auto w-full max-w-5xl flex-1 px-5 outline-none sm:px-8">
            {children}
          </main>
          <Footer />
        </div>
        <ExploreOverlay leaving={leaving} />
      </div>
    </ExploreExitContext.Provider>
  )
}
