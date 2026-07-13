// THE PILLAR PAGE (S3, 2026-07-13; CONTENT-STRATEGY.md D6 "topical
// authority"). The one definitive Behavior Information Modeling surface:
// the exact phrase rides the slug, the <title> (lib/headData.ts), the <h1>,
// and the first line. The neuro cluster is derived from the registry's
// 'neuro' tag (lib/pillar.ts): every related project and note is a door
// here, and each of those surfaces carries a door back (ThoughtLeaf
// endmatter, WorkOverlay), so the coined term has one canonical source.
//
// COPY SIGNED AS INTERIM (Emilie, 2026-07-13): the kicker, both paragraphs,
// and the door labels stand as signed copy; S5 still owes this page its
// definitive rewrite (D7). Structure (the shell) was the S3 deliverable.
import { Link } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import { ENTRIES } from '../data/registry'
import { isPillarRelated } from '../lib/pillar'

const RED_LINK =
  '-m-2 p-2 text-[var(--lang-interaction)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'

// The cluster, derived, never listed by hand: tag a new project 'neuro' in
// the registry and it appears here (and gains its door back) by existing.
const NEURO_PROJECTS = ENTRIES.filter((e) => e.kind === 'project' && isPillarRelated(e.tags))
const NEURO_THOUGHTS = ENTRIES.filter(
  (e) => e.kind === 'thought' && e.note?.status === 'drafted' && isPillarRelated(e.tags),
)

function DoorRow({ to, title, hint }: { to: string; title: string; hint: string }) {
  return (
    <li className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t-[0.5px] border-[var(--lang-hairline)] py-2.5 first:border-t-0">
      <Link to={to} viewTransition className={`font-mono text-[11px] tracking-[0.08em] ${RED_LINK}`}>
        {title} ›
      </Link>
      <span className="font-mono text-[9px] tracking-[0.12em] text-[var(--lang-ink-muted)] uppercase">
        {hint}
      </span>
    </li>
  )
}

export default function Pillar() {
  return (
    <SheetPage>
      <article className="mx-auto w-full max-w-[680px] pt-10 pb-16">
        <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--lang-ink-muted)] uppercase">
          THE SPINE · A DEFINITION
        </p>

        <h1 className="mt-4 mb-6 max-w-[22ch] font-serif text-[27px] leading-[1.22] font-medium lowercase italic tracking-[-0.01em] text-[var(--lang-ink)]">
          behavior information modeling
        </h1>

        {/* Signed interim (2026-07-13); S5 writes the definitive version. */}
        <div className="max-w-[62ch] font-serif text-[16.5px] leading-[1.75] text-[var(--lang-ink)] [&_p]:mb-[1.15em] [&_p:last-child]:mb-0">
          <p>
            Behavior information modeling is the bet this whole site makes: that how a space
            will make someone feel can be treated as design data, scored and modeled and argued
            with before anything is built.
          </p>
          <p>
            For thirty years Building Information Modeling tracked every beam, duct, and clash
            to the millimeter. The B in this one stands for behavior: the person in the room,
            not just the room. The long version lives in{' '}
            <Link to="/thoughts/bim" viewTransition className={RED_LINK}>
              the note that coined it
            </Link>
            ; everything below is the bet being tested.
          </p>
        </div>

        <section className="mt-10" aria-label="Projects that test behavior information modeling">
          <h2 className="font-mono text-[9px] font-normal tracking-[0.12em] text-[var(--lang-ink-muted)] uppercase">
            THE TOOLS THAT TEST IT
          </h2>
          <ul className="mt-3">
            {NEURO_PROJECTS.map((e) => (
              <DoorRow key={e.id} to={`/work/${e.id}`} title={e.title} hint="PROJECT" />
            ))}
          </ul>
        </section>

        <section className="mt-8" aria-label="Thought notes around behavior information modeling">
          <h2 className="font-mono text-[9px] font-normal tracking-[0.12em] text-[var(--lang-ink-muted)] uppercase">
            THE NOTES AROUND IT
          </h2>
          <ul className="mt-3">
            {NEURO_THOUGHTS.map((e) => (
              <DoorRow key={e.id} to={e.note!.route} title={e.title} hint={`NOTE · ${e.note!.number ?? ''}`} />
            ))}
          </ul>
        </section>

        <div className="mt-9 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t-[0.5px] border-[var(--lang-hairline)] pt-3.5 font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink-muted)]">
          <Link to="/" viewTransition className={RED_LINK}>
            ‹ BACK TO THE MIND
          </Link>
          <span className="ml-auto">THE SPINE</span>
        </div>
      </article>
    </SheetPage>
  )
}
