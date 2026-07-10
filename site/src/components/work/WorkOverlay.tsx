// The WORK card-on-top, re-skinned to Design Language v2 (DL-2, Emilie
// confirmed in chat 2026-07-10): a glass-2 FLOATING SHEET (--r-sheet fillet,
// mode-aware tokens) lifted over the dimmed grid. The R2 mechanics are
// untouched: native <dialog> (focus trapping, Escape, inert background),
// URL-addressable at /work/:id, focus returned to the card by Work.tsx.
// It still leads with the WORK (the hero rule: video > live > photo > audio >
// text), and now catches everything the face gave up (§7 low density): the
// dek as the claim line, the story, the strip, the tech row, the FULL
// recognition line, then the links + OPEN THE FULL PAGE where a page exists.
//
// Centered sheet on desktop, bottom sheet on phones (.work-dialog in
// index.css); the rise is one-shot and PRM-gated (final state instant under
// reduced motion).
import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Img from '../Img'
import SheetVideo from '../sheet/SheetVideo'
import { LensPill } from '../ui/Pill'
import { vtName } from '../../lib/viewTransition'
import type { WorkEntry } from '../../data/work'

const ACCENT_LINK =
  'text-[var(--lang-interaction)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'
// Text links wear a transparent >= 44px hit box (the touch floor, a FLOORS
// rule): the visible link stays a quiet mono line, the box does the catching;
// negative vertical margin keeps the row rhythm compact.
const ROW_LINK = `inline-flex min-h-11 min-w-11 items-center ${ACCENT_LINK}`

function HeroMedia({ entry }: { entry: WorkEntry }) {
  if (entry.hero === 'video' && entry.heroVideo) {
    return (
      <div className="aspect-video overflow-hidden rounded-[var(--r-image)] border-[0.5px] border-[var(--lang-hairline)] bg-[color-mix(in_srgb,var(--lang-ink)_5%,transparent)]">
        <SheetVideo bare slug={entry.heroVideo.slug} name={entry.heroVideo.name} ariaLabel={entry.heroVideo.ariaLabel} />
      </div>
    )
  }
  if (entry.hero === 'live' && entry.live && entry.cover) {
    const wakes = /wakes/i.test(entry.live.label)
    // The scrim + launch stay fixed light-on-dark in BOTH modes: they sit on
    // the photograph, not on the ground, so mode tokens do not apply.
    return (
      <div className="relative aspect-video overflow-hidden rounded-[var(--r-image)] border-[0.5px] border-[var(--lang-hairline)]">
        <Img
          slug={entry.cover.slug}
          name={entry.cover.name}
          alt={entry.cover.alt}
          develop
          priority
          className="block h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[rgba(11,14,19,0.45)]">
          <a
            href={entry.live.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-[var(--r-pill)] border-[0.5px] border-white/70 bg-[rgba(11,14,19,0.35)] px-5 font-mono text-[11px] tracking-[0.12em] text-white no-underline backdrop-blur-sm hover:bg-[rgba(11,14,19,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
          >
            TRY IT LIVE &gt;<span className="sr-only"> (opens in new tab)</span>
          </a>
          {wakes && (
            <span className="font-mono text-[9px] tracking-[0.1em] text-white/85">WAKES IN ~30S</span>
          )}
        </div>
      </div>
    )
  }
  if (entry.hero === 'photo' && entry.cover) {
    return (
      <div className="aspect-video overflow-hidden rounded-[var(--r-image)] border-[0.5px] border-[var(--lang-hairline)]">
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
      <div className="lang-glass-1 rounded-[var(--r-image)] px-5 py-6 sm:px-7 sm:py-8">
        <blockquote className="max-w-[46ch] font-serif text-[19px] leading-snug text-[var(--lang-ink)]">
          “{entry.pullQuote.text}”
        </blockquote>
        <p className="mt-3 font-mono text-[9px] tracking-[0.1em] text-[var(--lang-ink-muted)]">
          {entry.pullQuote.source}
        </p>
        <a
          href={entry.audio.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-2 font-mono text-[10px] tracking-[0.12em] ${ROW_LINK}`}
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
      className="work-dialog lang-glass-2"
      // The shared-element destination: the opened card's face morphs into
      // this sheet and back on close (page-work-<id>, lib/viewTransition.ts).
      style={{ viewTransitionName: vtName(`/work/${entry.id}`) }}
      // A click on the backdrop (the dialog element itself, outside the inner
      // panel) closes; clicks inside the panel do not bubble to here.
      onClick={(e) => {
        if (e.target === ref.current) close()
      }}
    >
      <div className="flex items-center justify-between border-b border-[var(--lang-hairline)] px-5 py-2.5">
        <span className="font-mono text-[9px] tracking-[0.12em] text-[var(--lang-ink-muted)]">
          {entry.number}
          {entry.status === 'in-preparation' && ' · IN PREPARATION'}
        </span>
        <button
          type="button"
          onClick={close}
          aria-label="Close preview"
          className="-my-1 -mr-2 flex size-11 items-center justify-center rounded-[var(--r-pill)] font-mono text-[13px] leading-none text-[var(--lang-ink-muted)] transition-colors hover:text-[var(--lang-ink)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]"
        >
          ✕
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-7 sm:py-5">
        {/* The second morph of the chain (DL-2): where a full page exists this
            hero adopts the PAGE's name, so OPEN THE FULL PAGE travels the hero
            into SheetLayout's hero (page-sheets-<n>). One element per name per
            state holds: nothing else on /work carries a sheet-route name. */}
        <div
          style={{
            viewTransitionName:
              entry.hasFullPage && entry.fullPageRoute ? vtName(entry.fullPageRoute) : undefined,
          }}
        >
          <HeroMedia entry={entry} />
        </div>

        <div className="mt-4">
          <h2 id={titleId} className="text-2xl font-semibold tracking-[-0.01em] text-[var(--lang-ink)]">
            {entry.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <LensPill lens={entry.lens} />
            {entry.recognition && (
              // Recognition, not a stamp: ink, no box, never red (rule 1).
              // The FULL wording lives here; the face only carried the short pill.
              <span className="font-mono text-[9px] font-medium tracking-[0.1em] text-[var(--lang-ink)]">
                <span aria-hidden="true">✦ </span>
                {entry.recognition}
              </span>
            )}
          </div>

          {/* The claim line (the dek), moved in from the R2 card face; the
              story keeps its own quieter voice below it. */}
          <p className="mt-3 max-w-[58ch] font-serif text-[17px] leading-snug text-[var(--lang-ink)]">
            {entry.dek}
          </p>
          <p className="mt-2.5 max-w-[62ch] font-serif text-[15px] leading-[1.65] text-[var(--lang-ink-muted)]">
            {entry.story}
          </p>
        </div>

        {entry.strip.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {entry.strip.map((pic) => (
              <div
                key={pic.name}
                className="aspect-[4/3] overflow-hidden rounded-[var(--r-image)] border-[0.5px] border-[var(--lang-hairline)]"
              >
                <Img slug={pic.slug} name={pic.name} alt={pic.alt} develop className="block h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* The tech row, moved in from the R2 card face (mono, the quiet
            research accent, never the dominant texture). */}
        <div className="mt-4 font-mono text-[9px] tracking-[0.06em] text-[var(--lang-ink-muted)]">
          {entry.tech}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--lang-hairline)] pt-4 font-mono text-[10px] tracking-[0.1em]">
          {entry.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`-my-3 ${ROW_LINK}`}
            >
              {l.label}
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          ))}
          {entry.hasFullPage && entry.fullPageRoute && (
            <Link to={entry.fullPageRoute} viewTransition onClick={close} className={`-my-3 font-medium ${ROW_LINK}`}>
              OPEN THE FULL PAGE &gt;
            </Link>
          )}
        </div>
      </div>
    </dialog>
  )
}
