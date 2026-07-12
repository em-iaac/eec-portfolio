// DESIGN LANGUAGE v2 primitive · Card (see /DESIGN-LANGUAGE.md §5 and the
// 2026-07-10 amendment): a SQUARE, filleted, image-forward glass card. The
// image owns the top ~80% edge to edge; the bottom band holds the name, the
// lens pill and up to TWO tags (enforced here, not by caller discipline); an
// award rides the image corner as the ink recognition pill. Everything else
// (dek, tech, numbers, status) lives one layer in, never on the face.
// With onOpen the whole card is ONE button (the R2 rule: a single clean tab
// stop, no nested interactive children); without it, a plain article.
// Extra props (style for a view-transition-name, data-* hooks) pass through to
// the root, so a consumer wires its morph without forking the primitive (DL-2).
import type { CSSProperties, ReactNode } from 'react'
import type { Lens } from '../Lens'
import { LensPill, Pill, StatusPill } from './Pill'

export default function Card({
  title,
  lens,
  tags = [],
  award,
  image,
  onOpen,
  className = '',
  style,
  ...rest
}: {
  title: string
  lens: Lens
  /** sentence-case labels; only the first two render (the face stays quiet) */
  tags?: string[]
  /** e.g. "MaCAD '26" — rendered as the ✦ ink pill on the image corner */
  award?: string
  /** the developing image (an <Img>, <img> or art); omit for the quiet tile */
  image?: ReactNode
  onOpen?: () => void
  className?: string
  style?: CSSProperties
  [prop: string]: unknown
}) {
  const face = (
    <>
      <div className="relative min-h-0 flex-[4] overflow-hidden">
        {image ?? (
          <div className="flex h-full w-full items-center justify-center bg-[color-mix(in_srgb,var(--lang-ink)_5%,transparent)]">
            {/* muted, not faint (G4): faint fell to 3.2:1 on the dark ground */}
            <span className="font-mono text-[10px] tracking-[0.14em] text-[var(--lang-ink-muted)]">
              PHOTO PENDING
            </span>
          </div>
        )}
        {award && (
          <span className="absolute top-2 right-2">
            {/* solid: the pill rides the photograph, so its ink cannot gamble
                its contrast on the image behind (AA floor, §0). */}
            <StatusPill kind="award" solid>
              {award}
            </StatusPill>
          </span>
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-1.5 px-3.5 py-2 text-left">
        <span className="truncate text-[15px] leading-tight font-semibold text-[var(--lang-ink)]">
          {title}
        </span>
        <span className="flex min-w-0 items-center gap-1.5 overflow-hidden">
          <LensPill lens={lens} />
          {tags.slice(0, 2).map(t => (
            <Pill key={t} className="whitespace-nowrap">
              {t}
            </Pill>
          ))}
        </span>
      </div>
    </>
  )

  const skin = `lang-glass-1 lang-lift flex aspect-square w-full flex-col overflow-hidden rounded-[var(--r-card)] transition-colors ${className}`

  if (!onOpen)
    return (
      <article className={skin} style={style} {...rest}>
        {face}
      </article>
    )

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      style={style}
      {...rest}
      className={`${skin} cursor-pointer hover:border-[var(--lang-ink-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lang-interaction)]`}
    >
      {face}
      <span className="sr-only">Open preview</span>
    </button>
  )
}
