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
  id,
  outline,
  children,
}: {
  orientation?: 'landscape' | 'portrait'
  className?: string
  /** THE LINKS PASS (2026-08-16). A page id is the anchor an in-document link
      lands on: headless Chrome turns a same-page href="#id" into a real PDF
      link annotation with a destination, which is how the about page's
      contents rows jump to their plate inside the file. Optional, because
      only the pages something points AT need one. */
  id?: string
  /** THE BOOKMARK PANEL (2026-08-16). A page that names itself here becomes a
      row in the reader's outline. Only pages a reader would JUMP to carry one
      (the cover, the about, the eight projects, the index, the colophon): an
      asset page is the back of its plate, not a chapter of its own, so it
      stays out of the panel and the panel stays 12 rows rather than 20.
      render-pdfs.mjs reads these off the printed DOM, which is what keeps the
      outline and the book in the same order by construction. */
  outline?: string
  children: ReactNode
}) {
  return (
    <div
      id={id}
      data-outline={outline}
      className={`pr-page pr-page--${orientation}${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  )
}
