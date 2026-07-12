// G5 · the page primitive. An exact A4 box (overflow hidden + break-after,
// so headless Chrome never mints the classic blank trailing page). SIDE is
// the binding truth (REDESIGN-SPEC §8: plates bleed the OUTSIDE edge only,
// never the bound gutter): the book binds on its short left edge, so odd
// pages (recto) gutter LEFT and bleed RIGHT; even pages (verso) mirror.
// Page components read `side` to place their gutter margin and their bleed.
import type { ReactNode } from 'react'

export type PageSide = 'recto' | 'verso'

export function sideOf(pageNumber: number): PageSide {
  return pageNumber % 2 === 1 ? 'recto' : 'verso'
}

export default function A4Page({
  orientation = 'landscape',
  className,
  children,
}: {
  orientation?: 'landscape' | 'portrait'
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`pr-page pr-page--${orientation}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}
