import SheetPage from '../components/SheetPage'
import LogoMark from '../components/LogoMark'

const RED_LINK =
  'text-[var(--lang-interaction)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'

// The prose step: 17px is the short-laptop fit, 19px when the room is tall
// enough to breathe (the `tall:` variant, index.css). Class strings stay
// LITERAL — Tailwind's scanner cannot see concatenated names.
const PROSE = 'font-serif text-[17px] leading-relaxed tall:text-[19px]'

// THE CONTACT SHEET (rebuilt from the G3 person page, 2026-07-12; every gate
// decided live by Emilie in-session: layout = the stack, the constellation
// cube instead of a photo, NOW dropped from this page, bio + h1 SIGNED).
// ONE SCREEN, NO SCROLL (her amendment, same session): the sheet centres on
// BOTH axes ("let it breathe") and nothing lives below the fold; on tall
// viewports the whole sheet steps up one size so a desktop feels inhabited.
// The h1 is the invitation ("Say hi", hers) so the room sign and the title
// stop repeating each other; the CV pointer retired (the header's CV door
// covers it); and the page carries NO pill row of its own — THE FOOTER IS
// THE CONTACT ROW (her pick): name lockup + EMAIL/LINKEDIN/GITHUB sit right
// below the invitation as the sheet's signature line, so the links never
// repeat. No glass on the page itself. NOW still emits from data/now.ts
// into the registry (the CV's red live tip).
export default function About() {
  return (
    <SheetPage title="About" footerCompact>
      <div className="flex h-full flex-col justify-center py-4">
        <section aria-labelledby="about-heading" className="mx-auto w-full max-w-[62ch] tall:max-w-[66ch]">
          <div className="flex items-start justify-between gap-6">
            <div>
              {/* The room sign, SIGNED (G4, 2026-07-12). */}
              <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--lang-ink-muted)] uppercase">
                ABOUT · THE PERSON
              </p>
              {/* The h1 carries the invitation, SIGNED (2026-07-12). */}
              <h1
                id="about-heading"
                className="mt-3 text-3xl font-semibold tracking-[-0.01em] text-[var(--lang-ink)] tall:text-4xl"
              >
                Say hi
              </h1>
            </div>
            {/* The cube stands in for the face (Emilie's pick over the photo
                thumbnail, 2026-07-12): the mind, not the headshot. The CSS
                height beats the SVG attribute, so one mark serves both
                compositions. */}
            <LogoMark size={64} className="mt-1 w-auto shrink-0 tall:h-[88px]" />
          </div>

          {/* The short bio, SIGNED in-session (option 2, "the point in
              time", 2026-07-12). Biennale phrasing holds the calibration
              ceiling ("a project featured at"). */}
          <p className={`mt-5 text-[var(--lang-ink)] tall:mt-8 ${PROSE}`}>
            This whole site is a map of my head; this page is where it shakes your hand. The short version: architect
            (towers in Dubai, exhibitions in Kuwait, a project featured at the Venice Biennale), then one question
            rewired everything: how will this space make someone feel? I've been building tools that treat that question
            as data ever since, scoring comfort, estimating what a plan does to the mind. The tools keep changing. The
            question won't.
          </p>

          <div id="contact" className="mt-5 border-t-[0.5px] border-[var(--lang-hairline)] pt-4 tall:mt-8 tall:pt-7">
            {/* The callback line completes the landing's split ("this is
                what's on my mind · what's in yours?"). SIGNED (G4). */}
            <p className={`italic text-[var(--lang-ink)] ${PROSE}`}>
              That's what's on my mind. What's in yours?
            </p>
            {/* The invitation, INTERIM (draftCopy, Emilie 2026-07-12): the
                Session-11 wording was shortened to hold the one-screen
                promise on 768p laptops; the page's whole text gets its own
                revisit session. The mailto is the page's one action; the
                footer right below carries the EMAIL/LINKEDIN/GITHUB pills. */}
            <p className={`mt-3 ${PROSE}`}>
              If your team is trying to make buildings answer harder questions,{' '}
              <a href="mailto:chidiacemilie@gmail.com" className={RED_LINK}>
                let's talk
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </SheetPage>
  )
}
