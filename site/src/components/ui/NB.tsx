// DESIGN LANGUAGE v2 primitive · NB, the inline n.b. hover dot. Emilie's G1
// ruling (in chat, 2026-07-10): the sheet-era margin wink survives as "a dot
// you hover on so we don't lose space and it's for people who look for it".
// This is the Pen Table NBDot ported to the glass language: the dot is the
// interaction accent, the tip is a glass-2 surface, the note reads serif
// italic (the handwritten Caveat register stayed behind with the mylar). The
// pin / Escape / outside-tap / viewport-clamp mechanics carry over verbatim;
// the hit box rises to the 44px touch floor (padding + negative margin so
// the line rhythm is untouched).
import { useEffect, useRef, useState } from 'react'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import { useIsPrint } from '../../print/PrintContext'

// Must match the tip's w-[218px] and left-[-60px] classes below.
const TIP_W = 218
const TIP_LEFT = -60
const GUTTER = 12

export default function NB({
  note,
  align = 'left',
}: {
  note: string
  align?: 'left' | 'right'
}) {
  const isPrint = useIsPrint()
  const prm = usePrefersReducedMotion()
  const [hover, setHover] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [shift, setShift] = useState(0)
  const anchorRef = useRef<HTMLSpanElement | null>(null)
  const open = hover || pinned

  // Keep the tip inside the viewport (12px gutter). The shift is computed
  // from the ANCHOR before the tip mounts: measuring the tip itself is a
  // trap, because an overflowing tip widens the mobile layout viewport the
  // moment it renders, and the post-mount measurement then sees nothing
  // wrong. Applied via the standalone `translate` property so the entrance
  // animation's transform is untouched.
  const prepare = () => {
    const a = anchorRef.current?.getBoundingClientRect()
    if (!a) return
    const vw = document.documentElement.clientWidth
    const left = align === 'right' ? a.right - TIP_W : a.left + TIP_LEFT
    if (left + TIP_W > vw - GUTTER) setShift(vw - GUTTER - (left + TIP_W))
    else if (left < GUTTER) setShift(GUTTER - left)
    else setShift(0)
  }

  // A pinned tip must be dismissable from anywhere: Escape (Safari does not
  // focus a clicked button, so the button-level onKeyDown never fires for
  // mouse users) and a tap/click outside the dot (on touch, emulated hover
  // sticks; without this a pinned note has no reliable close). Only mounted
  // while pinned.
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

  // G5 · the print rendition: hover is dead on paper, so the wink steps
  // into the line as a small handwritten aside (Caveat, the margin-note
  // register; the note text is the same signed content). All hooks above
  // have run by here, and the context value never changes within a tree,
  // so the branch is hook-safe.
  if (isPrint) {
    return <span className="pr-wink"> n.b. {note}</span>
  }

  return (
    <span ref={anchorRef} className="relative inline-block">
      <button
        type="button"
        aria-expanded={pinned}
        aria-label="Reveal note"
        onMouseEnter={() => {
          prepare()
          setHover(true)
        }}
        onMouseLeave={() => setHover(false)}
        onFocus={() => {
          prepare()
          setHover(true)
        }}
        onBlur={() => setHover(false)}
        onClick={() => {
          prepare()
          // Clear the emulated-hover state when unpinning: on touch,
          // mouseenter fired on the first tap and never re-fires, so
          // without this a second tap leaves open = hover || pinned true and
          // the note is stuck open.
          setPinned(p => {
            if (p) setHover(false)
            return !p
          })
        }}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            setPinned(false)
            setHover(false)
          }
        }}
        // 8px dot + 18px padding all around = a 44px hit box (FLOORS); the
        // matching negative margin keeps the dot sitting in the prose line.
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
      {open && (
        <span
          role="note"
          style={{ translate: `${shift}px 0` }}
          // The SOLID tier fill, not the translucent glass: the tip floats
          // over running prose, and a nested backdrop-filter does not blur
          // inside an already-blurred panel (the showcase sheet), so glass
          // here would gamble the note's contrast on the text behind it
          // (the AA floor; same ruling as the Card's on-photo award pill).
          className={`nbtip-enter pointer-events-none absolute top-5 z-10 block w-[218px] rounded-[var(--r-control)] border-[0.5px] border-[var(--lang-glass-2-border)] bg-[var(--lang-glass-2-solid)] px-[11px] py-2 text-left font-serif text-[13px] leading-[1.45] font-normal tracking-normal normal-case italic text-[var(--lang-ink)] ${
            align === 'right' ? 'right-0' : 'left-[-60px]'
          }`}
        >
          <span className="font-mono text-[10px] not-italic text-[var(--lang-interaction)]">n.b.</span>{' '}
          {note}
        </span>
      )}
    </span>
  )
}
