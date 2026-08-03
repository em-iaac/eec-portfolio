// THE LIGHTBOX (G1.1, Emilie's ruling 2026-07-10: every piece of media is
// "clickable to see as a bigger size"). A second native <dialog> stacked
// over the showcase sheet: the top layer stacks, so Escape closes this one
// first and focus falls back to the thumbnail that opened it (the browser's
// own dialog focus return; no navigation happens here). Arrow keys leaf
// through the set; the backdrop or the ✕ closes. The picture itself is the
// surface (transparent dialog, .work-lightbox in index.css); its alt line
// doubles as the quiet caption.
import { useLayoutEffect, useRef } from 'react'
import Img from '../Img'
import useScrollLock from '../../hooks/useScrollLock'
import useSwipeFlip from './useSwipeFlip'
import type { WorkPicture } from '../../data/work'

const NAV_BTN =
  'flex size-11 items-center justify-center rounded-[var(--r-pill)] bg-[var(--lang-scrim-rest)] font-mono text-body leading-none text-white transition-colors hover:bg-[var(--lang-scrim-hover)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'

export default function Lightbox({
  pictures,
  index,
  onNavigate,
  onClose,
}: {
  pictures: WorkPicture[]
  index: number
  onNavigate: (index: number) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const captionRef = useRef<HTMLParagraphElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const pic = pictures[index]
  const many = pictures.length > 1

  // The page behind stays frozen while this is up. It counts its own lock, so
  // opening a picture over an open sheet holds two and closing it back to the
  // sheet releases only one — the page must not start scrolling again just
  // because the top layer went away (hooks/useScrollLock.ts).
  useScrollLock()

  const prev = () => onNavigate((index - 1 + pictures.length) % pictures.length)
  const next = () => onNavigate((index + 1) % pictures.length)

  // Modal on mount, over the already-open showcase dialog. Escape is handled
  // directly on keydown (below; this Chromium never fires the native 'cancel'
  // on Esc). The 'cancel' listener stays as the fallback for close requests
  // that arrive WITHOUT a keydown (Android's back gesture); the top layer
  // routes those to this, the topmost dialog, so the sheet stays open.
  useLayoutEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    if (!dlg.open) dlg.showModal()
    // A MODAL FOCUSES ITS SUBJECT, NOT ITS CLOSE CONTROL (the same rule the
    // sheet follows; WorkOverlay carries the full account). Here the first
    // focusable element is ‹ or ✕, and WebKit rings whatever showModal()
    // focused in the site's red. The caption IS the subject's name, so landing
    // there announces the picture and its place in the set instead of "Close
    // enlarged view", and no control is focused for a ring to appear on.
    captionRef.current?.focus({ preventScroll: true })
    const onCancel = () => onClose()
    dlg.addEventListener('cancel', onCancel)
    return () => {
      dlg.removeEventListener('cancel', onCancel)
      if (dlg.open) dlg.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // EVERY HOOK ABOVE THIS LINE. It used to sit higher, with `useRef` and
  // `useSwipeFlip` below it, so an empty set would have changed the hook count
  // between renders. Nothing reached it in practice; it is still the kind of
  // thing that fails once and inexplicably.
  useSwipeFlip(stageRef, prev, next, many)
  if (!pic) return null

  return (
    <dialog
      ref={ref}
      aria-label={`${pic.alt} (enlarged)`}
      className="work-lightbox"
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      onKeyDown={(e) => {
        // Escape closes THIS layer only, back to the plate (S4a round 3:
        // this Chromium delivers the keydown but never the native <dialog>
        // 'cancel' close request, so the key is handled here directly;
        // stopPropagation keeps the plate underneath from also closing).
        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()
          onClose()
          return
        }
        if (!many) return
        if (e.key === 'ArrowLeft') prev()
        if (e.key === 'ArrowRight') next()
      }}
    >
      {/* THE SAME SWIPE AS THE PLATE (2026-08-03). The enlarged view is the one
          surface on the site that is nothing but a photograph, so it is the one
          where a sideways swipe is most expected and where its absence was most
          obviously a gap. Same hook, same 4px slop, same flick threshold, so
          learning it once on the plate carries here. The arrows stay: they are
          the keyboard's and the cursor's way in. */}
      <div
        ref={stageRef}
        style={many ? { touchAction: 'pan-y' } : undefined}
        className="flex max-h-dvh w-screen flex-col items-center justify-center gap-2 p-4 sm:p-8"
      >
        {/* THE WHITE MAT (S6-A, Emilie 2026-07-24): the enlarged view keeps
            the plate stage's white backing (WorkOverlay's 16:9 mat) instead of
            floating on the dark backdrop. A transparent asset (a line sketch,
            a cutout render, a diagram) reads as a drawing on paper in both
            modes here too, where before it could nearly vanish on the near-
            black backdrop in dark mode. A solid photo simply covers the white,
            so there is no frame; only the transparent assets change. */}
        <Img
          slug={pic.slug}
          name={pic.name}
          alt={pic.alt}
          priority
          sizes="92vw"
          className="max-h-[80dvh] max-w-full rounded-[var(--r-image)] bg-white object-contain"
        />
        {/* tabIndex -1: focus lands here when the lightbox opens (see above),
            never as a tab stop. */}
        <p
          ref={captionRef}
          tabIndex={-1}
          className="max-w-[62ch] text-center font-mono text-label tracking-[0.08em] text-white/85 outline-none"
        >
          {pic.alt}
          {many && (
            <span className="text-white/60">
              {' '}
              · {index + 1} / {pictures.length}
            </span>
          )}
        </p>
        <div className="flex items-center gap-3">
          {many && (
            <button type="button" onClick={prev} aria-label="Previous picture" className={NAV_BTN}>
              &lsaquo;
            </button>
          )}
          <button type="button" onClick={onClose} aria-label="Close enlarged view" className={NAV_BTN}>
            ✕
          </button>
          {many && (
            <button type="button" onClick={next} aria-label="Next picture" className={NAV_BTN}>
              &rsaquo;
            </button>
          )}
        </div>
      </div>
    </dialog>
  )
}
