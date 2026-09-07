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
import RouteHold from './components/RouteHold'
import { getOpenedFrom, setNavIntent } from './lib/navIntent'
import { armMorph, installMorphNaming } from './lib/morphName'
import { installPhonePageMotion } from './lib/pageMotion'

// Split out of the landing chunk so the perf-budgeted cover stays lean: the
// gallery (with its overlay + video code) and the note prose only load when
// someone actually opens /work or /thoughts/:id. Contact + CV joined them at
// the LCP pass (2026-07-12): they pull SheetPage and their data
// files, none of which the landing needs. NotFound stays eager (a chunk
// error on the error page is the worst failure mode); SheetRoute is a
// 15-line redirect whose registry import ships in the entry anyway.
const Work = lazy(() => import('./pages/Work'))
// /work/:id only. It imports `routes` from this file to read the single route
// table, so it must be lazy: a static import would be a cycle at module load.
const ShowcaseRoute = lazy(() => import('./pages/ShowcaseRoute'))
const Thoughts = lazy(() => import('./pages/Thoughts'))
const ThoughtRoute = lazy(() => import('./pages/ThoughtRoute'))
const Contact = lazy(() => import('./pages/Contact'))
const CV = lazy(() => import('./pages/CV'))
// THE SMALL PRINT (the rights pass, 2026-07-30): ownership, credit and what
// the site collects. Lazy like every interior page, and reached from the
// footline only, never from the four doors.
const Rights = lazy(() => import('./pages/Rights'))
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

// The hold while a lazy chunk resolves. It used to be one empty ground-coloured
// div — which is exactly the "white screen for about a second" Emilie reported
// from the deployed site on 2026-08-04. It now keeps the chrome and draws the
// shape of the room it is standing in for; components/RouteHold.tsx carries the
// design and the timing, and lib/preloadRoute.ts fixes the wait itself.
//
// THE HOLD MUST BE IDENTIFIABLE BY SOMETHING THAT IS NOT ITS PAINT (the phone
// pass, 2026-08-02). scripts/prerender.mjs waits for `[data-route-hold]` to
// leave before it snapshots a route. It used to look for `.bg-mylar`, and when
// the class changed the selector silently matched nothing: the wait resolved on
// the first tick and SIX routes shipped their loading state to crawlers
// (/work, /cv, /thoughts, /contact, /rights, the pillar; 29 words each against
// the landing's 2454). The attribute lives on RouteHold's root and is a
// CONTRACT, not a style.
const GridHold = <RouteHold shape="grid" />
const LinesHold = <RouteHold shape="lines" />

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
    // ...AND THE SAME IS TRUE FROM EVERY OTHER ROOM (2026-08-04, found while
    // building the modal scroll lock). Since the showcase started opening in
    // place (pages/ShowcaseRoute.tsx, 2026-08-02) the page behind a project can
    // be the landing, /cv or the pillar, not just the gallery — but this guard
    // still only knew about /work. So opening Sensi from halfway down the CV
    // scrolled the CV to the top underneath the sheet, and closing returned to
    // a page that was no longer where she left it, which is the one thing
    // opening in place exists to promise. Measured: /cv at scrollY 900, open,
    // close, back at 0.
    //
    // `getOpenedFrom()` is the same record ShowcaseRoute reads to decide what to
    // render behind, so the two can never disagree about whether this is a
    // modal-over-a-page or a real arrival. Null means a cold load, a shared link
    // or the prerenderer, where /work/:id IS the gallery and resetting is right.
    // Focus is skipped with it: the sheet moves focus to the project title
    // itself (components/work/WorkOverlay.tsx).
    if (/^\/work\/[^/]+$/.test(pathname) && getOpenedFrom()) return
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

// THE READ + THE DOORS (2026-09-07, design D of the screen-time pass).
// GoatCounter has no time on page, so two anonymous EVENTS carry it, both
// through the same count.js call (sendBeacon first, image fallback):
//   read:<path>  fired ONCE per page once it has been in view for READ_MS of
//                ACTIVE time: visible tab AND focused window, so a tab left
//                in the background, or a window alt-tabbed away from, does
//                not count as attention. Fires while the page is still open,
//                so it never races pagehide. Read ÷ visits = held attention.
//   out:<door>   one delegated click on any <a> whose href is one of the
//                six doors a recruiter uses (the Sensi app, the CV and book
//                PDFs, GitHub, LinkedIn, email). Six rows, never grows; the
//                title carries the page the click came from.
// Both show as rows in the dashboard's Pages list under those prefixes and
// count in the visits total. Aggregate counts only: no cookie, no IP, no
// identity, so /rights 3.2 stays true as written (her ruling, unchanged).
const READ_MS = 30_000
const DOORS: ReadonlyArray<readonly [RegExp, string]> = [
  [/^https?:\/\/sensi\.emiliechidiac\.com(\/|$)/i, 'sensi'],
  [/\/cv-emilie-el-chidiac\.pdf$/i, 'cv-pdf'],
  [/\/portfolio-emilie-el-chidiac\.pdf$/i, 'book-pdf'],
  [/^https?:\/\/(www\.)?github\.com(\/|$)/i, 'github'],
  [/^https?:\/\/(www\.)?linkedin\.com(\/|$)/i, 'linkedin'],
  [/^mailto:/i, 'email'],
]
function doorOf(href: string): string | null {
  for (const [re, name] of DOORS) if (re.test(href)) return name
  return null
}

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

  // THE READ: a stopwatch that only runs while the page is visible and the
  // window focused; at READ_MS of accumulated active time the event fires.
  // Restarts per pathname (a hash change inside a sheet is the same page).
  useEffect(() => {
    const path = COUNT_BASE + pathname
    let active = 0 // ms banked from finished stretches
    let since: number | null = null // start of the running stretch, if any
    let timer: ReturnType<typeof setTimeout> | undefined
    let sent = false
    const isActive = () => document.visibilityState === 'visible' && document.hasFocus()
    const fire = () => {
      sent = true
      since = null
      window.goatcounter?.count?.({ path: 'read:' + path, event: true })
    }
    const pause = () => {
      if (since === null) return
      active += performance.now() - since
      since = null
      clearTimeout(timer)
    }
    const resume = () => {
      if (sent || since !== null || !isActive()) return
      since = performance.now()
      timer = setTimeout(fire, Math.max(0, READ_MS - active))
    }
    const sync = () => (isActive() ? resume() : pause())
    resume()
    document.addEventListener('visibilitychange', sync)
    window.addEventListener('focus', sync)
    window.addEventListener('blur', sync)
    return () => {
      pause()
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('focus', sync)
      window.removeEventListener('blur', sync)
    }
  }, [pathname])

  // THE DOORS: one capture-phase listener on the document, so no link
  // component is touched and a handler that stops propagation cannot hide
  // the click. Modified clicks (new tab) still count; middle clicks do not.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0) return
      const a = (e.target as Element | null)?.closest?.('a[href]')
      if (!(a instanceof HTMLAnchorElement)) return
      const door = doorOf(a.href)
      if (!door) return
      window.goatcounter?.count?.({
        path: 'out:' + door,
        title: COUNT_BASE + location.pathname,
        event: true,
      })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])
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
    // FIRST, so it wraps outermost and the phone never reaches the API at all.
    installPhonePageMotion()
    installMorphNaming()
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
      // ...and name the ONE source that is about to travel (lib/morphName.ts).
      // Same capture-phase timing, for the same reason: the old snapshot is
      // taken the instant startViewTransition runs, so this is the last moment
      // that counts.
      armMorph(to)
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
          <Suspense fallback={GridHold}>
            <Work />
          </Suspense>
        ),
      },
      {
        // THE SHOWCASE OPENS OVER WHERE YOU WERE (Emilie, 2026-08-02).
        // pages/ShowcaseRoute.tsx carries the why; in short it renders the page
        // you came from with the sheet over it, and falls back to the full
        // gallery for a cold arrival, a shared link or the prerenderer.
        path: '/work/:id',
        element: (
          <Suspense fallback={GridHold}>
            <ShowcaseRoute />
          </Suspense>
        ),
      },
      // THE READING ROOM (G2): the thoughts index; each note keeps its own
      // /thoughts/:id leaf below.
      {
        path: '/thoughts',
        element: (
          <Suspense fallback={GridHold}>
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
          <Suspense fallback={LinesHold}>
            <Contact />
          </Suspense>
        ),
      },
      { path: '/about', element: <Navigate to="/contact" replace /> },
      {
        path: '/cv',
        element: (
          <Suspense fallback={LinesHold}>
            <CV />
          </Suspense>
        ),
      },
      {
        // THE SMALL PRINT (the rights pass, 2026-07-30). No door lights for it
        // (activeDoor returns -1 for non-door rooms, like the pillar and 404),
        // which is correct: the footline is its only way in.
        path: '/rights',
        element: (
          <Suspense fallback={LinesHold}>
            <Rights />
          </Suspense>
        ),
      },
      {
        // THE PILLAR (S3): the exact phrase IS the slug (D6).
        path: '/behavior-information-modeling',
        element: (
          <Suspense fallback={LinesHold}>
            <Pillar />
          </Suspense>
        ),
      },
      { path: '/sheets/:sheetId', element: <SheetRoute /> },
      {
        path: '/thoughts/:id',
        element: (
          <Suspense fallback={LinesHold}>
            <ThoughtRoute />
          </Suspense>
        ),
      },
      ...(Lab
        ? [
            {
              path: '/lab',
              element: (
                <Suspense fallback={LinesHold}>
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
