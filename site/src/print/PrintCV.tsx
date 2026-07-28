// G5 · THE STANDALONE CV PDF (REDESIGN-SPEC §9). Fully plain and ATS-safe:
// ONE visual column, ONE text column (the PDF text layer reads top to
// bottom in DOM order), no letter-spaced name, real "Aug 2024 - Present"
// dates in the embedded text, current email, expanded certificate names,
// the §9 skill groups ("Rhino Compute" spelled with a space once, in
// the data). The one non-plain touch is the UPDATED line. The screen
// kicker "CV · THE RECORD" never prints (G4). Same data as /cv: cv.ts is
// the single source, so the PDF can never go stale.
//
// THE CV PASS (2026-07-27). Section order is now EDUCATION > EXPERIENCE >
// SKILLS > AWARDS & RECOGNITION > WRITING & RESEARCH, matching
// the screen page exactly; render-pdfs.mjs asserts that order out of the
// extracted text layer. Education leads (Emilie's ruling). Projects are named
// in place under the degree or role that produced them, so there is no
// SELECTED WORK section and no line is said twice. FOCUS is now a summary
// under the header rather than an italic tagline: it is the line a six-second
// scan actually reads.
import {
  EDUCATION,
  EXPERIENCE,
  AWARDS,
  SKILLS,
  WRITING,
  LANGUAGES,
  FOCUS,
  FOCUS_NOBREAK,
} from '../data/cv'
import type { CvEntry } from '../data/cv'
import { CvIcon, type CvSection } from '../components/ui/cvIcons'
import A4Page from './A4Page'

// Section heading + its glyph, the same five glyphs the screen page uses. The
// label is always plain text; the glyph is an SVG path and contributes nothing
// to the extracted text layer, so the ATS reading is unchanged.
function Sec({ name, children }: { name: CvSection; children: string }) {
  return (
    <h2>
      <CvIcon name={name} size={11} />
      {children}
    </h2>
  )
}

// The summary, with its one unbreakable phrase held together. The text layer
// is unchanged: a nowrap span emits the same characters in the same order.
function Lead() {
  const [before, after] = FOCUS.split(FOCUS_NOBREAK)
  return (
    <>
      {before}
      <span style={{ whiteSpace: 'nowrap' }}>{FOCUS_NOBREAK}</span>
      {after}
    </>
  )
}

// One record. Bullets are marked with a chevron (her pick): every bullet is
// written to fit ONE printed line, so the marker never has to align a wrap.
// The marker is a plain character in the text layer, so extraction is
// unaffected; the indent is a text indent, never a list or a table.
function Record({ dates, title, org, notes, projects }: CvEntry) {
  return (
    <div className="pr-entry">
      <p>
        <strong>{title}</strong> · {org}
        {dates ? ` · ${dates}` : ''}
      </p>
      {notes ? <p className="pr-notes">{notes}</p> : null}
      {projects?.map(p => (
        <p key={p} style={{ color: 'var(--pr-ink-muted)', paddingLeft: '3.2mm', textIndent: '-3.2mm' }}>
          {'› '}
          {p}
        </p>
      ))}
    </div>
  )
}

export default function PrintCV() {
  return (
    <A4Page orientation="portrait">
      <div className="pr-ats">
        {/* The locked header string: name | role, one line, zero tracking. The
            UPDATED stamp rides the same line, small and right (her call), so it
            stops spending a line of its own. It sits AFTER the name in the DOM,
            so the text layer still reads the name first. */}
        <h1>
          Emilie El Chidiac{' '}
          <span style={{ fontWeight: 400, color: 'var(--pr-ink-muted)' }}>| Design Technology Architect</span>
        </h1>
        {/* draftCopy: the summary stays Emilie-flagged until she signs it. Set
            in the body face, not italic: it is a paragraph that argues, not a
            tagline that decorates. */}
        <p className="pr-lead" style={{ margin: '2mm 0 0' }}>
          <Lead />
        </p>
        <p className="pr-contact" style={{ margin: '1.6mm 0 0' }}>
          chidiacemilie@gmail.com · linkedin.com/in/EmilieElChidiac · github.com/hi-em · emiliechidiac.com
        </p>

        <Sec name="education">EDUCATION</Sec>
        {EDUCATION.map(e => (
          <Record key={e.title} {...e} />
        ))}

        <Sec name="experience">EXPERIENCE</Sec>
        {EXPERIENCE.map(e => (
          <Record key={e.org + (e.dates ?? '')} {...e} />
        ))}

        <Sec name="skills">SKILLS</Sec>
        <ul>
          {SKILLS.map(s => (
            <li key={s.group}>
              <span className="pr-label">{s.group}:</span> <span className="pr-skill">{s.items}</span>
            </li>
          ))}
          <li>
            <span className="pr-label">Languages:</span> <span className="pr-skill">{LANGUAGES}</span>
          </li>
        </ul>

        <Sec name="awards">AWARDS &amp; RECOGNITION</Sec>
        {/* THE YEAR LEADS THE BLOCK, on paper too (her call 2026-07-28, after
            the same fix on the screen). This list was the last thing on the
            page ignoring her own rule that whatever leads a block leads every
            block the same way: the year and its citation were one undifferen-
            tiated run of ink, while a degree name, a job title and a skills
            group all lead bold with the rest muted behind them.
            It reuses .pr-label / .pr-skill rather than inventing a step — that
            IS the consistency (print.css's ladder note). Nothing about the
            extracted text changes: the string is still "2026 · <citation>", so
            the ATS parse test and the one-page fit are untouched. */}
        <ul>
          {AWARDS.map(a => (
            <li key={a.text}>
              <span className="pr-label">{a.year}</span> ·{' '}
              <span className="pr-skill">{a.text}</span>
            </li>
          ))}
        </ul>

        {/* CERTIFICATES retired from the CV (her review + a unanimous council
            call). The printed book's record page still carries them. */}
        <Sec name="writing">WRITING &amp; RESEARCH</Sec>
        <p>{WRITING}</p>

      </div>
    </A4Page>
  )
}
