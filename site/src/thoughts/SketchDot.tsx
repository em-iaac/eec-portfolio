// THE SKETCH DOT (S5, Emilie's mechanism, signed 2026-07-18): a thought
// note stays words-only at rest, and this dot blooms a DRAWING floating in
// the margin: no frame, no panel, the charcoal lifted off its paper by a
// blend (multiply on the light ground; inverted + screen on carbon, the
// chalk version). Her two ideas composed into one: "a dot like an nb where
// we get the reveal of the drawing" + "actual floating drawings somehow".
// The interaction grammar is NB's, verbatim: hover/focus reveals, click
// pins, Escape + outside-tap dismiss, 44px hit box, PRM = instant. The
// blend styles live in language.css (.sketch-fl / .sketch-img), using the
// cursor's explicit prefers-color-scheme + [data-theme] block pattern
// (light-dark() cannot wrap filter/blend values).
import { useEffect, useId, useRef, useState } from 'react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import { useIsPrint } from '../print/PrintContext'

// One drawing floats at a time: opening a dot asks every other dot to
// settle (the margin is shared; three pinned charcoals would stack).
const SETTLE_EVENT = 'sketchdot-open'

export default function SketchDot({
  name,
  alt,
  drop = 0,
}: {
  /** Asset base name under /assets/sketches/ (e.g. 'torso' -> torso-360/720.webp). */
  name: string
  /** Authored alt text (80-140 chars, context not contents). */
  alt: string
  /** Vertical nudge in px so stacked reveals never collide (per-dot, hand-set). */
  drop?: number
}) {
  const isPrint = useIsPrint()
  const prm = usePrefersReducedMotion()
  const dotId = useId()
  const [hover, setHover] = useState(false)
  const [pinned, setPinned] = useState(false)
  const anchorRef = useRef<HTMLSpanElement | null>(null)
  const open = hover || pinned

  // Announce an open so sibling dots settle; listen for siblings' opens.
  const announce = () => document.dispatchEvent(new CustomEvent(SETTLE_EVENT, { detail: dotId }))
  useEffect(() => {
    const onSibling = (e: Event) => {
      if ((e as CustomEvent).detail !== dotId) {
        setPinned(false)
        setHover(false)
      }
    }
    document.addEventListener(SETTLE_EVENT, onSibling)
    return () => document.removeEventListener(SETTLE_EVENT, onSibling)
  }, [dotId])

  // Same dismissal contract as NB: a pinned drawing closes from anywhere.
  useEffect(() => {
    if (!pinned) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPinned(false)
        setHover(false)
      }
    }
    const onOutside = (e: Event) => {
      if (!anchorRef.current?.contains(e.target as Node)) {
        setPinned(false)
        setHover(false)
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onOutside)
    }
  }, [pinned])

  // Notes never render in the book; if that ever changes, the drawing has
  // no hover on paper, so it simply stays away (words-only, the G2 rest).
  if (isPrint) return null

  return (
    // The drawing renders as a SIBLING of the dot, not a child: the anchor
    // is inline-block, and a block inside it can neither center in the
    // paragraph (mobile in-flow branch) nor position against it. As a
    // direct child of the note's <p> (position: relative via ThoughtLeaf),
    // the wide branch floats in the margin and the narrow branch joins the
    // block flow, centered.
    <>
      <span ref={anchorRef} className="inline-block">
      <button
        type="button"
        aria-expanded={pinned}
        aria-label={`Reveal the drawing: ${alt}`}
        onMouseEnter={() => {
          announce()
          setHover(true)
        }}
        onMouseLeave={() => setHover(false)}
        onFocus={() => {
          announce()
          setHover(true)
        }}
        onBlur={() => setHover(false)}
        onClick={() => {
          announce()
          // Clear emulated hover when unpinning (touch: mouseenter fired on
          // the first tap and never re-fires; same trap as NB).
          setPinned((p) => {
            if (p) setHover(false)
            return !p
          })
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setPinned(false)
            setHover(false)
          }
        }}
        // 8px dot + 18px padding = the 44px floor; negative margin keeps the
        // line rhythm untouched (NB's exact recipe).
        className="-m-[18px] inline-block cursor-pointer border-0 bg-transparent p-[18px] align-super leading-none focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]"
      >
        <span
          aria-hidden="true"
          className="block size-2 rounded-full bg-[var(--lang-interaction)]"
          style={{
            opacity: open ? 0.45 : 1,
            transition: prm ? 'none' : 'opacity 250ms',
          }}
        />
      </button>
      </span>
      {open && (
        <span className={`sketch-fl ${prm ? 'sketch-fl-still' : ''}`} style={{ top: drop }} role="img" aria-label={alt}>
          <img
            className="sketch-img"
            src={`/assets/sketches/${name}-360.webp`}
            srcSet={`/assets/sketches/${name}-360.webp 360w, /assets/sketches/${name}-720.webp 720w`}
            sizes="220px"
            alt=""
            decoding="async"
          />
        </span>
      )}
    </>
  )
}
