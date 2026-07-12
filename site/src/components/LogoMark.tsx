// THE EEC CONSTELLATION CUBE (CE, approved 2026-07-12; supersedes the A1
// graph cube of 2026-07-06). Same true 30-degree isometric grid, same
// canonical letter mapping (Emilie's): E1 = left face, E2 = top face,
// C = right face. E2's spine sits on the edge it shares with E1 (the two
// E's grow from one stroke), and E2's far bar is the same stroke as the
// C's top arm. The mark draws at three depths:
//   shell  (heavy) - the outer letter strokes: E2's near bar, E1's spine
//                    and bottom bar, C's bottom arm;
//   thread (thin)  - every stroke that touches the redline node: the
//                    shared spines, the C's own spine, both middle dashes;
//   ghost  (faint) - the two back-right edges that only close the cube.
// 6 corner nodes + 2 dash-tip nodes; the redline node stays at the vertex
// where all three letters meet (red = interaction/liveness only, DL v2).
// Mode-aware ALWAYS: ink rides --lang-ink, red rides --lang-interaction,
// so the mark is correct on both grounds with no per-caller tone (the
// tone prop retired with this mark; it caused the light-mode vanishing).
// The mark is always static (the plot-in ceremony was retired in Session 4).

type Pt = readonly [number, number]
const P = {
  T: [0, -200], P4: [86.6, -150], P5: [-86.6, -150], P3: [0, -100],
  P2: [-86.6, -50], P1: [86.6, -50], B: [0, 0],
} as const

// Middle dashes: from the midpoint of each E's spine, 44 units along the
// bar direction; their tips are nodes (the constellation's small stars).
const M1: Pt = [-48.5, -78]
const M2: Pt = [-5.2, -147]

const SHELL: [Pt, Pt][] = [
  [P.P5, P.T], [P.P5, P.P2], [P.P2, P.B], [P.B, P.P1],
]
const THREAD: [Pt, Pt][] = [
  [P.P5, P.P3], [P.P3, P.P4], [P.P3, P.B],
  [[-86.6, -100], M1], [[-43.3, -125], M2],
]
const GHOST: [Pt, Pt][] = [[P.T, P.P4], [P.P4, P.P1]]
const CORNERS: Pt[] = [P.T, P.P4, P.P5, P.P2, P.B, P.P1]

export interface LogoMarkProps {
  /** rendered height in px */
  size?: number
  className?: string
}

const strokeGroup = (lines: [Pt, Pt][], width: number, opacity?: number) => (
  <g
    stroke="var(--lang-ink)"
    strokeWidth={width}
    strokeLinecap="round"
    fill="none"
    opacity={opacity}
  >
    {lines.map(([a, b], i) => (
      <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
    ))}
  </g>
)

export default function LogoMark({ size = 32, className }: LogoMarkProps) {
  return (
    <svg
      height={size}
      viewBox="-104 -218 208 236"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="EEC"
      className={className}
    >
      {strokeGroup(SHELL, 7)}
      {strokeGroup(THREAD, 4)}
      {strokeGroup(GHOST, 3.2, 0.45)}
      {CORNERS.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={13} fill="var(--lang-ink)" />
      ))}
      <circle cx={M1[0]} cy={M1[1]} r={8} fill="var(--lang-ink)" />
      <circle cx={M2[0]} cy={M2[1]} r={8} fill="var(--lang-ink)" />
      <circle cx={P.P3[0]} cy={P.P3[1]} r={15} fill="var(--lang-interaction)" />
    </svg>
  )
}
