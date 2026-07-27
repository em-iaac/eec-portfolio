// THE FOOTER LINE (DL-1; the design audit round 2, Emilie 2026-07-19: "the
// footer, while frozen and almost full bleed, should still be a PILL, not
// fully full bleed, to keep the same design language"). A frozen wide glass
// pill floating at the foot of the frame: near-full-width with a breath of
// margin, the same stadium the header pill wears, the name lockup + role on
// the left and the contact links on the right. One height on every page that
// carries it (/cv and /about drop it; their contact lives elsewhere).
//
// The contact row is the shared ContactLinks (S6-A, Board 2 grammar B): plain
// text links + app icons under the magnifier, one thing on every surface.
import ContactLinks from './ui/ContactLinks'

export default function Footer({ inFlow = false }: {
  /** THE LANDING'S FOOTER IS NOT CHROME (2026-07-27). On every interior page
   *  this pill is frozen at the foot of the frame, and `.foot-pill` names it
   *  `page-foot` so it holds still through a navigation instead of travelling
   *  with the content. The landing SCROLLS, so its footer sits ~1100px below
   *  the fold: claiming the same name pairs an off-screen box with an
   *  on-screen one, and the browser dutifully flies the footer up across the
   *  whole viewport on the way into /work, and back down on the way out.
   *  In flow, it drops the name and simply cross-fades like the content it
   *  belongs to. The class carries nothing but the name, so nothing is lost. */
  inFlow?: boolean
} = {}) {
  return (
    <footer className="shrink-0 px-3 pt-1 pb-3">
      <div
        className={`lang-glass-1 flex flex-wrap items-center justify-between gap-x-8 gap-y-1 rounded-[var(--r-pill)] px-5 py-2.5 sm:px-7 ${
          inFlow ? '' : 'foot-pill'
        }`}
      >
        <div className="flex min-w-0 flex-col">
          <span className="text-small font-semibold tracking-[0.02em] text-[var(--lang-ink)]">
            EMILIE EL CHIDIAC
          </span>
          <span className="mt-0.5 font-mono text-micro tracking-[0.08em] text-[var(--lang-ink-muted)]">
            DESIGN TECHNOLOGY ARCHITECT
          </span>
        </div>
        <ContactLinks />
      </div>
    </footer>
  )
}
