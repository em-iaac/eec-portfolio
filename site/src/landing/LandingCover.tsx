// THE LANDING (Session R1; THE SCROLL, Emilie's gate 2026-07-27).
//
// It used to be a fixed, non-scrolling frame with the mind-graph filling it.
// It read beautifully in two minutes and said almost nothing in ten seconds,
// which is the only budget a recruiter gives it: the initial portfolio scan is
// 6 to 10 seconds, 57% of viewing time is spent above the fold, and the thing
// that has to land in that window is role, then work. Three of those were
// missing outright. The job title existed only in the <title> tag and the
// /work footer; the MaCAD award appeared nowhere on the landing at all; and
// there was no piece of proof, only a drawing of where the proof lives.
//
// SO THE LANDING SCROLLS NOW, in four movements:
//   1. the identity + the two hover STRIPS (landing/Strips.tsx)
//   2. a flat SELECTION of the work, the accessible path to the same tiles
//   3. the THOUGHTS index rows
//   4. the BIO and, closing the page, the mind-graph
//
// THE MIND-GRAPH MOVED, it did not go. Emilie's call at the gate: it belongs
// at the end, beside the bio, "where a reader arrives at it" instead of a
// stranger being asked to decode it before they know who drew it. It is the
// same artwork, the same lazy chunk, the same error boundary.
//
// /work AND /thoughts STAY PAGES. The landing's job is a ten-second yes; the
// browse room's job is browsing, and the 21-tile grid is already good at it.
// Merging them made the top of the page stop feeling like an answer.
//
// Copy: ADJECTIVES / VOICE were SIGNED at G4 (2026-07-12); the WINK was signed
// with them and CUT on 2026-08-06 (identity.ts carries why). ROLE is the
// title the site already declared to search engines, said out loud. BIO
// is NEW and UNSIGNED (see identity.ts).
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import ExploreErrorBoundary from '../components/ExploreErrorBoundary'
import Footer from '../components/Footer'
import Footline from '../components/Footline'
import LogoMark from '../components/LogoMark'
import TitleBlock from '../components/TitleBlock'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import useIsDesktop from '../hooks/useIsDesktop'
import useHeaderCollapse from '../hooks/useHeaderCollapse'
import MindGraphSrNav from './MindGraphSrNav'
import { PRERENDERING } from '../lib/prerender'
import Strips, { HorizontalBelt, PauseToggle, STRIP_PROJECTS, StripTile, ThoughtTile } from './Strips'
import { starPath } from './mindGraph'
import { assertPaletteMatchesTheme } from './palette'
import { RED_LINK } from '../lib/linkStyles'
import { ENTRIES, thoughtIndexEntries } from '../data/registry'

// The artwork is split out of the entry chunk (LCP, 2026-07-12): the honest
// DOM hero paints without it. Now that it closes the page rather than filling
// it, the split matters more, not less. The chunk failing to load degrades
// through the same error boundary as a render throw.
const MindGraph = lazy(() => import('./MindGraphView'))

// SIGNED (G4, 2026-07-12) + the 2026-07-27 additions. See identity.ts.
import { ADJECTIVES, BIO, BIO_VARIABLES, VOICE } from './identity'

// THE BIO'S VARIABLES, IN ITALIC (Emilie, 2026-08-06). The closing line ends on
// the general form of the question the instruments ask, "what is x doing to y?",
// and the two letters are variables rather than words. Italic is the convention
// that says so; rendered in roman beside it, she read the roman version as a
// placeholder nobody had filled in, and picked this one.
//
// It splits on the NAMED tokens from identity.ts, never on a heuristic: any rule
// like "a standalone single letter" would have italicised every "I" in the first
// paragraph. `\b` around an alternation of the exact tokens, so the capture
// groups land on odd indices and everything else passes through as plain text.
// landing/bio.test.ts holds the count to exactly one of each.
const BIO_VAR_RE = new RegExp(`\\b(${BIO_VARIABLES.join('|')})\\b`, 'g')

function withVariables(para: string): ReactNode {
  const parts = para.split(BIO_VAR_RE)
  if (parts.length === 1) return para
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="italic">
        {part}
      </em>
    ) : (
      part
    ),
  )
}

// (The door list moved with the search to components/SiteSearch.tsx, which was
// its only consumer: the header pill has always carried its own NAV.)

// THE PROOF (2026-07-27). Sensi: the award-winning project, and the only one
// whose award the landing names. Everything here is READ FROM THE RECORD, not
// re-typed: the award wording is the registry award entry's own title (minus
// its "(Sensi)" disambiguator, since the project is named right beside it), so
// the landing can never drift from the CV, the showcase or the book.
// NeuroSpace's live demo is deliberately NOT the proof: its Rhino Compute
// server is dead and the site already says so honestly.
const PROOF_ID = 'sensi'
const PROOF_AWARD = ENTRIES.find((e) => e.kind === 'award' && e.refId === PROOF_ID)
// THE FACE WEARS THE /WORK SPELLING (Emilie's ruling 2026-08-20, the
// moving-parts audit). The derived long form — "MaCAD Awards 2026 · winner" —
// overflowed the tile by a measured 42px at 1280 and 24px at 390, so every
// belt narrower than 1440 printed "MACAD AWARDS 2026 · W…": the WINNER was
// the part being cut. The signed face form in the master (awardShort,
// "MACAD '26 WINNER", signed 2026-07-10) fits every tile width and is the
// same face the /work card already wears — one award, one spelling, on every
// card face; the full line stays on the sheet, the CV and the book.
// The master meta file is ~2KB of strings (the prose lives in the spine
// chunk), so the landing's no-heavy-imports rule holds.
import sensiMeta from '../content/projects/sensi'
const AWARD_SHORT = sensiMeta.awardShort ?? PROOF_AWARD?.title ?? ''

const THOUGHTS = thoughtIndexEntries()
const THOUGHT_COUNT = THOUGHTS.length

const KICKER = 'block font-mono text-micro tracking-[0.14em] text-[var(--lang-ink-muted)] uppercase'

// (The landing's own AwardMark component retired 2026-08-02, with the 280px
// lead card it was built for. AWARD_SHORT above survives and is what matters:
// it is passed to the Sensi tile's `awardLabel`, so the recognition now rides
// the same tile face on the phone as it does in the desktop column, one piece
// of markup instead of two. In ink, never red, never a box, REDESIGN-SPEC §1.)

// The mark legend, rendered as REAL 1:1 marks (not glyphs) so the key matches the
// field exactly. Ink only, never a lens colour (shape-tick + label rule). It
// travels with the graph to the foot of the page: a key belongs beside the
// drawing it explains, not on the first screen where there is nothing to read.
function LegendMarks() {
  const marks: [string, ReactNode][] = [
    ['PROJECT', <circle key="p" cx="7" cy="7" r="4" fill="var(--lang-ink)" />],
    [
      'THOUGHT',
      <circle key="t" cx="7" cy="7" r="3.4" fill="none" stroke="var(--lang-ink)" strokeWidth="1.4" />,
    ],
    [
      'AWARD',
      <path
        key="a"
        d={starPath(7, 7, 5.5)}
        fill="var(--lang-ink)"
        style={{ filter: 'drop-shadow(0 0 2px color-mix(in srgb, var(--lang-ink) 55%, transparent))' }}
      />,
    ],
  ]
  return (
    <>
      {marks.map(([label, mark]) => (
        <span key={label} className="inline-flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="overflow-visible">
            {mark}
          </svg>
          <span className="font-mono text-micro tracking-[0.14em] text-[var(--lang-ink-muted)] uppercase">{label}</span>
        </span>
      ))}
    </>
  )
}


// THE PHONE'S BELTS (Emilie, 2026-07-27; rebuilt to her ruling 2026-08-02:
// "the belts should move just like the desktop landing page but instead
// horizontally, and I don't want sensi to be bigger, let's keep it the same as
// the desktop, it moves with the stop button and all, same for the thoughts,
// all same size and they move").
//
// So: EVERY TILE IS THE SAME TILE. The 280px lead card built earlier that day
// is gone, and with it the last place where the phone was a different design
// rather than the same one lying down. Sensi is an ordinary tile carrying the
// spelled-out award on its face, exactly as it does in the desktop column.
//
// THE ONE THING THAT IS NOT LIKE THE DESKTOP, and it is deliberate: Sensi is
// FIRST here, not two tiles in. The desktop rotation exists to drop the award
// to the middle of a tall column where the mask is clear; a row 390px wide has
// no middle, and a proof tile starting off screen would undo the ten-second
// scan this landing was rebuilt around.
//
// The tiles are 200px, not the old 168. At 168 the award line truncated, and a
// tile that cannot finish saying "MACAD '26 WINNER" is a tile carrying no
// award. 200 still leaves the next tile visibly cut by the frame, which is the
// row's own invitation to push it.
function PhoneProof({ paused }: { paused: boolean }) {
  return (
    <div className="space-y-2.5 lg:hidden">
      <HorizontalBelt
        label={`The work · ${STRIP_PROJECTS.length} projects`}
        paused={paused}
        items={(tabbable) =>
          // `tabbable` is false on the loop's SEAM copy, so it is also the flag
          // for "this tile is a duplicate": it namespaces the key (both runs
          // render the same ids as siblings) and hides the copy from the
          // accessibility tree. Both jobs used to belong to a wrapper element,
          // which made an <li> the parent of an <li> (see HorizontalBelt).
          STRIP_PROJECTS.map((p) => (
            <li
              key={tabbable ? p.id : `seam-${p.id}`}
              aria-hidden={tabbable ? undefined : 'true'}
              className="mr-2.5 w-[200px] shrink-0"
            >
              <StripTile
                project={p}
                tabbable={tabbable}
                awardLabel={p.id === PROOF_ID ? AWARD_SHORT : undefined}
              />
            </li>
          ))
        }
      />
      {/* The second belt runs the other way, the same reason the desktop's
          second column does: two rows travelling together read as one belt cut
          in half. */}
      <HorizontalBelt
        label={`The thoughts · ${THOUGHT_COUNT} notes`}
        paused={paused}
        reverse
        // 232px, NOT the project tile's 200 (Emilie, 2026-08-02: "behavior
        // information modeling is 2 lines instead of one like all the other...
        // we can change the width of this one instead of having two lines").
        // Measured at 13px serif italic: the longest title runs 184px and the
        // card left it 151, so exactly one leaf in the belt wrapped and broke
        // the row's rhythm. 232 was tried first and left it 183px against a
        // 184px title, still wrapping by ONE pixel; 240 gives it 191px, which
        // is 7px of slack for the font metric differences between her phone and
        // this machine. Every other title was already well inside it.
        // It knowingly gives up the equal width agreed earlier the same day:
        // the titles reading as a set matters more than two separate rows
        // measuring the same, and a horizontal belt has width to spend where a
        // grid would not.
        items={(tabbable) =>
          THOUGHTS.map((t) => (
            <li
              key={tabbable ? t.id : `seam-${t.id}`}
              aria-hidden={tabbable ? undefined : 'true'}
              className="mr-2.5 w-[240px] shrink-0"
            >
              <ThoughtTile
                id={t.id}
                title={t.title}
                route={t.note?.route ?? '/thoughts'}
                date={t.date}
                tabbable={tabbable}
              />
            </li>
          ))
        }
      />
    </div>
  )
}

// The header that reads the scroll now lives in hooks/useHeaderCollapse.ts:
// Emilie extended it to every page on 2026-08-04, so the landing shares the
// hook rather than owning a private copy that could drift from the rooms'.

export default function LandingCover() {
  // (THE OVERTURE RETIRED at Emilie's cut, 2026-07-27: see index.css. The
  // column's tiers now simply arrive.)
  const [collapsed, openHeader] = useHeaderCollapse()
  const [beltsPaused, setBeltsPaused] = useState(false)
  // ONE BELT SYSTEM IN THE DOM AT A TIME (the phone pass, 2026-08-02). Both
  // used to be built and one hidden with `display: none`; on a phone that was
  // 1150 of 1980 nodes and 40 of 60 images belonging to columns it can never
  // show. hooks/useIsDesktop.ts has the measurement and why it is read
  // synchronously. The `lg:hidden` / `hidden lg:flex` classes STAY on the two
  // blocks: the hook decides what is built, the classes still decide what is
  // seen, and a resize across the breakpoint is then correct in both.
  const isDesktop = useIsDesktop()

  useEffect(() => {
    assertPaletteMatchesTheme()
  }, [])

  // (The lag hunt came and went 2026-08-20, all in one day: a ?glass=off rung
  // cleared the backdrop-blur — off felt NO smoother, the glass stays — and a
  // ?snap=1 rung caught the real cause: sub-pixel shimmer at fractional
  // display scaling, now baked as the device-pixel snap in useBeltDrift. The
  // ladder, the ?probe readout and this page's part in them are gone.)

  return (
    // THE LANDMARKS SIT OUTSIDE MAIN (accessibility audit, 2026-07-27). The
    // whole page used to be one <main>, with the header pill and the footer
    // nested inside it. A <header> or <footer> inside <main> is NOT a banner or
    // contentinfo landmark, so the landing was the one page on the site
    // offering neither, while every interior page (SheetPage puts them outside)
    // offers both. A screen-reader user's landmark list simply lost the way in
    // and the way out. They are siblings of <main> now, matching SheetPage.
    <>
      {/* THE HEADER (Emilie's call, 2026-07-27). The landing was the ONE page
          without the site's floating pill, because it was a fixed frame with
          nowhere to go. A scrolling page needs persistent nav: without it the
          bio and the graph at the foot are two screens from any way out. So
          the landing adopts the SAME TitleBlock every interior page carries,
          pixel-identical, and it STICKS. The jump bar rides the pill's tools
          slot, which is where a site-wide search belongs on a long page.
          Note the pill lights no door here: activeDoor('/') is -1 by design,
          and the cube mark is already the way home. */}
      {/* pointer-events-none on the STICKY WRAPPER, not just on TitleBlock's
          own strip: the wrapper is a full-width band that content scrolls
          under, and without this it eats every hover and click in the ~70px
          it covers. The pill and the search re-enable their own events. */}
      {/* THE SKIP LINK. Every interior page gets one from SheetPage; the
          landing does not use SheetPage and never needed one, because it was a
          fixed frame with about ten tab stops. Making the belts focusable took
          it to fifty-two, thirty-five of them tiles, which means a keyboard
          user would tab every project and every note before reaching the bio.
          This jumps the belts. It is the standard sr-only-until-focused
          pattern, worded for what it actually does. */}
      <a
        href="#doors-heading"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-[var(--r-pill)] focus:bg-[var(--lang-interaction)] focus:px-4 focus:py-2 focus:font-mono focus:text-nav focus:text-[var(--lang-ground)]"
      >
        {/* Worded for BOTH layouts: there are no columns on a phone, so
            "skip the columns" would be a promise about furniture that is not
            there. Naming the destination works everywhere. */}
        Skip to the rooms
      </a>

      {/* THE FADE UNDER THE HEADER (Emilie, 2026-07-27: "the header pill
          sticks but it should not overlap the actual content, so the content
          should fade so the header stays clean"). A fixed wash of the ground,
          full width, sitting BETWEEN the content and the pill: content
          dissolves into the page as it travels under the header instead of
          sliding behind a floating object. It is decorative and inert
          (pointer-events-none), so nothing underneath loses a click, and it
          never animates, so reduced motion sees exactly the same thing. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-30 h-[104px]"
        style={{
          background:
            'linear-gradient(to bottom, var(--lang-ground) 0%, color-mix(in srgb, var(--lang-ground) 88%, transparent) 46%, transparent 100%)',
        }}
      />
      {/* onFocusCapture opens the pill whenever focus lands anywhere inside it:
          a keyboard user cannot "scroll up" to get their nav back. */}
      <div
        className="pointer-events-none sticky top-0 z-40"
        onFocusCapture={openHeader}
      >
        {/* No `tools`: the search is TitleBlock's own now (components/
            SiteSearch.tsx), on all five main rooms rather than this one page.
            The default toolsKey is deliberate — landing, /cv and /contact all
            render a search-only box of identical size, so sharing one
            view-transition name lets it sit still across those three. */}
        <TitleBlock collapsed={collapsed} onExpand={openHeader} />
      </div>

      <main
        id="main"
        tabIndex={-1}
        aria-label="Emilie El Chidiac, Design Technologist"
        className="bg-[var(--lang-ground)] text-[var(--lang-ink)] outline-none"
      >
      {/* ============ ONE · THE IDENTITY AND THE STRIPS ============
          Identity left, the two hover columns right. On anything without a
          hover (below lg) the columns are replaced by the phone's proof
          block: a strip is a pointer mechanic and pretending otherwise on a
          touch screen ships an affordance nobody can reach.
          THE AIR (Emilie, 2026-07-27: "use more white space, let the page
          breathe"). The gutter between column and belts opens 48 -> 80px, the
          belts inset from the right, and the tiles shrink (see Strips.tsx).
          The name and the hand line grow to fill the room that buys. */}
      {/* THE INSET IS THE SAME ON BOTH SIDES (Emilie, 2026-07-27: "the name
          should be a bit more to the right, the inset should be the same from
          both sides"). It was 56px on the left against ~107px on the right,
          because the belts were capped and centred inside their half while the
          name sat on the section's own padding. Now the padding IS the inset
          on both edges (80px at lg, 96px at xl) and the belts run to the right
          edge of it with ml-auto, so the two margins are one number. */}
      {/* pt-7 ON PHONES, WAS pt-2 (the same 2026-08-02 note). Dropping the
          duplicate mark solved which of the two cubes wins; this solves the
          air. 8px of padding under a 70px sticky pill put the name 14px from
          it; 28px puts it at 34px, which reads as a margin rather than a
          near miss. Desktop keeps pt-0: the pill is nowhere near the name. */}
      {/* THE FIRST SCREEN STOPS BEING A FULL SCREEN ON PHONES (Emilie,
          2026-08-02, from her screenshot: "the space between the doors and the
          belt is a lot"). `min-h: 100svh - 4.25rem` forced this section to a
          whole viewport whether or not it had a viewport of content. On desktop
          it does, and the height is what the two belt columns are measured
          against. On a phone the block ends after the second belt and the pause
          button, so the remainder was several hundred pixels of nothing between
          the belts and the doors. Below lg the section is simply as tall as
          what is in it, and `pb-6` leaves one gap rather than a gulf. */}
      <section className="relative flex flex-col px-6 pt-7 pb-6 lg:min-h-[calc(100svh-4.25rem)] lg:flex-row lg:items-stretch lg:gap-16 lg:px-20 lg:pt-0 lg:pb-20 xl:gap-20 xl:px-24">
        {/* THE NAME SITS LOW (Emilie, 2026-07-27: "maybe the name would go down
            instead of the middle, hinting at the scrolling"). The identity
            block is bottom-anchored on lg, so the air stacks ABOVE it and the
            eye is left with somewhere to go. Centring it made the column look
            finished; low, it reads as the start of something. */}
        <div className="flex shrink-0 flex-col lg:w-[470px] lg:justify-end lg:pb-[12vh] xl:w-[500px]">
          <header className="flex flex-col">
            {/* TIER 1 — name. THE NAME, ON THE WIDTH AXIS (Emilie,
                2026-07-26; DL amendment 24): a round size condensed to
                --wdth-fit rather than a fit-by-trial decimal. */}
            <div className="flex items-center gap-3">
              {/* THE MARK STANDS DOWN ON PHONES (Emilie, 2026-08-02: "the
                  header pill and the name with the logo are too close to each
                  other, so either we reorganize or remove it from somewhere in
                  the phone version"). Measured at 390: the pill's bottom edge
                  at 70px, this mark's top at 84px. Fourteen pixels, and the
                  SAME cube on both sides of them, because the pill carries the
                  mark as its home button. Two marks arguing over 14px is the
                  collision; one of them is redundant, and it is this one, since
                  the pill's is also the way home. From lg up the pill sits far
                  from the name and both have earned their place. */}
              <LogoMark size={40} className="hidden shrink-0 lg:block lg:size-[46px]" />
              <h1
                className="font-display text-[30px] font-semibold leading-[0.98] tracking-[0.01em] whitespace-nowrap text-[var(--lang-ink)] sm:text-[45px] lg:text-[46px]"
                style={{ fontStretch: 'var(--wdth-fit)' }}
              >
                Emilie El Chidiac
              </h1>
            </div>

            {/* TIER 2a — the role adjectives (signed G4; full ink since the
                S2 council gate, ARCHIVO condensed since the width-axis gate).
                THE ROLE LINE RETIRED here (Emilie's cut, 2026-07-27): the
                title "Design Technology Architect" shipped above this row for
                one build and she took it out, keeping the four adjectives as
                the whole claim. It still names the site in the <title> tag and
                on the /work footer. The council's ruling holds: this row rides
                FULL INK, because at muted it read as decoration before
                information. */}
            <p
              // ONE LINE ON A PHONE (Emilie, 2026-08-02). At 12px the four
              // adjectives measure 360px against the 342px the column gives at
              // 390, so they wrapped, and a role line that breaks mid-list
              // reads as two half-claims. 11px measures 333px: it fits with 9px
              // to spare and stays above the readable floor. Nothing below sm
              // changes, and sm up is untouched at 14px.
              className="mt-5 font-display text-[11px] leading-relaxed tracking-[0.04em] text-[var(--lang-ink)] lowercase sm:text-[14px]"
              style={{ fontStretch: 'var(--wdth-fit)' }}
            >
              {ADJECTIVES}
            </p>

            {/* TIER 2b — the positioning voice line, a warm-ink HANDWRITTEN
                note (Emilie, 2026-07-09). It grows to 33px on lg: the doors
                and the search left this column for the header, and the air
                they freed is spent on the sentence, not left as a hole. */}
            <p className="mt-3 font-hand text-[21px] leading-tight text-[var(--lang-hand-warm)] sm:whitespace-nowrap sm:text-[30.97px] lg:text-[33px]">
              {VOICE}
            </p>

            {/* (THE RECOGNITION LINE RETIRED from the identity column at the
                same cut. Her direction: "remove the MaCAD Awards 2026 line, if
                anything make it more obvious in the card." So the award now
                rides the WORK ITSELF — the phone's proof card and Sensi's tile
                in the strip — where it is attached to the thing it recognises
                instead of floating in the biography.)

                (THE DOORS AND THE SEARCH LEFT TOO, 2026-07-27: they are the
                sticky header's job now. The identity column is PURE IDENTITY,
                which is why the hairline rule that used to separate the two
                went with them: there is nothing left to separate.) */}
          </header>

          {/* The phone's belts ride INSIDE the identity column so the whole
              first screen is one measure at 390. */}
          {/* THE PAUSE BUTTON REACHES THE PHONE (Emilie, 2026-08-02: "it moves
              with the stop button and all"). The rows drift now, so WCAG 2.2.2
              applies to them exactly as it does to the desktop columns, and the
              same single control governs both. It sits at the end of the block
              rather than above it, for the reason it is cornered on desktop: it
              is chrome, not a heading. */}
          {isDesktop ? null : (
            <div className="mt-6">
              <PhoneProof paused={beltsPaused} />
              <div className="mt-2 flex justify-end">
                <PauseToggle paused={beltsPaused} onToggle={() => setBeltsPaused((p) => !p)} />
              </div>
            </div>
          )}

        </div>

        {/* THE STRIPS · lg+ only, and pointer-only by design (Strips.tsx).
            The height is EXPLICIT (the viewport less the header band and the
            section's own bottom padding), not inherited: the track holds 42
            tiles, so a column with no definite height simply grows to
            forty-two tiles tall and takes the whole page with it. This is the
            frame the mask and the loop are measured against. */}
        {/* THE BELTS COME OFF THE RIGHT EDGE (Emilie, 2026-07-27). Flush right
            put them directly under the header's search pill, so the page had no
            air beneath "/ jump to anything". They now stop a gutter short, and
            THE PAUSE LIVES IN THAT GUTTER: right beside the belts, bottom
            aligned, which is both what she asked for and what makes the gutter
            read as a deliberate margin rather than a gap. */}
        {/* pr-12/pr-20 pulls the whole belt block further off the right edge
            (Emilie, 2026-07-27, second pass), so the air under "/ jump to
            anything" is unmistakably deliberate. The pause travels with it. */}
        {/* min-w-0 IS LOad-BEARING, not tidiness: a flex item defaults to
            min-width:auto, so without it this region refuses to shrink below
            its belts' min-content width and pushes the whole page sideways.
            Measured at 1024 before the fix: scrollWidth 1147 against a 1009
            viewport, i.e. 138px of horizontal scroll on the landing.
            THE RIGHT PADDING steps up with the width (Emilie: keep the belts
            clear of the header search). It can only step up where there is
            room: at 1280 the belts are still being squeezed by the identity
            column, so the big inset waits for 2xl, where they are capped at
            500px and the padding costs them nothing. */}
        <div className="hidden min-h-0 min-w-0 flex-1 gap-4 lg:flex lg:h-[calc(100svh-9.25rem)] lg:pr-8 xl:pr-16 2xl:pr-44">
          {!isDesktop ? null : <>
          {/* THE PAUSE COMES FIRST IN THE DOM, and `order` puts it back on the
              right (accessibility audit, 2026-07-27). It was reachable only
              after all thirty-six belt links: a keyboard user had to tab
              through the moving content to reach the control that stops it,
              which is the wrong way round for WCAG 2.2.2. `order` moves the
              picture, never the tab sequence, so the control now precedes what
              it governs and still sits in the corner Emilie put it in.
              (:focus-within already halts the belts the moment focus lands in
              them, so this is belt-and-braces rather than the only stop.) */}
          <div className="order-2 flex w-11 shrink-0 flex-col justify-end pb-1">
            <PauseToggle paused={beltsPaused} onToggle={() => setBeltsPaused((p) => !p)} />
          </div>
          <div className="order-1 min-w-0 flex-1">
            <Strips awardProjectId={PROOF_ID} awardLabel={AWARD_SHORT} paused={beltsPaused} />
          </div>
          </>}
        </div>

        {/* THE SCROLL CUE, CENTRED AT THE FOOT (Emilie, 2026-07-27: "the
            projects and notes hint would be nicer in the middle"). It spans the
            whole first screen rather than the identity column, so it belongs to
            the page and not to the biography.
            AN ORNAMENT AFTER ALL (her ruling 2026-08-21: "do not let the user
            press the works 21 projects 18 notes with the down arrow — it's
            just a directional sign"). It was a link for one summer so the
            keyboard had the shortcut a wheel gives everyone else; her call
            outranks that argument — the header pill and the doors below are
            the keyboard's paths, and this line now only points. aria-hidden
            because a sign that repeats what the doors themselves announce is
            noise to a screen reader, not information. */}
        <div
          aria-hidden="true"
          className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-2 px-4 py-3 font-mono text-micro tracking-[0.14em] whitespace-nowrap text-[var(--lang-ink-muted)] uppercase select-none lg:inline-flex"
        >
          <span>
            {STRIP_PROJECTS.length} projects · {THOUGHT_COUNT} notes
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
            <path d="M6 1v9M2.5 6.5 6 10l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ============ TWO · THE TWO DOORS ============
          THE DUPLICATE GRIDS ARE GONE (Emilie, 2026-07-27). The work appeared
          THREE times on this page: in the belts, in a flat grid below them, and
          on the phone inside the proof block as well. The grid existed only
          because the belts were aria-hidden pointer decoration and something
          had to carry the keyboard path. The belts stop on :focus-within now,
          so they hold focus safely and ARE that path, and the grid became pure
          repetition. What is left here is navigation rather than a second copy:
          two large doors that finally have something to offer a visitor who has
          seen the belts. */}
      <nav
        aria-labelledby="doors-heading"
        className="mx-auto w-full max-w-[1100px] px-6 pt-4 pb-2 lg:px-14"
      >
        <h2 id="doors-heading" className="sr-only">
          The rooms
        </h2>
        {/* SIDE BY SIDE ON THE PHONE TOO (Emilie, 2026-08-02: "the work and
            thoughts card door should be maybe smaller"). Stacked, the pair was
            196px each and 427px of section, which is half a phone screen spent
            on two links that the header pill also carries. Paired, both are one
            glance and the section roughly halves, WITHOUT cutting either signed
            line: the saving comes from the two cards sharing a row, not from
            dropping copy. */}
        <ul className="grid list-none grid-cols-2 gap-3 p-0">
          {[
            { to: '/work', name: 'The work', count: `${STRIP_PROJECTS.length} projects`, line: 'Copilots, models and the things they were built to answer.' },
            { to: '/thoughts', name: 'The thoughts', count: `${THOUGHT_COUNT} notes`, line: 'The questions underneath the work, written as they came.' },
          ].map((d) => (
            <li key={d.to} className="flex">
              <Link
                to={d.to}
                viewTransition
                className="lang-glass-1 lang-lift flex w-full flex-col justify-between gap-3 rounded-[var(--r-card)] px-4 py-4 no-underline transition-colors hover:border-[var(--lang-ink-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)] sm:gap-6 sm:px-6 sm:py-6"
              >
                <span className={KICKER}>{d.count}</span>
                {/* The title and OPEN sit on one line from sm up. At 390 the
                    card is 165px wide and "The thoughts" plus "OPEN >" measure
                    171px together, so on a phone they stack instead of
                    colliding. */}
                <span className="flex flex-col items-start gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                  {/* ONE RUNG DOWN ON PHONES (Emilie, 2026-08-02: "keep them
                      same voice, just make the title smaller text"). Paired at
                      165px wide, "The thoughts" at 30px took two lines and was
                      most of the card's height. --text-lead is the next step in
                      the scale, not a new number: index.css is explicit that a
                      value not already in the scale is a design decision rather
                      than a CSS one, and this needed no new decision. The
                      description stays, in full, in her voice. */}
                  <span className="text-lead font-semibold tracking-[-0.01em] text-[var(--lang-ink)] sm:text-title">
                    {d.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-micro tracking-[0.13em] text-[var(--lang-interaction)] uppercase"
                  >
                    Open &gt;
                  </span>
                </span>
                <span className="font-serif text-nav leading-relaxed text-[var(--lang-ink-muted)]">
                  {d.line}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ============ FOUR · THE BIO, ON THE MIND-GRAPH ============
          THE GRAPH IS THE GROUND NOW (Emilie, 2026-07-27: "the mind graph
          should be in the background, not in its own box, and should appear
          with the scrolling and take a bit more space"). It fills the closing
          section full bleed, the bio reads on top of it, and it FADES IN when
          the section comes into view rather than being there all along. That
          is the whole argument for moving it off the first screen: as a cover
          it demanded to be decoded, as a ground it is the thing the bio is
          written on.
          (The wink used to close this section and was CUT on 2026-08-06. It is
          the mark legend that ends the page now. See identity.ts.) */}
      <MindSection />
      </main>
      {/* inFlow: this footer scrolls, so it must not claim the frozen frame's
          `page-foot` name (see Footer). Outside <main> so it is a real
          contentinfo landmark, as on every interior page. */}
      <Footer inFlow />
      {/* The ownership line, scrolling with the footer it belongs to (rights
          pass round 2, 2026-07-30). The landing does not use SheetPage, so it
          wires its own, exactly as it does for the Footer above. */}
      {/* The landing carries the footer pill, so below sm the credit is inside
          it (Footer.tsx) and this band waits for sm. */}
      <Footline hideOnPhone />
    </>
  )
}

// The closing section, split out because it owns the arrival trigger.
function MindSection() {
  const [lit, setLit] = useState(false)
  const ref = useRef<HTMLElement | null>(null)
  const prm = usePrefersReducedMotion()

  // THE ARRIVAL, BELT AND BRACES, AND BOTH ARE LOAD-BEARING.
  // The observer is the right tool and it is not sufficient on its own:
  // everything driven by the rendering pipeline (IntersectionObserver
  // callbacks AND scroll events alike) is suspended in a page the browser is
  // not painting. Measured 2026-07-27: scrollY moved 0 -> 1221 and the window
  // dispatched exactly zero scroll events, while a hand-rolled observer on
  // this section returned nothing with the section fully in view.
  // The backstop used to be a blind 1.2s timer. That became WRONG the moment
  // the graph started MOUNTING on arrival to get its draw-in: a blind timer
  // mounts it while it is still off screen and plays the whole ceremony to an
  // empty room, which is the exact bug this is meant to fix. So the backstop
  // polls the RECT instead. Reading a bounding box needs no compositor and no
  // events, it just asks where the box is — so it is both reliable and honest
  // about what it is waiting for.
  useEffect(() => {
    const el = ref.current
    // Reduced motion skips straight to lit: no transition, nothing to observe.
    // (MindGraphView renders the identical final composition instantly there,
    // so mounting it early costs nothing and hides nothing.)
    if (!el || prm) {
      setLit(true)
      return
    }
    // WHERE THE TRIGGER SITS IS THE WHOLE DESIGN. Mounting starts a 3.4s
    // ceremony that cannot be paused or rewound, so it must not start until
    // the drawing is genuinely on screen. This section is the LAST thing on the
    // page: fire it as the top edge crosses the fold and the entire animation
    // plays while the graph is a sliver at the bottom of the screen, finishing
    // before it is ever properly in view. That is what "no animation" looked
    // like. Half a viewport in, the graph is a real presence and the visitor is
    // plainly on their way here.
    const arrived = () => el.getBoundingClientRect().top < window.innerHeight * 0.5
    if (arrived()) {
      setLit(true)
      return
    }
    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => entry?.isIntersecting && setLit(true), {
            threshold: 0.18,
          })
    io?.observe(el)
    const poll = window.setInterval(() => {
      if (arrived()) setLit(true)
    }, 350)
    return () => {
      io?.disconnect()
      window.clearInterval(poll)
    }
  }, [prm])

  return (
    <section
      id="about"
      ref={ref}
      aria-labelledby="bio-heading"
      // lg:justify-center drops the prose to the middle of the section so it
      // sits with the drawing rather than above it (Emilie, 2026-07-27: "the
      // about text should be a bit lower so it centres better with the mind
      // graph"). Only the in-flow children move; the graph and its ground are
      // absolute and stay where they are.
      // THE DOORS SIT IN EQUAL AIR (Emilie, 2026-08-02: "the spacing between
      // the doors and the about should be the same as the doors and the
      // belts"). What has to match is what the eye sees, edge of the last
      // drawn thing to edge of the next, not the boxes: the doors carry their
      // own padding on both sides and this section carried 64px more inside its
      // own top. Measured at 390 before: 40px above the door cards against
      // 148px below them, which is why the pair read as belonging to the about
      // rather than as their own band. `mt-0 pt-8` puts the lower gap at 8 + 32
      // = 40, the same number. lg keeps its own rhythm, where this section is a
      // full screen and the margin is doing a different job.
      // `min-h-[86svh]` is back on phones with the drawing: the graph is a
      // ground again, and a ground needs a section tall enough to be one. It
      // went lg-only for the single build where the graph was a fixed band.
      className="relative isolate mt-0 min-h-[86svh] overflow-hidden px-6 pt-8 pb-20 lg:mt-20 lg:flex lg:flex-col lg:justify-center lg:px-20 lg:pt-20 lg:pb-20 xl:px-24"
    >
      {/* THE GROUND. Full bleed behind everything in this section, no box, no
          border. It MOUNTS when the section is half a viewport in, and mounting
          is what starts MindGraphView's own 3.4s choreography: threads sweep in
          one by one, the marks land on them, the labels settle. The same
          ceremony the old cover ran on load, now run on arrival.
          (A scroll-scrubbed version of this was built and removed the same day:
          Emilie wanted the drawing to play itself when you get here, not to be
          tied to the scroll wheel, and not at the cost of a page you keep
          scrolling through.)
          A throw degrades to no-graph (MindGraphSrNav still lists every node)
          while the bio over it stays painted. */}
      {/* THE GRAPH IS FULL BLEED AGAIN (Emilie, 2026-07-27, third pass). It was
          pushed to the right half to stop it colliding with the prose, and that
          cure was worse: a half-width box makes `slice` crop HORIZONTALLY
          instead of vertically, so most of the threads were cut away entirely.
          Back to inset-0, where the container is wider than the drawing's own
          ratio and the crop is a shallow vertical trim.
          THE OVERLAP IS WANTED — her words: the drawing may run under the left
          column. What was NOT wanted is the drawing being unreachable there, so
          the prose is POINTER-TRANSPARENT (below) and every mark stays
          pressable straight through the text. */}
      {/* BACKGROUND ONLY ON A PHONE (Emilie, 2026-08-02: "the mind graph behind
          the about should not be clickable on the phone, just there as
          background"). The marks are a POINTER affordance: they wake near a
          cursor, and pressing one travels. A thumb has none of that, so on a
          phone the only thing the pressable layer could do was steal taps from
          the prose sitting on top of it and send someone to a project they
          never aimed at. `pointer-events-none` below lg makes it what it
          already looks like there: a drawing. Nothing is lost, because
          MindGraphSrNav lists every node and both doors are directly above.
          From lg up it stays fully pressable, which is where it earns it. */}
      {/* BACKGROUND, PUSHED UP (board option C, after she tried B: "the mind
          graph is still above the about while it should just be the background
          instead"). B made it its own 240px band ABOVE the prose, which is what
          "move it slightly to the top" was drawn as, and seeing it she named
          the thing that was wrong: a band is a figure, not a ground. It is
          behind the words again, where it was, but anchored to the TOP of the
          section and 62% of its height rather than full bleed, so it sits
          behind the opening lines and lets the bio finish on clean paper.
          Still `pointer-events-none` below lg (her earlier ruling, unchanged):
          the marks wake near a cursor and travel on a press, and a thumb has
          neither, so all a pressable layer could do here is steal taps from the
          prose on top of it.
          From lg up it is exactly what it always was: full bleed, behind,
          pressable. */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-[62%] transition-opacity duration-500 ease-out motion-reduce:transition-none lg:inset-0 lg:h-auto lg:pointer-events-auto ${
          lit ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* NOT PRERENDERED (Emilie's ruling 2026-08-02; lib/prerender.ts has the
            why). This is lazy behind `Suspense fallback={null}`, so whether the
            drawing landed in the snapshot was a RACE between the chunk
            resolving and the capture: two builds of the same commit produced
            index.html at 230.8KB and 212.2KB. Skipping it in the build makes
            the snapshot REPRODUCIBLE and lighter, and costs a crawler nothing,
            because MindGraphSrNav below lists every node unconditionally. A
            visitor is untouched: `lit` still fires and the graph still draws. */}
        {lit && !PRERENDERING && (
          <ExploreErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <MindGraph />
            </Suspense>
          </ExploreErrorBoundary>
        )}
      </div>

      {/* The ground under the words. Strong enough to be a surface rather than
          a veil, so the prose never reads as faded, and narrow enough that it
          only covers the column the prose actually occupies. Never animates,
          never intercepts a pointer. */}
      {/* THE PHONE'S SCRIM IS BACK, because the drawing is behind the words
          again (it was retired for the one build where the graph sat above
          them). Strong enough to be a surface rather than a veil, so the prose
          never reads as faded. Never animates, never intercepts a pointer. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 lg:hidden"
        style={{ background: 'color-mix(in srgb, var(--lang-ground) 86%, transparent)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
        style={{
          background:
            'linear-gradient(to right, var(--lang-ground) 0px, var(--lang-ground) 420px, color-mix(in srgb, var(--lang-ground) 55%, transparent) 560px, transparent 700px)',
        }}
      />

      {/* POINTER-TRANSPARENT PROSE. The drawing runs underneath by design, and
          a paragraph with no background still swallows every click inside its
          box, which would make the marks under the bio unpressable. The block
          lets pointers through and each interactive child takes its own back.
          The cost is that this prose cannot be drag-selected; the marks being
          reachable is worth more on a surface whose whole point is touching
          them. */}
      <div className="pointer-events-none relative lg:w-[400px] xl:w-[440px]">
        <h2 id="bio-heading" className={KICKER}>
          About
        </h2>
        {/* SIGNED, all four paragraphs (Emilie 2026-08-06). One to three from
            2026-07-29, the closing paragraph written by her at round 7. */}
        {BIO.map((para, i) => (
          <p
            key={i}
            className="prose-rag mt-4 font-serif text-[17px] leading-relaxed text-[var(--lang-ink)] tall:text-[19px]"
          >
            {withVariables(para)}
          </p>
        ))}
        {/* TRIED IN CAVEAT AND REVERTED (Emilie, 2026-08-05). Her idea, rendered
            at 17/19px and judged live: it read well and kept its contrast, but
            the wink sits 100px below it in the same face at 16px, so the page
            ended with two handwritten asides separated by a mono legend and
            neither one owned the moment. Handwriting stays the voice line and
            the margin note. Her call: "revert to mono". */}
        <p className="mt-6 font-mono text-micro tracking-[0.14em] text-[var(--lang-ink-muted)] uppercase">
          This is what&apos;s on my mind ·{' '}
          <Link to="/contact" viewTransition className={`pointer-events-auto ${RED_LINK}`}>
            {/* &nbsp; so the arrow can never widow onto its own line (it did
                at 390, measured 2026-08-20). Same words, unbreakable join. */}
            What&apos;s in yours?&nbsp;&gt;
          </Link>
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
          <span aria-hidden="true" className="flex items-center gap-x-4">
            <LegendMarks />
          </span>
        </div>
      </div>

      {/* The navigable list of every node, travelling in all modes. */}
      <MindGraphSrNav />

      {/* THE WINK IS GONE (Emilie, 2026-08-06, the last pass): "let's remove it."
          It read "n.b. this whole mess is my head. touch a piece of it.", signed
          at G4 2026-07-12, cornered bottom right on lg and in the flow below it.

          WHAT IT WAS ASKED ABOUT. Below lg the graph is `pointer-events: none`,
          and MindGraphView's own comment settled why: "Below lg the field is a
          drawing now, and a drawing does not ask to be touched." A node
          invitation had already been DELETED there for exactly that reason. The
          wink was the last thing still asking, 100px under the same drawing, on
          the only screens where the answer is nothing. She was offered three
          repairs (show it from lg up, reword it true everywhere, or leave it as
          figurative) and took a fourth.

          Nothing replaced it: the closing section now ends on the mark legend,
          which is the thing that actually helps you read the drawing. */}
    </section>
  )
}
