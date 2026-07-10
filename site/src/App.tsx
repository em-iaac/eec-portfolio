import { lazy, Suspense, useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import Home from './pages/Home'
import Notebook from './pages/Notebook'
import About from './pages/About'
import CV from './pages/CV'
import SheetRoute from './pages/SheetRoute'

// Split out of the landing chunk so the perf-budgeted cover stays lean: the
// gallery (with its overlay + video code) and the note prose only load when
// someone actually opens /work or /thoughts/:id.
const Work = lazy(() => import('./pages/Work'))
const ThoughtRoute = lazy(() => import('./pages/ThoughtRoute'))

// THE PRIMITIVES LAB (DL-0): dev-only verification surface for the DL v2
// foundation. The DEV gate makes the whole chunk unreachable in prod, so it
// tree-shakes away: zero production weight, never in the nav, never
// prerendered.
const Lab = import.meta.env.DEV ? lazy(() => import('./pages/Lab')) : null

// Mylar hold while a lazy READ-mode chunk resolves (matches SheetRoute).
function MylarScreen() {
  return <div className="min-h-dvh bg-mylar" aria-hidden="true" />
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
    const prev = prevPath.current
    prevPath.current = pathname
    if (firstMount.current) {
      firstMount.current = false
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
      return
    }
    // The WORK card-on-top is an in-page modal addressed at /work/:id: toggling
    // it must not scroll the grid or steal focus from the dialog. Skip when the
    // change stays inside the /work family (entering /work from elsewhere still
    // resets as normal).
    const inWork = (p: string) => p === '/work' || p.startsWith('/work/')
    if (inWork(prev) && inWork(pathname)) return
    if (navType === 'POP') return
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
        {/* THE GALLERY (R2). /work/:id opens a card as a preview on top of the
            grid; a shared card link deep-links straight to it. Old /work#lens
            deep links now land on the gallery pre-filtered to that lens. */}
        <Route
          path="/work"
          element={
            <Suspense fallback={<MylarScreen />}>
              <Work />
            </Suspense>
          }
        />
        <Route
          path="/work/:id"
          element={
            <Suspense fallback={<MylarScreen />}>
              <Work />
            </Suspense>
          }
        />
        <Route path="/notebook" element={<Notebook />} />
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
        {Lab && (
          <Route
            path="/lab"
            element={
              <Suspense fallback={<MylarScreen />}>
                <Lab />
              </Suspense>
            }
          />
        )}
        {/* EXPLORE retired (R1): the landing IS the mind graph now. These URLs
            are shared and citable, so they redirect to the landing, never 404. */}
        <Route path="/explore" element={<Navigate to="/" replace />} />
        <Route path="/explore/:nodeId" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
