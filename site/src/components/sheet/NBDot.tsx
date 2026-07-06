// The inline n.b. dot (governance rule 8): an 8px redline marker placed
// exactly where Em noted something in the prose. Hover or focus reveals the
// handwritten note; click pins it; Escape closes. The dot dims while its
// note is open. Reduced motion: no transition.
import { useState, type CSSProperties } from 'react'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'

const OVERSHOOT = 'cubic-bezier(0.34,1.56,0.64,1)'

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
  const open = hover || pinned

  const tipStyle: CSSProperties = {
    opacity: open ? 1 : 0,
    visibility: open ? 'visible' : 'hidden',
    transform: open ? 'none' : 'translateY(5px)',
    transition: prm
      ? 'none'
      : `opacity 300ms ${OVERSHOOT}, transform 300ms ${OVERSHOOT}, visibility 0s ${open ? '0s' : '300ms'}`,
  }

  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-expanded={pinned}
        aria-label="Reveal note"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        onClick={() => setPinned((p) => !p)}
        onKeyDown={(e) => {
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
      <span
        role="note"
        style={tipStyle}
        className={`pointer-events-none absolute top-5 z-10 block w-[218px] border border-ink/35 bg-mylar px-[11px] py-2 text-left font-hand text-[17px] leading-[1.3] tracking-normal text-anno normal-case shadow-[0_4px_14px] shadow-ink/10 ${
          align === 'right' ? 'right-0' : 'left-[-60px]'
        }`}
      >
        <span className="text-redline">n.b.</span> {note}
      </span>
    </span>
  )
}
