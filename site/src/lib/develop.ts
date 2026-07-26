// The develop ledger (Session 8 extraction; the scroll-scrubbed plate
// develop retired with the sheet tier at G1). A module-level Set behind the
// one-shot develop (useDevelopOnce), so a print stays developed across route
// returns within the visit. Keys are image identities ('slug/name'); a
// fresh page load starts the visit over.
const developed = new Set<string>()

export const hasDeveloped = (key: string): boolean => developed.has(key)

export const markDeveloped = (key: string): void => {
  developed.add(key)
}

// THE MIND-GRAPH DRAW-IN, once per visit (2026-07-26). Same ledger, same
// reason: the cover's 3.4s sequenced draw-in is an ARRIVAL ceremony, and it
// was replaying in full every single time a visitor came back to the landing
// from a room. That is expensive (stroke-dashoffset repaints the whole SVG
// every frame, and it ran on top of the page transition) and, worse, it makes
// the site look like it is rebuilding itself instead of being one continuous
// place. It plays on the FIRST landing of a visit; every return shows the
// finished drawing at once. A fresh page load starts the visit over.
let mindDrawn = false

export const hasMindDrawn = (): boolean => mindDrawn
export const markMindDrawn = (): void => {
  mindDrawn = true
}

// THE OVERTURE, once per visit (2026-07-26). Same ledger, same reason as the
// draw-in above: an ENTRANCE that replays every time you come home is the
// opposite of the site being one continuous place. It plays on the first
// landing of a visit; every return renders the column already in place.
let overtured = false

export const hasOvertured = (): boolean => overtured
export const markOvertured = (): void => {
  overtured = true
}
