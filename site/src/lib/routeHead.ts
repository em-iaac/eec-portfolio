// THE PER-ROUTE <head> APPLIER (S1 stopgap, 2026-07-13 -> rebuilt in S3 the
// same day as the client half of the real fix). ALL head values come from
// lib/headData.ts (the single source); this hook only writes them into the
// document on every route change: title, description, canonical, Open Graph,
// and the JSON-LD entity graph.
//
// THE PRERENDER CONTRACT (scripts/prerender.mjs): when the head for the
// current pathname is fully applied (including the description that arrives
// from a lazy content chunk), the hook stamps
// document.documentElement's data-eec-head with that pathname. The build-time
// snapshotter waits for that stamp before capturing, so the static HTML each
// crawler reads is BY CONSTRUCTION this hook's output; the two consumers of
// headData can never drift.
//
// Scattered document.title writers (SheetPage, Work, NeuralWorld,
// LandingCover) retired into this hook at S3: one title source, no effect-
// order races.
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { headForRoute, SITE_NAME, type RouteHead } from './headData'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function removeMeta(attr: 'name' | 'property', key: string) {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove()
}

function setCanonical(href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!href) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(jsonLd: Record<string, unknown>) {
  let el = document.head.querySelector<HTMLScriptElement>('script#eec-schema')
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = 'eec-schema'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(jsonLd)
}

function applyHead(head: RouteHead) {
  document.title = head.title
  setMeta('name', 'description', head.description)
  setMeta('property', 'og:title', head.title)
  setMeta('property', 'og:description', head.description)
  setMeta('property', 'og:type', head.ogType)
  setMeta('property', 'og:site_name', SITE_NAME)
  setMeta('property', 'og:url', head.canonical)
  setMeta('property', 'og:image', head.ogImage)
  setMeta('property', 'og:image:alt', head.ogImageAlt)
  setJsonLd(head.jsonLd)
  if (head.noindex) {
    // Not a page: say so to robots and carry no self-canonical (a 404 must
    // never present itself as a canonical document).
    setMeta('name', 'robots', 'noindex')
    setCanonical(null)
  } else {
    removeMeta('name', 'robots')
    setCanonical(head.canonical)
  }
}

// The whole point runs here on every route change.
export function useRouteHead() {
  const { pathname } = useLocation()

  useEffect(() => {
    let live = true
    delete document.documentElement.dataset.eecHead
    headForRoute(pathname).then((head) => {
      if (!live) return
      applyHead(head)
      document.documentElement.dataset.eecHead = pathname
    })
    return () => {
      live = false
    }
  }, [pathname])
}
