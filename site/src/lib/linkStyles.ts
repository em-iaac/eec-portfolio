// THE ONE RED-LINK RECIPE (#20 sweep, 2026-07-26).
//
// The interaction paint was copied verbatim into six files and near-copied
// into three more, which is how the 404's hit box drifted out of step with
// everything else. It lives here now. Three names, three distinct jobs:
//
//   RED_LINK      the paint alone. For links inside running prose, where the
//                 line box already carries the rhythm and nothing may disturb it.
//   RED_LINK_ROW  the paint plus a transparent >= 44px inline-flex hit box.
//                 For STANDALONE links (a mono row, a 404's way home). The
//                 touch floor is a FLOORS rule, not a preference.
//
// (RED_LINK_TAP retired 2026-08-07, unused. It was the red paint plus a
// -m-2/p-2 pad, and the pad was the problem: a FIXED 16px on a font-sized
// inline box lands at 30-40px, never 44. Pillar was its last caller and moved
// to RED_LINK_ROW on 2026-08-05 for exactly that reason — the note recording
// it is still at the top of pages/Pillar.tsx. QUIET_LINK_TAP below keeps the
// same pad on purpose and the reason it is allowed to is written there.)
//
// Tailwind v4 scans this file, so the strings stay LITERAL and must never be
// built by concatenating fragments of class names.
export const RED_LINK =
  'text-[var(--lang-interaction)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'

export const RED_LINK_ROW = `inline-flex min-h-11 min-w-11 items-center ${RED_LINK}`

// The one DELIBERATE near-variant: an ink-coloured underlined link that keeps
// the red focus ring. It rides on a photograph's caption strip inside the work
// overlay, where red would compete with the picture; the ring stays red because
// the focus ring is one grammar sitewide.
export const INK_LINK =
  'text-[var(--lang-ink)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'

// THE QUIET LINK, for a NAME INSIDE A SENTENCE (Emilie, 2026-08-05). It was
// `RECORD_LINK`, defined privately in pages/CV.tsx and used only there, and she
// ruled it the better of the two: "project links do not match the CV's link
// design and I prefer the CV's, more subtle."
//
// THE RULE THAT SPLITS THE TWO, and it is the CV's own logic:
//   RED_LINK*  is a CALL TO ACTION. It asks to be pressed and it should look
//              like it: "What's in yours?", a door row, the 404's way home.
//   QUIET_LINK is a NAME that happens to be a door. Ink at rest, so the
//              sentence keeps its rhythm, with a thin dashed muted underline
//              saying there is somewhere to go. It turns red on hover and focus,
//              so the interaction colour is still one grammar sitewide.
//
// Running prose is the whole reason: a note that names four projects in red is
// four things pulling the eye off the argument, on the one page whose job is to
// be read.
//
// `relative` is load-bearing and inherited from the CV: without it an absolute
// focus artifact escapes its scroller and stretches the document (CV.tsx
// carries the full account, it cost 921px of blank scroll once).
export const QUIET_LINK =
  'relative text-[var(--lang-ink)] underline decoration-dashed decoration-1 decoration-[var(--lang-ink-muted)] underline-offset-4 transition-colors hover:text-[var(--lang-interaction)] hover:decoration-[var(--lang-interaction)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]'

// The quiet paint plus the same -m-2/p-2 pad RED_LINK_TAP uses. The CV's own
// bullets deliberately go UNPADDED (they are dense enough that pads would
// overlap the neighbouring line), but a link in a note's paragraph needs the
// 44px floor, and that floor is a FLOORS rule rather than a preference. Swapping
// the paint may never quietly drop the target.
export const QUIET_LINK_TAP = `-m-2 p-2 ${QUIET_LINK}`
