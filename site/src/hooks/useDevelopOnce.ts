// THE DEVELOP CEREMONY (Session 5, standing rule 2026-07-07). An image
// "develops" grayscale -> color exactly once, the first time it enters the
// viewport, on ALL devices (the ceremony is FOR phones, where there is no
// hover). Once developed, hover-colorize is retired: the image stays in color.
//
// Persistence: `developed` is a module-level Set keyed by image identity, so a
// figure that has developed stays developed when you leave a route and return
// within the same visit (a fresh page load starts the visit over). Two
// instances of the same image share the key: whichever enters view first marks
// it, the other renders in color on its next mount.
//
// Reduced motion: full color immediately, no observer, final state (rule 7).
import { useEffect, useRef, useState } from 'react'
import usePrefersReducedMotion from './usePrefersReducedMotion'

const developed = new Set<string>()

export default function useDevelopOnce(key: string, enabled = true) {
  const prm = usePrefersReducedMotion()
  const ref = useRef<HTMLImageElement | null>(null)
  const [isDeveloped, setIsDeveloped] = useState(() => prm || developed.has(key))

  useEffect(() => {
    // Disabled callers never touch the shared set (so they can't suppress the
    // ceremony for a develop-enabled instance sharing the same key).
    if (!enabled) return
    // Reduced motion or already-developed (route return): color, no ceremony.
    if (prm || developed.has(key)) {
      developed.add(key)
      setIsDeveloped(true)
      return
    }
    const el = ref.current
    // No element or no observer support: skip straight to the final state.
    if (!el || typeof IntersectionObserver === 'undefined') {
      developed.add(key)
      setIsDeveloped(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            developed.add(key)
            setIsDeveloped(true)
            io.disconnect()
            return
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [key, prm, enabled])

  return { ref, developed: isDeveloped }
}
