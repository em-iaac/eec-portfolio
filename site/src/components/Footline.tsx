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

/** THE CREDIT ITSELF, extracted 2026-08-02 so the footer can carry it on a
 *  phone without a second copy of signed wording. Her ruling that day (board
 *  option B): below sm the ownership line and the contact marks share ONE row
 *  inside the footer pill instead of standing as two thin bands, 74px of pill
 *  above 27px of line. The sentence is unchanged and still links to /rights;
 *  only where it sits changed. On /contact, which has no footer pill, the band
 *  below is still the only thing carrying it. */
export function CreditLink({ className = '' }: { className?: string }) {
  return (
    // The 44px touch floor rides an `after:` pseudo-element rather than a
    // min-height, so the line stays as short as its type. The same trick the
    // pill's links use, for the same reason: the floor is a FLOORS rule, and
    // the height is paid on every page.
    <Link
      to="/rights"
      viewTransition
      className={`relative font-mono text-micro leading-none tracking-[0.08em] text-[var(--lang-ink-muted)] no-underline hover:text-[var(--lang-interaction)] after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)] ${className}`}
    >
      {/* SHORTER ON A PHONE, BUT THE YEAR STAYS EVERYWHERE (Emilie, 2026-08-02,
          in two passes: first "could we just have the name and the c in the
          phone version", then "let's have the year on all versions"). So what
          the phone drops is the reserved-rights clause only. That is the sound
          half to drop: since Berne, copyright needs no notice at all to exist,
          so the clause is convention rather than requirement, while the year is
          the part that actually dates the claim.
          ONE string with one optional clause, not two strings, so the signed
          wording can never drift from a phone variant. */}
      © {new Date().getFullYear()} Emilie El Chidiac.
      <span className="hidden sm:inline"> All rights reserved.</span>
    </Link>
  )
}

export default function Footline({ hideOnPhone = false }: { hideOnPhone?: boolean }) {
  // `flex justify-center`, not `text-center`: a block wrapping an inline-block
  // adds ~10px of descender space under the line box, which on a band this
  // small was a third of its height. A flex container has no line box.
  return (
    // THE 6px OVERFLOW, FOUND (her long-standing report, closed 2026-08-02).
    // The band is 21px: 9px of type plus this 12px of padding. The touch floor
    // below is a 44px pseudo CENTRED on the 9px line, so it reaches 22px either
    // side of the type's middle and its bottom edge lands 5.5px past the band.
    // That was invisible for as long as the frame was `overflow-hidden` and
    // simply clipped it. The moment the document started scrolling on phones it
    // became a real 6px of scroll on a page with nothing else to scroll: the
    // "6px frame overflow" she has been reporting since the rights pass.
    // Measured on /rights at 390x844: document 850 against a 844 viewport, and
    // this element's own scrollHeight 27 against its 21px box.
    // Six more pixels of padding is the whole fix, and it is spent ONLY where
    // the document scrolls. From lg up the frame still clips and the content
    // band keeps every pixel this file's opening note fought for.
    // `hideOnPhone` is passed by every surface that ALSO renders the footer
    // pill: below sm the credit rides inside that pill (her ruling 2026-08-02),
    // and a band underneath repeating it would be the two-band problem again.
    // /contact drops the pill and passes nothing, so the band is still its only
    // route to the small print.
    <div
      className={`shrink-0 justify-center px-3 pb-[18px] lg:pb-3 ${
        hideOnPhone ? 'hidden sm:flex' : 'flex'
      }`}
    >
      <CreditLink />
    </div>
  )
}
