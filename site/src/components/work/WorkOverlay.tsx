// The WORK card-on-top (Session R2): a preview that lifts over the dimmed grid.
// Built on the native <dialog> element, so focus trapping, Escape, the inert
// background, and focus-return to the card come for free and correct. The
// preview leads with the WORK (Emilie, 2026-07-09): the hero media sits on top
// (a demo video that plays inline, a TRY IT LIVE launch, the cover photo, or a
// listening pull-quote), then the claim, a strip of supporting pictures, the
// links, and OPEN THE FULL PAGE only where a real page exists. Depth (code,
// findings, cinema) lives on that page, never crammed into this modal.
//
// Centered card on desktop, bottom sheet on phones (.work-dialog in index.css);
// the rise is one-shot and PRM-gated (final state instant under reduced motion).
import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Img from '../Img'
import SheetVideo from '../sheet/SheetVideo'
import { LensTick, LENSES } from '../Lens'
import { vtName } from '../../lib/viewTransition'
import type { WorkEntry } from '../../data/work'

const RED_LINK =
  'text-redline underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline'

function HeroMedia({ entry }: { entry: WorkEntry }) {
  if (entry.hero === 'video' && entry.heroVideo) {
    return (
      <div className="aspect-video overflow-hidden border border-ink/35 bg-ink/5">
        <SheetVideo bare slug={entry.heroVideo.slug} name={entry.heroVideo.name} ariaLabel={entry.heroVideo.ariaLabel} />
      </div>
    )
  }
  if (entry.hero === 'live' && entry.live && entry.cover) {
    const wakes = /wakes/i.test(entry.live.label)
    return (
      <div className="relative aspect-video overflow-hidden border border-ink/35">
        <Img
          slug={entry.cover.slug}
          name={entry.cover.name}
          alt={entry.cover.alt}
          develop
          priority
          className="block h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/45">
          <a
            href={entry.live.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-mylar/80 bg-ink/30 px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] text-mylar no-underline backdrop-blur-sm hover:bg-ink/50 focus-visible:outline-2 focus-visible:outline-redline-wire"
          >
            TRY IT LIVE &gt;<span className="sr-only"> (opens in new tab)</span>
          </a>
          {wakes && (
            <span className="font-mono text-[9px] tracking-[0.1em] text-mylar/85">WAKES IN ~30S</span>
          )}
        </div>
      </div>
    )
  }
  if (entry.hero === 'photo' && entry.cover) {
    return (
      <div className="aspect-video overflow-hidden border border-ink/35">
        <Img
          slug={entry.cover.slug}
          name={entry.cover.name}
          alt={entry.cover.alt}
          develop
          priority
          className="block h-full w-full object-cover"
        />
      </div>
    )
  }
  if (entry.hero === 'audio' && entry.audio && entry.pullQuote) {
    return (
      <div className="border border-ink/35 bg-mylar px-5 py-6 sm:px-7 sm:py-8">
        <blockquote className="max-w-[46ch] font-serif text-[19px] leading-snug text-ink">
          “{entry.pullQuote.text}”
        </blockquote>
        <p className="mt-3 font-mono text-[9px] tracking-[0.1em] text-anno">{entry.pullQuote.source}</p>
        <a
          href={entry.audio.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-5 inline-block font-mono text-[10px] tracking-[0.12em] ${RED_LINK}`}
        >
          LISTEN ON SPOTIFY &gt;<span className="sr-only"> (opens in new tab)</span>
        </a>
      </div>
    )
  }
  return null
}

export default function WorkOverlay({ entry, onClose }: { entry: WorkEntry; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = `work-title-${entry.id}`

  // Open as a true modal on mount (top layer, focus trap, background inert).
  // A LAYOUT effect since DL-1: react-router runs the route update inside
  // document.startViewTransition's flushSync, so the dialog must be [open]
  // synchronously for the new-state capture to see the morph target; a
  // passive effect would land after the capture and break the pair.
  // Escape is handled via the 'cancel' event, NOT 'close': the native 'close'
  // event is dispatched asynchronously, so under StrictMode the close() from
  // the first cleanup lands after the remount has reattached a listener and
  // fires a phantom close. 'cancel' only fires on real user dismissal (Escape),
  // never on a programmatic close(), so it survives the double-invoke. The X
  // and the backdrop route through onClose directly (below).
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
    // entry.id keys a fresh open when the deep-linked card changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.id])

  // Closing navigates (onClose); React unmounts the overlay and its cleanup
  // takes the dialog out of the top layer and returns focus to the card.
  const close = () => onClose()

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="work-dialog"
      // The shared-element destination: the opened card's face morphs into
      // this panel and back on close (page-work-<id>, lib/viewTransition.ts).
      style={{ viewTransitionName: vtName(`/work/${entry.id}`) }}
      // A click on the backdrop (the dialog element itself, outside the inner
      // panel) closes; clicks inside the panel do not bubble to here.
      onClick={(e) => {
        if (e.target === ref.current) close()
      }}
    >
      <div className="flex items-center justify-between border-b border-ink/20 px-4 py-2.5">
        <span className="font-mono text-[9px] tracking-[0.12em] text-anno">
          {entry.number}
          {entry.status === 'in-preparation' && ' · IN PREPARATION'}
        </span>
        <button
          type="button"
          onClick={close}
          aria-label="Close preview"
          className="-my-2 -mr-2 flex size-11 items-center justify-center font-mono text-[13px] leading-none text-anno hover:text-ink focus-visible:outline-2 focus-visible:outline-redline"
        >
          ✕
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
        <HeroMedia entry={entry} />

        <div className="mt-4">
          <h2 id={titleId} className="text-2xl font-semibold tracking-[-0.01em] text-ink">
            {entry.title}
          </h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[9px] tracking-[0.1em] text-anno">
            <span className="inline-flex items-center gap-1.5">
              <LensTick lens={entry.lens} size={8} />
              {LENSES[entry.lens].label.toUpperCase()}
            </span>
            {entry.recognition && (
              <>
                <span aria-hidden="true">·</span>
                {/* Recognition, not a stamp: ink, no box, never red (rule 1). */}
                <span className="font-medium text-ink">
                  <span aria-hidden="true">✦ </span>
                  {entry.recognition}
                </span>
              </>
            )}
          </div>

          <p className="mt-3 max-w-[62ch] font-serif text-[15.5px] leading-[1.65] text-ink">{entry.story}</p>
        </div>

        {entry.strip.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {entry.strip.map((pic) => (
              <div key={pic.name} className="aspect-[4/3] overflow-hidden border border-ink/20">
                <Img slug={pic.slug} name={pic.name} alt={pic.alt} develop className="block h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink/20 pt-4 font-mono text-[10px] tracking-[0.1em]">
          {entry.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`-m-2 p-2 ${RED_LINK}`}
            >
              {l.label}
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          ))}
          {entry.hasFullPage && entry.fullPageRoute && (
            <Link to={entry.fullPageRoute} viewTransition onClick={close} className={`-m-2 p-2 font-medium ${RED_LINK}`}>
              OPEN THE FULL PAGE &gt;
            </Link>
          )}
        </div>
      </div>
    </dialog>
  )
}
