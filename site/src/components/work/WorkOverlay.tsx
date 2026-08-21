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
//      identity the old top bar held: the ONE-LINE IDENTITY (title + lens +
//      award on the first line; her ruling on the mocked options, 2026-08-20),
//      the claim (the question slot when D4's discovery session fills it,
//      then the signed dek), the TEAM/STACK/PROOF facts grid (same ruling:
//      the meta row and the tech + stat line, each anchored to a label), and
//      the LINKS (pillar door + links out; her round-3 ruling: the links live
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
import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import useScrollLock from '../../hooks/useScrollLock'
import useHasHover from '../../hooks/useHasHover'
import { Link, useNavigate } from 'react-router-dom'
import { LENSES } from '../Lens'
import { WORK_ARTIFACTS } from './artifacts'
import { neighborsOf, relatedThoughts } from './neighbors'
import type { CSSProperties } from 'react'
import { loadSpine, type ProjectSpine } from '../../content/projects'
import useSheetSwipe from './useSheetSwipe'
import useSheetPage from './useSheetPage'
import useSwipeFlip from './useSwipeFlip'
import Img from '../Img'
import SheetVideo from '../sheet/SheetVideo'
import Lightbox from './Lightbox'
import QuestionsDot from './QuestionsDot'
import { vtName } from '../../lib/viewTransition'
import { PILLAR_PATH, isPillarRelated } from '../../lib/pillar'
import type { WorkEntry, WorkPicture } from '../../data/work'
import { RED_LINK_ROW } from '../../lib/linkStyles'


// Compact serif for the two-column spine (tighter than the old single-column
// prose, so the whole plate fits without scrolling).
const PROSE = 'prose-rag font-serif text-small leading-[1.5] text-[var(--lang-ink)]'

// THE PLATE SCALE (Emilie's rulings 2026-08-20, closing the plate-size
// question). Round one built a seven-step ladder from the measured clusters;
// her second ruling shrank it to the floor: "I want the least possible plate
// scales", with the cappelletti/podcast merge (~90px of absorbed air) as the
// worked example of how much air a merge may add. A plate wears the
// SMALLEST SIZE THAT HOLDS ITS WORDS; the optical mount absorbs the air at
// the foot.
// RE-CENSUSED 2026-08-21 (the fill-the-spines round: every project now
// carries all four beats except the podcast, whose no-HOW ruling stands).
// The three bootcamp minis grew off the S shelf entirely (astroidal 776,
// chair-sim 717, playscape 717) and encounter joined the tall band (737),
// which left S holding exactly two plates: cappelletti 596 and podcast 608.
// Two plates do not earn a step of their own when her worked tolerance is
// ~90px of air and the merge costs at most 82 (cappelletti at 678). So the
// ladder is TWO sizes now, the least it has ever been:
//   M 678  the short-through-middle band, 12   (natural 596..678, air <=82)
//   L 796  the tall band, 9                    (natural 713..795, air <=83)
// Measured all 21 at 1464px against the live build; the seam is real: 35px
// of empty between 678 (huddle) and 713 (homage), nothing inside it. Never
// patch one step: any head or spine change moves all 21 naturals — re-census
// and re-cluster.
// Runtime snap, not per-project data: a narrower viewport wraps the words
// taller and the same ladder re-assigns honestly, and a future project needs
// no authoring — it finds its shelf. Capped by the dialog's own max-height
// (min-height would otherwise outrank it and push past the viewport).
const PLATE_STEPS = [678, 796]

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
  // MOUNT AND UNMOUNT ONLY — never per project (the flash root cause, caught
  // frame-by-frame in her recording at the tweak round, 2026-08-20). This
  // effect used to depend on [entry.id], and an effect's CLEANUP runs before
  // its re-run: so every press of the new rails closed the dialog (the
  // ::backdrop vanished — one naked bright frame, "the header shows"), then
  // showModal() reopened it and the backdrop's own 260ms work-fade replayed
  // ("...and then disappears"). Measured on the screencast: probe pixel 218
  // (dimmed) → 252 (naked page) at the press, one showModal call mid-swap.
  // Un-keying the component (Work.tsx) was necessary but not sufficient —
  // the close lived HERE. Paging projects now touches neither open state nor
  // the backdrop; the per-project work (focus, page/lightbox/drawer/scroll
  // resets) lives in the entry.id effect below.
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  useLayoutEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    if (!dlg.open) dlg.showModal()
    // The keydown-less fallback (Android back gesture): close the plate,
    // UNLESS the Lightbox is stacked on top — that close request is the
    // Lightbox's to consume, and the plate must stay open underneath.
    // (onClose rides a ref so this once-bound listener never goes stale.)
    const onCancel = (e: Event) => {
      if (lightboxRef.current !== null) {
        e.preventDefault()
        return
      }
      onCloseRef.current()
    }
    dlg.addEventListener('cancel', onCancel)
    return () => {
      dlg.removeEventListener('cancel', onCancel)
      if (dlg.open) dlg.close()
    }
  }, [])

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

  const hasLinks = entry.links.length > 0

  // THE NEIGHBORHOOD (her mix of the felt mockups, 2026-08-20: "d2 rails with
  // d1 drawer for thoughts"). Rails leaf the gallery on desktop; the drawer
  // holds MADE ME THINK OF everywhere, plus the travel row below lg where the
  // rails have no room. All record data — components/work/neighbors.ts.
  const navigate = useNavigate()
  const neighbors = neighborsOf(entry.id)
  const related = relatedThoughts(entry.id)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const hasHover = useHasHover()
  // The system's dismissal grammar (ReachDrawer verbatim): an open drawer
  // closes on a press anywhere outside it — before this, a touch device had
  // only the tab itself as the way out.
  useEffect(() => {
    if (!drawerOpen) return
    const onDown = (e: PointerEvent) => {
      if (!drawerRef.current?.contains(e.target as Node)) setDrawerOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [drawerOpen])
  // NO view transition on sheet-to-sheet travel (her flash report, the tweak
  // round): the dialog stays open and swaps its content in place (Work.tsx
  // dropped the remount key), so there is nothing for a transition to carry —
  // the backdrop holds, only the project changes. Paging, not travelling.
  const goTo = (id: string) => {
    setDrawerOpen(false)
    // REPLACE, not push. Paging is one open sheet changing its subject, not a
    // trail of visits: pushed entries meant close's navigate(-1) landed on
    // the PREVIOUS PROJECT instead of the page the sheet was opened over
    // (and Back had to walk every paged project to get out). With replace,
    // history stays [origin, /work/<current>] however far she leafs — close
    // and Back both return to where she actually was.
    navigate(`/work/${id}`, { replace: true })
  }
  // SWIPE TO PAGE (her ask 2026-08-21): below sm the drawer's PREVIOUS/NEXT
  // rows are gone and the sheet itself answers a sideways drag — the media
  // stage is excluded (a drag there flips pictures), and the pager rides a
  // ref so paging's own re-render never re-binds listeners mid-gesture.
  const pagerRef = useRef<{ prev: () => void; next: () => void } | null>(null)
  pagerRef.current = neighbors
    ? { prev: () => goTo(neighbors.prev.id), next: () => goTo(neighbors.next.id) }
    : null
  useSheetPage(ref, stageRef, pagerRef)
  // The un-keyed swap keeps this component mounted across projects, so the
  // per-project state resets here instead of by remount: first media page,
  // no stacked lightbox, drawer shut, story scrolled back to the top.
  // The plate finds its shelf on the scale (PLATE_STEPS above): measure the
  // natural height, snap up to the smallest step that holds it. Layout
  // effect, so the snap lands before paint — no visible resize. Re-runs when
  // the project changes AND when the spine prose arrives (the words are most
  // of the height), on resize (wrapping changes the words' height), and once
  // when the fonts finish loading (a late swap re-wraps a line or two).
  // Desktop only: the phone bottom sheet docks and sizes as it always has.
  useLayoutEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    const mq = window.matchMedia('(min-width: 40rem)')
    const fit = () => {
      dlg.style.minHeight = ''
      if (!mq.matches) return
      const natural = dlg.getBoundingClientRect().height
      const cap = Math.min(0.92 * window.innerHeight, 54 * 16)
      const step = PLATE_STEPS.find((s) => s >= natural - 0.5)
      if (step && step <= cap) dlg.style.minHeight = `${step}px`
    }
    fit()
    window.addEventListener('resize', fit)
    let live = true
    document.fonts?.ready.then(() => {
      if (live) fit()
    })
    return () => {
      live = false
      window.removeEventListener('resize', fit)
      dlg.style.minHeight = ''
    }
  }, [entry.id, spine])

  const scrollerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setPage(0)
    setLightbox(null)
    setDrawerOpen(false)
    scrollerRef.current?.scrollTo(0, 0)
    // A MODAL FOCUSES ITS SUBJECT, NOT ITS CLOSE CONTROL (Emilie's ruling
    // 2026-08-04; her report: "the close button shows a red outline on tap").
    // showModal() would focus the first focusable — the ✕ — and WebKit rings
    // it red. Focus lands on the TITLE instead: a screen reader opens on the
    // project's name, not on the word "Close", and on every rail press the
    // new project announces itself the same way. Tab still reaches ✕.
    titleRef.current?.focus({ preventScroll: true })
  }, [entry.id])
  // A thought row's destination: the note — except the pillar's own coinage on
  // a pillar-related project, which keeps opening the flagship essay (the
  // internal door the searchability pass built; it moved here from the links
  // row, it did not die).
  const thoughtRoute = (t: { id: string; route: string }) =>
    t.id === 'bim' && isPillarRelated(entry.tags) ? PILLAR_PATH : t.route

  return (
    <>
      {/* THE VEIL (her report 2026-08-21): the blur behind the sheet, moved
          out of ::backdrop because the minifier shipped that rule's blur as
          -webkit- only (iOS blurred, Chrome did not — see index.css). The
          blur is THIS Tailwind utility: its var()-chained output survives
          the build where a raw backdrop-filter pair does not. The sibling
          stays in the page, under the top layer; the ::backdrop keeps the
          scrim above it. Mounts and unmounts with the sheet, takes no
          pointer (index.css .work-veil). */}
      <div className="work-veil backdrop-blur-[10px]" aria-hidden="true" />
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      // The prerender contract: the snapshot must not be taken until the prose
      // is in the DOM (scripts/prerender.mjs, the /work/:id branch).
      data-spine-ready={spine ? '' : undefined}
      // NO GLASS ON THE SHEET (Emilie, 2026-08-06): "I don't want them to have
      // any type of glass or blur transparency because I want things to be
      // easily readable, right now sometimes it's not readable, it's too messy
      // especially the dark." `lang-glass-2` is gone; .work-dialog paints a
      // solid surface in both modes (index.css).
      className="work-dialog"
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
          // One layer per press, the house rule: an open drawer panel is the
          // top layer even when focus never entered it (hover opens it with
          // focus still on the title), so the check lives HERE, not on the
          // drawer — measured: without it, Escape over an open panel closed
          // the whole sheet.
          if (drawerOpen) {
            setDrawerOpen(false)
            return
          }
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
      {/* THE DISC (Emilie's ruling 2026-08-20, the moving-parts audit): the
          sheet scrolls and the ✕ floats, so scrolled prose used to slide
          under a bare glyph. A quiet solid ground — the dialog's own surface
          with its hairline, same family as the flip buttons — means the words
          slide under a control, not a stray character. Solid, not glass:
          the sheet itself dropped blur on 2026-08-06 for readability. */}
      <button
        type="button"
        onClick={close}
        aria-label="Close project"
        className="absolute top-2.5 right-2.5 z-10 flex size-11 items-center justify-center rounded-[var(--r-pill)] border-[0.5px] border-[var(--lang-hairline)] bg-[var(--lang-glass-2-solid)] font-mono text-small leading-none text-[var(--lang-ink-muted)] transition-colors hover:text-[var(--lang-ink)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]"
      >
        ✕
      </button>

      {/* THE RAILS (D2 of the felt mockups, her mix ruling 2026-08-20; the
          arrows became the neighbors' own plate drawings at her tweak the
          same day — "the icons of each project i think its more fun"). Each
          rail is the next project's ink artifact in a disc, its lens pen as
          the one accent, the name printed beneath — a press is never a
          surprise, and the gallery pages like leafing the printed index.
          Desktop only (min-1200px: below that the viewport gutter is narrower
          than a rail, and the drawer's travel row carries the job).
          position: fixed ESCAPES the dialog's overflow clip (the entrance
          animations hold no transform, so the containing block stays the
          viewport); as dialog children they stay interactive in the top
          layer. /work reading order, wrapping like the belts. */}
      {neighbors && (
        <>
          {(
            [
              { n: neighbors.prev, side: 'left-4 xl:left-8', word: 'Previous' },
              { n: neighbors.next, side: 'right-4 xl:right-8', word: 'Next' },
            ] as const
          ).map(({ n, side, word }) => (
            <button
              key={word}
              type="button"
              onClick={() => goTo(n.id)}
              className={`group fixed top-1/2 z-10 hidden w-24 -translate-y-1/2 flex-col items-center gap-2 min-[1200px]:flex ${side}`}
            >
              {/* size-18 (her second sizing pass, 2026-08-20 night: "even
                  larger... stroke and artifacts too small" — 14 → 16 → 18)
                  with the --rail stroke grade: the artifacts draw with
                  non-scaling strokes tuned for the card plates, so at disc
                  scale the geometry shrank while the ink stayed plate-thick
                  and the drawings clotted. The modifier re-grades the
                  strokes to the disc's own scale (language.css). */}
              <span
                aria-hidden="true"
                className="flex size-18 items-center justify-center rounded-[var(--r-pill)] border-[0.5px] border-[var(--lang-hairline)] bg-[var(--lang-glass-2-solid)] p-1.5 transition-transform group-hover:scale-105"
                style={{ '--plate-accent': LENSES[n.lens].pen } as CSSProperties}
              >
                <span className="work-art work-art--rail">{WORK_ARTIFACTS[n.id]}</span>
              </span>
              <span className="text-center font-mono text-micro leading-snug tracking-[0.1em] text-white/85 uppercase">
                {n.faceTitle ?? n.title}
              </span>
              <span className="sr-only">
                {word} project: {n.title}
              </span>
            </button>
          ))}
        </>
      )}

      {/* THE DRAWER (D1 of the felt mockups, thoughts only on desktop — the
          rails carry travel there; below lg the panel gains the travel row).
          The tab rides the sheet's right edge, the reach-drawer grammar every
          other room teaches; hover opens it where a pointer exists, press
          everywhere. The panel opens INWARD over the sheet's edge — the
          dialog's overflow clips anything outside it — on the sheet's own
          solid surface. Its rows are the record's correlations
          (neighbors.ts), so a project with no written threads simply has no
          tab. The word on the tab is hers ("maybe links?", 2026-08-20) — see
          the report note on the word vs the contents.
          Escape closes the PANEL first (stopPropagation), then the sheet —
          one layer per press, the house rule. */}
      {related.length > 0 && (
        <div
          // MID-HEADER, OPENING INTO THE BLUR (her second tweak, 2026-08-20:
          // "middle height of the header section... opens outside the card
          // in the blur area so it doesn't hide anything"). The tab centers
          // on the header row — stage pad 20px + 279/2 ≈ 160, minus half the
          // 112px tab = top 104 — and clears the floating ✕ above it. The
          // PANEL left the sheet: position: fixed escapes the dialog's
          // overflow clip exactly the way the rails do (no ancestor
          // transform), so it floats in the backdrop instead of covering the
          // head. Its right edge rides the viewport (1rem in) until the
          // gutter outgrows it, then rides the sheet's edge with a 1rem
          // kiss — never detached, so the tab→panel hover path stays
          // contiguous and pointerleave cannot fire crossing a gap.
          ref={drawerRef}
          // THE WRAPPER OWNS THE TAB'S BOX (her recording, 2026-08-20:
          // "hover not all the way to the right and it bugs and lags").
          // The tab display:nones itself when the drawer opens, and an
          // auto-sized wrapper collapsed to zero under the pointer — so a
          // cursor on the tab's LEFT half fired pointerleave the instant
          // the drawer opened, closed it, the tab reappeared, pointerenter
          // reopened it: an oscillation, her lag. A fixed 44×112 box keeps
          // the hover ground under the pointer whether the tab is drawn.
          className="absolute top-[104px] right-0 z-10 h-28 w-11"
          onPointerEnter={(e) => {
            if (hasHover && e.pointerType === 'mouse') setDrawerOpen(true)
          }}
          onPointerLeave={() => {
            if (hasHover) setDrawerOpen(false)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && drawerOpen) {
              e.preventDefault()
              e.stopPropagation()
              setDrawerOpen(false)
            }
          }}
        >
          {/* THE REACH GRAMMAR, ADOPTED (her system note, 2026-08-20: "the
              drawer system should be a system in the whole app... the same
              here and on the cv"). This drawer was the app's one hand-rolled
              outlier; the tab and every row now speak components/reach's
              language: the 44px tab width (the sweep's floor, not 28), the
              12px tab radius, `reach-drawer__row` boxes with the system's
              hover wash (the red highlight the map's year rows taught),
              PREVIOUS/NEXT as verb rows exactly like a thought note's exit
              drawer. It cannot BE <ReachDrawer/> — a modal dialog inerts the
              page, so the drawer must live inside the dialog's DOM, and its
              float-in-the-blur placement is this sheet's own ruling — so it
              is the system's grammar in the sheet's geometry: an EXIT drawer
              (rows lead out of the room; no `at`, the tab keeps its handle). */}
          <button
            type="button"
            aria-expanded={drawerOpen}
            aria-controls="sheet-drawer-panel"
            aria-label="The thoughts this project made"
            onClick={() => setDrawerOpen((o) => !o)}
            className={`h-28 w-11 items-center justify-center rounded-l-xl border-[0.5px] border-r-0 border-[var(--lang-hairline)] bg-[var(--lang-glass-2-solid)] text-[var(--lang-ink-muted)] transition-colors hover:text-[var(--lang-ink)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)] ${drawerOpen ? 'hidden' : 'flex'}`}
          >
            <span
              aria-hidden="true"
              className="font-mono text-micro tracking-[0.2em] uppercase"
              style={{ writingMode: 'vertical-rl' }}
            >
              {/* Her word, second round (2026-08-20): THOUGHTS — the tab names
                  what the panel actually holds. (LINKS, her first tentative
                  word, lasted one look at the built thing.) */}
              THOUGHTS
            </span>
          </button>
          <div
            id="sheet-drawer-panel"
            // fixed + top:auto = the static position's top (the wrapper's own
            // line), horizontal from the right formula above. Full border +
            // all corners rounded: a floating panel, not an attached flap.
            className={`fixed right-[max(1rem,calc((100vw_-_66rem)/2_-_14rem))] w-60 rounded-xl border-[0.5px] border-[var(--lang-hairline)] bg-[var(--lang-glass-2-solid)] p-[5px] shadow-[0_10px_30px_rgba(11,14,19,0.35)] ${drawerOpen ? '' : 'hidden'}`}
          >
            {/* THE TRAVEL ROWS ARE GONE FOR GOOD (her ask 2026-08-21: "the
                thoughts drawer is just for thoughts now"). They lived here
                one day: first everywhere below 1200, then only sm..1200 once
                the phone learned to swipe. Now travel is the rails from
                1200 up and the sideways swipe below it (useSheetPage's gate
                widened to match) — the drawer holds only what its tab says. */}
            <p className="px-[11px] pt-1.5 pb-1 font-mono text-[9px] tracking-[0.18em] text-[var(--lang-ink-muted)] uppercase">
              Made me think of
            </p>
            <ul className="list-none">
              {related.map((t) => (
                <li key={t.id}>
                  <Link
                    to={thoughtRoute(t)}
                    viewTransition
                    className="reach-drawer__row reach-drawer__row--title w-full no-underline"
                  >
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

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
      <div ref={scrollerRef} className="no-scrollbar min-h-0 grow overflow-y-auto overscroll-contain px-5 py-4 sm:px-7 sm:py-5">
        {/* THE TOP ROW: asset side + title/info side (the printed plate's
            head-beside-figure). Phones stack info first (T1: title › claim ›
            proof); desktop puts the asset left (sm:order-first). */}
        <div className={current ? 'grid grid-cols-1 gap-x-7 gap-y-4 sm:grid-cols-[1.05fr_1fr]' : ''}>
          <div className="flex flex-col pr-9 sm:pr-8">
            {/* THE FILE CARD (her C ruling off the head-composition board,
                2026-08-20, closing the head's third round — measured first:
                the old stack ended 63–127px above the asset's foot with every
                internal gap 10–16px, all the air pooled invisibly below).
                The kicker line is GONE, structurally, not cosmetically: the
                title takes the first line, the question breathes under it,
                and the lens pill + award become the LEDGER's first rows
                (TYPE · AWARD · TEAM · STACK), pinned with the links to the
                asset's baseline by mt-auto. The air is now one deliberate
                band in the middle of the column — it grows on short projects,
                shrinks on long ones, and the links always land on the same
                ground line as the asset. The award got QUIETER (a grid row,
                never louder — its ceiling holds). On phones the column takes
                its natural height, mt-auto collapses, and pt-4 keeps the old
                rhythm — the anchor logic only exists where the head stands
                beside the asset.
                tabIndex -1 on the title so the sheet can land focus there on
                open: programmatically focusable, never a tab stop. */}
            <h2
              ref={titleRef}
              tabIndex={-1}
              id={titleId}
              className="text-title leading-tight font-semibold tracking-[-0.01em] text-[var(--lang-ink)] outline-none max-sm:text-[26px]"
            >
              {entry.title}
            </h2>

            {/* THE CLAIM: the question slot (D4) over the signed dek — the
                site asks, then answers. The dot (Emilie, 2026-07-14) reveals
                the other questions the project answers; pressing one lights
                the spine section that holds the answer. */}
            {/* THE DOT RIDES THE LAST WORD (2026-08-20, caught on Playscape's
                plate: the dot wrapped to its own line under the question). An
                nbsp cannot fix this one — CSS line-breaking allows a wrap
                before an atomic inline (the dot is a button) no matter what
                character precedes it — so the question's last word and the
                dot share a nowrap span and travel together. Same words. */}
            {entry.question && (
              <p className="mt-3 max-w-[48ch] font-serif text-prose leading-snug italic text-[var(--lang-ink)]">
                {spine?.alsoAnswers && spine.alsoAnswers.length > 0 && entry.question.includes(' ')
                  ? entry.question.slice(0, entry.question.lastIndexOf(' ') + 1)
                  : entry.question}
                {spine?.alsoAnswers && spine.alsoAnswers.length > 0 && (
                  <span className="whitespace-nowrap">
                    {entry.question.includes(' ')
                      ? entry.question.slice(entry.question.lastIndexOf(' ') + 1)
                      : ''}
                    {' '}
                    <QuestionsDot also={spine.alsoAnswers} dialogRef={ref} />
                  </span>
                )}
              </p>
            )}
            {/* THE PHRASE LEFT THE HEAD (her instinct, the head-air board,
                2026-08-20: "remove the phrase and only keep the question").
                The dek stays signed data — the OG description, the book's
                index page and the CV still read it — the head just stopped
                saying the answer before the reader asked. */}

            {/* THE LEDGER (the File Card's rows; PROOF stayed out — the stat
                survives in the record, off the head).
                MARKS OUT, CASE IN (her tick-value refinement, 2026-08-20:
                one row had a square, one a star, two nothing — "either
                remove those or add something before team and stack", and
                caps labels want non-caps values "to differentiate"). So NO
                glyphs anywhere — the pill and the ✦ left the table (both
                live on elsewhere: card faces, filters, the book's
                recognition pages) — and the case split IS the system:
                labels CAPS-and-tracked, values lowercase, one mono voice
                from the container. The linked award keeps the CV's
                quiet-door grammar (dashed line + red hover), inheriting the
                ledger's color. */}
            <div className="mt-auto grid grid-cols-[auto_1fr] items-baseline gap-x-3.5 gap-y-1 pt-4 font-mono text-micro tracking-[0.08em] text-[var(--lang-ink-muted)]">
              {/* The FULL lens name, like the book's plate (her note,
                  2026-08-20: the grid has room the pill never had). */}
              <span className="text-[0.85em] tracking-[0.15em] opacity-70">TYPE</span>
              <span className="lowercase">{LENSES[entry.lens].label}</span>
              {entry.awardFace && (
                <>
                  <span className="text-[0.85em] tracking-[0.15em] opacity-70">AWARD</span>
                  {entry.awardHref ? (
                    <a
                      href={entry.awardHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative lowercase underline decoration-dashed decoration-1 decoration-[var(--lang-ink-muted)] underline-offset-4 transition-colors hover:text-[var(--lang-interaction)] hover:decoration-[var(--lang-interaction)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
                    >
                      {entry.awardFace}
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  ) : (
                    <span className="lowercase">{entry.awardFace}</span>
                  )}
                </>
              )}
              <span className="text-[0.85em] tracking-[0.15em] opacity-70">TEAM</span>
              <span className="lowercase">{entry.meta}</span>
              <span className="text-[0.85em] tracking-[0.15em] opacity-70">STACK</span>
              <span className="lowercase">{entry.tech}</span>
              {/* LINKS IS THE FIFTH ROW (her C ruling off the six real
                  mockups, 2026-08-20): the doors joined the record. The
                  ledger's own typeface, lowercase like every value, RED as
                  the only signal — no dot, no underline at rest (hover
                  underlines, the focus ring stays; -m-2 p-2 is the sanctioned
                  quiet-context hit pad, QUIET_LINK_TAP's own). The head is
                  three things now: name, question, record. */}
              {hasLinks && (
                <>
                  <span className="text-[0.85em] tracking-[0.15em] opacity-70">LINKS</span>
                  {/* Middots BETWEEN the doors (her touch-up, 2026-08-20):
                      the row separates like STACK's value does. The dots
                      inherit the ledger's muted voice — they are punctuation,
                      not pressable, so they never wear the red. */}
                  <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                    {entry.links.map((l, i) => (
                      <Fragment key={l.href}>
                        {i > 0 && <span aria-hidden="true">·</span>}
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="-m-2 p-2 lowercase text-[var(--lang-interaction)] no-underline underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]"
                        >
                          {l.label}
                          <span className="sr-only"> (opens in new tab)</span>
                        </a>
                      </Fragment>
                    ))}
                  </span>
                </>
              )}
            </div>
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
                    {/* On a VIDEO page the counter rides top-right (Emilie's
                        green light 2026-08-20): bottom-right sat on the
                        native control bar and crowded the timeline. Image
                        pages keep it at the foot, where nothing lives. */}
                    <span
                      className={`absolute right-3 rounded-[var(--r-pill)] bg-[var(--lang-scrim-rest)] px-2.5 py-1 font-mono text-micro tracking-[0.1em] text-white ${
                        current.kind === 'video' ? 'top-2' : 'bottom-2'
                      }`}
                    >
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

        {/* THE SPINE AS A 2×2 SYSTEM (her touch-up, 2026-08-20: "what and
            how aligned vertically in the same line, same for why and what
            came of it"). Balanced CSS columns packed tighter but paired the
            beats by accident of length; the grid pairs them by LAW:
            grid-flow-col with two rows places WHAT,WHY down the first
            column and HOW,OUTCOME down the second, so WHAT|HOW share a top
            line and WHY|OUTCOME share a second — four quadrants, scannable
            as a table. A thin spine (no HOW/OUTCOME) simply leaves its
            column short. Phones keep the single stack.
            mt-10 from sm (her air note, same day): the head section and the
            story are two sections; the plate scale re-shelves honestly for
            the taller content. */}
        <div className="mt-5 sm:mt-10 sm:grid sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-[auto_auto] sm:gap-x-9 sm:gap-y-2">
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
    </>
  )
}
