import { lazy, Suspense, useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import Home from './pages/Home'
import Notebook from './pages/Notebook'
import About from './pages/About'
import CV from './pages/CV'
import SheetRoute from './pages/SheetRoute'
import ExploreErrorBoundary from './components/ExploreErrorBoundary'

const ExplorePage = lazy(() => import('./explore/ExplorePage'))
// Thought-note leaves (Session 11): split out of the landing chunk; the note
// prose only loads when someone opens /thoughts/:id.
const ThoughtRoute = lazy(() => import('./pages/ThoughtRoute'))

// Mylar hold while a lazy READ-mode chunk resolves (matches SheetRoute).
function MylarScreen() {
  return <div className="min-h-dvh bg-mylar" aria-hidden="true" />
}

// Bare carbon field while the EXPLORE chunk loads, so the mode toggle's
// overlay, the loading state, and the scene read as one continuous dark table.
function CarbonScreen() {
  return <div className="fixed inset-0 bg-carbon" aria-hidden="true" />
}

// Boundary OUTSIDE Suspense: a chunk-eval throw (e.g. the graph layout
// invariant) rejects the lazy import and must land on the message, not
// blank the app.
function ExploreRoute() {
  return (
    <ExploreErrorBoundary>
      <Suspense fallback={<CarbonScreen />}>
        <ExplorePage />
      </Suspense>
    </ExploreErrorBoundary>
  )
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

// Cookieless page counting (GoatCounter, opted in 2026-07-07): count.js
// counts the initial load on its own; this counts client-side route changes
// only (first render skipped so the landing is not double-counted).
// count.js records the FULL location incl. the GH Pages base, while
// react-router strips the basename from pathname; re-prefix so every view
// of a page lands on one dashboard row. No-op in dev (BASE_URL = '/').
const COUNT_BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

function PageCount() {
  const { pathname } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    window.goatcounter?.count?.({ path: COUNT_BASE + pathname })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <PageCount />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notebook" element={<Notebook />} />
        <Route path="/work" element={<WorkRedirect />} />
        <Route path="/about" element={<About />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/sheets/:sheetId" element={<SheetRoute />} />
        <Route
          path="/thoughts/:id"
          element={
            <Suspense fallback={<MylarScreen />}>
              <ThoughtRoute />
            </Suspense>
          }
        />
        <Route path="/explore" element={<ExploreRoute />} />
        <Route path="/explore/:nodeId" element={<ExploreRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
