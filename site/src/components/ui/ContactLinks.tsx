// THE CONTACT ROW, ONE GRAMMAR SITEWIDE (S6-A tweaks, Emilie 2026-07-24,
// Board 2 option B). Before this the three reach-me links wore three different
// skins: red underlined text on /cv, glass pills under the magnifier on the
// footer + /contact. Now there is ONE row: plain text links, each with its app
// icon, ink at rest and the interaction hue on hover (red = interaction, the
// governance law), wrapped in the magnifier LensGroup so the lens is the only
// glass and slides under whichever link the pointer or keyboard focus is over.
// This is also the single source for the three destinations (they used to be
// copy-pasted per surface). The 44px touch floor rides an invisible min-height
// on each link, the same trick the header labels use. Reduced motion: the lens
// places instantly, nothing magnifies (LensGroup already honours this).
import LensGroup from './LensGroup'
import { MailGlyph, LinkedInGlyph, GitHubGlyph } from './glyphs'

const SOCIALS = [
  { label: 'EMAIL', href: 'mailto:chidiacemilie@gmail.com', Icon: MailGlyph, external: false },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/EmilieElChidiac', Icon: LinkedInGlyph, external: true },
  { label: 'GITHUB', href: 'https://github.com/hi-em', Icon: GitHubGlyph, external: true },
]

export default function ContactLinks({ className = '' }: { className?: string }) {
  return (
    <nav aria-label="Contact" className={className}>
      <LensGroup className="-mx-1 flex flex-wrap items-center">
        {SOCIALS.map(({ label, href, Icon, external }) => (
          <a
            key={label}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="inline-flex min-h-11 items-center gap-1.5 px-2 font-mono text-label tracking-[0.06em] text-[var(--lang-ink)] no-underline hover:text-[var(--lang-interaction)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]"
          >
            <Icon />
            {label}
            {external && <span className="sr-only"> (opens in new tab)</span>}
          </a>
        ))}
      </LensGroup>
    </nav>
  )
}
