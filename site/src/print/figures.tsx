// PRINT FIGURES · drawings the book makes itself (2026-08-12).
//
// WHY THIS MODULE EXISTS. Page two of a project normally shows photographs of
// the work: renders, screens, sheets. NeuroSpace's page showed two DIAGRAMS
// exported from the app's own design files, and Emilie's verdict on seeing
// them printed was that they "don't fit the aesthetic and they are too small".
// Both halves of that were measurable. They carried coloured rounded boxes in a
// type family the book uses nowhere else, and at 875px drawn 171mm wide they
// landed near 130dpi, which is why they were the only two assets the census had
// to sanction for resolution. That sanction list is empty now.
//
// A drawing the book makes itself fixes both at once: it is in the book's ink
// and type, and being vector it has no resolution at all.
//
// THE RULE FOR ANYTHING ADDED HERE: a figure may only restate what the project
// already says in signed copy. A figure that asserts something the record does
// not is a new claim, and new claims are Emilie's to sign, not this file's to
// invent.
import type { ReactNode } from 'react'

export interface PrintFigure {
  /** The drawing's own units. Only the ratio matters; the page scales it. */
  w: number
  h: number
  node: ReactNode
}

const INK = '#16181d'
const MUTED = '#565b63'
const QUIET = '#8a919b'
const HAIR = '#c8ccd2'
// The computation lens, in print: the same ink this project's mark carries on
// the cover, so the fast path is coloured by the lens the project belongs to
// rather than by a colour invented for this drawing.
const LENS = '#0e7490'
// The PRACTICE lens, for the projects that carry that mark on the cover.
const PRACTICE = '#a8186b'
// The app's own card ground and its 3D viewport, and the five dimension colours
// SAMPLED OFF ITS REPORT rather than chosen here (blue, orange, purple, green,
// light green). Emilie, 2026-08-12: "maybe the design should look a bit more
// like the UI of the app to match the design elements of this project."
const CARD = '#f4f5f6'
const VIEWPORT = '#2b2f36'
// Spelled out in full since the book audit (Emilie, 2026-08-18): the codes
// CH/WQ/NL/BF/PP appeared nowhere else on the page, so the legend now carries
// the report's own dimension names.
const DIMS: [string, string, string][] = [
  ['CEILING HEIGHT', '.22', '#3b7fb0'],
  ['WALL QUALITY', '.25', '#d55109'],
  ['NATURAL LIGHT', '.22', '#6f66a9'],
  ['BIOPHILIC FORM', '.18', '#379e59'],
  ['POTTED PLANTS', '.13', '#66b768'],
]

function Arrow({ x, y, accent = false }: { x: number; y: number; accent?: boolean }) {
  return (
    <>
      <path d={`M${x} ${y} h14`} stroke={accent ? LENS : INK} strokeWidth={accent ? 1.4 : 1.1} fill="none" />
      <path d={`M${x + 14} ${y - 4} l8 4 -8 4z`} fill={accent ? LENS : INK} />
    </>
  )
}

function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  accent = false,
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
  sub?: string
  accent?: boolean
}) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} fill="#ffffff" stroke={accent ? LENS : INK} strokeWidth={accent ? 1.4 : 1.1} />
      <text x={x + 11} y={y + 25} fontFamily="Martian Mono" fontSize={11.5} letterSpacing={0.9} fill={INK}>
        {label}
      </text>
      {sub && (
        <text x={x + 11} y={y + 44} fontFamily="Martian Mono" fontSize={8.5} letterSpacing={0.3} fill={QUIET}>
          {sub}
        </text>
      )}
    </>
  )
}

/** A point on the app's own 0 to 100 gauge. */
function dialPoint(v: number, r = 40, cx = 600, cy = 390): [number, number] {
  const a = ((180 - v * 1.8) * Math.PI) / 180
  return [cx + r * Math.cos(a), cy - r * Math.sin(a)]
}

function DialBand({ from, to, colour }: { from: number; to: number; colour: string }) {
  const [x1, y1] = dialPoint(from)
  const [x2, y2] = dialPoint(to)
  return (
    <path
      d={`M${x1.toFixed(1)} ${y1.toFixed(1)} A40 40 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`}
      stroke={colour}
      strokeWidth={9}
      fill="none"
    />
  )
}

/** TWO PATHS OUT OF ONE SLIDER. NeuroSpace's HOW, drawn.
 *
 *  Every string is the project's own: the four boxes on the upper rail are its
 *  four HOW steps, the five weights are its formula sheet, and the gauge shows
 *  that sheet's four bands at the same 80 the report screen below it shows.
 *
 *  ⚠ IT BORROWS THE APP'S INTERFACE ON PURPOSE (Emilie's pick, 2026-08-12, from
 *  three treatments drawn at size). The sliders are drawn as the app draws them,
 *  the score is the app's dial rather than a rule, the weights carry the app's
 *  own dimension colours, the two groups sit on its card ground, and the viewer
 *  is its dark viewport. I argued for the lighter treatment, which took the
 *  score language but not the panels, on the grounds that card grounds turn a
 *  drawing into a picture of a UI. She took the fuller one. The STRUCTURE is
 *  still the book's, which is what keeps this a page and not a screenshot.
 *
 *  ⚠ THE DRAWING CARRIES ITS OWN MARGIN, 40 units at each end. A lead BLEEDS off
 *  the trim, which is right for a photograph and wrong for a drawing: the first
 *  build ran "SEVEN SLIDERS" and the slider rails onto the page edge, because a
 *  figure is made of words and words cannot bleed. Keeping the bleed and moving
 *  the margin INSIDE the viewBox meant the page's geometry needed no special
 *  case.
 *
 *  ⚠ EVERY LABEL IS PLACED BY MEASUREMENT, not by eye. Two collisions got
 *  through by looking: the report's sub-label ran 7 units past its own box, and
 *  the gauge, when first placed under the weights, sat on top of them. Both were
 *  found by testing every text box against every other, which is the only way
 *  this drawing stays clean when a string changes. */
const NEURO_TWO_PATHS: PrintFigure = {
  w: 900,
  h: 420,
  node: (
    <svg viewBox="0 0 900 420" style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden="true">
      {/* the app's card grounds */}
      <rect x={40} y={4} width={142} height={330} fill={CARD} />
      <rect x={214} y={238} width={460} height={178} fill={CARD} />

      {/* the input, drawn as the app draws a slider */}
      <text x={56} y={16} fontFamily="Martian Mono" fontSize={10} letterSpacing={1} fill={MUTED}>
        SEVEN SLIDERS
      </text>
      {[0, 1, 2, 3, 4, 5, 6].map(i => {
        const knob = 70 + ((i * 19) % 84)
        return (
          <g key={i}>
            <line x1={56} y1={40 + i * 29} x2={166} y2={40 + i * 29} stroke={HAIR} strokeWidth={3} />
            <line x1={56} y1={40 + i * 29} x2={knob} y2={40 + i * 29} stroke={LENS} strokeWidth={3} />
            <circle cx={knob} cy={40 + i * 29} r={4.4} fill="#ffffff" stroke={LENS} strokeWidth={1.6} />
          </g>
        )
      })}
      {/* ⚠ ONE PARAMETER PER LINE, and the reason is arithmetic rather than
          taste. Paired up, "openings · organic form" measured 144 units wide and
          ran 18 past the card's right edge and straight through the rail at 196.
          The card cannot grow to fit it: the rail is only 14 units beyond the
          card, so the text is what has to yield. At 6.27 units per character the
          usable measure is 110, which is 17 characters, and every line below is
          inside that. Anything longer added here will overflow again. */}
      {/* SEVEN names for SEVEN sliders (the book audit's B15): "openings" was
          really two sliders in the app, Opening Count and Opening Size, so the
          diagram's own title stopped adding up. All lines stay inside the
          17-character measure the note above establishes. */}
      {['ceiling height', 'wall count', 'curvature', 'opening count', 'opening size', 'organic form', 'plants'].map((t, i) => (
        <text key={t} x={56} y={258 + i * 12} fontFamily="Martian Mono" fontSize={8.5} letterSpacing={0.3} fill={QUIET}>
          {t}
        </text>
      ))}

      {/* the split */}
      <circle cx={196} cy={128} r={4.6} fill={INK} />
      <path d="M196 128 V59 H208" stroke={INK} strokeWidth={1.1} fill="none" />
      <path d="M196 128 V291 H208" stroke={LENS} strokeWidth={1.4} fill="none" />
      <Arrow x={208} y={59} />
      <Arrow x={208} y={291} accent />

      {/* THE SLOW PATH, ending in the app's dark viewport */}
      <text x={230} y={22} fontFamily="Martian Mono" fontSize={10} letterSpacing={1.2} fill={MUTED}>
        THE SLOW PATH · ON THE SERVER
      </text>
      <Box x={230} y={30} w={140} h={58} label=".GH DEFINITION" sub="evaluated in Rhino" />
      <Box x={388} y={30} w={140} h={58} label="RHINO.COMPUTE" sub="server-side" />
      <Box x={546} y={30} w={140} h={58} label="RHINO3DM" sub="WASM decoder" />
      <rect x={704} y={30} width={140} height={58} fill={VIEWPORT} />
      <text x={715} y={55} fontFamily="Martian Mono" fontSize={11.5} letterSpacing={0.9} fill="#ffffff">
        THREE.JS
      </text>
      <text x={715} y={74} fontFamily="Martian Mono" fontSize={8.5} letterSpacing={0.3} fill="#b9c0c9">
        walk · iso · plan
      </text>
      <Arrow x={370} y={59} />
      <Arrow x={528} y={59} />
      <Arrow x={686} y={59} />
      <text x={230} y={110} fontFamily="Martian Mono" fontSize={9} letterSpacing={0.3} fill={QUIET}>
        geometry streams back, and only recomputes when the shape actually changes
      </text>

      {/* THE FAST PATH */}
      <text x={230} y={250} fontFamily="Martian Mono" fontSize={10} letterSpacing={1.2} fill={LENS}>
        THE FAST PATH · IN THE BROWSER
      </text>
      <Box x={230} y={262} w={310} h={58} label="NEUROSCORE" sub="a transparent weighted sum, no round trip" accent />
      {/* Stacked, not in a row: five full names at 9pt-equivalent measure ~101
          units wide, ending at y=396 inside the card's 416 bottom, well left of
          the gauge at x~530. */}
      {DIMS.map(([k, v, c], i) => (
        <g key={k}>
          <rect x={230} y={332 + i * 16 - 7} width={8} height={8} fill={c} />
          <text x={242} y={332 + i * 16} fontFamily="Martian Mono" fontSize={9} letterSpacing={0.3} fill={MUTED}>
            {v} {k}
          </text>
        </g>
      ))}

      {/* the app's own gauge, to the RIGHT of the weights so it cannot sit on them */}
      <DialBand from={0} to={30} colour="#c0392b" />
      <DialBand from={30} to={55} colour="#d55109" />
      <DialBand from={55} to={75} colour="#66b768" />
      <DialBand from={75} to={100} colour="#379e59" />
      <line x1={600} y1={390} x2={dialPoint(80)[0]} y2={dialPoint(80)[1]} stroke={INK} strokeWidth={1.6} />
      <circle cx={600} cy={390} r={3} fill={INK} />
      <text x={600} y={382} textAnchor="middle" fontFamily="Martian Mono" fontSize={15} fill={INK}>
        80
      </text>
      <text x={552} y={406} fontFamily="Martian Mono" fontSize={7.5} fill={QUIET}>
        0
      </text>
      <text x={636} y={406} fontFamily="Martian Mono" fontSize={7.5} fill={QUIET}>
        100
      </text>
      <text x={600} y={406} textAnchor="middle" fontFamily="Martian Mono" fontSize={7.5} letterSpacing={0.5} fill={QUIET}>
        RESTORATIVE
      </text>

      {/* where the two paths meet */}
      <path d="M774 88 V150" stroke={INK} strokeWidth={1.1} fill="none" />
      <path d="M540 291 H676 V185" stroke={LENS} strokeWidth={1.4} fill="none" />
      <Arrow x={676} y={185} accent />
      <Box x={704} y={156} w={140} h={58} label="THE REPORT" sub="PDF · .3dm" />
    </svg>
  ),
}



/** TWO TOWERS, ONE PODIUM, BALCONIES CUT IN. Verve's building, drawn.
 *
 *  ⚠ THIS SLOT HAS HAD THREE SUBJECTS, and the first two are worth not
 *  repeating. A workflow hub (everything into one Revit file) was built and
 *  rejected on sight: the page already carries three columns of process, so a
 *  process diagram was a fourth telling of it. A four step chain of the HOW was
 *  worse, repeating the column beside it almost word for word. Emilie's ruling
 *  was a diagram about the BUILDING; then, shown a massing stack and a balcony
 *  comparison drawn separately, she asked for both at once.
 *
 *  WHAT IT SAYS, and every clause is from the signed WHAT: two towers of
 *  different height over ONE shared amenities podium, and balconies CUT INTO the
 *  facade rather than hung off it. The amenities named under the podium are the
 *  plan caption's own list, and that plan sits directly above this figure on the
 *  page, so the drawing explains what the reader is already looking at.
 *
 *  THE BALCONY IS DRAWN AS A NOTCH INSIDE THE SILHOUETTE, which is the only way
 *  to state the rule in one drawing instead of two: the outline never grows, so
 *  "cut in rather than hung off" is visible without a rejected version beside it.
 *
 *  ⚠ NO NUMBERS ANYWHERE. The record has no floor count, no height and no area,
 *  and a figure may not invent them. The floor lines are indicative rhythm and
 *  are deliberately not countable as storeys.
 *
 *  ⚠ It also gives back what the DROPPED ELEVATION was doing. That drawing left
 *  the book because at 80mm in a register it was unreadable; drawn, the same
 *  fact reads at any size and costs no resolution.
 *
 *  draftCopy until Emilie signs it. */
const VERVE_STACK: PrintFigure = {
  w: 300,
  h: 240,
  node: (
    <svg viewBox="0 0 300 240" style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden="true">
      <text x={0} y={10} fontFamily="Martian Mono" fontSize={9.5} letterSpacing={0.3} fill={QUIET}>
        TWO TOWERS, ONE PODIUM
      </text>

      <rect x={52} y={26} width={46} height={140} fill="#ffffff" stroke={INK} strokeWidth={1.1} />
      {[46, 66, 86, 106, 126, 146].map(y => (
        <line key={y} x1={52} y1={y} x2={98} y2={y} stroke={HAIR} strokeWidth={0.8} />
      ))}

      <rect x={150} y={62} width={46} height={104} fill="#ffffff" stroke={INK} strokeWidth={1.1} />
      {[82, 102, 122, 142].map(y => (
        <line key={y} x1={150} y1={y} x2={196} y2={y} stroke={HAIR} strokeWidth={0.8} />
      ))}

      {[
        [82, 50],
        [82, 110],
        [180, 90],
      ].map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={16}
          height={12}
          fill={PRACTICE}
          fillOpacity={0.14}
          stroke={PRACTICE}
          strokeWidth={1.2}
        />
      ))}
      <path d="M196 96 H204" stroke={PRACTICE} strokeWidth={1.1} fill="none" />
      <circle cx={196} cy={96} r={2} fill={PRACTICE} />
      <text x={208} y={92} fontFamily="Martian Mono" fontSize={9.5} letterSpacing={0.3} fill={QUIET}>
        balconies
      </text>
      <text x={208} y={106} fontFamily="Martian Mono" fontSize={9.5} letterSpacing={0.3} fill={QUIET}>
        cut in
      </text>

      <rect
        x={16}
        y={166}
        width={216}
        height={34}
        fill={PRACTICE}
        fillOpacity={0.12}
        stroke={PRACTICE}
        strokeWidth={1.3}
      />
      <text x={26} y={187} fontFamily="Martian Mono" fontSize={11} letterSpacing={0.5} fill={INK}>
        AMENITIES PODIUM
      </text>
      <line x1={0} y1={200} x2={300} y2={200} stroke={INK} strokeWidth={1.1} />
      <text x={0} y={218} fontFamily="Martian Mono" fontSize={9.5} letterSpacing={0.3} fill={QUIET}>
        gym · spa · yoga · cinema
      </text>
      <text x={0} y={232} fontFamily="Martian Mono" fontSize={9.5} letterSpacing={0.3} fill={QUIET}>
        kids&rsquo; pool · playgrounds
      </text>
    </svg>
  ),
}

export const PRINT_FIGURES: Record<string, PrintFigure> = {
  'neuro-two-paths': NEURO_TWO_PATHS,
  'verve-stack': VERVE_STACK,
}
