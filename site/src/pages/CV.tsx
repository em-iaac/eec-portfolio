import { lazy, Suspense, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import { FilterPill } from '../components/ui/Pill'
import { EDUCATION, EXPERIENCE, AWARDS, SKILLS, LANGUAGES, CERTIFICATES, FOCUS, UPDATED } from '../data/cv'
import { isCareerFacet, type CareerFacet } from '../cv/facets'

const BASE = import.meta.env.BASE_URL

// THE GRAPH VIEW (G3, 2026-07-10, Emilie's ruling): the career commit graph
// moved here from the retired /notebook door, behind a screen-only toggle.
// The plain list stays the default face and the ONLY face print or the PDF
// ever see. Lazy: the recruiter's list never pays for the SVG math it may
// not open.
const CareerGraph = lazy(() => import('../cv/CareerGraph'))

const CV_LINK =
  '-m-2 p-2 text-redline underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline'

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

// THE GHOST RAIL (G3, Emilie's amendment on the live stamp: "background ish
// on the left side, and when you press it or toggle, it appears and the
// words change to match the actual graph"). The career drawing lives in the
// list's left margin as a faint presence, no box, no chrome: 40% ink at
// rest, developing to full ink on hover/focus, sticky so it keeps the list
// company while it scrolls. Pressing it (or the GRAPH pill) swaps the words
// for the record: the drawing "appears" full strength as the real measured
// graph. Hand-drawn from the same topology the real graph measures. Desktop
// only (the GRAPH pill is the way in on phones); never prints.
function GhostRail({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open the graph view: the career drawn as a commit graph"
      className="group sticky top-24 hidden h-fit w-full p-0 text-left opacity-40 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--lang-interaction)] motion-reduce:transition-none lg:block print:hidden"
    >
      <svg viewBox="0 0 96 330" className="w-full" aria-hidden="true">
        <line x1="14" y1="12" x2="14" y2="322" stroke="var(--lang-ink)" strokeWidth="1.3" opacity="0.8" />
        <circle cx="14" cy="6" r="2.4" fill="var(--lang-ground)" stroke="var(--lang-ink)" strokeWidth="1.1" />
        <path d="M14 270 C14 262 30 266 30 258 L30 12" fill="none" stroke="var(--lang-ink)" strokeWidth="0.9" opacity="0.5" />
        <circle cx="30" cy="6" r="2.8" fill="var(--lang-ground)" stroke="var(--lang-interaction)" strokeWidth="1.4" />
        <path d="M14 240 C14 233 46 237 46 230 L46 206 C46 197 14 201 14 192" fill="none" stroke="var(--lang-ink)" strokeWidth="0.9" opacity="0.5" />
        <path d="M14 216 C14 208 62 212 62 204 L62 156 C62 147 14 151 14 142" fill="none" stroke="var(--lang-ink)" strokeWidth="0.9" opacity="0.5" />
        <path d="M14 186 C14 178 78 182 78 174 L78 84" fill="none" stroke="var(--lang-ink)" strokeWidth="0.9" opacity="0.5" />
        <circle cx="78" cy="78" r="2.4" fill="var(--lang-ground)" stroke="var(--lang-ink)" strokeWidth="1.1" />
        <path d="M14 140 C14 132 92 136 92 128 L92 56" fill="none" stroke="var(--lang-ink)" strokeWidth="0.9" opacity="0.5" />
        <circle cx="92" cy="50" r="2.4" fill="var(--lang-ground)" stroke="var(--lang-ink)" strokeWidth="1.1" />
        <circle cx="30" cy="20" r="2.4" fill="var(--lang-interaction)" />
        <circle cx="30" cy="60" r="1.9" fill="var(--lang-ink)" />
        <circle cx="30" cy="110" r="1.9" fill="var(--lang-ink)" />
        <circle cx="30" cy="230" r="1.9" fill="var(--lang-ink)" />
        <circle cx="46" cy="218" r="1.8" fill="var(--lang-ink)" />
        <circle cx="62" cy="180" r="1.9" fill="var(--lang-ink)" />
        <circle cx="78" cy="100" r="1.9" fill="var(--lang-ink)" />
        <circle cx="78" cy="120" r="1.9" fill="var(--lang-ink)" />
        <circle cx="92" cy="70" r="1.9" fill="var(--lang-ink)" />
        <circle cx="92" cy="86" r="1.9" fill="var(--lang-ink)" />
        <circle cx="92" cy="102" r="1.9" fill="var(--lang-ink)" />
        <circle cx="14" cy="160" r="1.9" fill="var(--lang-ink)" />
        <circle cx="14" cy="290" r="1.9" fill="var(--lang-ink)" />
        <circle cx="14" cy="306" r="1.9" fill="var(--lang-ink)" />
      </svg>
      {/* draftCopy: the rail's reveal line, unsigned. */}
      <span className="mt-3 block font-mono text-[9px] tracking-[0.08em] text-redline opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
        OPEN THE GRAPH ›
      </span>
    </button>
  )
}

// CV header string is LOCKED: "Emilie El Chidiac | Design Technology Architect"
export default function CV() {
  const [params, setParams] = useSearchParams()
  const view: 'list' | 'graph' = params.get('view') === 'graph' ? 'graph' : 'list'
  const rawFacet = params.get('facet')
  const facet: CareerFacet | null = view === 'graph' && isCareerFacet(rawFacet) ? rawFacet : null

  // Toggling PUSHES (Back exits the graph); facet changes REPLACE (no
  // history spam while filtering); re-pressing the active view is a no-op
  // (no phantom history entries).
  const showGraph = () => {
    if (view !== 'graph') setParams(facet ? { view: 'graph', facet } : { view: 'graph' })
  }
  const showList = () => {
    if (view !== 'list') setParams({})
  }
  const setFacet = (f: CareerFacet | null) =>
    setParams(f ? { view: 'graph', facet: f } : { view: 'graph' }, { replace: true })

  return (
    <SheetPage title="CV">
      <div className="pt-10 pb-4 sm:pt-14">
        <div>
          {/* Open-to status retired Session 5 (FLAG-01): the search is private;
              the LinkedIn recruiters-only setting is the one standing signal. */}
          <h1 className="text-2xl font-semibold tracking-[-0.01em]">
            Emilie El Chidiac <span className="font-normal text-anno">| Design Technology Architect</span>
          </h1>
          {/* draftCopy: the one-line focus string (REDESIGN-SPEC §9), unsigned. */}
          <p className="mt-2 max-w-[62ch] font-serif text-[14px] italic leading-relaxed text-anno">{FOCUS}</p>

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
          <p className="pt-3 font-mono text-[9px] tracking-[0.1em] text-anno">UPDATED {UPDATED.toUpperCase()}</p>

          {/* View controls: screen furniture, never prints. aria-pressed pills
              (not tabs): the list stays in the DOM display:none for print,
              which tab semantics would misdescribe. */}
          <div className="flex flex-wrap items-center gap-4 pt-8 print:hidden">
            <div className="-mx-1 flex" role="group" aria-label="CV view">
              <FilterPill active={view === 'list'} onClick={showList} className="px-1">
                LIST
              </FilterPill>
              <FilterPill active={view === 'graph'} onClick={showGraph} className="px-1">
                GRAPH
              </FilterPill>
            </div>
            <a
              href={`${BASE}assets/cv-emilie-el-chidiac.pdf`}
              download="Emilie-El-Chidiac-CV.pdf"
              className="ml-auto border border-ink px-4 py-2.5 font-mono text-[10px] tracking-[0.1em] text-ink no-underline hover:border-redline hover:text-redline focus-visible:outline-2 focus-visible:outline-redline"
            >
              DOWNLOAD PDF
            </a>
          </div>
        </div>
      </div>

      {/* The plain list: ALWAYS in the DOM. In graph view it hides on screen
          but `print:block` beats `hidden` inside @media print, so paper gets
          the list with zero JS, both views, both modes (print pins light in
          language.css). On large screens the ghost rail keeps the list
          company in the left margin; print never sees it. */}
      <div className={view === 'graph' ? 'hidden print:block' : 'lg:grid lg:grid-cols-[96px_minmax(0,1fr)] lg:items-start lg:gap-x-10 print:block'}>
        {view === 'list' && <GhostRail onOpen={showGraph} />}
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
        </div>
      </div>

      <div className="print:hidden">
        {view === 'graph' && (
          // The fallback holds the document's height while the chunk loads
          // (cold cache / slow network): no page collapse, no scroll clamp.
          <Suspense fallback={<div aria-hidden="true" className="min-h-[70vh]" />}>
            <CareerGraph facet={facet} onFacetChange={setFacet} />
          </Suspense>
        )}
      </div>
    </SheetPage>
  )
}
