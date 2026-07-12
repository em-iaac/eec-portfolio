// The WORK grid card face, re-skinned to Design Language v2 (DL-2, Emilie
// confirmed in chat 2026-07-10): the glass Card primitive. A square, filleted,
// image-forward face carrying the LEAST: the developing photo (~80%, edge to
// edge), then a band with the name, the lens pill and up to two tags; the
// award rides the image corner as the ✦ ink pill (short wording; the full
// recognition line lives in the preview). The R2 dek / tech / number / status
// rows moved into the preview (density §7), and the R2 hero cue (play chip /
// LIVE chip) retired by Emilie's ruling: what opens is revealed in the sheet.
// The whole card stays ONE button (a single clean tab stop).
import Card from '../ui/Card'
import Img from '../Img'
import { vtName } from '../../lib/viewTransition'
import type { WorkEntry } from '../../data/work'

// Registry tags are lowercase slugs; the tag pill spec reads sentence-case,
// and the initialisms would read wrong merely capitalised.
const TAG_LABELS: Record<string, string> = { ai: 'AI', xr: 'XR' }
const tagLabel = (t: string) => TAG_LABELS[t] ?? t.charAt(0).toUpperCase() + t.slice(1)

// A project with no photograph gets the quiet tile, honest about why it is
// quiet: the podcast says LISTEN, anything else says PHOTO PENDING. Same tone
// as the Card primitive's own fallback, different words.
function QuietTile({ entry }: { entry: WorkEntry }) {
  const hint = entry.hero === 'audio' ? 'LISTEN' : 'PHOTO PENDING'
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
}: {
  entry: WorkEntry
  onOpen: () => void
  priority?: boolean
  /** false while THIS entry's overlay is open: the overlay holds the
   *  view-transition-name then (one element per name per state). */
  morphSource?: boolean
}) {
  return (
    <Card
      title={entry.title}
      lens={entry.lens}
      tags={entry.tags.map(tagLabel)}
      award={entry.awardFace}
      onOpen={onOpen}
      data-work-card={entry.id}
      // The shared-element source: the card face morphs into the preview
      // sheet (page-work-<id>, lib/viewTransition.ts).
      style={{ viewTransitionName: morphSource ? vtName(`/work/${entry.id}`) : undefined }}
      image={
        entry.cover ? (
          <Img
            slug={entry.cover.slug}
            name={entry.cover.name}
            alt={entry.cover.alt}
            priority={priority}
            develop
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
            className="block h-full w-full object-cover"
          />
        ) : (
          <QuietTile entry={entry} />
        )
      }
    />
  )
}
