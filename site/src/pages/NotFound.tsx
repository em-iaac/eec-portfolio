// THE WARM 404 (G4, 2026-07-12, Emilie's ruling at gate 1): an unknown URL
// stops silently teleporting to the cover and instead says where you are,
// with one door back. The line is the spec's own (§2), drafted in Emilie's
// voice. GH Pages serves this through the SPA fallback, so the shell keeps
// the full header: every real door stays one tap away for a lost visitor.
import { Link } from 'react-router-dom'
import SheetPage from '../components/SheetPage'
import { RED_LINK_ROW } from '../lib/linkStyles'

export default function NotFound() {
  return (
    <SheetPage>
      {/* Centred in the frame with a big status number (Emilie 2026-07-24:
          "nicer in the middle, and the 404 bigger"). SheetPage centres the
          block vertically; items-center + text-center centre it across. */}
      <section className="flex flex-col items-center text-center" aria-labelledby="lost-heading">
        {/* All 404 copy SIGNED by Emilie (G4, 2026-07-12). The bare status
            number carries real information the voiced h1 lacks; now the page's
            hero mark. */}
        <p className="font-mono text-[64px] font-semibold leading-none tracking-[0.02em] text-[var(--lang-ink)] tall:text-[80px]">
          404
        </p>
        <h1
          id="lost-heading"
          className="mt-5 max-w-[24ch] font-serif text-display font-medium lowercase italic tracking-[-0.01em] text-[var(--lang-ink)]"
        >
          this thought wandered off
        </h1>
        <p className="mt-4 max-w-[52ch] font-serif text-body leading-relaxed text-[var(--lang-ink-muted)]">
          Whatever lived at this address is not here. Everything that is lives one door away.
        </p>
        <p className="mt-8 font-mono text-label tracking-[0.12em]">
          <Link
            to="/"
            viewTransition
            className={RED_LINK_ROW}
          >
            BACK TO THE MIND ›
          </Link>
        </p>
      </section>
    </SheetPage>
  )
}
