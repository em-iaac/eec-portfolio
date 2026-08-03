// ROUTE WARMING · why the site used to CUT (2026-07-26, Emilie's report:
// "when I'm in the landing and press work it cuts to work").
//
// Every page is React.lazy behind <Suspense fallback={<MylarScreen />}>, and
// MylarScreen is an EMPTY ground-coloured div. So a cold navigation ran:
//
//   click -> DOM swaps to the blank hold -> the 250ms crossfade spends itself
//   fading the old page into an empty rectangle -> the chunk finally lands and
//   the real page POPS IN with no transition at all.
//
// The crossfade was never broken. It was animating the wrong thing. Measured
// on a fresh landing: zero /work modules were loaded until the click, then
// nine arrived at once.
//
// The fix is not to change the transition, it is to make sure the chunk is
// already there when the transition starts, so the new snapshot is the real
// page. Two passes, both after first paint so neither can touch LCP:
//   - warmDoors(): on idle, the four doors every visitor uses.
//   - the delegated pointer/focus listener in App: anything else, on intent.
// Marks in the two SVG fields are not <a> elements, so they call preloadPath
// from their own activate handlers.
//
// Failures are swallowed on purpose: a warm that does not arrive must never
// break the navigation that follows it, which loads the same chunk anyway.
//
// NOT DURING THE PRERENDER (2026-08-03, measured in dist/). Vite's
// __vite__mapDeps helper injects a <link rel="modulepreload"> into the LIVE DOM
// for every chunk an import() pulls, and scripts/prerender.mjs snapshots
// document.documentElement.outerHTML. So a warm that happens on idle, in a
// browser, after `load` was being FROZEN into the static HTML as a
// render-blocking-priority download at first paint: the exact opposite of the
// guarantee this file's own comment (below) makes. Measured before the gate:
// index / work / cv / contact / rights / 404 / the pillar each carried 10
// injected preloads = 100.7KB raw of JavaScript the visitor may never need, of
// which 60KB was work-*.js, all 21 project spines, on /cv and /rights too.
// Every /thoughts note carried 144.3KB.
//
// The routes' OWN chunks still preload, because those imports happen inside the
// render the snapshot is of, and preloading the page you are on is correct.
import { PRERENDERING } from './prerender'
import { PILLAR_PATH } from './pillar'

type Loader = () => Promise<unknown>

// One loader per lazy chunk. The specifiers must be STATIC so Vite can see
// them and emit the same chunk the route element imports; a computed import()
// would build a second copy and warm nothing.
const WORK: Loader = () => import('../pages/Work')
const THOUGHTS: Loader = () => import('../pages/Thoughts')
const THOUGHT_LEAF: Loader = () => import('../pages/ThoughtRoute')
const CONTACT: Loader = () => import('../pages/Contact')
const CV: Loader = () => import('../pages/CV')
const PILLAR: Loader = () => import('../pages/Pillar')

/** The chunk a public path will need, or null for routes with none. */
function loaderFor(path: string): Loader | null {
  const p = path.replace(/[?#].*$/, '').replace(/\/+$/, '') || '/'
  if (p === PILLAR_PATH) return PILLAR
  if (p === '/work' || p.startsWith('/work/')) return WORK
  if (p === '/thoughts') return THOUGHTS
  if (p.startsWith('/thoughts/')) return THOUGHT_LEAF
  // Both addresses warm the same chunk: /about only redirects, but a visitor
  // hovering an old shared link is heading for the same page.
  if (p === '/contact' || p === '/about') return CONTACT
  if (p === '/cv') return CV
  // '/' is in the entry bundle; /sheets/* only redirects; unknown -> 404, which
  // is not lazy. Nothing to warm.
  return null
}

const started = new Set<Loader>()

/** Warm the chunk a path will need. Safe to call on every hover: once only. */
export function preloadPath(path: string): void {
  if (PRERENDERING) return
  const load = loaderFor(path)
  if (!load || started.has(load)) return
  started.add(load)
  load().catch(() => {
    // let the real navigation retry it
    started.delete(load)
  })
}

/** After first paint, warm the four doors: the common path off the landing. */
export function warmDoors(): void {
  if (PRERENDERING) return
  const run = () => {
    ;[WORK, THOUGHTS, CONTACT, CV].forEach((load) => {
      if (started.has(load)) return
      started.add(load)
      load().catch(() => started.delete(load))
    })
  }
  // AFTER `load`, never on a bare timer. The landing's LCP is the handwritten
  // hero line and it measures ~4.8s deployed; four chunk downloads fired on a
  // fixed 2.5s timer would compete with it for bandwidth and could push the
  // one number the landing is judged on. Waiting for `load` means every
  // critical resource has already landed, so this can only ever use idle
  // capacity. The landing is recruiter-critical: warming is a convenience and
  // must never be allowed to cost it anything.
  const schedule = () => {
    // BOTH schedulers, not one or the other: requestIdleCallback is the polite
    // path, but it is tied to the rendering loop and never fires in a
    // backgrounded tab, which is exactly where a visitor who opened the site
    // in a second tab lives. `run` is idempotent, so whichever wins, the work
    // happens once.
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void })
      .requestIdleCallback
    ric?.(run, { timeout: 2000 })
    window.setTimeout(run, 2000)
  }
  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })
}
