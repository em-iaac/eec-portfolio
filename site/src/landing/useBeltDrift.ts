// THE BELT ENGINE (Emilie, 2026-08-02: the phone belts "should move just like
// the desktop landing page but instead horizontally... and I actually would
// want to add the swipe to the desktop through the cursor").
//
// ONE MECHANISM, BOTH AXES: a clipped box, a doubled track, and a fractional
// translate driven here. Nothing about the two belts differs except direction.
//
// IT WAS BUILT TWICE, and the first version is worth recording because the bug
// is not obvious. The phone row was a NATIVE SCROLLER, on the reasoning that a
// scroller gives touch momentum and snapping for free. It does, and it was
// still wrong on both counts Emilie reported the same evening:
//
//   "the belts animation is so laggy, it's like you can see it pixel by pixel
//    moving, it's not smooth like on the desktop"
//     -> scrollLeft is an INTEGER. At the 4px/s she set, that is one whole
//        pixel every 250 milliseconds, so the row visibly ticks. The desktop
//        column never did, because a transform takes fractions. There is no
//        setting that fixes this; the position model was the bug.
//
//   "when i swipe it stops the animation instead of continuing from where i
//    stopped like on the desktop version"
//     -> native momentum fires scroll events for as long as it coasts, each
//        one pushing the resume timer further out, so the belt sat dead for
//        well over a second and then resumed at a pixel every quarter second,
//        which reads as not resuming at all.
//
// So the row is now clipped and translated, exactly like the column, and the
// thumb is handled here: drag, then a velocity-decay glide, then the drift
// picks up FROM WHERE IT WAS LEFT. `touch-action: pan-y` on the box (CSS) is
// what keeps the page scrolling vertically while this owns the horizontal
// gesture.
//
// A NATIVE SCROLLER WOULD ALSO HAVE TRAPPED THE DESKTOP WHEEL, for a separate
// reason worth keeping: a scroller only hands the wheel back to the page at its
// own end, and a belt that loops has no end, so a cursor resting over the belts
// (half the first screen) would have stopped the page scrolling. Clipped, the
// wheel was never the belt's to take.
//
// WHAT DID NOT CHANGE. The doubled track, the per-tile margin, ~4px per second,
// and every one of Emilie's stop conditions, which now includes two the old CSS
// keyframe could not express: a hand on the belt, and the belt being off screen
// or the tab hidden, which the animation ran straight through.
//
// WCAG 2.2.2: hover for a pointer, focus-within for a keyboard, the explicit
// pause button for everyone including touch, and the drag itself.
import { useEffect, useRef } from 'react'

const PX_PER_SECOND = 4
// After a hand lets go, the belt glides, then waits this long before drifting
// again. Short, because "it continues from where I stopped" is the whole point;
// long enough that the drift does not appear to fight the last of the glide.
const RESUME_AFTER_MS = 400
// Movement under this is a tap, not a drag, so the link underneath still opens.
const DRAG_SLOP_PX = 4
// Per 16ms frame. 0.94 gives a glide of roughly half a second from a firm
// flick: enough to feel thrown, not so much that the belt runs away.
const GLIDE_FRICTION = 0.94
const GLIDE_STOP_PX_PER_MS = 0.02

export default function useBeltDrift({
  ref,
  trackRef,
  axis,
  paused = false,
  reverse = false,
}: {
  /** the clipping box */
  ref: React.RefObject<HTMLElement | null>
  /** the element that gets translated */
  trackRef: React.RefObject<HTMLElement | null>
  axis: 'x' | 'y'
  /** the explicit pause control, and anything else that should hold it still */
  paused?: boolean
  /** the second belt runs the other way, so the field reads as alive rather
   *  than as one belt cut in half (her 2026-07-27 note, preserved) */
  reverse?: boolean
}) {
  // Everything the frame loop reads lives in a ref: the loop is started once
  // and must never be rebuilt on a prop change, or the belt stutters each time
  // pause flips.
  const pausedRef = useRef(paused)
  pausedRef.current = paused
  const reverseRef = useRef(reverse)
  reverseRef.current = reverse

  useEffect(() => {
    const el = ref.current
    const track = trackRef.current
    if (!el || !track) return

    const horizontal = axis === 'x'
    const prm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const now = () => performance.now()

    let raf = 0
    let last = 0
    let offset = 0
    let userUntil = 0
    let hovering = false
    let dragging = false
    let onScreen = true
    // px per ms, carried out of a drag into the glide
    let velocity = 0

    // Half the doubled track: wrapping by exactly this lands on an identical
    // tile, which is what makes the loop invisible. Guard against zero (before
    // layout) or the wrap would pin the belt at its start forever.
    const half = () => (horizontal ? track.scrollWidth : track.scrollHeight) / 2
    const wrap = (v: number) => {
      const h = half()
      if (h < 1) return v
      if (v >= h) return v - h
      if (v < 0) return v + h
      return v
    }
    const write = (v: number) => {
      offset = v
      track.style.transform = horizontal
        ? `translate3d(${-v}px, 0, 0)`
        : `translate3d(0, ${-v}px, 0)`
    }

    const still = () =>
      pausedRef.current ||
      prm.matches ||
      hovering ||
      dragging ||
      !onScreen ||
      document.hidden ||
      now() < userUntil ||
      el.matches(':focus-within')

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame)
      const dt = last ? Math.min(t - last, 64) : 0
      last = t
      if (!dt) return

      // THE GLIDE runs even while `still()` is true: it IS the visitor's own
      // gesture finishing, not the belt's drift, so pause must not cut it off
      // mid-throw. It ends by decaying, and the drift takes over after.
      if (!dragging && velocity !== 0) {
        write(wrap(offset + velocity * dt))
        velocity *= Math.pow(GLIDE_FRICTION, dt / 16)
        if (Math.abs(velocity) < GLIDE_STOP_PX_PER_MS) {
          velocity = 0
          userUntil = now() + RESUME_AFTER_MS
        }
        return
      }
      if (still()) return
      // Fractional, every frame. This is the whole reason the belt is
      // translated rather than scrolled.
      const step = (PX_PER_SECOND * dt) / 1000
      write(wrap(offset + (reverseRef.current ? -step : step)))
    }

    const onEnter = (e: PointerEvent) => {
      // A touch "enters" on contact; only a real hovering pointer should hold
      // the belt still, or a tap would freeze it for as long as the finger
      // rested there and the drag logic below would never get its turn.
      if (e.pointerType === 'mouse') hovering = true
    }
    const onLeave = () => {
      hovering = false
    }

    // THE DRAG, for every pointer type. A mouse gets nothing from the browser
    // here (the box is clipped, not scrollable) and neither does a thumb, so
    // both are served by the same few lines. Velocity is sampled from the last
    // two moves so a flick throws the belt rather than dropping it dead.
    let startPos = 0
    let startAt = 0
    let moved = 0
    let lastPos = 0
    let lastT = 0
    const point = (e: PointerEvent) => (horizontal ? e.clientX : e.clientY)

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      dragging = true
      moved = 0
      velocity = 0
      startPos = lastPos = point(e)
      lastT = now()
      startAt = offset
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const p = point(e)
      const d = p - startPos
      moved = Math.max(moved, Math.abs(d))
      if (moved > DRAG_SLOP_PX) {
        // Capture only once the gesture is genuinely a drag, so a plain tap on
        // a tile still reaches the link underneath.
        el.setPointerCapture?.(e.pointerId)
        e.preventDefault()
      }
      const t = now()
      const dt = t - lastT
      if (dt > 0) velocity = -(p - lastPos) / dt
      lastPos = p
      lastT = t
      write(wrap(startAt - d))
    }
    const endDrag = () => {
      if (!dragging) return
      dragging = false
      // A finger that stopped before lifting should not throw the belt.
      if (now() - lastT > 90) velocity = 0
      if (velocity === 0) userUntil = now() + RESUME_AFTER_MS
    }
    // A drag that ends over a tile must not also open it.
    const onClickCapture = (e: MouseEvent) => {
      if (moved > DRAG_SLOP_PX) {
        e.preventDefault()
        e.stopPropagation()
        moved = 0
      }
    }

    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            onScreen = !!entry?.isIntersecting
          })
    io?.observe(el)

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', endDrag)
    el.addEventListener('pointercancel', endDrag)
    el.addEventListener('click', onClickCapture, true)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      io?.disconnect()
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', endDrag)
      el.removeEventListener('pointercancel', endDrag)
      el.removeEventListener('click', onClickCapture, true)
    }
  }, [ref, trackRef, axis])
}
