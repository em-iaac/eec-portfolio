import { Link } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import Surface from '../components/ui/Surface'
import useDevelopOnce from '../hooks/useDevelopOnce'
import { NOW } from '../data/now'

const BASE = import.meta.env.BASE_URL

const RED_LINK =
  'text-[var(--lang-interaction)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]'

const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
] as const

// 'YYYY-MM' -> 'JULY 2026'. Derived from NOW.date so the module's header can
// never drift from the registry entry it emits.
function nowStamp(date: string): string {
  const [y, m] = date.split('-')
  return `${MONTHS[Number(m) - 1]} ${y}`
}

// THE PERSON PAGE (rebuilt G3, 2026-07-10, Emilie's rulings in-session).
// The h1 CARRIES the pivot (NO intro paragraph under it, sitewide ruling);
// the story prose below is the approved copy VERBATIM (content/copy-draft.md,
// "trust for now", 2026-07-06; softened invitation + CV pointer signed
// Session 11, batch #1). New at G3: the dated NOW module (data/now.ts, the
// same data that renders as the red commit at the CV graph's live tip), and
// the contact invite now opens with a callback line completing the landing's
// "what's on my mind / what's in yours" split. The reading shelf was skipped
// for G3 (Emilie). No public availability status anywhere (FLAG-01).
export default function About() {
  // The headshot joins the sitewide develop-once ceremony (grayscale -> color
  // once, on first sight; reduced motion = color immediately). Hover-colorize
  // retired: About was the last holdout. Brand asset outside images.json, so
  // the hook is used directly rather than through <Img>.
  const { ref, developed } = useDevelopOnce('brand/headshot')

  return (
    <SheetPage title="About">
      <section className="pt-10 sm:pt-14" aria-labelledby="about-heading">
        {/* draftCopy: the kicker wording, unsigned. */}
        <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--lang-ink-muted)] uppercase">
          ABOUT · THE PERSON
        </p>
        {/* draftCopy: the h1 carries the pivot (Emilie picked draft 1 of 3,
            2026-07-10); unsigned until she signs the final wording. */}
        <h1
          id="about-heading"
          className="mt-3 font-serif text-[30px] font-medium lowercase italic tracking-[-0.01em] text-[var(--lang-ink)]"
        >
          the architect who asked one question too many
        </h1>
      </section>

      <div className="grid gap-x-12 gap-y-8 pt-8 pb-16 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* Left column on desktop; on phones the wrappers dissolve
            (display: contents) and the order-* utilities set the single
            column: photo, story, NOW, invite. */}
        <div className="contents md:block">
          <div className="order-2 md:order-none">
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
                duplicate). Pointer wording approved Session 11 (batch #1). */}
            <p className="border-y-[0.5px] border-[var(--lang-hairline)] py-4 font-mono text-[10.5px] tracking-[0.08em]">
              <Link to="/cv" viewTransition className={`-m-2 p-2 ${RED_LINK}`}>
                THE FULL TOOLKIT LIVES ON THE CV &gt;
              </Link>
            </p>
          </div>

          <div id="contact" className="order-4 border-t-[0.5px] border-[var(--lang-hairline)] pt-6 md:order-none md:mt-10">
            {/* draftCopy: the callback line completes the landing's split
                ("this is what's on my mind · what's in yours?"), unsigned. */}
            <p className="font-serif text-[17px] italic leading-relaxed text-[var(--lang-ink)]">
              That's what's on my mind. What's in yours?
            </p>
            {/* FLAG-01: invitation without a status. Approved Session 11
                (batch #1), verbatim. */}
            <p className="mt-3 max-w-[62ch] font-serif text-[17px] leading-relaxed">
              This is the kind of problem I want to spend the next decade on. If your team is trying to make buildings
              answer harder questions, whether that means a role, a research collaboration, or a hand with a computational
              workflow,{' '}
              <a href="mailto:chidiacemilie@gmail.com" className={RED_LINK}>
                let's talk
              </a>
              .
            </p>
          </div>
        </div>

        <div className="contents md:block">
          <figure className="order-1 m-0 md:order-none">
            {/* Placeholder headshot (old site photo, compressed from 4.3MB to
                web weight). Final headshot lands per ASSET-CHECKLIST item 12. */}
            <img
              ref={ref}
              src={`${BASE}assets/brand/headshot-800.webp`}
              srcSet={`${BASE}assets/brand/headshot-400.webp 400w, ${BASE}assets/brand/headshot-800.webp 800w`}
              sizes="(max-width: 767px) 100vw, 380px"
              alt="Emilie El Chidiac"
              width={800}
              height={1192}
              loading="lazy"
              decoding="async"
              className={`w-full border border-ink/35 transition-[filter] duration-500 ease-out motion-reduce:transition-none ${
                developed ? 'grayscale-0' : 'grayscale'
              }`}
            />
            <figcaption className="mt-2 font-mono text-[9px] tracking-[0.08em] text-[var(--lang-ink-muted)]">
              FIG. 01 · THE ARCHITECT
            </figcaption>
          </figure>

          {/* THE NOW MODULE: the page's one glass object. Renders straight
              from data/now.ts; the same data is the newest entry in the
              registry, so this card and the CV graph's red commit can never
              disagree. Update = edit one file. */}
          <Surface
            as="aside"
            tier={1}
            radius="card"
            className="order-3 px-5 py-4 md:order-none md:mt-8"
            aria-labelledby="now-heading"
          >
            <h2 id="now-heading" className="font-mono text-[9px] tracking-[0.1em] text-[var(--lang-ink-muted)]">
              NOW · {nowStamp(NOW.date)}
            </h2>
            {/* draftCopy: the three lines render from now.ts, unsigned. */}
            <dl className="mt-3 grid gap-3">
              {(
                [
                  ['BUILDING', NOW.building],
                  ['READING', NOW.reading],
                  ['THINKING', NOW.thinking],
                ] as const
              ).map(([label, text]) => (
                <div key={label}>
                  <dt className="font-mono text-[9px] tracking-[0.1em] text-[var(--lang-ink-muted)]">{label}</dt>
                  <dd className="m-0 mt-0.5 font-serif text-[15px] leading-relaxed text-[var(--lang-ink)]">{text}</dd>
                </div>
              ))}
            </dl>
          </Surface>
        </div>
      </div>
    </SheetPage>
  )
}
