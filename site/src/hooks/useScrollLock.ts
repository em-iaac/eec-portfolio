// A MODAL SURFACE FREEZES THE PAGE BEHIND IT.
// The design-system rule, Emilie 2026-08-04 (the phone pass part three):
// "of course the background should be frozen".
//
// HER REPORT: "scrolling inside an open project sometimes scrolls the /work
// page behind it". Part two believed this fixed with `overscroll-contain` on
// the sheet's own scroller. It was not, and the reason is that part two's OWN
// change created the problem: unfreezing the phone frame (so the URL bar could
// collapse) turned the document into a real scroller. Measured at 390px with a
// project open, the page behind is 2188px from /work and 3443px from /cv. Before
// that change it was exactly 844px and there was nothing to chain into.
//
// WHY `overscroll-contain` WAS NEVER GOING TO BE ENOUGH. It guards a scroller's
// own boundaries, which leaves three holes:
//   · A touch that starts on the dialog AROUND the scroller — the close button,
//     the padding — never enters the contained element at all. The dialog is
//     `overflow: hidden` with `overscroll-behavior: auto`, so it hands the
//     gesture straight up to the document.
//   · A project short enough not to overflow makes the property inert: an
//     element that cannot scroll does not contain anything.
//   · Chrome blocks background scroll for a modal <dialog>; iOS SAFARI DOES
//     NOT. That is why this survived every local test, and it is the same shape
//     of device-only difference as the dark-flash bug of 2026-08-03.
//
// So the fix removes the scroll rather than trying to contain it.
//
// WHY `position: fixed` ON THE BODY and not `overflow: hidden`. `overflow:
// hidden` on html/body is the tidier form and iOS honours it inconsistently;
// pinning the body is the form that has always worked there. The cost is that
// it loses the scroll position, so this records it and puts it back, exactly,
// on release.
//
// THE REF COUNT IS LOAD-BEARING. The lightbox opens as a second <dialog>
// stacked over the sheet, so two locks are live at once. Without counting, the
// lightbox closing would release the sheet's lock and the page behind would
// start scrolling again while the sheet is still open. With it, the first lock
// pins and the last release restores.
//
// It is a no-op on desktop by construction: the frame is `h-dvh` +
// `overflow-hidden` from lg up, so the document has never scrolled there and
// pinning a body that is already at 0 changes nothing.
import { useEffect } from 'react'

let locks = 0
let savedY = 0
let savedStyles: { position: string; top: string; left: string; right: string; width: string; overflowY: string } | null =
  null

function lock() {
  if (locks++ > 0) return
  const body = document.body
  savedY = window.scrollY
  savedStyles = {
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    overflowY: body.style.overflowY,
  }
  body.style.position = 'fixed'
  body.style.top = `-${savedY}px`
  body.style.left = '0'
  body.style.right = '0'
  body.style.width = '100%'
  // Belt and braces: a pinned body still reports its full height to some
  // engines, which can leave a phantom scrollbar on desktop.
  body.style.overflowY = 'hidden'
}

function unlock() {
  if (locks === 0) return
  if (--locks > 0) return
  const body = document.body
  if (savedStyles) {
    body.style.position = savedStyles.position
    body.style.top = savedStyles.top
    body.style.left = savedStyles.left
    body.style.right = savedStyles.right
    body.style.width = savedStyles.width
    body.style.overflowY = savedStyles.overflowY
    savedStyles = null
  }
  // SYNCHRONOUSLY, in the same frame the pin comes off. A restore deferred to
  // an effect or a rAF is a visible jump to the top and back.
  window.scrollTo(0, savedY)
}

/**
 * Freeze the page behind a modal surface for as long as this component is
 * mounted. Safe to nest: the sheet and the lightbox stacked over it hold one
 * lock each, and only the last release restores the page.
 */
export default function useScrollLock(active = true): void {
  useEffect(() => {
    if (!active) return
    lock()
    return unlock
  }, [active])
}
