// NAME THE MORPH SOURCE JUST IN TIME (2026-08-03).
//
// HER REPORT, twice: the doors "still lag when i slide between each other. and
// it takes time, to load and its weird", with screenshots showing the outgoing
// page sitting on top of the incoming one as solid pieces, and the pill's word
// doubled.
//
// MEASURED, on a real transition from /work to /thoughts:
//
//     54 animations across 44 view-transition groups
//        3 paired ...... root, chrome-pill, chrome-lens   <- the intended morphs
//       40 OLD-ONLY .... every project card, every thought title
//        1 new-only
//
// A `view-transition-name` is not decoration. It LIFTS that element out of the
// root snapshot onto its own layer, and the browser then animates it as its own
// group on its own timeline. That is exactly what makes the frozen frame read
// as frozen, and it is exactly what goes wrong when 40 elements are named that
// can never pair with anything: they stop fading with the page and instead
// paint above it, out of step, for the whole transition. The landing is the
// same shape (41 named elements, one per belt tile).
//
// Cost measured locally, same trivial transition, 5 samples, median time to
// `ready`: 20ms with the names live, 4ms with only the chrome named. Five times
// the snapshot work, for 40 layers that had nothing to travel to.
//
// THE FIX is not to remove the morph. It is to keep the promise the convention
// already makes (viewTransition.ts: "a SOURCE that opens that route puts the
// same name on its face") but to make it true only at the instant it is true.
// A source now DECLARES itself with `data-morph`, which is an ordinary
// attribute and costs nothing, and exactly one of them is promoted to a real
// name when a navigation to that route begins. The old snapshot is captured
// after the click, so arming in a capture-phase handler is early enough; this
// is the same timing the nav intent already relies on.
//
// MindGraphView and NeuralWorld are untouched: they already name only their
// ACTIVE node, which was right all along, and they carry no `data-morph`, so
// arming simply finds nothing there.
import { vtName } from './viewTransition'

let armed: HTMLElement | null = null
let installed = false

/** Take the name back off whatever is wearing it. */
export function disarmMorph(): void {
  if (!armed) return
  armed.style.viewTransitionName = ''
  armed = null
}

/**
 * Put the morph name on the ONE source about to travel to `path`.
 * Safe to call for any path: routes with no hero return no name, and a page
 * with no matching source simply gets the plain crossfade.
 */
export function armMorph(path: string): void {
  disarmMorph()
  if (typeof document === 'undefined') return
  const name = vtName(path.replace(/[?#].*$/, ''))
  if (!name) return
  let el: HTMLElement | null = null
  try {
    el = document.querySelector<HTMLElement>(`[data-morph="${CSS.escape(name)}"]`)
  } catch {
    return
  }
  if (!el) return
  el.style.viewTransitionName = name
  armed = el
}

/**
 * Disarm once the transition is over, so the source is not still wearing the
 * name when the destination mounts holding it too. That pairing would be a
 * DUPLICATE, and a duplicate makes the browser skip the whole transition —
 * a hard cut, which is worse than no morph at all (viewTransition.ts's hard
 * rule). It matters on exactly one path: opening a project from /work, where
 * ShowcaseRoute keeps the grid mounted underneath the sheet.
 */
export function installMorphNaming(): void {
  if (installed || typeof document === 'undefined') return
  installed = true
  const doc = document as Document & {
    startViewTransition?: (cb: () => void | Promise<void>) => { finished: Promise<void> }
  }
  if (!doc.startViewTransition) return
  const original = doc.startViewTransition.bind(doc)
  doc.startViewTransition = ((cb: () => void | Promise<void>) => {
    const vt = original(cb)
    vt.finished.then(disarmMorph, disarmMorph)
    return vt
  }) as typeof doc.startViewTransition
}
