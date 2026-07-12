import { type ReactNode } from 'react'
import SheetPage from '../components/SheetPage'
import { EDUCATION, EXPERIENCE, AWARDS, SKILLS, LANGUAGES, CERTIFICATES, FOCUS, UPDATED } from '../data/cv'

const BASE = import.meta.env.BASE_URL

// THE PLAIN LIST, AGAIN (the meta build, 2026-07-11, Emilie's ruling at the
// post-G3 redirection): the G3 graph view + ghost rail retired — the time
// story lives at /thoughts as the neural world now — and the CV reverts to
// the clean, fully ATS-safe single column of REDESIGN-SPEC §9. Old
// /cv?view=graph URLs simply degrade to this list (params ignored, never a
// 404); /notebook redirects to /thoughts.
const CV_LINK =
  '-m-2 p-2 text-[var(--lang-interaction)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="border-t border-[var(--lang-hairline)] py-6">
      <h2 className="mb-4 font-mono text-[11px] tracking-[0.12em] text-[var(--lang-ink-muted)]">{title}</h2>
      {children}
    </section>
  )
}

function Entry({ dates, title, org, notes }: { dates: string; title: string; org: string; notes: string }) {
  return (
    <div className="mb-5 grid gap-x-6 gap-y-1 last:mb-0 sm:grid-cols-[140px_1fr]">
      <div className="font-mono text-[10.5px] leading-6 tracking-[0.04em] text-[var(--lang-ink-muted)] tabular-nums">{dates}</div>
      <div>
        <h3 className="text-[15px] font-semibold text-[var(--lang-ink)]">
          {title} <span className="font-normal text-[var(--lang-ink-muted)]">· {org}</span>
        </h3>
        <p className="mt-1 max-w-[68ch] font-serif text-[14.5px] leading-relaxed text-[var(--lang-ink)]">{notes}</p>
      </div>
    </div>
  )
}

// CV header string is LOCKED: "Emilie El Chidiac | Design Technology Architect"
export default function CV() {
  return (
    <SheetPage title="CV">
      <div className="pt-10 pb-4 sm:pt-14">
        <div>
          {/* The kicker, SIGNED (G4, 2026-07-12: one room-sign grammar
              sitewide). Screen chrome only, never prints. */}
          <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--lang-ink-muted)] uppercase print:hidden">
            CV · THE RECORD
          </p>
          {/* The header is the locked name + role line, nothing else (§9). */}
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.01em]">
            Emilie El Chidiac <span className="font-normal text-[var(--lang-ink-muted)]">| Design Technology Architect</span>
          </h1>
          {/* draftCopy: the one-line focus string (REDESIGN-SPEC §9), unsigned. */}
          <p className="mt-2 max-w-[62ch] font-serif text-[14px] italic leading-relaxed text-[var(--lang-ink-muted)]">{FOCUS}</p>

          {/* Contact row (Session 4): the career page carries plain reach-me
              facts; the footer keeps its lockup. The BARCELONA | BEIRUT string
              dropped at G3 (Emilie, 2026-07-10, FLAG-02). */}
          <p className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-5 font-mono text-[10.5px] tracking-[0.06em]">
            <a href="mailto:chidiacemilie@gmail.com" className={CV_LINK}>
              chidiacemilie@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/EmilieElChidiac"
              target="_blank"
              rel="noopener noreferrer"
              className={CV_LINK}
            >
              LINKEDIN
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <a href="https://github.com/hi-em" target="_blank" rel="noopener noreferrer" className={CV_LINK}>
              GITHUB
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </p>
          {/* The one sanctioned functional touch (§9): version clarity, prints. */}
          <p className="pt-3 font-mono text-[9px] tracking-[0.1em] text-[var(--lang-ink-muted)]">UPDATED {UPDATED.toUpperCase()}</p>

          <div className="flex pt-8 print:hidden">
            <a
              href={`${BASE}assets/cv-emilie-el-chidiac.pdf`}
              download="Emilie-El-Chidiac-CV.pdf"
              className="ml-auto rounded-[var(--r-control)] border border-[var(--lang-ink)] px-4 py-2.5 font-mono text-[10px] tracking-[0.1em] text-[var(--lang-ink)] no-underline hover:border-[var(--lang-interaction)] hover:text-[var(--lang-interaction)] focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]"
            >
              DOWNLOAD PDF
            </a>
          </div>
        </div>
      </div>

      <div>
        <Section title="EDUCATION">
          {EDUCATION.map(e => (
            <Entry key={e.title} {...e} />
          ))}
        </Section>

        <Section title="EXPERIENCE">
          {EXPERIENCE.map(e => (
            <Entry key={e.org + e.dates} {...e} />
          ))}
        </Section>

        <Section title="AWARDS & RECOGNITION">
          <ul className="grid gap-2">
            {AWARDS.map(a => (
              <li key={a.text} className="grid gap-x-6 sm:grid-cols-[140px_1fr]">
                <span className="font-mono text-[10.5px] leading-6 text-[var(--lang-ink-muted)] tabular-nums">{a.year}</span>
                <span className="font-serif text-[14.5px] leading-relaxed">{a.text}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="SKILLS">
          {SKILLS.map(s => (
            <div key={s.group} className="mb-2 grid gap-x-6 font-mono text-[10.5px] leading-relaxed last:mb-0 sm:grid-cols-[140px_1fr]">
              <span className="tracking-[0.1em] text-[var(--lang-ink-muted)]">{s.group}</span>
              <span className="text-[var(--lang-ink)]">{s.items}</span>
            </div>
          ))}
          <div className="mt-2 grid gap-x-6 font-mono text-[10.5px] sm:grid-cols-[140px_1fr]">
            <span className="tracking-[0.1em] text-[var(--lang-ink-muted)]">LANGUAGES</span>
            <span className="text-[var(--lang-ink)]">{LANGUAGES}</span>
          </div>
        </Section>

        <Section title="CERTIFICATES">
          <ul className="grid gap-1.5">
            {CERTIFICATES.map(c => (
              <li key={c} className="font-mono text-[10.5px] leading-relaxed text-[var(--lang-ink)]">
                {c}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </SheetPage>
  )
}
