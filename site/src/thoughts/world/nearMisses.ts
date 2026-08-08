// THE UNMADE SYNAPSES · what is close but not yet joined (2026-08-07).
//
// Emilie's ask, in her words: "watch the unbuilt connections get close but not
// touch... as the writer this helps me see what neurons are so close but not
// yet, so I can water them and create another thought to connect them."
//
// THE MATHS IS SHARED NEIGHBOURS, and that is Hebbian in the literal sense: two
// nodes with friends in common and no thread between them are the pair a new
// thread would most naturally close. It is DERIVED, never typed — every
// candidate is arithmetic on the CORRELATIONS she has already signed, so this
// module cannot invent a relationship and cannot outlive one she cuts.
//
// WHAT IT IS NOT. A near-miss is not a claim that two things ARE related. It is
// the claim that they have friends in common, which is a fact about the graph.
// The honesty floor ("a thread that is not real is not a thread") is what forces
// the mark: no synapse, no pulse, no direction, and a visible gap. It never
// fired, so it must never look like something that did.
//
// Measured on the record as it stands: 741 non-adjacent pairs, 219 share at
// least one neighbour (noise), 18 share three or more, 5 share four or more.
import { CORRELATIONS, DECLINED_NEAR } from '../../data/registry'

/** Three, not one. At one shared neighbour the set is 219 pairs — the whole map
 *  joined to the whole map, which says nothing. Three is where the list becomes
 *  short enough to read and every entry survives being looked at. */
export const NEAR_MIN_SHARED = 3

export interface NearMiss {
  a: string
  b: string
  /** The ids they have in common. Length is the strength, and it is counted,
   *  never written down. */
  shared: string[]
}

/** Both orderings of a pair map to one key, so a decline is a decline whichever
 *  way round it was written. */
export function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`
}

const declined = new Set(DECLINED_NEAR.map(([a, b]) => pairKey(a, b)))

/**
 * The candidates, from the relation graph alone. NO POSITIONS ARE READ HERE,
 * which is what makes it safe to feed the result back into the layout solve:
 * the candidate set cannot depend on the coordinates it goes on to influence.
 *
 * @param ids  the nodes eligible to be near-missed (thoughts and projects; an
 *             award is bound to one thing by definition and a milestone is a
 *             date, so neither can be "almost joined" to anything)
 */
export function nearMissPairs(ids: ReadonlySet<string>): NearMiss[] {
  const nbr = new Map<string, Set<string>>()
  const add = (a: string, b: string) => {
    if (!ids.has(a) || !ids.has(b)) return
    const s = nbr.get(a)
    if (s) s.add(b)
    else nbr.set(a, new Set([b]))
  }
  for (const [a, b] of CORRELATIONS) {
    add(a, b)
    add(b, a)
  }

  // Sorted so the walk — and therefore the output order — is deterministic
  // whatever order the registry happens to be in.
  const list = [...ids].sort()
  const out: NearMiss[] = []
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i]!
      const b = list[j]!
      const na = nbr.get(a)
      const nb = nbr.get(b)
      if (!na || !nb) continue
      if (na.has(b)) continue // already threaded: not a near-miss, a thread
      if (declined.has(pairKey(a, b))) continue
      const shared = [...na].filter((x) => nb.has(x)).sort()
      if (shared.length < NEAR_MIN_SHARED) continue
      out.push({ a, b, shared })
    }
  }
  // Strongest first, id-broken, so the writer's list reads top-down and the
  // snapshot is stable.
  out.sort((p, q) => q.shared.length - p.shared.length || (p.a < q.a ? -1 : p.a > q.a ? 1 : p.b < q.b ? -1 : 1))
  return out
}

/** Neighbours-by-near-miss, for the layout solve's weak pull. */
export function nearMissNeighbours(pairs: readonly NearMiss[]): Map<string, string[]> {
  const m = new Map<string, string[]>()
  const add = (a: string, b: string) => {
    const l = m.get(a)
    if (l) l.push(b)
    else m.set(a, [b])
  }
  for (const p of pairs) {
    add(p.a, p.b)
    add(p.b, p.a)
  }
  return m
}

/**
 * THE MARK: a fixed-length reach out of each end, aimed at the other one, that
 * stops.
 *
 * Fixed length, NOT a fraction of the distance, and that is the whole design.
 * A pair can be 3,000px apart in time (what an llm actually is -> lEgoarCh is
 * 2,990), and a proportional stub there would be a 1,000px arm reaching across
 * a third of the map at something you cannot see, which reads as a thread. A
 * fixed 44 units reads as one thing: "this one is reaching that way." The gap is
 * then everything between the two arms, and it is never zero, at any distance.
 *
 * It carries no synapse and no pulse. Both of those mean "this fired".
 */
// 74, from measuring the first build rather than guessing: at 44 the arm
// rendered 32.7px long and 1px wide at 0.3 opacity, against threads at 1.6px in
// near-black, and it vanished into a bundle of a hundred of them. 74 lands at
// ~55px on the desktop scale, which is legible without competing.
export const REACH_LEN = 74

/**
 * THE GAP NARROWS AS THE CASE GETS STRONGER (Emilie, 2026-08-07: some pairs are
 * closer than others and "based on that it gets closer to forming a synapse").
 *
 * ⚠ THE LINE THIS MUST NOT CROSS, and it is the whole reason the scale is safe:
 * a signed thread and an unmade one are DIFFERENT KINDS OF CLAIM. A thread means
 * she judged it real; a near-miss means arithmetic found an overlap. So the gap
 * is continuous WITHIN the unsigned side and the synapse stays categorical: the
 * arms reach further as the evidence grows, and they only ever meet when she
 * signs it. The synapse is her signature, never a number that got high enough.
 *
 * Two things are graded together. The FIXED length grows with the evidence —
 * still fixed, never proportional, because a pair can be 2,800 units apart and a
 * proportional arm there would be a 900-unit limb reaching at something off
 * screen. And the CAP grows too, which matters more than it looks: with one flat
 * cap of a third, a close pair kept a third of a gap however strong its case,
 * so the grading was invisible exactly where the two ends were near enough to
 * compare. Now five-in-common may close to 18% and three stays above 40%.
 */
/**
 * THE RESTING ARMS REACH FURTHER TOO (Emilie 2026-08-07: "on hover in the
 * explore mode the near misses do not wake up like in the isolated mode, they
 * should"). Measured first, because the obvious reading was wrong: they DO
 * wake — the opacity goes 0 to 0.55, exactly what the fold shows. What differs
 * is LENGTH. An unmade pair on the open map sits 1,000 to 4,000 units apart, so
 * the fixed cap binds and the arms came out at 64 to 110 units — about 53 to 92
 * screen pixels, a hair at each end of a very long gap. The fold's arms are
 * proportional and read as a reach; these read as lint.
 * So the caps roughly double. They stay FIXED, because the reason for a cap has
 * not changed: proportional here would put a 900-unit limb on a 2,800-unit pair,
 * pointing at something off screen. And the gap still cannot close — it is what
 * the drawing is claiming.
 */
export function armLength(shared: number, dist: number): number {
  const s = Math.max(3, Math.min(5, shared))
  const fixed = s >= 5 ? 210 : s >= 4 ? 170 : 135
  const maxFrac = s >= 5 ? 0.41 : s >= 4 ? 0.36 : 0.3
  return Math.min(fixed, dist * maxFrac)
}

/**
 * THE SAME CLAIM, DRAWN FOR A FRAME THAT HOLDS BOTH ENDS (Emilie 2026-08-07:
 * "the near misses should be a bit longer so it's more obvious, like really
 * nearly touching").
 *
 * ⚠ RAISING `armLength` COULD NOT DO THIS, and the measurement is why. On the
 * resting map an unmade pair sits 1,000 to 4,000 units apart, so the FIXED cap
 * binds and the fraction never gets a say: lifting the fractions moved the gaps
 * by 102 units out of 1,388 — invisible. Lifting the fixed cap instead is the
 * thing the resting map must never do, because a proportional arm at 2,800
 * units is a 900-unit limb pointing at something off screen.
 *
 * The fold is the opposite case: it has already closed the empty years, both
 * ends are on the frame, and the whole reason the drawing is there is so one
 * gap can be compared against another. So here the fraction governs and there
 * is no fixed cap. The gap can never reach zero — the fractions are below 0.5
 * by construction, so two arms cannot span the distance however strong the
 * case. Only her signature closes one, and that makes it a thread instead.
 */
export function framedArmLength(shared: number, dist: number): number {
  const s = Math.max(3, Math.min(5, shared))
  const frac = s >= 5 ? 0.46 : s >= 4 ? 0.44 : 0.42
  return dist * frac
}

export function reachPath(
  from: readonly [number, number],
  to: readonly [number, number],
  seed: number,
): string {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const d = Math.hypot(dx, dy) || 1
  const ux = dx / d
  const uy = dy / d
  // A small deterministic bow, so a reach is drawn in the same hand as a thread
  // rather than as a technical ray. Seeded from the pair id (like every other
  // piece of anatomy here), so it never changes under it.
  const bow = ((seed % 100) / 100 - 0.5) * 14
  const px = -uy
  const py = ux
  const p1: [number, number] = [from[0] + ux * REACH_LEN * 0.5 + px * bow, from[1] + uy * REACH_LEN * 0.5 + py * bow]
  const p2: [number, number] = [from[0] + ux * REACH_LEN, from[1] + uy * REACH_LEN]
  return `M ${from[0].toFixed(1)} ${from[1].toFixed(1)} Q ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
}
