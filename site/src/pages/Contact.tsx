import SheetPage from '../components/SheetPage'
import LogoMark from '../components/LogoMark'
import DownloadPill from '../components/ui/DownloadPill'
import ContactLinks from '../components/ui/ContactLinks'
import { BookGlyph, DocGlyph } from '../components/ui/glyphs'
import { RED_LINK } from '../lib/linkStyles'

const BASE = import.meta.env.BASE_URL


// The prose step: 17px is the short-laptop fit, 19px when the room breathes
// (the `tall:` variant, index.css). Class strings stay LITERAL.
const PROSE = 'prose-rag font-serif text-[17px] leading-relaxed tall:text-[19px]'

// THE CONTACT SHEET (the design audit round 2, Emilie's ruling 2026-07-19:
// "design the page from a landscape lens: Say hi + logo on the left, a
// vertical line, the useful links on the other side"). A landscape split
// centred in the frame: LEFT is the person (the cube, the h1 invitation, the
// short script); a hairline divider; RIGHT is the contact (the callback + all
// the ways to reach me: the three socials + the two downloads). No footer
// (the contact IS the content). Below the split breaks it stacks. COPY: the
// script is a NEW draft from Emilie's 2026-07-19 brief, draftCopy until she
// signs; the h1 "Say hi" + callback stay SIGNED.
//
// THE DOOR IS NOW CALLED CONTACT (her ruling 2026-07-28). This page stopped
// being an About the moment the bio moved onto the scrolling landing: what is
// left is a name, an invitation and every way to reach her, which is a contact
// sheet wearing an About sign. The route moved with the label (/about ->
// /contact, redirected forever in lib/routes.ts); the ONE paragraph that stays
// is the human beat before the email address, not a biography.

export default function Contact() {
  return (
    <SheetPage footer={false}>
      <section
        aria-labelledby="contact-heading"
        className="mx-auto flex w-full max-w-[1040px] flex-col gap-8 py-6 md:flex-row md:items-center md:gap-12"
      >
        {/* LEFT · the person. */}
        <div className="md:flex-1">
          <div className="flex items-start justify-between gap-6">
            {/* The room-sign kicker retired at the audit gate (2026-07-19).
                The h1 carries the invitation, SIGNED (2026-07-12). */}
            <h1
              id="contact-heading"
              className="mt-1 text-title font-semibold tracking-[-0.01em] text-[var(--lang-ink)] tall:text-4xl"
            >
              Say hi
            </h1>
            {/* The cube stands in for the face (Emilie's pick, 2026-07-12). */}
            <LogoMark size={64} className="mt-1 w-auto shrink-0 tall:h-[80px]" />
          </div>
          {/* draftCopy: the new script from Emilie's 2026-07-19 brief. */}
          <p className={`mt-5 text-[var(--lang-ink)] tall:mt-6 ${PROSE}`}>
            Hey, I hope you had fun poking around my head. The short version: I'm an architect who got stuck on one
            question, how will this space make someone feel? So I started building tools that treat the answer as data,
            scoring comfort, estimating what a plan does to the mind before anyone builds it. What I'm really after is
            buildings that pay attention to the people inside them, and the room to keep building the tools that get
            them there.
          </p>
        </div>

        {/* The dividing line: vertical between the two panes, horizontal when
            they stack. */}
        <div
          aria-hidden="true"
          className="h-px w-full self-stretch bg-[var(--lang-hairline)] md:h-auto md:w-px"
        />

        {/* RIGHT · the contact (the point of the page). */}
        <div className="md:flex-1">
          {/* The callback completes the landing's split. SIGNED (G4). */}
          <p className={`italic text-[var(--lang-ink)] ${PROSE}`}>
            That's what's on my mind.{' '}
            <a href="mailto:chidiacemilie@gmail.com" className={RED_LINK}>
              What's in yours?
            </a>
          </p>
          {/* The reach-me links: the shared ContactLinks (S6-A, Board 2
              grammar B) — plain text links + app icons under the magnifier,
              the same row the footer wears. The downloads sit below as their
              own chips (book vs document icon), no lens: a chip carries its
              own hover, and the lens belongs to the links. */}
          <ContactLinks className="mt-5" />
          <nav aria-label="Downloads" className="mt-3 flex flex-wrap items-center gap-2">
            <DownloadPill
              href={`${BASE}assets/portfolio-emilie-el-chidiac.pdf`}
              download="Emilie-El-Chidiac-Portfolio.pdf"
              icon={<BookGlyph />}
            >
              THE BOOK (PDF)
            </DownloadPill>
            <DownloadPill
              href={`${BASE}assets/cv-emilie-el-chidiac.pdf`}
              download="Emilie-El-Chidiac-CV.pdf"
              icon={<DocGlyph />}
            >
              CV (PDF)
            </DownloadPill>
          </nav>
        </div>
      </section>
    </SheetPage>
  )
}
