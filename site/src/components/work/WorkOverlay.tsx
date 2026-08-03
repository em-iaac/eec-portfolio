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
//
// THE SPINE ARRIVES SEPARATELY (2026-08-03, the phone pass). WHAT / WHY / HOW /
// WHAT CAME OF IT, and the question dot's other questions, are no longer copied
// onto every WorkEntry at module scope: importing anything from data/work used
// to materialise all 21 projects' prose, so a phone on /cv or /rights was
// downloading 61.4KB of writing it could not reach. This sheet is the ONLY
// screen surface that reads them, so it asks for one project's spine by slug.
//
// TWO THINGS THE SPLIT REQUIRES, both load-bearing:
//   - `data-spine-ready` on the dialog. scripts/prerender.mjs waits on it
//     before snapshotting /work/:id, or the static page would ship the plate
//     without its prose and fail the MIN_BODY_WORDS floor. THE ATTRIBUTE IS A
//     CONTRACT, not a style: it is the same lesson as `data-route-hold`.
//   - the spine section renders NOTHING while it loads, never a skeleton. The
//     chunk is ~1KB and lands inside the sheet's own entrance; a placeholder
//     would be a second thing moving.
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import useScrollLock from '../../hooks/useScrollLock'
import { Link } from 'react-router-dom'
import { loadSpine, type ProjectSpine } from '../../content/projects'
import useSheetSwipe from './useSheetSwipe'
import useSwipeFlip from './useSwipeFlip'
import Img from '../Img'
import SheetVideo from '../sheet/SheetVideo'
import Lightbox from './Lightbox'
import QuestionsDot from './QuestionsDot'
import { LensPill } from '../ui/Pill'
import { vtName } from '../../lib/viewTransition'
import { PILLAR_PATH, isPillarRelated } from '../../lib/pillar'
import type { WorkEntry, WorkPicture } from '../../data/work'
import { INK_LINK, RED_LINK_ROW } from '../../lib/linkStyles'


// Compact serif for the two-column spine (tighter than the old single-column
// prose, so the whole plate fits without scrolling).
const PROSE = 'prose-rag font-serif text-small leading-[1.5] text-[var(--lang-ink)]'

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
  'absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-[var(--r-pill)] bg-[var(--lang-scrim-rest)] font-mono text-body leading-none text-white transition-colors hover:bg-[var(--lang-scrim-hover)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'

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
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[var(--lang-scrim-soft)]">
          <a
            href={page.live.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-[var(--r-pill)] border-[0.5px] border-white/70 bg-[var(--lang-scrim-faint)] px-5 font-mono text-nav tracking-[0.12em] text-white no-underline backdrop-blur-sm hover:bg-[var(--lang-scrim-rest)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
          >
            TRY IT LIVE &gt;<span className="sr-only"> (opens in new tab)</span>
          </a>
          {wakes && <span className="font-mono text-micro tracking-[0.1em] text-white/85">WAKES IN ~30S</span>}
        </div>
      </div>
    )
  }
  if (page.kind === 'audio') {
    return (
      <div className="flex h-full w-full flex-col justify-center bg-[color-mix(in_srgb,var(--lang-ink)_5%,transparent)] px-5 py-6 sm:px-7">
        <blockquote className="max-w-[40ch] font-serif text-prose leading-snug text-[var(--lang-ink)]">
          “{page.quote.text}”
        </blockquote>
        <p className="mt-3 font-mono text-micro tracking-[0.1em] text-[var(--lang-ink-muted)]">{page.quote.source}</p>
        <a
          href={page.audio.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-2 font-mono text-label tracking-[0.12em] ${RED_LINK_ROW}`}
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
      <h3 className="font-mono text-micro font-normal tracking-[0.12em] text-[var(--lang-ink-muted)]">{label}</h3>
      {children}
    </section>
  )
}

export default function WorkOverlay({ entry, onClose }: { entry: WorkEntry; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleId = `work-title-${entry.id}`
  // The page behind this sheet does not scroll while it is open
  // (hooks/useScrollLock.ts carries the why, and why containment was not
  // enough). Counted, so the Lightbox stacking over this holds its own.
  useScrollLock()
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
    // A MODAL FOCUSES ITS SUBJECT, NOT ITS CLOSE CONTROL (Emilie's ruling
    // 2026-08-04; her report: "the close button shows a red outline on tap").
    //
    // `showModal()` focuses the first focusable element in the dialog, and that
    // is the ✕ — measured, `document.activeElement` was the close button the
    // instant a project opened. WebKit's :focus-visible heuristic rings an
    // element the dialog focused, and the ring is `--lang-interaction`, the
    // site's red. Chromium does not paint it, which is why this only ever
    // showed on her phone.
    //
    // The fix is not to suppress the ring. Removing a focus ring for touch
    // removes it for the keyboard too, and that is a floor. Focus goes to the
    // TITLE instead: no control is focused so no control ring can appear, and a
    // screen reader now opens on the project's name rather than on the word
    // "Close". Tab still reaches ✕ and it still rings, exactly as before.
    titleRef.current?.focus({ preventScroll: true })
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

  const grabRef = useRef<HTMLDivElement>(null)
  useSheetSwipe(ref, grabRef, close)

  const stageRef = useRef<HTMLDivElement>(null)
  useSwipeFlip(stageRef, prevPage, nextPage, many)

  // One project's prose, fetched by slug when the sheet opens. `loadSpine`
  // caches, so re-opening the same project never refetches, and the guard
  // against a late resolve landing on a different project is `entry.slug`.
  const [spine, setSpine] = useState<ProjectSpine | null>(null)
  useEffect(() => {
    let live = true
    setSpine(null)
    loadSpine(entry.slug).then(
      (s) => {
        if (live) setSpine(s)
      },
      // A spine that fails to arrive must not take the plate down with it: the
      // asset, the claim, the credits and the links out are all still here.
      () => {},
    )
    return () => {
      live = false
    }
  }, [entry.slug])

  const spineBeats = spine && (
    <>
      <SpineBeat label="WHAT" beat="what">
        <p className={`mt-1.5 ${PROSE}`}>{spine.what}</p>
      </SpineBeat>
      <SpineBeat label="WHY" beat="why">
        <p className={`mt-1.5 ${PROSE}`}>{spine.why}</p>
      </SpineBeat>
      {spine.how && spine.how.length > 0 && (
        <SpineBeat label="HOW" beat="how">
          <ol className={`mt-1.5 ${PROSE} list-decimal space-y-1 pl-5`}>
            {spine.how.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </SpineBeat>
      )}
      {spine.outcome && (
        <SpineBeat label="WHAT CAME OF IT" beat="outcome">
          <p className={`mt-1.5 ${PROSE}`}>{spine.outcome}</p>
        </SpineBeat>
      )}
    </>
  )

  const hasLinks = isPillarRelated(entry.tags) || entry.links.length > 0

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      // The prerender contract: the snapshot must not be taken until the prose
      // is in the DOM (scripts/prerender.mjs, the /work/:id branch).
      data-spine-ready={spine ? '' : undefined}
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
          printed page); the close control floats the sheet's corner.

          THE GRAB BAND (2026-08-03, her ruling). On a phone the sheet is docked
          to the bottom and this strip is its handle: drag it down, or flick it,
          and the sheet goes. The short rule is the only thing the site draws
          that says "pull me", and it is drawn ONLY on the phone, because from
          `sm` up the plate is centred and there is nothing to pull it off.
          `touch-action: none` is load-bearing: without it the browser claims
          the vertical gesture for the page before the handler sees it. */}
      <div ref={grabRef} className="work-dialog__grab" aria-hidden="true">
        <span className="work-dialog__grip" />
      </div>
      <button
        type="button"
        onClick={close}
        aria-label="Close project"
        className="absolute top-2.5 right-2.5 z-10 flex size-11 items-center justify-center rounded-[var(--r-pill)] font-mono text-small leading-none text-[var(--lang-ink-muted)] transition-colors hover:text-[var(--lang-ink)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]"
      >
        ✕
      </button>

      {/* `overscroll-contain`: reaching the end of the sheet's own scroll must
          not hand the gesture to the page underneath it. Without it a flick
          through the story carries on into the grid behind the dialog, which is
          a page moving while you read something on top of it. */}
      {/* `grow`, NOT `flex-1` (2026-08-03, the strip bug, second attempt).
          `flex-1` is `flex: 1 1 0%`. In a column flex container with NO height
          of its own — and this dialog has none, only a max-height — the
          container's intrinsic height is computed from its items' contributions,
          and with a 0% basis plus `min-height: 0` the engines disagree about
          what this item contributes. Chromium uses its content height, which is
          why the sheet has always looked right here and in every desktop check.
          `grow` is `flex-grow: 1` with `flex-basis: auto`, so the item's
          contribution is unambiguously its content, and the container sizes to
          it in every engine. `min-h-0` stays: it is what lets this scroll once
          max-height caps the sheet. */}
      <div className="no-scrollbar min-h-0 grow overflow-y-auto overscroll-contain px-5 py-4 sm:px-7 sm:py-5">
        {/* THE TOP ROW: asset side + title/info side (the printed plate's
            head-beside-figure). Phones stack info first (T1: title › claim ›
            proof); desktop puts the asset left (sm:order-first). */}
        <div className={current ? 'grid grid-cols-1 gap-x-7 gap-y-4 sm:grid-cols-[1.05fr_1fr]' : ''}>
          <div className="pr-9 sm:pr-8">
            {/* tabIndex -1 so the sheet can land focus here on open (see the
                layout effect): programmatically focusable, never a tab stop. */}
            <h2
              ref={titleRef}
              tabIndex={-1}
              id={titleId}
              className="text-lead leading-tight font-semibold tracking-[-0.01em] text-[var(--lang-ink)] outline-none"
            >
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
                    className={`font-mono text-micro font-medium tracking-[0.1em] ${INK_LINK}`}
                  >
                    <span aria-hidden="true">✦ </span>
                    {entry.awardFace}
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                ) : (
                  <span className="font-mono text-micro font-medium tracking-[0.1em] text-[var(--lang-ink)]">
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
              <p className="mt-3.5 max-w-[48ch] font-serif text-prose leading-snug italic text-[var(--lang-ink)]">
                {entry.question}
                {spine?.alsoAnswers && spine.alsoAnswers.length > 0 && (
                  <>
                    {' '}
                    <QuestionsDot also={spine.alsoAnswers} dialogRef={ref} />
                  </>
                )}
              </p>
            )}
            <p className={`${entry.question ? 'mt-1.5' : 'mt-3.5'} max-w-[48ch] font-serif text-body leading-snug text-[var(--lang-ink)]`}>
              {entry.dek}
            </p>

            {/* The plate's meta credit row + the mono tech (+ stat) line. */}
            <p className="mt-3.5 font-mono text-micro tracking-[0.08em] text-[var(--lang-ink-muted)]">
              {entry.meta}
            </p>
            <p className="mt-1.5 font-mono text-micro tracking-[0.06em] text-[var(--lang-ink-muted)]">
              {entry.tech}
              {entry.stat && <span> · {entry.stat}</span>}
            </p>

            {/* THE LINKS, with the identity (her round-3 ruling): the pillar
                door first (internal), then the links OUT. The negative margin
                keeps the 44px hit boxes from inflating the row rhythm. */}
            {hasLinks && (
              <div className="mt-2 flex flex-wrap items-center gap-x-5 font-mono text-label tracking-[0.1em]">
                {isPillarRelated(entry.tags) && (
                  <Link to={PILLAR_PATH} viewTransition className={`-my-2 ${RED_LINK_ROW}`}>
                    BEHAVIOR INFORMATION MODELING ›
                  </Link>
                )}
                {entry.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={`-my-2 ${RED_LINK_ROW}`}>
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
              {/* `touch-action: pan-y` where the gallery can flip: this box owns
                  the horizontal gesture, the page keeps the vertical one, so a
                  sideways swipe and a scroll down are never the same act. It is
                  the belts' own rule, one surface over. */}
              <div
                ref={stageRef}
                style={many ? { touchAction: 'pan-y' } : undefined}
                className="relative aspect-video max-h-[46vh] w-full overflow-hidden rounded-[var(--r-image)] border-[0.5px] border-[var(--lang-hairline)] bg-white"
              >
                <StageContent page={current} onZoom={(i) => setLightbox(i)} />
                {many && (
                  <>
                    <button type="button" onClick={prevPage} aria-label="Previous picture" className={`${FLIP_BTN} left-2`}>
                      &lsaquo;
                    </button>
                    <button type="button" onClick={nextPage} aria-label="Next picture" className={`${FLIP_BTN} right-2`}>
                      &rsaquo;
                    </button>
                    <span className="absolute right-3 bottom-2 rounded-[var(--r-pill)] bg-[var(--lang-scrim-rest)] px-2.5 py-1 font-mono text-micro tracking-[0.1em] text-white">
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
