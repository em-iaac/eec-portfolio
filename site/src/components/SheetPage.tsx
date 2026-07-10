import { useEffect, type ReactNode } from 'react'
import TitleBlock from './TitleBlock'
import Footer from './Footer'

// The interior page shell. One mode, whole site (DL-1, 2026-07-10): the DL-0
// light pin retired with the carbon-flood ceremony; the shell follows the
// mode via the token bridge (index.css) until each page re-skins (DL-2..5),
// and navigation runs on the universal soft crossfade (language.css).
export default function SheetPage({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  useEffect(() => {
    document.title = title ? `${title} | Emilie El Chidiac` : 'Emilie El Chidiac | Design Technology Architect'
  }, [title])

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-redline focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-mylar"
      >
        Skip to content
      </a>
      <TitleBlock />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-5xl flex-1 px-5 outline-none sm:px-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
