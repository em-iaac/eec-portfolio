import type { ReactNode } from 'react'
import SheetPage from '../components/SheetPage'
import { EDUCATION, EXPERIENCE, AWARDS, SKILLS, LANGUAGES, CERTIFICATES } from '../data/cv'

const BASE = import.meta.env.BASE_URL

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="border-t border-ink/20 py-6">
      <h2 className="mb-4 font-mono text-[11px] tracking-[0.12em] text-anno">{title}</h2>
      {children}
    </section>
  )
}

function Entry({ dates, title, org, notes }: { dates: string; title: string; org: string; notes: string }) {
  return (
    <div className="mb-5 grid gap-x-6 gap-y-1 last:mb-0 sm:grid-cols-[140px_1fr]">
      <div className="font-mono text-[10.5px] leading-6 tracking-[0.04em] text-anno tabular-nums">{dates}</div>
      <div>
        <h3 className="text-[15px] font-semibold text-ink">
          {title} <span className="font-normal text-anno">· {org}</span>
        </h3>
        <p className="mt-1 max-w-[68ch] font-serif text-[14.5px] leading-relaxed text-ink">{notes}</p>
      </div>
    </div>
  )
}

// CV header string is LOCKED: "Emilie El Chidiac | Design Technology Architect"
export default function CV() {
  return (
    <SheetPage sheet="C-001" title="CV">
      <div className="flex flex-wrap items-end justify-between gap-4 pt-10 pb-6 sm:pt-14">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.01em]">
            Emilie El Chidiac <span className="font-normal text-anno">| Design Technology Architect</span>
          </h1>
          <p className="mt-2 font-mono text-[10.5px] tracking-[0.06em] text-redline">
            OPEN TO R&D AND DESIGN-TECHNOLOGY ROLES IN EUROPE
          </p>
        </div>
        <a
          href={`${BASE}assets/cv-emilie-el-chidiac.pdf`}
          download="Emilie-El-Chidiac-CV.pdf"
          className="border border-ink px-4 py-2.5 font-mono text-[10px] tracking-[0.1em] text-ink no-underline hover:border-redline hover:text-redline focus-visible:outline-2 focus-visible:outline-redline"
        >
          DOWNLOAD PDF
        </a>
      </div>

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
              <span className="font-mono text-[10.5px] leading-6 text-anno tabular-nums">{a.year}</span>
              <span className="font-serif text-[14.5px] leading-relaxed">{a.text}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="SKILLS">
        {SKILLS.map(s => (
          <div key={s.group} className="mb-2 grid gap-x-6 font-mono text-[10.5px] leading-relaxed last:mb-0 sm:grid-cols-[140px_1fr]">
            <span className="tracking-[0.1em] text-anno">{s.group}</span>
            <span className="text-ink">{s.items}</span>
          </div>
        ))}
        <div className="mt-2 grid gap-x-6 font-mono text-[10.5px] sm:grid-cols-[140px_1fr]">
          <span className="tracking-[0.1em] text-anno">LANGUAGES</span>
          <span className="text-ink">{LANGUAGES}</span>
        </div>
      </Section>

      <Section title="CERTIFICATES">
        <ul className="grid gap-1.5">
          {CERTIFICATES.map(c => (
            <li key={c} className="font-mono text-[10.5px] leading-relaxed text-ink">
              {c}
            </li>
          ))}
        </ul>
      </Section>
    </SheetPage>
  )
}
