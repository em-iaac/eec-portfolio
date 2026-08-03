// THE ROOM'S VERBS (Emilie's ruling 2026-08-03: build option B and option D
// "really push them to be as functional and intuitive and detail oriented as
// possible... make both not the doors, but rather again what the room needs.
// and what would a user need to do or might want to do while in this room").
//
// THE MEASUREMENT BEHIND IT. At 390x844, every control the site owns lives in
// the top 79px: the nav pill at y=12, /work's filter row at y=88, /cv's five
// section headings scattered down 3565px of document. The bottom 79px, where a
// thumb rests, holds a footer and nothing else. /thoughts is the one room that
// already moved its controls to the foot, and it is the one room that reads
// one-handed.
//
// THE RULE THAT KEEPS THIS FROM BECOMING A TAB BAR, and the answer to her own
// worry ("I don't think it will be nice to add this"): reach controls are NOT
// chrome. They are the room's tools. A room with no verbs shows nothing at all,
// which is why /contact and /rights never get one. The doors stay in the pill
// at the top where they have always been.
import type { ReactNode } from 'react'

export interface ReachVerb {
  /** Stable key; also the value the shells use for the active mark. */
  id: string
  /** The full name, always the accessible name. */
  label: string
  /** The face wording where the full name will not fit. Defaults to `label`. */
  short?: string
  /** A route (rendered as a Link) or a press (rendered as a button). */
  to?: string
  onPress?: () => void
  /** The one currently true, e.g. the lens being filtered by. */
  active?: boolean
  /** A small glyph that rides ahead of the wording (the lens ticks). */
  mark?: ReactNode
}

export interface ReachSet {
  /** The group's accessible name, e.g. "Filter by lens". */
  label: string
  /** What the collapsed side pill shows: the room's verb in one word. */
  handle: string
  verbs: ReachVerb[]
}
