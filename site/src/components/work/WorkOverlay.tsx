// THE SHOWCASE (R2 card-on-top → DL-2 glass → G1 whole-page → S4a THE BOOK
// PLATE, Emilie's rulings in chat 2026-07-13, round 2): a glass-2 FLOATING
// SHEET lifted over the dimmed grid, deep-linkable at /work/:id, bottom sheet
// on phones. Mechanics unchanged: native <dialog>, URL-addressable, focus
// returned to the card by Work.tsx, the card-face morph on the dialog.
//
// S4a ROUND 2 (her pick over an A/B board: "the book plate" over the
// side-by-side split; first round's full-width thin stage retired — the
// asset was "too horizontal and thin"): the sheet now mirrors the printed
// plate (print/PrintBook.tsx) so card ⇄ showcase ⇄ book are ONE logic:
//   1. THE TOP ROW, divided in two like the printed page: the ASSET side
//      (left on desktop) is a tall 4:3 flip-through gallery — hero first
//      (video>live>photo>audio>text), then every supporting frame; ‹ ›
//      arrows flip, tapping a picture opens it full size in the Lightbox
//      (her pick: arrows flip, tap zooms). The TITLE/INFO side carries the
//      identity the old top bar held: title, lens + award, the claim (the
//      question slot when D4's discovery session fills it, then the signed
//      dek), the plate's meta credit row, the mono tech + stat line, and the
//      LINKS (pillar door + links out; her round-3 ruling: the links live
//      with the project identity, next to the asset — the foot retired).
//      Depth stays in the linked repo/blog (a portfolio, not a blog).
//   2. THE SPINE below, straight down in two wide columns (no "THE STORY"
//      collapse): WHAT · WHY · HOW · WHAT CAME OF IT.
// On phones the plate stacks: title/info, then the asset, then the story
// (T1 proof-first reading order), scrolling invisibly — a landscape plate
// honestly cannot fit a phone. Desktop stays everything-at-a-glance.
//
// ESCAPE (her round-3 report, reproduced live: this Chromium delivers the
// Escape keydown but never fires the native <dialog> 'cancel' close request,
// so Esc silently did nothing). Both dialogs now handle Escape themselves on
// keydown, peeling ONE layer per press: full-size picture › the plate › the
// grid. The 'cancel' listeners stay as the fallback for close requests that
// arrive WITHOUT a keydown (Android's back gesture), with a guard so the
// plate never closes underneath a stacked Lightbox.
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Img from '../Img'
import SheetVideo from '../sheet/SheetVideo'
import Lightbox from './Lightbox'
import QuestionsDot from './QuestionsDot'
import { LensPill } from '../ui/Pill'
import { vtName } from '../../lib/viewTransition'
import { PILLAR_PATH, isPillarRelated } from '../../lib/pillar'
import type { WorkEntry, WorkPicture } from '../../data/work'

const ACCENT_LINK =
  'text-[var(--lang-interaction)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'
// Text links wear a transparent >= 44px hit box (the touch floor, a FLOORS
// rule): the visible link stays a quiet mono line, the box does the catching.
const ROW_LINK = `inline-flex min-h-11 min-w-11 items-center ${ACCENT_LINK}`

// Compact serif for the two-column spine (tighter than the old single-column
// prose, so the whole plate fits without scrolling).
const PROSE = 'font-serif text-[13px] leading-[1.5] text-[var(--lang-ink)]'

// The stage's true rendered size (Emilie's quality pass, 2026-07-14): without
// this hint the browser assumed the Img default (~640px) and loaded the soft
// 640 rung on every retina screen. The stage runs ~480 CSS px on desktop and
// ~92vw in the phone bottom sheet, so retina now pulls the 1024/1600 rungs.
const STAGE_SIZES = '(max-width: 640px) 92vw, 480px'

// THE BULLETPROOF FIT (Emilie's final ruling, 2026-07-15, round 3): the
// stage is a 16:9 WHITE MAT and EVERY asset shows complete on it,
// object-contain, no exceptions (her earlier hybrid still shaved the edges
// off near-16:9 screenshots). The mat pins white in both modes like the
// printed book's paper: most assets are white-backed captures that blend
// seamlessly, and dark frames sit on it like plates in a book. 16:9-native
// media (and the pipeline-framed covers, image-manifest frame16x9) fills it
// exactly, so the mat only ever shows where an asset genuinely is not 16:9.

// The ‹ › page-turn buttons (shared style with the Lightbox nav).
const FLIP_BTN =
  'absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-[var(--r-pill)] bg-[rgba(11,14,19,0.55)] font-mono text-[15px] leading-none text-white transition-colors hover:bg-[rgba(11,14,19,0.8)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'

// ---- THE ASSET SIDE (the flip-through gallery) ----------------------------
// One page per piece of media: the hero first, then every supporting frame.
// Image pages open the Lightbox; the video/live/audio heroes are their own
// interactive surfaces and do not.
type MediaPage =
  | { kind: 'video'; video: NonNullable<WorkEntry['heroVideo']> }
  | { kind: 'live'; cover: WorkPicture; live: NonNullable<WorkEntry['live']> }
  | { kind: 'audio'; audio: NonNullable<WorkEntry['audio']>; quote: NonNullable<WorkEntry['pullQuote']> }
  | { kind: 'image'; pic: WorkPicture; imgIndex: number }

function buildPages(entry: WorkEntry): { pages: MediaPage[]; images: WorkPicture[] } {
  const pages: MediaPage[] = []
  const images: WorkPicture[] = []
  const pushImage = (pic: WorkPicture) => {
    pages.push({ kind: 'image', pic, imgIndex: images.length })
    images.push(pic)
  }
  if (entry.hero === 'video' && entry.heroVideo) pages.push({ kind: 'video', video: entry.heroVideo })
  else if (entry.hero === 'live' && entry.live && entry.cover)
    pages.push({ kind: 'live', cover: entry.cover, live: entry.live })
  // A montage cover (a reel of the strip) plays on the card face only; the
  // plate skips it and opens on the first real frame (2026-07-16).
  else if (entry.hero === 'photo' && entry.cover && !entry.coverMontage) pushImage(entry.cover)
  else if (entry.hero === 'audio' && entry.audio && entry.pullQuote)
    pages.push({ kind: 'audio', audio: entry.audio, quote: entry.pullQuote })
  for (const pic of entry.strip) pushImage(pic)
  return { pages, images }
}

function StageContent({ page, onZoom }: { page: MediaPage; onZoom: (imgIndex: number) => void }) {
  if (page.kind === 'video') {
    // Videos ALWAYS show whole (Emilie, 2026-07-15: a demo never loses its
    // edges to the crop); at the stage's own 16:9 that means most fill it
    // exactly and only wider-than-16:9 clips wear thin quiet bars.
    return (
      <SheetVideo
        slug={page.video.slug}
        name={page.video.name}
        ariaLabel={page.video.ariaLabel}
        fit="contain"
      />
    )
  }
  if (page.kind === 'live') {
    const wakes = /wakes/i.test(page.live.label)
    // The scrim + launch stay fixed light-on-dark in BOTH modes: they sit on
    // the photograph, not on the ground. The launch is this page's one action;
    // no zoom competes with it.
    return (
      <div className="relative h-full w-full">
        <Img slug={page.cover.slug} name={page.cover.name} alt={page.cover.alt} develop priority sizes={STAGE_SIZES} className="block h-full w-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[rgba(11,14,19,0.45)]">
          <a
            href={page.live.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-[var(--r-pill)] border-[0.5px] border-white/70 bg-[rgba(11,14,19,0.35)] px-5 font-mono text-[11px] tracking-[0.12em] text-white no-underline backdrop-blur-sm hover:bg-[rgba(11,14,19,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
          >
            TRY IT LIVE &gt;<span className="sr-only"> (opens in new tab)</span>
          </a>
          {wakes && <span className="font-mono text-[9px] tracking-[0.1em] text-white/85">WAKES IN ~30S</span>}
        </div>
      </div>
    )
  }
  if (page.kind === 'audio') {
    return (
      <div className="flex h-full w-full flex-col justify-center bg-[color-mix(in_srgb,var(--lang-ink)_5%,transparent)] px-5 py-6 sm:px-7">
        <blockquote className="max-w-[40ch] font-serif text-[17px] leading-snug text-[var(--lang-ink)]">
          “{page.quote.text}”
        </blockquote>
        <p className="mt-3 font-mono text-[9px] tracking-[0.1em] text-[var(--lang-ink-muted)]">{page.quote.source}</p>
        <a
          href={page.audio.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-2 font-mono text-[10px] tracking-[0.12em] ${ROW_LINK}`}
        >
          LISTEN ON SPOTIFY &gt;<span className="sr-only"> (opens in new tab)</span>
        </a>
      </div>
    )
  }
  // image: tap zooms (arrows flip — Emilie's pick)
  return (
    <button
      type="button"
      onClick={() => onZoom(page.imgIndex)}
      aria-label={`View larger: ${page.pic.alt}`}
      className="block h-full w-full cursor-zoom-in p-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
    >
      <Img slug={page.pic.slug} name={page.pic.name} alt={page.pic.alt} develop priority sizes={STAGE_SIZES} className="block h-full w-full object-contain" />
    </button>
  )
}

// One spine beat: the quiet mono label over serif prose. In the two-column
// spine it must not split across the column break (break-inside-avoid).
// `beat` anchors the section for the question dot's press-to-highlight
// (QuestionsDot looks up [data-beat] inside the dialog).
function SpineBeat({ label, beat, children }: { label: string; beat: string; children: ReactNode }) {
  return (
    <section data-beat={beat} className="mb-3 break-inside-avoid">
      <h3 className="font-mono text-[9px] font-normal tracking-[0.12em] text-[var(--lang-ink-muted)]">{label}</h3>
      {children}
    </section>
  )
}

export default function WorkOverlay({ entry, onClose }: { entry: WorkEntry; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = `work-title-${entry.id}`
  const [lightbox, setLightbox] = useState<number | null>(null)
  // The cancel listener is bound once (layout effect below) and must read the
  // CURRENT lightbox state, not its mount-time closure: a ref carries it.
  const lightboxRef = useRef(lightbox)
  lightboxRef.current = lightbox
  const [page, setPage] = useState(0)

  const { pages, images } = buildPages(entry)
  const many = pages.length > 1
  const current = pages[Math.min(page, pages.length - 1)]
  const prevPage = () => setPage((p) => (p - 1 + pages.length) % pages.length)
  const nextPage = () => setPage((p) => (p + 1) % pages.length)

  // Open as a true modal on mount (top layer, focus trap, background inert).
  // A LAYOUT effect since DL-1: react-router runs the route update inside
  // document.startViewTransition's flushSync, so the dialog must be [open]
  // synchronously for the new-state capture to see the morph target. Escape is
  // handled via 'cancel' (fires only on real user dismissal, so it survives
  // StrictMode's double-invoke and, when the Lightbox is stacked, cancels THAT
  // top dialog first, leaving the sheet open).
  useLayoutEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    if (!dlg.open) dlg.showModal()
    // The keydown-less fallback (Android back gesture): close the plate,
    // UNLESS the Lightbox is stacked on top — that close request is the
    // Lightbox's to consume, and the plate must stay open underneath.
    const onCancel = (e: Event) => {
      if (lightboxRef.current !== null) {
        e.preventDefault()
        return
      }
      onClose()
    }
    dlg.addEventListener('cancel', onCancel)
    return () => {
      dlg.removeEventListener('cancel', onCancel)
      if (dlg.open) dlg.close()
    }
    // entry.id keys a fresh open when the deep-linked card changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.id])

  const close = () => onClose()

  const spineBeats = (
    <>
      <SpineBeat label="WHAT" beat="what">
        <p className={`mt-1.5 ${PROSE}`}>{entry.what}</p>
      </SpineBeat>
      <SpineBeat label="WHY" beat="why">
        <p className={`mt-1.5 ${PROSE}`}>{entry.why}</p>
      </SpineBeat>
      {entry.how && entry.how.length > 0 && (
        <SpineBeat label="HOW" beat="how">
          <ol className={`mt-1.5 ${PROSE} list-decimal space-y-1 pl-5`}>
            {entry.how.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </SpineBeat>
      )}
      {entry.outcome && (
        <SpineBeat label="WHAT CAME OF IT" beat="outcome">
          <p className={`mt-1.5 ${PROSE}`}>{entry.outcome}</p>
        </SpineBeat>
      )}
    </>
  )

  const hasLinks = isPillarRelated(entry.tags) || entry.links.length > 0

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="work-dialog lang-glass-2"
      style={{ viewTransitionName: vtName(`/work/${entry.id}`) }}
      onClick={(e) => {
        if (e.target === ref.current) close()
      }}
      // Escape, handled here because this Chromium never delivers the native
      // 'cancel' close request (reproduced live; header comment). A stacked
      // Lightbox handles its own Escape FIRST and stops propagation, so this
      // only ever fires when the plate is the top layer.
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()
          close()
        }
      }}
    >
      {/* The plate has no top bar (the title lives beside the asset, like the
          printed page); the close control floats the sheet's corner. */}
      <button
        type="button"
        onClick={close}
        aria-label="Close project"
        className="absolute top-2.5 right-2.5 z-10 flex size-11 items-center justify-center rounded-[var(--r-pill)] font-mono text-[13px] leading-none text-[var(--lang-ink-muted)] transition-colors hover:text-[var(--lang-ink)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]"
      >
        ✕
      </button>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-7 sm:py-5">
        {/* THE TOP ROW: asset side + title/info side (the printed plate's
            head-beside-figure). Phones stack info first (T1: title › claim ›
            proof); desktop puts the asset left (sm:order-first). */}
        <div className={current ? 'grid grid-cols-1 gap-x-7 gap-y-4 sm:grid-cols-[1.05fr_1fr]' : ''}>
          <div className="pr-9 sm:pr-8">
            <h2 id={titleId} className="text-[21px] leading-tight font-semibold tracking-[-0.01em] text-[var(--lang-ink)]">
              {entry.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <LensPill lens={entry.lens} />
              {entry.awardFace &&
                (entry.awardHref ? (
                  <a
                    href={entry.awardHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[9px] font-medium tracking-[0.1em] text-[var(--lang-ink)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]"
                  >
                    <span aria-hidden="true">✦ </span>
                    {entry.awardFace}
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                ) : (
                  <span className="font-mono text-[9px] font-medium tracking-[0.1em] text-[var(--lang-ink)]">
                    <span aria-hidden="true">✦ </span>
                    {entry.awardFace}
                  </span>
                ))}
            </div>

            {/* THE CLAIM: the question slot (D4) over the signed dek — the
                site asks, then answers. The dot (Emilie, 2026-07-14) reveals
                the other questions the project answers; pressing one lights
                the spine section that holds the answer. */}
            {entry.question && (
              <p className="mt-3.5 max-w-[48ch] font-serif text-[16px] leading-snug italic text-[var(--lang-ink)]">
                {entry.question}
                {entry.alsoAnswers && entry.alsoAnswers.length > 0 && (
                  <>
                    {' '}
                    <QuestionsDot also={entry.alsoAnswers} dialogRef={ref} />
                  </>
                )}
              </p>
            )}
            <p className={`${entry.question ? 'mt-1.5' : 'mt-3.5'} max-w-[48ch] font-serif text-[14.5px] leading-snug text-[var(--lang-ink)]`}>
              {entry.dek}
            </p>

            {/* The plate's meta credit row + the mono tech (+ stat) line. */}
            <p className="mt-3.5 font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink-muted)]">
              {entry.meta}
            </p>
            <p className="mt-1.5 font-mono text-[9px] tracking-[0.06em] text-[var(--lang-ink-muted)]">
              {entry.tech}
              {entry.stat && <span> · {entry.stat}</span>}
            </p>

            {/* THE LINKS, with the identity (her round-3 ruling): the pillar
                door first (internal), then the links OUT. The negative margin
                keeps the 44px hit boxes from inflating the row rhythm. */}
            {hasLinks && (
              <div className="mt-2 flex flex-wrap items-center gap-x-5 font-mono text-[10px] tracking-[0.1em]">
                {isPillarRelated(entry.tags) && (
                  <Link to={PILLAR_PATH} viewTransition className={`-my-2 ${ROW_LINK}`}>
                    BEHAVIOR INFORMATION MODELING ›
                  </Link>
                )}
                {entry.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={`-my-2 ${ROW_LINK}`}>
                    {/* A live deployment wears the liveness dot (Emilie,
                        2026-07-15: clearer than words; red = liveness,
                        governance rule 1). */}
                    {/\blive\b/i.test(l.label) && (
                      <span aria-hidden="true" className="mr-1.5 inline-block size-1.5 rounded-full bg-[var(--lang-interaction)]" />
                    )}
                    {l.label}
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* THE ASSET SIDE: a 16:9 WHITE MAT (Emilie's bulletproof ruling,
              2026-07-15): every asset shows whole on the plate's paper, like
              the printed book. The mat pins white in both modes on purpose
              (a content surface, not chrome; same family as the print pin). */}
          {current && (
            <div className="sm:order-first">
              <div className="relative aspect-video max-h-[46vh] w-full overflow-hidden rounded-[var(--r-image)] border-[0.5px] border-[var(--lang-hairline)] bg-white">
                <StageContent page={current} onZoom={(i) => setLightbox(i)} />
                {many && (
                  <>
                    <button type="button" onClick={prevPage} aria-label="Previous picture" className={`${FLIP_BTN} left-2`}>
                      &lsaquo;
                    </button>
                    <button type="button" onClick={nextPage} aria-label="Next picture" className={`${FLIP_BTN} right-2`}>
                      &rsaquo;
                    </button>
                    <span className="absolute right-3 bottom-2 rounded-[var(--r-pill)] bg-[rgba(11,14,19,0.55)] px-2.5 py-1 font-mono text-[9px] tracking-[0.1em] text-white">
                      {Math.min(page, pages.length - 1) + 1} / {pages.length}
                    </span>
                  </>
                )}
              </div>
              {/* The dot row retired (G-FLUFF, Emilie 2026-07-14): with the
                  fuller galleries the counter + arrows carry the job alone. */}
            </div>
          )}
        </div>

        {/* THE SPINE, straight down in two book columns (no collapse; balanced
            CSS columns pack tighter than a grid, so the plate fits without
            scrolling). Each beat avoids splitting across the column break.
            (The links left the foot for the info side, her round-3 ruling.) */}
        <div className="mt-4 sm:[column-gap:2.25rem] sm:[columns:2]">
          {spineBeats}
        </div>
      </div>

      {lightbox !== null && images.length > 0 && (
        <Lightbox
          pictures={images}
          index={Math.min(lightbox, images.length - 1)}
          onNavigate={setLightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </dialog>
  )
}
