// SWIPE THE SHEET DOWN TO CLOSE IT (Emilie's ruling 2026-08-03).
//
// THE MEASUREMENT. On a phone the showcase is a bottom-docked sheet at 90dvh,
// and its only exit was a 44px ✕ at y=95: 749px from a thumb resting at the
// bottom of an 844px screen. A bottom sheet is the one shape that universally
// promises a downward swipe, and this one did not have it. Nothing else on the
// site swiped either.
//
// IT IS NOT A NEW GESTURE, and that is the point. Every number here is the
// belts' (landing/useBeltDrift.ts), so a visitor who has dragged a belt on the
// landing already knows this:
//   - the same 4px tap-vs-drag slop, so a press on the handle is still a press
//   - the same velocity-from-the-last-move reading
//   - the same "if the finger stopped before it lifted, there is no throw"
//
// PHONE ONLY, tested at the moment of the press rather than on mount, so a
// rotation cannot leave a stale answer behind. On a desktop the sheet is a
// centred plate, not a docked one, and dragging it down would be nonsense.
//
// THE ✕ STAYS. A gesture with no visible control is a gesture only some people
// have; the handle announces it, the ✕ serves everyone else, and the keyboard
// still has Escape.
import { useEffect, type RefObject } from 'react'

const PHONE = '(max-width: 40rem)'
const DRAG_SLOP_PX = 4 // the belts'
const CLOSE_PX = 96 // about an eighth of the screen: a decision, not a twitch
const CLOSE_VELOCITY = 0.5 // px per ms downward: a flick, however short
const SPRING_MS = 220

export default function useSheetSwipe(
  dialogRef: RefObject<HTMLDialogElement | null>,
  handleRef: RefObject<HTMLElement | null>,
  onClose: () => void,
): void {
  useEffect(() => {
    const dlg = dialogRef.current
    const handle = handleRef.current
    if (!dlg || !handle) return

    let dragging = false
    let startY = 0
    let lastY = 0
    let lastT = 0
    let dy = 0
    let velocity = 0

    const write = (y: number) => {
      dlg.style.transform = y > 0 ? `translateY(${y}px)` : ''
    }

    const settleBack = () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        write(0)
        return
      }
      dlg.style.transition = `transform ${SPRING_MS}ms cubic-bezier(0.2, 0.8, 0.3, 1)`
      write(0)
      window.setTimeout(() => {
        dlg.style.transition = ''
      }, SPRING_MS)
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      if (!window.matchMedia(PHONE).matches) return
      // The ✕ lives in the same band. A press on it is a press, not a drag.
      if ((e.target as Element).closest('button')) return
      dragging = true
      dy = 0
      velocity = 0
      startY = lastY = e.clientY
      lastT = e.timeStamp
      dlg.style.transition = ''
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const d = e.clientY - startY
      // DOWNWARD ONLY. Dragging a docked sheet upward would either lift it off
      // its dock or fight the body's own scroll; neither is a thing to promise.
      dy = Math.max(0, d)
      if (dy > DRAG_SLOP_PX) {
        handle.setPointerCapture?.(e.pointerId)
        e.preventDefault()
      }
      const dt = e.timeStamp - lastT
      if (dt > 0) velocity = (e.clientY - lastY) / dt
      lastY = e.clientY
      lastT = e.timeStamp
      write(dy)
    }

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      // The belts' rule: a finger that came to rest before lifting is not a
      // throw, whatever it was doing 200ms ago.
      if (e.timeStamp - lastT > 90) velocity = 0
      if (dy <= DRAG_SLOP_PX) {
        write(0)
        return
      }
      if (dy > CLOSE_PX || velocity > CLOSE_VELOCITY) {
        // The transform STAYS. react-router captures the outgoing snapshot when
        // the navigation starts, which is after this line, so the sheet morphs
        // back to its card from where the finger left it rather than snapping
        // home first and then travelling (DL amendment 23's whole argument).
        onClose()
        return
      }
      settleBack()
    }

    handle.addEventListener('pointerdown', onPointerDown)
    handle.addEventListener('pointermove', onPointerMove)
    handle.addEventListener('pointerup', endDrag)
    handle.addEventListener('pointercancel', endDrag)
    return () => {
      handle.removeEventListener('pointerdown', onPointerDown)
      handle.removeEventListener('pointermove', onPointerMove)
      handle.removeEventListener('pointerup', endDrag)
      handle.removeEventListener('pointercancel', endDrag)
      dlg.style.transform = ''
      dlg.style.transition = ''
    }
  }, [dialogRef, handleRef, onClose])
}
