// THE THOUGHT FIGURES · THE PLATE (THE WORDS, Emilie's ruling 2026-07-28,
// board look 2 of 3: "let's go for the plate").
//
// Her ask was for a STYLE, not for drawings: "some are plots, some graphs,
// some diagrams, some sketches, some abstract, some maths equations or graphs
// you know?" So the board drew three candidate looks across the same four
// kinds, and this is the one she picked, built as a system: one <Fig> holding
// a drawing in the ink grammar already signed for the /work plates, held
// between two hairlines, captioned in the mono micro type.
//
// THE GRAMMAR LIVES IN CSS (language.css, .thought-fig), not here, so a
// drawing below is only geometry. Classes: .ln the ink line · .th the thin
// line · .ax an axis · .dash an absent relationship · .dt a dot · .ac / .acs
// THE ONE ACCENT PER DRAWING, never two · text.lbl a mono label · text.mth
// maths, set in the serif italic.
//
// WHEN A NOTE WANTS A PLATE AND WHEN IT WANTS A SKETCH DOT: if the prose spends
// a paragraph describing a shape, it wants a plate (it is carrying the
// argument). If the prose is remembering something, it wants the dot
// (SketchDot, her 2026-07-18 mechanism, which floats a charcoal in the margin).
// Both now exist and neither replaces the other.
//
// THE VIEWBOX IS 300x170 for every figure, so a reader's eye does not have to
// re-scale between one note and the next, and so nothing here can quietly
// become a hero image. A figure that needs a different aspect is a sign the
// idea wants two figures.
//
// AND EVERY DRAWING FILLS IT, roughly y=22 to y=150. The first pass did not:
// the drawings sat in the middle third with dead air above and below, which at
// 460px wide reads as a small picture stranded in a large frame rather than as
// a plate. Caught on screen, not in the source. If a new figure looks weak,
// check its extents before reaching for a heavier stroke.
//
// PRINT: the book (src/print/) renders notes only as excerpts, so no figure
// reaches paper today. If that changes, these are inline SVG and will print as
// they stand; nothing here depends on hover, script or colour to be readable
// (the accent is reinforced by the caption every time, per the colour-never-
// means-alone rule).
import { createContext, useContext, type ReactNode } from 'react'
import { thoughtIndexEntries } from '../data/registry'

const VB = {
  viewBox: '0 0 300 170',
  xmlns: 'http://www.w3.org/2000/svg',
  role: 'img',
} as const

/**
 * THE FIGURE NUMBER (Emilie, 2026-08-05). Her instruction: "imagine them all
 * piled up in one document as a book of essays, so the figures have to be
 * numbered in that way."
 *
 * So numbering is a RUNNING COUNT over the whole set in reading order, oldest
 * note first: Fig. 1 is the plate in the earliest thought that has one, and the
 * count carries straight through to Fig. 17. It is not per-note. A first pass
 * numbered them `Fig. T-101.1`, which tied each plate to its own note and was
 * the wrong shape: that is a catalogue, and she asked for a book.
 *
 * NOTHING IS TYPED. The order is `thoughtIndexEntries()` reversed, so it is the
 * same single source the /work list and the book index run on, just ascending:
 * date first, T-number as the tie-break for the five months that hold two notes.
 * A figure therefore cannot disagree with the record, and re-dating a thought
 * renumbers every plate after it automatically.
 *
 * THE COST, worth stating: a figure number is a POSITION, not an identity.
 * Insert a thought early and everything downstream shifts, which is exactly how
 * a book behaves and exactly unlike the permanent T-numbers. Cite a plate by
 * its note, never by its number.
 */
const PLATES_PER_THOUGHT: Record<string, number> = {
  // `charcoal` is the deliberate exception: it carries three of her actual
  // charcoals on sketch dots instead, so it takes no number in the run.
  charcoal: 0,
}

const FIG_NUMBER: Record<string, number> = (() => {
  const ascending = [...thoughtIndexEntries()].reverse()
  const out: Record<string, number> = {}
  let n = 0
  for (const e of ascending) {
    const count = PLATES_PER_THOUGHT[e.id] ?? 1
    if (count > 0) {
      out[e.id] = n + 1
      n += count
    }
  }
  return out
})()

/** The id of the thought being read, so a plate can find its place in the run. */
export const FigNumberContext = createContext<string | null>(null)

/**
 * One plate. `alt` is the drawing's accessible description and is NOT the
 * caption: the alt says what is drawn, the caption says what it shows.
 *
 * ALL 17 CAPTIONS REWRITTEN AND SIGNED (Emilie, 2026-08-05). They used to be
 * aphorisms with a turn in them ("Nobody chose this line in the research.
 * Somebody chose it in a spreadsheet."), set in 9px uppercase, which made good
 * writing unreadable and read as a label rather than a caption. Her ruling was
 * to go the other way entirely: descriptive, neutral, scientific, numbered.
 * So a caption now states what is plotted and what the plot shows, and carries
 * no argument: the argument is the note's job, and the n.b. dots keep the wit.
 */
export function Fig({
  alt,
  caption,
  i = 1,
  children,
}: {
  alt: string
  caption: string
  /** Index within its own note. Defaults to 1: today every note has one plate,
   *  and a second one is `<Fig i={2}>` without touching anything else. */
  i?: number
  children: ReactNode
}) {
  const thoughtId = useContext(FigNumberContext)
  const base = thoughtId ? FIG_NUMBER[thoughtId] : undefined
  const label = base ? `Fig. ${base + i - 1}` : null
  return (
    <figure className="thought-fig">
      <svg {...VB} aria-label={alt}>
        {children}
      </svg>
      {/* The separator is REAL TEXT, not a CSS ::after. A pseudo-element is
          absent from the text layer, so the accessible name and the prerendered
          HTML both ran the number into the sentence: "Fig. T-101.1Modelled
          building variables...". Caught by reading the built page, not the JSX. */}
      <figcaption>
        {label && <span className="thought-fig__n">{label} · </span>}
        {caption}
      </figcaption>
    </figure>
  )
}

// ===========================================================================
// THE SECOND WAVE (2026-07-29). Her call at the walk: "I like the idea to have
// a figure for almost all thoughts, it's nicer for consistency ... and in that
// sense we also can really switch it up in terms of figures and be as creative
// and as relevant as we want."
//
// So consistency lives in the GRAMMAR (one viewBox, one ink weight, one accent)
// and variety lives in the KIND. Across the set there are now: a typographic
// swap, a shape comparison, a time sequence, a discard grid, a lineage tree, a
// bar chart, a section, a control, a diagram, a scatter and an equation. No two
// notes get the same kind of drawing.
//
// `charcoal` is the deliberate exception and gets no plate: it already has three
// of her actual charcoals blooming in the margin on sketch dots, which is a
// better figure than anything drawn in ink could be.
// ===========================================================================

// T-101 · behavior information modeling. REDRAWN 2026-07-29 (her note: the
// first version was type, and "text heavy", which is fair: an essay does not
// need a figure that is more words).
//
// This is the argument as a SCATTER instead. Every axis a building model
// already tracks is densely sampled and sits flat on the floor of the plot;
// the vertical axis, what any of it does to the person, has no data in it at
// all. The one red point is hypothetical, which is why it is hollow and why it
// is the only thing above the line. Thirty years of measurement, one axis.
export const BimFigure = (
  <Fig
    alt="A scatter plot. Along the horizontal axis, densely packed points sitting exactly on the baseline. The vertical axis is completely empty except one hollow red point floating alone above the others."
    caption="Modelled building variables against occupant response. The horizontal axis is densely sampled; the vertical holds no data, and the single hollow point is hypothetical."
  >
    <path className="ax" d="M40 140h230M40 140V26" />
    <g className="dt" opacity="0.55">
      {Array.from({ length: 26 }, (_, i) => (
        <circle key={i} cx={52 + i * 8.4} cy={140} r={3} />
      ))}
    </g>
    <circle
      className="ac"
      cx="150"
      cy="60"
      r="6"
      fill="none"
      stroke="var(--lang-interaction)"
      strokeWidth={1.8}
      strokeDasharray="3 3"
    />
    <text className="lbl" x="52" y="158">
      BEAMS, DUCTS, CLASHES
    </text>
    <text className="lbl" x="22" y="118" transform="rotate(-90 22 118)">
      THE PERSON
    </text>
  </Fig>
)

// T-102 · neuroaesthetics. The prose names "the pull of a curve over a hard
// corner", so the figure is those two paths side by side and nothing else. A
// shape comparison.
// REDRAWN 2026-07-29 (third pass). Two corners side by side was true and
// shallow: it drew the shapes and said nothing about why one of them costs you
// something. This is a SCANPATH, the actual instrument the research uses: where
// the eye goes, and how long it stays. On the hard corner the trace knots and
// doubles back; on the curve it runs through. Same information, and now the
// figure carries the finding rather than the illustration.
export const NeuroaesFigure = (
  <Fig
    alt="Two wall profiles with eye-tracking traces over them. On the hard right-angled corner the trace knots and doubles back on itself at the join. On the curved corner the trace, drawn in red, runs smoothly through without stopping."
    caption="Eye-tracking traces over two wall profiles. The trace knots at the right-angled join and runs unbroken through the curve."
  >
    <path className="ln" d="M42 34v66h74" />
    <path
      className="th"
      d="M50 44c-6 22 2 40 -2 52c10 4 4-14 12-18c-8 8 2 16 8 14c-6-6 4-12 8-6c-2 8 8 8 14 8"
    />
    <g className="dt" opacity="0.55">
      <circle cx="48" cy="52" r="2.5" />
      <circle cx="46" cy="86" r="3.5" />
      <circle cx="56" cy="94" r="4.5" />
      <circle cx="66" cy="98" r="3" />
      <circle cx="90" cy="100" r="2.5" />
    </g>
    <text className="lbl" x="42" y="128">
      IT KNOTS
    </text>
    <path className="ln" d="M182 34v42a34 34 0 0 0 34 24h58" />
    <path className="acs" d="M188 44c-4 26 12 44 34 50c22 5 40 6 54 6" />
    <circle className="ac" cx="276" cy="100" r="5" />
    <text className="lbl" x="182" y="128">
      UNBROKEN
    </text>
  </Fig>
)

// T-103 · physics solvers. REDRAWN 2026-07-29. The first version drew three
// nets, which was an illustration of a solver rather than a solver. This is
// the plot you actually watch while one runs: residual against iteration,
// dropping hard and then refusing to drop any further. The red mark is where
// it stops arguing, which is the note's own phrase and the only moment in the
// run that matters.
export const SolversFigure = (
  <Fig
    alt="A convergence plot. Residual falls steeply from the top left, then flattens into a nearly horizontal tail along the bottom, with a red dot marking where it settles."
    caption="Solver convergence. Residual falls steeply, then flattens; the marked point is where the geometry stops changing."
  >
    <path className="ax" d="M40 142h228M40 142V24" />
    <path
      className="ln"
      d="M44 32C64 96 78 124 104 133C140 145 176 139 214 138C236 137 250 137 264 137"
    />
    <g className="dt" opacity="0.5">
      <circle cx="44" cy="32" r="2.5" />
      <circle cx="66" cy="92" r="2.5" />
      <circle cx="88" cy="120" r="2.5" />
      <circle cx="118" cy="134" r="2.5" />
      <circle cx="158" cy="138" r="2.5" />
      <circle cx="200" cy="138" r="2.5" />
    </g>
    <circle className="ac" cx="236" cy="137" r="5.5" />
    <text className="lbl" x="46" y="158">
      ITERATIONS
    </text>
    <text className="lbl" x="22" y="112" transform="rotate(-90 22 112)">
      RESIDUAL
    </text>
  </Fig>
)

// T-104 · generative ai. The note now ends on being willing to bin a thousand
// images, so the figure is the bin: a grid of outputs, one kept. A discard grid.
export const GenaiFigure = (
  <Fig
    alt="A grid of forty small empty rectangles representing generated images, all faint, with a single one outlined in red."
    caption="Forty generated candidates from one prompt, with the single retained result outlined."
  >
    {Array.from({ length: 40 }, (_, i) => {
      const x = 26 + (i % 10) * 25
      const y = 34 + Math.floor(i / 10) * 28
      return i === 23 ? (
        <rect key={i} className="acs" x={x} y={y} width={19} height={21} />
      ) : (
        <rect key={i} className="th" x={x} y={y} width={19} height={21} />
      )
    })}
    <text className="lbl" x="26" y="160">
      ONE KEPT
    </text>
  </Fig>
)

// T-105 · extended reality. REDRAWN 2026-07-29. The first version drew a little
// person in a section, which is illustration. This is an ISOVIST: the standard
// spatial-analysis drawing of everything visible from one standing point, with
// the shadow the partition casts left blank. It is the exact difference the
// note is about, because the plan holds every room and only the isovist tells
// you what the body actually gets, and you cannot compute it without choosing
// where to stand.
export const XrealFigure = (
  <Fig
    alt="A room plan with a partition wall. From a single marked standing point, the region visible from there is outlined in red; the area hidden behind the partition is left empty, showing what the plan cannot tell you."
    caption="Isovist from one standing point in a partitioned plan. The outlined region is visible from that point; the remainder is not."
  >
    <path className="ln" d="M40 34h224v108H40z" />
    <path className="ln" d="M176 34v58" />
    <path className="acs" d="M40 34h136v58l88-18v68H40z" fill="none" />
    <circle className="ac" cx="84" cy="120" r="5" />
    <path className="th dash" d="M84 120L264 80M84 120L176 92" />
    <text className="lbl" x="196" y="52">
      UNSEEN
    </text>
    <text className="lbl" x="46" y="158">
      VISIBLE FROM THE POINT
    </text>
  </Fig>
)

// T-106 · comfort as data. The note's claim is that comfort is not the mean of
// six numbers, so the figure is six bars with an average line that misses the
// one that is actually wrong. A bar chart.
export const ComfortFigure = (
  <Fig
    alt="Six vertical bars of differing heights, one much shorter than the rest and drawn in red, with a dashed horizontal line showing a comfortable-looking average that the short bar sits far below."
    caption="Six sensory scores for one room against their mean. The mean sits within range while one score falls far below it."
  >
    <path className="ax" d="M32 140h236" />
    <rect className="th" x="44" y="52" width="22" height="88" />
    <rect className="th" x="82" y="44" width="22" height="96" />
    <rect className="acs" x="120" y="110" width="22" height="30" />
    <rect className="th" x="158" y="48" width="22" height="92" />
    <rect className="th" x="196" y="58" width="22" height="82" />
    <rect className="th" x="234" y="50" width="22" height="90" />
    <path className="ln dash" d="M32 62h240" />
    <text className="lbl" x="32" y="34">
      THE AVERAGE
    </text>
    <text className="lbl" x="112" y="158">
      LOWEST SCORE
    </text>
  </Fig>
)

// T-107 · drawing as interface. The note is about the gap between deciding and
// drawing closing, so the figure is a control wired straight to a plan. The
// only figure that draws an interface.
// REDRAWN 2026-07-29 (third pass). Drawing a plan wired to a slider showed the
// apparatus and missed the argument. The note's actual claim is about a GAP in
// time: "that gap is where most bad buildings are born, in the lag between what
// you meant and what you finally documented." So the figure is two timelines.
// On the old one, deciding and drawing are separated and the lag is shaded. On
// the live one they land on the same instant and there is no gap to fall into.
export const DrawifaceFigure = (
  <Fig
    alt="Two timelines. On the upper one, a mark for deciding and a mark for drawing sit far apart with the interval between them shaded. On the lower one, both land on a single red mark with no interval at all."
    caption="Interval between deciding and drawing, in two workflows. Above, the two events are separated; below, they coincide."
  >
    <path className="ax" d="M34 56h234" />
    <circle className="dt" cx="70" cy="56" r="5" />
    <circle className="dt" cx="212" cy="56" r="5" />
    <path className="th" d="M70 44v-12M212 44v-12" />
    <text className="lbl" x="52" y="26">
      DECIDE
    </text>
    <text className="lbl" x="196" y="26">
      DRAW
    </text>
    {Array.from({ length: 11 }, (_, i) => (
      <path key={i} className="th" d={`M${78 + i * 13} 50v12`} opacity="0.35" />
    ))}
    <text className="lbl" x="112" y="80">
      THE LAG
    </text>
    <path className="ax" d="M34 122h234" />
    <circle className="ac" cx="140" cy="122" r="6.5" />
    <path className="th" d="M140 110V98" />
    <text className="lbl" x="104" y="92">
      DECIDE AND DRAW
    </text>
    <text className="lbl" x="34" y="146">
      LIVE DRAWING
    </text>
  </Fig>
)

// T-108 · evolutionary search. REDRAWN 2026-07-29 (third pass) to match the
// note's NEW ending. A lineage tree drew the middle of the essay, the breeding,
// which the prose no longer ends on. The ending is now the fitness function:
// "good has to become a number before the search will believe it, so every
// quality you cannot count quietly drops out of the competition. Lighter is
// easy. Legible is not."
//
// So the figure is the scoreboard the search actually optimises against: three
// things it can weigh, and one it cannot, drawn as the bar that never gets
// built. The empty slot is the argument.
export const EvosearchFigure = (
  <Fig
    alt="A bar chart of the qualities a fitness function scores. Three bars, for weight, span and cost, are drawn and filled. A fourth slot labelled legible has no bar at all, only an empty dashed outline in red."
    caption="Four design qualities against a fitness function. Three carry a measure and are scored; the fourth has none and leaves the search."
  >
    <path className="ax" d="M36 138h232" />
    <rect className="th" x="52" y="52" width="34" height="86" />
    <rect className="th" x="108" y="76" width="34" height="62" />
    <rect className="th" x="164" y="64" width="34" height="74" />
    <rect
      className="acs dash"
      x="220"
      y="52"
      width="34"
      height="86"
      fill="none"
    />
    <text className="lbl" x="52" y="156">
      WEIGHT
    </text>
    <text className="lbl" x="110" y="156">
      SPAN
    </text>
    <text className="lbl" x="168" y="156">
      COST
    </text>
    <text className="lbl" x="216" y="156" fill="var(--lang-interaction)">
      LEGIBLE
    </text>
    <text className="lbl" x="36" y="30">
      THE FITNESS FUNCTION
    </text>
  </Fig>
)

// T-109 · heritage meets new tech. The note's own margin line is "the frame is
// the client, the balloons are the tenants", so the figure is exactly that: the
// old frame untouched, the new thing resting in it. A diagram of contact.
// REDRAWN 2026-07-29. The first version drew balloons inside a frame, which
// says "balloons" and not "borrowed". This is the load diagram instead: the
// new roof arrives as a distributed load along the old beam, and every reaction
// arrow comes back down through supports that were already there. Nothing new
// touches the ground, which is the entire claim, and a structural drawing can
// say it in a way a picture of balloons cannot.
export const HeritageFigure = (
  <Fig
    alt="A structural load diagram. A row of small downward arrows presses evenly along an existing beam, and two red upward reaction arrows return the load through the two original columns. No new support is added anywhere."
    caption="Load path of an added roof on an existing frame. Reactions return through the two original columns; no new support is introduced."
  >
    <path className="th" d="M46 46c56-22 152-22 208 0" />
    {Array.from({ length: 9 }, (_, i) => {
      const x = 54 + i * 24
      return (
        <g key={i}>
          <path className="th" d={`M${x} 56v26`} />
          <path className="th" d={`M${x - 4} 76l4 6 4-6`} />
        </g>
      )
    })}
    <path className="ln" d="M46 90h208" />
    <path className="ln" d="M56 90v46M244 90v46" />
    <path className="th" d="M40 136h230" />
    <path className="acs" d="M56 146v-22M50 130l6-6 6 6" />
    <path className="acs" d="M244 146v-22M238 130l6-6 6 6" />
    <text className="lbl" x="40" y="164">
      EXISTING SUPPORTS
    </text>
  </Fig>
)

// T-110 · buildings that respond. A fixed guess against a thing that can move:
// one ceiling line committed years ago, and the band it could have travelled.
// REDRAWN 2026-07-29. The note's actual complaint is "averaged assumptions",
// so the figure is the average: a distribution of the people who will use the
// room, with the design decision parked on the mean and one occupant sitting
// out in the tail where nothing was chosen for them. The building is not wrong
// for most people. It is wrong for whoever is standing at the red dot, and the
// distribution is the only drawing that shows both facts at once.
export const RespondFigure = (
  <Fig
    alt="A bell curve of occupants. A dashed vertical line marks the design decision, sitting exactly on the mean, and a single red point sits far out in the right tail where no choice was made for them."
    caption="Occupant distribution against a single design decision. The decision sits at the mean; the marked occupant sits in the tail."
  >
    <path className="ax" d="M32 140h240" />
    <path
      className="ln"
      d="M40 140C82 139 106 46 148 44C190 46 214 139 262 140"
    />
    <path className="th dash" d="M148 44v96" />
    <circle className="dt" cx="148" cy="140" r="4" />
    <text className="lbl" x="112" y="34">
      THE DECISION
    </text>
    <circle className="ac" cx="230" cy="140" r="5.5" />
    <path className="th" d="M230 134v-22" />
    <text className="lbl" x="208" y="106">
      OUTLIER
    </text>
    <text className="lbl" x="34" y="158">
      OCCUPANTS
    </text>
  </Fig>
)

// T-113 · explaining things. The note says fun is not decoration on the
// explanation, it IS the explanation, so the figure puts the dense version and
// the toy version of one idea side by side. A translation.
export const ExplainFigure = (
  <Fig
    alt="On the left a dense tangle of boxes and arrows labelled the diagram; on the right the same idea as three stacked toy bricks in red, labelled the toy."
    caption="One idea in two representations: a process diagram, and the same process as three stacked bricks."
  >
    <rect className="th" x="26" y="40" width="30" height="18" />
    <rect className="th" x="76" y="40" width="30" height="18" />
    <rect className="th" x="26" y="76" width="30" height="18" />
    <rect className="th" x="76" y="76" width="30" height="18" />
    <rect className="th" x="50" y="112" width="30" height="18" />
    <path className="th" d="M56 49h20M41 58v18M91 58v18M56 85h20M41 94l14 18M91 94L77 112" />
    <text className="lbl" x="26" y="150">
      THE DIAGRAM
    </text>
    <path className="acs" d="M176 118h64v18h-64zM182 100h52v18h-52zM190 82h36v18h-36z" />
    <path className="acs" d="M188 78v4M206 78v4M218 78v4" />
    <text className="lbl" x="176" y="150">
      THE TOY
    </text>
  </Fig>
)

// ---------------------------------------------------------------------------
// T-114 · adjacency is not access.
//
// The note spends a whole paragraph describing two graphs and the difference
// between them, in words, which is the clearest signal a note can give that it
// wants a drawing. Solid edges are rooms you can walk between; the red dashed
// edge is the one pair that shares a wall and no door. That single edge IS the
// note's finding, so it takes the drawing's one accent.
// ---------------------------------------------------------------------------
export const AdjacencyFigure = (
  <Fig
    alt="Five rooms drawn as dots joined by lines. Four solid lines connect rooms you can walk between. One red dashed line joins two rooms that share a wall but have no door between them."
    caption="Five rooms as a graph. Solid edges are doors; the broken edge is a shared wall with no door in it."
  >
    <path className="ln" d="M74 46h96M170 46l64 60M74 46L58 138M58 138h112" />
    <path className="acs dash" d="M170 46L58 138" />
    <circle className="dt" cx="74" cy="46" r="6" />
    <circle className="dt" cx="170" cy="46" r="6" />
    <circle className="dt" cx="234" cy="106" r="6" />
    <circle className="dt" cx="58" cy="138" r="6" />
    <circle className="dt" cx="170" cy="138" r="6" />
    <text className="lbl" x="54" y="32">
      PUBLIC
    </text>
    <text className="lbl" x="152" y="32">
      STAFF
    </text>
    <text className="lbl" x="216" y="128">
      CELL
    </text>
  </Fig>
)

// ---------------------------------------------------------------------------
// T-115 · experiences are data. The note's whole claim is that one diagram
// describes two things, so the drawing is one diagram with a swappable middle
// term. The red rule between A BODY and A MODEL is the "or" the note refuses
// to resolve.
// ---------------------------------------------------------------------------
// REDRAWN 2026-07-29. The first version was a box with two labels in it, which
// is a diagram of the sentence rather than a figure of the idea. This is the
// claim as a learning curve, the plot every ML run produces: performance
// against exposure. One curve is a person getting better at reading rooms, the
// other is a model getting better at anything. THEY ARE THE SAME CURVE, drawn
// once in ink and once in red, and the note's question is why nobody finds
// that suspicious. Neither is labelled at the axis, on purpose.
export const ExperienceFigure = (
  <Fig
    alt="A learning curve plot. Two curves rise steeply and then flatten, one drawn in ink and one in red, following each other so closely they are almost indistinguishable. The horizontal axis is labelled experience on one side and data on the other."
    caption="Learning curves for a person and for a model, on a shared axis of experience and data. The two are near-indistinguishable in shape."
  >
    <path className="ax" d="M40 140h230M40 140V26" />
    <path
      className="ln"
      d="M44 136C78 130 96 74 132 60C168 46 206 42 264 40"
    />
    <path
      className="acs dash"
      d="M44 138C80 134 98 82 134 66C170 51 208 47 264 45"
    />
    <text className="lbl" x="46" y="158">
      EXPERIENCE
    </text>
    <text className="lbl" x="206" y="158">
      / DATA
    </text>
    <text className="lbl" x="22" y="112" transform="rotate(-90 22 112)">
      GETTING IT RIGHT
    </text>
  </Fig>
)

// ---------------------------------------------------------------------------
// T-116 · what an LLM actually is. REDRAWN 2026-07-29: the first version was
// the conditional-probability equation, and Emilie cut it along with the note
// ("I don't love the llm thought and the figure we use here"). The equation
// was making the same mistake the prose was, stating one tidy formula as if it
// settled the matter, when the note's actual argument is that three confident
// assumptions are wrong and the true mechanism is stranger than any of them.
//
// So the figure follows the prose: three things struck out, and beside them
// the small thing it does instead. The struck lines take the accent, because
// the crossings-out ARE the argument.
// ---------------------------------------------------------------------------
export const LlmFigure = (
  <Fig
    alt="Three common descriptions of a language model, a database, a mind, and magic, each struck through in red. Beside them, a chain of filled dots for the preceding words, ending in one hollow dot with a question mark for the predicted word."
    caption="Three common descriptions of a language model, struck through, beside the operation it performs: predicting the next word."
  >
    <text className="lbl" x="24" y="34">
      COMMON DESCRIPTIONS
    </text>
    <text className="lbl" x="30" y="66" fontSize="11">
      A DATABASE
    </text>
    <path className="acs" d="M26 62h84" />
    <text className="lbl" x="30" y="100" fontSize="11">
      A MIND
    </text>
    <path className="acs" d="M26 96h56" />
    <text className="lbl" x="30" y="134" fontSize="11">
      MAGIC
    </text>
    <path className="acs" d="M26 130h50" />
    <path className="th" d="M150 30v112" />
    <text className="lbl" x="172" y="60">
      PRIOR WORDS
    </text>
    <path className="th" d="M180 88h72" />
    <circle className="dt" cx="180" cy="88" r="4" />
    <circle className="dt" cx="198" cy="88" r="4" />
    <circle className="dt" cx="216" cy="88" r="4" />
    <circle className="dt" cx="234" cy="88" r="4" />
    <circle cx="256" cy="88" r="6" fill="none" stroke="currentColor" strokeWidth={1.4} />
    <text className="lbl" x="172" y="122">
      NEXT WORD
    </text>
  </Fig>
)

// ---------------------------------------------------------------------------
// T-117 · latent space. Two axes with no units, points that clump, and one
// point picked out. The emptiness between the clumps is the part the note is
// actually about, so nothing is drawn there, on purpose.
// ---------------------------------------------------------------------------
export const LatentFigure = (
  <Fig
    alt="A scatter of dots on two unlabelled axes. The dots gather into two loose clumps with empty space between them, and one dot in that empty space is marked in red."
    caption="Points embedded on two unnamed axes. Clusters form by similarity; the marked point lies in the sparse region between them."
  >
    <path className="ax" d="M40 142h224M40 142V26" />
    <g className="dt" opacity="0.5">
      <circle cx="86" cy="56" r="3" />
      <circle cx="102" cy="68" r="3" />
      <circle cx="78" cy="74" r="3" />
      <circle cx="112" cy="52" r="3" />
      <circle cx="96" cy="84" r="3" />
      <circle cx="204" cy="106" r="3" />
      <circle cx="220" cy="94" r="3" />
      <circle cx="192" cy="118" r="3" />
      <circle cx="228" cy="116" r="3" />
      <circle cx="212" cy="128" r="3" />
    </g>
    <circle className="ac" cx="152" cy="88" r="5" />
    <text className="lbl" x="44" y="158">
      NO UNITS
    </text>
    {/* Rotated about y=112, not y=44: pivoting at the top ran the label up
        past the viewBox and (because the svg is overflow:visible) it printed
        above the plate's own rule. It now sits alongside the axis it labels. */}
    <text className="lbl" x="22" y="112" transform="rotate(-90 22 112)">
      NO UNITS
    </text>
  </Fig>
)

// ---------------------------------------------------------------------------
// T-118 · safety, when the tool scores people. The note's point is that a
// score outruns its caveats, so the drawing is that race: the methodology
// stays in its box, the number leaves and keeps going off the right edge.
// ---------------------------------------------------------------------------
// REDRAWN 2026-07-29. The first version drew a number leaving a box, which
// illustrates "travels" and not "allocates". This is the spreadsheet the note
// actually loses sleep over: rooms as a histogram, and a threshold dropped on
// it. Everything left of the line is struck out, and nothing about that line
// is in the methodology. It is a chart anyone in any office could produce in a
// minute from a column of scores, which is exactly the point.
export const ScoreFigure = (
  <Fig
    alt="A histogram of rooms by score. A red vertical threshold line cuts the distribution, and every bar to the left of it is drawn faint and struck through, showing rooms filtered out by a cutoff that appears nowhere in the method."
    caption="Rooms by score, with an allocation threshold applied. The threshold appears nowhere in the source research."
  >
    <path className="ax" d="M34 140h236" />
    {(
      [
        [42, 118],
        [64, 100],
        [86, 82],
        [108, 66],
        [130, 58],
        [152, 62],
        [174, 74],
        [196, 92],
        [218, 110],
        [240, 124],
      ] as const
    ).map(([x, y], i) => (
      <rect
        key={x}
        className="th"
        x={x}
        y={y}
        width={18}
        height={140 - y}
        opacity={i < 3 ? 0.28 : undefined}
      />
    ))}
    <path className="acs" d="M104 30v116" />
    <path className="th" d="M40 84l62-30" opacity="0.35" />
    <text className="lbl" x="112" y="28">
      THE CUTOFF
    </text>
    <text className="lbl" x="34" y="160">
      ROOMS, BY SCORE
    </text>
  </Fig>
)

// ---------------------------------------------------------------------------
// T-119 · computation. The note's whole distinction is drawing one answer
// versus describing the rule that makes all of them, so the drawing is that
// comparison and nothing else. The accent goes on the one line the rule
// produced that nobody wanted, which is the note's actual subject: the
// optimiser did not fail, it was asked badly.
// ---------------------------------------------------------------------------
export const ComputationFigure = (
  <Fig
    alt="On the left, a single drawn vertical line above a label reading one line. On the right, six lines of differing heights produced by a rule, one of them red and noticeably shorter than the rest."
    caption="One drawn line beside six produced by a rule. The rule generates every case, including the marked outlier."
  >
    <path className="ln" d="M46 42v86" />
    <path className="th" d="M28 128h36" />
    <text className="lbl" x="26" y="146">
      ONE LINE
    </text>
    <path className="ln" d="M76 86h24" />
    <path className="ln" d="M96 81l7 5-7 5" />
    <path className="ln" d="M138 46v82M164 40v88M190 52v76M216 38v90M268 44v84" />
    <path className="acs" d="M242 74v54" />
    <path className="th" d="M126 128h152" />
    <text className="lbl" x="130" y="146">
      RULE OUTPUT
    </text>
  </Fig>
)
