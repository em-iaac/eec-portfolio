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
import { Fragment, type ReactNode } from 'react'
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
import { CvIcon, type CvSection } from '../components/ui/cvIcons'
import { SITE_ORIGIN } from '../lib/routes'
import A4Page from './A4Page'

// THE CV'S LINKS PASS (Emilie, 2026-08-19). The book learned to carry real
// link annotations at the links pass (2026-08-16); this file had not, so the
// PDF a recruiter actually opens printed every address it names as dead type.
// A CV is the ONE document in the set whose whole job is to be followed up on,
// and it was the last one you could not click.
//
// ⚠ NOTHING HERE IS NEW MACHINERY, on purpose. The links are made the same way
// the book makes them: a real <a href> in the printed DOM, which headless
// Chrome turns into a /Link annotation by itself, wearing `.pr-link` — the
// class print.css already defines as "a destination, never a mark" (color
// inherit, no decoration, no background). scripts/render-pdfs.mjs then reads
// them back out of the BYTES with the book's own readLinks(), so the CV is
// held to the same distinct-target grammar as the book.
//
// ⚠ AND THEY ARE MARKED, but not the way the book marks its footers. The mark
// is a 0.3pt hairline in the faint pen, hung under the word: her ruling
// 2026-08-19 ("A, and mark all of them"), taken off three real printed proofs
// rather than a drawing, because the two marks this project tried before both
// looked right on screen and failed on paper. The reasoning — why not red,
// why not the screen's dash, why a border and not an underline — lives with
// the rule in print.css, next to the pen it sets. It costs no geometry: all 49
// baselines, both margins, every type size and the one-page fit measured
// identical to the unmarked sheet.
//
// The set is exactly what links on /cv: the contact row's four addresses, the
// project name that LEADS a bullet (splitProjectLink, the same lookup the
// screen uses), and the three destinations in the writing line. Internal
// routes are absolutised against SITE_ORIGIN — a printed page has no origin to
// resolve "/thoughts" against.
//
// NOT linked, and deliberately: the five section headings. On screen they are
// anchors that scroll you down a 4-screen record; in a one-page PDF a link
// from a heading to itself is a hit target that does nothing.
function CvLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="pr-link">
      {children}
    </a>
  )
}

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
      {projects?.map(p => {
        // The LEADING project name is the door to its showcase, and only the
        // leading one — exactly the rule the screen page follows, from the
        // same lookup. A bullet that opens with a verb (the duty lines), the
        // methods line and the licensure line stay flat text, so the record
        // still reads as a document rather than a link farm.
        const link = splitProjectLink(p)
        return (
          <p key={p} style={{ color: 'var(--pr-ink-muted)', paddingLeft: '3.2mm', textIndent: '-3.2mm' }}>
            {'› '}
            {link ? (
              <>
                <CvLink href={`${SITE_ORIGIN}/work/${link.id}`}>{link.name}</CvLink>
                {link.rest}
              </>
            ) : (
              p
            )}
          </p>
        )
      })}
    </div>
  )
}

/**
 * The CV itself, WITHOUT a page around it, so two documents can render the
 * identical sheet: this route at A4 portrait, and the book's CV page, which
 * lays an A4 landscape out as two A5 portraits and puts this one, scaled to
 * A5, in the left half (Emilie, 2026-08-12). Scaling rather than re-laying it
 * out is the point: the book then carries the SAME design and the WHOLE
 * record, at 1/√2, instead of a differently-designed extract.
 */
export function CvSheet() {
  return (
    <div className="pr-ats">
        {/* The locked header string: name | role, one line, zero tracking. The
            UPDATED stamp rides the same line, small and right (her call), so it
            stops spending a line of its own. It sits AFTER the name in the DOM,
            so the text layer still reads the name first. */}
        <h1>
          Emilie El Chidiac{' '}
          <span style={{ fontWeight: 400, color: 'var(--pr-ink-muted)' }}>| Design Technologist</span>
        </h1>
        {/* draftCopy: the summary stays Emilie-flagged until she signs it. Set
            in the body face, not italic: it is a paragraph that argues, not a
            tagline that decorates. */}
        <p className="pr-lead" style={{ margin: '2mm 0 0' }}>
          <Lead />
        </p>
        {/* THE ROW THAT MOST NEEDED IT. Four addresses, each now the thing it
            names: the email opens a composer, the other three open in a
            browser. The separators and the spaces around them are untouched,
            so the justified line measures exactly as it did and the extracted
            string is character-for-character the same. */}
        <p className="pr-contact" style={{ margin: '1.6mm 0 0' }}>
          <CvLink href="mailto:chidiacemilie@gmail.com">chidiacemilie@gmail.com</CvLink> ·{' '}
          <CvLink href="https://linkedin.com/in/EmilieElChidiac">linkedin.com/in/EmilieElChidiac</CvLink> ·{' '}
          <CvLink href="https://github.com/hi-em">github.com/hi-em</CvLink> ·{' '}
          <CvLink href={SITE_ORIGIN}>emiliechidiac.com</CvLink>
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
        {/* Assembled from WRITING_PARTS rather than from the joined WRITING
            string, so the two addresses this line NAMES are the addresses it
            GOES to — the same repair board B2 made on the screen. The parts
            are the single source and cv.test.ts pins their join to the exact
            string this paragraph used to print, so the separator grammar and
            the ATS text cannot drift apart. */}
        <p>
          {WRITING_PARTS.map((part, i) => (
            <Fragment key={part.link}>
              {i > 0 ? ' · ' : null}
              {part.before}
              <CvLink href={part.to ? `${SITE_ORIGIN}${part.to}` : part.href!}>{part.link}</CvLink>
              {part.after}
            </Fragment>
          ))}
        </p>

    </div>
  )
}

export default function PrintCV() {
  return (
    <A4Page orientation="portrait">
      <CvSheet />
    </A4Page>
  )
}
