import { lazy, Suspense, useEffect, useRef } from 'react'
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigationType,
  type RouteObject,
} from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import SheetRoute from './pages/SheetRoute'

// Split out of the landing chunk so the perf-budgeted cover stays lean: the
// gallery (with its overlay + video code) and the note prose only load when
// someone actually opens /work or /thoughts/:id. About + CV joined them at
// the LCP pass (2026-07-12): they pull SheetPage/Surface and their data
// files, none of which the landing needs. NotFound stays eager (a chunk
// error on the error page is the worst failure mode); SheetRoute is a
// 15-line redirect whose registry import ships in the entry anyway.
const Work = lazy(() => import('./pages/Work'))
const Thoughts = lazy(() => import('./pages/Thoughts'))
const ThoughtRoute = lazy(() => import('./pages/ThoughtRoute'))
const About = lazy(() => import('./pages/About'))
const CV = lazy(() => import('./pages/CV'))

// THE PRIMITIVES LAB (DL-0): dev-only verification surface for the DL v2
// foundation. The DEV gate makes the whole chunk unreachable in prod, so it
// tree-shakes away: zero production weight, never in the nav, never
// prerendered.
const Lab = import.meta.env.DEV ? lazy(() => import('./pages/Lab')) : null

// Ground-coloured hold while a lazy READ-mode chunk resolves (matches
// SheetRoute); bg-mylar is mode-aware since the DL-1 token bridge.
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
    // Same-path search-param navigations (/thoughts <-> ?view=words) must
    // never reset scroll or steal focus; the effect re-runs on navType flips
    // (PUSH<->REPLACE) even when the pathname is unchanged.
    if (prev === pathname && !hash) return
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

// THE NOTEBOOK DOOR RETIRED (G3; retargeted by the meta build, 2026-07-11):
// the record's time view lives at /thoughts now — the neural world, which
// shows every kind at once, so the old kind-facet hashes need no carrying.
// /notebook links are shared and citable: they redirect forever, never 404.
// (The G3 stop, /cv?view=graph, retired with the CV's graph view; those
// URLs degrade to the plain CV list.)
function NotebookRedirect() {
  return <Navigate to="/thoughts" replace />
}

// The pathless chrome route wrapping every page: scroll/focus handling +
// page counting travel with the outlet.
function Chrome() {
  return (
    <>
      <ScrollToTop />
      <PageCount />
      <Outlet />
    </>
  )
}

// ROUTE OBJECTS for the DATA router (DL-1): the plain <Routes> tree moved
// here because only data-router routes carry the `viewTransition` flag from
// Link/navigate into document.startViewTransition (the declarative
// <BrowserRouter> and even a descendant <Routes> under RouterProvider drop
// it), and the soft crossfade + morphs ride that flag.
export const routes: RouteObject[] = [
  {
    element: <Chrome />,
    children: [
      { path: '/', element: <Home /> },
      // THE GALLERY (R2). /work/:id opens a card as a preview on top of the
      // grid; a shared card link deep-links straight to it. Old /work#lens
      // deep links now land on the gallery pre-filtered to that lens.
      {
        path: '/work',
        element: (
          <Suspense fallback={<MylarScreen />}>
            <Work />
          </Suspense>
        ),
      },
      {
        path: '/work/:id',
        element: (
          <Suspense fallback={<MylarScreen />}>
            <Work />
          </Suspense>
        ),
      },
      // THE READING ROOM (G2): the thoughts index; each note keeps its own
      // /thoughts/:id leaf below.
      {
        path: '/thoughts',
        element: (
          <Suspense fallback={<MylarScreen />}>
            <Thoughts />
          </Suspense>
        ),
      },
      { path: '/notebook', element: <NotebookRedirect /> },
      {
        path: '/about',
        element: (
          <Suspense fallback={<MylarScreen />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: '/cv',
        element: (
          <Suspense fallback={<MylarScreen />}>
            <CV />
          </Suspense>
        ),
      },
      { path: '/sheets/:sheetId', element: <SheetRoute /> },
      {
        path: '/thoughts/:id',
        element: (
          <Suspense fallback={<MylarScreen />}>
            <ThoughtRoute />
          </Suspense>
        ),
      },
      ...(Lab
        ? [
            {
              path: '/lab',
              element: (
                <Suspense fallback={<MylarScreen />}>
                  <Lab />
                </Suspense>
              ),
            },
          ]
        : []),
      // EXPLORE retired (R1): the landing IS the mind graph now. These URLs
      // are shared and citable, so they redirect to the landing, never 404.
      { path: '/explore', element: <Navigate to="/" replace /> },
      { path: '/explore/:nodeId', element: <Navigate to="/" replace /> },
      // Everything else is honestly not a page (G4): the warm 404 replaces
      // the silent teleport home. Every RETIRED route above keeps its
      // redirect; only truly unknown addresses land here.
      { path: '*', element: <NotFound /> },
    ],
  },
]
