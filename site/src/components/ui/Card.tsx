// DESIGN LANGUAGE v2 primitive · Card (see /DESIGN-LANGUAGE.md §5 and the
// 2026-07-10 amendment, updated S4a 2026-07-13): a filleted, image-forward
// glass card. The image owns the top edge to edge; the bottom band holds the
// name, the lens pill and up to TWO tags (enforced here, not by caller
// discipline); an award rides the image corner as the ink recognition pill.
// Everything else (dek, tech, numbers, status) lives one layer in, never on
// the face. With onOpen the whole card is ONE button (the R2 rule: a single
// clean tab stop, no nested interactive children); without it, a plain article.
// Extra props (style for a view-transition-name, data-* hooks) pass through to
// the root, so a consumer wires its morph without forking the primitive (DL-2).
//
// SHAPE (S4a, Emilie 2026-07-13, visualised + confirmed): the DL-0 square is
// now opt-out. `/work` requests `aspect="wide"` so the whole gallery runs
// LANDSCAPE like the book plates (and the new book-spread showcase); the
// dev-only Lab keeps the square default. Wide = a 16:10 image over an
// auto-height band; square = the original 80/20 flex split.
import type { CSSProperties, ReactNode } from 'react'
import type { Lens } from '../Lens'
import { LensPill, Pill, StatusPill } from './Pill'

export default function Card({
  title,
  lens,
  tags = [],
  award,
  image,
  aspect = 'square',
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
  /** 'square' (DL-0 default) or 'wide' (S4a landscape, the /work gallery) */
  aspect?: 'square' | 'wide'
  onOpen?: () => void
  className?: string
  style?: CSSProperties
  [prop: string]: unknown
}) {
  const wide = aspect === 'wide'
  const face = (
    <>
      <div className={`relative overflow-hidden ${wide ? 'aspect-[16/10] w-full' : 'min-h-0 flex-[4]'}`}>
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
      <div className={`flex flex-col justify-center gap-1.5 px-3.5 text-left ${wide ? 'py-3' : 'min-h-0 flex-1 py-2'}`}>
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

  const skin = `lang-glass-1 lang-lift flex w-full flex-col overflow-hidden rounded-[var(--r-card)] transition-colors ${wide ? '' : 'aspect-square'} ${className}`

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
