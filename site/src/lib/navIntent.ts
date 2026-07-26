// THE MOTION VOCABULARY (2026-07-26, Emilie: "find a real way to tie all of
// this website together once and for all").
//
// The site is a FROZEN FRAME. The header pill, its tools, the frame edges and
// the footer are pixel-identical on every interior page; only the content band
// differs. The old transition (a 250ms opacity crossfade of the whole root) was
// therefore spending itself fading identical pixels into themselves, with no
// transform and no timing offset. That is the weakest transition there is: two
// equal opposing fades read as a flicker, not a movement. It was also the
// expensive one, because `root` means rasterising the entire viewport twice.
//
// The fix is NOT a bigger effect. It is naming the chrome (language.css), which
// lifts it out of the root snapshot so the frame simply STAYS while the content
// changes underneath it. That is what stops the site feeling like pages.
//
// A DIRECTIONAL SLIDE WAS BUILT AND DROPPED (Emilie, same day). The content slid
// on the door axis, in the direction the magnifier travels. It was coherent, and
// it was still wrong: 24px over 300ms sits in the dead zone where the eye reads
// "something shifted" instead of "I travelled", which is what read as a glitch.
// Committing harder would only have made it more of a phone-app push, a grammar
// this drawing-led site does not speak. The magnifier already carries direction
// quietly and in her own language; the page saying it too was redundant.
// Do not re-propose it. What survives is one small lift, and one exception:
//
//   stay   a change WITHIN a room (the /work card opening over its own gallery).
//          The content must NOT move at all, or the gallery slides out from
//          under the card you just opened. Opacity only; the shared-element
//          morph carries the meaning.
//   (default)  everything else: a short fall out, a slower lift in.
//
// The intent is written to <html data-vt> BEFORE navigation, because the browser
// captures the old snapshot the instant startViewTransition runs and anything
// set after that point is too late.

/** The room a path belongs to, so an in-room change can be told from a move. */
function roomOf(path: string): string {
  const p = path.replace(/[?#].*$/, '').replace(/\/+$/, '') || '/'
  if (p === '/') return '/'
  return '/' + (p.split('/')[1] ?? '')
}

/** Set the intent for the navigation about to happen. Call BEFORE navigate. */
export function setNavIntent(to: string, from: string): void {
  if (typeof document === 'undefined') return
  const el = document.documentElement
  if (roomOf(to) === roomOf(from)) el.dataset.vt = 'stay'
  else delete el.dataset.vt
}

/** Set the intent for a PROGRAMMATIC navigation and hand back the target, so a
 *  call site reads `navigate(travelTo('/work/sensi'), { viewTransition: true })`
 *  and cannot forget it. Real <a> clicks are already covered by the
 *  capture-phase listener in App. */
export function travelTo(to: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const here = window.location.pathname
  setNavIntent(to, (base && here.startsWith(base) ? here.slice(base.length) : here) || '/')
  return to
}
