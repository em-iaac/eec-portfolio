// THE WARM 404 (G4, 2026-07-12, Emilie's ruling at gate 1): an unknown URL
// stops silently teleporting to the cover and instead says where you are,
// with one door back. The line is the spec's own (§2), drafted in Emilie's
// voice. GH Pages serves this through the SPA fallback, so the shell keeps
// the full header: every real door stays one tap away for a lost visitor.
import { Link } from 'react-router-dom'
import SheetPage from '../components/SheetPage'

export default function NotFound() {
  return (
    <SheetPage>
      <section className="pt-10 pb-16 sm:pt-14" aria-labelledby="lost-heading">
        {/* All 404 copy SIGNED by Emilie (G4, 2026-07-12). The room-sign tier
            retired at the audit gate (2026-07-19); the bare status number
            survives because it carries real information the voiced h1 lacks. */}
        <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--lang-ink-muted)] uppercase">
          404
        </p>
        <h1
          id="lost-heading"
          className="mt-3 max-w-[24ch] font-serif text-[30px] font-medium lowercase italic tracking-[-0.01em] text-[var(--lang-ink)]"
        >
          this thought wandered off
        </h1>
        <p className="mt-4 max-w-[52ch] font-serif text-[15px] leading-relaxed text-[var(--lang-ink-muted)]">
          Whatever lived at this address is not here. Everything that is lives one door away.
        </p>
        <p className="mt-8 font-mono text-[10px] tracking-[0.12em]">
          <Link
            to="/"
            viewTransition
            className="-m-2 inline-flex min-h-11 items-center p-2 text-[var(--lang-interaction)] underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-[var(--lang-interaction)]"
          >
            BACK TO THE MIND ›
          </Link>
        </p>
      </section>
    </SheetPage>
  )
}
