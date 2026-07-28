import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import DownloadPill from '../components/ui/DownloadPill'
import { DocGlyph } from '../components/ui/glyphs'
import { CvIcon, type CvSection } from '../components/ui/cvIcons'
import {
  EDUCATION,
  EXPERIENCE,
  AWARDS,
  SKILLS,
  WRITING_PARTS,
  LANGUAGES,
  FOCUS,
  FOCUS_NOBREAK,
  splitProjectLink,
} from '../data/cv'
import type { CvEntry } from '../data/cv'

const BASE = import.meta.env.BASE_URL

// THE RECORD, ONE COLUMN (the CV pass, Emilie's ruling 2026-07-27). The
// landscape three-column layout is retired: the page reads as one vertical
// column at every width, in the order the PDF prints, so the screen and the
// paper finally say the same thing in the same sequence.
//
// EDUCATION LEADS (her call). The 6-11 second scan spends most of itself just
// under the name, and her most recent role is the one whose project work
// cannot be disclosed, so MaCAD and the 2026 award take that slot instead.
//
// Projects are NAMED IN PLACE under the degree or role that produced them
// (`projects` in data/cv.ts), so there is no SELECTED WORK section and nothing
// repeats. The AWARDS block holds every recognition once, each naming its
// project.
//
// FOCUS is back on the screen. It used to ride the PDF only; it is the line a
// six-second scan actually reads, so it renders in both places now.
//
// The name + title live in the content. THE FOOTER IS BACK (board C2, her
// ruling 2026-07-28): the reach-me links and the PDF download moved off the
// header line and into the frozen footer pill, so the download is reachable
// from any scroll position rather than only from the top, and /cv finally wears
// the same contact row as every other room. It costs the scroller ~56px, which
// she took knowingly. Header string LOCKED: "Emilie El Chidiac | Design
// Technology Architect".

// THE ONE ACCENT (the CV pass, 2026-07-27). The five muted per-section hues
// are RETIRED. They were a CATEGORY system, and 2026 research is consistent
// that multiple accents backfire and that inconsistent header colour reads as
// poor attention to detail. One accent replaces them, and it is the site red,
// on the section RULE.
//
// Why that does not break the sitewide "red means interaction" rule: red here
// is a hairline, never text, and it is IDENTICAL under every section. A link
// is red TEXT, so nothing here can be mistaken for one, and a uniform rule
// encodes no category. The print page carries the same red on the same rule,
// which is what finally makes the two surfaces read as one document.
//
// The glyphs now come from components/ui/cvIcons, shared with the print page,
// and inherit muted ink rather than carrying colour of their own.
function SecTitle({ name, id, children }: { name: CvSection; id: string; children: ReactNode }) {
  // The heading is a LINK to its own section, and clicking it centres that
  // section in the scroller. That is what earns the red: on this site red has
  // always meant "interactive", and these now genuinely are. The href is a
  // real fragment so it works without JS and shows a target on hover; the
  // handler only upgrades the jump from "align to top" to "centre", which is
  // the nicer read on a long record.
  const centre = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(id)
    if (!target) return
    e.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
    // The URL still updates, so the section stays linkable and the back button
    // behaves; replaceState avoids stacking a history entry per click.
    history.replaceState(null, '', `#${id}`)
  }
  return (
    <h2 className="cv-h2 mb-3 border-t border-t-[var(--cv-accent)]">
      <a
        href={`#${id}`}
        onClick={centre}
        className="flex min-h-11 items-center gap-2 py-2.5 font-mono font-semibold tracking-[0.12em] text-[var(--cv-accent)] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
      >
        <span className="inline-flex">
          <CvIcon name={name} />
        </span>
        {children}
      </a>
    </h2>
  )
}

// THE RECORD LINK (board B1/B2, 2026-07-28). NOT the red prose recipe, and
// that is the whole point: the CV pass made red a HAIRLINE on this page and
// never text, so resting red type here would break the one rule that lets the
// section rules carry the accent at all. This is the contact row's grammar
// instead — INK at rest, the interaction hue on hover and focus — so red stays
// a state rather than a colour, and it is the same "a link is ink until you
// touch it" behaviour a reader already met in the footer.
//
// No tap pad. These sit inside dense one-line bullets where a -m-2/p-2 would
// overlap the neighbouring line's hit box; RED_LINK (the running-prose recipe)
// carries none either, for the same reason.
// Two passes to get the weight right. --lang-hairline was INVISIBLE (10% ink
// under 15px serif is a decoration nobody can see, so the mechanic was a
// secret); semibold + a solid rule then overcorrected and the names shouted
// (her review 2026-07-28: "less bold, more of a dashed line, a bit more
// subtle"). This is the settled version: NORMAL weight — ink against the
// bullet's muted grey is already enough to lead the line — and a 1px DASHED
// rule, which reads as "there is more here" rather than as emphasis. Hover
// brings the red and keeps the dash, so touching it firms up the colour, not
// the weight, and the line never shifts.
//
// `relative` IS LOAD-BEARING, and leaving it off cost a real bug (her report,
// 2026-07-28: "I can still scroll past the footer"). The external link carries
// a visually-hidden "(opens in new tab)", and Tailwind's `sr-only` is
// `position: absolute` with no offsets. With no POSITIONED ancestor its
// containing block is the initial containing block, so it is laid out against
// the DOCUMENT rather than inside the scroller — and an `overflow: hidden`
// ancestor cannot clip an absolute child it is not the containing block of.
// The span landed at document y=1791 and stretched <html> to 1792px, giving
// the whole frozen frame 921px of blank scroll underneath it. This is exactly
// why every anchor in ContactLinks is `relative`; measured after the fix, the
// window's scroll range is 0.
const RECORD_LINK =
  'relative text-[var(--lang-ink)] underline decoration-dashed decoration-1 decoration-[var(--lang-ink-muted)] underline-offset-4 transition-colors hover:text-[var(--lang-interaction)] hover:decoration-[var(--lang-interaction)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]'

function Entry({ dates, title, org, notes, projects }: CvEntry) {
  return (
    <div className="cv-entry">
      {/* SERIF, matching the print page and matching the skills labels beside
          it. It rendered in the sans display face only because nothing had
          told it otherwise, which made the block-leading level inconsistent
          with itself on screen while print had it right. */}
      <h3 className="cv-block font-serif font-semibold text-[var(--lang-ink)]">
        {title}{' '}
        <span className="font-normal text-[var(--lang-ink-muted)]">
          · {org}
          {dates ? <span className="tabular-nums"> · {dates}</span> : null}
        </span>
      </h3>
      {notes ? (
        <p className="cv-text cv-prose mt-1 mb-1.5 font-serif text-[var(--lang-ink)]">{notes}</p>
      ) : null}
      {projects?.length ? (
        <ul className="cv-bullets">
          {projects.map(p => {
            // The leading project name becomes the door to its showcase; a
            // bullet that opens with a verb (the duty lines) stays flat text.
            const link = splitProjectLink(p)
            return (
              <li key={p} className="cv-bullet font-serif text-[var(--lang-ink-muted)]">
                <span aria-hidden="true">› </span>
                {link ? (
                  <>
                    <Link to={`/work/${link.id}`} viewTransition className={RECORD_LINK}>
                      {link.name}
                    </Link>
                    {link.rest}
                  </>
                ) : (
                  p
                )}
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

// ONE LABEL GRAMMAR, NOUN-LED (her call 2026-07-28). This pill read "DOWNLOAD
// PDF" and was the only verb-led one of the site's four: /work and /contact
// both say THE BOOK (PDF), /contact also says CV (PDF). Matching them changes
// one label instead of three, and prefixing all four with DOWNLOAD would have
// put the same word at the head of the two pills that sit SIDE BY SIDE on
// /contact, which is the exact collision the two type icons were added to fix
// (S6-A). The verb is carried by the pill, the icon and the `download`
// attribute; the noun is what tells you which of the two files this is, which
// "DOWNLOAD PDF" never did.
//
// THE DOWNLOAD MOVED TO THE FOOTER (board C2, her ruling 2026-07-28). It used
// to ride the header line beside the reach-me links; the reach-me links are now
// the footer's own row (ContactLinks, the same one every other page carries),
// so all this page contributes is the one control that is specifically its own.
// The header line is empty here as a result, which is the point: the name and
// the summary lead, and nothing sits beside them competing.
function CvDownload() {
  return (
    <DownloadPill
      href={`${BASE}assets/cv-emilie-el-chidiac.pdf`}
      download="Emilie-El-Chidiac-CV.pdf"
      icon={<DocGlyph />}
    >
      CV (PDF)
    </DownloadPill>
  )
}

export default function CV() {
  return (
    <SheetPage wide center={false} footer footerInFlow footerTools={<CvDownload />} fadeTop>
      {/* The header shares .cv-measure with the column below, so the name, the
          summary and the whole record hang on one centred axis. The UPDATED
          stamp rides the name line, right, exactly as the print page does. */}
      <div className="cv-measure cv-top pb-7">
        {/* NO UPDATED STAMP HERE (her call, 2026-07-27). It exists to tell a
            reader holding a downloaded PDF which month that file was made in.
            The web page is always current by definition, so the stamp would be
            answering a question nobody is asking. It rides the PRINT header
            only. */}
        <h1 className="cv-name font-semibold tracking-[-0.01em] text-[var(--lang-ink)]">
          Emilie El Chidiac{' '}
          <span className="font-normal text-[var(--lang-ink-muted)]">| Design Technology Architect</span>
        </h1>
        {/* LEAD step: the summary now sits ABOVE body size. It used to match
            the bullets exactly, which gave the most important line on the page
            no hierarchy at all. draftCopy: FOCUS is unsigned. */}
        {/* The break is FORCED here, not left to the measure: the printed page
            starts its second line on "AI-assisted, of course." and the screen
            now does the same. Split on the same named phrase both surfaces
            share, so the two can never drift apart. */}
        <p className="cv-lead mt-3 font-serif text-[var(--lang-ink)]">
          {(FOCUS.split(FOCUS_NOBREAK)[0] ?? '').trimEnd()}
          <br />
          {FOCUS_NOBREAK}
          {FOCUS.split(FOCUS_NOBREAK)[1] ?? ''}
        </p>
      </div>

      {/* ONE centred column, in the PDF's own order (the CV pass): Education
          leads, then Experience, Skills, Awards, Writing. Section rhythm comes
          from .cv-section, entry rhythm from .cv-entry: see the ladder in
          language.css. */}
      <div className="cv-col cv-bottom">
        <section id="education" className="cv-section scroll-mt-24" aria-label="Education">
          <SecTitle name="education" id="education">EDUCATION</SecTitle>
          {EDUCATION.map(e => (
            <Entry key={e.title} {...e} />
          ))}
        </section>

        <section id="experience" className="cv-section scroll-mt-24" aria-label="Experience">
          <SecTitle name="experience" id="experience">EXPERIENCE</SecTitle>
          {EXPERIENCE.map(e => (
            <Entry key={e.org + (e.dates ?? '')} {...e} />
          ))}
        </section>

        <section id="skills" className="cv-section scroll-mt-24" aria-label="Skills">
          <SecTitle name="skills" id="skills">SKILLS</SecTitle>
          {[...SKILLS, { group: 'Languages', items: LANGUAGES }].map(s => (
            <div key={s.group} className="cv-entry cv-text font-serif text-[var(--lang-ink)]">
              {/* Same treatment as a job title or a degree name: whatever leads
                  a block leads every block the same way (her rule). Colon and
                  sentence case match the print page exactly. */}
              {/* Items recede to muted, like bullets, so the bold ink label
                  reads as the leader instead of dissolving into its own list. */}
              <span className="font-semibold">{s.group}:</span>{' '}
              <span className="text-[var(--lang-ink-muted)]">{s.items}</span>
            </div>
          ))}
        </section>

        <section id="awards" className="cv-section scroll-mt-24" aria-label="Awards and recognition">
          <SecTitle name="awards" id="awards">AWARDS &amp; RECOGNITION</SecTitle>
          {/* THE YEAR LEADS THE BLOCK (her call 2026-07-28). This was the one
              section breaking her own rule that whatever leads a block leads
              every block the same way: a degree title, a job title and a
              skills group are all BOLD INK with the rest of the line muted,
              and the awards had it exactly backwards — a muted year in front
              of full-ink text. Now the year is the leader and the citation
              recedes, so all four sections scan identically down the column.
              (The PRINT page sets awards inline as "2026 · text", a different
              grammar entirely, so nothing here puts the two surfaces out of
              step.) */}
          <ul className="grid gap-1">
            {AWARDS.map(a => (
              <li key={a.text} className="grid grid-cols-[46px_1fr] gap-x-3">
                <span className="cv-meta font-mono leading-6 font-semibold text-[var(--lang-ink)] tabular-nums">
                  {a.year}
                </span>
                <span className="cv-text cv-prose font-serif text-[var(--lang-ink-muted)]">{a.text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CERTIFICATES retired here (her review + a unanimous council call);
            the printed book still carries them. */}
        <section id="writing" className="cv-section scroll-mt-24" aria-label="Writing and research">
          <SecTitle name="writing" id="writing">WRITING &amp; RESEARCH</SecTitle>
          {/* The addresses this line NAMES are the addresses it now GOES to
              (board B2). The separator is rebuilt here rather than read off
              the joined string, so the parts stay the single source and the
              printed line and this one can never drift. */}
          <p className="cv-text cv-prose font-serif text-[var(--lang-ink)]">
            {WRITING_PARTS.map((part, i) => (
              <Fragment key={part.link}>
                {i > 0 ? ' · ' : null}
                {part.before}
                {part.to ? (
                  <Link to={part.to} viewTransition className={RECORD_LINK}>
                    {part.link}
                  </Link>
                ) : (
                  <a
                    href={part.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={RECORD_LINK}
                  >
                    {part.link}
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                )}
                {part.after}
              </Fragment>
            ))}
          </p>
        </section>
      </div>
    </SheetPage>
  )
}
