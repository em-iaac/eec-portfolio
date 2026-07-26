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
//   RED_LINK_TAP  the paint plus a -m-2/p-2 tap pad. For links inside prose
//                 that still need a bigger target: inline-flex would break the
//                 line box, so the pad grows outward and the layout is unmoved.
//
// Tailwind v4 scans this file, so the strings stay LITERAL and must never be
// built by concatenating fragments of class names.
export const RED_LINK =
  'text-[var(--lang-interaction)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'

export const RED_LINK_ROW = `inline-flex min-h-11 min-w-11 items-center ${RED_LINK}`

export const RED_LINK_TAP = `-m-2 p-2 ${RED_LINK}`

// The one DELIBERATE near-variant: an ink-coloured underlined link that keeps
// the red focus ring. It rides on a photograph's caption strip inside the work
// overlay, where red would compete with the picture; the ring stays red because
// the focus ring is one grammar sitewide.
export const INK_LINK =
  'text-[var(--lang-ink)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'
