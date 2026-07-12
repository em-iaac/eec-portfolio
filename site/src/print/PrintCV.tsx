// G5 · THE STANDALONE CV PDF (REDESIGN-SPEC §9). Fully plain and ATS-safe:
// ONE visual column, ONE text column (the PDF text layer reads top to
// bottom in DOM order), no letter-spaced name, real "Aug 2024 - Present"
// dates in the embedded text, current email, expanded certificate names,
// the four §9 skill groups ("Rhino Compute" spelled with a space once, in
// the data). The one non-plain touch is the UPDATED line. The screen
// kicker "CV · THE RECORD" never prints (G4). Same data as /cv: cv.ts is
// the single source; this page is its print rendition, so the PDF can
// never go stale.
import { EDUCATION, EXPERIENCE, AWARDS, SKILLS, LANGUAGES, CERTIFICATES, FOCUS, UPDATED } from '../data/cv'
import A4Page from './A4Page'

export default function PrintCV() {
  return (
    <A4Page orientation="portrait">
      <div className="pr-ats">
        {/* The locked header string: name | role, one line, zero tracking. */}
        <h1>
          Emilie El Chidiac <span style={{ fontWeight: 400, color: 'var(--pr-ink-muted)' }}>| Design Technology Architect</span>
        </h1>
        {/* draftCopy: the FOCUS line stays Emilie-flagged (G4); it renders on
            /cv today and rides into the PDF under the same flag. */}
        <p style={{ fontStyle: 'italic', color: 'var(--pr-ink-muted)', margin: '1.6mm 0 0' }}>{FOCUS}</p>
        <p style={{ margin: '1.8mm 0 0' }}>
          chidiacemilie@gmail.com · linkedin.com/in/EmilieElChidiac · github.com/hi-em · emiliechidiac.com
        </p>
        <p className="pr-mono pr-mono--muted" style={{ margin: '1.4mm 0 0', fontSize: '7.5pt' }}>
          UPDATED {UPDATED.toUpperCase()}
        </p>

        <h2>EDUCATION</h2>
        {EDUCATION.map(e => (
          <div key={e.title} style={{ marginBottom: '1.4mm' }}>
            <p>
              <strong>{e.title}</strong> · {e.org} · {e.dates}
            </p>
            <p style={{ color: 'var(--pr-ink-muted)' }}>{e.notes}</p>
          </div>
        ))}

        <h2>EXPERIENCE</h2>
        {EXPERIENCE.map(e => (
          <div key={e.org + e.dates} style={{ marginBottom: '1.4mm' }}>
            <p>
              <strong>{e.title}</strong> · {e.org} · {e.dates}
            </p>
            <p style={{ color: 'var(--pr-ink-muted)' }}>{e.notes}</p>
          </div>
        ))}

        <h2>AWARDS & RECOGNITION</h2>
        <ul>
          {AWARDS.map(a => (
            <li key={a.text}>
              {a.year} · {a.text}
            </li>
          ))}
        </ul>

        <h2>SKILLS</h2>
        <ul>
          {SKILLS.map(s => (
            <li key={s.group}>
              <strong>{s.group}:</strong> {s.items}
            </li>
          ))}
          <li>
            <strong>LANGUAGES:</strong> {LANGUAGES}
          </li>
        </ul>

        <h2>CERTIFICATES</h2>
        <ul>
          {CERTIFICATES.map(c => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </A4Page>
  )
}
