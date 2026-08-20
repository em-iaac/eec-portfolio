// G5 · THE A4 BOOK (REDESIGN-SPEC §10, re-designed in the current brand for
// print). One A4-landscape page per flagship project, reading the SAME
// master content files as the site (the spine WHAT / WHY / HOW / WHAT CAME
// OF IT, the dek, the woven credits, the award recognition), an INDEX page
// over the WORK grid’s own data + the registry’s thoughts, a CV tail from
// cv.ts, and a colophon. Nothing is authored here; it is composed here.
//
// These components are deliberately router-free and hook-light: the census
// test renderToString’s them directly, and headless Chrome prints them.
// Variants (cover, index) exist for the design gates and collapse to
// Emilie’s pick when she signs.
import { Fragment, type ReactNode } from 'react'
import LogoMark from '../components/LogoMark'
import { LENSES, LensGlyph, type Lens } from '../components/Lens'
// ADJECTIVES left this import at her C ruling (2026-08-19): the roles line is
// out of the book — her standing rule ("the book names no role") finally
// caught the one line that had been grandfathered past it. The landing still
// makes the claim; the book now makes it only in her voice.
import { BIO, BIO_VARIABLES, VOICE } from '../landing/identity'
import { MIND, THREADS, VIEWBOX, spline, starPath } from '../landing/mindGraph'
import type { BookAsset } from '../content/projects/types'
import { thoughtIndexEntries } from '../data/registry'
import { WORK_ENTRIES } from '../data/work'
import ThoughtIndexRows from '../components/ThoughtIndexRows'
import A4Page, { sideOf, type PageSide } from './A4Page'
import { BOOK_SPREADS, type SpreadData } from './bookContents'
import { BOOK_THREAD, THREAD_LABEL } from './bookPlates'
import { SITE_ORIGIN } from '../lib/routes'
import { printImageSrc, gridImage } from './printImage'
import { layoutAssetPage } from './assetGeometry'
import { PRINT_FIGURES } from './figures'
// ⚠ CvSheet is no longer imported here. The CV page left the book on
// 2026-08-12 ("remove the record. no need for it in the book"); the component
// still exists and /print/cv still renders it into the standalone CV PDF.
import { WORK_ARTIFACTS } from '../components/work/artifacts'
import RecognitionMark from '../components/RecognitionMark'

// The design gates (Emilie, 2026-07-12, this session) collapsed the
// exploration variants to her picks: cover = THE MIND ON PAPER (the landing
// artwork, ink on white) · spread = THE PLATE (image across the top) ·
// index = TILES (the WORK grid’s manner) · colophon kept with the signed
// caption. The imageless-spread fallback below survives as protection, not
// as a variant.
//
// draftCopy (G5, pending Emilie’s sign-off; every other line on these pages
// is signed content rendered verbatim): the SUBTITLE composition below, the
// structural labels PORTFOLIO · 2026, Index, THE THOUGHTS, ✦ RECOGNITION,
// LISTEN, THE FULL RECORD, the PLATE NN caption grammar (the §5 family rule
// applied to a new surface), and /work’s DOWNLOAD THE BOOK (PDF).

const SITE = 'emiliechidiac.com'
// ⚠ NOT a fourth private copy. lib/routes owns the origin (prerender.mjs and
// headData read the same one); SITE is only the DISPLAY string the rail prints,
// which is deliberately without the scheme.
const ORIGIN = SITE_ORIGIN

// THE LINKS PASS (Emilie, 2026-08-16). The book printed every URL it carries
// as dead type: 20 pages, zero link annotations, so a reader holding the file
// had to retype emiliechidiac.com/work/sensi by hand. The whole job of a
// leave-behind is to hand someone to the live work, and it could not.
//
// Her ruling was ALL OF IT: the footers, the index’s 21 projects and its
// thoughts, the about page’s contents, the colophon’s three addresses.
//
// ⚠ THE SECOND HALF OF THAT RULING WAS REVERSED THE SAME DAY, and this comment
// asserted the old one for a while. She first chose INVISIBLE everywhere
// (option A over a hairline and a dotted rule). Once the rail began carrying a
// door to each thought as well as each project, she marked the FOOTERS and the
// colophon with a dotted underline — "a reader cannot be expected to guess that
// a printed line is live" — while the index and the about page stay unmarked,
// because p19 is a drawn object and 21 dotted rules would turn it into a list.
// So pr-link itself still adds NO ink; print.css decides, per surface, whether
// a link is allowed to show. The marking rule lives there, next to the reason.
function PrLink({
  href,
  className,
  style,
  children,
}: {
  href: string
  className?: string
  style?: React.CSSProperties
  children: ReactNode
}) {
  return (
    <a href={href} className={`pr-link${className ? ` ${className}` : ''}`} style={style}>
      {children}
    </a>
  )
}

// The one place a page’s own anchor name is composed, so the about page’s
// contents rows and the plate pages cannot drift apart.
const plateAnchor = (slug: string) => `plate-${slug}`
// ⚠ AND THE SAME FOR THE INDEX, which was the hole this rule was written to
// close and then missed. Eight contents rows went through plateAnchor(); the
// ninth hard-coded "the-index" at BOTH ends, in two files' worth of distance
// from each other. Chrome emits NO link annotation at all for an href whose
// target id does not exist — it drops it silently — so renaming either half
// would have turned that row into dead type with every build check still
// green. render-pdfs now also resolves every in-document destination, because
// a shared constant only protects against renames, not against deletions.
const INDEX_ANCHOR = 'the-index'

// THE RAIL’S THOUGHT (2026-08-16). BOOK_THREAD holds her pick per project as
// an ID; the rail prints the note’s own TITLE, looked up here, so renaming a
// thought renames it in the book too and the two can never disagree. Returns
// undefined for anything unmapped, which prints nothing rather than an id.
function threadOf(slug: string): { label: string; href?: string } | undefined {
  const id = BOOK_THREAD[slug]
  if (!id) return undefined
  const note = thoughtIndexEntries().find(t => t.id === id)
  if (!note) return undefined
  // A thought that declares a printed form (THREAD_LABEL) prints VERBATIM;
  // everything else is the note’s own title, shouted to match the rail.
  const label = THREAD_LABEL[id] ?? note.title.toUpperCase()
  // THE THREAD IS A DOOR (Emilie, 2026-08-16). Naming the thought and then
  // making a reader search for it is the same defect the links pass fixed
  // everywhere else in this book. A note still in draft has no route, and
  // then the rail names it without linking rather than printing a dead one.
  return { label, href: note.note ? `${ORIGIN}${note.note.route}` : undefined }
}

// The contents-row leader. Geometry, never a gradient: see .pr-about__leader
// in print.css for why a CSS gradient prints as a bitmap here.
function PrLeader() {
  return (
    <span className="pr-about__leader" aria-hidden="true">
      <svg preserveAspectRatio="none" focusable="false">
        <line x1="0" y1="50%" x2="100%" y2="50%" />
      </svg>
    </span>
  )
}

// THE COVER, settled over three rounds (Emilie, 2026-08-11 and 12). It is the
// landing mind graph, and every mark is drawn in ITS OWN CATEGORY INK; the
// eight projects that hold pages sit larger, and nothing is numbered.
//
// Two versions were built and rejected, and both are worth not repeating.
// The /thoughts world printed as a cover: the better drawing, but it carries
// no words and the map is six times wider than it is tall, so any cover-shaped
// view of it is a window rather than the map. And the eight marked in RED and
// numbered: it reversed print.css’s own rule that red is never a category, and
// once the contents moved onto the CV page overleaf the numbers had no job on
// a drawing anyway.


// The lens inks, in print. Cyan, magenta and yellow are the printer’s own
// process inks, which is why print.css carries its own darker set rather than
// the screen pens: these have to hold on paper at 3.6px.
// Keyed by the mind graph’s own LensKey ('c' | 'p' | 'e' from landing/palette),
// not by the long lens names: the graph stores the short key and a long-name
// map silently resolves to nothing, which is exactly how the first draft of
// this came out uniformly black.
const LENS_INK: Record<string, string> = {
  c: '#0e7490',
  p: '#a8186b',
  e: '#7a5e00',
}
// The cover’s third tier. Lighter than --pr-ink-muted on purpose: these labels
// have to recede behind the eight project names without vanishing on an office
// laser, and #565b63 put them level with the projects instead of under them.
// One step darker at the book audit (Emilie, 2026-08-18): at #9aa1ab the
// category labels were the page’s most likely dropout on a laser print.
// SNAPPED TO THE TOKEN at the consistency pass (her J ruling, 2026-08-19):
// #8b929c was one bit off --lang-ink-faint, which gave the book three faint
// greys within Δ1 of each other. Same recede, same laser survival, one grey.
const THREAD_GREY = '#8a919c'
// Every mark on the cover that is NOT one of the eight. Light enough to recede
// behind them, dark enough to survive an office laser: this is the drawing, not
// a watermark, and the shape of the graph still has to be readable.
// Snapped Δ6 darker onto the drawn-figure hairline grey (her J ruling,
// 2026-08-19), so the book keeps ONE light grey instead of two a hair apart —
// and darker is the safe direction for the laser this comment worries about.
const QUIET_MARK = '#c8ccd2'

const NAME = 'Emilie El Chidiac'
// ⚠ SUBTITLE and AWARD_FACT ARE GONE (Emilie, 2026-08-12). The cover carried
// "Design Technology Architect. I work with design, technology and minds." and
// "PORTFOLIO · 2026 · ✦ MACAD AWARDS 2026 · DESIGN COPILOTS · WINNER". Her
// ruling: "I don’t want below my name to have awards and bla bla, just that
// this is the selected work portfolio 2026." The award still leads the Sensi
// page that earned it and still marks its tile in the index, so nothing is
// lost from the book; it just stops being the first thing a stranger reads.
// The VOICE line moved to page 2, where it is the about page’s standfirst.

// The foot dates left the book at round 5 (Emilie, 2026-08-19); the shared
// fmtMonthYear import went with them (it still serves the /work index rows
// through their own module).

// PAPER’s lens mark. The screen’s LensMark (ui/Pill.tsx) carries Tailwind
// classes and a currentColor accent; print has its own type, its own tokens
// and a pinned-light ground, so it keeps its own six-line renderer rather than
// inheriting screen chrome. The GEOMETRY is still single-source (LensGlyph):
// that was the audit’s actual finding, not the number of wrappers.
function PrLensTick({ lens, size }: { lens: Lens; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true" className="inline-block shrink-0">
      <LensGlyph shape={LENSES[lens].shape} fill={LENSES[lens].pen} />
    </svg>
  )
}

// The recognition mark moved to components/RecognitionMark (2026-08-16): the
// social cards render to files at build time too and were carrying the same
// machine-dependent glyph, so the shape is defined once for both.

// (LensPill lived here twice in one day, 2026-08-20 — kicker head, then the
// head-air board's OPT 1 — and retired for good with the tick-value ledger:
// "since we have it as a table system we can't have the type as a pill".
// The plate's TYPE row prints the lens label as plain text now.)

/* ---- 1 · THE COVER ------------------------------------------------------
   The cover carries the SITE’S OWN FRONT DOOR (Emilie’s gate ruling,
   2026-07-12): the landing mind graph, drawn from the SAME frozen model the
   landing renders (src/landing/mindGraph.ts), so an appended node updates
   the book cover on the next build and the art can never stale. Ground =
   THE MIND ON PAPER (Emilie’s pick over the carbon night): ink threads on
   white, the landing’s own light mode, office-printer friendly. */

// THE EIGHT, MARKED (draft A). Page one is the cover, then every project holds
// a facing pair, so project i (0-based) opens on page 2 + 2i. The node knows
// which project it is through its sheetRoute, which is the same /work/:id the
// spread’s foot prints, so this cannot drift from the book’s contents.
const BOOK_PAGE_BY_ROUTE = new Map(
  BOOK_SPREADS.map((d, i) => [`/work/${d.entry.id}`, 3 + i * 2]),
)
// The cover names each of the eight from its MASTER, never from the graph’s
// node label: the graph stores an uppercase string tuned for a screen, and
// uppercasing is exactly what destroys "lEgoarCh".
const BOOK_TITLE_BY_ROUTE = new Map(
  BOOK_SPREADS.map(d => [`/work/${d.entry.id}`, d.master.title]),
)

/** Is this node one of the eight the book holds a pair for? */
function isInBook(marked: boolean, n: { sheetRoute?: string }): boolean {
  return marked && n.sheetRoute ? BOOK_PAGE_BY_ROUTE.has(n.sheetRoute) : false
}

function MindGraphArt({ ink, marked = false }: { ink: string; marked?: boolean }) {
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden="true"
    >
      {THREADS.map(t => (
        <path
          key={t.id}
          d={spline(t.pts)}
          fill="none"
          stroke={ink}
          strokeWidth={1.2}
          strokeLinecap="round"
          // 0.28 -> 0.20 in the same calming pass. The web is the quietest
          // thing on the page now, which is what lets eight coloured marks read
          // as the subject rather than as more of the same drawing.
          opacity={0.2}
        />
      ))}
      {/* THE THREAD NAMES SIT BELOW THE PROJECTS (Emilie, 2026-08-12: "the
          thread names should also be thinner than Emilie or greyish for
          hierarchy"). Three tiers now read at a glance on the cover: her name
          in display black, the eight projects in their category ink, and these
          in light grey mono. They were the same size and the same grey as the
          project labels, which is why a reader could not tell that SENSI is a
          project and NEURO is a category. */}
      {THREADS.filter(t => t.label).map(t => (
        <text
          key={`${t.id}-label`}
          x={t.label![0]}
          y={t.label![1]}
          textAnchor={t.anchor}
          fontFamily="Martian Mono"
          fontSize={7.5}
          letterSpacing={1.3}
          fill={THREAD_GREY}
        >
          {t.id}
        </text>
      ))}
      {/* ⚠ PAINT ORDER, NOT DATA ORDER (Emilie, 2026-08-12: "fix the Verve
          smudge"). A grey node sits almost exactly on Verve City Walk’s mark in
          the model, and drawn in MIND.nodes order it landed ON TOP of the
          magenta dot, so the one thing the page is pointing at read as a smudge.
          Every quiet mark is now drawn FIRST and the eight go over them.

          Deleting the colliding node was the other option and it is worse: the
          graph is the site’s own model and this page is a rendition of it, not
          an edit of it. Paint order changes nothing about what is true, and it
          fixes every future collision rather than this one. */}
      {[...MIND.nodes].sort((a, b) => Number(isInBook(marked, a)) - Number(isInBook(marked, b))).map(n => {
        // In the book = drawn LARGER. Not a different colour and not numbered:
        // she ruled both of those out on sight, and the page numbers now live
        // on the contents overleaf where a reader looks for them.
        const inBook = isInBook(marked, n)
        // ONLY THE EIGHT KEEP THEIR INK (Emilie, 2026-08-12: "I feel like the
        // drawing is overpowering the page, it should be calmer").
        //
        // The diagnosis that produced this rather than a weight tweak: the page
        // was not too dark, it was too EVEN. Twenty-one marks all carrying full
        // category ink compete at equal strength, so nothing on the cover is
        // first and the drawing shouts as a whole. Greying everything that is
        // not in the book turns the colour into a statement of membership, and
        // the eight arrive without a single mark getting louder.
        //
        // The unmarked variant keeps every lens ink, because there the graph is
        // the subject rather than a field the eight sit in.
        const paint = marked && !inBook ? QUIET_MARK : LENS_INK[n.lens] ?? ink
        return (
        // data-book marks the eight so a calmer treatment can reach every mark
        // that is NOT one of them without re-deriving membership in CSS.
        <g key={n.id} data-book={inBook ? '1' : undefined}>
          {n.award ? (
            <path d={starPath(n.x, n.y, inBook ? 8 : 5.6)} fill={paint} />
          ) : n.kind === 'project' ? (
            <circle cx={n.x} cy={n.y} r={inBook ? 6.4 : 3.6} fill={paint} />
          ) : (
            <circle cx={n.x} cy={n.y} r={3.2} fill="none" stroke={paint} strokeWidth={1.4} />
          )}
          {/* ONLY THE EIGHT ARE NAMED (Emilie, 2026-08-12). The landing labels
              a resting SUBSET of nodes and reveals the rest on hover, which is
              right on a screen and meaningless on paper: printed, that subset
              is just a scatter of names with no rule behind it. So the cover
              names the projects that hold pages and nothing else. The thread
              names down the right stay: those are the graph’s own spine and they
              are structural, not a selection.

              THREE THINGS ABOUT THIS LABEL, all hers on seeing the four drafted
              covers (2026-08-12):

              1. IT IS PAINTED IN ITS CATEGORY INK, the same ink as the mark it
                 belongs to. That does NOT breach print.css’s "red is never a
                 category": these are the three lens inks, and red stays the
                 emblem’s alone. It also keeps the sitewide rule that colour
                 never means alone, because the mark’s SHAPE still carries the
                 lens whether or not the ink survives a greyscale printer.
              2. IT IS CENTRED ABOVE THE MARK. ⚠ It sat BESIDE the mark for one
                 build, on my argument that a label on the baseline beside a dot
                 reads as attached to it. On the page it did the opposite: set
                 beside the mark the name runs INTO the threads to its right, and
                 "Falcon Square" printed with a curve through it. Reverted on her
                 sight of it, 2026-08-12. Above the mark the label has the one
                 direction on this drawing where nothing else is.
              2b. IT IS LIGHT. Bold at 14 made eight names shout over their own
                 drawing; 500 at 11.5 lets the marks stay the loudest thing.
              3. IT IS THE MASTER’S OWN TITLE, not the graph’s node label. The
                 graph stores an uppercase label for a screen, and uppercasing
                 loses the one thing lEgoarCh’s name is doing. */}
          {inBook && (
            <text
              x={n.x}
              y={n.y - 12}
              textAnchor="middle"
              fontFamily="var(--font-display)"
              fontSize={11.5}
              fontWeight={500}
              letterSpacing={-0.1}
              fill={paint}
            >
              {BOOK_TITLE_BY_ROUTE.get(n.sheetRoute ?? '') ?? n.label}
            </text>
          )}
        </g>
        )
      })}
    </svg>
  )
}


function Cover() {
  const ink = '#16181d'
  const anno = '#565b63'

  return (
    <A4Page outline="Cover">
      {/* THE VOID BECOMES THE TITLE (Emilie’s pick, 2026-08-12, from four
          compositions drawn against the real artwork).

          The old cover stacked two objects: the drawing in a 166mm band, then
          an identity rail underneath it. Her three notes on that page were the
          empty upper left, the labels, and the type reading as a slab. All
          three have one cause and one fix. The mind graph’s ink is dense in the
          centre and right and near-empty across the upper left, so THE NAME
          GOES IN THE EMPTINESS: the drawing now fills the whole page and bleeds
          off the bottom and the right, and the type sits inside it rather than
          under it. Nothing is cropped, and the fault becomes the frame.

          ⚠ THE AWARD LINE IS GONE FROM THE COVER, by her ruling: "I don’t want
          below my name to have awards and bla bla, just that this is the
          selected work portfolio 2026." One line replaces three. The award is
          not lost: it still leads the Sensi page that earned it, and it is
          still in the index. AWARD_FACT and SUBTITLE are no longer read here,
          which is why the cover’s old draftCopy note no longer applies to them.

          The standfirst went with it. That is not a second decision: page 2 now
          opens with the same VOICE line, and printing it twice in the first two
          pages was the stutter this pass has spent its time removing. */}
      <div style={{ position: 'relative', height: '100%', background: '#ffffff' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <MindGraphArt ink={ink} marked />
        </div>
        {/* left 12mm (her ruling at the design audit, 2026-08-19): the cover
            joins the book's uniform 12mm frame instead of holding its old
            18mm — the one edge in the book that no longer matched anything. */}
        <div style={{ position: 'absolute', left: '12mm', top: '26mm', width: '135mm' }}>
          <h1
            className="pr-title"
            style={{ fontSize: '38pt', lineHeight: 0.94, margin: 0, color: ink, letterSpacing: '-0.022em' }}
          >
            {NAME.toUpperCase()}
          </h1>
          {/* draftCopy: structural, and her words. */}
          <p className="pr-mono" style={{ margin: '7mm 0 0', color: anno, letterSpacing: '0.15em' }}>
            SELECTED WORK · PORTFOLIO 2026
          </p>
        </div>
        {/* The emblem sits CENTRED OVER the URL (Emilie, 2026-08-12), not
            right-aligned with it. Right-aligned, a square mark above a long
            word reads as two things that happen to share an edge. */}
        <div
          style={{
            position: 'absolute',
            /* 12mm both (the frame ruling, 2026-08-19): the emblem block's
               anchors sit on the same 12mm frame as every other page. */
            right: '12mm',
            bottom: '12mm',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <LogoMark size={52} />
          <p className="pr-mono" style={{ margin: '2.4mm 0 0', color: anno }}>
            <PrLink href={ORIGIN}>{SITE}</PrLink>
          </p>
        </div>
      </div>
    </A4Page>
  )
}

/* ---- 2 · THE SPREAD ------------------------------------------------------ */

function SpineSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <h3>{label}</h3>
      {children}
    </section>
  )
}

/** THE FOLIO (Emilie, 2026-08-12: "we don’t mention the page number, we should
 *  find a place for that in the footer").
 *
 *  ⚠ THE BOOK HAD NO PAGE NUMBERS AT ALL, on any of its twenty pages, while the
 *  contents overleaf pointed at 03, 05, 07 and so on. A contents page that names
 *  numbers a reader cannot find on the page is worse than no contents.
 *
 *  It sits at the OUTER edge of the foot line, which is where a folio belongs in
 *  a bound book: left on a verso, right on a recto, so it always falls under the
 *  thumb rather than in the gutter. `sideOf` already computes that, so re-ordering
 *  the book moves the number to the correct edge on its own. */
function Folio({ n, side }: { n: number; side: PageSide }) {
  return (
    <span className="pr-folio" data-side={side}>
      {String(n).padStart(2, '0')}
    </span>
  )
}

/** A separator must never begin a wrapped line (the book audit’s B22: three
 *  rails broke as "· D5", "· REACT" and "LIVE / APP"). Binding the "·" to the
 *  word before it with a no-break space keeps every break AFTER a separator,
 *  never before one. (`rail`, just below the helper.)
 *
 *  The BOOK's meta rail keeps · LIVE APP (2026-08-20, the TEAM-label ruling):
 *  the sheet dropped the segment from the meta string because its pressable
 *  red links row says liveness one line below — but print has no links row,
 *  this rail is the plate's only liveness mention, and it joined deliberately
 *  on 2026-08-19. Derived from the master's `liveApp` flag so the printed
 *  words are exactly what the book said before the string moved. */
const metaRail = (master: { meta: string; liveApp?: boolean }) =>
  rail(master.liveApp ? `${master.meta} · LIVE APP` : master.meta)
const rail = (s: string) => s.replace(/ · /g, ' · ')

function Spread({ data, side, plate, page }: { data: SpreadData; side: PageSide; plate: number; page: number }) {
  const { master, entry } = data
  // The thought this plate names in its rail (BOOK_THREAD, her pick per
  // project). Resolved through the registry so the rail prints the note’s
  // OWN title and can never drift from it; an unmapped slug simply prints no
  // thread rather than an id.
  const thread = threadOf(master.slug)
  // The dominant plate: the master’s curated spreadAssets first (the
  // print-resolution rung), the card cover as the honest fallback.
  const plateRef = master.spreadAssets?.[0] ?? master.image
  const img = plateRef ? printImageSrc(plateRef.slug, plateRef.name) : undefined
  const alt =
    master.image && plateRef && master.image.name === plateRef.name
      ? master.image.alt
      : `${master.title}, the book plate`

  // THE FITTED PLATE (2026-08-11). A dominant image that is a DIAGRAM cannot
  // be cropped to the plate’s 1.51 shape without losing whatever sits at its
  // edges, which for lEgoarCh’s outputs slide is the labels. Fitting it whole
  // on its own ground costs nothing there, because the ground is black and the
  // letterbox is invisible. Photographs keep filling the plate: cropping a
  // render costs nothing, which is why every other plate is untouched.
  {/* THE FITTED PLATE IS GONE (Emilie, round 2, 2026-08-19). It existed
      because a screenshot or diagram could not crop to the plate's 1.51
      shape; the plate now takes the screenshots' own ~1.88 shape instead,
      so every hero fills the same way and the grounds, plinths and whispers
      all left with the problem they patched. */}
  const figure = plateRef && img && (
    <figure className="pr-spread__figure" style={{ margin: 0 }}>
      <img src={img} alt={alt} />
    </figure>
  )

  {/* FIG n.0 joined the seam at the book audit (Emilie, 2026-08-18); the
      TITLE left it at round 2 (2026-08-19). At the new 77mm hero the long
      titles ran the rail past the plate into the body text (A BALLOONING
      MARKET reached the HOW column), and the title is stated in the head
      beside it anyway — the rail repeating it was the old seam stutter. */}
  const caption = figure && (
    <span className="pr-spread__caption">
      PLATE {String(plate).padStart(2, '0')} · FIG {plate}.0
    </span>
  )

  // (THE LIVE DOOR's derivation lived here 2026-08-20, morning to evening:
  // first "LIVE APP · host", then the bare host, and finally the row simply
  // prints every link's own label like the site's — the ledger's LINKS row
  // below needs no special case, and the URL still rides the annotation.)

  // THE FILE CARD (her C ruling off the head-composition board, 2026-08-20,
  // superseding the same day's airy minimum — measured first: the 77mm cell
  // held 48–59mm of content with 6–17mm pooled at its foot, and Sensi's
  // kicker was the one head that wrapped, 11.7mm tall vs everyone's 6.5).
  // The kicker row is GONE: the title takes the cell's first line, the
  // question breathes under it, and the lens pill + full award become the
  // LEDGER's first rows (TYPE · AWARD · TEAM · STACK), pinned with the links
  // to the cell's foot — the same ground the hero stands on — by the grid's
  // margin-top auto (print.css). The award got QUIETER: a grid row at the
  // rail's own size, ink, never louder. The site's sheet composes the same
  // way; one family, two dialects.
  // THE LINKS PRINT RED (her R1 ruling, same board): the whole pressable
  // phrase joins the footer's exact grammar — red means press here, and the
  // head's links were the last holdout. Blog + github stayed (her confirmed
  // 08-19 reversal); full award spelling, no red dot on the question.
  // ⚠ THE P-NUMBER IS STILL NOT PRINTED (Emilie, 2026-08-12) — PLATE NN up
  // the seam remains the book's only sequence.
  const head = (
    <>
      <h2 className="pr-title pr-spread__title">{master.title}</h2>
      {/* The QUESTION at its own 14pt rung (pr-plate-question, print.css —
          her night ruling: bigger, wrapping NORMALLY, no balance). The last
          two words are glued with a no-break space: at natural wrapping The
          Huddle printed a one-word second line (measured), and her widow law
          stands — a second line carries at least two words. Same words. */}
      {master.question && (
        <p className="pr-dek pr-plate-question">{master.question.replace(/ (\S+)$/, ' $1')}</p>
      )}
      {/* THE LEDGER — MARKS OUT, CASE IN (her tick-value refinement,
          2026-08-20: one row wore the pill, one the recognition mark, two
          nothing). No glyphs in the table — the pill and the mark live on
          elsewhere (the index's legend, the recognition pages) — and the
          case split is the system: labels CAPS, values lowercase
          (pr-plate-grid, print.css), one muted mono voice.
          LINKS IS THE FIFTH ROW (her C ruling off the six real mockups,
          same day): the doors joined the record — live app, blog and github
          print red in the ledger's own face, the one signal the table
          carries (the dot retired with the standalone row).
          Head anatomy is two groups now: title+question pin the cell's top,
          the five-row record stands on its foot, one air band between. */}
      <div className="pr-plate-grid pr-mono">
        <span className="pr-plate-grid__label">TYPE</span>
        <span className="pr-mono--muted">{LENSES[entry.lens].label}</span>
        {entry.recognition && (
          <>
            <span className="pr-plate-grid__label">AWARD</span>
            <span className="pr-mono--muted pr-plate-grid__award">{entry.recognition}</span>
          </>
        )}
        <span className="pr-plate-grid__label">TEAM</span>
        <span className="pr-mono--muted">{rail(master.meta)}</span>
        <span className="pr-plate-grid__label">STACK</span>
        <span className="pr-mono--muted">{rail(master.tech)}</span>
        {(master.links?.length ?? 0) > 0 && (
          <>
            <span className="pr-plate-grid__label">LINKS</span>
            {/* The links wear their own LABELS, same as the site's row (her
                note, 2026-08-20 evening: "write live app instead of the
                url" — the address detour lasted a day; the URL still rides
                the annotation and the footer). Middots between the doors
                like STACK's value — muted punctuation, never red. */}
            <span className="pr-plate-links pr-mono--muted">
              {(master.links ?? []).map((l, i) => (
                <Fragment key={l.href}>
                  {i > 0 && <span aria-hidden="true">·</span>}
                  <PrLink href={l.href}>{l.label}</PrLink>
                </Fragment>
              ))}
            </span>
          </>
        )}
      </div>
    </>
  )

  const spine = (
    <div className="pr-spine pr-body">
      {/* The spine reads off `master`, not `entry`: the four beats moved out of
          WorkEntry on 2026-08-03 so a phone stops downloading all 21 of them.
          bookContents.spreadData merges the eager spine back onto the meta. */}
      <SpineSection label="WHAT">
        <p>{master.what}</p>
      </SpineSection>
      <SpineSection label="WHY">
        <p>{master.why}</p>
      </SpineSection>
      {master.how && master.how.length > 0 && (
        <SpineSection label="HOW">
          <ol>
            {master.how.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </SpineSection>
      )}
      {master.outcome && (
        <SpineSection label="WHAT CAME OF IT">
          <p>{master.outcome}</p>
        </SpineSection>
      )}
    </div>
  )

  {/* ONE FOOT, BOTH PAGES (Emilie, round 2, 2026-08-18: "each project should
      have the same footer and pages same side, follow the page 1 template").
      The tech list left this rail — the asset page's head states it once —
      and the same three slots print on the plate AND its asset page:
      thread · url + date · folio. ⚠ THE RAIL MUST STAY ONE LINE: `.pr-spine`
      above is multicol with flex: 1, and an overgrown foot once opened a
      phantom column off the sheet (311px); the page-box probe catches it. */}
  {/* Round 4 (2026-08-19): the slots are project link LEFT, thought MIDDLE,
      folio RIGHT — fixed by the foot grid, identical x on every page. */}
  const foot = (
    <div className="pr-spread__foot">
      {/* The date left the foot at round 5 (Emilie, 2026-08-19); the link
          stands alone on the left. */}
      <span className="pr-mono pr-mono--muted">
        <PrLink href={`${ORIGIN}/work/${entry.id}`}>
          {SITE}/work/{entry.id}
        </PrLink>
      </span>
      <span className="pr-mono pr-mono--muted">
        {thread && (
          <>
            {'MADE ME THINK OF: '}
            {thread.href ? (
              <PrLink className="pr-thread" href={thread.href}>{thread.label}</PrLink>
            ) : (
              thread.label
            )}
          </>
        )}
      </span>
      {/* ⚠ THE FOLIO NO LONGER MIRRORS on project feet (Emilie, round 3,
          2026-08-19: "the exact same as the first pages with the page number
          on the right, I do not want them to alternate"). Both pages of a
          pair now read identically; the bound-book outer-edge convention
          yielded to the pair reading as one unit. */}
      <Folio n={page} side="recto" />
    </div>
  )

  // The dominant image bleeds the OUTSIDE edge: recto (odd, binds left)
  // carries it right; verso mirrors. No image = an honest all-text page
  // (the fallback form below, whose content column simply spans wider).
  if (figure) {
    return (
      <A4Page id={plateAnchor(master.slug)} outline={master.title}>
        <div className={`pr-spread pr-spread--plate pr-spread--${side}`}>
          <div className="pr-plate__top">
            {side === 'recto' ? (
              <>
                <div className="pr-plate__head">{head}</div>
                {figure}
              </>
            ) : (
              <>
                {figure}
                <div className="pr-plate__head">{head}</div>
              </>
            )}
          </div>
          <div className="pr-plate__body">
            {spine}
            {foot}
          </div>
          {caption}
        </div>
      </A4Page>
    )
  }

  // No figure: the honest all-text page. The side class keeps the bound
  // gutter’s 18mm; the solo modifier spans the content across the full page.
  return (
    <A4Page id={plateAnchor(master.slug)} outline={master.title}>
      <div className={`pr-spread pr-spread--${side}`}>
        <div className="pr-spread__content pr-spread__content--solo">
          {head}
          {spine}
          {foot}
        </div>
      </div>
    </A4Page>
  )
}

/* ---- 2b · THE ASSET PAGE -------------------------------------------------
   THE EDITORIAL PASS (Emilie, 2026-08-12). The first version of this page was
   a grid: every asset a rounded box inside a margin on all four sides, every
   asset in a row the same height, every caption the same size. Her verdict:
   "I would not want the stuff to be filleted, and want it to be more editorial
   like the first page. not all assets should be the same size."

   THE DIAGNOSIS THAT PRODUCED THIS LAYOUT. Page one is a COMPOSITION and page
   two was a GRID, and the difference is one move: on page one a single image
   dominates and BLEEDS OFF THE TRIM, so the type sits in a deliberate white
   shoulder beside it. Page two floated inside a box on all four sides. It also
   repeated three of page one’s four furniture elements verbatim (the same
   number, the same meta row, the same seam caption), which is a stutter rather
   than a rhyme. So this page now makes page one’s move instead of borrowing
   its trim.

   A LEAD AND A REGISTER. `bookLead` is promoted: it runs off two edges of the
   page and the head meta moves into the white beside it. `bookRegister` is one
   justified row, subordinate. The row still justifies, so every image keeps its
   true aspect and NOTHING IS EVER CROPPED, which matters because most of these
   are diagrams and a cropped diagram loses the labels that made it printable.

   ⚠ WHY FOUR ASSETS, AND WHY 04 DIED. Both were settled by measuring, not by
   taste, and the numbers are worth keeping because they will re-decide this if
   the assets change:
     · A full-bleed BAND across all 297mm ends 13mm PAST the trim on every one
       of the eight. The widest asset in the book is 2.47 and a band needs about
       3.2 to leave room for anything underneath. So a band is not a layout; it
       is this layout with a wide lead.
     · A register row of three is 42 to 46mm tall at this measure; a row of two
       is 65 to 73mm. Six assets therefore spend 130mm of a 178mm body and the
       lead collapses to 48mm, which is no longer a lead. At lead + three every
       project clears, with the lead between 54% and 71% of the page width.

   The geometry is computed, not guessed, because the page must be able to fail
   loudly. These numbers mirror print.css and scripts/print-assets.mjs, which
   sizes each baked image to the width it is actually drawn at. Change one,
   change all three. */

// The geometry lives in ./assetGeometry, which is pure and is imported by the
// bake script and the census test as well. It used to be copied into all three
// with a comment saying so; a wrong number in the bake script fails nothing and
// ships a soft image instead, which is invisible at A4.

type Sized = { w: number; h: number; src: string; alt: string; figure?: string }

function resolve(ref: BookAsset | undefined): Sized | null {
  if (!ref) return null
  // A DRAWN FIGURE carries its own proportions, so the layout can size it the
  // same way it sizes a photograph without anything existing on disk.
  if (ref.figure) {
    const fig = PRINT_FIGURES[ref.figure]
    if (!fig) return null
    return { w: fig.w, h: fig.h, src: '', alt: ref.caption ?? '', figure: ref.figure }
  }
  const img = gridImage(ref.slug, ref.name)
  // The print caption overrides the manifest alt only where an asset declares
  // one, which today is only the two inverted falcon sheets.
  return img ? (ref.caption ? { ...img, alt: ref.caption } : img) : null
}

function AssetPage({ data, side, plate, page }: { data: SpreadData; side: PageSide; plate: number; page: number }) {
  const { master, entry } = data
  const assetThread = threadOf(master.slug)
  const leadRef = master.bookLead
  const leadImg = resolve(leadRef)
  const lead = leadImg && leadRef ? { ...leadImg, corner: leadRef.corner } : null
  const register = (master.bookRegister ?? []).map(resolve).filter(Boolean) as Sized[]
  const columnAsset = resolve(master.bookColumn)
  const laid = layoutAssetPage(lead, register, side === 'verso', columnAsset, master.bookRegisterScale ?? 1)
  // ⚠ NO CAPTION EVER FLOWS INSIDE THE META NOW. Every corner places the lead’s
  // caption at laid.leadCap, which for a top lead is the band directly under the
  // lead. The meta block is a HEAD: what the page is, who made it, what it was
  // built with, and nothing that describes a picture.
  const capInMeta = false
  const mm = (v: number) => `${v}mm`

  return (
    <A4Page>
      <div className={`pr-assets pr-assets--${side}`}>
        {/* THE SEAM CAPTION IS GONE, and that is the point rather than an
            omission. It read "PLATE 05 · THE HUDDLE" on both pages of the
            pair, which is the stutter her review named. This page says whose
            it is once, in the head row, and once more in the foot. */}
        <div
          className="pr-assets__meta"
          style={{ left: mm(laid.meta.x), top: mm(laid.meta.y), width: mm(laid.meta.w) }}
        >
          {/* ⚠ NO P-NUMBER HERE EITHER (2026-08-12). It came off the project page
              first and this one was missed for an hour, so the book briefly
              printed the site’s catalogue number on its even pages and not its
              odd ones. PLATE NN stays: it counts 01 to 08 in reading order. */}
          <span className="pr-mono pr-mono--muted">
            PLATE {String(plate).padStart(2, '0')}
          </span>
          {/* THE NAME JOINED THE HEAD (round 2, 2026-08-18): with the unified
              foot carrying the thread instead of the title, this page never
              named its project in type. Now it does, once, up here. */}
          <span className="pr-mono">{master.title}</span>
          <span className="pr-mono pr-mono--muted">{metaRail(master)}</span>
          {/* THE HEAD NOW CARRIES THE TECH LINE, under a hairline (Emilie,
              2026-08-12: "maybe we should have some type of header with the
              plate, the context and the tools or tech used"). The facing project
              page states the same three facts in its foot; before this the asset
              page stated two of them and a picture caption, which is why the
              block read as a stack rather than as a head. The rule divides the
              page’s own facts from what it was built with. */}
          <span className="pr-assets__headrule" />
          <span className="pr-mono pr-mono--muted pr-assets__tech">{rail(master.tech)}</span>

        </div>

        {laid.lead && (
          <figure
            className="pr-assets__lead"
            style={{ left: mm(laid.lead.x), top: mm(laid.lead.y), width: mm(laid.lead.w), height: mm(laid.lead.h) }}
          >
            {laid.lead.figure ? PRINT_FIGURES[laid.lead.figure]?.node : (
              <img src={laid.lead.src} alt={laid.lead.alt} />
            )}
          </figure>
        )}

        {/* THE COLUMN ASSET. Positioned, not flowed, and anchored to the
            REGISTER ROW rather than to the head: its bottom edge meets the
            row’s, so its caption starts on the same line as theirs and the
            spare height collects above it as one band. A credit line that wraps
            to two lines therefore moves nothing. */}
        {/* FIG NUMBERS, PER PROJECT (Emilie, 2026-08-18): the hero is FIG n.0
            on the plate’s seam, the lead is n.1, and the column + register
            count on in reading order. The number is a caption prefix, so the
            layout does not move. */}
        {laid.column && (
          <figure
            className="pr-assets__fig"
            style={{ left: mm(laid.column.x), top: mm(laid.column.y), width: mm(laid.column.w) }}
          >
            <img src={laid.column.src} alt={laid.column.alt} style={{ height: mm(laid.column.h) }} />
            <figcaption className="pr-assets__cap">FIG {plate}.2 · {laid.column.alt}</figcaption>
          </figure>
        )}

        {laid.register.map((box, i) => (
          <figure
            key={i}
            className="pr-assets__fig"
            style={{ left: mm(box.x), top: mm(box.y), width: mm(box.w) }}
          >
            {box.figure ? (
              <div style={{ height: mm(box.h) }}>{PRINT_FIGURES[box.figure]?.node}</div>
            ) : (
              <img src={box.src} alt={box.alt} style={{ height: mm(box.h) }} />
            )}
            <figcaption className="pr-assets__cap">
              FIG {plate}.{(laid.column ? 3 : 2) + i} · {box.alt}
            </figcaption>
          </figure>
        ))}

        {/* A bottom lead’s caption goes in the empty quadrant beside it, and a
            field lead’s under its own foot. Both are white, never over an
            image and never under the lead where it met the register. */}
        {laid.lead && !capInMeta && (
          <p
            className="pr-assets__leadcap"
            style={{ left: mm(laid.leadCap.x), top: mm(laid.leadCap.y), width: mm(laid.leadCap.w) }}
          >
            FIG {plate}.1 · {laid.lead.alt}
          </p>
        )}

        <div className="pr-assets__rule" style={{ top: mm(laid.ruleY) }} />
        {/* THE SAME FOOT AS THE PLATE (round 2, 2026-08-18): thread · url +
            date · folio, identical slots on both pages of every project. The
            title moved up into the head. */}
        <div className="pr-assets__foot" style={{ top: mm(laid.ruleY + 4) }}>
          <span className="pr-mono pr-mono--muted">
            <PrLink href={`${ORIGIN}/work/${entry.id}`}>
              {SITE}/work/{entry.id}
            </PrLink>
          </span>
          <span className="pr-mono pr-mono--muted">
            {assetThread && (
              <>
                {'MADE ME THINK OF: '}
                {assetThread.href ? (
                  <PrLink className="pr-thread" href={assetThread.href}>
                    {assetThread.label}
                  </PrLink>
                ) : (
                  assetThread.label
                )}
              </>
            )}
          </span>
          {/* Pinned right like the plate's (round 3, 2026-08-19): the pair's
              two feet are now identical, no alternation. */}
          <Folio n={page} side="recto" />
        </div>
      </div>
    </A4Page>
  )
}

/* ---- 3 · THE INDEX ------------------------------------------------------- */

// The rows themselves live in components/ThoughtIndexRows (print skin): the
// /work index renders the same component in its screen skin, so the two
// renditions share one layout logic + one selector (REINDEX, 2026-07-16).
const THOUGHTS = thoughtIndexEntries()

function IndexPage({ side }: { side: PageSide }) {
  return (
    <A4Page id={INDEX_ANCHOR} outline="Index">
      <div className={`pr-index pr-index--${side}`}>
        {/* THE WORDS (2026-07-28): four new thoughts pushed this page 17px
            (~4.5mm) past its A4 box. Same remedy as the S4b and S2 overruns
            recorded below, because the page is dense by design and the fix has
            always been margin rather than content: the header, the legend and
            THE THOUGHTS heading each give back ~2mm, which is 6mm against a
            4.5mm overrun. Re-measure if a fifth note ships; the next one
            probably wants the thoughts list to run in more columns instead. */}
        {/* THE HEADER AND FOOTER, SORTED (Emilie, 2026-08-12: the page "look
            busy"). The header is now the word and nothing else. The counts and
            the legend moved to a foot rule at the bottom, which is where a
            reader looks for them and where they stop competing with the work.
            The sheet numbers came off every tile in the same pass. */}
        <h2 className="pr-title" style={{ fontSize: '20pt', margin: '0 0 4mm' }}>Index</h2>

        {/* The WORK grid’s manner, in print (Emilie’s pick over the rows
            contents page): image tiles for every project, quiet tiles where
            no photograph exists (the podcast honestly says LISTEN).
            (S2, 2026-07-16: 20 projects. At 6-across the fourth tile row
            pushed the page 181px past its A4 box, so the index runs 7-across
            = 3 rows and the page keeps its box; measured live.) */}
        <div className="pr-index__grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {WORK_ENTRIES.map(w => {
            // THE TILES ARE HER DRAWINGS (Emilie, 2026-08-11). Each project’s
            // parti from /work, in ink. A photograph printed 36mm wide reads as
            // texture; a parti was drawn to be read small. It also removes the
            // last of the index’s weight, which was the heaviest thing in the
            // book before this session.
            const art = WORK_ARTIFACTS[w.id]
            // THE ONE WRAPPING ROW (Emilie, 2026-08-18): "Rings of Mars: Ring
            // 4000" was the only name of 21 that wrapped, splitting the model
            // name and breaking its row’s baseline. The index shortens it; the
            // project page keeps the full name.
            const title = w.title === 'Rings of Mars: Ring 4000' ? 'Rings of Mars' : w.title
            return (
              // THE LINKS PASS (2026-08-16): the tile IS the link, so the
              // drawing, the title and the origin line all reach the project
              // rather than only the name. `display: block` keeps it an
              // ordinary grid child; pr-link adds no ink, so p19 prints
              // exactly as it did (her ruling: the index stays a drawn object).
              <PrLink key={w.id} href={`${ORIGIN}/work/${w.id}`} style={{ display: 'block' }}>
                <div className="pr-tile__img">
                  {art ? (
                    <div className="pr-art">{art}</div>
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="pr-mono pr-mono--muted">{w.hero === 'audio' ? 'LISTEN' : w.number}</span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.6mm', marginTop: '1.6mm' }}>
                  <PrLensTick lens={w.lens} size={6} />
                  <span className="pr-body" style={{ fontSize: '8pt', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                    {title}
                  </span>
                </div>
                {/* The sheet number LEFT this line (2026-08-12). "P-108 · SOMA"
                    said two things and only one of them meant anything to a
                    reader holding the book: the number is an internal id and
                    the origin is the institution. Twenty-one of them were a
                    third of the page’s text for no return. */}
                <div className="pr-mono pr-mono--muted" style={{ marginTop: '0.6mm' }}>
                  {w.origin}
                  {w.recognition ? (
                    <>
                      {' · '}
                      <RecognitionMark size={6} />
                    </>
                  ) : null}
                </div>
              </PrLink>
            )
          })}
        </div>
        {/* NINE, RELABELED (Emilie, 2026-08-18, closing the audit’s C30). The
            2026-08-12 ruling said ten but the code shipped nine from birth;
            shown both, she kept nine and renamed the header so it stops
            implying the full eighteen. They are already ordered newest first. */}
        {/* 12mm above, was 5 (her F ruling, 2026-08-19: the title stays 20pt,
            "but have some vertical space between the project and the thoughts
            since we have the space"). Measured: 16.3mm of slack sat above the
            foot while the two sections nearly touched; 7mm of it moves up
            here, so the break reads 12 / 9.3 instead of 5 / 16.3. */}
        <h3 className="pr-kicker" style={{ margin: '12mm 0 2.2mm' }}>THE LATEST THOUGHTS</h3>
        <ThoughtIndexRows skin="print" limit={9} columns={3} />

        {/* THE FOOT, in the book-wide structure since round 4 (2026-08-19):
            link left, the legend + counts in the middle, folio right. Colour
            still never means alone: this is where the ticks get named. */}
        {/* Round 6 (Emilie, 2026-08-19): the site link prints lowercase like
            every other foot link, the legend holds the middle alone, and the
            counts join the folio at the right edge. */}
        <div className="pr-index__foot">
          <span className="pr-mono pr-mono--muted">
            <PrLink href={ORIGIN}>{SITE}</PrLink>
          </span>
          {/* The SHORT lens names here, not the long ones: on a foot rule the
              full "COMPUTATION & RESEARCH" pushed the counts onto a second
              line. The long labels still lead each project page. */}
          <div className="pr-legend pr-kicker">
            {(Object.keys(LENSES) as Lens[]).map(l => (
              <span key={l}>
                <PrLensTick lens={l} size={6} /> {LENSES[l].short.toUpperCase()}
              </span>
            ))}
            <span>
              <RecognitionMark size={6} /> RECOGNITION
            </span>
          </div>
          <span className="pr-kicker">
            {WORK_ENTRIES.length} PROJECTS · {THOUGHTS.length} THOUGHTS
            <Folio n={BOOK_PAGE_COUNT - 1} side="recto" />
          </span>
        </div>
      </div>
    </A4Page>
  )
}

/* ---- 4 · THE ABOUT PAGE ---------------------------------------------------
   THE CV CAME OUT (Emilie, 2026-08-12): "I am thinking of removing the CV and
   instead have an about instead and the index in this book design page."

   She was right and the reasons are worth keeping, because the CV page had
   survived two rounds of improvement before anyone asked whether it belonged.
   It was the ONE page in the book wearing another document’s typography (the
   CV’s pink rules, its icons, its 6.1pt body). It spent about six hundred words
   before a reader had seen a single project. Its right half was 60% empty. And
   it duplicated a document that already ships twice, as /cv and as a separate
   one-page PDF beside this one.

   HER PICK: option 03·B, "the book’s own grammar" with the ink. This page wears
   a PROJECT PAGE’S LAYOUT, at the same coordinates: the meta line at 46mm, the
   title at 58mm, the standfirst at 74mm, the columns from 100mm, the foot rule
   at 196mm, and page one’s 32mm white shoulder above all of it. So the book
   teaches its own structure one page before Sensi uses it.

   THE WORDS ARE NOT NEW. The prose is the landing BIO rendered verbatim from
   landing/identity.ts, which Emilie signed on 2026-08-06 and whose closing
   paragraph she wrote herself at round seven. Nothing on this page ships draft,
   which is the whole reason it reads in her voice: it is her voice.

   THE RECORD COLUMN WAS BUILT AND CUT. A third column carrying two schools,
   four roles and the languages was drawn and offered as the thing the book
   loses when the CV sheet goes. Her ruling, same day: "remove the record. no
   need for it in the book." So the page holds two columns and the white where
   the third one was, and the record lives where it always did, at /cv and in
   the CV PDF. The foot line still points at it. */

/**
 * The BIO’s two variables in italic, and nothing else.
 *
 * A LIST, NOT A HEURISTIC, and that distinction is load-bearing (see
 * landing/identity.ts): "italicise any standalone single letter" would catch
 * every "I" in the first paragraph. LandingCover does the same job for the
 * screen off the same BIO_VARIABLES export, so the two renditions cannot drift.
 */
function renderBioParagraph(para: string): ReactNode[] {
  const vars = new Set<string>(BIO_VARIABLES)
  return para.split(/\b/).map((piece, i) =>
    vars.has(piece) ? <em key={i}>{piece}</em> : <span key={i}>{piece}</span>,
  )
}

function AboutPage() {
  return (
    <A4Page outline="About">
      <div className="pr-about">
        {/* THE VOICE LEADS (her C pick at the about-page audit, 2026-08-19,
            from three drawn options). The masthead had stacked four floors of
            type for two floors of information: the name repeated the cover a
            page after the cover, and the roles line broke her own standing
            rule that the book names no role. Both are GONE. "About" drops to
            the mono kicker register — the same voice as WHO and IN THIS BOOK
            below it — and the page's real headline, her one-line claim, takes
            the masthead at size. The word "About" survives for the bookmark
            panel via data-outline, so the chapter row does not change. */}
        <p className="pr-about__meta pr-kicker">About</p>
        <h2 className="pr-about__stand">{VOICE}</h2>

        {/* data-must-fit: the page probe only sees content pushed past the SHEET,
            and this column is absolutely positioned inside a box that is 20mm
            short of it — so a ninth contents row could run through the foot rule
            and print over it while the A4 box stayed exactly A4. Measured on its
            own terms instead. */}
        <div className="pr-about__cols" data-must-fit>
          <div>
            <p className="pr-about__ch">Who</p>
            {BIO.map((para, i) => (
              <p className="pr-about__bio" key={i}>
                {/* THE TWO VARIABLES SET IN ITALIC, the same rendering the
                    landing does off BIO_VARIABLES. A list, not a heuristic:
                    italicising every standalone letter would catch the "I" in
                    paragraph one. See identity.ts for why the variables are
                    variables and must never be resolved into an example. */}
                {renderBioParagraph(para)}
              </p>
            ))}
          </div>
          <div>
            <p className="pr-about__ch">In this book</p>
            {BOOK_SPREADS.map((d, i) => (
              // A CONTENTS ROW POINTS INSIDE THE BOOK, not out at the site
              // (2026-08-16): the row already carries a page number, and a
              // contents line that opens a browser instead of turning to
              // page 09 would be answering a question nobody asked. The
              // plate’s own footer is the way out to the live work.
              <PrLink
                key={d.master.slug}
                href={`#${plateAnchor(d.master.slug)}`}
                className="pr-about__row"
              >
                {/* HER INK (option 03·B). Each of the eight carries its own
                    parti, the same drawing the index page gives all twenty-one
                    seventeen pages later. The mark sits BESIDE the name it
                    belongs to, which is what makes it a key rather than
                    decoration: the rejected 03·C ran them as a band across the
                    shoulder, where they floated free of their titles. */}
                {/* ⚠ THE .pr-art WRAPPER IS LOAD-BEARING, not decoration.
                    Every shape in an artifact carries a class (ln, th, dt, ac)
                    and print.css styles them as `.pr-art .ln` and so on. Drawn
                    without the wrapper the selectors never match, so the shapes
                    fall back to the SVG default of FILLED BLACK WITH NO STROKE
                    and eight line drawings print as eight solid blobs. It looked
                    like an icon-size problem for a whole round and was a missing
                    div. The index page has always had it, which is why the same
                    drawings are correct seventeen pages later. */}
                <span className="pr-about__parti">
                  <div className="pr-art">{WORK_ARTIFACTS[d.entry.id]}</div>
                </span>
                <span className="pr-about__ti">{d.master.title}</span>
                {/* THE ORIGIN JOINS THE CONTENTS (Emilie, 2026-08-16). Six of
                    the eight plates are MaCAD and the two with a client sit at
                    pages 15 and 17, so a reader skimming page two met eight
                    titles that all looked like the same kind of thing. The
                    index has always printed this stamp under every tile; the
                    front of the book simply was not doing what the back does.
                    Her ruling in the same breath: the ORDER does not move. The
                    practice pages stay last, because they are the closing
                    answer to "has she done this for real" rather than the
                    opening claim. This only lets a reader SEE that the answer
                    is in there, seventeen pages before they reach it. */}
                <span className="pr-mono pr-mono--muted pr-about__origin">{d.entry.origin}</span>
                <PrLeader />
                <span className="pr-mono pr-mono--muted">{String(3 + i * 2).padStart(2, '0')}</span>
              </PrLink>
            ))}
            <PrLink href={`#${INDEX_ANCHOR}`} className="pr-about__row pr-about__row--rest">
              <span className="pr-about__ti">Everything else, and the thoughts</span>
              <PrLeader />
              <span className="pr-mono pr-mono--muted">{BOOK_PAGE_COUNT - 1}</span>
            </PrLink>
          </div>
        </div>

        <div className="pr-about__rule" />
        {/* Round 4 (2026-08-19): the about joins the book-wide foot structure
            — link left (underlined like every project link; "THE FULL
            RECORD" label removed by her ruling), folio right. The gloss
            legend stays gone (round 3). */}
        <div className="pr-about__foot">
          <span className="pr-mono pr-mono--muted">
            <PrLink href={`${ORIGIN}/cv`}>{SITE}/cv</PrLink>
          </span>
          <Folio n={2} side="recto" />
        </div>
      </div>
    </A4Page>
  )
}

/* ---- 5 · THE COLOPHON ---------------------------------------------------- */

function Colophon() {
  return (
    <A4Page outline="Contact">
      {/* pr-colophon exists so the dotted link mark can reach this page’s three
          addresses without reaching the index or the about (2026-08-16). It
          carries no styles of its own. */}
      <div className="pr-colophon" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '7mm' }}>
        {/* THE EMBLEM IS THE DOOR (Emilie, round 2, 2026-08-18): asked whether
            the site URL should return, she chose the quieter form — press the
            logo and it takes you there. The © line stays clean. */}
        <PrLink href={ORIGIN} aria-label="emiliechidiac.com">
          <LogoMark size={88} />
        </PrLink>
        {/* The landing’s signed caption, with the ask SHE wrote at the book
            audit (Emilie, 2026-08-18): the last page now asks the reader one
            question instead of only looking back at the book. Her words. */}
        <p className="pr-dek" style={{ margin: 0 }}>this is what’s on my mind. what’s in yours?</p>
        {/* THE LAST PAGE IS THE ONE THAT HAS TO WORK (2026-08-16). These three
            were the whole point of the links pass: a reader who reaches the
            colophon has decided to get in touch, and until now the file
            answered that by making them retype an address. */}
        <div style={{ display: 'flex', gap: '5mm' }}>
          <span className="pr-mono">
            <PrLink href="mailto:chidiacemilie@gmail.com">chidiacemilie@gmail.com</PrLink>
          </span>
          <span className="pr-mono pr-mono--muted">·</span>
          <span className="pr-mono">
            <PrLink href="https://linkedin.com/in/EmilieElChidiac">linkedin.com/in/EmilieElChidiac</PrLink>
          </span>
          <span className="pr-mono pr-mono--muted">·</span>
          <span className="pr-mono">
            <PrLink href="https://github.com/hi-em">github.com/hi-em</PrLink>
          </span>
        </div>
        {/* The sanctioned functional touch (§9’s UPDATED line), nothing more:
            the "rendered from the live site" provenance line the critique
            flagged left; unsigned voice stays off the page. */}
        {/* THE OWNERSHIP LINE (the rights pass, 2026-07-30). A book that hands
            21 projects to a stranger with no notice anywhere in it reads
            unfinished, and the colophon is where a book has always said this.
            It joins the EXISTING muted line rather than adding a row, so
            BOOK_PAGE_COUNT cannot move and the render script’s page assertion
            still holds. The credits themselves are NOT here: they are woven
            into every spread’s meta row, which is the better place for them.
            The ATS CV gets nothing; a © line is noise to a résumé parser.
            ⚠ THE YEAR IS BACK AND THE URL IS GONE BY HER RULING (2026-08-18):
            "remove updated in august 2026 and just have © emilie el chidiac
            2026". This knowingly reverses the no-year rationale that used to
            live here; the site link still reaches from the cover and the
            index foot, so the guard’s colophon assertions (mailto, LinkedIn,
            GitHub) are untouched. */}
        <span className="pr-mono pr-mono--muted">© EMILIE EL CHIDIAC 2026</span>
      </div>
    </A4Page>
  )
}

/* ---- The book ------------------------------------------------------------ */

// The book’s page count: cover + about + TWO pages per project + index +
// colophon. The render script asserts the PDF matches this exactly (a page
// that silently overflows or vanishes fails the build).
export const BOOK_PAGE_COUNT = BOOK_SPREADS.length * 2 + 4

export default function PrintBook() {
  // THE ORDER (Emilie, 2026-08-12): cover, then the about and the book’s own
  // contents, then the work, then the index, then the colophon. Page 2 was the
  // CV for one day; it became the ABOUT in the same session, and the page count
  // did not move.
  //
  // It costs one thing, recorded so nobody re-derives it: projects now START ON
  // AN ODD PAGE, so a project’s two pages are no longer a facing pair in a
  // bound copy. That only matters if this is ever printed and bound, and never
  // on a screen, so it was traded knowingly rather than defended.
  let page = 2 // 1 is the cover, 2 is the about
  const spreadPages = BOOK_SPREADS.flatMap((data, i) => {
    const left = (page += 1)
    const right = (page += 1)
    return [
      <Spread key={data.master.slug} data={data} side={sideOf(left)} plate={i + 1} page={left} />,
      <AssetPage key={`${data.master.slug}-assets`} data={data} side={sideOf(right)} plate={i + 1} page={right} />,
    ]
  })
  const indexSide = sideOf(++page)

  return (
    <>
      <Cover />
      <AboutPage />
      {spreadPages}
      <IndexPage side={indexSide} />
      <Colophon />
    </>
  )
}
