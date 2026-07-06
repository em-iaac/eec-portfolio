// Minimal footer (Session 3 memo: one logo per page = header only, no sheet
// number): carbon strip with the name lockup and contact links.
const LINKS = [
  { label: 'EMAIL', href: 'mailto:chidiacemilie@gmail.com' },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/EmilieElChidiac' },
  { label: 'GITHUB', href: 'https://github.com/hi-em' },
]

export default function Footer() {
  return (
    <footer className="mt-16 bg-carbon text-ink-dark">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 gap-y-4 px-5 py-7 sm:px-8">
        <div className="flex flex-col">
          <span className="font-expanded text-xs font-semibold tracking-[0.1em]">EMILIE EL CHIDIAC</span>
          <span className="mt-0.5 font-mono text-[9px] tracking-[0.06em] text-anno-dark">
            DESIGN TECHNOLOGY ARCHITECT
          </span>
        </div>
        <nav aria-label="Contact" className="flex flex-1 flex-wrap items-center justify-start gap-5 sm:justify-end">
          {LINKS.map(l => {
            const external = !l.href.startsWith('mailto')
            return (
              <a
                key={l.label}
                href={l.href}
                target={external ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="-m-3 p-3 font-mono text-[10px] tracking-[0.1em] text-ink-dark no-underline hover:text-redline-wire focus-visible:outline-2 focus-visible:outline-redline-wire"
              >
                {l.label}
                {external && <span className="sr-only"> (opens in new tab)</span>}
              </a>
            )
          })}
        </nav>
      </div>
    </footer>
  )
}
