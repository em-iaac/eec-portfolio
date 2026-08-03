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
import { useState, type PointerEvent as ReactPointerEvent } from 'react'
import Card from '../ui/Card'
import useHasHover from '../../hooks/useHasHover'
import Img, { findImage } from '../Img'
import { LENSES } from '../Lens'
import { LensMark } from '../ui/Pill'
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
  const hasHover = useHasHover()
  const animatedCover = entry.cover
    ? Boolean(findImage(entry.cover.slug, entry.cover.name)?.animated)
    : false

  const plate = (
    <div
      className="work-plate aspect-video w-full"
      style={{ '--plate-accent': LENSES[entry.lens].pen } as CSSProperties}
    >
      {/* THE CATALOGUE NUMBER RETIRED from the face (Emilie's cut, 2026-07-27,
          THE SCROLL gate). "P-108 · SOMA" spent a line on every tile to tell a
          stranger a number that means nothing outside the archive. The ORIGIN
          stamp stays, because school-versus-practice is the one thing that row
          was genuinely saying. The number is untouched everywhere it earns its
          keep: the registry id, the showcase, the printed book's index and the
          OG cards. */}
      <span className="work-plate__num font-mono text-micro tracking-[0.1em] text-[var(--lang-ink-muted)]">
        {entry.origin}
      </span>
      <span className="work-art" aria-hidden="true">
        {/* every project has a signed drawing; a future entry without one
            rests on its quiet number until its plate is drawn */}
        {WORK_ARTIFACTS[entry.id] ?? (
          <span className="font-mono text-label tracking-[0.14em] text-[var(--lang-ink-muted)]">
            {entry.number}
          </span>
        )}
      </span>
      <span className="work-plate__foot">
        <span className="flex min-w-0 items-center gap-1.5 text-small leading-tight font-semibold text-[var(--lang-ink)]">
          <LensMark lens={entry.lens} size={9} />
          <span className="truncate">{entry.title}</span>
        </span>
        {entry.awardFace && (
          <span className="truncate font-mono text-micro tracking-[0.08em] text-[var(--lang-ink)]">
            <span aria-hidden="true">✦ </span>
            {entry.awardFace}
          </span>
        )}
      </span>
      {/* NOT RENDERED WHERE NOTHING CAN HOVER (Emilie's ruling 2026-08-02).
          This <img> only ever becomes visible under a resting pointer, so on a
          touch screen it was 21 images downloaded, decoded and laid out to stay
          at opacity 0 forever: ~250KB on /work as the grid scrolls, and more on
          the landing belts. The photographs are not lost, they lead the sheet
          one tap away, which on a phone is where they can actually be looked
          at. hooks/useHasHover.ts has why the test is hover and not width. */}
      {entry.cover && hasHover && (
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
      // THE TAP LAG (Emilie, 2026-08-02, phone pass; her report: "there is a
      // lag when I press on a project"). pointerenter fires for TOUCH too, so
      // a tap flipped `hovered`, which flipped `still` off, which swapped the
      // srcset from the static rung to the ANIMATED one and made the phone
      // pull 400-720KB (falcon 720, urban-risk 659, verve 604) an instant
      // before it navigated away. Not one frame of it was ever seen. The
      // reveal is a HOVER affordance and hover is a mouse; gating on
      // pointerType keeps it exactly where it works and costs a touch device
      // nothing. Keyboard focus below is untouched, and reveals the still.
      onPointerEnter={(e: ReactPointerEvent) => {
        if (e.pointerType === 'mouse') setHovered(true)
      }}
      onPointerLeave={() => setHovered(false)}
      // keyboard parity: focusing the card reveals (and plays) the cover too
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      face={plate}
    />
  )
}
