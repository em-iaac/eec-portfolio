import { type ReactNode } from 'react'
import SheetPage from '../components/SheetPage'
import DownloadChip from '../components/ui/DownloadChip'
import ContactLinks from '../components/ui/ContactLinks'
import { DocGlyph } from '../components/ui/glyphs'
import { EDUCATION, EXPERIENCE, AWARDS, SKILLS, LANGUAGES, CERTIFICATES, UPDATED } from '../data/cv'

const BASE = import.meta.env.BASE_URL

// THE RECORD, FOUR COLUMNS (the design audit round 2, Emilie's ruling
// 2026-07-19): full-bleed columns Education | Experience | Awards +
// Certificates | Skills; a column that overflows scrolls inside itself on a
// hidden wheel (.cv-col, language.css). The name + title live in the content
// again; the reach-me links + the download ride the header line; the footer
// retired here (it just repeated the contact). The downloadable PDF is
// unchanged and stays the plain PORTRAIT single column ATS parses (same
// data/cv.ts) : the web page is never ATS-parsed, so its layout is free.
// The FOCUS phrase left the screen; it still rides the PDF, where it carries
// the keyword cluster. Header string LOCKED: "Emilie El Chidiac | Design
// Technology Architect".

// A small accent per column, MUTED and on the ICON ONLY (S6-A, Emilie
// 2026-07-24, Board 1 option C: "I like them but I don't want to overwhelm").
// The five saturated hues read as a rainbow competing with the words, so the
// colour steps back to a muted tonal family and rides the icon alone; the
// label goes to ink. The icon shape + the ink label carry the category, so
// colour is never the sole signal (the a11y rule), and the muted values only
// need the 3:1 graphical floor on their ground, not text AA. Red is NOT used
// (it means interaction/liveness, not a category).
const SECTIONS = {
  education: 'light-dark(#5b6b7a, #97a8ba)',
  experience: 'light-dark(#4f7a6b, #83b6a4)',
  awards: 'light-dark(#8a7038, #cbb073)',
  certificates: 'light-dark(#6f5f86, #b4a7cd)',
  skills: 'light-dark(#5c6187, #a6abd1)',
} as const

function SecIcon({ name }: { name: keyof typeof SECTIONS }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
      {name === 'education' && (
        <>
          <path {...p} d="M2 6l6-2.8 6 2.8-6 2.8L2 6z" />
          <path {...p} d="M5 7.4v3c0 .9 1.3 1.8 3 1.8s3-.9 3-1.8v-3" />
        </>
      )}
      {name === 'experience' && (
        <>
          <rect {...p} x="2.5" y="5" width="11" height="8" rx="1.2" />
          <path {...p} d="M6 5V3.9c0-.6.4-1 1-1h2c.6 0 1 .4 1 1V5" />
          <path {...p} d="M2.5 8.6h11" />
        </>
      )}
      {name === 'awards' && (
        <>
          <circle {...p} cx="8" cy="6" r="3.4" />
          <path {...p} d="M6 9l-1 4 3-1.6 3 1.6-1-4" />
        </>
      )}
      {name === 'certificates' && (
        <>
          <rect {...p} x="3" y="2.5" width="10" height="11" rx="1.2" />
          <path {...p} d="M5.5 6h5M5.5 8.4h5M5.5 10.8h3" />
        </>
      )}
      {name === 'skills' && (
        <>
          <path {...p} d="M3 5h5M11.5 5h1.5M3 11h1.5M7.5 11h5.5" />
          <circle {...p} cx="9.5" cy="5" r="1.4" />
          <circle {...p} cx="5" cy="11" r="1.4" />
        </>
      )}
    </svg>
  )
}

function SecTitle({ name, children }: { name: keyof typeof SECTIONS; children: ReactNode }) {
  return (
    <h2 className="mb-2.5 flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.12em] text-[var(--lang-ink)]">
      {/* Colour rides the icon only (Board 1 C); the label holds ink. */}
      <span className="inline-flex" style={{ color: SECTIONS[name] }}>
        <SecIcon name={name} />
      </span>
      {children}
    </h2>
  )
}

function Entry({ dates, title, org, notes }: { dates: string; title: string; org: string; notes: string }) {
  return (
    <div className="mb-2.5">
      <div className="font-mono text-[10px] leading-[13px] tracking-[0.04em] text-[var(--lang-ink-muted)] tabular-nums">
        {dates}
      </div>
      <h3 className="text-[13.5px] leading-snug font-semibold text-[var(--lang-ink)]">
        {title} <span className="font-normal text-[var(--lang-ink-muted)]">· {org}</span>
      </h3>
      <p className="mt-0.5 font-serif text-[13px] leading-[1.35] text-[var(--lang-ink)]">{notes}</p>
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
      <DownloadChip href={`${BASE}assets/cv-emilie-el-chidiac.pdf`} download="Emilie-El-Chidiac-CV.pdf" icon={<DocGlyph />}>
        DOWNLOAD PDF
      </DownloadChip>
    </div>
  )
}

export default function CV() {
  return (
    <SheetPage wide center={false} footer={false} pillTools={<CvHeaderTools />}>
      {/* The name + title back in the content (Emilie's ruling round 2). */}
      <div className="pt-0 pb-2">
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">
          Emilie El Chidiac{' '}
          <span className="font-normal text-[var(--lang-ink-muted)]">| Design Technology Architect</span>
        </h1>
        <p className="mt-1 font-mono text-[9px] tracking-[0.1em] text-[var(--lang-ink-muted)]">
          UPDATED {UPDATED.toUpperCase()}
        </p>
      </div>

      {/* THREE columns, no scrolling (Emilie's ruling round 2): column 1 =
          Education then Certificates, column 2 = Experience, column 3 =
          Awards then Skills. */}
      <div className="cv-cols pb-0">
        <section aria-label="Education and certificates">
          <SecTitle name="education">EDUCATION</SecTitle>
          {EDUCATION.map(e => (
            <Entry key={e.title} {...e} />
          ))}
          <div className="mt-5">
            <SecTitle name="certificates">CERTIFICATES</SecTitle>
            <ul className="grid gap-1.5">
              {CERTIFICATES.map(c => (
                <li key={c} className="font-mono text-[10px] leading-relaxed text-[var(--lang-ink)]">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-label="Experience">
          <SecTitle name="experience">EXPERIENCE</SecTitle>
          {EXPERIENCE.map(e => (
            <Entry key={e.org + e.dates} {...e} />
          ))}
        </section>

        <section aria-label="Awards and skills">
          <SecTitle name="awards">AWARDS &amp; RECOGNITION</SecTitle>
          <ul className="mb-4 grid gap-1">
            {AWARDS.map(a => (
              <li key={a.text} className="grid grid-cols-[40px_1fr] gap-x-2">
                <span className="font-mono text-[10px] leading-5 text-[var(--lang-ink-muted)] tabular-nums">{a.year}</span>
                <span className="font-serif text-[13px] leading-snug">{a.text}</span>
              </li>
            ))}
          </ul>
          <SecTitle name="skills">SKILLS</SecTitle>
          {SKILLS.map(s => (
            <div key={s.group} className="mb-2 font-mono text-[10.5px] leading-[1.5]">
              <span className="tracking-[0.1em] text-[var(--lang-ink-muted)]">{s.group}</span>
              <span className="mt-0.5 block text-[var(--lang-ink)]">{s.items}</span>
            </div>
          ))}
          <div className="mt-1 font-mono text-[10.5px] leading-[1.5]">
            <span className="tracking-[0.1em] text-[var(--lang-ink-muted)]">LANGUAGES</span>
            <span className="mt-0.5 block text-[var(--lang-ink)]">{LANGUAGES}</span>
          </div>
        </section>
      </div>
    </SheetPage>
  )
}
