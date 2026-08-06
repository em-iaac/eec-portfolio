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
import useHasHover from '../../hooks/useHasHover'
import type { ReachSet, ReachVerb } from './verbs'

export default function ReachDrawer({ set }: { set: ReachSet }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const tabRef = useRef<HTMLButtonElement>(null)
  const panelId = 'reach-drawer-panel'
  // IT OPENS ON HOVER WHERE THERE IS A POINTER (Emilie, 2026-08-06: "on the
  // desktop should open on hover"). Gated on `useHasHover`, never on width: the
  // press is the right gesture for a finger and hover does not exist there, so
  // this adds a way in for a mouse without taking one away from a thumb.
  // The press still works with a pointer too, and still closes it.
  const hasHover = useHasHover()

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
    // `reach-drawer--wide` is what actually shows it from lg up, NOT a Tailwind
    // class: `display` for this component lives inside a media query in
    // language.css precisely because Tailwind's `lg:hidden` is layered and loses
    // to the unlayered rule (the trap documented there). So a room's opt-in has
    // to reach the same unlayered place, and a modifier class is that.
    <div
      ref={rootRef}
      // The whole root is the hover target, tab and panel together, so the
      // pointer can travel from the tab into the rows without it closing under
      // the cursor. `pointerType` is checked because a touch fires
      // pointerenter too, and on a phone that would open the drawer on the way
      // past it (the same trap the header magnifier and the belt tiles hit).
      onPointerEnter={hasHover ? (e) => { if (e.pointerType === 'mouse') setOpen(true) } : undefined}
      onPointerLeave={hasHover ? (e) => { if (e.pointerType === 'mouse') setOpen(false) } : undefined}
      className={`reach-drawer ${open ? 'is-open' : ''} ${set.place === 'middle' ? 'reach-drawer--mid' : ''} ${set.wide ? 'reach-drawer--wide' : 'lg:hidden'}`}
    >
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
        {/* The tab's WORD is rotated, and only the tab's: one short label, so it
            costs 24px of width and reads fine. The list behind it stays
            horizontal.

            IT IS A READOUT ON A PLACE DRAWER (verbs.ts carries the rule). `at`
            is the section or year you are currently at, so the closed tab
            answers "where am I" without being opened at all — which is what she
            asked for, and it turns the tab from a label into the one piece of
            state this room always wants to show. An exit drawer has no `at` and
            falls back to its handle, unchanged. */}
        <span className="reach-drawer__word" aria-hidden="true">
          {open ? 'CLOSE' : (set.at ?? set.handle).toUpperCase()}
        </span>
        {/* The accessible name carries the readout too, or a screen reader would
            hear only "Jump to a section" while the tab says EXPERIENCE. */}
        <span className="sr-only">
          {open ? `Close ${set.label}` : set.at ? `${set.label}, currently at ${set.at}` : set.label}
        </span>
      </button>
    </div>
  )
}
