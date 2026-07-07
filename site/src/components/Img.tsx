// srcset helper over the image pipeline output (scripts/optimize-images.mjs).
import type { CSSProperties } from 'react'
import manifest from '../data/images.json'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import useDevelopOnce from '../hooks/useDevelopOnce'

type Variant = { w: number; file: string; kb: number }

type Entry = {
  name: string
  role: string
  aspect: number
  animated?: boolean
  variants: Variant[]
  /** first-frame ladder emitted alongside every animated webp */
  static?: Variant[]
}

const BASE = import.meta.env.BASE_URL

export function findImage(slug: string, name: string): Entry | undefined {
  return (manifest as Record<string, Entry[]>)[slug]?.find(i => i.name === name)
}

export default function Img({
  slug,
  name,
  alt,
  sizes = '(max-width: 700px) 100vw, 640px',
  priority = false,
  develop = false,
  className,
  style,
}: {
  slug: string
  name: string
  alt: string
  sizes?: string
  priority?: boolean
  /** Run the grayscale -> color develop ceremony on first viewport entry
   *  (Session 5). Owns the filter classes so the caller passes layout only. */
  develop?: boolean
  className?: string
  style?: CSSProperties
}) {
  const prm = usePrefersReducedMotion()
  const { ref, developed } = useDevelopOnce(`${slug}/${name}`, develop)
  const entry = findImage(slug, name)
  if (!entry) return null
  // Reduced motion: animated webps render their static first frame instead
  // of looping (governance rule 7 applies to figures too).
  const variants =
    entry.animated && prm && entry.static?.length ? entry.static : entry.variants
  const largest = variants[variants.length - 1]
  if (!largest) return null
  // Develop owns the filter transition; hover no longer colorizes (retired
  // once developed, per the standing rule). Element-level filter only, never
  // root-level (governance rule 7).
  const developCls = develop
    ? `transition-[filter] duration-[500ms] ease-out motion-reduce:transition-none ${
        developed ? 'grayscale-0' : 'grayscale'
      }`
    : ''
  return (
    <img
      ref={develop ? ref : undefined}
      src={BASE + largest.file}
      srcSet={variants.map(v => `${BASE}${v.file} ${v.w}w`).join(', ')}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      width={largest.w}
      height={Math.round(largest.w / entry.aspect)}
      className={develop ? `${className ?? ''} ${developCls}`.trim() : className}
      style={style}
    />
  )
}
