// THE PHONE DOES NOT USE VIEW TRANSITIONS (2026-08-03, and this is the end of a
// long hunt).
//
// HOW WE GOT HERE, because the conclusion is only worth anything with the
// evidence attached. Emilie reported a dark flash on every door press, on her
// iPhone only. Five causes were proposed and all five were wrong. What settled
// it was a ladder of switches she stepped through on the device:
//
//   ?vt=off    no transition at all ............................ CLEAN
//   ?probe=1   the transition stripped to nothing: the browser's
//              own animation, NOTHING named but the page, none of
//              our CSS ......................................... STILL DARK
//
// Rung 1 is the floor. There is no rule left to write: a bare view transition,
// on that engine, with this layout, darkens. Every CSS fix before it was aimed
// at a layer that was never the cause.
//
// So the API is simply not used below lg. What replaces it is what she said the
// good version looked like — "the transition is just the pages content changing
// and coming up" — done with one CSS animation on #main (see `page-in` in
// language.css). `main` remounts on every navigation (measured), so the
// animation fires by itself with nothing to orchestrate and nothing to capture.
//
// DESKTOP IS UNTOUCHED. It has never shown this, the frozen frame with its named
// chrome is what the whole motion vocabulary stands on (DL amendment 23), and
// she signed it.
//
// The check is per-navigation, not per-boot, so a rotation or a resized window
// gets the right answer rather than whichever one happened to be true at load.

const PHONE = '(max-width: 1023px)'

let installed = false

/** Suppress view transitions below lg; leave them exactly as they are above. */
export function installPhonePageMotion(): void {
  if (installed || typeof document === 'undefined') return
  installed = true

  const doc = document as Document & {
    startViewTransition?: (cb: () => void | Promise<void>) => unknown
  }
  const original = doc.startViewTransition
  if (!original) return
  const call = original.bind(doc)

  doc.startViewTransition = ((cb: () => void | Promise<void>) => {
    if (!window.matchMedia(PHONE).matches) return call(cb)
    // The same shape a caller gets from a browser without the feature, which is
    // the path react-router already degrades to cleanly (lib/viewTransition.ts).
    // The update runs immediately: no snapshots, nothing to composite, nothing
    // to show through.
    const done = Promise.resolve()
      .then(cb)
      .then(() => undefined)
    return {
      ready: done,
      finished: done,
      updateCallbackDone: done,
      skipTransition: () => {},
    }
  }) as typeof doc.startViewTransition
}
