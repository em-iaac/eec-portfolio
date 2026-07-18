// The WORK grid card face. THE PLATES (WORK PAGE · LOOK & ORDER, Emilie's
// gate 2026-07-18, round-3 board): the index tile now RESTS as a designed ink
// artifact, the project's parti drawn in the Pen Table grammar (artifacts.tsx),
// with the printed index's stamp on top ("P-108 · SOMA"), the lens tick + the
// name below, and the ✦ recognition line where it is real. The real cover is
// ONE hover (or keyboard focus) away: it fades in over the plate and, when the
// cover is animated, starts flipping through the assets (still + hover-play,
// the G-COVERS contract, Img handles reduced motion by always keeping the
// still). Plates everywhere including touch (her call): a tap opens the
// overlay exactly as before, where the full cover leads the sheet.
//
// The whole card stays ONE button (a single clean tab stop); the plate is
// Card's `face` override so the glass skin, the morph plumbing and the button
// semantics stay in the primitive. Print and OG never render plates
// (screen-only by intent; the book keeps true covers).
import { useState } from 'react'
import Card from '../ui/Card'
import Img, { findImage } from '../Img'
import { LENSES, LensTick } from '../Lens'
import { vtName } from '../../lib/viewTransition'
import { WORK_ARTIFACTS } from './artifacts'
import type { WorkEntry } from '../../data/work'
import type { CSSProperties } from 'react'

export default function WorkCard({
  entry,
  onOpen,
  priority = false,
  morphSource = true,
}: {
  entry: WorkEntry
  onOpen: () => void
  priority?: boolean
  /** false while THIS entry's overlay is open: the overlay holds the
   *  view-transition-name then (one element per name per state). */
  morphSource?: boolean
}) {
  // The reveal state: pointer or keyboard focus wakes the tile (every tile
  // now, not only animated covers: the cover itself is behind the plate).
  const [hovered, setHovered] = useState(false)
  const animatedCover = entry.cover
    ? Boolean(findImage(entry.cover.slug, entry.cover.name)?.animated)
    : false

  const plate = (
    <div
      className="work-plate aspect-video w-full"
      style={{ '--plate-accent': LENSES[entry.lens].pen } as CSSProperties}
    >
      <span className="work-plate__num font-mono text-[8px] tracking-[0.1em] text-[var(--lang-ink-muted)]">
        {entry.number} · {entry.origin}
      </span>
      <span className="work-art" aria-hidden="true">
        {/* every project has a signed drawing; a future entry without one
            rests on its quiet number until its plate is drawn */}
        {WORK_ARTIFACTS[entry.id] ?? (
          <span className="font-mono text-[10px] tracking-[0.14em] text-[var(--lang-ink-muted)]">
            {entry.number}
          </span>
        )}
      </span>
      <span className="work-plate__foot">
        <span className="flex min-w-0 items-center gap-1.5 text-[13px] leading-tight font-semibold text-[var(--lang-ink)]">
          <LensTick lens={entry.lens} />
          <span className="truncate">{entry.title}</span>
        </span>
        {entry.awardFace && (
          <span className="truncate font-mono text-[8px] tracking-[0.08em] text-[var(--lang-ink)]">
            <span aria-hidden="true">✦ </span>
            {entry.awardFace}
          </span>
        )}
      </span>
      {entry.cover && (
        <span className={`work-plate__cover ${hovered ? 'is-on' : ''}`} aria-hidden={!hovered}>
          <Img
            slug={entry.cover.slug}
            name={entry.cover.name}
            alt={entry.cover.alt}
            priority={priority}
            still={!hovered || !animatedCover}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            className="block h-full w-full object-cover"
          />
        </span>
      )}
    </div>
  )

  return (
    <Card
      title={entry.title}
      lens={entry.lens}
      aspect="wide"
      dense
      onOpen={onOpen}
      data-work-card={entry.id}
      // The shared-element source: the card face morphs into the preview
      // sheet (page-work-<id>, lib/viewTransition.ts).
      style={{ viewTransitionName: morphSource ? vtName(`/work/${entry.id}`) : undefined }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      // keyboard parity: focusing the card reveals (and plays) the cover too
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      face={plate}
    />
  )
}
