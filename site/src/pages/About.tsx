import { Link } from 'react-router-dom'
import SheetPage from '../components/SheetPage'

const BASE = import.meta.env.BASE_URL

// Opening paragraph: approved copy (content/copy-draft.md, "trust for now",
// 2026-07-06), verbatim, no em dashes. The closing availability line was
// softened in Session 5 (FLAG-01): it retires the public open-to STATUS and
// keeps only the invitation, still in Emilie's voice. draftCopy until sign-off.
export default function About() {
  return (
    <SheetPage title="About">
      <div className="grid gap-10 pt-10 pb-8 sm:pt-14 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div>
          <h1 className="mb-5 text-2xl font-semibold tracking-[-0.01em]">About</h1>
          <p className="mb-6 max-w-[62ch] font-serif text-[17px] leading-relaxed">
            I trained as an architect and spent years making buildings look right: towers in Dubai, exhibitions in
            Kuwait, a pavilion at the Venice Biennale. Then I started asking a question none of my software could
            answer: how will this space make someone feel? Chasing it turned me into a Design Technology Architect. Now
            I build the missing tools myself &gt; a copilot that scores comfort across six senses, a browser app that
            reads a floor plan and estimates what it's doing to your cortisol. Is any of this finished science? Not
            even close. But somebody has to teach our models that a facade is a public health decision, and I'd like to
            be first in line.
          </p>

          {/* Skills are CV-only since Session 4 (the block was a verbatim
              duplicate). draftCopy: pointer wording pending Emilie's sign-off. */}
          <p className="mb-8 border-y border-ink/20 py-4 font-mono text-[10.5px] tracking-[0.08em]">
            <Link
              to="/cv"
              viewTransition
              className="-m-2 p-2 text-redline underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline"
            >
              THE FULL TOOLKIT LIVES ON THE CV &gt;
            </Link>
          </p>

          {/* draftCopy (FLAG-01): invitation without a status. */}
          <p className="max-w-[62ch] font-serif text-[17px] leading-relaxed">
            This is the kind of problem I want to spend the next decade on. If your team is trying to make buildings
            answer harder questions, whether that means a role, a research collaboration, or a hand with a computational
            workflow,{' '}
            <a
              href="mailto:chidiacemilie@gmail.com"
              className="text-redline underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-redline"
            >
              let's talk
            </a>
            .
          </p>
        </div>

        <div>
          {/* Placeholder headshot (old site photo, compressed from 4.3MB to web
              weight). Final headshot lands per ASSET-CHECKLIST item 12. */}
          <img
            src={`${BASE}assets/brand/headshot-800.webp`}
            srcSet={`${BASE}assets/brand/headshot-400.webp 400w, ${BASE}assets/brand/headshot-800.webp 800w`}
            sizes="(max-width: 767px) 100vw, 380px"
            alt="Emilie El Chidiac"
            width={800}
            height={1192}
            loading="lazy"
            decoding="async"
            className="w-full border border-ink/35 grayscale transition-[filter] duration-300 hover:grayscale-0 motion-reduce:transition-none"
          />
          <p className="mt-2 font-mono text-[9px] tracking-[0.08em] text-anno">FIG. 01 · THE ARCHITECT</p>
        </div>
      </div>
    </SheetPage>
  )
}
