// THE SHOWCASE (R2 card-on-top → DL-2 glass → G1 whole-page → G1.1
// restructure, all Emilie's rulings in chat 2026-07-10): a glass-2 FLOATING
// SHEET lifted over the dimmed grid, deep-linkable at /work/:id, bottom
// sheet on phones. Mechanics unchanged: native <dialog>, URL-addressable,
// focus returned to the card by Work.tsx.
//
// G1.1 ORDER (her restructure, visualised + confirmed): the top bar carries
// the identity (title + lens + award; the P-number and IN PREPARATION left
// the sheet), then the PROOF stack: hero (the video>live>photo>audio>text
// rule), a sideways filmstrip where EVERY frame opens full size (Lightbox),
// the claim line, the mono tools row, the links out. The signed spine
// (WHAT · WHY · HOW · WHAT CAME OF IT) folds behind THE STORY, collapsed by
// default: the closed sheet is pure proof, the words are one tap away.
// Scrolling is native but bar-less (.no-scrollbar); the filmstrip is the
// one sideways scroll.
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import Img from '../Img'
import SheetVideo from '../sheet/SheetVideo'
import Lightbox from './Lightbox'
import { LensPill } from '../ui/Pill'
import { vtName } from '../../lib/viewTransition'
import type { WorkEntry, WorkPicture } from '../../data/work'

const ACCENT_LINK =
  'text-[var(--lang-interaction)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'
// Text links wear a transparent >= 44px hit box (the touch floor, a FLOORS
// rule): the visible link stays a quiet mono line, the box does the catching;
// negative vertical margin keeps the row rhythm compact.
const ROW_LINK = `inline-flex min-h-11 min-w-11 items-center ${ACCENT_LINK}`

const PROSE = 'max-w-[62ch] font-serif text-[15px] leading-[1.65] text-[var(--lang-ink)]'

function HeroMedia({ entry, onZoom }: { entry: WorkEntry; onZoom?: () => void }) {
  if (entry.hero === 'video' && entry.heroVideo) {
    return (
      <div className="aspect-video overflow-hidden rounded-[var(--r-image)] border-[0.5px] border-[var(--lang-hairline)] bg-[color-mix(in_srgb,var(--lang-ink)_5%,transparent)]">
        <SheetVideo slug={entry.heroVideo.slug} name={entry.heroVideo.name} ariaLabel={entry.heroVideo.ariaLabel} />
      </div>
    )
  }
  if (entry.hero === 'live' && entry.live && entry.cover) {
    const wakes = /wakes/i.test(entry.live.label)
    // The scrim + launch stay fixed light-on-dark in BOTH modes: they sit on
    // the photograph, not on the ground, so mode tokens do not apply. The
    // launch is this hero's one action: no zoom competes with it.
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
    // The photo hero is itself media: it opens full size like every frame
    // (G1.1: "all media clickable to see as a bigger size").
    return (
      <button
        type="button"
        onClick={onZoom}
        aria-label={`View larger: ${entry.cover.alt}`}
        className="block aspect-video w-full cursor-zoom-in overflow-hidden rounded-[var(--r-image)] border-[0.5px] border-[var(--lang-hairline)] p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
      >
        <Img
          slug={entry.cover.slug}
          name={entry.cover.name}
          alt={entry.cover.alt}
          develop
          priority
          className="block h-full w-full object-cover"
        />
      </button>
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

// One spine beat: the quiet mono label over serif prose (the label grammar
// the sheets used, softened to the glass ink tokens).
function SpineBeat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="mt-4 first:mt-0">
      <h3 className="font-mono text-[9px] font-normal tracking-[0.12em] text-[var(--lang-ink-muted)]">
        {label}
      </h3>
      {children}
    </section>
  )
}

export default function WorkOverlay({ entry, onClose }: { entry: WorkEntry; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = `work-title-${entry.id}`
  const storyId = `work-story-${entry.id}`
  // THE STORY starts folded (G1.1 ruling): the closed sheet is pure proof.
  const [storyOpen, setStoryOpen] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)

  // The lightbox set: the photo hero leads it (it is media too); heroes that
  // are their own surface (video controls, the live launch, the pull-quote)
  // contribute nothing, so the set is just the strip.
  const zoomable: WorkPicture[] =
    entry.hero === 'photo' && entry.cover ? [entry.cover, ...entry.strip] : entry.strip
  const stripOffset = zoomable.length - entry.strip.length

  // Open as a true modal on mount (top layer, focus trap, background inert).
  // A LAYOUT effect since DL-1: react-router runs the route update inside
  // document.startViewTransition's flushSync, so the dialog must be [open]
  // synchronously for the new-state capture to see the morph target; a
  // passive effect would land after the capture and break the pair.
  // Escape is handled via the 'cancel' event, NOT 'close': the native 'close'
  // event is dispatched asynchronously, so under StrictMode the close() from
  // the first cleanup lands after the remount has reattached a listener and
  // fires a phantom close. 'cancel' only fires on real user dismissal (Escape),
  // never on a programmatic close(), so it survives the double-invoke. When
  // the Lightbox is stacked on top, Escape cancels THAT dialog instead (the
  // top layer routes it), so the sheet stays open underneath. The X and the
  // backdrop route through onClose directly (below).
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
      {/* The identity bar (G1.1): title + lens + award moved up here; the
          quiet number + status left the sheet (they live on in the registry
          and the Notebook). Award = recognition, ink, no box, never red
          (rule 1); the bar carries the short wording, the pill grammar of
          the card face. */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--lang-hairline)] px-5 py-2.5">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
          <h2 id={titleId} className="text-[17px] leading-tight font-semibold tracking-[-0.01em] text-[var(--lang-ink)]">
            {entry.title}
          </h2>
          <LensPill lens={entry.lens} />
          {entry.awardFace && (
            <span className="font-mono text-[9px] font-medium tracking-[0.1em] text-[var(--lang-ink)]">
              <span aria-hidden="true">✦ </span>
              {entry.awardFace}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close project"
          className="-my-1 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-[var(--r-pill)] font-mono text-[13px] leading-none text-[var(--lang-ink-muted)] transition-colors hover:text-[var(--lang-ink)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]"
        >
          ✕
        </button>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-7 sm:py-5">
        <HeroMedia entry={entry} onZoom={() => setLightbox(0)} />

        {/* The filmstrip: every supporting frame, sideways, each one a
            44px+ button into the Lightbox. */}
        {entry.strip.length > 0 && (
          <div className="no-scrollbar -mx-1 mt-2 flex gap-2 overflow-x-auto px-1 py-1" role="group" aria-label="Project pictures">
            {entry.strip.map((pic, i) => (
              <button
                key={pic.name}
                type="button"
                onClick={() => setLightbox(stripOffset + i)}
                aria-label={`View larger: ${pic.alt}`}
                className="block h-20 w-[106px] shrink-0 cursor-zoom-in overflow-hidden rounded-[var(--r-image)] border-[0.5px] border-[var(--lang-hairline)] p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
              >
                <Img slug={pic.slug} name={pic.name} alt={pic.alt} develop className="block h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* The claim (the signed dek) stays in the closed state: the sheet
            is never mute, even with the story folded. */}
        <p className="mt-3 max-w-[58ch] font-serif text-[16px] leading-snug text-[var(--lang-ink)]">
          {entry.dek}
        </p>

        {/* The tools row (mono, the quiet research accent). */}
        <div className="mt-3 font-mono text-[9px] tracking-[0.06em] text-[var(--lang-ink-muted)]">
          {entry.tech}
        </div>

        {/* GO DEEPER: the depth lives in the linked repo / blog / live app,
            not reproduced here (a portfolio, not a blog). */}
        {entry.links.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--lang-hairline)] pt-3 font-mono text-[10px] tracking-[0.1em]">
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
          </div>
        )}

        {/* THE STORY: the signed spine (WHAT · WHY · HOW · WHAT CAME OF IT),
            folded by default. Instant expand/collapse (no height ceremony:
            nothing to gate under reduced motion). */}
        <button
          type="button"
          onClick={() => setStoryOpen((o) => !o)}
          aria-expanded={storyOpen}
          aria-controls={storyId}
          className="mt-4 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--r-pill)] border-[0.5px] border-[var(--lang-hairline)] bg-transparent font-mono text-[10px] tracking-[0.12em] text-[var(--lang-ink-muted)] transition-colors hover:text-[var(--lang-ink)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]"
        >
          THE STORY
          <span aria-hidden="true" className="text-[9px]">
            {storyOpen ? '▲' : '▼'}
          </span>
        </button>
        {storyOpen && (
          <div id={storyId} className="mt-4 pb-1">
            <SpineBeat label="WHAT">
              <p className={`mt-1.5 ${PROSE}`}>{entry.what}</p>
            </SpineBeat>
            <SpineBeat label="WHY">
              <p className={`mt-1.5 ${PROSE}`}>{entry.why}</p>
            </SpineBeat>
            {entry.how && entry.how.length > 0 && (
              <SpineBeat label="HOW">
                <ol className={`mt-1.5 ${PROSE} list-decimal space-y-1 pl-5`}>
                  {entry.how.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </SpineBeat>
            )}
            {entry.outcome && (
              <SpineBeat label="WHAT CAME OF IT">
                <p className={`mt-1.5 ${PROSE}`}>{entry.outcome}</p>
              </SpineBeat>
            )}
          </div>
        )}
      </div>

      {lightbox !== null && zoomable.length > 0 && (
        <Lightbox
          pictures={zoomable}
          index={Math.min(lightbox, zoomable.length - 1)}
          onNavigate={setLightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </dialog>
  )
}
