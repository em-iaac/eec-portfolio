// srcset helper over the image pipeline output (scripts/optimize-images.mjs).
import type { CSSProperties } from 'react'
import manifest from '../data/images.json'

type Entry = {
  name: string
  role: string
  aspect: number
  animated?: boolean
  variants: { w: number; file: string; kb: number }[]
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
  className,
  style,
}: {
  slug: string
  name: string
  alt: string
  sizes?: string
  priority?: boolean
  className?: string
  style?: CSSProperties
}) {
  const entry = findImage(slug, name)
  if (!entry) return null
  const largest = entry.variants[entry.variants.length - 1]
  return (
    <img
      src={BASE + largest.file}
      srcSet={entry.variants.map(v => `${BASE}${v.file} ${v.w}w`).join(', ')}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      width={largest.w}
      height={Math.round(largest.w / entry.aspect)}
      className={className}
      style={style}
    />
  )
}
