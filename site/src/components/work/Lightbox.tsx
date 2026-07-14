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
import type { WorkPicture } from '../../data/work'

const NAV_BTN =
  'flex size-11 items-center justify-center rounded-[var(--r-pill)] bg-[rgba(11,14,19,0.55)] font-mono text-[15px] leading-none text-white transition-colors hover:bg-[rgba(11,14,19,0.8)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'

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
  const pic = pictures[index]
  const many = pictures.length > 1

  // Modal on mount, over the already-open showcase dialog. Escape is handled
  // directly on keydown (below; this Chromium never fires the native 'cancel'
  // on Esc). The 'cancel' listener stays as the fallback for close requests
  // that arrive WITHOUT a keydown (Android's back gesture); the top layer
  // routes those to this, the topmost dialog, so the sheet stays open.
  useLayoutEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    if (!dlg.open) dlg.showModal()
    const onCancel = () => onClose()
    dlg.addEventListener('cancel', onCancel)
    return () => {
      dlg.removeEventListener('cancel', onCancel)
      if (dlg.open) dlg.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!pic) return null

  const prev = () => onNavigate((index - 1 + pictures.length) % pictures.length)
  const next = () => onNavigate((index + 1) % pictures.length)

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
      <div className="flex max-h-dvh w-screen flex-col items-center justify-center gap-2 p-4 sm:p-8">
        <Img
          slug={pic.slug}
          name={pic.name}
          alt={pic.alt}
          priority
          sizes="92vw"
          className="max-h-[80dvh] max-w-full rounded-[var(--r-image)] object-contain"
        />
        <p className="max-w-[62ch] text-center font-mono text-[10px] tracking-[0.08em] text-white/85">
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
