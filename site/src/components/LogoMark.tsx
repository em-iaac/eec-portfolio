// The EEC graph cube (A1, approved 2026-07-06).
// Geometry is the 2022 mark rebuilt on a true 30-degree isometric grid:
// 8 strokes, 7 vertex nodes, one redline node where the three letters meet.
// Letter anatomy (Emilie's canonical mapping): E1 = left face (spine is the
// implied left edge), E2 = top face, C = right face. The implied edge
// between center and right corner is shared: E2's bottom bar + C's top arm.
// The mark is always static (the plot-in ceremony was retired in Session 4:
// no caller ever animated it).

const s = 100
const ux = 86.6
const P = {
  B: [0, 0], P1: [ux, -50], P2: [-ux, -50], P3: [0, -s],
  P4: [ux, -150], P5: [-ux, -150], T: [0, -2 * s],
} as const

type Pt = readonly [number, number]
const dash = (start: Pt, dir: Pt, len: number): [Pt, Pt] =>
  [start, [start[0] + dir[0] * len, start[1] + dir[1] * len]]

const dashTop = dash([-29, -132], [0.866, -0.5], 40)
const dashLeft = dash([-ux, -100], [0.866, 0.5], 40)

// Reading order: E1 (left), E2 (top), C (right)
const STROKES: [Pt, Pt][] = [
  [P.P5, P.P3], dashLeft, [P.P2, P.B], // E1
  [P.T, P.P5], dashTop, [P.T, P.P4], // E2
  [P.P3, P.B], [P.B, P.P1], // C
]
const VERTS: Pt[] = [P.T, P.P4, P.P5, P.P3, P.P2, P.B, P.P1]

export interface LogoMarkProps {
  /** rendered height in px */
  size?: number
  /** ink = light ground, wire = dark ground, lang = mode-aware (DL v2 tokens) */
  tone?: 'ink' | 'wire' | 'lang'
  /** vertex nodes (off for very small sizes) */
  nodes?: boolean
  /** the redline vertex where the three letters meet */
  redNode?: boolean
  className?: string
}

export default function LogoMark({
  size = 32,
  tone = 'ink',
  nodes = true,
  redNode = true,
  className,
}: LogoMarkProps) {
  const ink =
    tone === 'lang' ? 'var(--lang-ink)' : tone === 'ink' ? 'var(--color-ink)' : 'var(--color-ink-dark)'
  const red =
    tone === 'lang'
      ? 'var(--lang-interaction)'
      : tone === 'ink'
        ? 'var(--color-redline-stroke)'
        : 'var(--color-redline-wire)'
  const r = 11

  return (
    <svg
      height={size}
      viewBox="-104 -218 208 236"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="EEC"
      className={className}
    >
      <g stroke={ink} strokeWidth={8} strokeLinecap="round" fill="none">
        {STROKES.map(([a, b], i) => (
          <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} pathLength={100} />
        ))}
      </g>
      {nodes &&
        VERTS.map((p, i) => {
          const isRed = redNode && p === P.P3
          return (
            <circle
              key={i}
              cx={p[0]} cy={p[1]}
              r={isRed ? r * 1.15 : r}
              fill={isRed ? red : ink}
            />
          )
        })}
    </svg>
  )
}
