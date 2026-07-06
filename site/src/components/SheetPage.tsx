import { useEffect, type ReactNode } from 'react'
import TitleBlock from './TitleBlock'
import Footer from './Footer'

export default function SheetPage({
  sheet,
  title,
  children,
}: {
  sheet: string
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
      <TitleBlock sheet={sheet} />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-5xl flex-1 px-5 outline-none sm:px-8">
        {children}
      </main>
      <Footer sheet={sheet} />
    </div>
  )
}
