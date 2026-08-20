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

// 10px/s — Emilie's pick off the speed ladder, 2026-08-20 ("go for belt 10").
// She set 4 on 08-02 and judged it slow at the moving-parts audit; the ladder
// (?belt=6|8|12, stepped on her own machine) settled it at 10. At this speed
// the award tile holds the first screen ~22s.
const PX_PER_SECOND = 10

// THE LAG WAS THE SHIMMER, NOT THE ENGINE (the lag hunt, closed 2026-08-20).
// Her report was that the drift "felt a bit laggy"; the frame numbers were
// clean on every machine that could be measured, and the URL ladder she
// stepped on her own screen cleared the suspects one by one: backdrop-blur
// off felt NO smoother ("if anything a bit more obvious" — the glass stays),
// but ?snap=1 she ruled "feels better". The cause: at fractional display
// scaling (her laptop runs 2.5×) a layer translated by SUB-pixel amounts
// resamples its texture every frame, so crisp hairlines and mono text
// shimmer as they cross pixel boundaries — which the eye reads as lag, at
// any speed, with or without blur. So the painted transform now rounds to
// whole DEVICE pixels (see `paint` below), the same stepping native
// scrolling produces: at 10px/s and 2.5× that is 25 crisp steps a second.
// Two more findings from the same hunt, both kept: the belt used to sit DEAD
// after a mouse drag (Chrome focuses a link on mousedown, so :focus-within
// held it until the next click anywhere — the blur in endDrag releases it),
// and the drift speed is hers off the ladder.
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
  // The sleeping loop's restart handle (see `wake` below): prop changes land
  // through refs so the main effect is never rebuilt, which means unpausing
  // needs its own way to restart a loop that went to sleep while paused.
  const wakeRef = useRef<(() => void) | null>(null)
  useEffect(() => {
    if (!paused) wakeRef.current?.()
  }, [paused])

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
    // THE DEVICE-PIXEL SNAP (her ruling off the ladder, 2026-08-20: "snap
    // feels better" — the header comment has the whole account). The OFFSET
    // stays fractional — the arithmetic of the loop, the wrap and the glide
    // are untouched — only the PAINTED value rounds to the device grid, so
    // edges are always crisp instead of resampling every frame. dpr is read
    // once per mount; a zoom change mid-visit paints on the old grid until
    // the next mount, which is invisible (the rounding is at worst half a
    // device pixel off).
    const dpr = window.devicePixelRatio || 1
    const paint = (v: number) => Math.round(v * dpr) / dpr
    const write = (v: number) => {
      offset = v
      const p = paint(v)
      track.style.transform = horizontal
        ? `translate3d(${-p}px, 0, 0)`
        : `translate3d(0, ${-p}px, 0)`
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

    // THE LOOP SLEEPS WHEN THE BELT IS STILL (2026-08-20, the moving-parts
    // audit; Emilie's green light). The old loop re-requested rAF forever —
    // paused, hovered, off-screen, it still woke the CPU 60 times a second to
    // early-return, which keeps the page from ever going idle. Now the loop
    // EXITS when there is nothing to animate and `wake()` restarts it from
    // the same events that end a stillness: the cursor leaving, a drag
    // ending, the tab showing, the belt scrolling back on screen, focus
    // leaving, the pause lifting. `last` resets on wake so the first frame
    // after a sleep measures dt 0 instead of a clamped 64ms jump.
    let running = false
    let resumeTimer: ReturnType<typeof setTimeout> | undefined

    const frame = (t: number) => {
      const dt = last ? Math.min(t - last, 64) : 0
      last = t

      // THE GLIDE runs even while `still()` is true: it IS the visitor's own
      // gesture finishing, not the belt's drift, so pause must not cut it off
      // mid-throw. It ends by decaying, and the drift takes over after.
      if (!dragging && velocity !== 0) {
        if (dt) {
          write(wrap(offset + velocity * dt))
          velocity *= Math.pow(GLIDE_FRICTION, dt / 16)
          if (Math.abs(velocity) < GLIDE_STOP_PX_PER_MS) {
            velocity = 0
            userUntil = now() + RESUME_AFTER_MS
          }
        }
        raf = requestAnimationFrame(frame)
        return
      }
      if (still()) {
        // Sleep. The one stillness that ends by CLOCK rather than by event is
        // the post-gesture rest (`userUntil`), so that alone arms a timer.
        running = false
        const wait = userUntil - now()
        if (wait > 0) {
          clearTimeout(resumeTimer)
          resumeTimer = setTimeout(wake, wait + 16)
        }
        return
      }
      if (dt) {
        // The offset advances fractionally every frame (the whole reason the
        // belt is translated rather than scrolled); `write` snaps only what
        // is painted.
        const step = (PX_PER_SECOND * dt) / 1000
        write(wrap(offset + (reverseRef.current ? -step : step)))
      }
      raf = requestAnimationFrame(frame)
    }

    const wake = () => {
      if (running) return
      running = true
      last = 0
      raf = requestAnimationFrame(frame)
    }
    wakeRef.current = wake

    const onEnter = (e: PointerEvent) => {
      // A touch "enters" on contact; only a real hovering pointer should hold
      // the belt still, or a tap would freeze it for as long as the finger
      // rested there and the drag logic below would never get its turn.
      if (e.pointerType === 'mouse') hovering = true
    }
    const onLeave = () => {
      hovering = false
      wake()
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
      // A POINTER DRAG MUST NOT PARK THE BELT (the lag hunt, 2026-08-20).
      // Chrome focuses a link on mousedown, so grabbing the belt with a mouse
      // left `:focus-within` true when the hand let go — and the belt sat
      // DEAD until the next click anywhere on the page. That is a stopped
      // belt answering a finished gesture, and it reads exactly as "laggy".
      // Blur only after a REAL drag (a tap/click must keep its focus ring and
      // its navigation), and only if focus actually sits inside the belt —
      // the keyboard's focus-stop is untouched because a keyboard never drags.
      if (moved > DRAG_SLOP_PX) {
        const a = document.activeElement
        if (a instanceof HTMLElement && el.contains(a)) a.blur()
      }
      // The glide (or the post-rest resume timer) needs the loop awake.
      wake()
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
            if (onScreen) wake()
          })
    io?.observe(el)

    // Every event that can END a stillness wakes the sleeping loop; `wake`
    // is idempotent, so waking an already-running loop costs one boolean.
    const onVisibility = () => {
      if (!document.hidden) wake()
    }
    const onFocusOut = () => wake()
    const onPrmChange = () => {
      if (!prm.matches) wake()
    }
    document.addEventListener('visibilitychange', onVisibility)
    el.addEventListener('focusout', onFocusOut)
    prm.addEventListener?.('change', onPrmChange)

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', endDrag)
    el.addEventListener('pointercancel', endDrag)
    el.addEventListener('click', onClickCapture, true)
    wake()

    return () => {
      running = false
      cancelAnimationFrame(raf)
      clearTimeout(resumeTimer)
      wakeRef.current = null
      io?.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      el.removeEventListener('focusout', onFocusOut)
      prm.removeEventListener?.('change', onPrmChange)
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
