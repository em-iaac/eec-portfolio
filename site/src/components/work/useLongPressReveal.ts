// PRESS AND HOLD A TILE TO SEE ITS COVER (Emilie's ruling 2026-08-04, the phone
// pass part three): "long press on a project card should reveal its animated
// cover", replacing the hover a touch screen cannot do.
//
// THE TENSION SHE NAMED HERSELF, and it is the whole design here: the covers
// were deliberately dropped on touch devices at her ruling of 2026-08-02,
// because 21 <img> elements were being downloaded, decoded and laid out to sit
// at opacity 0 forever — roughly 250KB on /work and more on the landing belts,
// not one pixel of it ever visible. So the asset must load ON PRESS and cost
// nothing at all until then. WorkCard renders no <img> while `revealed` is
// false, which is what makes that true rather than merely intended.
//
// TWO STAGES, because of what the animated rung actually weighs. Measured in the
// built site at the 640px rung a phone uses: falcon's cover is 22.7KB still
// against 737KB animated, the huddle's 19.1KB against 146KB, the lungs' ~20KB
// against 425KB. Going straight for the animation means a tile that stays blank
// for seconds on cellular after the press has already fired, which reads as a
// broken gesture. So the STILL arrives first — about one round trip — and the
// animation swaps in underneath it when it lands. The end state is identical;
// only the first second differs, and the first second is the one being fixed.
//
// SAME NUMBERS AS EVERY OTHER GESTURE ON THIS SITE, so this is one vocabulary
// and not a fourth: the belts' 4px slop decides press from scroll, exactly as
// useBeltDrift, useSheetSwipe and useSwipeFlip already do. A finger that moves
// more than 4px is scrolling the page and must never be answered with a reveal.
//
// IT MUST NEVER FIGHT TAP-TO-OPEN, which is the tile's real job:
//   · a plain tap is untouched — the timer has not fired, nothing is cancelled,
//     the click runs and the project opens;
//   · a press that DOES fire suppresses the click that follows it, in the
//     capture phase, so a hold never navigates;
//   · lifting leaves the cover up (her ruling — a thumb covers a third of a
//     169px tile, so peek-while-held would hide the thing being revealed). Tap
//     to open, tap anywhere else to dismiss.
//
// iOS: the tile is a <button>, not a link, so there is no link-preview sheet to
// fight. What is left is the callout and text selection, both closed in CSS on
// `.work-plate` (`-webkit-touch-callout: none`, `user-select: none`), plus the
// context menu, cancelled here because a long press is exactly what summons it.
import { useEffect, useState, type RefObject } from 'react'

const DRAG_SLOP_PX = 4
// Long enough not to fire on a slow tap, short enough to feel like an answer.
// The platform's own long-press is ~500ms; sitting just under it means the
// gesture resolves before the OS would have offered its own menu.
const HOLD_MS = 450

export type RevealStage = 'off' | 'still' | 'animated'

/**
 * Press-and-hold on `ref` to reveal a tile's cover. Returns the stage the
 * reveal has reached and a way to put it away again.
 *
 * `enabled` is false wherever a real pointer can hover: there the cover is one
 * mouse-move away and a hold would be a second, worse way to ask for it.
 */
export default function useLongPressReveal(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
): [RevealStage, () => void] {
  const [stage, setStage] = useState<RevealStage>('off')

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    let timer: number | undefined
    let startX = 0
    let startY = 0
    let fired = false

    const cancelTimer = () => {
      if (timer !== undefined) {
        window.clearTimeout(timer)
        timer = undefined
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType === 'mouse') return
      fired = false
      startX = e.clientX
      startY = e.clientY
      cancelTimer()
      timer = window.setTimeout(() => {
        fired = true
        timer = undefined
        // The still first, then the animation on the next tick so the browser
        // has actually started the small request before the big one is asked
        // for. Img swaps the srcset; nothing is downloaded twice.
        setStage('still')
        window.setTimeout(() => setStage((s) => (s === 'still' ? 'animated' : s)), 0)
      }, HOLD_MS)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (timer === undefined) return
      if (Math.abs(e.clientX - startX) > DRAG_SLOP_PX || Math.abs(e.clientY - startY) > DRAG_SLOP_PX) {
        // She is scrolling past this tile, not asking about it.
        cancelTimer()
      }
    }

    const onPointerUp = () => cancelTimer()

    // A press that fired must not also open the project. Capture phase, because
    // the tile's own click handler is the thing being pre-empted — the same
    // rule useBeltDrift and useSwipeFlip already follow.
    const onClickCapture = (e: MouseEvent) => {
      if (!fired) return
      fired = false
      e.preventDefault()
      e.stopPropagation()
    }

    // The long press IS the platform's context-menu gesture. Cancelling it is
    // what stops iOS offering its own menu over the cover being revealed.
    const onContextMenu = (e: Event) => e.preventDefault()

    // A scroll that begins elsewhere and travels under the finger still means
    // "not this tile": the pointermove slop covers a finger that moves, this
    // covers a page that does.
    const onScroll = () => cancelTimer()

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
    el.addEventListener('contextmenu', onContextMenu)
    el.addEventListener('click', onClickCapture, true)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelTimer()
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
      el.removeEventListener('contextmenu', onContextMenu)
      el.removeEventListener('click', onClickCapture, true)
      window.removeEventListener('scroll', onScroll)
    }
  }, [ref, enabled])

  // TAP ANYWHERE ELSE TO PUT IT AWAY. Only while something is revealed, so the
  // site is not carrying a document listener for a state it is almost never in.
  useEffect(() => {
    if (stage === 'off') return
    const onDocPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setStage('off')
    }
    document.addEventListener('pointerdown', onDocPointerDown)
    return () => document.removeEventListener('pointerdown', onDocPointerDown)
  }, [stage, ref])

  return [stage, () => setStage('off')]
}
