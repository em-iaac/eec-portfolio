import { lazy, Suspense, useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import Home from './pages/Home'
import Notebook from './pages/Notebook'
import About from './pages/About'
import CV from './pages/CV'
import SheetRoute from './pages/SheetRoute'

const ExplorePage = lazy(() => import('./explore/ExplorePage'))

// Bare carbon field while the EXPLORE chunk loads, so the mode toggle's
// overlay, the loading state, and the scene read as one continuous dark table.
function CarbonScreen() {
  return <div className="fixed inset-0 bg-carbon" aria-hidden="true" />
}

// /work carried the old drawing-set archive; the Notebook replaced it.
// Preserve lens deep links (#computation etc.) through the redirect.
function WorkRedirect() {
  const { hash } = useLocation()
  return <Navigate to={{ pathname: '/notebook', hash }} replace />
}

// On PUSH navigation: scroll to top (or hash target) and move focus to the
// main region so keyboard/screen-reader users land on the new page. POP
// (back/forward) keeps the browser's own scroll restoration; first mount
// leaves the initial position alone.
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navType = useNavigationType()
  const firstMount = useRef(true)
  const prevPath = useRef(pathname)
  useEffect(() => {
    const cameFrom = prevPath.current
    prevPath.current = pathname
    if (firstMount.current) {
      firstMount.current = false
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
      return
    }
    if (navType === 'POP') return
    // Intra-EXPLORE param changes (focusing words) must not fight the scene
    // with scroll/focus churn.
    if (pathname.startsWith('/explore') && cameFrom.startsWith('/explore')) return
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      const main = document.getElementById('main')
      main?.focus({ preventScroll: true })
      window.scrollTo(0, 0)
    }
  }, [pathname, hash, navType])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notebook" element={<Notebook />} />
        <Route path="/work" element={<WorkRedirect />} />
        <Route path="/about" element={<About />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/sheets/:sheetId" element={<SheetRoute />} />
        <Route
          path="/explore"
          element={
            <Suspense fallback={<CarbonScreen />}>
              <ExplorePage />
            </Suspense>
          }
        />
        <Route
          path="/explore/:nodeId"
          element={
            <Suspense fallback={<CarbonScreen />}>
              <ExplorePage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
