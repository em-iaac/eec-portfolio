// SWIPE BETWEEN THE PICTURES (the phone pass, 2026-08-03).
//
// The plate's gallery had exactly one way to advance: two 44px `‹ ›` buttons
// pinned to the left and right edges of the mat. On a phone that is a picture
// you can see, framed by the one gesture everyone tries on a picture, doing
// nothing. The arrows stay and remain the only keyboard-reachable control; this
// makes the obvious gesture work as well.
//
// SAME NUMBERS AS THE SHEET AND THE BELTS, so this is one vocabulary and not a
// third: the belts' 4px slop decides drag from tap, and a short fast flick
// counts the same as a long slow drag.
//
// The picture is also a BUTTON that opens the lightbox (her ruling: "arrows
// flip, tap zooms"), so the slop is what keeps a zoom-tap from becoming a flip:
// under 4px the click runs untouched, over it the click is suppressed in the
// capture phase, exactly as useBeltDrift does.
import { useEffect, type RefObject } from 'react'

const DRAG_SLOP_PX = 4
const FLIP_PX = 48
const FLIP_VELOCITY = 0.4 // px per ms

export default function useSwipeFlip(
  stageRef: RefObject<HTMLElement | null>,
  onPrev: () => void,
  onNext: () => void,
  enabled: boolean,
): void {
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !enabled) return

    let dragging = false
    let startX = 0
    let lastX = 0
    let lastT = 0
    let moved = 0
    let velocity = 0

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      // A mouse has the arrows and the wheel; dragging a photograph sideways
      // with a cursor is not a thing this site does.
      if (e.pointerType === 'mouse') return
      dragging = true
      moved = 0
      velocity = 0
      startX = lastX = e.clientX
      lastT = e.timeStamp
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const d = e.clientX - startX
      moved = Math.abs(d)
      if (moved > DRAG_SLOP_PX) {
        stage.setPointerCapture?.(e.pointerId)
        e.preventDefault()
      }
      const dt = e.timeStamp - lastT
      if (dt > 0) velocity = (e.clientX - lastX) / dt
      lastX = e.clientX
      lastT = e.timeStamp
    }

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      if (e.timeStamp - lastT > 90) velocity = 0
      if (moved <= DRAG_SLOP_PX) return
      const d = e.clientX - startX
      if (Math.abs(d) > FLIP_PX || Math.abs(velocity) > FLIP_VELOCITY) {
        // Drag LEFT to see the next picture: the film moves under the finger,
        // which is what every gallery on the device this is being read on does.
        if (d < 0) onNext()
        else onPrev()
      }
    }

    // The zoom-tap lives on a <button> inside this box. A drag must not also
    // open the lightbox, and only the capture phase is early enough to say so.
    const onClickCapture = (e: MouseEvent) => {
      if (moved > DRAG_SLOP_PX) {
        e.preventDefault()
        e.stopPropagation()
        moved = 0
      }
    }

    // A cancel is the browser taking the gesture back, and it arrives with
    // zeroed coordinates — deciding on it computes d = −startX, which reads
    // as a hard left flip (found 2026-08-21 chasing the same bug in
    // useSheetPage). A cancel decides nothing.
    const onPointerCancel = () => {
      dragging = false
    }
    stage.addEventListener('pointerdown', onPointerDown)
    stage.addEventListener('pointermove', onPointerMove)
    stage.addEventListener('pointerup', endDrag)
    stage.addEventListener('pointercancel', onPointerCancel)
    stage.addEventListener('click', onClickCapture, true)
    return () => {
      stage.removeEventListener('pointerdown', onPointerDown)
      stage.removeEventListener('pointermove', onPointerMove)
      stage.removeEventListener('pointerup', endDrag)
      stage.removeEventListener('pointercancel', onPointerCancel)
      stage.removeEventListener('click', onClickCapture, true)
    }
  }, [stageRef, onPrev, onNext, enabled])
}
