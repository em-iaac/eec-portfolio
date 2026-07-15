// THE QUESTION DOT (Emilie's ask, 2026-07-14): the lead question wears a dot;
// hovering (or tapping) it reveals the OTHER questions this project answers,
// "all the questions at a glance". Pressing one highlights the spine section
// that answers it (scroll + a brief tint), so the plate shows WHERE the answer
// lives. The dot reuses the NB primitive's grammar verbatim: redline dot,
// solid-fill tip (never nested glass, the AA ruling), hover + pin + Escape +
// outside-tap, a 44px hit box via padding + negative margin. Escape closes
// the TIP first and stops there, never the plate (one layer per press).
import { useEffect, useRef, useState, type RefObject } from 'react'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'

const TIP_W = 264
const TIP_LEFT = -120
const GUTTER = 12
const FLASH_MS = 1800

export type AlsoAnswer = { q: string; beat?: 'what' | 'why' | 'how' | 'outcome' }

export default function QuestionsDot({
  also,
  dialogRef,
}: {
  also: AlsoAnswer[]
  /** the plate dialog: beat sections are looked up inside it, never the page */
  dialogRef: RefObject<HTMLDialogElement | null>
}) {
  const prm = usePrefersReducedMotion()
  const [hover, setHover] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [shift, setShift] = useState(0)
  const anchorRef = useRef<HTMLSpanElement | null>(null)
  const flashTimer = useRef<number | undefined>(undefined)
  const open = hover || pinned

  // Viewport clamp, measured from the anchor (the NB ruling: measuring the
  // tip is a trap, an overflowing tip widens the mobile viewport first).
  const prepare = () => {
    const a = anchorRef.current?.getBoundingClientRect()
    if (!a) return
    const vw = document.documentElement.clientWidth
    const left = a.left + TIP_LEFT
    if (left + TIP_W > vw - GUTTER) setShift(vw - GUTTER - (left + TIP_W))
    else if (left < GUTTER) setShift(GUTTER - left)
    else setShift(0)
  }

  // Pinned tips dismiss from anywhere: Escape + outside tap (NB verbatim).
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

  useEffect(() => () => window.clearTimeout(flashTimer.current), [])

  // Press a question -> the spine section that answers it lights up briefly.
  // Guarded: a beat that names a section this project does not have (a thin
  // spine) is simply a no-op. Reduced motion: instant scroll, tint still
  // appears (a state, not a motion).
  const highlight = (beat?: AlsoAnswer['beat']) => {
    if (!beat) return
    const dlg = dialogRef.current
    const el = dlg?.querySelector<HTMLElement>(`[data-beat="${beat}"]`)
    if (!dlg || !el) return
    dlg.querySelectorAll('.beat-flash').forEach(n => n.classList.remove('beat-flash'))
    el.scrollIntoView({ block: 'nearest', behavior: prm ? 'auto' : 'smooth' })
    el.classList.add('beat-flash')
    window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => el.classList.remove('beat-flash'), FLASH_MS)
  }

  return (
    <span
      ref={anchorRef}
      className="relative inline-block"
      onPointerLeave={() => setHover(false)}
      // Escape peels THIS layer only: close the tip, stop before the plate's
      // own Escape handler (which would close the whole showcase).
      onKeyDown={e => {
        if (e.key === 'Escape' && open) {
          e.preventDefault()
          e.stopPropagation()
          setPinned(false)
          setHover(false)
        }
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-label={`${also.length} more questions this project answers`}
        onMouseEnter={() => {
          prepare()
          setHover(true)
        }}
        onFocus={() => {
          prepare()
          setHover(true)
        }}
        onClick={() => {
          prepare()
          // NB's touch rule: clear emulated hover when unpinning, or a second
          // tap leaves the tip stuck open.
          setPinned(p => {
            if (p) setHover(false)
            return !p
          })
        }}
        // 8px dot + 18px padding all around = a 44px hit box (FLOORS); the
        // negative margin keeps the dot sitting in the question's line.
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
          role="group"
          aria-label="Other questions this project answers"
          style={{ translate: `${shift}px 0` }}
          // SOLID tier fill, never nested glass (the NB AA ruling: backdrop
          // blur does not compose inside the already-blurred plate).
          className="nbtip-enter absolute top-5 left-[-120px] z-10 block w-[264px] rounded-[var(--r-control)] border-[0.5px] border-[var(--lang-glass-2-border)] bg-[var(--lang-glass-2-solid)] py-1.5 text-left"
        >
          <span className="block px-3.5 pt-1 pb-0.5 font-mono text-[9px] tracking-[0.12em] text-[var(--lang-ink-muted)]">
            ALSO ANSWERS
          </span>
          {also.map(a => (
            <button
              key={a.q}
              type="button"
              onClick={() => highlight(a.beat)}
              className="block min-h-11 w-full cursor-pointer border-0 bg-transparent px-3.5 py-1.5 text-left font-serif text-[13px] leading-snug font-normal tracking-normal normal-case italic text-[var(--lang-ink)] hover:bg-[color-mix(in_srgb,var(--lang-ink)_5%,transparent)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
            >
              {a.q}
            </button>
          ))}
        </span>
      )}
    </span>
  )
}
