// THE LENS GROUP (the design audit round 3, Emilie 2026-07-19: "the
// magnifying system, implement it in other things"). The header pill's
// liquid-glass magnifier as ONE reusable mechanism for any row of pressable
// pills: wrap a cluster and the lens appears under whatever link or button
// the pointer (or keyboard focus) is over, sliding between them and gently
// magnifying the hovered control (.lens-pop / [data-mag], language.css).
// Unlike the header's lens it has NO resting position (these rows carry no
// "you are here"), so it fades away on leave. Event delegation: no per-item
// refs, any <a>/<button> descendant participates. Reduced motion: the lens
// appears in place without sliding, nothing magnifies.
// Consumers: the footer contact row, the About link cluster, the landing's
// door row (Emilie's picks, all three).
import { useCallback, useRef, useState, type ReactNode } from 'react'

export default function LensGroup({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [box, setBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null)
  const magged = useRef<HTMLElement | null>(null)

  const setMag = (el: HTMLElement | null) => {
    if (magged.current && magged.current !== el) magged.current.removeAttribute('data-mag')
    if (el) el.setAttribute('data-mag', '')
    magged.current = el
  }

  const over = useCallback((e: { target: EventTarget }) => {
    const root = ref.current
    const t = (e.target as HTMLElement).closest?.('a,button') as HTMLElement | null
    if (!root || !t || !root.contains(t)) return
    const g = root.getBoundingClientRect()
    const r = t.getBoundingClientRect()
    setBox({ left: r.left - g.left, top: r.top - g.top, width: r.width, height: r.height })
    setMag(t)
  }, [])

  const clear = useCallback(() => {
    setBox(null)
    setMag(null)
  }, [])

  return (
    <div
      ref={ref}
      onPointerOver={over}
      onPointerLeave={clear}
      onFocus={over}
      onBlur={clear}
      className={`lens-group relative ${className}`}
    >
      {box && <span aria-hidden="true" className="lens-pop pointer-events-none absolute" style={box} />}
      {children}
    </div>
  )
}
