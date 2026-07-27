// THE STRIPS (THE SCROLL, Emilie's direction 2026-07-27). Two vertical columns
// on the landing's right: one of projects, one of thoughts. They are STILL by
// default; hovering one runs it, moving off stops it exactly where it is. The
// columns run in opposite directions so the field reads as alive rather than as
// one belt cut in half.
//
// WHY NOT A CAROUSEL. An auto-rotating rotator was designed, built and rejected
// on evidence at the same gate: ~1% of visitors click the first slide, under
// 0.5% click any later one, and people miss what is on the cards BECAUSE the
// movement pulls attention off the words. Whatever is showing when a recruiter
// looks up is the only thing they see, and three quarters of the time that is
// not the award. Hover-scrubbed motion is the opposite bargain: the visitor
// starts it, the visitor stops it, and nothing is ever hidden behind a timer.
//
// THE BELTS ARE REAL CONTENT NOW (2026-07-27, second pass). They began as an
// aria-hidden pointer affordance, because a column that moves is a hostile
// place to put keyboard focus, and a duplicate flat grid one screen down
// carried the accessible path. Emilie named the cost: the same work appeared
// three times on one page and the doors to /work and /thoughts had nothing
// left to offer. Making the belts stop on :focus-within is what dissolves the
// whole problem — focus is stable the instant anyone tabs in, so the links can
// be real, and the duplicate grid was deleted. Every project and thought is
// reachable here by keyboard, and again at /work and /thoughts.
// Reduced motion never animates: the columns simply rest.
//
// THE DATA IS THE REGISTRY, DELIBERATELY. data/work.ts composes the 21 master
// content files (a ~129kB chunk of JSX prose) and the landing must not pull it
// above the fold. Everything a tile needs — title, lens, sheet number, origin
// image, the ink plate — is either in the registry (already in the entry
// bundle, the mind graph reads it) or in artifacts.tsx (11kB of pure SVG). So
// the strip tile IS the /work plate, rendered from the record, at zero extra
// weight. The dek lives one click away, where it always did.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Img from '../components/Img'
import { LensMark } from '../components/ui/Pill'
import { WORK_ARTIFACTS } from '../components/work/artifacts'
import { LENSES, type Lens } from '../components/Lens'
import { AWARD_WINNER_IDS, ENTRIES, thoughtIndexEntries } from '../data/registry'
import { THOUGHT_OPENINGS } from '../thoughts/openings'
import { fmtMonthYear } from '../components/ThoughtIndexRows'
import { vtName } from '../lib/viewTransition'
import type { CSSProperties } from 'react'

// The project set, in REGISTRY ORDER. Sensi already leads it, which is the one
// thing that matters: the award must be on screen before anyone touches
// anything, and a strip that starts anywhere else has quietly rebuilt the
// carousel problem. No second ordering is authored here (the /work curated
// order lives in data/work.ts and stays the browse room's business).
type StripProject = {
  id: string
  title: string
  lens: Lens
  number: string
  origin: string
  award: boolean
  image?: { slug: string; name: string; alt: string }
}

export const STRIP_PROJECTS: StripProject[] = ENTRIES.filter(
  (e) => e.kind === 'project' && e.lens && e.sheet,
).map((e) => ({
  id: e.id,
  title: e.title,
  lens: e.lens!,
  number: e.sheet!.number,
  // The face's origin stamp is derived from the master's meta row in
  // data/work.ts, which this module must not import. The registry does not
  // carry it, so the strip tile simply omits it rather than guessing: the
  // number alone is the printed index's grammar and reads honestly.
  origin: '',
  award: AWARD_WINNER_IDS.has(e.id),
  image: e.image,
}))

// SENSI STARTS IN THE MIDDLE OF THE BELT, not at the top (Emilie, 2026-07-27).
// Pinned to the first tile it sat half inside the column's own top fade, where
// the mask is still lifting it out of nothing. Two tiles ahead of it drops the
// award to roughly the centre of the column, where the mask is fully clear and
// where the eye lands first.
// Rotating is the way to do it, NOT a starting transform: the loop works by the
// track holding two identical runs and travelling exactly -50%, so any initial
// translate would either open a gap at the top or desync that arithmetic. A
// rotation leaves both runs intact and identical.
// It is applied HERE and not to STRIP_PROJECTS, which the phone slices for its
// own selection: rotating the shared export would have pushed Sensi into that
// slice and printed it twice, once as the proof card and once as a tile.
const BELT_LEAD = 2
const BELT_PROJECTS: StripProject[] =
  STRIP_PROJECTS.length > BELT_LEAD
    ? [...STRIP_PROJECTS.slice(-BELT_LEAD), ...STRIP_PROJECTS.slice(0, -BELT_LEAD)]
    : STRIP_PROJECTS

// ---- one tile ------------------------------------------------------------

/** The /work plate, as a link. Same CSS (.work-plate / .work-art, language.css),
 *  same ink drawings, same cover-on-hover reveal, so the landing and the
 *  gallery cannot drift into two different tile designs. */
export function StripTile({
  project,
  priority = false,
  tabbable = false,
  awardLabel,
}: {
  project: StripProject
  priority?: boolean
  /** the strips pass false: they are aria-hidden pointer decoration */
  tabbable?: boolean
  /** THE AWARD ON THE CARD (Emilie, 2026-07-27). The proof project spells its
   *  recognition out on the tile face; every other winner keeps the quiet ✦,
   *  because a grid where every tile shouts is a grid where none of them do. */
  awardLabel?: string
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      to={`/work/${project.id}`}
      viewTransition
      tabIndex={tabbable ? undefined : -1}
      // THE MORPH SOURCE (2026-07-27). The convention: whatever opens a route
      // wears that route's name, so the face travels into the showcase instead
      // of the two cross-fading. /work's tiles have always done this; the belt
      // did not, so opening Sensi from the landing was a plain dissolve.
      // ONLY THE REAL COPY MAY CARRY IT. The belt renders its items twice (the
      // second run is the loop's seam), and two elements sharing one name makes
      // the browser abandon the ENTIRE transition — a hard cut, worse than no
      // morph at all. `tabbable` already marks the real run, so it doubles as
      // the flag here rather than threading a second one through.
      style={tabbable ? { viewTransitionName: vtName(`/work/${project.id}`) } : undefined}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="lang-glass-1 lang-lift block w-full overflow-hidden rounded-[var(--r-card)] no-underline transition-colors hover:border-[var(--lang-ink-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
    >
      <div
        className="work-plate aspect-video w-full"
        style={{ '--plate-accent': LENSES[project.lens].pen } as CSSProperties}
      >
        {/* THE CATALOGUE NUMBER RETIRED from the face (Emilie's cut,
            2026-07-27): "P-101" is museum furniture, it cost a line on every
            tile, and it told a stranger nothing. It stays the permanent id in
            the registry, on the showcase and in the printed book's index. */}
        <span className="work-art" aria-hidden="true">
          {WORK_ARTIFACTS[project.id] ?? (
            <span className="font-mono text-label tracking-[0.14em] text-[var(--lang-ink-muted)]">
              {project.title}
            </span>
          )}
        </span>
        <span className="work-plate__foot">
          <span className="flex min-w-0 items-center gap-1.5 text-small leading-tight font-semibold text-[var(--lang-ink)]">
            <LensMark lens={project.lens} size={9} />
            <span className="truncate">{project.title}</span>
            {project.award && !awardLabel && (
              <span className="ml-auto shrink-0 text-[var(--lang-ink)]" aria-hidden="true">
                ✦
              </span>
            )}
          </span>
          {awardLabel && (
            <span className="truncate font-mono text-micro tracking-[0.08em] text-[var(--lang-ink)] uppercase">
              <span aria-hidden="true">✦ </span>
              {awardLabel}
            </span>
          )}
        </span>
        {project.image && (
          <span className={`work-plate__cover ${hovered ? 'is-on' : ''}`} aria-hidden={!hovered}>
            <Img
              slug={project.image.slug}
              name={project.image.name}
              alt={project.image.alt}
              priority={priority}
              still
              sizes="(max-width: 1024px) 50vw, 280px"
              className="block h-full w-full object-cover"
            />
          </span>
        )}
      </div>
    </Link>
  )
}

/** The thought leaf, as a link: the handwritten title, the note's VERBATIM
 *  opening (openings.ts, the sanctioned index-surface source — no copy is
 *  duplicated for the landing), and the T-number. */
export function ThoughtTile({
  id,
  title,
  route,
  date,
  tabbable = false,
}: {
  id: string
  title: string
  route: string
  date: string
  tabbable?: boolean
}) {
  const opening = THOUGHT_OPENINGS[id]
  return (
    <Link
      to={route}
      viewTransition
      tabIndex={tabbable ? undefined : -1}
      // Same morph contract as the work tile, same one-copy rule.
      style={tabbable ? { viewTransitionName: vtName(route) } : undefined}
      className="lang-glass-1 lang-lift block w-full overflow-hidden rounded-[var(--r-card)] px-3.5 py-3 no-underline transition-colors hover:border-[var(--lang-ink-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
    >
      <span className="flex items-start gap-2.5">
        <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true" className="mt-1.5 shrink-0">
          <circle cx="7" cy="7" r="4.6" fill="none" stroke="var(--lang-ink)" strokeWidth="1.6" />
        </svg>
        <span className="font-serif text-prose leading-snug font-medium lowercase italic tracking-[-0.005em] text-[var(--lang-ink)]">
          {title}
        </span>
      </span>
      {opening && (
        <span className="mt-2 block text-nav leading-relaxed text-[var(--lang-ink-muted)]">
          <span className="line-clamp-3">{opening}</span>
        </span>
      )}
      {/* The T-number retired from the face with the P-numbers (Emilie's cut,
          2026-07-27); the date is the part a reader actually uses. */}
      <span className="mt-2.5 block font-mono text-micro tracking-[0.12em] text-[var(--lang-ink-muted)] uppercase">
        {fmtMonthYear(date)}
      </span>
    </Link>
  )
}

// ---- the phone's belts ---------------------------------------------------

/** THE BELT, LYING DOWN (Emilie, 2026-07-27: "incorporate the belt system into
 *  the mobile version, maybe horizontal belts instead").
 *
 *  It does NOT drift, and that is the point rather than a shortcut. The desktop
 *  belt's whole bargain is that the visitor starts and stops the motion with a
 *  cursor; a phone has no cursor, so an auto-drifting row could only be stopped
 *  by a button, and a row that moves while you are trying to swipe it is
 *  fighting the one input the device has. Here the thumb IS the motion. Same
 *  idea, same tiles, honest mechanism.
 *
 *  Native overflow scrolling means momentum, snap points and a real scrollbar
 *  gesture for free, and it is keyboard-reachable because focusing a tile
 *  scrolls it into view on its own. The edges are masked so the row reads as
 *  continuing past the frame rather than being cut off, and it bleeds the full
 *  width of the phone while keeping the page's own gutter as its first inset. */
export function HorizontalBelt({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <section aria-label={label} className="lg:hidden">
      <ul
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory list-none gap-2.5 overflow-x-auto px-6 pb-1"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 22px, #000 calc(100% - 22px), transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0, #000 22px, #000 calc(100% - 22px), transparent 100%)',
        }}
      >
        {children}
      </ul>
    </section>
  )
}

// ---- the columns ---------------------------------------------------------

// The track is rendered TWICE and translated by exactly -50%, so the loop is
// seamless. The tile spacing is a per-tile margin, NOT a flex gap: a gap adds
// (2n - 1) gutters to 2n tiles, so half the track is 12px short of one set and
// the loop jumps every cycle. A margin gives 2n tiles exactly 2n gutters.
function Column({
  label,
  down = false,
  className = '',
  items,
}: {
  label: string
  down?: boolean
  className?: string
  /** Called TWICE: once for the real run and once for the loop seam, which
   *  must render its links unfocusable. A plain children node cannot express
   *  that, and an aria-hidden subtree containing focusable links is a WCAG
   *  failure, not a detail. */
  items: (tabbable: boolean) => React.ReactNode
}) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col ${className}`}>
      {/* THE HEADER ROW IS GONE, THE HEADING IS NOT (Emilie's cut, 2026-07-27,
          for minimalism; accessibility audit, same day, for why it survives
          invisibly). The visible "THE WORK · 21 / ALL >" line was a fourth route
          to a room already reachable from the pill, the tiles and the doors
          below. But the belts hold 36 focusable links, and stripping their only
          heading would drop a screen-reader user into "SENSI, link" with no idea
          what they had entered. So the h2 stays, sr-only: the outline keeps its
          structure and the screen keeps its quiet. */}
      <h2 className="sr-only">{label}</h2>
      <div className="lstrip min-h-0 flex-1">
        <div className={`lstrip__track${down ? ' lstrip__track--down' : ''}`}>
          {/* display:contents keeps each copy's keys in their own parent (one
              array rendered twice as siblings would collide) while the tiles
              stay direct flex items of the track. */}
          <div className="contents">{items(true)}</div>
          {/* THE SECOND COPY IS THE SEAM, NOT CONTENT. It exists so -50% loops
              without a jump; every item in it duplicates one already in the tab
              order, so it is hidden from assistive tech AND rendered
              unfocusable. Tabbing a belt walks each project exactly once. */}
          <div className="contents" aria-hidden="true">
            {items(false)}
          </div>
        </div>
      </div>
    </div>
  )
}

// THE PAUSE (WCAG 2.2.2). The belts drift on their own for longer than five
// seconds beside other content, so a mechanism to stop them is required, and
// :hover is not one — it does not exist for a keyboard or a thumb. One control
// governs BOTH columns: two buttons would be more furniture saying the same
// thing.
// IT SITS AT THE BOTTOM RIGHT (Emilie, 2026-07-27). It began above the columns,
// where it read as a third thing in the header row and fought the two labels.
// Cornered, it is chrome: the last thing in the frame, nowhere near the type,
// and still a real 44px target. Exported because the LANDING owns its
// placement, not the belt block.
export function PauseToggle({
  paused,
  onToggle,
  className = '',
}: {
  paused: boolean
  onToggle: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={paused}
      className={`lang-glass-1 flex size-11 shrink-0 items-center justify-center rounded-[var(--r-pill)] text-[var(--lang-ink-muted)] transition-colors hover:text-[var(--lang-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)] ${className}`}
    >
      <span className="sr-only">{paused ? 'Let the columns drift again' : 'Stop the columns drifting'}</span>
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" fill="currentColor">
        {paused ? <path d="M3 1.5 10 6l-7 4.5z" /> : <path d="M3 2h2.2v8H3zM6.8 2H9v8H6.8z" />}
      </svg>
    </button>
  )
}

/** Both columns. Rendered ONLY on lg+ by the caller, and aria-hidden there:
 *  see the header note. Never the only route to anything. */
export default function Strips({
  awardProjectId,
  awardLabel,
  paused = false,
}: {
  /** the one project whose recognition is spelled out on its tile face */
  awardProjectId?: string
  awardLabel?: string
  /** THE PAUSE STATE LIVES ON THE LANDING, because its BUTTON does: the
   *  control is cornered in the frame, not stacked above the columns. */
  paused?: boolean
}) {
  const thoughts = thoughtIndexEntries()
  return (
    // THE BELTS SHRINK AND SIT INSET (Emilie, 2026-07-27, both passes). The
    // block is capped at 500px and CENTRED in its half with `mx-auto`, not
    // pushed to the right edge: flush right put the belts directly under the
    // header's search pill and left the whitespace in one lump on the left.
    // Centred, the air wraps around them and the space under the search reads
    // as deliberate. The columns' own gutter opens 12 -> 20px. Narrow tiles are
    // the point: at 280px each the pair filled the frame edge to edge.
    // w-full so the block FILLS whatever the region gives it and shrinks with
    // it; without it the flex item sizes to its content and simply overflows.
    // max-w caps it once there is more room than the belts need, and ml-auto
    // then holds them against the region's right edge.
    <div
      className="ml-auto flex h-full w-full max-w-[500px] flex-col"
      {...(paused ? { 'data-belts-paused': '' } : null)}
    >
      <div className="flex min-h-0 flex-1 gap-5">
        <Column
          label={`The work · ${STRIP_PROJECTS.length}`}
          items={(tabbable) =>
            BELT_PROJECTS.map((p) => (
              <div key={p.id} className="lstrip__cell">
                <StripTile
                  project={p}
                  tabbable={tabbable}
                  awardLabel={p.id === awardProjectId ? awardLabel : undefined}
                />
              </div>
            ))
          }
        />
        {/* THE THOUGHTS COLUMN WAITS FOR xl. Between 1024 and 1279 the identity
            column leaves the belts about 190px to share, which is two columns
            of ninety-odd pixels: unreadable, and the reason the region was
            overflowing in the first place. One readable belt beats two useless
            ones, and the thoughts are a door away in the same screen. */}
        <Column
          className="hidden xl:flex"
          label={`The thoughts · ${thoughts.length}`}
          down
          items={(tabbable) =>
            thoughts.map((t) => (
              <div key={t.id} className="lstrip__cell">
                <ThoughtTile
                  id={t.id}
                  title={t.title}
                  route={t.note?.route ?? '/thoughts'}
                  date={t.date}
                  tabbable={tabbable}
                />
              </div>
            ))
          }
        />
      </div>
    </div>
  )
}
