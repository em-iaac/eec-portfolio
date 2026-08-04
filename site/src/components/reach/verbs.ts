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

// TWO KINDS OF DRAWER, and the distinction is the whole system (Emilie's ruling
// 2026-08-04, from her own ask: "we need to find a system for the drawer to
// always say what filter we are at, so if we pressed a year it should say the
// year we jumped at, or in the cv it should say the title we went to").
//
// THE RULE: the drawer is the room's INDEX. It tells you where you are, and
// takes you anywhere else in the room.
//
//   A PLACE DRAWER  the rows are positions inside this room and you are at one
//                   of them — /cv's five sections, the map's seven years. It
//                   sets `at`, so the collapsed tab READS OUT the current
//                   position and you never have to open it to know where you
//                   are. The matching row also carries `active`.
//
//   AN EXIT DRAWER  the rows are ways OUT of the room — a thought note's
//                   previous / next / in time / all thoughts. There is no
//                   position to report, because you are on the note itself. It
//                   leaves `at` undefined and the tab keeps its handle.
//
// The distinction matters because the alternative was to give every drawer a
// readout, which on an exit drawer means inventing a state that does not exist.
// A control that reports a fiction is worse than one that reports nothing.
export interface ReachSet {
  /** The group's accessible name, e.g. "Filter by lens". */
  label: string
  /** What the collapsed side pill shows when there is no position to report:
   *  the room's verb in one word. */
  handle: string
  /** THE READOUT. The label of the row you are currently at, on a PLACE drawer
   *  only. When present the tab shows this instead of `handle`, live, however
   *  you got there — pressing a row, scrolling, or flicking. Leave undefined on
   *  an exit drawer. */
  at?: string
  verbs: ReachVerb[]
}
