// The inline n.b. dot (governance rule 8): an 8px redline marker placed
// exactly where Em noted something in the prose. Hover or focus reveals the
// handwritten note; click pins it; Escape closes. The dot dims while its
// note is open. Session 8 fix: the tip mounts only while open (a hidden-
// but-laid-out tip added ~80px of phantom horizontal overflow on phones),
// entering via the one-shot .nbtip-enter ceremony, and clamps itself to
// the viewport so edge notes never clip. Reduced motion: no animation.
import { useEffect, useRef, useState } from 'react'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'

// Must match the tip's w-[218px] and left-[-60px] classes below.
const TIP_W = 218
const TIP_LEFT = -60
const GUTTER = 12

export default function NBDot({
  note,
  align = 'left',
}: {
  note: string
  align?: 'left' | 'right'
}) {
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
        className="-m-2 inline-block cursor-pointer border-0 bg-transparent p-2 align-super leading-none focus-visible:outline-2 focus-visible:outline-redline"
      >
        <span
          aria-hidden="true"
          className="block size-2 rounded-full bg-redline-stroke"
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
          className={`nbtip-enter pointer-events-none absolute top-5 z-10 block w-[218px] border border-ink/35 bg-mylar px-[11px] py-2 text-left font-hand text-[17px] leading-[1.3] tracking-normal text-anno normal-case shadow-[0_4px_14px] shadow-ink/10 ${
            align === 'right' ? 'right-0' : 'left-[-60px]'
          }`}
        >
          <span className="text-redline">n.b.</span> {note}
        </span>
      )}
    </span>
  )
}
