// THE FOOTLINE (her ruling, round 2 of the rights pass, 2026-07-30):
// "the footline should be not inside the footer but below it as one line",
// and it must NOT carry the page's name: "Just c Emilie El Chidiac. All Rights
// Reserved."
//
// So the ownership claim stops being a fourth item competing inside the glass
// pill and becomes its own band underneath it. That is worth the trade it
// makes: round 1 spent ten measurements finding the one slot in the pill where
// a link cost zero pixels, and the answer was "the name line, with its words
// hidden on a phone". A line of its own needs none of that arithmetic, reads
// the way a copyright line has read on every website since 1995, and says the
// ownership thing without naming a page nobody came for.
//
// WHAT IT COSTS, MEASURED. The interior frame is exactly one viewport tall, so
// a band below the pill takes its height out of the CONTENT band on every
// page: 27px raw. The Footer gives back its own `pb-3` in exchange (this line
// now closes the frame, so the pill no longer needs to), which nets it to
// 15px. Measured on /work at 871px: content 713 -> 698.
//
// IT RENDERS ON /contact TOO, which the footer pill does not (that page's
// contact IS its content, so the pill would repeat it). Her round-2 ruling
// removed the data note from under SEND, and without this line the one page
// that actually collects a visitor's email would offer no route to the page
// explaining where it goes. A band that is not part of the pill can appear
// where the pill does not, which is the whole reason this is its own file.
//
// THE YEAR AUTO-UPDATES, and the caution against that in round 1 was wrong for
// this codebase. The worry was a hydration mismatch: prerendered HTML carries
// the BUILD year, the client renders the CURRENT year, React compares them and
// complains every January. But main.tsx mounts with `createRoot`, not
// `hydrateRoot`, so React discards the prerendered body and renders fresh.
// There is no comparison to fail. `new Date()` is already the established
// pattern here anyway (data/cv.ts's UPDATED does the same for the book).
//
// draftCopy: her wording, unsigned.
import { Link } from 'react-router-dom'

export default function Footline() {
  // `flex justify-center`, not `text-center`: a block wrapping an inline-block
  // adds ~10px of descender space under the line box, which on a band this
  // small was a third of its height. A flex container has no line box.
  return (
    <div className="flex shrink-0 justify-center px-3 pb-3">
      {/* The 44px touch floor rides an `after:` pseudo-element rather than a
          min-height, so the band stays as short as its one line of type. The
          same trick the pill's links use, for the same reason: the floor is a
          FLOORS rule, and the height is paid on every page. */}
      <Link
        to="/rights"
        viewTransition
        className="relative font-mono text-micro leading-none tracking-[0.08em] text-[var(--lang-ink-muted)] no-underline hover:text-[var(--lang-interaction)] after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
      >
        © {new Date().getFullYear()} Emilie El Chidiac. All rights reserved.
      </Link>
    </div>
  )
}
