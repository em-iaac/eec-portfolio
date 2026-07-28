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
import { useRouteHead } from './lib/routeHead'
import { preloadPath, warmDoors } from './lib/preloadRoute'
import { setNavIntent } from './lib/navIntent'

// Split out of the landing chunk so the perf-budgeted cover stays lean: the
// gallery (with its overlay + video code) and the note prose only load when
// someone actually opens /work or /thoughts/:id. Contact + CV joined them at
// the LCP pass (2026-07-12): they pull SheetPage/Surface and their data
// files, none of which the landing needs. NotFound stays eager (a chunk
// error on the error page is the worst failure mode); SheetRoute is a
// 15-line redirect whose registry import ships in the entry anyway.
const Work = lazy(() => import('./pages/Work'))
const Thoughts = lazy(() => import('./pages/Thoughts'))
const ThoughtRoute = lazy(() => import('./pages/ThoughtRoute'))
const Contact = lazy(() => import('./pages/Contact'))
const CV = lazy(() => import('./pages/CV'))
// THE PILLAR (S3): the one Behavior Information Modeling definition surface
// (CONTENT-STRATEGY.md D6, topical authority). Lazy like every interior page.
const Pillar = lazy(() => import('./pages/Pillar'))

// THE PRIMITIVES LAB (DL-0): dev-only verification surface for the DL v2
// foundation. The DEV gate makes the whole chunk unreachable in prod, so it
// tree-shakes away: zero production weight, never in the nav, never
// prerendered.
const Lab = import.meta.env.DEV ? lazy(() => import('./pages/Lab')) : null

// THE PRINT SURFACE (G5): the chrome-less routes headless Chrome renders to
// the A4 book + CV PDFs at build time (scripts/render-pdfs.mjs). They must
// exist in the PROD build (the script prints the built dist), but they are
// unlinked, noindexed (robots.txt + a meta), and lazy so the site never
// pays for them.
const PrintBookRoute = lazy(() => import('./print/BookRoute'))
const PrintCvRoute = lazy(() => import('./print/CvRoute'))
// THE SHARE CARDS (S3): /print/og/:cardKey is the 1200x630 surface the
// prerender script screenshots into /og/<key>.png, one per project /
// thought / the pillar. Same print rules: unlinked, noindexed, lazy.
const PrintOgRoute = lazy(() => import('./print/OgRoute'))

// Ground-coloured hold while a lazy chunk resolves. It rides --lang-ground
// like every other surface: it used to be `bg-mylar`, a DIFFERENT white
// (#f7f7f4 against the site's #f5f6f7), so the hold flashed a slightly wrong
// paper. Route warming (lib/preloadRoute.ts) means this is rarely seen at all
// now, but "rarely seen" is not "allowed to be wrong".
function GroundHold() {
  return <div className="min-h-dvh bg-[var(--lang-ground)]" aria-hidden="true" />
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
    // Same-path search-param navigations (e.g. the retired ?view=words URLs
    // stripping their param on /thoughts) must never reset scroll or steal
    // focus; the effect re-runs on navType flips (PUSH<->REPLACE) even when
    // the pathname is unchanged.
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

// ROUTE WARMING (2026-07-26; lib/preloadRoute.ts has the full why). Every page
// is lazy behind an EMPTY Suspense hold, so a cold navigation spent its whole
// 250ms crossfade fading into a blank rectangle and then hard-cut to the real
// page when the chunk landed. Warming the chunk BEFORE the click means the
// transition captures the actual page. Two passes, both after first paint:
// the four doors on idle, and anything else the moment a pointer or focus
// touches its link. Delegated on the document so no <Link> needs touching and
// links that appear later (an opened overlay, the jump bar) are covered too.
function RouteWarming() {
  useEffect(() => {
    warmDoors()
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    const onIntent = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!el || el.target === '_blank') return
      const href = el.getAttribute('href') || ''
      // same-document paths only: never touch mailto:, external links or files
      if (!href.startsWith('/') || href.startsWith('//')) return
      preloadPath(base && href.startsWith(base + '/') ? href.slice(base.length) : href)
    }
    // THE MOTION INTENT (lib/navIntent.ts). Capture phase, so it runs before
    // react-router's own click handler and the attribute is on <html> by the
    // time startViewTransition captures the old snapshot. Anything set after
    // that point is simply too late.
    const onNav = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const el = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!el || el.target === '_blank') return
      const href = el.getAttribute('href') || ''
      if (!href.startsWith('/') || href.startsWith('//')) return
      const to = base && href.startsWith(base + '/') ? href.slice(base.length) : href
      setNavIntent(to, window.location.pathname.slice(base.length) || '/')
    }
    document.addEventListener('pointerover', onIntent, { passive: true })
    document.addEventListener('focusin', onIntent, { passive: true })
    document.addEventListener('click', onNav, true)
    return () => {
      document.removeEventListener('pointerover', onIntent)
      document.removeEventListener('focusin', onIntent)
      document.removeEventListener('click', onNav, true)
    }
  }, [])
  return null
}

// The pathless chrome route wrapping every page: scroll/focus handling, page
// counting, route warming, and the per-route <head> stopgap (lib/routeHead.ts)
// travel with the outlet. The print routes sit OUTSIDE this wrapper, so they
// never get the public head rewrite (they keep their own noindex meta).
function Chrome() {
  useRouteHead()
  return (
    <>
      <ScrollToTop />
      <PageCount />
      <RouteWarming />
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
  // The print surface rides OUTSIDE the Chrome wrapper: no scroll/focus
  // management, no page counting; the document is the whole page. The blank
  // Suspense hold is honest here (the render script waits for the
  // [data-print-ready] marker, and a human visitor gets the page a beat
  // later).
  {
    path: '/print/book',
    element: (
      <Suspense fallback={null}>
        <PrintBookRoute />
      </Suspense>
    ),
  },
  {
    path: '/print/cv',
    element: (
      <Suspense fallback={null}>
        <PrintCvRoute />
      </Suspense>
    ),
  },
  {
    path: '/print/og/:cardKey',
    element: (
      <Suspense fallback={null}>
        <PrintOgRoute />
      </Suspense>
    ),
  },
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
          <Suspense fallback={<GroundHold />}>
            <Work />
          </Suspense>
        ),
      },
      {
        path: '/work/:id',
        element: (
          <Suspense fallback={<GroundHold />}>
            <Work />
          </Suspense>
        ),
      },
      // THE READING ROOM (G2): the thoughts index; each note keeps its own
      // /thoughts/:id leaf below.
      {
        path: '/thoughts',
        element: (
          <Suspense fallback={<GroundHold />}>
            <Thoughts />
          </Suspense>
        ),
      },
      { path: '/notebook', element: <NotebookRedirect /> },
      {
        // THE CONTACT DOOR (her ruling 2026-07-28). Was /about until the bio
        // moved onto the landing and left a contact sheet behind; the old
        // address redirects forever (LEGACY_REDIRECTS), because it has been
        // shared and it is in the sitemap Google already crawled.
        path: '/contact',
        element: (
          <Suspense fallback={<GroundHold />}>
            <Contact />
          </Suspense>
        ),
      },
      { path: '/about', element: <Navigate to="/contact" replace /> },
      {
        path: '/cv',
        element: (
          <Suspense fallback={<GroundHold />}>
            <CV />
          </Suspense>
        ),
      },
      {
        // THE PILLAR (S3): the exact phrase IS the slug (D6).
        path: '/behavior-information-modeling',
        element: (
          <Suspense fallback={<GroundHold />}>
            <Pillar />
          </Suspense>
        ),
      },
      { path: '/sheets/:sheetId', element: <SheetRoute /> },
      {
        path: '/thoughts/:id',
        element: (
          <Suspense fallback={<GroundHold />}>
            <ThoughtRoute />
          </Suspense>
        ),
      },
      ...(Lab
        ? [
            {
              path: '/lab',
              element: (
                <Suspense fallback={<GroundHold />}>
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
