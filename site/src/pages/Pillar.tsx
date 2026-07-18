// THE PILLAR PAGE (S3, 2026-07-13; CONTENT-STRATEGY.md D6 "topical
// authority"). The one definitive Behavior Information Modeling surface:
// the exact phrase rides the slug, the <title> (lib/headData.ts), the <h1>,
// and the first line. The neuro cluster is derived from the registry's
// 'neuro' tag (lib/pillar.ts): every related project and note is a door
// here, and each of those surfaces carries a door back (ThoughtLeaf
// endmatter, WorkOverlay), so the coined term has one canonical source.
//
// DEFINITIVE COPY (S5, 2026-07-18): the A+B blend rewritten question-led at
// Emilie's direction ("what if / maybes / connecting dots"); paragraphs 2-4
// signed at her review, paragraph 1 reworked to open on her chosen question
// while keeping the exact phrase in the first lines (D6), pending her final
// nod. The coinage credit routes to the podcast (the term was coined ON AIR,
// not in the note; the old "note that coined it" reading is corrected).
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
        {/* No room sign here (Emilie, S5 2026-07-18: "fluff"): the recorded
            exception to the DL amendment-9 kicker grammar. The pillar is not
            a nav room; the h1 IS the sign, and the endmatter's THE SPINE
            label keeps the page's identity. */}
        <h1 className="mb-6 max-w-[22ch] font-serif text-[27px] leading-[1.22] font-medium lowercase italic tracking-[-0.01em] text-[var(--lang-ink)]">
          behavior information modeling
        </h1>

        {/* The definitive prose (S5, 2026-07-18). */}
        <div className="max-w-[62ch] font-serif text-[16.5px] leading-[1.75] text-[var(--lang-ink)] [&_p]:mb-[1.15em] [&_p:last-child]:mb-0">
          <p>
            What if how a space will make someone feel could be treated as design data, scored
            and estimated and argued with before anything is built? Behavior information
            modeling is me betting the answer is yes.
          </p>
          <p>
            It started as a what-if. Building Information Modeling has spent thirty years
            tracking every beam, duct, and clash to the millimeter, and the model still can't
            say whether the room underneath settles you or keeps you on edge. Ceiling height,
            daylight, the curve of a wall: what if none of that is decoration? What if it's
            input, and the mind has outputs? Then the fix is almost typographic. Keep the
            letters, change the noun: the B stands for behavior, the person in the room, not
            just the room.
          </p>
          <p>
            The name happened on air. An hour into{' '}
            <Link to="/work/podcast" viewTransition className={RED_LINK}>
              our podcast conversation
            </Link>{' '}
            with Dr. Cleo Valentine, the researcher building the field of architectural
            neuroimmunology, the layer we kept circling still had no name, so we coined one
            mid-sentence and she said she hoped it catches on. Maybe it will. This page is me
            doing my part.
          </p>
          <p>
            But then, the moment you score a feeling you owe people honesty about the score. So
            the claim stays small on purpose: score and estimate, never measure, no clinical
            promises.{' '}
            <a
              href="https://hi-em.github.io/neurospace"
              target="_blank"
              rel="noreferrer"
              className={RED_LINK}
            >
              NeuroSpace
              <span className="sr-only"> (opens in new tab)</span>
            </a>{' '}
            runs the bet live in your browser, scoring plans against published neuroarchitecture
            research; Sensi turns it into a copilot that treats comfort as six coupled senses;
            both show their work and leave you room to argue back. The long version lives in{' '}
            <Link to="/thoughts/bim" viewTransition className={RED_LINK}>
              the note that carries it
            </Link>
            ; every door below is the bet being tested.
          </p>
        </div>

        <section className="mt-10" aria-label="Projects that test behavior information modeling">
          <h2 className="font-mono text-[9px] font-normal tracking-[0.12em] text-[var(--lang-ink-muted)] uppercase">
            THE TOOLS THAT TEST IT
          </h2>
          <ul className="mt-3">
            {NEURO_PROJECTS.map((e) => (
              // The podcast door says what actually opens (Emilie, S5
              // 2026-07-18: "honest hint").
              <DoorRow
                key={e.id}
                to={`/work/${e.id}`}
                title={e.title}
                hint={e.id === 'podcast' ? 'PODCAST' : 'PROJECT'}
              />
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
