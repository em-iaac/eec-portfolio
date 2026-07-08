// CINEMA PLATE (Session 8; motion unlock (a) 2026-07-07 + the Sheet cinema
// addendum in DESIGN-SYSTEM.md, signed 2026-07-08). A plate is a FIGURE,
// not new furniture (rule 6): a full-width figure or video block inside an
// ISSUED sheet's main column that pins (native position: sticky only) while
// scroll develops it. The scrubbed develop RATCHETS: it never regresses
// below its high-water mark and persists for the visit through
// lib/develop.ts, the same ledger as the one-shot ceremony. Static mode
// (reduced motion, save-data, low-power via useCinematicMode) renders the
// plain figure with the standing one-shot develop, final states, no
// listeners: the first-class fallback, not a degraded one.
//
// RULE 8 NOTE CAP: a riding `note` is a margin note. The five-per-sheet cap
// counts the MarginNotes aside AND riding plate notes TOGETHER; sheet
// authors keep the sum <= 5. Authoring rule for `bleed`: the plate extends
// under the aside track on lg, so it must sit below the GENERAL NOTES
// stack, which holds by construction because riding notes live inside the
// plate. Videos are never filter-scrubbed (develop applies to stills only).
//
// A PIN MUST EARN ITS HOLD (Session 8 critique ruling): pin only plates
// that reward staring; `flow` renders the same scrubbed develop in normal
// flow, no stage, on every breakpoint. Below lg ALL plates flow (the CSS
// drops the pin): a wide capture pinned in a phone-height stage reads as a
// stamp floating in empty mylar, so phones read the develop as they scroll
// past instead (the manager switches to traversal geometry automatically).
//
// THE PLATE SPEC (Session 9; the foundry default, DESIGN-SYSTEM.md): `still`
// forces the full-bleed ONE-SHOT plate on every device: develop-once (the
// standing ceremony, never scrubbed), no pin, no scroll listener. It is the
// lighter default for the eight foundry sheets (P-103, P-105..P-111) + the
// P-104 retrofit; the scrubbed/pinned cinema above stays reserved for the
// two flagships (P-101, P-102) where motion carries. `still` full-bleeds the
// media the same way the cinematic branch does; a cinematic plate's PRM/
// low-power fallback stays contained (it is a degraded flagship, not a plate
// spec plate).
import { useRef, type CSSProperties } from 'react'
import Img, { findImage } from '../Img'
import SheetVideo, { findVideo } from './SheetVideo'
import useCinematicMode from '../../hooks/useCinematicMode'
import { useScrollScrub } from '../../lib/scrubManager'
import { hasDeveloped, markDeveloped } from '../../lib/develop'

export type PlateMedia =
  | { kind: 'image'; slug: string; name: string; alt: string; position?: string }
  | { kind: 'video'; slug: string; name: string; ariaLabel: string }

// The develop completes at 45% of the pin: the page finishes developing
// while you hold it, then rests before release.
const DEV_RAMP = 0.45

const CAPTION_CLS = 'mt-1.5 font-mono text-[9px] tracking-[0.08em] text-anno'

export default function CinemaPlate({
  media,
  caption,
  note,
  height = 180,
  bleed = false,
  flow = false,
  still = false,
}: {
  media: PlateMedia
  caption: string
  note?: string
  height?: 160 | 180 | 200
  bleed?: boolean
  flow?: boolean
  still?: boolean
}) {
  const cinematic = useCinematicMode()
  // The plate spec opts out of the scrub entirely: `still` is static on every
  // device, so a cinematic-capable phone still gets the one-shot develop.
  const scrub = cinematic && !still
  const ref = useRef<HTMLElement | null>(null)
  const isImage = media.kind === 'image'
  const key = `${media.slug}/${media.name}`
  // Videos start and stay "developed": only stills scrub the filter.
  const devRef = useRef(isImage && !hasDeveloped(key) ? 0 : 1)

  useScrollScrub(
    ref,
    p => {
      const el = ref.current
      if (!el) return
      el.style.setProperty('--p', p.toFixed(4))
      const d = Math.min(1, p / DEV_RAMP)
      if (d > devRef.current) {
        devRef.current = d
        el.style.setProperty('--dev', d.toFixed(4))
        if (d >= 1 && isImage) markDeveloped(key)
      }
    },
    scrub,
  )

  const entry = isImage
    ? findImage(media.slug, media.name)
    : findVideo(media.slug, media.name)
  if (import.meta.env.DEV && !entry) {
    console.warn(`CinemaPlate: no manifest entry for ${media.kind} ${media.slug}/${media.name}`)
  }
  if (!entry) return null

  const mediaEl = isImage ? (
    <Img
      slug={media.slug}
      name={media.name}
      alt={media.alt}
      sizes="(max-width: 700px) 100vw, 900px"
      develop={!scrub}
      style={media.position ? { objectPosition: media.position } : undefined}
      className="block h-full w-full object-cover"
    />
  ) : (
    <SheetVideo
      slug={media.slug}
      name={media.name}
      ariaLabel={media.ariaLabel}
      bare
    />
  )

  const noteEl = note ? (
    <span
      role="note"
      className={`${scrub ? 'plate-note ' : ''}mt-2.5 ml-auto block max-w-[250px] font-hand text-lg leading-[1.3] text-anno`}
    >
      <span className="text-redline">n.b.</span> {note}
    </span>
  ) : null

  const bleedCls = bleed ? ' lg:mr-[calc(-235px-2.25rem)]' : ''

  // Static render: the plate spec (`still`) and every cinematic plate's PRM/
  // low-power fallback. `still` full-bleeds the media to the screen edges
  // below lg (the print IS the page on a phone); the flagship fallback stays
  // contained inside the paper margin.
  if (!scrub) {
    const staticMediaCls = still
      ? '-mx-5 overflow-hidden border border-ink/35 sm:-mx-12 lg:mx-0'
      : 'overflow-hidden border border-ink/35'
    return (
      <figure className={`m-0 mb-[26px]${bleedCls}`}>
        <div className={staticMediaCls} style={{ aspectRatio: entry.aspect }}>
          {mediaEl}
        </div>
        <figcaption className={CAPTION_CLS}>{caption}</figcaption>
        {noteEl}
      </figure>
    )
  }

  // A static/PRM render may have already marked this print developed via the
  // shared ledger (Img's one-shot develop). If the visitor turns reduced
  // motion OFF mid-visit, the cinematic branch must not regress it to
  // grayscale: re-seed the ratchet floor from the ledger at render time, not
  // the stale mount-time ref. Monotonic (only ever raises to 1).
  if (isImage && hasDeveloped(key)) devRef.current = 1

  // Inline vars carry only per-instance initial state; the motion grammar
  // lives in index.css (.plate*). --dev seeds from the ledger so a
  // developed print re-mounts (or re-branches) in color.
  const initialVars = {
    '--p': 0,
    '--dev': devRef.current,
    '--plate-h': `${height}svh`,
  } as CSSProperties

  const inner = (
    <figure className="m-0 w-full">
      {/* Full-bleed to the screen edges below lg: the print IS the page on
          a phone. The sheet frame's paper margin returns at lg. */}
      <div
        className="plate-media -mx-5 overflow-hidden border border-ink/35 sm:-mx-12 lg:mx-0"
        style={{ aspectRatio: entry.aspect }}
      >
        {mediaEl}
      </div>
      <figcaption className={`plate-caption ${CAPTION_CLS}`}>
        {caption}
      </figcaption>
      {noteEl}
    </figure>
  )

  return (
    <section
      ref={ref}
      aria-label={caption}
      className={`${flow ? '' : 'plate '}mb-[26px]${bleedCls}`}
      style={initialVars}
    >
      {flow ? inner : <div className="plate-stage">{inner}</div>}
    </section>
  )
}
