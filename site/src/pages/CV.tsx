import { type ReactNode } from 'react'
import SheetPage from '../components/SheetPage'
import DownloadPill from '../components/ui/DownloadPill'
import ContactLinks from '../components/ui/ContactLinks'
import { DocGlyph } from '../components/ui/glyphs'
import { CvIcon, type CvSection } from '../components/ui/cvIcons'
import { EDUCATION, EXPERIENCE, AWARDS, SKILLS, WRITING, LANGUAGES, FOCUS, FOCUS_NOBREAK } from '../data/cv'
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
// The name + title live in the content; the reach-me links + the download ride
// the header line; the footer stays retired here (it just repeated the
// contact). Header string LOCKED: "Emilie El Chidiac | Design Technology
// Architect".

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
          {projects.map(p => (
            <li key={p} className="cv-bullet font-serif text-[var(--lang-ink-muted)]">
              <span aria-hidden="true">› </span>
              {p}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

// The reach-me links + the download on the header line (pillTools). The links
// are now the shared ContactLinks (S6-A, Board 2 grammar B): the /cv links used
// to sit red-at-rest and unlensed; they join the sitewide row (ink at rest,
// red on hover, the magnifier under them) so contact reads as one thing on
// every surface. The download leads with the document mark.
function CvHeaderTools() {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <ContactLinks />
      <DownloadPill href={`${BASE}assets/cv-emilie-el-chidiac.pdf`} download="Emilie-El-Chidiac-CV.pdf" icon={<DocGlyph />}>
        DOWNLOAD PDF
      </DownloadPill>
    </div>
  )
}

export default function CV() {
  return (
    <SheetPage wide center={false} footer={false} fadeTop pillTools={<CvHeaderTools />} toolsKey="cv">
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
          <ul className="grid gap-1">
            {AWARDS.map(a => (
              <li key={a.text} className="grid grid-cols-[46px_1fr] gap-x-3">
                <span className="cv-meta font-mono leading-6 text-[var(--lang-ink-muted)] tabular-nums">{a.year}</span>
                <span className="cv-text cv-prose font-serif">{a.text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CERTIFICATES retired here (her review + a unanimous council call);
            the printed book still carries them. */}
        <section id="writing" className="cv-section scroll-mt-24" aria-label="Writing and research">
          <SecTitle name="writing" id="writing">WRITING &amp; RESEARCH</SecTitle>
          <p className="cv-text cv-prose font-serif text-[var(--lang-ink)]">{WRITING}</p>
        </section>
      </div>
    </SheetPage>
  )
}
