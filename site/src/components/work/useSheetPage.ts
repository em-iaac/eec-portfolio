// SWIPE THE SHEET SIDEWAYS TO PAGE PROJECTS (Emilie's ask, 2026-08-21: "for
// the work drawer on the phone we have the extra previous and next, remove
// them and instead have a swipe left or right mechanic").
//
// On a phone the drawer's ‹ PREVIOUS / NEXT › rows are gone (WorkOverlay hides
// them below sm) and the whole sheet answers the gesture instead: drag left
// for the next project, right for the previous — the same film-moves-under-
// the-finger direction the gallery's picture flip already taught one box up.
//
// IT IS NOT A NEW GESTURE. The numbers are the belts' family (useBeltDrift →
// useSheetSwipe → useSwipeFlip): the same 4px tap-vs-drag slop, the same
// velocity-from-the-last-move reading, the same "a finger that stopped before
// lifting is not a throw". The decision distance sits between the picture
// flip's 48 and the sheet close's 96: paging a whole project is a bigger
// decision than flipping a photo and a smaller one than leaving.
//
// WHAT THE GESTURE MUST NOT STEAL, checked at the press:
//   - the media stage: a sideways drag there flips PICTURES (useSwipeFlip),
//     and one gesture must never mean two things at once
//   - the stacked Lightbox (its own <dialog>; a swipe over a zoomed picture
//     belongs to the picture)
//   - buttons, links and media controls — a press there is a press
//   - and the vertical axis entirely: the sheet scrolls, so the gesture only
//     claims a move that is clearly sideways (dominant axis, checked once at
//     the slop boundary) and lets everything else fall through to the scroll.
//
// TOUCH ONLY, below the rails' 1200px floor, tested at the moment of the
// press (rotation cannot go stale) and never for a mouse: from 1200 up the
// rails carry prev/next, and dragging a document sideways with a cursor is
// not a thing this site does.
import { useEffect, type RefObject } from 'react'

// Widened from the phone (40rem) on her second ask, 2026-08-21: the drawer's
// PREVIOUS/NEXT rows are gone for good ("the thoughts drawer is just for
// thoughts now"), so the gesture now covers the whole rail-less band — the
// same 1200 floor the rails' `min-[1200px]:flex` stands on. A mouse in that
// band pages from the grid; the gesture stays touch's.
const RAILLESS = '(max-width: 1199.98px)'
const DRAG_SLOP_PX = 4 // the belts'
const PAGE_PX = 64
const PAGE_VELOCITY = 0.45 // px per ms
// THE TURN IS DRAWN (her ask 2026-08-21: "the swipe should have an animation
// on the phone"). Same vocabulary as the sheet-close swipe one hook over: the
// sheet sticks to the finger while the gesture lives, springs home on a
// gesture that dies (220ms, the close swipe's own number and curve), and on a
// committed page it carries through — out the side the finger was going,
// content swaps behind the edge, in from the other side. Reduced motion cuts,
// as everything here does.
const SPRING_MS = 220
const SLIDE_MS = 200
const EASE = 'cubic-bezier(0.2, 0.8, 0.3, 1)'

export default function useSheetPage(
  dialogRef: RefObject<HTMLDialogElement | null>,
  excludeRef: RefObject<HTMLElement | null>,
  // A ref, not callbacks, so paging projects (which re-renders the un-keyed
  // sheet) never re-binds the listeners mid-gesture — the same staleness
  // answer WorkOverlay's onCloseRef already gives the cancel listener.
  pagerRef: RefObject<{ prev: () => void; next: () => void } | null>,
): void {
  useEffect(() => {
    const dlg = dialogRef.current
    if (!dlg) return

    let dragging = false
    let claimed = false
    let startX = 0
    let startY = 0
    let lastX = 0
    let lastT = 0
    let velocity = 0
    let disposed = false

    const write = (x: number) => {
      dlg.style.transform = x ? `translateX(${x}px)` : ''
    }
    const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const settleBack = () => {
      if (reduce()) {
        write(0)
        return
      }
      dlg.style.transition = `transform ${SPRING_MS}ms ${EASE}`
      write(0)
      window.setTimeout(() => {
        if (!disposed) dlg.style.transition = ''
      }, SPRING_MS)
    }
    // The committed turn: finish the slide the finger began, swap the project
    // behind the edge, and let the new one ride in from the other side. The
    // dialog is un-keyed, so go() swaps content in place — the backdrop and
    // the veil never blink, only the plate travels.
    const turn = (d: number, go: () => void) => {
      if (reduce()) {
        write(0)
        go()
        return
      }
      const out = (d < 0 ? -1 : 1) * window.innerWidth
      dlg.style.transition = `transform ${SLIDE_MS}ms ease-in`
      write(out)
      window.setTimeout(() => {
        if (disposed) return
        go()
        dlg.style.transition = 'none'
        write(-out)
        // the reflow is the seam: without it the two writes coalesce and the
        // sheet teleports instead of entering
        void dlg.offsetHeight
        dlg.style.transition = `transform ${SPRING_MS}ms ${EASE}`
        write(0)
        window.setTimeout(() => {
          if (!disposed) dlg.style.transition = ''
        }, SPRING_MS)
      }, SLIDE_MS)
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      if (e.pointerType === 'mouse') return
      if (!pagerRef.current) return
      if (!window.matchMedia(RAILLESS).matches) return
      const t = e.target as Element
      // A press inside a stacked dialog (the Lightbox) is never this sheet's.
      if (t.closest('dialog') !== dlg) return
      if (t.closest('button, a, video, audio, input, textarea, select')) return
      if (excludeRef.current?.contains(t)) return
      dragging = true
      claimed = false
      startX = lastX = e.clientX
      startY = e.clientY
      lastT = e.timeStamp
      velocity = 0
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      if (!claimed) {
        if (Math.abs(dy) > DRAG_SLOP_PX && Math.abs(dy) >= Math.abs(dx)) {
          // The move is a scroll. Decided once, at the slop boundary, so a
          // scroll that wanders sideways later can never turn into a page.
          dragging = false
          return
        }
        if (Math.abs(dx) > DRAG_SLOP_PX) claimed = true
      }
      if (claimed) {
        try {
          dlg.setPointerCapture(e.pointerId)
        } catch {
          /* a pointer the browser already released cannot be captured */
        }
      }
      const dt = e.timeStamp - lastT
      if (dt > 0) velocity = (e.clientX - lastX) / dt
      lastX = e.clientX
      lastT = e.timeStamp
      // the sheet sticks to the finger, the belts' rule made visible
      if (claimed && !reduce()) write(dx)
    }

    // ⚠ THE ONLY THING THAT KEEPS THE GESTURE ALIVE OVER TEXT. touch-action:
    // pan-y (index.css) hands sideways moves to the page — but the story is
    // selectable serif, and Chrome claims a horizontal drag over TEXT for
    // selection, then kills the pointer stream: measured, pointercancel at
    // (0,0) after 23px, on the first move. preventDefault on POINTER events
    // cannot stop a native action (that is touch-action's job, and it has no
    // word for selection) — only the TOUCH event's preventDefault does. So
    // once the gesture is claimed, the raw touchmove is cancelled and the
    // pointer stream survives. Passive must be false or the call is ignored.
    // The gallery never met this because its surface is an image, not words.
    const onTouchMove = (e: TouchEvent) => {
      if (dragging && claimed && e.cancelable) e.preventDefault()
    }

    // A cancel is the browser taking the gesture back, not a release — it
    // carries zeroed coordinates, so deciding on it pages on garbage. The
    // sheet springs home from wherever the finger left it.
    const onPointerCancel = () => {
      const was = claimed
      dragging = false
      claimed = false
      if (was) settleBack()
    }

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      if (!claimed) return
      claimed = false
      // The belts' rule: a finger that came to rest before lifting is not a
      // throw, whatever it was doing 200ms ago.
      if (e.timeStamp - lastT > 90) velocity = 0
      const d = e.clientX - startX
      const pager = pagerRef.current
      if (pager && (Math.abs(d) > PAGE_PX || Math.abs(velocity) > PAGE_VELOCITY)) {
        turn(d, d < 0 ? pager.next : pager.prev)
      } else {
        settleBack()
      }
    }

    dlg.addEventListener('pointerdown', onPointerDown)
    dlg.addEventListener('pointermove', onPointerMove)
    dlg.addEventListener('touchmove', onTouchMove, { passive: false })
    dlg.addEventListener('pointerup', endDrag)
    dlg.addEventListener('pointercancel', onPointerCancel)
    return () => {
      disposed = true
      dlg.style.transform = ''
      dlg.style.transition = ''
      dlg.removeEventListener('pointerdown', onPointerDown)
      dlg.removeEventListener('pointermove', onPointerMove)
      dlg.removeEventListener('touchmove', onTouchMove)
      dlg.removeEventListener('pointerup', endDrag)
      dlg.removeEventListener('pointercancel', onPointerCancel)
    }
  }, [dialogRef, excludeRef, pagerRef])
}
