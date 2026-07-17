// The WORK grid card face, re-skinned to Design Language v2 (DL-2, Emilie
// confirmed in chat 2026-07-10): the glass Card primitive. A filleted,
// image-forward face carrying the LEAST: the photo (edge to edge), then a band
// with the name and pills; the award rides the image corner as the ✦ ink pill
// (short wording; the full recognition line lives in the preview). The R2 dek /
// tech / number / status rows moved into the preview (density §7), and the R2
// hero cue (play chip / LIVE chip) retired by Emilie's ruling: what opens is
// revealed in the sheet. The whole card stays ONE button (a single clean tab
// stop).
//
// FINALIZE THE WORK ROOM (Emilie's gates, 2026-07-14):
// - G-COVERS "still + hover-play": every cover sits STILL at rest (an animated
//   webp renders its first frame); it plays only while the pointer rests on
//   the card, and reduced motion always keeps the still (Img handles that).
// - G-FLUFF: the grayscale develop-in ceremony is retired on covers (they
//   arrive in color), and the placeholder tile drops the draft-sounding
//   "PHOTO PENDING" for the project's quiet number (LISTEN stays for audio).
// - G-GRID "full index": the MORE WORK tier renders `dense` — a smaller face,
//   title + lens only — so the tail reads like the printed book's index page.
import { useState } from 'react'
import Card from '../ui/Card'
import Img, { findImage } from '../Img'
import { vtName } from '../../lib/viewTransition'
import type { WorkEntry } from '../../data/work'

// Registry tags are lowercase slugs; the tag pill spec reads sentence-case,
// and the initialisms would read wrong merely capitalised.
const TAG_LABELS: Record<string, string> = { ai: 'AI', xr: 'XR' }
const tagLabel = (t: string) => TAG_LABELS[t] ?? t.charAt(0).toUpperCase() + t.slice(1)

// A project with no photograph gets the quiet tile: the podcast says LISTEN,
// anything else wears its quiet project number (G-FLUFF: "PHOTO PENDING" read
// as an unfinished site). Same tone as the Card primitive's own fallback.
function QuietTile({ entry }: { entry: WorkEntry }) {
  const hint = entry.hero === 'audio' ? 'LISTEN' : entry.number
  return (
    <div className="flex h-full w-full items-center justify-center bg-[color-mix(in_srgb,var(--lang-ink)_5%,transparent)]">
      {/* muted, not faint (G4): faint fell to 3.2:1 on the dark ground */}
      <span className="font-mono text-[10px] tracking-[0.14em] text-[var(--lang-ink-muted)]">{hint}</span>
    </div>
  )
}

export default function WorkCard({
  entry,
  onOpen,
  priority = false,
  morphSource = true,
  dense = false,
}: {
  entry: WorkEntry
  onOpen: () => void
  priority?: boolean
  /** false while THIS entry's overlay is open: the overlay holds the
   *  view-transition-name then (one element per name per state). */
  morphSource?: boolean
  /** the MORE WORK index tier: compact face, title + lens pill only */
  dense?: boolean
}) {
  // Hover-play (G-COVERS): only an animated cover needs the pointer state;
  // the 14 still covers skip the handlers (and the re-renders) entirely.
  const animatedCover = entry.cover
    ? Boolean(findImage(entry.cover.slug, entry.cover.name)?.animated)
    : false
  const [hovered, setHovered] = useState(false)
  const hoverProps = animatedCover
    ? {
        onPointerEnter: () => setHovered(true),
        onPointerLeave: () => setHovered(false),
        // keyboard parity: focusing the card plays the cover too
        onFocus: () => setHovered(true),
        onBlur: () => setHovered(false),
      }
    : undefined
  return (
    <Card
      title={entry.title}
      lens={entry.lens}
      tags={dense ? [] : entry.tags.map(tagLabel)}
      // REINDEX (2026-07-16, Emilie's uniform-grid gate): the dense index face
      // carries the printed index's quiet meta instead of the award pill.
      // S2 ROUND 5 (2026-07-17, her pick of option 4): winner tiles wear the
      // ✦ recognition line under the title, in ink, so the meta drops its
      // now-redundant ✦ and the photo stays clean.
      // S2 ROUND 6 (her pick of option A): the origin stamp rides BEHIND
      // the number, "P-108 · SOMA", so school vs office reads at a glance.
      award={dense ? undefined : entry.awardFace}
      recognition={dense ? entry.awardFace : undefined}
      meta={dense ? `${entry.number} · ${entry.origin}` : undefined}
      aspect="wide"
      dense={dense}
      onOpen={onOpen}
      data-work-card={entry.id}
      // The shared-element source: the card face morphs into the preview
      // sheet (page-work-<id>, lib/viewTransition.ts).
      style={{ viewTransitionName: morphSource ? vtName(`/work/${entry.id}`) : undefined }}
      {...hoverProps}
      image={
        entry.cover ? (
          <Img
            slug={entry.cover.slug}
            name={entry.cover.name}
            alt={entry.cover.alt}
            priority={priority}
            still={!hovered}
            sizes={
              dense
                ? '(max-width: 1024px) 50vw, 235px'
                : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 310px'
            }
            className="block h-full w-full object-cover"
          />
        ) : (
          <QuietTile entry={entry} />
        )
      }
    />
  )
}
