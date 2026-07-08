// A-000, adjusted per the Session 3 redline memo: Em and the projects first,
// proof before preamble, one logo per page (header only), minimal furniture.
// Hero copy is LOCKED (content/copy-draft.md v1.0): verbatim, no em dashes.
import { Link } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import Kicker from '../components/Kicker'
import RevisionWord from '../components/RevisionWord'
import ProjectCard from '../components/ProjectCard'
import BenchRoll from '../components/BenchRoll'
import { HOME_FEATURED } from '../data/projects'
import { ExploreExitLink } from '../hooks/useExploreTransition'

const BASE = import.meta.env.BASE_URL

const RED_LINK =
  'text-redline underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline'

export default function Home() {
  return (
    <SheetPage title="Design Technology Architect">
      <section className="grid items-center gap-10 pt-12 pb-8 md:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <div>
          <h1 className="mb-5 max-w-[24ch] text-[clamp(1.75rem,4.6vw,2.9rem)] leading-[1.16] font-semibold tracking-[-0.015em] text-balance">
            I started asking buildings a question my software couldn't answer:{' '}
            <span className="font-serif font-medium italic tracking-normal">
              how will this space make someone{' '}
              {/* Ellipse follows the header rule's arrival (650ms rule + beat) */}
              <RevisionWord delayMs={900}>feel?</RevisionWord>
            </span>
          </h1>
          <p className="mb-6 max-w-[58ch] font-serif text-[17.5px] leading-relaxed">
            So I build the missing tools. I'm Emilie El Chidiac, Design Technology Architect.{' '}
            <span className="border border-ink/30 px-1.5 py-0.5 font-mono text-[0.72em]">NeuroSpace</span> reads a
            floor plan and scores its effect on the mind;{' '}
            <span className="border border-ink/30 px-1.5 py-0.5 font-mono text-[0.72em]">Sensi</span>, winner at the
            MaCAD Awards 2026, makes comfort a design layer.
          </p>
          {/* Session 4: '{' retired from running prose; lead now ends in ':'
              (punctuation-only change to locked copy, pending sign-off). */}
          {/* draw-in sequenced after the header rule (650ms) + a beat */}
          <Kicker
            lead="i call where this is going:"
            linkText="Behavior Information Modeling"
            href="https://hi-em.github.io/neurospace"
            note="(opens the live NeuroSpace app)"
            draw
            drawDelayMs={950}
          />
        </div>
        {/* FLAG-02 resolved (Session 11, batch #1): Emilie's call, no caption,
            the headshot framed as a circle. Raw brand headshot keeps
            hover-colorize until the Session 13/16 hero rework; the circular
            crop position is flagged for her eye. */}
        <figure className="m-0 flex justify-center md:justify-end">
          <div className="group aspect-square w-full max-w-[240px] overflow-hidden rounded-full border border-ink/35">
            <img
              src={`${BASE}assets/brand/headshot-800.webp`}
              srcSet={`${BASE}assets/brand/headshot-400.webp 400w, ${BASE}assets/brand/headshot-800.webp 800w`}
              sizes="240px"
              alt="Emilie El Chidiac"
              width={800}
              height={1192}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="block h-full w-full object-cover object-[center_30%] grayscale transition-[filter] duration-[400ms] group-hover:grayscale-0 motion-reduce:transition-none"
            />
          </div>
        </figure>
      </section>

      <section id="work" aria-labelledby="featured-heading" className="border-t border-ink/20 pt-7 pb-8">
        <h2 id="featured-heading" className="mb-5 font-mono text-[11px] tracking-[0.12em] text-anno">
          FEATURED / THE PROOF PAIR
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {HOME_FEATURED.map((p, i) => (
            <ProjectCard key={p.slug} project={p} priority={i === 0} />
          ))}
        </div>
        <p className="mt-6 flex flex-wrap gap-x-7 gap-y-2 font-mono text-[11px] tracking-[0.06em]">
          <Link to="/sheets/p-101" viewTransition className={RED_LINK}>
            SHEET P-101: SENSI &gt;
          </Link>
          <Link to="/sheets/p-104" viewTransition className={RED_LINK}>
            SHEET P-104: A BALLOONING MARKET &gt;
          </Link>
          <ExploreExitLink className={RED_LINK}>OR EXPLORE THE WHOLE MIND &gt;</ExploreExitLink>
        </p>
      </section>

      <BenchRoll />
    </SheetPage>
  )
}
