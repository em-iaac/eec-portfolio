// THE PLATE ARTIFACTS (WORK PAGE · LOOK & ORDER, Emilie's gate 2026-07-18):
// every /work tile rests as a designed ink drawing, the project's parti in a
// few strokes, drawn in the Pen Table grammar. One per project, keyed by
// registry id. Signed by Emilie on the round-3 board (in chat, 2026-07-18),
// with her tweaks: lEgoarCh = the studded lego castle, Ballooning = balloons
// over the canopy, Homage = option B "the three homages".
//
// Grammar (language.css .work-art): .ln = the ink line (1.6, currentColor),
// .th = the thin line (1, faded), .dt = the ink dot, .ac/.acs = the ONE
// accent per drawing, filled/stroked with the tile's lens pen colour via
// --plate-accent (colour never means alone: the plate's lens mark + label
// name the lens; the accent just warms the drawing). vector-effect keeps
// stroke weight honest at any tile size. The real cover stays one hover away
// (WorkCard reveals it); print and OG never use these (screen-only by intent).
import type { ReactNode } from 'react'

const VB = { viewBox: '0 0 160 90', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': true } as const

export const WORK_ARTIFACTS: Record<string, ReactNode> = {
  // Sensi · the relationship galaxy
  sensi: (
    <svg {...VB}>
      <path className="th" d="M38 34 61 24M61 24 84 42M84 42 108 28M108 28 126 47M84 42 66 62M66 62 98 66M98 66 126 47" />
      <circle className="dt" cx="38" cy="34" r="3" />
      <circle className="dt" cx="61" cy="24" r="2" />
      <circle className="ac" cx="84" cy="42" r="4" />
      <circle className="dt" cx="108" cy="28" r="2" />
      <circle className="dt" cx="126" cy="47" r="2.5" />
      <circle className="dt" cx="66" cy="62" r="2" />
      <circle className="dt" cx="98" cy="66" r="2.5" />
    </svg>
  ),
  // lEgoarCh · the brick castle, studs and all (her tweak: lego-like)
  legoarch: (
    <svg {...VB}>
      <rect className="ln" x="50" y="58" width="60" height="14" />
      <rect className="ln" x="56" y="53" width="9" height="5" />
      <rect className="ln" x="75" y="53" width="9" height="5" />
      <rect className="ln" x="94" y="53" width="9" height="5" />
      <rect className="ln" x="60" y="39" width="40" height="14" />
      <rect className="ln" x="66" y="34" width="9" height="5" />
      <rect className="ln" x="85" y="34" width="9" height="5" />
      <rect className="ln" x="71" y="20" width="18" height="14" />
      <rect className="ln" x="75" y="15" width="9" height="5" />
      <path className="th" d="M60 65h40M70 46h20" />
      <path className="ln" d="M80 15V7" />
      <path className="ac" d="M80 7h10l-10 6z" />
    </svg>
  ),
  // NeuroSpace · wireframe volumes on the grid
  neurospace: (
    <svg {...VB}>
      <path className="th" d="M32 70h96" />
      <path className="ln" d="M56 40l16-9 16 9v18l-16 9-16-9zM56 40l16 9 16-9M72 49v18" />
      <path className="ln" d="M98 52l10-6 10 6v11l-10 6-10-6zM98 52l10 6 10-6M108 58v11" />
      <circle className="ac" cx="72" cy="40" r="3.5" />
    </svg>
  ),
  // The Lungs · the tower breathing, one trunk branching
  lungs: (
    <svg {...VB}>
      <rect className="ln" x="62" y="16" width="36" height="56" />
      <path className="ln" d="M80 66V46M80 46c0-8-8-8-8-16M80 46c0-8 8-8 8-16M72 30c0-4-4-4-4-8M88 30c0-4 4-4 4-8" />
      <circle className="ac" cx="80" cy="66" r="2.5" />
    </svg>
  ),
  // The Huddle · voxels huddling around a center
  huddle: (
    <svg {...VB}>
      <rect className="ln" x="72" y="37" width="16" height="16" />
      <rect className="ln" x="56" y="41" width="12" height="12" />
      <rect className="ln" x="92" y="41" width="12" height="12" />
      <rect className="ln" x="64" y="25" width="12" height="12" />
      <rect className="ln" x="84" y="25" width="12" height="12" />
      <rect className="ln" x="64" y="57" width="12" height="12" />
      <rect className="ac" x="84" y="57" width="12" height="12" />
    </svg>
  ),
  // A Ballooning Market · balloons lifting the canopy (her tweak: more fun)
  ballooning: (
    <svg {...VB}>
      <circle className="ln" cx="66" cy="26" r="12" />
      <circle className="ln" cx="97" cy="33" r="8" />
      <circle className="ac" cx="46" cy="38" r="5.5" />
      <path className="th" d="M66 38q2 12 6 22M97 41q0 10-3 19M46 44q2 9 8 16M66 38l-3-3M66 38l3-3" />
      <path className="ln" d="M40 64q40-12 80 0" />
      <path className="th" d="M48 62v8M80 61v9M112 62v8" />
    </svg>
  ),
  // Encoding Urban Risk · the street network, one segment classified
  'urban-risk': (
    <svg {...VB}>
      <path className="ln" d="M38 62l16-6 12-22 20-8 22 10 16-6" />
      <path className="th" d="M54 56l10 12M66 34l-16-10M66 34l14 24 22 2M86 26l-4-12M108 36l-6 22M124 30l4 26" />
      <path className="acs" d="M80 58l22 2" />
      <circle className="dt" cx="66" cy="34" r="2" />
      <circle className="dt" cx="108" cy="36" r="2" />
      <circle className="dt" cx="80" cy="58" r="2" />
    </svg>
  ),
  // Cappelletti Pavilion · the crossing gridshell
  cappelletti: (
    <svg {...VB}>
      <path className="ln" d="M34 66Q80 14 126 66" />
      <path className="th" d="M44 66Q86 26 122 60M38 60Q74 26 116 66M52 66Q94 30 126 58M34 54Q66 24 104 66" />
      <path className="ln" d="M30 66h100" />
      <circle className="ac" cx="80" cy="40" r="2.5" />
    </svg>
  ),
  // Optimizing for the Mind · the waveform
  podcast: (
    <svg {...VB}>
      <path className="ln" d="M32 39v12M40 42v6M48 35v20M56 40v10M64 28v34M72 38v14M80 24v42M88 36v18M96 30v30M104 41v8M112 34v22M120 43v4M128 39v12" />
      <rect className="ac" x="78.5" y="24" width="3" height="42" rx="1.5" />
    </svg>
  ),
  // Narkomfin as a Graph · the long building becoming a graph
  narkomfin: (
    <svg {...VB}>
      <rect className="ln" x="34" y="42" width="76" height="20" />
      <path className="th" d="M34 50h76M34 56h76" />
      <path className="ln" d="M118 62V30" />
      <path className="th" d="M50 42V30l28-8 40 8" />
      <circle className="dt" cx="50" cy="30" r="2.5" />
      <circle className="dt" cx="78" cy="22" r="2.5" />
      <circle className="ac" cx="118" cy="30" r="3.5" />
      <circle className="dt" cx="118" cy="62" r="2.5" />
    </svg>
  ),
  // Data into Geometry · points flowing into a cube
  'data-geometry': (
    <svg {...VB}>
      <circle className="dt" cx="36" cy="28" r="2" />
      <circle className="dt" cx="34" cy="45" r="2" />
      <circle className="dt" cx="38" cy="62" r="2" />
      <path className="th" d="M40 28q28-6 50 12M38 45h52M42 62q24 6 48-14" />
      <path className="ln" d="M94 56V36l14-8 16 8v20l-16 8zM94 36l16 8 14-8M110 44v20" />
      <circle className="ac" cx="110" cy="44" r="2.5" />
    </svg>
  ),
  // Tsukiji Fish Market · the grid with one cell turning
  tsukiji: (
    <svg {...VB}>
      <rect className="ln" x="50" y="17" width="16" height="16" />
      <rect className="ln" x="72" y="17" width="16" height="16" />
      <rect className="ln" x="94" y="17" width="16" height="16" />
      <rect className="ln" x="50" y="39" width="16" height="16" />
      <rect className="ac" x="72" y="39" width="16" height="16" transform="rotate(28 80 47)" fillOpacity=".85" />
      <rect className="ln" x="94" y="39" width="16" height="16" />
      <rect className="ln" x="50" y="61" width="16" height="16" />
      <rect className="ln" x="72" y="61" width="16" height="16" />
      <rect className="ln" x="94" y="61" width="16" height="16" />
    </svg>
  ),
  // Chair Simulation · the voxel chair in profile
  'chair-sim': (
    <svg {...VB}>
      <rect className="ln" x="62" y="14" width="12" height="12" />
      <rect className="ln" x="62" y="26" width="12" height="12" />
      <rect className="ln" x="62" y="38" width="12" height="12" />
      <rect className="ln" x="74" y="38" width="12" height="12" />
      <rect className="ac" x="86" y="38" width="12" height="12" />
      <rect className="ln" x="62" y="50" width="12" height="12" />
      <rect className="ln" x="86" y="50" width="12" height="12" />
    </svg>
  ),
  // Astroidal Ellipsoid · the exact astroid
  astroidal: (
    <svg {...VB}>
      <path className="ln" d="M80 15C85 37 100 44 126 45C100 46 85 53 80 75C75 53 60 46 34 45C60 44 75 37 80 15Z" />
      <ellipse className="th" cx="80" cy="45" rx="42" ry="14" />
      <circle className="ac" cx="80" cy="45" r="2.5" />
    </svg>
  ),
  // A Playscape · nets sagging between posts
  playscape: (
    <svg {...VB}>
      <path className="ln" d="M42 24v44M118 28v40" />
      <path className="ln" d="M42 28q38 26 76 4" />
      <path className="th" d="M42 40q38 24 76 8M42 52q38 18 76 12" />
      <path className="ln" d="M32 68h96" />
      <circle className="ac" cx="80" cy="43" r="2.5" />
    </svg>
  ),
  // XR for Education · the visor and the molecule
  xr: (
    <svg {...VB}>
      <rect className="ln" x="34" y="32" width="48" height="24" rx="9" />
      <path className="ln" d="M52 56q6-6 12 0" />
      <path className="th" d="M34 40q-8 3 0 9M82 40q8 3 0 9" />
      <circle className="dt" cx="47" cy="43" r="2.5" />
      <circle className="dt" cx="69" cy="43" r="2.5" />
      <path className="ln" d="M112 34l12 7v14l-12 7-12-7V41z" />
      <path className="th" d="M112 34v-9M124 55l9 6M100 55l-9 6" />
      <circle className="dt" cx="112" cy="25" r="2.5" />
      <circle className="ac" cx="133" cy="61" r="2.5" />
    </svg>
  ),
  // Rings of Mars · rings in the crater
  mars: (
    <svg {...VB}>
      <path className="th" d="M26 62q28-10 54-4t54-2" />
      <ellipse className="ln" cx="80" cy="47" rx="34" ry="17" />
      <ellipse className="ln" cx="80" cy="47" rx="22" ry="11" />
      <ellipse className="th" cx="80" cy="47" rx="11" ry="5.5" />
      <circle className="ac" cx="80" cy="47" r="2.5" />
    </svg>
  ),
  // Verve City Walk · the towers in the AR frame
  soma: (
    <svg {...VB}>
      <path className="ln" d="M62 68V32h12v36M86 68V24h14v44" />
      <path className="th" d="M62 42h12M62 52h12M86 36h14M86 48h14M86 60h14M58 68h48" />
      <path className="ln" d="M40 22v-6h10M120 16h10v6M40 68v6h10M130 68v6h-10" />
      <circle className="ac" cx="93" cy="24" r="2.5" />
    </svg>
  ),
  // The Encounter · the spire at sunrise
  encounter: (
    <svg {...VB}>
      <path className="ln" d="M76 66L79 18M84 66L81 18" />
      <path className="ln" d="M50 66h60" />
      <path className="th" d="M50 72h44" />
      <circle className="ac" cx="106" cy="30" r="4.5" />
      <path className="th" d="M100 22l3 3M112 22l-3 3" />
    </svg>
  ),
  // Falcon Square · the takeoff lines become the falcon
  falcon: (
    <svg {...VB}>
      <path className="ln" d="M34 66Q76 58 124 27" />
      <path className="th" d="M34 54q44-10 90-27M40 32q46 0 84-5" />
      <path className="ac" d="M124 27l10-4-6 9z" />
      <circle className="dt" cx="34" cy="66" r="2" />
      <circle className="dt" cx="34" cy="54" r="1.6" />
      <circle className="dt" cx="40" cy="32" r="1.6" />
    </svg>
  ),
  // The Homage · the three homages: past, present, future (option B, her pick)
  homage: (
    <svg {...VB}>
      <path className="ln" d="M30 66Q56 22 82 66" />
      <path className="th" d="M56 66Q82 22 108 66" />
      <path className="th" strokeDasharray="4 5" d="M82 66Q108 22 134 66" />
      <path className="ln" d="M22 66h116" />
      <circle className="ac" cx="56" cy="44" r="2.5" />
    </svg>
  ),
}
