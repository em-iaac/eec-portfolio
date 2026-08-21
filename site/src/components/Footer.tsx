// THE FOOTER LINE (DL-1; the design audit round 2, Emilie 2026-07-19: "the
// footer, while frozen and almost full bleed, should still be a PILL, not
// fully full bleed, to keep the same design language"). A frozen wide glass
// pill floating at the foot of the frame: near-full-width with a breath of
// margin, the same stadium the header pill wears, the name lockup + role on
// the left and the contact links on the right. One height on every page that
// carries it (/contact drops it; its contact IS the content).
//
// The contact row is the shared ContactLinks (S6-A, Board 2 grammar B): plain
// text links + app icons under the magnifier, one thing on every surface.
//
// THE TOOLS SLOT (/cv's board C2, her ruling 2026-07-28). /cv used to hang its
// reach-me row + PDF download on the HEADER line and drop the footer. But this
// footer is a FROZEN band, not an end-of-document moment: bringing it in while
// the header kept its tools would have put the identical contact row on screen
// twice, permanently. So /cv SWAPS instead of adding — the header line goes
// quiet, and the download rides here, beside the links it belongs with, where
// it is reachable from any scroll position instead of only from the top.
// THE TOOL SITS IN THE MIDDLE, not beside the links (her review 2026-07-28).
// Tucked into the right-hand group it read as a fourth contact link; centred it
// reads as what it is, the one thing this page offers that the others don't.
// That needs a real three-column grid from `sm` up (1fr | auto | 1fr), because
// justify-between only centres a middle child when the two flanking ones happen
// to be the same width, and the name lockup and the contact row never are.
// Below `sm` the three stack back into the wrapping flex row.
// It takes no height of its own either way: DownloadPill and a ContactLinks
// link share the same 44px hit box.
// THE OWNERSHIP LINE IS NOT IN HERE (her ruling, rights pass round 2,
// 2026-07-30: "the footline should be not inside the footer but below it as one
// line"). It lives in components/Footline.tsx as its own band underneath this
// pill, which is also how it reaches /contact, a page that drops this footer
// entirely. The pill is back to exactly what it was: name, role, links, tool.
// This file gives back its `pb-3` to the footline below, which now closes the
// frame, so the new band costs 15px of content height rather than 27.
import { type ReactNode } from 'react'
import ContactLinks from './ui/ContactLinks'
import { CreditLink } from './Footline'

export default function Footer({ inFlow = false, tools }: {
  /** THE LANDING'S FOOTER IS NOT CHROME (2026-07-27). On every interior page
   *  this pill is frozen at the foot of the frame, and `.foot-pill` names it
   *  `page-foot` so it holds still through a navigation instead of travelling
   *  with the content. The landing SCROLLS, so its footer sits ~1100px below
   *  the fold: claiming the same name pairs an off-screen box with an
   *  on-screen one, and the browser dutifully flies the footer up across the
   *  whole viewport on the way into /work, and back down on the way out.
   *  In flow, it drops the name and simply cross-fades like the content it
   *  belongs to. The class carries nothing but the name, so nothing is lost. */
  inFlow?: boolean
  /** A page's own control, CENTRED in the pill (/cv's PDF download). */
  tools?: ReactNode
} = {}) {
  return (
    // pb-1, not pb-3: the Footline band below now provides the frame's closing
    // breath, so paying for it twice would cost 27px of content, not 15.
    // THE PHONE'S FOOTER IS A CENTRED STACK (Emilie's ruling 2026-08-02, board
    // option A: "remove the title of the icon, just keep the icons, center
    // everything instead of having them on the right. Should we remove the
    // name? we should test options"). The name stays: dropping it would leave
    // her name nowhere at the foot of any interior page, so a recruiter who has
    // read to the end of /work or /cv would have to scroll back up to see whose
    // portfolio it is.
    //
    // The row-with-two-ends shape was built for a wide pill. At 390 it wrapped
    // to two rows and read as a left thing and a right thing rather than one
    // closing block, and on /cv the PDF made it THREE rows, 161px against 113
    // everywhere else. Centred and stacked, every page is one shape, and the
    // tool simply joins the icon row instead of claiming a row of its own.
    // From sm up nothing changes at all: the same wrapping row, the same
    // three-column grid when a tool is present, the same labels.
    <footer className="shrink-0 px-3 pt-1 pb-1">
      <div
        className={`lang-glass-1 flex flex-col items-center gap-y-1.5 rounded-[var(--r-pill)] px-5 py-2.5 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-x-8 sm:gap-y-1 sm:px-7 ${
          tools ? 'sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-x-4' : ''
        } ${inFlow ? '' : 'foot-pill'}`}
      >
        {/* THE NAME COMES BACK WHERE THERE IS ROOM (Emilie, 2026-08-02, third
            pass: "the footer works great now for the work and cv, but for the
            pages with no download pdf let's have the name back on the right").
            It left the phone footer entirely earlier the same day, which was
            right while every page's row also had to hold a download pill. Only
            /work and /cv actually do. Everywhere else that row is three marks
            and a lot of air, and her name is worth more than the air.
            So below sm it appears ONLY when there is no tool, and the role line
            waits for sm: two lines of lockup in a phone pill would put the name
            back to costing what it cost before. From sm up nothing changed. */}
        <div className="hidden min-w-0 flex-col items-center sm:flex sm:items-start">
          <span className="text-small font-semibold tracking-[0.02em] text-[var(--lang-ink)]">
            EMILIE EL CHIDIAC
          </span>
          <span className="mt-0.5 font-mono text-micro tracking-[0.08em] text-[var(--lang-ink-muted)]">
            DESIGN TECHNOLOGIST
          </span>
        </div>
        {/* Below sm: with a tool, one centred row of tool + marks (that is the
            /work and /cv shape she signed off). Without one, the marks sit LEFT
            and the name RIGHT, which is the row she asked for here. From sm up
            both collapse to `contents` and the long-standing layout resumes. */}
        <div
          className={`flex w-full items-center gap-x-2 sm:contents ${
            tools ? 'flex-wrap justify-center' : 'justify-between'
          }`}
        >
          {/* WITHOUT A TOOL: CREDIT LEFT, MARKS RIGHT (Emilie's correction
              2026-08-02: "I meant not the name but the name as the rights door,
              so the full 2026 Emilie El Chidiac, not keep it below centered...
              also make the rights on the left, and the icon on the right").
              An earlier build read her too literally and put a bare EMILIE EL
              CHIDIAC on the right, which was a second, dumber copy of something
              that was already a link. Her name was always down here, in the
              ownership line, doing two jobs at once: saying whose site this is
              and being the way into the small print. One name in the pill, and
              it reads first. The row is then the whole footer, with nothing
              underneath it. */}
          {!tools && <CreditLink className="min-w-0 shrink sm:hidden" />}
          {tools}
          <ContactLinks iconsOnly className={tools ? 'sm:justify-self-end' : undefined} />
        </div>
        {/* WITH A TOOL, THE CREDIT DROPS TO ITS OWN LINE (her ruling 2026-08-02:
            "the footer of the cv and work, since we have the download pdf stuff
            there, maybe the 2026 Emilie El Chidiac at the bottom in the pill").
            On /work and /cv the row already holds a download pill and three
            marks, so there is no right-hand air to put it in; underneath is the
            only honest place left. Pages with no tool keep it on the row above.
            It is LAST in the DOM as well as last visually, so reading order
            matches. From sm up it is hidden here and the band below carries it,
            which is why either arrangement costs that layout nothing. */}
        {tools ? <CreditLink className="sm:hidden" /> : null}
      </div>
    </footer>
  )
}
