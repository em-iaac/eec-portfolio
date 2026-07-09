import { lazy, Suspense, useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import Home from './pages/Home'
import Notebook from './pages/Notebook'
import About from './pages/About'
import CV from './pages/CV'
import SheetRoute from './pages/SheetRoute'

// Thought-note leaves (Session 11): split out of the landing chunk; the note
// prose only loads when someone opens /thoughts/:id.
const ThoughtRoute = lazy(() => import('./pages/ThoughtRoute'))

// Mylar hold while a lazy READ-mode chunk resolves (matches SheetRoute).
function MylarScreen() {
  return <div className="min-h-dvh bg-mylar" aria-hidden="true" />
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
  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
      return
    }
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
        {/* EXPLORE retired (R1): the landing IS the mind graph now. These URLs
            are shared and citable, so they redirect to the landing, never 404. */}
        <Route path="/explore" element={<Navigate to="/" replace />} />
        <Route path="/explore/:nodeId" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
