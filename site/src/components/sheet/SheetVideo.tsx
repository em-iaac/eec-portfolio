// Self-hosted video figure (Session 8; SheetVideo entry in DESIGN-SYSTEM.md,
// sanctioned by the Sheet cinema addendum). Reads src/data/videos.json from
// scripts/optimize-videos.mjs. Native controls are ALWAYS present (WCAG
// 2.2.2: the visitor can pause anything that moves, and the pause STICKS).
// Without reduced motion and without a data-saver signal, SILENT clips run
// as muted loops whose play/pause follows viewport visibility; clips with an
// audio track never autoplay at all (sound never autoplays, addendum a11y
// floor). Under reduced motion, save-data, or low-power: poster + controls,
// no autoplay, no loop, preload none. Mono caption in SheetFigure grammar;
// silent captures say so in the caption. `bare` renders only the <video>
// (CinemaPlate supplies the frame + figcaption when the video is a plate).
import { useEffect, useRef } from 'react'
import manifest from '../../data/videos.json'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import { prefersStatic } from '../../hooks/useCinematicMode'

type VideoSource = { file: string; type: string; w: number; h: number; kb: number }
type PosterVariant = { w: number; file: string; kb: number }

export type VideoEntry = {
  name: string
  aspect: number
  duration: number
  audio: boolean
  sources: VideoSource[]
  poster: PosterVariant[]
}

const BASE = import.meta.env.BASE_URL

export function findVideo(slug: string, name: string): VideoEntry | undefined {
  return (manifest as Record<string, VideoEntry[]>)[slug]?.find(v => v.name === name)
}

// Smallest poster rung that covers the rendered size; the smallest under a
// data-saver signal. The ladder was emitted for a reason: use it.
function pickPoster(ladder: PosterVariant[]): PosterVariant | undefined {
  if (ladder.length === 0) return undefined
  if (prefersStatic()) return ladder[0]
  const target =
    (typeof document !== 'undefined' ? document.documentElement.clientWidth : 640) *
    Math.min(typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1, 2)
  return ladder.find(p => p.w >= target) ?? ladder[ladder.length - 1]
}

export default function SheetVideo({
  slug,
  name,
  ariaLabel,
  caption,
  bare = false,
}: {
  slug: string
  name: string
  ariaLabel: string
  caption?: string
  bare?: boolean
}) {
  const prm = usePrefersReducedMotion()
  const ref = useRef<HTMLVideoElement | null>(null)
  const userPaused = useRef(false)
  const ioPausing = useRef(false)
  const entry = findVideo(slug, name)
  if (import.meta.env.DEV && !entry) {
    console.warn(`SheetVideo: no manifest entry for ${slug}/${name}`)
  }

  // A silent clip may loop muted where reduced motion AND data budget allow
  // (addendum + save-data contract); anything with sound waits for the
  // visitor to press play.
  const loops = !prm && !prefersStatic() && entry != null && !entry.audio

  useEffect(() => {
    const el = ref.current
    if (!loops || !el || typeof IntersectionObserver === 'undefined') return
    // Respect an explicit pause: a visitor who paused the loop is not
    // re-started by scrolling back to it (WCAG 2.2.2). Distinguish the
    // visitor's pause from the observer's own via ioPausing.
    const onPause = () => {
      if (!ioPausing.current) userPaused.current = true
    }
    const onPlay = () => {
      userPaused.current = false
    }
    el.addEventListener('pause', onPause)
    el.addEventListener('play', onPlay)
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting && !userPaused.current) el.play().catch(() => {})
          else if (!e.isIntersecting) {
            ioPausing.current = true
            el.pause()
            ioPausing.current = false
          }
        }
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      el.removeEventListener('pause', onPause)
      el.removeEventListener('play', onPlay)
      // A live PRM (or data) flip that turns loops off must stop the motion
      // NOW, not at the clip's natural end (the codebase's PRM doctrine).
      el.pause()
    }
  }, [loops])

  if (!entry) return null
  const src = entry.sources[0]
  if (!src) return null
  const poster = pickPoster(entry.poster)

  const video = (
    <video
      ref={ref}
      controls
      playsInline
      muted={loops}
      loop={loops}
      preload={prm || prefersStatic() ? 'none' : 'metadata'}
      poster={poster ? BASE + poster.file : undefined}
      aria-label={ariaLabel}
      width={src.w}
      height={src.h}
      className="block h-full w-full object-cover"
    >
      {entry.sources.map(s => (
        <source key={s.file} src={BASE + s.file} type={s.type} />
      ))}
    </video>
  )

  if (bare) return video

  return (
    <figure className="m-0">
      <div
        className="overflow-hidden border border-ink/35"
        style={{ aspectRatio: entry.aspect }}
      >
        {video}
      </div>
      {caption && (
        <figcaption className="mt-1.5 font-mono text-[9px] tracking-[0.08em] text-anno">
          {caption}
          {!entry.audio && ' · SILENT CAPTURE'}
        </figcaption>
      )}
    </figure>
  )
}
