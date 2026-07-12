// G5 · the print route's document plumbing. Sets the tab/PDF-metadata
// title, keeps crawlers out (belt to robots.txt's braces: the SPA cannot
// per-route noindex statically), and reports readiness one frame after
// mount so the render script's waitForSelector('[data-print-ready]')
// can never race the theme pin or first paint.
import { useEffect, useState } from 'react'

export default function usePrintDoc(title: string): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    document.title = title

    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)

    const id = requestAnimationFrame(() => setReady(true))
    return () => {
      cancelAnimationFrame(id)
      meta.remove()
    }
  }, [title])

  return ready
}
