// DESIGN LANGUAGE v2 primitive · Surface (see /DESIGN-LANGUAGE.md §5).
// A filleted glass panel, mode-aware via the --lang-* tokens. tier 1 = raised
// (cards, panels), tier 2 = floating (overlays, sheets, menus). Blur + fallback
// live in the .lang-glass-* classes; this component only picks the tier and the
// corner radius. Renders as any element via `as` so it can be a div, article,
// section, etc.
import type { ElementType, ReactNode } from 'react'

const RADIUS = {
  control: 'rounded-[var(--r-control)]',
  image: 'rounded-[var(--r-image)]',
  card: 'rounded-[var(--r-card)]',
  sheet: 'rounded-[var(--r-sheet)]',
} as const

export default function Surface({
  as,
  tier = 1,
  radius = 'card',
  className = '',
  children,
  ...rest
}: {
  as?: ElementType
  tier?: 1 | 2
  radius?: keyof typeof RADIUS
  className?: string
  children?: ReactNode
  // G3: pass-through for aria-* / id / data-* (the NOW module labels itself);
  // the primitive still owns tier + radius + glass.
  [prop: string]: unknown
}) {
  const Tag = as ?? 'div'
  const glass = tier === 2 ? 'lang-glass-2' : 'lang-glass-1'
  return (
    <Tag className={`${glass} ${RADIUS[radius]} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
