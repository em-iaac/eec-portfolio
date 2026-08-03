// OPTION F · THE VERTICAL SIDE DRAWER (her ask, 2026-08-03: "what about a side
// drawer i think it could be nicer, and vertical?").
//
// A tab on the right edge, in the thumb arc. Press it and a vertical list of
// the room's tools slides out; press again, press outside, or press Escape and
// it goes.
//
// WHY VERTICAL WORKS HERE AND FAILED ON THE SIDE PILL. The pill stacked the
// verbs with their LABELS ROTATED, which is what made EXPLORATIONS a 90px row
// and the four filters a 360px column. This stacks ROWS of ordinary horizontal
// text instead: five one-line rows at 30px is 150px, and every word reads
// normally. Same axis, completely different arithmetic. That distinction is
// worth keeping: it is rotation that costs, not verticality.
//
// It is the better shape for a LIST (five CV sections, four lenses) where the
// horizontal fan runs off the frame and has to be scrolled.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ReachSet, ReachVerb } from './verbs'

export default function ReachDrawer({ set }: { set: ReachSet }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const tabRef = useRef<HTMLButtonElement>(null)
  const panelId = 'reach-drawer-panel'

  // The dot grammar again: Escape, or a press outside. Nothing new to learn.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      setOpen(false)
      tabRef.current?.focus()
    }
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const row = (verb: ReachVerb) => {
    const cls = `reach-drawer__row ${verb.active ? 'is-on' : ''}`
    const label = (
      <>
        {verb.mark}
        <span>{(verb.short ?? verb.label).toUpperCase()}</span>
      </>
    )
    return verb.to ? (
      <Link
        key={verb.id}
        to={verb.to}
        viewTransition
        aria-current={verb.active ? 'true' : undefined}
        aria-label={verb.short && verb.short !== verb.label ? verb.label : undefined}
        className={cls}
        onClick={() => setOpen(false)}
      >
        {label}
      </Link>
    ) : (
      <button
        key={verb.id}
        type="button"
        aria-pressed={verb.active}
        aria-label={verb.short && verb.short !== verb.label ? verb.label : undefined}
        className={cls}
        onClick={() => {
          verb.onPress?.()
          setOpen(false)
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <div ref={rootRef} className={`reach-drawer ${open ? 'is-open' : ''} lg:hidden`}>
      <div className="reach-drawer__panel lang-glass-2" id={panelId} role="group" aria-label={set.label} inert={!open || undefined}>
        {set.verbs.map(row)}
      </div>
      <button
        ref={tabRef}
        type="button"
        className="reach-drawer__tab lang-glass-2"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        {/* The tab's WORD is rotated, and only the tab's: it is one short label
            that never changes, so it costs 22px of width and reads fine. The
            list behind it stays horizontal. */}
        <span className="reach-drawer__word" aria-hidden="true">
          {open ? 'CLOSE' : set.handle.toUpperCase()}
        </span>
        <span className="sr-only">{open ? `Close ${set.label}` : set.label}</span>
      </button>
    </div>
  )
}
