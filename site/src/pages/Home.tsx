import { Link } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import LogoMark from '../components/LogoMark'
import Kicker from '../components/Kicker'
import RevisionWord from '../components/RevisionWord'
import ProjectCard from '../components/ProjectCard'
import { Legend } from '../components/Lens'
import { HEROES } from '../data/projects'

// Hero copy is LOCKED (content/copy-draft.md v1.0): verbatim, no em dashes.
const FEATURED = ['sensi', 'neurospace']

export default function Home() {
  return (
    <SheetPage sheet="A-000" title="Design Technology Architect">
      <section className="grid gap-8 pt-12 pb-10 sm:pt-16 md:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <div>
          <h1 className="mb-6 max-w-[24ch] text-[clamp(1.75rem,4.6vw,2.9rem)] leading-[1.16] font-semibold tracking-[-0.015em] text-balance">
            I started asking buildings a question my software couldn't answer:{' '}
            <span className="font-serif font-medium italic tracking-normal">
              how will this space make someone <RevisionWord>feel?</RevisionWord>
            </span>
          </h1>
          <p className="mb-7 max-w-[58ch] font-serif text-[17.5px] leading-relaxed">
            So I build the missing tools. I'm Emilie El Chidiac, Design Technology Architect.{' '}
            <span className="border border-ink/30 px-1.5 py-0.5 font-mono text-[0.72em]">NeuroSpace</span> reads a
            floor plan and scores its effect on the mind;{' '}
            <span className="border border-ink/30 px-1.5 py-0.5 font-mono text-[0.72em]">Sensi</span>, winner at the
            MaCAD Awards 2026, makes comfort a design layer.
          </p>
          <Kicker
            lead="i call where this is going {"
            linkText="Behavior Information Modeling"
            href="https://hi-em.github.io/neurospace"
            note="(opens the live NeuroSpace app)"
          />
        </div>
        <div className="hidden items-center justify-center md:flex">
          <LogoMark size={190} animated />
        </div>
      </section>

      <section aria-label="Project lenses" className="border-t border-ink/20 py-6">
        <Legend mode="route" />
      </section>

      <section aria-labelledby="featured-heading" className="py-8">
        <h2 id="featured-heading" className="mb-5 font-mono text-[11px] tracking-[0.12em] text-anno">
          FEATURED / THE PROOF PAIR
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {HEROES.filter(p => FEATURED.includes(p.slug)).map((p, i) => (
            <ProjectCard key={p.slug} project={p} priority={i === 0} />
          ))}
        </div>
        <p className="mt-6 font-mono text-[11px] tracking-[0.06em]">
          <Link
            to="/work"
            className="text-redline underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline"
          >
            FULL DRAWING SET: WORK &gt;
          </Link>
        </p>
      </section>
    </SheetPage>
  )
}
