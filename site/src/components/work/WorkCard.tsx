// The WORK grid card face (Session R2). The whole card is ONE button that
// opens the preview overlay (no nested interactive children, so it stays a
// single clean tab stop). Six parts, top to bottom: the 4:3 tile (a photo that
// develops grayscale -> colour once, or a quiet typographic tile when a project
// has no photo yet), the lens + quiet number + soft status row, the recognition
// line where real (ink, no box, never red), the title, the one-line dek, and
// the mono tech row. A small cue on the tile hints at what opens (a demo plays,
// an app is live) without breaking the grid's uniform shape.
import { LensTick, LENSES } from '../Lens'
import Img from '../Img'
import { vtName } from '../../lib/viewTransition'
import type { WorkEntry } from '../../data/work'

// The redline "live" dot is the ONE sanctioned use of red here: liveness, the
// pen-in-hand meaning (governance rule 1), never a category. The play cue is
// ink (an affordance, not a live value).
function HeroCue({ entry }: { entry: WorkEntry }) {
  if (entry.hero === 'video') {
    return (
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-2 inline-flex size-7 items-center justify-center rounded-full bg-ink/75 text-mylar"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M2 1 L9 5 L2 9 Z" />
        </svg>
      </span>
    )
  }
  if (entry.hero === 'live') {
    return (
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-2 inline-flex items-center gap-1 bg-ink/75 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.12em] text-mylar"
      >
        <span className="inline-block size-1.5 rounded-full bg-redline-stroke" />
        LIVE
      </span>
    )
  }
  return null
}

// A project with no photograph gets a quiet mylar tile instead of an empty box:
// the lens tick, the title, and a soft note. Honest, gentle placeholder (tone,
// Section 1), and the grid stays one uniform 4:3 shape.
function TypographicTile({ entry }: { entry: WorkEntry }) {
  const hint = entry.hero === 'audio' ? 'LISTEN' : 'PHOTO PENDING'
  return (
    <div className="flex aspect-[4/3] flex-col items-start justify-end gap-2 border-b border-ink/35 bg-mylar p-4">
      <LensTick lens={entry.lens} size={12} />
      <span className="text-lg font-semibold leading-tight text-ink">{entry.title}</span>
      <span className="font-mono text-[8px] tracking-[0.14em] text-anno">{hint}</span>
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
  /** false while THIS entry's overlay is open: the overlay hero holds the
   *  view-transition-name then (one element per name per state). */
  morphSource?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      data-work-card={entry.id}
      aria-haspopup="dialog"
      // The shared-element source: the card face morphs into the preview's
      // hero (page-work-<id>, lib/viewTransition.ts).
      style={{ viewTransitionName: morphSource ? vtName(`/work/${entry.id}`) : undefined }}
      className="group flex h-full w-full flex-col border border-ink/35 bg-mylar text-left transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-redline"
    >
      {entry.cover ? (
        <div className="relative aspect-[4/3] overflow-hidden border-b border-ink/35">
          <Img
            slug={entry.cover.slug}
            name={entry.cover.name}
            alt={entry.cover.alt}
            priority={priority}
            develop
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
            className="block h-full w-full object-cover"
          />
          <HeroCue entry={entry} />
        </div>
      ) : (
        <TypographicTile entry={entry} />
      )}

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[9px] tracking-[0.1em] text-anno">
          <span className="inline-flex items-center gap-1.5">
            <LensTick lens={entry.lens} size={8} />
            {LENSES[entry.lens].label.toUpperCase()}
          </span>
          <span aria-hidden="true">·</span>
          <span>{entry.number}</span>
          {entry.status === 'in-preparation' && (
            <>
              <span aria-hidden="true">·</span>
              <span>IN PREPARATION</span>
            </>
          )}
        </div>

        {entry.recognition && (
          // Recognition, not a stamp: ink, no box, never red (Section 1, rule 1).
          <div className="mb-2 font-mono text-[9px] font-medium tracking-[0.08em] text-ink">
            <span aria-hidden="true">✦ </span>
            {entry.recognition}
          </div>
        )}

        {/* The title carries the interaction signal: a redline underline on
            hover/focus tells the reader the whole card opens (redline = the
            pen-in-hand affordance, rule 1). */}
        <h3 className="mb-1.5 text-lg font-semibold text-ink underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-redline group-focus-visible:decoration-redline">
          {entry.title}
        </h3>
        <p className="mb-3 max-w-[46ch] flex-1 font-serif text-[15px] leading-relaxed text-ink">{entry.dek}</p>
        <div className="font-mono text-[9px] tracking-[0.04em] text-anno">{entry.tech}</div>
      </div>

      <span className="sr-only">Open preview</span>
    </button>
  )
}
