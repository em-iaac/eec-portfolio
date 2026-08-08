// THE NEURAL WORLD (/thoughts, the meta build; every gate signed by Emilie
// 2026-07-11). The whole record — projects, thoughts, milestones, awards —
// drawn as one anatomical neural map over the horizontal career skeleton,
// full-bleed and drag-explorable, 2021 › NOW. At rest it is quiet points in
// time; it WAKES WHERE YOU LOOK (useProximityEngine.ts, the signed feel).
// Kind lives in the neuron (the landing's mark grammar): filled soma + lens
// nucleus = project · ring + core = thought · small star off its work =
// award · bare commit dot ON the lane = milestone. The ruler is geometric
// and faint, the nerve organic and bright; the contrast is the design; the
// mind owns all motion. TWO VIEWS OF ONE MIND: the landing stays the mind
// at rest; this is the mind in time. The words: each thought's own note page
// (/thoughts/:id), listed in /work's THE THOUGHTS section (the reading room
// and its graph<->words switch retired at the reindex, 2026-07-16).
//
// Copy status: kicker/sub/hint/corridor + h1 "points in time" + LIVE ·
// STILL GROWING all SIGNED in-session (gate 6). The NOW card's three lines
// render from data/now.ts (draftCopy there, unsigned).
//
// Anatomy of a node group (the adversarial review's floors):
// - the ref callbacks are memoized ONCE so hover/focus re-renders never
//   detach handles (detaching would wipe the engine's integrated energies);
// - the dimmable body (dendrites + glow + soma) sits in its own .nw-body
//   wrapper so the wake dim NEVER multiplies into the label's rest ink
//   (0.62 group x 0.62 label would land below the AA floor);
// - the fixed chrome sits BEFORE the stage in the DOM (readers meet the
//   page identity before 40 canvas stops);
// - Escape or a tap on empty field dismisses the card and releases the
//   wake (WCAG 1.4.13); arming on touch is announced via a polite live
//   region so a double-tap that arms is never silent.
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TitleBlock from '../../components/TitleBlock'
import ReachControls from '../../components/reach/ReachControls'
import type { ReachSet } from '../../components/reach/verbs'
import { LENSES, type Lens } from '../../components/Lens'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import { NOW } from '../../data/now'
import { DATE_METRIC, LABEL_METRIC, WORLD, starPath, type WorldNode } from './worldGraph'
import { preloadPath } from '../../lib/preloadRoute'
import { travelTo } from '../../lib/navIntent'
import { useProximityEngine, TUNE, type ConnHandle, type NodeHandle } from './useProximityEngine'
import WorldSrNav from './WorldSrNav'
import { LABEL_GROW, labelBaseline, planFold, type FoldPlan } from './foldView'
import { PRERENDERING } from '../../lib/prerender'

// The lens accents come from the one source (components/Lens.tsx): these land
// on SVG presentation attributes, so they must be the literal light-dark()
// pair, never a var().
const lensColor = (lens: Lens | undefined) => (lens ? LENSES[lens].accent : 'var(--lang-ink)')

// THE KEY, ONE DEFINITION, TWO PLACEMENTS (2026-08-06). It reads at the top on
// phones and rides the foot band from lg up (Emilie's ruling; the reasoning is
// beside each call site). The marks are drawn 1:1 with the field's own, never
// as glyphs, so the key and the map cannot drift apart.
function KeyMarks() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-micro tracking-[0.08em] text-[var(--lang-ink-muted)] sm:gap-x-4 sm:text-micro sm:tracking-[0.1em]"
    >
      <span className="inline-flex items-center gap-1.5">
        <svg width="16" height="16" viewBox="0 0 16 16" className="overflow-visible">
          <circle cx="8" cy="8" r="6" fill="var(--lang-ink)" />
          <circle cx="8" cy="8" r="2.4" fill={LENSES.computation.accent} />
        </svg>
        PROJECT
      </span>
      <span className="inline-flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 14 14" className="overflow-visible">
          <circle cx="7" cy="7" r="4.6" fill="none" stroke="var(--lang-ink)" strokeWidth="1.6" />
        </svg>
        THOUGHT
      </span>
      <span className="inline-flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 14 14" className="overflow-visible">
          <path d={starPath(7, 7, 5.5)} fill="var(--lang-ink)" />
        </svg>
        AWARD
      </span>
      <span className="inline-flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 12 12" className="overflow-visible">
          <circle cx="6" cy="6" r="2.4" fill="var(--lang-ink-muted)" />
        </svg>
        MILESTONE
      </span>
      <span className="text-[var(--lang-interaction)]">RED = LIVE</span>
    </div>
  )
}

const KIND_NAME = {
  project: 'project',
  thought: 'thought',
  award: 'award',
  milestone: 'milestone',
} as const

// (no em dashes anywhere, aria strings included: the voice rule is binding)
function nodeAria(n: WorldNode): string {
  const base = `${n.title} · ${KIND_NAME[n.kind]}, ${n.date}`
  return n.route ? `${base}. Open it.` : base
}

const HIT_R = 34 // 68 canvas units: >= 44px down to ~560px-tall viewports

// THE DRAWING IS NOT PRERENDERED (Emilie's ruling 2026-08-02, phone pass; the
// full why is in lib/prerender.ts). thoughts.html was 118.5KB gzipped for this
// SVG alone, and a phone paid for it twice: once as document bytes, then again
// when createRoot threw the prerendered DOM away and rebuilt it. WorldSrNav
// below carries the readable record either way, so the snapshot keeps the page
// and the drawing arrives with the JavaScript that was always going to redraw
// it. Nothing about the loaded page changes.
/** THE MAP TURNS ON A PHONE (Emilie's ruling 2026-08-07, after the research
 *  round: vertical is the gesture people actually have, and — the reason that
 *  decided it — twelve neighbours across 390px gives each name 32px, which no
 *  amount of layout can rescue. Down the screen they get 52px and the full
 *  width.
 *  It is NOT a second design. Her words: "it should stay the same design that
 *  we have with the neurons and everything, just flipped vertically." So every
 *  coordinate, every woven fibre and the whole skeleton are the same; only the
 *  projection to the screen changes. */
const TURN_AT = 640
/** The projection factor at 390px: 860 units of relatedness across the width.
 *  Everything drawn in world units and meant to be read in screen pixels —
 *  the names, their offsets — is multiplied by it. */
/** ⚠ THE CROSS-AXIS IS COMPRESSED, and without it the turn does not work.
 *  Relatedness spans 860 units — the career lanes down at 560-762 and the work
 *  bands up at 195-520. Turned at full width those land across 44-301px, which
 *  is most of a 390px phone, so the names had nowhere to go but on top of them.
 *  Squeezed to 0.35 the whole graph occupies the left 106px and the names get a
 *  clean column beside it: the commit graph on the left, which is what she
 *  asked for.
 *  It is a squeeze, not a re-layout — every mark keeps its order and its
 *  neighbours, they simply sit closer together across the narrow axis. */
// ⚠ 1, NOT 0.35, AND THE REASON MATTERS. Squeezing the cross-axis in the
// MATRIX makes the scale non-uniform, and a non-uniform scale does not only
// move things — it deforms them: every soma came out an ellipse and the
// rotated chrome stretched. To compress relatedness properly the DATA has to
// be remapped, not the transform, and the woven fibres are baked `d` strings,
// so that is a re-solve rather than a constant. Left at 1 until it is worth
// doing.
const VCOMP = 1
const VVIEW = 860 * VCOMP
/** ⚠ THE PROJECTION IS A FUNCTION OF THE FRAME, NOT A CONSTANT — and pinning
 *  it to 390 was a real bug, not a simplification. The drawing scales to the
 *  stage, so a size written in world units through a fixed 390 renders at
 *  `px * stageWidth / 390`: measured, a project name came out 6.07px on a
 *  320px phone and 11.37px on a 600px one, against the 7.4px that was ruled.
 *  Both are turned (`TURN_AT` is 640), and 320-375px is a live population.
 *  So every turned size, gap and solver board is now computed against the
 *  frame it will actually be seen in. 390 survives only as the width the
 *  measurements in this file were taken at. */
const VREF = 390
const projFor = (frameW: number) => VVIEW / frameW
/** THE COUNTER-TURN, PER LABEL AND ORIGIN-FREE.
 *  The parent carries `matrix(0 -1 -1 0 h w)`, whose linear part squares to the
 *  identity — so applying that same linear part again about the label's own
 *  anchor sets the glyphs upright. Solving "fix this point, undo that rotation"
 *  gives a translation whose two components are both (x + y), which is the
 *  whole of the arithmetic.
 *  It is expressed as an SVG attribute rather than CSS because `transform-box:
 *  fill-box` on <text> is not dependable on iOS, and when it fails the label
 *  does not shift — it leaves the canvas. */
/** The world Y that lands the names in one column, 118px from the left — the
 *  gutter left of it belongs to the rails and the threads, which is the
 *  commit-graph reading she asked for. Anchoring every name at the same screen
 *  x is also the only way a 40-character milestone can be drawn at 390px
 *  without running off both edges. */
/** TWO KINDS OF TEXT, TWO RULES — and the split is not a phone invention, it
 *  is what the web map already does (Emilie, 2026-08-08, comparing the two:
 *  "the text is centered below the node" and "the orientation of the text
 *  related to the graph should be vertical following the commit graph lines").
 *
 *  MEASURED at 390px before choosing, because the choice is arithmetic:
 *    46 neurons     max 182px, median 100px   → they fit under their mark
 *    10 record rows max 465px, median 296px   → three are wider than the phone
 *  The record rows are the career skeleton's own text; on the web they run
 *  ALONG their lane, and the lanes are horizontal there. Turned, along the
 *  lane is vertical — so nothing is cut, shortened or wrapped, and their
 *  length costs scroll (3465px of it) instead of width.
 *
 *  A neuron's name is centred under its mark, upright, exactly as on the web,
 *  and only nudged when centring would push it off an edge. */
const VFRAME_PAD = 5
/** OPTION B, her ruling 2026-08-08: "the text needs to be smaller and maybe
 *  even the nodes so it's cleaner with more white space." Type AND marks come
 *  down together — 0.78, chosen off a board that set the three candidates as
 *  live specimens at their real size. Measured effect: text ink over the whole
 *  map 9.4% -> 5.7%.
 *  ⚠ It goes UNDER the site's own floor (`--text-micro: 9px`), knowingly and
 *  with her ruling: this is a drawing, not reading copy, and the same names are
 *  in WorldSrNav at document size for anything that has to read them.
 *  Everything turned scales through this — the sizes, the gaps between a mark
 *  and its name, the record's columns, and the solver's board. If the render
 *  and the solver ever disagree about it, the solver is placing labels on a map
 *  that does not exist. */
const VTYPE = 0.78
/** The record's text hugs its rail. The web gap is 18px, but that gap is
 *  across the axis where a phone has 390px total and the leftmost lane sits at
 *  44px — and turned, the text is ~9px wide rather than ~300px, so the same
 *  visual relationship needs a much smaller step. */
// ⚠ THESE DO NOT SCALE WITH THE TYPE, and that is deliberate. They are the
// CLEARANCE between a rail and the row standing beside it, not a size — and
// when the type came down 22% these came down with it, which put every record
// row back on top of its own rail. Thinner text needs the same air, not less.
const VREC_SIDE = 6
const VREC_DATE = 15
// ⚠ DERIVED, NOT PICKED. A record row occupies BOTH its columns — the name at
// VREC_SIDE and the date at VREC_DATE, each a glyph-height wide — so the step
// to the next column has to clear the whole row. Picking a number instead put
// the red live tag 7px from "MaCAD Year 1 complete", which with 9px type is
// not two columns, it is one jumble.
const VREC_COL = VREC_DATE - VREC_SIDE + 9 * VTYPE + 4
const VREC_UP = 6
/** The live block sits on the END of the main lane, so its clearance is
 *  measured from a rail that runs the whole way down under it — 6 put the red
 *  tag's left edge on the line. */
const VLIVE_SIDE = 9
/** The left gutter belongs to the years. Nothing else may take a column that
 *  reaches into it — measured at 320px, a record row that did put its date at
 *  x -7.6 and crossed the year label on the way out. */
const VYEAR_X = 10
const VLEFT_EDGE = VYEAR_X + 6

const vTurn = (x: number, y: number) =>
  `matrix(0 ${(-1 / VCOMP).toFixed(4)} -1 0 ${(x + y).toFixed(1)} ${(y + x / VCOMP).toFixed(1)})`

/** READING ALONG THE RAIL, bottom-to-top, the way a chart's Y axis is
 *  labelled. The parent's linear part is a REFLECTION; composing it with a
 *  flip about the label's own baseline gives a map of determinant +1 — a true
 *  quarter turn, so the glyphs are rotated and not mirrored. Solving "fix this
 *  point" leaves a single term, 2y, and no origin keyword: `transform-box:
 *  fill-box` on <text> is not dependable on iOS. */
const vAlong = (y: number) => `matrix(1 0 0 -1 0 ${(2 * y).toFixed(1)})`

/** WHICH COLUMN EACH RECORD ROW GETS. Ten rows run up five lanes, and on the
 *  busiest lane they are long enough to run straight through each other:
 *  "Licensed architect · Order of Engineers and Architects · Beirut" is 465px
 *  of text with 177px of clear lane above it. A row that would cross one
 *  already placed steps one column further out from the rail — greedily,
 *  oldest first. Two columns is all it has ever needed. */
type Box = { x0: number; x1: number; y0: number; y1: number }
const overlaps = (a: Box, b: Box) => a.x0 < b.x1 - 1 && b.x0 < a.x1 - 1 && a.y0 < b.y1 - 1 && b.y0 < a.y1 - 1
/** Every measurement below is in SCREEN PIXELS of the frame being solved for,
 *  because that is the only space in which "does this fit" and "do these
 *  touch" mean anything. */
const vAtIn = (proj: number, n: { x: number; y: number }) => ({
  mx: (WORLD.h - n.y) / proj,
  my: (WORLD.w - n.x) / proj,
})
const vSize = (kind: WorldNode['kind']) => LABEL_METRIC[kind].size * VTYPE
const vHalf = (kind: WorldNode['kind'], text: string) =>
  (text.length * LABEL_METRIC[kind].adv * vSize(kind) * 1.04) / 2
/** A mark's radius as it is actually drawn on the turned map. Type-relative, so
 *  it does not depend on the frame. */
const vRad = (n: WorldNode) => n.style.r * VTYPE
/** Where a name ends up across the frame once it has given up as little of
 *  being centred on its mark as the edges demand. */
const vCentreIn = (proj: number, frameW: number, n: WorldNode, half: number) => {
  const { mx } = vAtIn(proj, n)
  if (half * 2 > frameW - 2 * VFRAME_PAD) return mx
  return Math.min(Math.max(mx, VFRAME_PAD + half), frameW - VFRAME_PAD - half)
}

/** One step further from the mark, when a name lands on something. */
const VLBL_LINE = 12 * VTYPE

/** A record row's column, and whether it had to hang DOWNWARD from its mark. */
export type TurnedLayout = {
  proj: number
  /** The record's columns, keyed by node id. */
  recLane: ReadonlyMap<string, { col: number; down: boolean }>
  /** Which side of its mark a resting name took, and how far it stepped. */
  lblPlace: ReadonlyMap<string, { flip: boolean; drop: number }>
  /** How far across the frame a name gave up being centred, in screen px. */
  shift: ReadonlyMap<string, number>
}

/** ⚠ SOLVED PER FRAME AND MEMOISED, because the answer genuinely differs: a
 *  name that fits beside its mark at 430px does not at 320px, and the record's
 *  columns land on different pixels. Phones present a handful of widths, so the
 *  cache never grows, and the solve is pure — same width in, same board out. */
const LAYOUTS = new Map<number, TurnedLayout>()
export function turnedLayout(frameWidth: number): TurnedLayout {
  const frameW = Math.max(240, Math.round(frameWidth))
  const cached = LAYOUTS.get(frameW)
  if (cached) return cached
  // A phone offers a handful of widths; a browser being dragged offers one per
  // pixel. Nothing here is worth remembering that hard.
  if (LAYOUTS.size > 24) LAYOUTS.clear()
  const proj = projFor(frameW)
  const at = (n: { x: number; y: number }) => vAtIn(proj, n)

  /** THE RECTANGLES A RESTING NAME HAS TO STAY OUT OF: every mark, and every
   *  record row standing up along its rail. Both are settled before a single
   *  name is placed, so this is a fixed board, not a negotiation.
   *
   *  WHICH COLUMN EACH RECORD ROW GETS. Ten rows run up five lanes, and on the
   *  busiest lane they are long enough to run straight through each other:
   *  "Licensed architect · Order of Engineers and Architects · Beirut" is 465px
   *  of text with 177px of clear lane above it. A row that would cross one
   *  already placed steps one column further out from the rail — greedily,
   *  oldest first. Two columns is all it has ever needed. */
  const recLane = new Map<string, { col: number; down: boolean }>()
  const met = LABEL_METRIC.milestone
  // THE LIVE TIP IS A RECORD ROW TOO — the newest one — and it is the only one
  // whose column is not negotiable, because it hangs off a mark the arrival
  // lands on. So it is placed first and the dated rows step around it. Without
  // this its red tag ran straight down through "MaCAD Year 1 complete".
  const tip = WORLD.skeleton.liveTip
  const tipX = (WORLD.h - tip.y) / proj
  const tipY = (WORLD.w - tip.x) / proj
  const recBlocks: Box[] = [
    {
      x0: tipX + VLIVE_SIDE - 5 * VTYPE - 1.5,
      x1: tipX + VLIVE_SIDE + 5 * VTYPE + 1.5,
      y0: tipY + 4,
      y1: tipY + 4 + 'LIVE · STILL GROWING'.length * met.adv * met.size * VTYPE,
    },
  ]
  for (const n of WORLD.nodes.filter((n) => n.kind === 'milestone').slice().sort((a, b) => a.x - b.x)) {
    const len = (n.mapLabel ?? n.title).length * met.adv * met.size * VTYPE
    const { mx, my } = at(n)
    // ⚠ A ROW NEAR NOW HAS NOWHERE TO RUN. They read forward in time, which
    // turned is UPWARD, and the newest two sit within a name's length of the
    // top of the map — so "emiliechidiac.com goes live" had its first 28px
    // permanently above y = 0, unreachable at any scroll. Such a row hangs
    // DOWNWARD from its mark instead, the same flip `labelAbove` performs on a
    // name and the same anchor the live tag already uses. It still reads
    // bottom-to-top: only which end is pinned changes.
    // ⚠ AND THE COLUMNS ARE BOUNDED BY THE FRAME, which only became visible once
    // the board was solved per width. A row's LENGTH is fixed pixels while the
    // gaps between marks shrink with the frame, so a narrow phone needs MORE
    // columns and has LESS room for them: at 320px "IAAC Global Summer School"
    // marched out to column 3 and put its date at x -7.6, off the glass, across
    // the year rail on the way. So the search is bounded, and when it runs out
    // of columns it takes the OTHER DIRECTION rather than the frame's edge —
    // which doubles the room on a rail for free, using the flip that was
    // already there.
    const room = my - vRad(n) - VREC_UP
    const canUp = room - len >= 2
    const canDown = my + vRad(n) + VREC_UP + len <= WORLD.w / proj - 2
    const g = 5 * VTYPE + 1.5
    const maxCol = Math.max(0, Math.floor((mx - VREC_DATE - g - VLEFT_EDGE) / VREC_COL))
    const dirs = canUp ? [true, ...(canDown ? [false] : [])] : [false, ...(canUp ? [true] : [])]
    let chosen: { col: number; down: boolean } | null = null
    let first: { box: Box; col: number; down: boolean } | null = null
    outer: for (const up of dirs) {
      const y1 = up ? room : my + vRad(n) + VREC_UP + len
      const y0 = y1 - len
      for (let col = 0; col <= maxCol; col++) {
        const box = { x0: mx - VREC_DATE - g - col * VREC_COL, x1: mx - VREC_SIDE + g - col * VREC_COL, y0, y1 }
        if (!first) first = { box, col, down: !up }
        if (!recBlocks.some((p) => overlaps(p, box))) {
          recBlocks.push(box)
          chosen = { col, down: !up }
          break outer
        }
      }
    }
    // Nothing clear anywhere: take the first place tried, which is the honest
    // one — beside its own mark, inside the frame — and let it overlap.
    if (!chosen && first) {
      recBlocks.push(first.box)
      chosen = { col: first.col, down: first.down }
    }
    recLane.set(n.id, chosen ?? { col: 0, down: false })
  }

  /** THE LAST STEP DOWN. Measured at 390px with everything else settled, seven
   *  award names still lay across somebody else's soma and eight names across
   *  somebody else's date — awards worst, because an award sits in the same
   *  band as the project it was given for and lands right on it.
   *  The web answers this with `labelAbove` and hand-set nudges, and those are
   *  solved for a layout where relatedness runs down the page. Turned, the same
   *  question has to be asked again: a name that lands on something steps one
   *  line further from its mark, then tries the mark's other side, and only
   *  then gives up. Marks and record rows are fixed; names yield. */
  const lblPlace = new Map<string, { flip: boolean; drop: number }>()
  const shift = new Map<string, number>()
  const placed: Box[] = [...recBlocks]
  for (const n of WORLD.nodes) {
    const { mx, my } = at(n)
    const r = vRad(n)
    placed.push({ x0: mx - r, x1: mx + r, y0: my - r, y1: my + r })
  }
  // Projects and thoughts are the record's subject and settle first; awards
  // annotate them, so they are the ones that move.
  const order = WORLD.nodes
    .filter((n) => n.kind !== 'milestone')
    .slice()
    .sort((a, b) => (a.kind === 'award' ? 1 : 0) - (b.kind === 'award' ? 1 : 0) || a.x - b.x)
  const tries: Array<{ flip: boolean; drop: number }> = [
    { flip: false, drop: 0 },
    { flip: false, drop: VLBL_LINE },
    { flip: true, drop: 0 },
    { flip: false, drop: VLBL_LINE * 2 },
    { flip: true, drop: VLBL_LINE },
    { flip: false, drop: VLBL_LINE * 3 },
    { flip: true, drop: VLBL_LINE * 2 },
    { flip: false, drop: VLBL_LINE * 4 },
  ]
  for (const n of order) {
    const text = n.mapLabel ?? n.title
    const size = vSize(n.kind)
    const half = vHalf(n.kind, text)
    const { mx, my } = at(n)
    const cx = vCentreIn(proj, frameW, n, half)
    shift.set(n.id, cx - mx)
    const r = vRad(n)
    // ⚠ THE DATE'S BOX IS STILL RESERVED THOUGH THE DATE IS NOT DRAWN AT REST
    // (her ruling D, 2026-08-08). It comes back the moment a mark is held, and
    // a date that appears into somebody else's name is worse than the one that
    // was always there. The space it keeps is the white space she asked for,
    // doing a second job.
    const dHalf = (7 * DATE_METRIC.adv * DATE_METRIC.size * VTYPE) / 2
    // ⚠ THE FALLBACK IS THE HONEST PLACE, not the last thing tried. Running
    // off the end of the list means nothing fits, and a name shoved 48px from
    // its mark that STILL overlaps has given up the one thing it had.
    let chosen = tries[0]!
    let boxes: Box[] = []
    for (const t of tries) {
      const up = n.labelAbove !== t.flip
      const ny = up ? my - (r + 12 * VTYPE) - t.drop : my + r + 18 * VTYPE + t.drop
      const dy = up ? ny - 13 * VTYPE : ny + 12 * VTYPE
      const ds = DATE_METRIC.size * VTYPE
      const cand: Box[] = [
        { x0: cx - half, x1: cx + half, y0: ny - size * 0.8, y1: ny + size * 0.25 },
        { x0: cx - dHalf, x1: cx + dHalf, y0: dy - ds * 0.8, y1: dy + ds * 0.25 },
      ]
      if (t === tries[0]) boxes = cand
      if (!cand.some((c) => placed.some((p) => overlaps(p, c)))) {
        chosen = t
        boxes = cand
        break
      }
    }
    lblPlace.set(n.id, chosen)
    placed.push(...boxes)
  }

  const out: TurnedLayout = { proj, recLane, lblPlace, shift }
  LAYOUTS.set(frameW, out)
  return out
}

export default function NeuralWorld() {
  const prm = usePrefersReducedMotion()
  const [vertical, setVertical] = useState(
    () => typeof window !== 'undefined' && !PRERENDERING && window.innerWidth < TURN_AT
  )
  /** THE FRAME THE TURNED MAP IS SOLVED FOR. Not a constant: the whole board —
   *  type sizes, the gap from a mark to its name, the record's columns, which
   *  side a name takes — is arithmetic against the width it will be seen in,
   *  and pinning that to 390 rendered the map 18% small on a 320px phone and
   *  larger than desktop on a 600px one. */
  const [frameW, setFrameW] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : VREF,
  )
  useEffect(() => {
    const onResize = () => {
      setVertical(window.innerWidth < TURN_AT)
      // the stage is the thing the drawing is scaled to; the window is only the
      // cold-start guess for it
      setFrameW(stageRef.current?.clientWidth || window.innerWidth)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  // ⚠ VREF WHEN THE MAP IS LYING DOWN, so dragging a desktop window does not
  // re-solve a board it will never draw — 46 names x 8 candidates against every
  // placed box, once per pixel of drag.
  const turned = useMemo(() => turnedLayout(vertical ? frameW : VREF), [vertical, frameW])
  const vPx = (px: number) => px * turned.proj
  /** THE ANATOMY KEEPS ITS SIZE TOO, and until 2026-08-08 it did not. Turned,
   *  the world is projected at 390/860, so every radius written in world units
   *  came out at 0.45x — a 7.2 soma drew as a 3px dot — while the type had
   *  just been counter-scaled back to its full 9.5px. A map of full-size words
   *  around half-size neurons, which is what "the size is not well designed"
   *  looks like from a phone. The strokes are handled in CSS by
   *  `non-scaling-stroke`, which is the same trick the fold already uses. */
  // ⚠ AND IN THE FOLD IT IS COUNTER-SCALED, like the type beside it. A radius
  // written in world units shrinks with the camera, and a fifteen-member fold
  // solves to 0.164 — so every soma drew as a 4px speck under 9.3px names, and
  // the subject's own ring came out 7px wide. `fold.font` already carries
  // 1/(k*s0), so dividing by the base size turns it into the factor that holds
  // a mark at 1.25x its resting size whatever the camera does.
  const vr = (r: number) =>
    vertical ? (fold ? (r * fold.font) / 9.5 : r * VTYPE * turned.proj) : r
  const navigate = useNavigate()
  const stageRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const nodesRef = useRef(new Map<string, NodeHandle>())
  const connsRef = useRef(new Map<string, ConnHandle>())
  const plumbLineRef = useRef<SVGLineElement>(null)
  const plumbDotRef = useRef<SVGCircleElement>(null)
  // The LOCKED node id lives in a ref (not state) so the mount-time drag/Escape
  // handlers close over a stable handle, never a stale render's card (S6-A,
  // Emilie 2026-07-24: hover glances, a click LOCKS the card, click again /
  // Escape / empty field closes it; travel is the card's OPEN button).
  const lockedId = useRef<string | null>(null)
  // The project deks load AFTER first paint (they live in the /work data
  // chunk; the field card is the only consumer here, and it is hover-gated).
  const dekMap = useRef<Map<string, string> | null>(null)

  const ranks = useMemo(() => WORLD.nodes.map((n) => ({ id: n.id, rank: n.rank })), [])

  // THE THREE PHASES (Emilie's model, 2026-08-07). Her words: "first click locks
  // it, and we can drag around, and if we hover while one is locked nothing else
  // expands; then a second click would isolate."
  //
  //   BROWSE    nothing chosen. The pointer wakes the nearest neuron, one only.
  //   HELD      one neuron stays awake with its threads out. The pointer stops
  //             proposing others, so you can drag the record and follow those
  //             threads to their far ends without losing what you chose.
  //   ISOLATED  the fold: the empty years close and its whole neighbourhood
  //             arrives in one frame.
  //
  // FORWARD is a click. BACK is Escape or a tap on nothing, and it steps back
  // EXACTLY ONE PHASE — one rule, both directions, so the ladder can be learned
  // by using it. Enter and Escape are the same ladder for the keyboard.
  //
  // ON A PHONE THIS IS SHORTER THAN WHAT IT REPLACES, not longer: there is no
  // hover, so BROWSE has no behaviour and the first tap IS the hold. Two
  // gestures, where before one tap jumped straight into a full fold.
  const [heldId, setHeldId] = useState<string | null>(null)
  const foldRef = useRef(false)
  const ambientRef = useRef(true)
  ambientRef.current = heldId === null

  // Each end of an unmade synapse draws its OWN arm, inside its own neuron's
  // group, so a reach grows when the neuron it belongs to wakes — rather than
  // both arms of a pair appearing because one end was looked at. Standing at one
  // node you see it reaching; standing between the two you see the gap.
  // THE FOLD. State, not a ref: it renders. Holds the plan plus the two things
  // only the live viewport can decide — the camera scale and the counter-scaled
  // label size.
  const camRef = useRef<SVGGElement>(null)
  const [fold, setFold] = useState<{
    subject: string
    /** `side`: +1 puts the name to the RIGHT of its mark on the turned map,
     *  -1 to the left, 0 centred under it (the subject, and every fold when
     *  the map is lying down). */
    byId: Map<string, { dx: number; dy: number; lane: number; order: number; side: number }>
    links: FoldPlan['links']
    arms: FoldPlan['arms']
    font: number
    open: { id: string; route: string; x: number; y: number } | null
    openLane: number
    hit: number
    /** The subject's own name, measured off the rendered label and scaled to
     *  the folded size. The name IS the door now, so its width is the door's
     *  width — and it cannot be estimated: the map draws four kinds in
     *  different faces, and the advance ratio runs 0.395 to 0.8 across them
     *  (foldView carries the three failed guesses). */
    openW: number
  } | null>(null)

  const armsOf = useMemo(() => {
    const m = new Map<string, { to: string; paths: { d: string; w: number }[] }[]>()
    const push = (id: string, to: string, paths: { d: string; w: number }[]) => {
      const l = m.get(id)
      if (l) l.push({ to, paths })
      else m.set(id, [{ to, paths }])
    }
    for (const r of WORLD.reaches) {
      push(r.a, r.b, r.armA)
      push(r.b, r.a, r.armB)
    }
    return m
  }, [])
  const engine = useProximityEngine({
    stageRef,
    svgRef,
    nodesRef,
    connsRef,
    plumbLineRef,
    plumbDotRef,
    worldH: WORLD.h,
    mainY: WORLD.mainY,
    ranks,
    ambientRef,
    prm,
  })

  useEffect(() => {
    // (No html-background patch here any more; see LandingCover. `body` paints
    // --lang-ground, so overscroll already matches every surface.)
    let on = true
    import('../../data/work').then((m) => {
      if (on) dekMap.current = new Map(m.WORK_ENTRIES.map((w) => [w.id, w.dek]))
    })
    if (import.meta.env.DEV) {
      // dev-only engine probe for verification sessions (tree-shakes away)
      ;(window as unknown as Record<string, unknown>).__nw = { nodes: nodesRef.current, conns: connsRef.current }
    }
    return () => {
      on = false
    }
  }, [])

  // Arrival: a #<id> deep link centres + wakes its piece (the notes' "SEE
  // THIS THOUGHT IN TIME" corridor); otherwise restore the last scroll (so
  // returning from a note lands where you left), else start mid-world.
  useEffect(() => {
    const stage = stageRef.current
    const svg = svgRef.current
    if (!stage || !svg) return
    const id = window.location.hash.slice(1)
    const target = id ? nodesRef.current.get(id) : undefined
    let wakeTimer = 0
    const raf = requestAnimationFrame(() => {
      const scale = svg.getBoundingClientRect().height / WORLD.h || 1
      // The arrival position is chosen, so the year snap must not adjust it.
      stage.classList.add('is-free')
      window.setTimeout(() => stage.classList.remove('is-free'), 700)
      if (target) {
        stage.scrollLeft = target.x * scale - stage.clientWidth / 2
        target.forceT = 1
        engine.kick()
        wakeTimer = window.setTimeout(() => {
          target.forceT = 0
          engine.kick()
        }, 2600)
      } else {
        const stored = Number(sessionStorage.getItem('nw-scroll'))
        // LAND ON TODAY (Emilie's pick 2026-08-02). A first arrival used to
        // start at 35% of the track, which is a number, not a place: a stranger
        // was dropped into the middle of a timeline with no way of knowing
        // which way was forward. The live tip is where the record currently
        // is, so the map opens on the present and reads backwards, the way a
        // record is read. Returning from a note still restores where you were.
        const rest = Math.max(0, WORLD.skeleton.nowAt.x * scale - stage.clientWidth / 2)
        if (vertical) stage.scrollTop = 0
        else stage.scrollLeft = Number.isFinite(stored) && stored > 0 ? stored : rest

        // BACK FROM A PIECE RETURNS TO THE MARK, not to the map (her ruling,
        // see `travel`). Read once and deleted, so this only ever fires on the
        // way back from something the map itself opened.
        // AFTER the scroll is restored, because the fold's camera is solved
        // against `stage.scrollLeft` — folding first would frame the
        // neighbourhood around wherever the stage happened to be.
        // ⚠ AND IT IS ONLY READ WHEN THE MAP IS THE PAGE. A project renders the
        // map BEHIND its overlay, which mounts this component again while the
        // piece is opening — so without this guard the note was consumed on the
        // way OUT, and there was nothing left to read on the way back.
        let refold: string | null = null
        if (window.location.pathname === '/thoughts') {
          try {
            refold = sessionStorage.getItem('nw-refold')
            if (refold) sessionStorage.removeItem('nw-refold')
          } catch {
            refold = null
          }
        }
        if (refold && WORLD.nodes.some((n) => n.id === refold)) {
          hold(refold)
          applyFold(refold)
          return
        }

        // THE DOOR IS THE MAP GROWING (Emilie's ruling 2026-08-07). The room
        // used to open on a still frame of TODAY, which is the thinnest end of
        // the record: a stranger met three marks on empty paper and had no
        // reason to think there was anything behind them. So the arrival plays
        // the sweep the WATCH IT GROW button already plays, from 2021 forward,
        // and comes to rest in exactly the place the still frame used to be.
        // Nothing about where you end up changes; only how you got there.
        //
        // IT IS THE SAME GESTURE TOLD MORE QUIETLY. The button's sweep holds
        // every rank lit until the end, so by 2026 the whole map is at full
        // wake — that is right when you asked for it and too much when you did
        // not. The arrival keeps the peak below the button's and lets each mark
        // fall back over 900ms, so what travels is a pulse rather than a flood.
        // Any input at all takes the map back on the spot.
        // Her dials, 2026-08-07: slower than the first cut (62 -> 90ms a rank,
        // ~4.3s -> ~5.8s) and brighter (0.55 -> 0.75). The two move in opposite
        // directions on purpose — a brighter wave can afford to travel slower,
        // because the thing you are being given time to read is now legible.
        const first =
          !(Number.isFinite(stored) && stored > 0) &&
          !prm &&
          !sessionStorage.getItem('nw-grew')
        if (first) {
          try {
            sessionStorage.setItem('nw-grew', '1')
          } catch {
            /* private mode: the door simply opens again next time */
          }
          // THE PHONE GETS A THINNER WAVE (her report 2026-08-07: "on the
          // phone it seems a bit laggy"). How many marks are lit at once is
          // decay / step, and that number IS the per-frame cost: every lit
          // mark is writing inline styles to its soma, its label, its date and
          // its fibres, inside a 1559-element drawing.
          // Measured on the production bundle at 390x844: 60fps with the CPU
          // throttled 2x, 20fps at 4x, 12fps at 6x — a cliff, and a real phone
          // sits on it. Desktop lights ten at a time; a coarse pointer lights
          // four, by slowing the wave and shortening its tail. It reads as the
          // same gesture, just a narrower band of light travelling.
          const coarse = window.matchMedia('(pointer: coarse)').matches
          // Turned, the sweep climbs from the oldest at the bottom and comes
          // to rest at the top, which is now (her ruling 2026-08-07: "the
          // opening should start from bottom to top so we see the full map and
          // then land on now at the top").
          engine.replay(
            coarse
              ? { step: 115, peak: 0.75, decay: 460, to: vertical ? 0 : rest, vertical }
              : { step: 90, peak: 0.75, decay: 900, to: vertical ? 0 : rest, vertical },
          )
        }
      }
    })
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(wakeTimer)
    }
    // engine is stable; run once on mount.
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Drag-to-pan + non-passive wheel (React's onWheel is passive; the
  // preventDefault needs a real listener) + the scroll-position save (from
  // the live scroll listener: an unmount cleanup would read a detached
  // node's scrollLeft, which is always 0).
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let drag: { x: number; s: number } | null = null
    let saveTimer = 0
    // A TAP ON EMPTY FIELD CLOSES THE CARD. A DRAG DOES NOT (Emilie,
    // 2026-08-02: "when I press I see the connections form but some are out of
    // the screen, and when I swipe to go there it retracts").
    //
    // `stepBack()` used to run on POINTERDOWN, before the gesture had told
    // anyone what it was. With a mouse that is invisible: you click empty space
    // to dismiss, and panning is a separate deliberate act. On a phone, panning
    // IS a press on empty field, so the very gesture for going to look at a
    // connection was the gesture that threw it away. The world could show you a
    // thread to something off screen and then refuse to let you follow it.
    // So the decision waits for pointerUP and only fires if the finger stayed
    // put. Same tap-versus-drag rule as the landing belts (useBeltDrift).
    // THE MAP STICKS TO THE FINGER (Emilie, 2026-08-02, asking to maximise the
    // phone experience). The stage is `overflow-x: auto` with
    // `touch-action: pan-x pan-y`, so the BROWSER already pans it on touch, and
    // this handler was panning it a second time by the same delta. Measured: a
    // 120px swipe moved the world 144px, so the map slid out from under the
    // thumb and a flick's momentum fought the script the whole way.
    // A mouse gets nothing from the browser here and still needs this. Touch
    // needs only the tap-versus-drag bookkeeping, which is why `moved` is
    // tracked for every pointer type while only a mouse drives the scroll.
    let moved = 0
    let scrolls = false
    const down = (e: PointerEvent) => {
      // `.nw-foldopen` IS ON THIS LIST, and leaving it off made the map's only
      // door unusable (found 2026-08-07 by clicking it): OPEN is a <g role=link>
      // inside the drawing, not an <a>, so without naming it here a click on the
      // door read as a click on empty field. The tap-to-dismiss rule fired,
      // stepBack() ran, and you fell from isolated back to held — every time,
      // dead centre, with nothing overlapping it. The fold's own drag handler
      // already knew to ignore it; this one did not, and this one runs too.
      if ((e.target as Element).closest('.nw-node, .nw-foldopen, a, button')) return
      moved = 0
      scrolls = e.pointerType === 'mouse'
      if (foldRef.current) return // the fold owns the gesture
      drag = { x: e.clientX, s: stage.scrollLeft }
      if (scrolls) stage.classList.add('dragging')
    }
    const move = (e: PointerEvent) => {
      if (!drag || foldRef.current) return
      const dx = e.clientX - drag.x
      const wasStill = moved <= 4
      moved = Math.max(moved, Math.abs(dx))
      // (The card used to fold away here the moment a press became a pan, so it
      // stopped covering the thread you were about to follow. There is no card
      // to fold now — HELD is exactly that idea with nothing laid over the map,
      // and dragging while held is the whole point of the phase.)
      void wasStill
      if (scrolls) stage.scrollLeft = drag.s - dx
    }
    const up = () => {
      // 4px, the same slop the belts use to tell a tap from a drag.
      if (drag && moved <= 4) stepBack()
      drag = null
      stage.classList.remove('dragging')
    }
    const cancel = up // native pan-x can take the gesture mid-drag
    // ⚠ THIS IS WHY THE CHOSEN VIEW STILL SCROLLED (her recording, 2026-08-07:
    // "in the isolated mode i can still scroll horizontally"). The stage is
    // `overflow: hidden` while folded, which stops the BROWSER scrolling it —
    // but this handler sets `scrollLeft` itself, and a property assignment does
    // not care what overflow says. Two wheel listeners sit on the same element;
    // this one is attached first, so it moved the map before the fold's own
    // handler could swallow the event. Same for the mouse pan above.
    const wheel = (e: WheelEvent) => {
      if (foldRef.current) {
        e.preventDefault()
        return
      }
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        stage.scrollLeft += e.deltaY
        e.preventDefault()
      }
    }
    const onScroll = () => {
      window.clearTimeout(saveTimer)
      saveTimer = window.setTimeout(() => {
        sessionStorage.setItem('nw-scroll', String(stage.scrollLeft))
      }, 160)
    }
    // ⚠ ESCAPE WAS REACHING THE MAP THROUGH AN OPEN PIECE, and that is what
    // threw the chosen view away on the way back (her ruling 2026-08-07: "when
    // we press x or esc we should go back to that isolated mode of that node").
    // A project opens as an OVERLAY with the map still mounted underneath it —
    // so the Escape that closed the overlay also ran this handler and released
    // the fold, one keystroke doing two jobs on two layers.
    // The map only answers the keyboard when the map is what you are looking at.
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && window.location.pathname === '/thoughts') stepBack()
    }
    stage.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', cancel)
    stage.addEventListener('wheel', wheel, { passive: false })
    stage.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', key)
    return () => {
      window.clearTimeout(saveTimer)
      stage.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', cancel)
      stage.removeEventListener('wheel', wheel)
      stage.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', key)
    }
    // dismiss only touches refs + setState; safe to close over the first one.
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- node registration. The ref callbacks are memoized ONCE: a changing
  // callback identity would make React detach (null) + reattach every
  // render, wiping the engine's integrated energies mid-animation (the
  // adversarial review's critical finding).
  function registerNode(n: WorldNode, el: SVGGElement | null) {
    if (!el) {
      nodesRef.current.delete(n.id)
      return
    }
    nodesRef.current.set(n.id, {
      id: n.id,
      kind: n.kind,
      x: n.x,
      y: n.y,
      el,
      body: el.querySelector('.nw-body'),
      soma: el.querySelector('.nw-soma'),
      // These used to be the neuron's dendrites, which connected to nothing.
      // They are now its arms toward what it has friends in common with and is
      // not joined to — and they fade in rather than draw, because nothing made
      // them (see NodeHandle.reaches).
      reaches: Array.from(el.querySelectorAll<SVGPathElement>('.nw-reachout')),
      // grouped by the mark each arm is aimed at, so the engine can light a
      // near miss from whichever of its two ends is awake
      arms: (armsOf.get(n.id) ?? []).map((arm) => ({
        to: arm.to,
        paths: Array.from(el.querySelectorAll<SVGPathElement>(`[data-arm="${arm.to}"]`)),
        applied: -1,
      })),
      lbl: el.querySelector('.nw-lbl'),
      yr: el.querySelector('.nw-yr'),
      glow: el.querySelector('.nw-glow'),
      E: 0,
      shown: 0,
      appliedE: -1,
      appliedShow: -1,
      forceT: 0,
    })
  }

  function registerConn(key: string, a: string, b: string, el: SVGGElement | null) {
    if (!el) {
      connsRef.current.delete(key)
      return
    }
    connsRef.current.set(key, {
      a,
      b,
      paths: Array.from(el.querySelectorAll<SVGPathElement>('.nw-reach')),
      syn: el.querySelector('.nw-synapse')!,
      pulse: el.querySelector('.nw-pulse')!,
      E: 0,
      applied: -1,
      fired: 0,
    })
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  // ⚠ REBUILT WHEN THE MAP TURNS, and that is the whole reason it is not `[]`.
  // A node's handle is collected once, when its <g> mounts — and turned, the
  // date is not in that <g> at all. Crossing TURN_AT the other way would leave
  // the engine holding `yr: null` for all 56 marks and the dates would sit at
  // their first-paint ink for ever. Changing the callback's identity is what
  // makes React hand the element back.
  const nodeRefs = useMemo(
    () => new Map(WORLD.nodes.map((n) => [n.id, (el: SVGGElement | null) => registerNode(n, el)])),
    [vertical],
  )
  const connRefs = useMemo(
    () =>
      new Map(
        WORLD.links.map((l) => {
          const key = `${l.a}>${l.b}`
          return [key, (el: SVGGElement | null) => registerConn(key, l.a, l.b, el)]
        }),
      ),
    [],
  )
  /* eslint-enable react-hooks/exhaustive-deps */

  // ---- the field card ----
  // (blurbOf retired 2026-08-07 with the fold. ⚠ THIS IS A REAL LOSS AND IT IS
  // DELIBERATE: the clicked card used to carry the project's dek or the note's
  // opening line, and the folded map carries no prose at all. The fold answers
  // "what does this connect to"; what the thing itself SAYS is on its own page,
  // one press away on the OPEN under its name. Putting the sentence back means
  // putting a panel back, which is the thing the fold replaced.)



  // THE WORLD BRINGS WHAT YOU TAPPED INTO VIEW (Emilie's pick 2026-08-02).
  // A mark near a side edge had most of its threads off screen, and following
  // one meant panning, which is exactly when the card used to vanish. Sliding
  // the tapped mark to the middle means its connections are always reachable in
  // both directions. Reduced motion jumps instead of gliding, and a mark that
  // is already near enough to the middle is left alone: re-centring by 12px is
  // a twitch, not a movement.
  // WHERE THE SNAP POINTS GO, IN CSS PIXELS (2026-08-04). The year rules are
  // SVG inside one <svg>, and an SVG element cannot carry `scroll-snap-align`,
  // so the browser needs seven ordinary elements to snap to. They are absolutely
  // positioned inside the stage, which scrolls them with the content, and that
  // means their offsets have to be REAL PIXELS: a percentage would resolve
  // against the stage's 390px padding box, not against the 5355px of world
  // inside it. The scale comes from the SVG's own rendered width, so a rotation,
  // a resize or a browser zoom simply re-measures — the same reading
  // scrollToWorldX takes, one axis over.
  const [snapAt, setSnapAt] = useState<number[]>([])
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const measure = () => {
      const w = svg.getBoundingClientRect().width
      if (!w) return
      // WORLD.skeleton, not the `sk` alias: that const is declared further down
      // this component, so reading it from a memo or an effect body that runs
      // during the same render is a temporal dead zone error. It cost one blank
      // page to find, and tsc does not catch it.
      setSnapAt(WORLD.skeleton.years.map((y) => (y.x / WORLD.w) * w))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(svg)
    return () => ro.disconnect()
  }, [])

  // WHICH YEAR AM I IN (Emilie's ruling 2026-08-04: a place drawer reads out its
  // position, live, "whether you got there by flick, drag or drawer").
  //
  // The map has no sections to observe, so there is nothing for an
  // IntersectionObserver to watch the way /cv's headings can be watched. But the
  // snap markers ARE the year positions in the same coordinate space the stage
  // scrolls in, already measured, so the reading is one comparison: the year you
  // are in is the last rule at or before the left edge of the screen — exactly
  // where the snap puts it, so the readout and the snapping agree by
  // construction rather than by two separate guesses.
  // Everything past the last rule keeps reading 2026, which is true: that
  // stretch IS 2026 and after.

  // SNAPPING STANDS ASIDE FOR A DELIBERATE MOVE (2026-08-04, with the year
  // snap). Every call below has already chosen an exact position for a reason —
  // a deep link centres its node and TODAY lands on the live tip. Proximity
  // snapping would pull each of those to the nearest year rule a moment later
  // and quietly undo
  // the judgement. The class is cleared on a timer rather than `scrollend`,
  // which Safari did not have until recently and which never fires at all when
  // the requested position is where we already are.
  // A STABLE HANDLE for children that must not re-render with this component.
  // scrollToWorldX is redeclared every render (it closes over live refs, which
  // is fine), so passing it down directly would defeat the memo it is passed to.
  const scrollToWorldXRef = useRef<(x: number, smooth?: boolean | 'always') => void>(() => {})

  const freeTimer = useRef(0)
  function freeSnap() {
    const stage = stageRef.current
    if (!stage) return
    stage.classList.add('is-free')
    window.clearTimeout(freeTimer.current)
    freeTimer.current = window.setTimeout(() => stage.classList.remove('is-free'), 700)
  }

  /**
   * `smooth` accepts `'always'` for a move the visitor ASKED for by name
   * (Emilie's ruling 2026-08-04, from the deployed site: "if i stand at 2023 and
   * press 2026 it jumps there instead of sliding through, like from 2023 to
   * 2024, idk why there is this inconsistency").
   *
   * She had found a real seam. The two-screen cut below was written for TAPPING
   * A NODE, where you can already see the thing you tapped and a long ride is
   * just a wait. A drawer press is the opposite gesture: you named a year you
   * cannot see, and the ride between is the only thing that tells you how far
   * apart the years actually are. Measured, that is what made it inconsistent:
   * 2023 → 2024 is 472px and glided, 2023 → 2026 is 1792px and cut, with the
   * threshold at two screens (780px) sitting invisibly between them.
   *
   * Uncapped, at her ruling. The longest possible ride, 2020 → 2026, is 2547px.
   */
  function scrollToWorldX(worldX: number, smooth: boolean | 'always' = true) {
    const stage = stageRef.current
    const svg = svgRef.current
    if (!stage || !svg) return
    freeSnap()
    const scale = svg.getBoundingClientRect().height / WORLD.h || 1
    const target = worldX * scale - stage.clientWidth / 2
    const max = stage.scrollWidth - stage.clientWidth
    const left = Math.max(0, Math.min(max, target))
    const distance = Math.abs(left - stage.scrollLeft)
    if (distance < 8) return
    // A GLIDE ONLY WHERE A GLIDE MEANS SOMETHING. Smooth scrolling a track this
    // wide is a several-second ride: measured, a tap on the far end of the
    // record asked for a 4900px journey, which is not a transition, it is a
    // wait. Under two screens the movement shows you the relationship between
    // where you were and where you are; beyond that it only shows you a blur,
    // so it cuts.
    const glide = smooth === 'always' ? !prm : smooth && !prm && distance < stage.clientWidth * 2
    stage.scrollTo({ left, behavior: glide ? 'smooth' : 'auto' })
  }
  scrollToWorldXRef.current = scrollToWorldX
  // The years, as the room's verbs. Derived from the same `sk.years` the map
  // draws, so a year can never appear in the drawer that is not on the map.

  // (centreOn retired 2026-08-07: choosing used to slide the tapped mark to the
  // middle so its threads were reachable both ways. The fold makes that job
  // obsolete — the camera frames the whole neighbourhood, and the scroll is
  // deliberately left ALONE while folded so the lens and the scroller cannot
  // fight over the same axis.)

  function setForce(id: string, t: number) {
    const h = nodesRef.current.get(id)
    if (!h) return
    h.forceT = t
    engine.kick()
  }

  // CHOOSING a node locks its card (releasing any previously chosen node's
  // wake); choosing it again closes it. Travel is the card's OPEN button, so a
  // stray click never jumps the page — and since 2026-08-07 the Enter key does
  // exactly this too rather than travelling, so the mark has ONE contract.
  // Screen readers travel via WorldSrNav's links.
  // CHOOSING FOLDS THE MAP (Emilie's pick, 2026-08-07). The empty years between
  // a node and the things it touches close up, the rest of the record sinks
  // away, and the camera gives up just enough scale to fit what is left.
  //
  // THE SCALE IS SOLVED TWICE ON PURPOSE. How wide a label is in world units
  // depends on the counter-scale, the counter-scale depends on the camera, and
  // the camera depends on the box the labels make — so the first pass fits with
  // a provisional scale and the second re-lanes against the real one. Two
  // passes converge; measured, the third would move nothing.
  function applyFold(id: string) {
    const stage = stageRef.current
    const svg = svgRef.current
    if (!stage || !svg) return
    // ⚠ THE PROJECTION FACTOR IS READ OFF A DIFFERENT EDGE ONCE THE MAP IS
    // TURNED. Lying down, the viewBox is `w x h` and the element is sized by
    // its HEIGHT, so one world unit is `height / WORLD.h` pixels. Turned, the
    // viewBox is `h x w` and the element is sized by its WIDTH, so it is
    // `width / WORLD.h`. Reading the wrong edge gave s0 = 4.03 instead of 0.45
    // and the camera solved to scale 0.0003 — the fold was there, three
    // thousand times too small to see.
    const box0 = svg.getBoundingClientRect()
    // ⚠ A STAGE WITH NO SIZE MUST NOT BE FOLDED. `s0` divides into every number
    // below — the camera, and now the type, which is counter-scaled by it — so
    // a zero here does not degrade, it detonates: `planFold` is handed scale 0,
    // its font comes out Infinity, the box goes to ±Infinity and the fit solves
    // `Math.min(Infinity, NaN, 1.6)` = NaN, which reaches the DOM as
    // `translate(NaNpx, NaNpx) scale(NaN)` — a blank chosen view and no error
    // anywhere. It is reachable: the `nw-refold` path runs from a mount effect,
    // and a stage mid route transition can measure zero. Bailing leaves the
    // mark HELD, which is the honest rung to stop on.
    if (box0.width <= 0 || box0.height <= 0) return
    const s0 = vertical ? box0.width / VVIEW : box0.height / WORLD.h
    const vw = stage.clientWidth
    const vh = stage.clientHeight
    const PAD = 0.86 // a little air at the edges

    // ITERATE TO CONVERGENCE, not a fixed two passes. A label's width in WORLD
    // units is 1/k, so the box grows as the camera pulls back and the two chase
    // each other. It settles (a name is narrower than the frame, so each round
    // adds less than the last), but two passes was not enough at 390px: it left
    // three overlapping names and pushed one clean off the frame. Capped at 8
    // and on a 0.5% delta, which in practice lands in three or four.
    // MEASURE THE LABELS, DO NOT ESTIMATE THEM. The map draws its four kinds in
    // different faces, so a per-character advance ranges from 0.395 (a serif
    // thought name) to about 0.8 (a mono uppercase one) — a 2x spread no single
    // constant survives. Each label is already in the DOM at its resting size,
    // so its true width scales linearly with the font it will be given.
    const measure = (nodeId: string, font: number): number | undefined => {
      const el = nodesRef.current.get(nodeId)?.lbl
      if (!el) return undefined
      const restFont = parseFloat(getComputedStyle(el).fontSize) || 9.5
      try {
        return (el.getBBox().width / restFont) * font
      } catch {
        return undefined
      }
    }

    // ⚠ THE FOLD'S TYPE IS SIZED AGAINST THE FULL RENDERED SCALE WHEN TURNED,
    // not against the camera alone. planFold divides its base size by whatever
    // it is handed, so handing it k leaves the label at `BASE * GROW * s0` on
    // the glass — and turned, s0 is 390/860, which came out at 5.4px. The
    // chosen view, the one state that exists to be READ, had the smallest type
    // on the page. Lying down s0 is near 1 and the two are the same number,
    // which is why this never showed up before the map turned.
    // ⚠ TURNED, THE FOLD READS AT THE MAP'S OWN SIZE — no growth at all (her
    // ruling A, 2026-08-08). Lying down, LABEL_GROW makes a chosen name a
    // quarter larger than rest, which is affordable because the members spread
    // ACROSS a wide frame. Turned they stack DOWN a narrow one, and the frame
    // hands each member 537/(N-1) px: 268 at three members, 49 at twelve. A
    // name and its date are 21px of that, so the growth was being taken out of
    // the only thing in short supply.
    // ⚠ MEASURED BEFORE CHOOSING: dropping the growth buys 4px of the 28 a
    // twelve-member fold has left. Type was never the bottleneck — which is
    // why this ships with the alternation below, not instead of it.
    const fs = (c: number) => (vertical ? (c * s0 * LABEL_GROW) / VTYPE : c)
    /** ⚠ TURNED, THE BOX HAS TO BE REBUILT — planFold's is solved for a map
     *  lying down, where a label is wide along TIME and the lanes stack across
     *  relatedness. Turned, both of those are the other way round: a name runs
     *  ACROSS relatedness and the name/date stack hangs along time. Fitting the
     *  camera to the flat box measured the wrong edge on both axes.
     *  `halfW` is reserved on BOTH sides even though a name only ever takes
     *  one: which side it takes is not decided until the camera is settled,
     *  which is the same chicken and egg the scale already has. */
    const turnedBox = (pl: FoldPlan, kk: number) => {
      const f = (9.5 * LABEL_GROW) / fs(kk)
      let halfW = 0
      for (const m of pl.members) {
        const text = m.node.mapLabel ?? m.node.title
        const w = measure(m.node.id, f) ?? text.length * f * 0.7
        if (w / 2 > halfW) halfW = w / 2
      }
      const xs = pl.members.map((m) => m.node.x + m.dx)
      const ys = pl.members.map((m) => m.node.y + m.dy)
      const raw = pl.members.map((m) => m.node.y)
      return {
        x0: Math.min(...xs) - f * 2.8,
        x1: Math.max(...xs) + f * 1.2,
        y0: Math.min(...ys) - halfW,
        y1: Math.max(...ys) + halfW,
        halfW,
        rawSpan: Math.max(...raw) - Math.min(...raw),
      }
    }

    let spread = 1
    let plan = planFold(id, fs(0.4), measure, spread)
    if (!plan) return
    let k = 0.4
    for (let pass = 0; pass < 8; pass++) {
      // The box is always in WORLD terms: x spans time, y spans relatedness.
      // Turned, time is what runs down the screen, so the box's screen width
      // comes from its y span and its screen height from its x span.
      const tb = vertical ? turnedBox(plan!, k) : null
      const bw = (tb ?? plan!.box).x1 - (tb ?? plan!.box).x0
      const bh = (tb ?? plan!.box).y1 - (tb ?? plan!.box).y0
      const acrossScreen = vertical ? bh * VCOMP : bw
      const downScreen = vertical ? bw : bh
      // k is the camera's own factor; the rendered scale is k * s0.
      const next = Math.min((vw * PAD) / (acrossScreen * s0), (vh * PAD) / (downScreen * s0), 1.6)
      const settled = Math.abs(next - k) / k < 0.005
      k = next
      // ⚠ THE STRETCH IS SIZED OFF THE AXIS THE CAMERA IS NOT USING, and BOTH
      // orientations have one. A fold spreads its members evenly along TIME and
      // that span sets k, so whichever screen axis time runs down is the tight
      // one and relatedness is left slack. Filling exactly that slack costs
      // nothing: the second constraint only just becomes binding, so k does not
      // drop and the loop does not oscillate.
      //
      // ⚠ TURNED ONLY, BY HER RULING — the desktop half was BUILT, MEASURED
      // (25% -> 81% of the height) AND REVERTED ON SIGHT: "I want it to stay
      // like it was, just the timeline stretch and not filling all the screen
      // like the phone." Lying down, the horizontal band IS the reading: a fold
      // there is a stretch of the TIMELINE, and relatedness stays the shallow
      // thing it is on the map. DO NOT RE-PROPOSE IT.
      // Turned, the axes swap — time runs down, the width is the slack, and
      // that is the one she asked to fill ("it can definitely be stretched
      // sideways for the threads to be clearer").
      if (tb) {
        const room = (vw * PAD) / (s0 * k) - 2 * tb.halfW
        spread = tb.rawSpan > 1 ? Math.min(Math.max(room / tb.rawSpan, 1), 8) : 1
      }
      plan = planFold(id, fs(k), measure, spread)!
      if (settled) break
    }
    const box = vertical ? turnedBox(plan, k) : plan.box
    const cx = (box.x0 + box.x1) / 2
    const cy = (box.y0 + box.y1) / 2
    // Put the folded box's centre in the middle of what is on screen. scrollLeft
    // is read, not changed: the stage stops scrolling while folded, so the
    // camera and the scroller cannot fight.
    // The camera translates in WORLD units, inside the turn — so once turned,
    // tx is what moves the drawing DOWN the screen and ty is what moves it
    // ACROSS, and both run backwards, because the matrix maps (x, y) to
    // (h - y, w - x).
    const tx = vertical
      ? WORLD.w - (stage.scrollTop + vh / 2) / s0 - cx * k
      : (stage.scrollLeft + vw / 2) / s0 - cx * k
    const ty = vertical ? WORLD.h - vw / 2 / (s0 * VCOMP) - cy * k : vh / 2 / s0 - cy * k
    camAt.current = { tx, ty, k }
    writeCam(true)

    foldRef.current = true
    const self = plan.members.find((m) => m.rel === 'self')!

    /** WHICH SIDE OF THE SPINE EACH NAME TAKES (her ruling B, 2026-08-08:
     *  "they should all feel like the first one almost").
     *
     *  ⚠ THE SCARCE THING IS VERTICAL ROOM, NOT TYPE SIZE. The frame is 537px
     *  tall whatever the fold holds, so twelve members get 49px each against a
     *  21px name-and-date — 28px of air, where three members get 247. Half the
     *  names moving to the other side of the spine doubles the room on each:
     *  a twelve-member fold then reads like a six-member one, and nothing is
     *  hidden to buy it.
     *
     *  It is not a new idea either — it is what the WEB fold already does. Its
     *  lanes stack labels across the axis that is not time, and turned, that
     *  axis is sideways. (The lane offsets themselves stay off: they shifted a
     *  centred name by 13px, which reads as misalignment, not separation.)
     *
     *  THE SUBJECT KEEPS THE MIDDLE. It carries the ring and the door, and it
     *  is the one thing the view exists to point at.
     *
     *  ⚠ AND THE CHOICE IS MEASURED, not alternated blindly: a name that would
     *  run off the frame takes the other side, whatever its turn. The camera
     *  translates in world units INSIDE the turn, so it is ty, not tx, that
     *  moves a mark across — and `* s0` is what turns the viewBox coordinate
     *  into a real pixel.
     *  ⚠ EVERY TERM HERE IS IN THE SAME PIXELS, and it was not: `sx` used to be
     *  divided by a projection pinned to 390 while `w` and `gap` were already
     *  real pixels, so the fit test was only true at exactly 390px wide.
     *  Measured at 320: two of Sensi's twelve names were placed on a side they
     *  did not fit and ran off the frame. */
    const foldFont = (9.5 * LABEL_GROW) / fs(k)
    const renderPx = foldFont * k * s0
    const sideOf = (m: FoldPlan['members'][number], i: number): number => {
      if (!vertical || m.rel === 'self') return 0
      const n = m.node
      const sx = (WORLD.h - (ty + k * (n.y + m.dy))) * s0
      const w = (n.mapLabel ?? n.title).length * LABEL_METRIC[n.kind].adv * renderPx
      const gap = (n.style.r * renderPx) / 9.5 + renderPx * 0.55
      const fitsRight = sx + gap + w <= vw - VFRAME_PAD
      const fitsLeft = sx - gap - w >= VFRAME_PAD
      const want = i % 2 === 0 ? 1 : -1
      if (want > 0 && fitsRight) return 1
      if (want < 0 && fitsLeft) return -1
      if (fitsRight) return 1
      if (fitsLeft) return -1
      return vw - sx > sx ? 1 : -1
    }
    const byId = new Map(
      plan.members.map((m, i) => [
        m.node.id,
        { dx: m.dx, dy: m.dy, lane: m.lane, order: i, side: sideOf(m, i) },
      ]),
    )
    setFold({
      subject: id,
      byId,
      links: plan.links,
      arms: plan.arms,
      // ⚠ THE SAME SCALE THE SOLVER WAS GIVEN, or the lanes and the type stop
      // agreeing — planFold reserves 1.42 fonts per lane, and this is the font
      // it reserves them for.
      font: (9.5 * LABEL_GROW) / fs(k),
      // The door's hit area is sized in WORLD units to land at 44 CSS px: the
      // whole point of a counter-scaled view is that world units and screen
      // pixels have stopped agreeing, and a target measured in the wrong one is
      // how it rendered 10px tall the first time.
      hit: 44 / (k * s0),
      // THE DOOR STAYS IN THE MAP. With the panel gone there was nowhere left to
      // travel from, and the answer is not to bring a panel back: the subject
      // grows its own OPEN under its name. One affordance, in the drawing, on
      // the thing you chose.
      // ⚠ THE ANCHOR IS THE SUBJECT'S OWN BASELINE, AND TURNED THAT IS A
      // DIFFERENT PAIR OF NUMBERS. Lying down the name hangs at y + r + 18 and
      // the door hangs under it. Turned, "under" is -x, and the name's y is
      // the mark's y untouched — so feeding the web's baseline in left the
      // arrow floating on its own beside the star, with nothing under the name
      // it was supposed to open.
      open: self.node.route
        ? {
            id: self.node.id,
            route: self.node.route,
            // ⚠ THE GAP FROM MARK TO NAME IS A FONT MULTIPLE IN THE FOLD, not
            // a fixed number of world units. A fixed offset scales with the
            // camera while the counter-scaled type does not, so at a wide fold
            // (small k) the name climbs onto its own soma and at a tight one it
            // drifts. The radius term keeps scaling, because the mark scales.
            x: vertical
              ? self.node.x +
                self.dx +
                (self.node.labelAbove
                  ? vPx(self.node.style.r * VTYPE) + ((9.5 * LABEL_GROW) / fs(k)) * 1.15
                  : -vPx(self.node.style.r * VTYPE) - ((9.5 * LABEL_GROW) / fs(k)) * 1.15)
              : self.node.x + self.dx,
            // the label's baseline, not the node's centre: the two differ by
            // the soma radius plus 18, which is exactly what put OPEN on the date
            y: vertical ? self.node.y : labelBaseline(self.node),
          }
        : null,
      openLane: self.lane,
      openW: (() => {
        const el = nodesRef.current.get(self.node.id)?.lbl as SVGTextElement | null | undefined
        // getBBox is in user units, so this is already world units at REST
        // size; the fold grows the label, so scale by the same ratio.
        const rest = el && typeof el.getBBox === 'function' ? el.getBBox().width : 0
        // ⚠ divided by the label's OWN resting size, not a literal 9.5 — turned
        // it is 0.78 of that, and a thought's is a different number again
        const restFont = el ? parseFloat(getComputedStyle(el).fontSize) || 9.5 : 9.5
        return rest > 0 ? (rest * ((9.5 * LABEL_GROW) / fs(k))) / restFont : 0
      })(),
    })
  }

  // THE FOLD IS EXPLORABLE, NOT A SLIDE (her note: "we should be able to explore
  // it", "maybe isolate it so we can drag around"). The stage's own scroller is
  // off while folded — it and the camera would fight over the same axis — so
  // dragging moves the CAMERA instead, in both directions, and a wheel zooms it.
  // The nodes never move: this is the lens, so nothing it does can lie.
  const camAt = useRef({ tx: 0, ty: 0, k: 1 })
  function writeCam(animate: boolean) {
    const cam = camRef.current
    if (!cam) return
    const c = camAt.current
    cam.style.transition = animate ? '' : 'none'
    cam.style.transform = `translate(${c.tx.toFixed(1)}px, ${c.ty.toFixed(1)}px) scale(${c.k.toFixed(4)})`
  }

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !fold) return
    let drag: { x: number; y: number; tx: number; ty: number } | null = null
    let moved = 0
    const down = (e: PointerEvent) => {
      // ⚠ `.nw-node` IS ON THIS LIST, and leaving it off is what stopped you
      // switching inside the chosen view (her flow, 2026-08-07: "when we press
      // a mark in the isolated mode it should switch to it in the isolated
      // mode, not back to the held mode").
      // POINTERUP IS A DISCRETE EVENT, so React flushes its state change
      // synchronously — before the CLICK that follows it. So this handler's
      // stepBack() released the fold, React re-rendered, and the click then
      // arrived at a handler that could no longer see a fold: it read the tap
      // as "hold something else" and dropped a rung. The fix is not to order
      // the two handlers, it is for this one to keep its hands off a mark at
      // all — a press on a mark is never a press on empty field.
      if ((e.target as Element).closest('.nw-node, .nw-foldopen, a, button')) return
      moved = 0
      drag = { x: e.clientX, y: e.clientY, tx: camAt.current.tx, ty: camAt.current.ty }
      stage.classList.add('dragging')
    }
    // THE CHOSEN VIEW DOES NOT MOVE (Emilie's ruling 2026-08-07: "in the
    // isolated state we should not be able to scroll").
    //
    // It used to pan with a drag and zoom with the wheel. Both are gone, and
    // the reason is what the view IS: the fold solves for a frame that holds
    // this mark and everything it touches, at the largest scale that still
    // fits. Every one of those solved positions is an answer. Panning slides
    // the answer off the edge and zooming undoes the fit — measured, one wheel
    // gesture took the lens from 0.574 to 0.303, less than half the scale the
    // solver had chosen. There was nothing to find out there: the whole
    // neighbourhood was already on screen.
    //
    // The gesture bookkeeping stays, because a tap on empty field is still the
    // way out and it must not fire at the end of a stray drag.
    const move = (e: PointerEvent) => {
      if (!drag) return
      moved = Math.max(moved, Math.abs(e.clientX - drag.x), Math.abs(e.clientY - drag.y))
    }
    const up = () => {
      // A tap on empty field releases; a drag never does.
      if (drag && moved <= 4) stepBack()
      drag = null
      stage.classList.remove('dragging')
    }
    // Swallowed, not acted on: the stage sits inside a scrolling document, and
    // without preventDefault a wheel over a fixed view scrolls the page behind
    // it, which reads as the map having jumped.
    const wheel = (e: WheelEvent) => {
      e.preventDefault()
    }
    stage.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    stage.addEventListener('wheel', wheel, { passive: false })
    return () => {
      stage.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      stage.removeEventListener('wheel', wheel)
    }
    // dismiss only touches refs + setState
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fold])


  function travel(route: string) {
    // COMING BACK LANDS WHERE YOU LEFT (Emilie 2026-08-07: "when we open the
    // card of a project or a thought from the map, when we press x or esc we
    // should go back to that isolated mode of that node").
    // Both doors out of a piece are `navigate(-1)`, so the browser returns to
    // /thoughts and this component mounts fresh with no memory of what was
    // open. The subject is written down on the way out and read once on the way
    // back in — consumed, not kept, so arriving at the map any other way is
    // unaffected.
    if (foldRef.current && lockedId.current) {
      try {
        sessionStorage.setItem('nw-refold', lockedId.current)
      } catch {
        /* private mode: you come back to the map instead of to the mark */
      }
    }
    preloadPath(route)
    navigate(travelTo(route), { viewTransition: true })
  }

  function releaseFold() {
    const cam = camRef.current
    if (cam) {
      cam.style.transition = ''
      cam.style.transform = ''
    }
    camAt.current = { tx: 0, ty: 0, k: 1 }
    foldRef.current = false
    setFold(null)
    // Releasing lands on HELD again, the rung below: the mark you were looking
    // at stays lit and stays chosen, so one step back is one step, never two.
  }

  /** CHOOSING A MARK. One step, not two (Emilie's ruling 2026-08-07).
   *
   *  There used to be a rung in between: click once to light a mark up, click
   *  again to gather its neighbourhood. The middle rung was the weakest thing
   *  on the page. On a pointer, HOVER already does that glance, so the click
   *  only repeated it; on a phone there is no hover, so it cost a whole tap to
   *  be shown something you had already asked for. And the DOOR into the
   *  writing only appeared on the third rung, which put every note three
   *  actions deep.
   *
   *  Measured on Sensi before the change: lighting it up left five of its ten
   *  neighbours off the frame and offered no way in; the gathered view holds
   *  twelve marks and carries the door. So the rung that survives is the one
   *  that answers the question, and choosing now means gathering.
   *
   *  `hold` stays as the mechanism — the fold's subject is still the held mark,
   *  and the NOW tip still only ever holds, because it has no page to open and
   *  no threads to gather. It is simply no longer a rung of its own. */
  function hold(id: string) {
    if (lockedId.current && lockedId.current !== id) setForce(lockedId.current, 0)
    lockedId.current = id
    setHeldId(id)
    setForce(id, 1)
  }

  /** ONE STEP BACK. Escape and a tap on nothing both land here, and neither
   *  ever jumps two rungs: from the fold you return to the neuron you were
   *  holding, still lit, still where you left it.
   *  It reads foldRef, NOT the fold state: the drag and Escape handlers are
   *  installed once at mount and would close over the first render forever. */
  function stepBack() {
    if (foldRef.current) {
      releaseFold()
      return
    }
    if (lockedId.current) {
      setForce(lockedId.current, 0)
      lockedId.current = null
      setHeldId(null)
    }
  }

  function onNodeClick(n: WorldNode) {
    if (fold) {
      // inside the fold: choosing the subject again steps back, choosing any
      // other member re-folds on it (walking the neighbourhood)
      if (n.id === fold.subject) {
        releaseFold()
        return
      }
      hold(n.id)
      applyFold(n.id)
      return
    }
    // THE LADDER IS THREE RUNGS AGAIN (Emilie's ruling 2026-08-07, over my
    // recommendation — recorded because the reasoning against it still stands
    // and should not be re-argued from scratch: on a pointer, hover already
    // does what held does, and a third rung puts the writing three actions
    // away). What is different from the ladder we deleted this morning is
    // everything around it: the door works, the chosen view cannot be scrolled
    // or zoomed away, and each rung now says what it can do.
    if (lockedId.current === n.id) {
      applyFold(n.id) // HELD -> CHOSEN
      return
    }
    hold(n.id) // BROWSE -> HELD, or hold a different mark
  }

  const sk = WORLD.skeleton

  return (
    // The same frame shell as SheetPage (flex min-h-dvh flex-col) so the
    // sticky header pill sits at the identical position as every other page
    // (the audit fixed the world's pill reading "slightly up", 2026-07-19).
    <div className="flex min-h-dvh flex-col text-[var(--lang-ink)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-redline focus:px-4 focus:py-2 focus:font-mono focus:text-nav focus:text-mylar"
      >
        Skip to content
      </a>
      {/* THE HEADER LINE (the design audit, Emilie 2026-07-19: header + footer
          lines identical everywhere, the canvas clean of chrome): the pill
          left, WATCH IT GROW on the header line right, exactly like every
          other page's tools. */}
      {/* ON THE HEADER LINE FROM lg UP, and nowhere near it below (Emilie,
          2026-08-02: "we need to find a better placement for the WATCH IT GROW
          and spacing and size"). Measured at 390: the button was 149x32 with
          its top edge at 70px, which is the pill's bottom edge exactly, so it
          touched the chrome above it AND missed the 44px touch floor by 12px.
          Below lg it moves to the corner (further down), as a round 44px
          control. The header line keeps it where there is room for words. */}
      <TitleBlock
        toolsKey="world"
        tools={
          !prm ? (
            <button
              type="button"
              onClick={() => engine.replay()}
              className="hidden min-h-11 items-center rounded-[var(--r-pill)] border border-[var(--lang-hairline)] px-3 font-mono text-label tracking-[0.1em] text-[var(--lang-ink)] hover:border-[var(--lang-interaction)] hover:text-[var(--lang-interaction)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)] lg:inline-flex"
            >
              ⟳ WATCH IT GROW
            </button>
          ) : undefined
        }
      />
      <main id="main" tabIndex={-1} className="outline-none">
        {/* THE CLEAR CANVAS (the design audit round 2, Emilie 2026-07-19:
            "remove 'points in time' and the other words from the content
            area; keep the header area clear, no overlap with a node"). The
            title + meta left the canvas entirely; the nav's THOUGHTS door
            names the room, and the h1 survives for screen readers + SEO
            (headData still needs it). The stage itself is inset between the
            header and footer lines (.nw-stage, index.css), so no node ever
            runs under the chrome; the old fade scrims retired (round 3). */}
        <h1 className="sr-only">The mind in time: every project, thought, milestone and award since 2021</h1>

        {/* THE FOOTER LINE (Emilie's pick 2026-07-19: the world's key lives on
            a footer line, no name/contact footer on this immersive page):
            the legend (left) + the drag hint (right), one glass line at the
            footer's height + insets so it reads the same as every page.
            pointer-events-none so a drag still passes through to the stage. */}
        {/* THE KEY READS AT THE TOP, THE CONTROLS SIT IN THE THUMB (Emilie's
            ruling 2026-08-02, board option C, from her own question: "what
            about the legend at the top below the header and the control below
            as a band?"). They were one band at the foot doing two unrelated
            jobs. Split, each goes where its job belongs: a key is reference you
            glance at, so it sits at the top where the eye starts, and the
            controls are the one thing you TOUCH, so they sit at the bottom,
            which is the only part of a phone a thumb reaches without
            re-gripping. It also gives the world a line above and a line below,
            which is the header-line/footer-line frame the rest of the site
            already wears.
            pointer-events-none on both wrappers so a drag passes through to the
            stage; only the button re-enables its own. */}
        {/* top-[5.5rem] = 88px, an 18px breath under the pill's 70px bottom
            edge (Emilie, 2026-08-02: "the legend at the top doesn't have a gap
            between it and the header"). At 4.25rem it began at 68px and
            actually overlapped the pill by 2px.
            AND IT IS NOT A PILL (her call, same message: "maybe the legend
            doesn't need to be inside a pill for a cleaner look"). She is right,
            and it is safe here in a way it would not have been at the foot: the
            world is inset to start BELOW this band, so nothing passes behind
            these marks and there is nothing for glass to lift them off. A key
            is not chrome, it is a caption; bare on the ground is what a caption
            looks like. The control band at the foot keeps its pill, because
            that one IS chrome and the world does run under it. */}
        {/* THE KEY IS PHONE-ONLY UP HERE NOW (Emilie, 2026-08-06: "the legend
            has to go back to the footing", for the desktop version only).
            Her 2026-08-02 ruling that split the one foot band in two stands
            exactly where its argument was true: on a phone the key is reference
            and the controls are what a thumb reaches, so they belong at opposite
            ends. On a desktop there is no thumb and no reach problem, the foot
            band has a whole empty middle, and the key riding up here costs the
            world 26px of height for nothing. So the split is now what it always
            should have been: a phone rule, not a site rule. */}
        <div className="pointer-events-none fixed inset-x-0 top-[5.5rem] z-[3] px-5 sm:px-8 lg:hidden">
          <div className="mx-auto flex max-w-[1856px] flex-wrap items-center justify-center gap-x-6 gap-y-1 px-1">
            <KeyMarks />
          </div>
        </div>

        {/* THE CONTROL BAND. WATCH IT GROW on the left, the drag hint on the
            right, one line at the foot. The button is a real labelled control
            here rather than the cornered glyph of the previous build: down here
            there is a whole row for it, so it can say what it does. */}
        <div className="pointer-events-none fixed inset-x-0 bottom-2 z-[3] px-5 sm:px-8">
          <div className="lang-glass-1 mx-auto flex max-w-[1856px] flex-wrap items-center justify-between gap-x-6 gap-y-1 rounded-[var(--r-card)] px-5 py-1.5 sm:px-7">
            <span className="flex items-center gap-x-4">
              {!prm && (
                <button
                  type="button"
                  onClick={() => engine.replay()}
                  className="pointer-events-auto inline-flex min-h-11 items-center gap-1.5 font-mono text-micro tracking-[0.12em] text-[var(--lang-ink)] transition-colors hover:text-[var(--lang-interaction)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)] lg:hidden"
                >
                  <span aria-hidden="true">⟳</span> WATCH IT GROW
                </button>
              )}
              {/* THE WAY BACK TO TODAY (Emilie's pick 2026-08-02). The map opens
                  on the present now, but it is a wide thing to pan and there was
                  no way home once you had travelled: you could get lost in 2022
                  and only find your way out by dragging. One tap returns to the
                  live tip. It reads TODAY rather than NOW because NOW is already
                  the name of the mark it travels to, and a control should not
                  share a name with its destination. */}
              {/* TODAY GOES WITH THE DRAWER while a mark is chosen (Emilie
                  2026-08-07: "the footer should remove the today button in the
                  isolated mode since it does nothing"). It is literally true —
                  it calls `scrollToWorldX`, and the chosen view does not
                  scroll, so pressing it did nothing at all. Every control that
                  moves the map now leaves together, which is what makes the
                  chosen state read as a place rather than as the map with
                  something switched off. */}
              {!fold && (
                <button
                  type="button"
                  onClick={() => scrollToWorldX(WORLD.skeleton.nowAt.x)}
                  className="pointer-events-auto inline-flex min-h-11 items-center gap-1.5 font-mono text-micro tracking-[0.12em] text-[var(--lang-ink-muted)] transition-colors hover:text-[var(--lang-interaction)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
                >
                  <span aria-hidden="true">→</span> TODAY
                </button>
              )}
            </span>
            {/* THE HINT IS DESKTOP-ONLY NOW (Emilie's ruling 2026-08-04). The
                second clause already waited for sm, because "IT WAKES WHERE YOU
                LOOK" describes a POINTER, which is the one thing a phone does
                not have. What is left below sm is "DRAG TO EXPLORE" — and on a
                map, dragging is the only thing there is to do. It was telling a
                visitor the one thing they were already doing, in 9px, at the
                very bottom edge of the screen, next to a drawer that now names
                seven years. Gone below sm; unchanged from sm up, where the full
                sentence is true and the room to say it exists. */}
            {/* THE KEY RIDES THE MIDDLE OF THIS BAND FROM lg UP (Emilie,
                2026-08-06). The band already had a left end and a right end and
                nothing between them; the key is exactly the width of that gap.
                It is a caption rather than a control, so it stays aria-hidden
                and takes no pointer events, and the band's `justify-between`
                does the placing with no new geometry. */}
            <div className="hidden lg:block">
              <KeyMarks />
            </div>
            {/* (The off-frame counter is GONE, 2026-08-07, and this is the
                second decision about it in one pass. It was moved here first,
                off the drawing, because it printed its red "‹8 MORE" over a
                node's name. Then choosing became gathering — and a gathered
                view has nothing off the frame. Measured across every mark with
                neighbours, desktop and phone: members outside the frame, zero,
                every time. The counter was not misplaced, it was answering a
                question the page had stopped asking, and it had started
                lying — it counted against the resting positions, not the
                folded ones, so it reported eight away while all eight were on
                screen. A number nobody can check is worse than no number. */}
            {/* THE LEGEND SAYS WHAT THIS STATE CAN DO (Emilie's ruling
                2026-08-07: "in the isolate mode there should still be a legend
                for the user to know what options they have").
                Browsing and choosing are two different rooms with two different
                sets of verbs, and the band was only ever describing the first.
                Worse, once a mark was chosen every word of it had become false:
                you cannot drag a fixed view, and it no longer wakes where you
                look because there is only one thing lit.
                THE CHOSEN LEGEND SHOWS AT EVERY WIDTH, unlike the browse hint
                which is desktop-only. The browse hint tells you the one thing
                you were already doing; this one names three verbs you have no
                other way of discovering — least of all on a phone, which has no
                hover to reveal that a name is a door. */}
            {/* THREE RUNGS, THREE LEGENDS (2026-08-07). The band names the verbs
                of the rung you are standing on and nothing else — held is not
                browsing (the map has stopped proposing marks) and it is not
                chosen (nothing has gathered yet), so it needs its own line or
                the middle rung is the one place the page goes quiet. */}
            {fold ? (
              <p
                aria-hidden="true"
                className="font-mono text-micro tracking-[0.12em] text-[var(--lang-ink-muted)]"
              >
                {/* IMPERATIVE, HER PICK (2026-08-07: "a bit more straight
                    forward and obvious and clear and scientific... like click
                    to open"). Say the action, then what it does. The old
                    wording named the thing and left the reader to infer the
                    gesture — "THE NAME OPENS IT" is a statement about the
                    world, not an instruction to a person who is stuck.
                    CLICK becomes TAP below sm, because a legend that names a
                    gesture the device cannot make is worse than no legend.
                    Two strings, not one with words hidden: hiding the tail of
                    each clause once left "ANOTHER MARK ·" standing with no verb
                    at all. */}
                <span className="hidden sm:inline">
                  <b className="font-normal text-[var(--lang-ink)]">CLICK THE NAME</b> TO OPEN ·{' '}
                  <b className="font-normal text-[var(--lang-ink)]">A MARK</b> TO SWITCH ·{' '}
                  <b className="font-normal text-[var(--lang-ink)]">AWAY</b> TO GO BACK
                </span>
                <span className="sm:hidden">
                  <b className="font-normal text-[var(--lang-ink)]">TAP THE NAME</b> TO OPEN ·{' '}
                  <b className="font-normal text-[var(--lang-ink)]">AWAY</b> TO GO BACK
                </span>
              </p>
            ) : heldId ? (
              <p
                aria-hidden="true"
                className="font-mono text-micro tracking-[0.12em] text-[var(--lang-ink-muted)]"
              >
                <span className="hidden sm:inline">
                  <b className="font-normal text-[var(--lang-ink)]">CLICK IT AGAIN</b> TO GATHER ITS
                  THREADS · <b className="font-normal text-[var(--lang-ink)]">AWAY</b> TO GO BACK
                </span>
                <span className="sm:hidden">
                  <b className="font-normal text-[var(--lang-ink)]">TAP AGAIN</b> TO GATHER ·{' '}
                  <b className="font-normal text-[var(--lang-ink)]">AWAY</b> TO GO BACK
                </span>
              </p>
            ) : (
              <p
                aria-hidden="true"
                className="font-mono text-micro tracking-[0.12em] text-[var(--lang-ink-muted)]"
              >
                {/* The browse legend takes the same imperative grammar, so the
                    two states read as one system rather than two voices. */}
                <span className="hidden sm:inline">
                  <b className="font-normal text-[var(--lang-ink)]">DRAG</b> TO MOVE ·{' '}
                  <b className="font-normal text-[var(--lang-ink)]">HOVER</b> TO WAKE ·{' '}
                  {/* CHOOSE became HOLD when the middle rung came back: a click
                      now lights a mark, and it takes a second one to gather it.
                      A legend that names the wrong outcome is worse than none. */}
                  <b className="font-normal text-[var(--lang-ink)]">CLICK</b> TO HOLD
                </span>
                {/* ⚠ AND THE PHONE GETS ONE NOW (her ruling B, 2026-08-08).
                    It was desktop-only because the clause that earned it was
                    HOVER TO WAKE and a phone cannot hover — but the effect was
                    that browsing on a phone offered NO verbs at all, so nothing
                    ever said the threads were there. The map at rest is a
                    constellation by design, which makes the one line that names
                    the gesture load-bearing rather than decorative: without it
                    a visitor who does not guess leaves with a field of dots.
                    It names only what a finger can do. */}
                <span className="sm:hidden">
                  <b className="font-normal text-[var(--lang-ink)]">TAP A MARK</b> TO WAKE ITS
                  THREADS
                </span>
              </p>
            )}
          </div>
        </div>

        {/* The legibility scrims RETIRED (round 3, Emilie 2026-07-19: the
            fade made top thoughts unreadable). The stage is inset between
            the header and footer lines now (.nw-stage, index.css), so no
            node ever runs under the chrome and nothing needs fading. */}

        {/* THE MAP'S OWN DRAWER (Emilie's ruling 2026-08-04: the drawer becomes
            a real per-room system, "the thoughts page when you open them and
            such things"). This room's verbs are its YEARS — the same seven the
            map already draws, 2020 to 2026 — so the drawer is the deliberate way
            to a year and the snap is the casual one. They use the same
            `scrollToWorldX` the tap-to-centre has always used, so a jump from
            the drawer and a jump from a node behave identically.
            WATCH IT GROW and TODAY STAY AT THE FOOT (her ruling, same message).
            They are not ways of getting somewhere, they are things you do to the
            map, and the foot row is what makes this the one room that already
            reads one-handed. Two systems, two jobs. */}
        {/* The year rail owns its own scroll state (see WorldYearRail): it used
            to live up here, and a year change re-rendered the whole 1559-element
            drawing to relabel one tab. */}
        {/* THE DRAWER IS A WAY OF MOVING, so it goes when moving does (her
            recording, 2026-08-07: "the drawer of the year still shows. This
            should not happen since we should not be able to move in the
            isolated mode"). Every verb it offers is a jump along the timeline,
            and the chosen view has no timeline in it — it has a neighbourhood
            with the empty years taken out. A control that cannot do its job is
            worse than no control. */}
        {!fold && <WorldYearRail stageRef={stageRef} snapAt={snapAt} onPick={scrollToWorldXRef} />}


        {/* the stage: full-bleed, drag/wheel/keyboard panning */}
        <section
          ref={stageRef}
          tabIndex={0}
          className={`nw-stage z-0 bg-[var(--lang-ground)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--lang-interaction)]${fold ? ' is-folded' : heldId ? ' is-held' : ''}${vertical ? ' is-vertical' : ''}`}
          aria-label="The whole mind as one neural world: every project, thought, milestone and award in time. It wakes near your pointer; drag sideways to explore."
        >
          {/* The seven things a flick can settle on (index.css, .nw-snap).
              Zero-width, 1px tall, pointer-events: none — they exist only so the
              browser's own snapping has somewhere to land, and they sit at the
              same fractions of the world's width as the drawn year rules. */}
          {snapAt.map((x, i) => (
            <div key={i} className="nw-snap" style={{ left: `${x}px` }} aria-hidden="true" />
          ))}
          {/* THE TURN. `matrix(0 -1 -1 0 h w)` maps (x, y) to (h - y, w - x):
              time runs DOWN with now at the top, and the relatedness axis
              becomes the width with the career lanes — the commit graph — on
              the LEFT, which is where she asked for them.
              It is a REFLECTION, not a rotation, which is exactly what lets
              both of those be true at once; a pure quarter turn can give you
              one or the other and never both.
              ⚠ And the matrix is its own inverse (its linear part squares to
              the identity), so the labels are set upright again by applying
              the very same transform to each of them. One CSS rule, no
              per-label arithmetic. */}
          <svg
            ref={svgRef}
            viewBox={vertical ? `0 0 ${VVIEW} ${WORLD.w}` : `0 0 ${WORLD.w} ${WORLD.h}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform={
                vertical ? `matrix(0 -1 ${-VCOMP} 0 ${WORLD.h * VCOMP} ${WORLD.w})` : undefined
              }
            >
            {/* THE CAMERA. One group around the whole drawing, so a fold is a
                lens move and not a layout: the frozen coordinates underneath it
                never change, and releasing is the transform going back to
                identity. */}
            <g className="nw-cam" ref={camRef}>
            {PRERENDERING ? null : <>
            {/* year columns */}
            <g aria-hidden="true">
              {sk.years.map((y) => (
                <g key={y.label}>
                  <line className="nw-yearline" x1={y.x} y1={96} x2={y.x} y2={WORLD.h - 40} />
                  {/* THE YEAR READS ACROSS ITS OWN RULE, not along it — which
                      is what it does on the web too, where the rule is
                      vertical and the year lies flat beside it. Turned, the
                      rule is horizontal, so the year stands up. Counter-turning
                      it back to flat (what this did until 2026-08-08) laid it
                      parallel to the rule and straight through the names. */}
                  <text
                    className="nw-yearlbl"
                    x={y.x + 8}
                    // ⚠ A FIXED INSET FROM THE LEFT EDGE, not a fixed world
                    // coordinate. At a constant `WORLD.h - 22` the year landed
                    // 8.2px in at 320 and 15.3px in at 600 — and the record's
                    // own columns, which are fixed pixels, walked into it.
                    y={vertical ? WORLD.h - vPx(VYEAR_X) : WORLD.h - 46}
                    transform={vertical ? vAlong(WORLD.h - vPx(VYEAR_X)) : undefined}
                    style={vertical ? { fontSize: `${vPx(9 * VTYPE).toFixed(1)}px` } : undefined}
                  >
                    {y.label}
                  </text>
                </g>
              ))}
            </g>

            {/* the career skeleton: the record, drawn with a ruler */}
            <g aria-hidden="true" className="nw-skeleton">
              {sk.lanes.map((l) => (
                <path
                  key={l.id}
                  className={`nw-lane${l.main ? ' main' : ''}`}
                  d={l.d}
                  strokeWidth={l.main ? 1.6 : 1.1}
                />
              ))}
              {sk.tips.map((t, i) => (
                <circle
                  key={i}
                  cx={t.x}
                  cy={t.y}
                  r={vr(3)}
                  fill="var(--lang-ground)"
                  stroke="var(--lang-ink)"
                  strokeWidth={1.2}
                  opacity={0.7}
                />
              ))}
              {/* NOW SITS BESIDE THE TIPS WHEN THE MAP IS TURNED. On the web it
                  is set `textAnchor="end"` so it stops just short of the lane's
                  newest end — but "short of" means backwards in time, and
                  turned that is DOWNWARD, not leftward. Anchored the same way
                  it laid itself straight across the lane tips instead.
                  The four tips now read as one row along the top edge, and NOW
                  is the label on the open right end of that row — the one
                  clear spot in a corner holding four lanes, two record rows
                  and the live tag. */}
              <text
                className="nw-lanelbl"
                x={sk.nowAt.x}
                y={vertical ? sk.nowAt.y - vPx(60) : sk.nowAt.y}
                textAnchor={vertical ? 'middle' : 'end'}
                fill="var(--lang-ink)"
                transform={vertical ? vTurn(sk.nowAt.x, sk.nowAt.y - vPx(60)) : undefined}
                style={vertical ? { fontSize: `${vPx(9 * VTYPE).toFixed(1)}px` } : undefined}
              >
                NOW
              </text>
              {/* the plumb line (the engine drives it) */}
              <line ref={plumbLineRef} className="nw-plumb" strokeWidth={1} />
              <circle ref={plumbDotRef} r={vr(3)} fill="var(--lang-ink)" style={{ opacity: 0 }} />
            </g>

            {/* THE ONE RED TIP: live, still growing. It joins the ladder like
                every other mark (Emilie, 2026-08-07) — and that ruling is what
                deleted the whole field-card subsystem, which by then existed for
                this one thing and nothing else. Held, it simply says what it is
                doing, as map type. It has no page and no threads, so there is
                nothing to isolate and nothing to open: holding IS its whole
                interaction, and the page now has ONE interaction grammar rather
                than two.
                Only the mark beats (nw-livetip); the tag text stays at full red
                ink (the trough would fall below AA). */}
            <g
              className={`nw-node${heldId === 'now' ? ' is-held' : ''}`}
              tabIndex={0}
              role="img"
              aria-label={`Live, still growing: the self-employed practice. Now building ${NOW.building}; reading ${NOW.reading}; thinking about ${NOW.thinking}.`}
              onClick={() => (heldId === 'now' ? stepBack() : hold('now'))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  if (heldId === 'now') stepBack()
                  else hold('now')
                }
              }}
            >
              <g className="nw-livetip">
                <line
                  x1={sk.liveTip.x - vr(30)}
                  y1={sk.liveTip.y}
                  x2={sk.liveTip.x - vr(4)}
                  y2={sk.liveTip.y}
                  stroke="var(--lang-interaction)"
                  strokeWidth={1.6}
                />
                <circle
                  className="nw-soma"
                  cx={sk.liveTip.x}
                  cy={sk.liveTip.y}
                  r={vr(3.4)}
                  fill="var(--lang-ground)"
                  stroke="var(--lang-interaction)"
                  strokeWidth={1.6}
                />
              </g>
              <circle className="nw-hit" cx={sk.liveTip.x} cy={sk.liveTip.y} r={vr(HIT_R)} />
              {/* THE LIVE BLOCK HANGS BACKWARDS FROM THE TIP, on the web and
                  turned alike: `textAnchor="end"` at x - 10 means it ENDS at
                  the tip and extends into the past. Turned, the past is
                  downward, so the same anchor gives the same reading — one
                  rotation for the whole map, anchored at the newer end. */}
              <text
                className="nw-livetag"
                x={vertical ? sk.liveTip.x - vPx(4) : sk.liveTip.x - 10}
                y={vertical ? sk.liveTip.y - vPx(VLIVE_SIDE) : sk.liveTip.y - 10}
                textAnchor="end"
                transform={vertical ? vAlong(sk.liveTip.y - vPx(VLIVE_SIDE)) : undefined}
                style={vertical ? { fontSize: `${vPx(9 * VTYPE).toFixed(1)}px` } : undefined}
              >
                LIVE · STILL GROWING
              </text>
              {/* what the card used to carry, now drawn in the map */}
              {heldId === 'now' && (
                <g className="nw-nowlines">
                  <text
                    x={vertical ? sk.liveTip.x - vPx(4) : sk.liveTip.x - 10}
                    y={vertical ? sk.liveTip.y + vPx(9) : sk.liveTip.y + 16}
                    textAnchor="end"
                    transform={vertical ? vAlong(sk.liveTip.y + vPx(9)) : undefined}
                    style={vertical ? { fontSize: `${vPx(9 * VTYPE).toFixed(1)}px` } : undefined}
                  >
                    BUILDING {NOW.building}
                  </text>
                  <text
                    x={vertical ? sk.liveTip.x - vPx(4) : sk.liveTip.x - 10}
                    y={vertical ? sk.liveTip.y + vPx(19) : sk.liveTip.y + 30}
                    textAnchor="end"
                    transform={vertical ? vAlong(sk.liveTip.y + vPx(19)) : undefined}
                    style={vertical ? { fontSize: `${vPx(9 * VTYPE).toFixed(1)}px` } : undefined}
                  >
                    READING {NOW.reading}
                  </text>
                  <text
                    x={vertical ? sk.liveTip.x - vPx(4) : sk.liveTip.x - 10}
                    y={vertical ? sk.liveTip.y + vPx(29) : sk.liveTip.y + 44}
                    textAnchor="end"
                    transform={vertical ? vAlong(sk.liveTip.y + vPx(29)) : undefined}
                    style={vertical ? { fontSize: `${vPx(9 * VTYPE).toFixed(1)}px` } : undefined}
                  >
                    THINKING ABOUT {NOW.thinking}
                  </text>
                </g>
              )}
            </g>

            {/* the correlations: hidden at rest, grown by the engine */}
            <g aria-hidden="true">
              {WORLD.links.map((l) => {
                const key = `${l.a}>${l.b}`
                const col = lensColor(l.lens)
                return (
                  <g key={key} ref={connRefs.get(key)}>
                    {l.fibres.map((f, i) => (
                      <path key={i} className="nw-reach" d={f.d} strokeWidth={f.w} pathLength={1} />
                    ))}
                    <circle
                      className="nw-synapse"
                      cx={l.synapse.x}
                      cy={l.synapse.y}
                      r={l.synapse.r}
                      fill="var(--lang-ground)"
                      stroke={col}
                      strokeWidth={1.5}
                    />
                    <path
                      className="nw-pulse"
                      d={l.pulseD}
                      stroke={col}
                      strokeWidth={2.5}
                      pathLength={1}
                      strokeDasharray="0.12 1"
                    />
                    {/* (The pressable thread retired 2026-08-07 with the held
                        rung it belonged to. It let you hover one of a held
                        mark's threads to light the far end — a way of asking
                        "what is over there" that only made sense while the
                        far end was off the frame. Choosing now gathers the
                        neighbourhood instead, so the far end is already here,
                        already named.) */}
                  </g>
                )
              })}
            </g>

            {/* ⚠ DRAWN BEFORE THE NEURONS, and that one line of ordering is
                what stops the threads writing over the names (her flag
                2026-08-07: "some text and threads still overlap in the isolated
                view").
                The names have carried a ground-coloured halo since the map
                rework — `paint-order: stroke fill`, the cartographer's trick —
                and it was doing nothing in here, because this group sat AFTER
                the neurons and simply painted over every label. Steering the
                threads harder was the obvious fix and it was worth almost
                nothing: 28 crossings of 82 became 27. The order was the bug.
                The resting map has always drawn its fibres first; the fold was
                the one place that did not. */}
            {/* THE FOLDED THREADS. The resting fibres are baked `d` strings
                between fixed coordinates, so they cannot follow a node that
                slides; while folded they hide and these draw the same relations
                between the folded positions. An unmade one still gets two arms
                and a gap, and `foldArm` caps the arm at a third of the distance
                so a close pair can never be drawn touching. */}
            {fold && (
              <g className="nw-foldlinks" aria-hidden="true">
                {fold.links.map((l, i) => (
                  <g key={l.key}>
                    {l.fibres.map((f, i) => (
                      <path key={i} className="nw-foldthread" d={f.d} strokeWidth={f.w} />
                    ))}
                    <circle
                      className="nw-foldsyn"
                      cx={l.synapse.x}
                      cy={l.synapse.y}
                      r={l.synapse.r}
                    />
                    {/* THE FOLD GETS ITS OWN PULSE (Emilie 2026-08-07: "i still
                        want it to have the pulse animation of the thread so we
                        actually know where the main node is and which one it
                        is"). The browse pulse was silenced in here for good
                        reason — it fires along the RESTING geometry, so it ran
                        beside the folded threads instead of on them. This one is
                        drawn from the folded path, and it runs BACKWARDS: every
                        pulse travels inward and lands on the chosen mark, so the
                        motion itself answers "which one is it".
                        Staggered by index so they arrive in turn rather than as
                        one flash, and it is a loop rather than a one-shot
                        because it is the only thing naming the subject. */}
                    <path
                      className="nw-foldpulse"
                      d={l.pulseD}
                      pathLength={1}
                      strokeDasharray="0.1 1"
                      style={{ animationDelay: `${(i % 6) * 460}ms` }}
                    />
                  </g>
                ))}
                {fold.arms.map((a) => (
                  <g key={a.key}>
                    {a.paths.map((p, i) => (
                      <path key={i} className="nw-foldarm" d={p.d} strokeWidth={p.w} />
                    ))}
                  </g>
                ))}
              </g>
            )}


            {/* (The lens capsule retired 2026-08-07: the ring above the name
                already carries the magnifier idea, and the glass was doing the
                same job over the type instead of beside it. Her ruling: keep
                the pulsing ring in the chosen view too, and let a red arrow
                under the name be the door.) */}

            {/* the neurons */}
            <g>
              {WORLD.nodes.map((n) => {
                const col = lensColor(n.lens)
                const o = n.style
                const above = n.labelAbove
                // WHERE THE NAME SITS, and it has to be said twice.
                // Lying down, a name hangs BELOW its mark: `y + r + 18`.
                // Turned, "below on the screen" is no longer +y — the matrix
                // maps (x, y) to (h - y, w - x), so DOWN is -x and RIGHT is -y.
                // The offsets have to be restated in those terms or the date
                // lands on top of the name, which is exactly what it did.
                // They are also divided by the projection: 860 world units of
                // relatedness are showing in ~390px, so a 9-pixel gap on the
                // glass is about 20 units of world.
                const kindClass = n.kind === 'project' ? 'p' : n.kind === 'thought' ? 't' : n.kind === 'award' ? 'a' : 'm'
                const inFold = fold?.byId.get(n.id)
                // A RECORD ROW RUNS ALONG ITS RAIL — but only at rest. Folded,
                // the whole record is a handful of names read up close and the
                // lane solver has already given each one a line of its own, so
                // there it sits under its mark like everything else.
                const along = vertical && n.kind === 'milestone' && !inFold
                const showDate = !!inFold || heldId === n.id || fold?.subject === n.id
                let lx: number
                let ly: number
                let yx: number
                let yy: number
                if (along) {
                  const rec = turned.recLane.get(n.id)
                  const col = rec?.col ?? 0
                  lx = rec?.down
                    ? n.x - vPx(o.r * VTYPE + VREC_UP)
                    : n.x + vPx(o.r * VTYPE + VREC_UP)
                  yx = lx
                  ly = n.y + vPx(VREC_SIDE + col * VREC_COL)
                  yy = n.y + vPx(VREC_DATE + col * VREC_COL)
                } else if (vertical && inFold) {
                  // ⚠ THE FOLD MEASURES IN FONTS, NOT IN WORLD UNITS. Its type
                  // is counter-scaled to stay one size while the camera moves,
                  // so any gap written in world units moves when the type does
                  // not: at a wide fold the date climbed into the name and the
                  // name onto its own soma, which is what she photographed.
                  // Only the radius stays a world term — the mark scales.
                  const f = fold!.font
                  if (inFold.side === 0) {
                    // the subject, centred under its mark, where the door is
                    lx = above ? n.x + vPx(o.r * VTYPE) + f * 1.15 : n.x - vPx(o.r * VTYPE) - f * 1.15
                    yx = above ? lx + f * 1.35 : lx - f * 1.35
                    ly = n.y
                    yy = ly
                  } else {
                    // BESIDE ITS MARK, and the two lines sit ASTRIDE the mark's
                    // own height rather than below it — the whole reason to move
                    // sideways is to stop spending the vertical room.
                    lx = n.x + f * 0.15
                    yx = n.x - f * 1.15
                    ly = n.y - inFold.side * (vr(o.r) + f * 0.55)
                    yy = ly
                  }
                  // NO LANE SHIFT TURNED. Lanes stack labels across the axis
                  // that is not time, and turned that is sideways — which is
                  // what `side` above now does properly. The lane OFFSETS stay
                  // off: they shifted a centred name by 13px, which reads as
                  // misalignment rather than separation.
                } else if (vertical) {
                  // The web's own offsets, restated: turned, DOWN the screen is
                  // -x and RIGHT is -y, and a pixel is `turned.proj` world units.
                  // `labelAbove` is honoured here too — it is the map's own
                  // answer to a name landing on its neighbour — and the solver
                  // above may have flipped or stepped it one line further.
                  const place = turned.lblPlace.get(n.id)
                  const up = above !== (place?.flip ?? false)
                  const drop = place?.drop ?? 0
                  lx = up
                    ? n.x + vPx((o.r + 12) * VTYPE + drop)
                    : n.x - vPx((n.kind === 'milestone' ? 18 : o.r + 18) * VTYPE + drop)
                  yx = up ? lx + vPx(13 * VTYPE) : lx - vPx(12 * VTYPE)
                  // KEPT INSIDE THE FRAME. Centred is the resting truth, but a
                  // 182px name centred on a mark 60px from the edge is half off
                  // the glass, so it gives up as little of the centring as the
                  // frame demands and no more.
                  // the frame clamp is solved once per width, not per render
                  ly = n.y - vPx(turned.shift.get(n.id) ?? 0)
                  yy = ly
                } else {
                  ly =
                    n.kind === 'milestone' ? n.y + 18 : above ? n.y - o.r - 12 : n.y + o.r + 18
                  yy = n.kind === 'milestone' ? ly + 12 : above ? ly - 13 : ly + 12
                  lx = n.x
                  yx = n.x
                }
                return (
                  <g
                    key={n.id}
                    ref={nodeRefs.get(n.id)}
                    className={`nw-node${n.route ? '' : ' still'}${fold ? (inFold ? ' in-fold' : ' out-fold') : ''}`}
                    // The slide, and only the slide: no node changes height,
                    // because height is the axis that now means relatedness.
                    // The stagger is oldest-first, so the direction of the whole
                    // record is legible in the motion and not only in the layout.
                    style={
                      inFold
                        ? {
                            transform: `translate(${inFold.dx}px, ${inFold.dy}px)`,
                            transitionDelay: `${inFold.order * 34}ms`,
                          }
                        : undefined
                    }
                    // A mark the fold has hidden must not be reachable either:
                    // at 0.05 opacity it was still tabbable AND still hoverable,
                    // so the isolated view had 44 invisible tab stops behind it.
                    tabIndex={fold && !inFold ? -1 : 0}
                    role={n.route ? 'link' : 'img'}
                    aria-label={nodeAria(n)}
                    // THE HOVER CHIP IS CUT (Emilie, 2026-08-07). It carried the
                    // title, the kind and the date — and the title and the date
                    // are DRAWN UNDER THE DOT, while the mark itself says the
                    // kind, which is what the legend exists to teach. A whole
                    // card state that repeated the map back to you. Hover now
                    // wakes the neighbourhood and stops, which is the thing the
                    // page is actually good at.
                    onMouseEnter={() => {
                      setForce(n.id, 1)
                      if (n.route) preloadPath(n.route)
                    }}
                    onMouseLeave={() => {
                      if (lockedId.current === n.id) return
                      setForce(n.id, 0)
                    }}
                    onFocus={(e) => {
                      setForce(n.id, 1)
                      // Keyboard focus brings the node into view; a POINTER
                      // click must NOT scroll, or it slides the node out from
                      // under the freshly-placed card (the "opens at a random
                      // place / lagging" bug). :focus-visible is the keyboard
                      // signal, so the card stays pinned to the dot on click.
                      if (e.currentTarget.matches(':focus-visible')) {
                        e.currentTarget.scrollIntoView({
                          block: 'nearest',
                          inline: 'center',
                          behavior: prm ? 'auto' : 'smooth',
                        })
                      }
                    }}
                    onBlur={() => {
                      if (lockedId.current === n.id) return
                      setForce(n.id, 0)
                    }}
                    onClick={() => onNodeClick(n)}
                    // ENTER DOES WHAT A CLICK DOES (2026-08-07). It used to
                    // travel straight to the page, so the same mark had two
                    // contracts: a mouse got the card and had to press OPEN, a
                    // keyboard skipped both and left. Choosing is choosing.
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onNodeClick(n)
                      }
                    }}
                  >
                    {/* the dimmable body: the wake dim lives HERE so it never
                        multiplies into the label's rest ink (AA floor) */}
                    <g className="nw-body" style={n.kind !== 'milestone' ? { opacity: TUNE.restInk } : undefined}>
                      {/* what it is almost joined to: one arm per near-miss,
                          aimed at the other end and stopping short of it */}
                      {(armsOf.get(n.id) ?? []).map((arm) =>
                        arm.paths.map((p, i) => (
                          <path
                            key={`${arm.to}-${i}`}
                            className="nw-reachout"
                            data-arm={arm.to}
                            d={p.d}
                            strokeWidth={p.w}
                          />
                        )),
                      )}
                      {n.kind !== 'milestone' && (
                        <circle className="nw-glow" cx={n.x} cy={n.y} r={vr(o.r * 3)} fill="url(#nw-glow-grad)" />
                      )}
                      {n.kind === 'project' ? (
                        <>
                          <circle className="nw-soma" cx={n.x} cy={n.y} r={vr(o.r)} fill="var(--lang-ink)" />
                          <circle cx={n.x} cy={n.y} r={vr(2.6)} fill={col} />
                          {/* live + still growing (Emilie 2026-07-24): a red
                              ring marks a deployed, ongoing project. Red =
                              liveness, the governance law; static so it rests
                              calm under reduced motion. */}
                          {n.live && (
                            <circle
                              cx={n.x}
                              cy={n.y}
                              r={vr(o.r + 3.5)}
                              fill="none"
                              stroke="var(--lang-interaction)"
                              strokeWidth={1.3}
                            />
                          )}
                        </>
                      ) : n.kind === 'thought' ? (
                        <>
                          <circle
                            className="nw-soma"
                            cx={n.x}
                            cy={n.y}
                            r={vr(o.r)}
                            fill="var(--lang-ground)"
                            stroke="var(--lang-ink)"
                            strokeWidth={1.7}
                          />
                          <circle cx={n.x} cy={n.y} r={vr(1.9)} fill={col} opacity={0.8} />
                        </>
                      ) : n.kind === 'award' ? (
                        <path className="nw-soma" d={starPath(n.x, n.y, vr(o.r))} fill="var(--lang-ink)" />
                      ) : (
                        <circle className="nw-soma" cx={n.x} cy={n.y} r={vr(o.r)} fill="var(--lang-ink-muted)" />
                      )}
                    </g>
                    {/* HELD HAS TO LOOK DIFFERENT FROM HOVERED, or you cannot
                        tell which phase you are standing in — the engine lights
                        both the same way. A quiet ink ring, not red: red is
                        liveness on this map and means one thing only. */}
                    {/* THE RING FOLLOWS THE MARK INTO THE CHOSEN VIEW (her
                        ruling 2026-08-07). It used to stop at the held rung, so
                        the one cue that says "there is another move here"
                        vanished exactly when there was another move — the door.
                        Same ring, same breath, one rung further. */}
                    {(heldId === n.id || fold?.subject === n.id) && (
                      <circle className="nw-heldring" cx={n.x} cy={n.y} r={vr(o.r + 7)} />
                    )}
                    <circle className="nw-hit" cx={n.x} cy={n.y} r={vr(HIT_R)} />
                    {/* initial inline opacities = TUNE.restInk for BOTH texts
                        (G4: dates ride the same rest as titles): the first
                        paint IS the rest state, no post-mount pop */}
                    {/* Folded, a name COUNTER-SCALES so it stays the size it is
                        now while the drawing shrinks, and drops into the lane the
                        solver gave it. The lanes are not a nicety: spreading the
                        nodes cannot fix label collision, because a fit-to-frame
                        camera pulls back by whatever you spread by. Stacking is
                        the only thing that does. */}
                    <text
                      className={`nw-lbl ${kindClass}${inFold && fold?.open?.id === n.id ? ' is-door' : ''}`}
                      // ⚠ TURNED, THE LANE SHIFT IS BAKED INTO THE COORDINATE,
                      // never into a transform. The label's upright reading is
                      // itself a transform (the turn matrix, which is its own
                      // inverse), and an inline `transform` for the lane
                      // replaces it rather than composing with it — which is
                      // why every folded name came out mirrored and reversed.
                      x={lx + (vertical ? 0 : (n.labelDx ?? 0))}
                      y={ly + (vertical ? 0 : (n.labelDy ?? 0))}
                      transform={
                        along
                          ? vAlong(ly)
                          : vertical
                            ? vTurn(lx, ly)
                            : undefined
                      }
                      textAnchor={
                        along
                          ? turned.recLane.get(n.id)?.down
                            ? 'end'
                            : 'start'
                          : vertical && inFold && inFold.side !== 0
                            ? inFold.side > 0
                              ? 'start'
                              : 'end'
                            : 'middle'
                      }
                      style={
                        inFold
                          ? {
                              opacity: 1,
                              fontSize: `${fold!.font.toFixed(2)}px`,
                              // ⚠ THE HALO IS COUNTER-SCALED TOO. It is 4.5
                              // WORLD units at rest, and the fold's camera took
                              // that to well under a pixel — so the threads it
                              // exists to clear went straight through every
                              // name. 0.3 of the font holds it at ~2.8px on the
                              // glass at any fold size.
                              strokeWidth: vertical ? fold!.font * 0.36 : undefined,
                              // turned, the lane rides the coordinate, so no
                              // transform here — it would replace the label's
                              // own counter-turn and mirror the words
                              transform: vertical
                                ? undefined
                                : `translate(0px, ${(inFold.lane * fold!.font * 1.42).toFixed(1)}px)`,
                              transitionDelay: `${inFold.order * 34}ms`,
                            }
                          : vertical
                            ? // ⚠ AN INLINE STYLE, NOT THE `fontSize` ATTRIBUTE.
                              // The stylesheet sets a size per kind, and a CSS
                              // rule beats a presentation attribute — so the
                              // turned labels kept the resting 9.5 units and
                              // rendered about 4px tall through the 0.45
                              // projection. On her phone that read as a map
                              // with no words on it at all.
                              // EVERY KIND KEEPS ITS OWN SIZE, which one flat
                              // 9.5 had thrown away: a thought is set 12.5px
                              // serif italic and a record row 9px mono, and
                              // that difference is how the map says what a
                              // mark is before you have read a word of it.
                              { opacity: TUNE.restInk, fontSize: `${vPx(vSize(n.kind)).toFixed(1)}px` }
                            : { opacity: TUNE.restInk }
                      }
                    >
                      {n.mapLabel ?? n.title}
                    </text>
                    {/* THE DATE ONLY WHEN YOU HOLD IT, turned (her ruling D,
                        2026-08-08: "it looks busy"). Measured: the dates were
                        56 of the map's 119 pieces of text and 23% of all its
                        ink, for a fact the drawing already tells — the whole
                        down-axis IS time and the year rules are ruled across
                        it. So they buy almost nothing at rest and cost a
                        second line under every single mark.
                        ⚠ The solver still RESERVES their boxes, so one
                        appearing never lands on a neighbour, and the reserved
                        space is itself the air.
                        The record rows keep theirs: a row standing up its rail
                        is a job with a start date, and the date is the one
                        thing a rail cannot say. */}
                    {(!vertical || along || showDate) && (
                    <text
                      className="nw-yr"
                      x={yx + (vertical ? 0 : (n.labelDx ?? 0))}
                      y={yy + (vertical ? 0 : (n.labelDy ?? 0))}
                      transform={
                        along
                          ? vAlong(yy)
                          : vertical
                            ? vTurn(yx, yy)
                            : undefined
                      }
                      textAnchor={
                        along
                          ? turned.recLane.get(n.id)?.down
                            ? 'end'
                            : 'start'
                          : vertical && inFold && inFold.side !== 0
                            ? inFold.side > 0
                              ? 'start'
                              : 'end'
                            : 'middle'
                      }
                      style={
                        inFold
                          ? {
                              opacity: 0.75,
                              fontSize: `${(fold!.font * 0.76).toFixed(2)}px`,
                              strokeWidth: vertical ? fold!.font * 0.36 : undefined,
                              // ⚠ 0.95, not 0.5. The date's resting offset is a
                              // FIXED 12 world units under the name (`ly + 12`),
                              // and the fold only added half a font on top — so
                              // the bigger the folded type, the tighter the two
                              // lines got, until they touched. Measured at
                              // 390px: the date's top sat 4px ABOVE the name's
                              // bottom. The extra shift has to scale with the
                              // type it is clearing, not sit beside it.
                              // 1.2 is the ceiling: the lane solver reserves
                              // 1.42 fonts per lane and does not account for
                              // dates at all, so anything more starts pushing
                              // a date into the name below it.
                              transform: vertical
                                ? undefined
                                : `translate(0px, ${(inFold.lane * fold!.font * 1.42 + fold!.font * 1.2).toFixed(1)}px)`,
                              transitionDelay: `${inFold.order * 34}ms`,
                            }
                          : vertical
                            ? {
                                // held, it is not in the engine's map (the ref
                                // was taken when the node mounted and there was
                                // no date then), so it carries its own ink
                                opacity: along ? TUNE.restInk : 1,
                                fontSize: `${vPx(DATE_METRIC.size * VTYPE).toFixed(1)}px`,
                              }
                            : { opacity: TUNE.restInk }
                      }
                    >
                      {n.date}
                    </text>
                    )}
                  </g>
                )
              })}
            </g>

            {/* THE NAME IS THE DOOR (Emilie's ruling 2026-08-07: "i dont like
                the open door we should find a better way to implement it").
                It used to be the words OPEN › in a 10px caption a line under
                the date — the smallest thing in the frame doing the biggest
                job, and competing with the date for the same slot.
                Now the subject's own name carries it: underlined, with one
                arrow on its baseline. Nothing is added to the drawing but a
                single glyph, and it matches how the rest of the site already
                behaves, where a project's name is the way into it.
                The arrow is not decoration — it is what says "door" on a phone,
                which has no hover to reveal the underline.
                This group is drawn AFTER the neurons, so its hit area sits over
                the name and takes the click; the mark itself is still the way
                to let go. Two targets, two verbs. */}
            {fold?.open && (
              <g
                className="nw-foldopen"
                role="link"
                tabIndex={0}
                aria-label={`Open ${WORLD.nodes.find((n) => n.id === fold.open!.id)?.title ?? ''}`}
                onClick={() => travel(fold.open!.route)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    travel(fold.open!.route)
                  }
                }}
              >
                {(() => {
                  // Turned, the lane shift is baked into the coordinate with the
                  // opposite sign — the same inversion the labels carry.
                  // turned there are no lanes, so there is no lane shift
                  const base = vertical ? fold.open.y : fold.open.y + fold.openLane * fold.font * 1.42
                  const w = Math.max(fold.font * 3, fold.openW)
                  // UNDER THE NAME BLOCK, centred: the name, then its date,
                  // then the way in. Beside the name it read as punctuation on
                  // the end of a word; under it, it reads as a next step.
                  // ⚠ MEASURED OFF THE DATE'S OWN BASELINE, not off a multiple
                  // of the font. The date hangs at `+12 world units + font/2`
                  // (the render's `ly + 12` plus the fold's lane shift), and 12
                  // of those units are FIXED — so any pure font multiple drifts
                  // into the date at some camera scales and floats away at
                  // others. That mixed arithmetic is what put the arrow through
                  // the numerals in her screenshot.
                  const a = fold.font * 0.42
                  // turned, the date's gap is a pure font multiple (see the
                  // fold branch in the label geometry), so the arrow measures
                  // off the same number rather than a mixed one
                  const dateBaseline = vertical ? base + fold.font * 1.35 : base + 12 + fold.font * 1.2
                  const arrowX = fold.open.x - a * 1.1
                  const arrowY = dateBaseline + fold.font * 0.95
                  return (
                    // THE DOOR IS DRAWN UPRIGHT AND LEFT ALONE. Counter-turning
                    // the whole group about the subject's baseline makes its
                    // local axes agree with the screen again, so every offset
                    // below — "under the name", "the width of the name" — means
                    // on a phone exactly what it means on the web, and none of
                    // this arithmetic had to be written twice.
                    <g transform={vertical ? vTurn(fold.open!.x, base) : undefined}>
                      <rect
                        className="nw-doorring"
                        x={fold.open.x - w / 2 - fold.font * 0.4}
                        y={base - Math.max(fold.hit, fold.font * 1.5) * 0.74}
                        width={w + fold.font * 0.8}
                        height={Math.max(fold.hit, fold.font * 3.4)}
                        rx={fold.font * 0.5}
                        fill="transparent"
                        stroke="none"
                      />
                      <path
                        className="nw-doorarrow"
                        d={`M${arrowX} ${arrowY}L${arrowX + a * 2.2} ${arrowY}M${arrowX + a * 1.3} ${arrowY - a}L${arrowX + a * 2.2} ${arrowY}L${arrowX + a * 1.3} ${arrowY + a}`}
                      />
                    </g>
                  )
                })()}
              </g>
            )}

            <defs>
              <radialGradient id="nw-glow-grad">
                <stop offset="0%" stopColor="var(--lang-ink)" stopOpacity={0.32} />
                <stop offset="100%" stopColor="var(--lang-ink)" stopOpacity={0} />
              </radialGradient>
            </defs>
            </>}
            </g>
            </g>
          </svg>
        </section>

        {/* (the field card is gone: the fold answers for every node and the NOW
            tip says its lines in the map. 2026-08-07.) */}

        <WorldSrNav />
      </main>
    </div>
  )
}

/** THE YEAR RAIL, and the reason it is its own component (the phone-lag fix,
 *  Emilie 2026-08-07: "on the phone it seems a bit laggy").
 *
 *  It reads the scroll position to name the year you are standing in. That
 *  reading lived as state on NeuralWorld, so every time it changed — seven
 *  times across a sweep, and constantly under a drag — React re-rendered the
 *  ENTIRE world: 1559 SVG elements, to relabel one tab.
 *
 *  Measured at 390x844 with the CPU throttled 6x, on the PRODUCTION bundle:
 *  the sweep ran at 9-13fps (mean frame 73-117ms) with a 600-870ms stall
 *  roughly once a second — one per year rule crossed — and snapped back to a
 *  clean 16.7ms the instant it finished. A CPU profile put a third of the time
 *  in the component body and, in dev, 47% in jsxDEV: element creation, not
 *  drawing, not the engine.
 *
 *  Owning the state down here means a year change re-renders a tab and nothing
 *  else. The drawing above never hears about it. */
function WorldYearRail({
  stageRef,
  snapAt,
  onPick,
}: {
  stageRef: React.RefObject<HTMLDivElement | null>
  snapAt: number[]
  onPick: React.RefObject<(x: number, smooth?: boolean | 'always') => void>
}) {
  const [atYear, setAtYear] = useState<string | null>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || snapAt.length === 0) return
    const pick = () => {
      // +8px so a year sitting exactly on the edge reads as arrived, not as the
      // one before it.
      const x = stage.scrollLeft + 8
      let cur = WORLD.skeleton.years[0]?.label ?? null
      for (let i = 0; i < snapAt.length; i++) {
        if (snapAt[i]! <= x) cur = WORLD.skeleton.years[i]?.label ?? cur
      }
      // Only when it actually changes: React bails out on an identical string,
      // but saying so here is what makes that guarantee legible.
      setAtYear((prev) => (prev === cur ? prev : cur))
    }
    pick()
    // Coalesced to one read per frame: this fires on every pixel of a drag on a
    // 5355px track, and the answer cannot change faster than the screen redraws.
    let queued = false
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        queued = false
        pick()
      })
    }
    stage.addEventListener('scroll', onScroll, { passive: true })
    return () => stage.removeEventListener('scroll', onScroll)
  }, [snapAt, stageRef])

  const set: ReachSet = useMemo(
    () => ({
      label: 'Jump to a year',
      handle: 'years',
      // THE YEAR DRAWER IS FOR EVERY POINTER, not only thumbs (Emilie
      // 2026-08-04). The map is 5,355px of stage and no width shows more than a
      // fraction of it, so the seven years are the only complete index of this
      // room and a pointer needs them as much as a thumb.
      wide: true,
      // A PLACE DRAWER: the tab reads the year you are standing in, so on a map
      // 13.7 screens wide you can always tell where you are without opening
      // anything.
      at: atYear ?? undefined,
      verbs: WORLD.skeleton.years.map((y) => ({
        id: y.label,
        label: y.label,
        // The open list lights the same year the closed tab reads, from the one
        // value, so the two can never disagree.
        active: y.label === atYear,
        // 'always': a year named in the drawer always SLIDES, however far, so
        // the drawer behaves one way.
        onPress: () => onPick.current(y.x, 'always'),
      })),
    }),
    [atYear, onPick],
  )

  return <ReachControls set={set} />
}
