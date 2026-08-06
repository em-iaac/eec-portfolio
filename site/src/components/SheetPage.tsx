import { type ReactNode } from 'react'
import useHeaderCollapse from '../hooks/useHeaderCollapse'
import useIsDesktop from '../hooks/useIsDesktop'
import TitleBlock from './TitleBlock'
import Footer from './Footer'
import Footline from './Footline'
import ReachControls from './reach/ReachControls'
import type { ReachSet } from './reach/verbs'

// THE FROZEN FRAME (rebuilt at the design audit, Emilie's ruling round 2,
// 2026-07-19: "header with all info, the footer full bleed, the content in
// the middle, and the header and footer always freeze even if we scroll").
// The page is exactly one viewport tall and never scrolls itself; the header
// LINE and the footer LINE are frozen flex bands, and the CONTENT scrolls
// inside the middle band when it overflows (a long thought), centring when
// it fits (the auto margins do both without the flex-centre clip). One mode,
// whole site; navigation runs the universal soft crossfade.
// (S3: the title is written by lib/routeHead.ts, one source.)
export default function SheetPage({
  children,
  wide = false,
  pillTools,
  toolsKey,
  center = true,
  footer = true,
  footerTools,
  footerInFlow = false,
  fill = false,
  fadeTop = false,
  reach,
}: {
  children: ReactNode
  /** /work + /cv run full-width (cap 1920); other pages keep the column. */
  wide?: boolean
  /** A page's own tools on the header line, right of the pill. */
  pillTools?: ReactNode
  /** see TitleBlock: the tools' identity, so unlike sets never morph. */
  toolsKey?: string
  /** Content centres vertically in the middle band (auto margins); a
      document that reads top-first can opt out. */
  center?: boolean
  /** Pages whose contact/identity already lives elsewhere drop the footer to
      kill repetition (/contact IS the contact sheet, so its middle band
      already holds every link the footer would repeat). */
  footer?: boolean
  /** A page's own control inside the footer's right-hand group, beside the
      contact links (/cv's PDF download; board C2, 2026-07-28). Ignored when
      `footer` is false. */
  footerTools?: ReactNode
  /** THE FOOTER SCROLLS WITH THE RECORD (her review 2026-07-28, /cv). The
      frozen band is right for a page you look AT; /cv is a page you read
      THROUGH, and a permanently parked pill under a long document is a wall,
      not a frame. In flow it renders as the last thing inside the scroller,
      so you reach the end of the record and the contact row is simply there.
      It drops the `page-foot` view-transition name for the same reason the
      landing's does: a name shared between a scrolled-away box and a frozen
      one makes the browser fly it across the viewport on the way out.
      `-mx` cancels the scroller's own gutter so the pill keeps the exact inset
      the frozen one has; `mt-auto` parks it at the foot if the content is ever
      short enough not to overflow. */
  footerInFlow?: boolean
  /** The content FILLS the middle band (so its own children can scroll
      inside it, like /cv's per-column scroll) instead of centring. */
  fill?: boolean
  /** A sticky band of glass at the top of the scroller: content passes under
      it and blurs rather than being sliced at a hard edge. Opt-in per page,
      because it costs a compositing layer and only long documents need it. */
  fadeTop?: boolean
  /** THE ROOM'S OWN VERBS, in the thumb arc (the phone pass, 2026-08-03;
      components/reach/). A tab on the right edge that opens a vertical list of
      the things you are in this room to do. Her pick from four built and tried
      on her own phone. A room with nothing to do passes nothing and shows
      nothing: that is what stops it becoming a tab bar. The DOORS are not in
      here and never will be; they stay in the pill. */
  reach?: ReachSet
}) {
  // EVERY WIDTH NOW, reading whichever element actually scrolls (Emilie's
  // ruling 2026-08-06: the pill and the search should behave on every page the
  // way they do on the landing). Below lg the frame is an ordinary tall
  // document and the window moves; from lg up it is `h-dvh` + `overflow-hidden`
  // and `#main` moves instead. It used to be phone-only because a window
  // listener simply never fires against the frozen frame.
  const isDesktop = useIsDesktop()
  const [collapsed, openHeader] = useHeaderCollapse(true, isDesktop ? 'main' : 'window')
  return (
    // `relative` FIXES A REAL SCROLL BUG (her report, 2026-07-30: "sometimes i
    // can scroll past the footer and footline"). Reproduced on /rights with the
    // drawers open: the whole frame scrolled 819px, taking the header off screen
    // and leaving white below the footline.
    //
    // The cause was `.sr-only`, which is `position: absolute`. With no
    // positioned ancestor, such a span resolves its containing block to the
    // INITIAL one (the viewport), not to this frame. It therefore escapes this
    // frame's `overflow-hidden` and contributes to the DOCUMENT's scrollable
    // height. On a long page the "(opens in new tab)" spans sit far down the
    // article, so the document grew to exactly the lowest one (1690px against
    // an 871px viewport) and the window became scrollable.
    //
    // Making the frame a containing block puts those spans back inside the box
    // that clips them. It cannot move anything visually: this element already
    // sits at the viewport's origin at exactly the viewport's size, so every
    // descendant that previously resolved against the viewport now resolves
    // against an identical box. It also immunises every OTHER page from the
    // same trap, which is why it is fixed here and not in Rights.tsx.
    // THE FRAME UNFREEZES ON PHONES (Emilie's ruling 2026-08-02, the phone
    // pass, from a drawn before/after). A phone browser only slides its address
    // bar and toolbar away when the DOCUMENT scrolls. This frame is `h-dvh` +
    // `overflow-hidden` with the scrolling done by an inner element, so the
    // document never moved a pixel and both bars sat there for the whole visit:
    // roughly 100px of permanent chrome on the screen with the least room.
    // Measured on /cv at 390x844: document.scrollHeight === clientHeight === 844
    // while main.scrollHeight was 3585 inside a 768px box.
    //
    // Below lg the frame is now an ordinary tall document: the header STICKS
    // (the same `sticky top-0 z-40` wrapper the landing has used since
    // 2026-07-27, so this is the site's own grammar, not a new one) and the
    // footer simply ends the page. From lg up nothing changes at all: the
    // frozen frame is what the named-chrome transitions stand on (DL amendment
    // 23), and a desktop browser has no chrome to reclaim.
    //
    // `relative` STAYS in both, and is still load-bearing (see below).
    <div className="relative flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[var(--lang-interaction)] focus:px-4 focus:py-2 focus:font-mono focus:text-nav focus:text-[var(--lang-ground)]"
      >
        Skip to content
      </a>
      {/* The sticky wrapper is PHONE ONLY and is copied verbatim from the
          landing (LandingCover), including `pointer-events-none`: the band is
          full width and content scrolls under it, so without that it would eat
          every tap in the ~70px it covers. The pill re-enables its own events.
          From lg up it is `static`, which is exactly what it was before.

          THE PILL READS THE SCROLL HERE TOO (Emilie's ruling 2026-08-04): down
          collapses it to the mark, up opens it again, exactly as the landing has
          done since 2026-07-27. hooks/useHeaderCollapse.ts carries the why, the
          reduced-motion floor and why it is phone-only. `onFocusCapture` opens
          the pill whenever focus lands inside it, because a keyboard cannot
          scroll up to get its nav back. */}
      <div
        className="frame-head pointer-events-none sticky top-0 z-40 lg:static lg:z-auto"
        onFocusCapture={openHeader}
      >
        <TitleBlock tools={pillTools} toolsKey={toolsKey} collapsed={collapsed} onExpand={openHeader} />
      </div>
      {/* `relative` HERE IS THE ACTUAL FIX for "sometimes i can scroll past the
          footer" (2026-07-30, round 2 of the report). Putting it only on the
          frame above was not enough: it moved the overflow off the DOCUMENT but
          left it on the FRAME, which `overflow-hidden` still makes a scroll
          container (measured with /rights' drawers open: frame scrollHeight
          1259 against a 700 client height, and `frame.scrollTop = 9999` moved
          it 559px). `overflow: hidden` clips, it does not refuse to scroll.
          The escaping elements are `.sr-only` spans, which are
          `position: absolute`, and they belong to THIS scroller's content, so
          THIS is their correct containing block. With it, they scroll along
          with the text they annotate and the frame's overflow drops to 0. */}
      <main
        id="main"
        tabIndex={-1}
        // `overflow-y-auto` is now the DESKTOP frame's scroller only. On a
        // phone this element must not scroll at all, or the document still
        // will not, which is the whole point of the change.
        className="no-scrollbar relative flex flex-1 flex-col px-5 outline-none sm:px-8 lg:overflow-y-auto"
      >
        {fadeTop ? <div aria-hidden="true" className="scroll-scrim" /> : null}
        <div
          // `page-rise` carries the phone's 8px entrance lift (language.css).
          // It lives HERE and not on <main> because a transform makes an element
          // the containing block for fixed descendants, and /thoughts keeps its
          // whole world (.nw-stage) fixed inside main — which collapsed the map
          // to zero height. Nothing inside this wrapper is fixed, so it is safe.
          className={`page-rise mx-auto w-full ${wide ? 'max-w-[1920px]' : 'max-w-5xl'} ${
            fill ? 'flex min-h-0 flex-1 flex-col' : center ? 'my-auto' : ''
          }`}
        >
          {children}
        </div>
        {/* THE FOOTLINE FOLLOWS ITS FOOTER (rights pass round 2, 2026-07-30).
            When the pill scrolls in flow the ownership line scrolls with it, so
            you reach the end of the document and the whole closing block is
            simply there; when the pill is frozen the line is frozen under it.
            A line stranded at the foot of the frame while its pill scrolled
            away would read as a stray sentence. */}
        {footer && footerInFlow && (
          <div className="-mx-5 mt-auto sm:-mx-8">
            <Footer inFlow tools={footerTools} />
            <Footline hideOnPhone />
          </div>
        )}
      </main>
      {footer && !footerInFlow && <Footer tools={footerTools} />}
      {/* IT RENDERS EVEN WHEN THE PILL DOES NOT. /contact drops the footer
          because its contact IS the content, but it is also the only page that
          collects anything, so the one line saying where a message goes has to
          survive there. This is why the footline is not part of Footer. */}
      {/* hideOnPhone tracks whether a FOOTER PILL is on this page: where there
          is one, the credit rides inside it below sm (Footer.tsx). /contact
          drops the pill, so there it stays a band at every width. */}
      {!(footer && footerInFlow) && <Footline hideOnPhone={footer} />}
      <ReachControls set={reach} />
    </div>
  )
}
