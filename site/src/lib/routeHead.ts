// PER-ROUTE <head> STOPGAP (S1, 2026-07-13). The SPA ships ONE static
// index.html, so every route inherited the landing's <meta name="description">,
// a missing <link rel="canonical">, and an og:url still pointing at "/". A
// shared /work/:id or /thoughts/:id link therefore previewed as the homepage
// and gave crawlers no per-page signal. This hook rewrites those tags on every
// client-side route change so shared links stop being wrong.
//
// THIS IS NOT THE REAL FIX. Crawlers that do not execute JS still see the
// static index.html; the true per-route prerender to static HTML (unique
// title + description + canonical + per-route Open Graph image + JSON-LD) is
// S3 (CONTENT-STRATEGY.md D6 / REDESIGN-SPEC R9). This only makes the live
// SPA and JS-executing social scrapers less wrong meanwhile.
//
// ECONOMY (CONTENT-STRATEGY.md §0): descriptions are SEEDED from the single
// source, never hardcoded per project. A project's is its signed `dek`; a
// thought's is its signed note opening. Only the four index pages carry a
// short authored page description (drafted here, flagged for Emilie). The
// heavy project/thought content is pulled from the SAME lazy chunks the pages
// already load (dynamic import), so the landing entry chunk stays lean and the
// LCP work from 2026-07-12 is preserved.
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ENTRIES } from '../data/registry'

const SITE_ORIGIN = 'https://emiliechidiac.com'
const SUFFIX = ' | Emilie El Chidiac'

// The four index-page descriptions are the only NEW copy here: authored to
// carry the standard-vocabulary keywords a screener filters for (computational
// design, design technology, neuroarchitecture) in natural prose. DRAFT,
// pending Emilie's sign-off (S1). The hero question + spine copy stay locked.
const PAGE_DESCRIPTIONS: Record<string, string> = {
  '/work':
    'Selected computational design and design-technology work by Emilie El Chidiac: comfort copilots, neuroarchitecture tools, and parametric studies, each linked to its live app, repo, or writeup.',
  '/thoughts':
    'Short essays by Emilie El Chidiac on neuroarchitecture, computational design, and behavior information modeling: the thinking behind the tools.',
  '/about':
    'Emilie El Chidiac is a Design Technology Architect building computational tools that model how architecture affects the people inside it.',
  '/cv':
    'The CV of Emilie El Chidiac, Design Technology Architect: computational design, neuroarchitecture research, and AI-assisted tools. Download the PDF.',
}

const PAGE_TITLES: Record<string, string> = {
  '/work': 'Work',
  '/thoughts': 'Thoughts',
  '/about': 'About',
  '/cv': 'CV',
}

// Registry lookups for the dynamic families (title is available synchronously;
// the precise description arrives from the page's own chunk a beat later).
const PROJECT_TITLE_BY_ID = new Map(
  ENTRIES.filter((e) => e.kind === 'project').map((e) => [e.id, e.title]),
)
const THOUGHT_TITLE_BY_ID = new Map(
  ENTRIES.filter((e) => e.kind === 'thought').map((e) => [e.id, e.title]),
)

// The defaults baked into index.html ARE the landing/default values. Snapshot
// them once so "/" and any unknown route restore them without duplicating the
// signed landing string in this file (index.html stays its single source).
let defaults: { description: string; ogTitle: string; ogDescription: string } | null = null
function readDefaults() {
  if (defaults) return defaults
  defaults = {
    description: getMeta('name', 'description') ?? '',
    ogTitle: getMeta('property', 'og:title') ?? '',
    ogDescription: getMeta('property', 'og:description') ?? '',
  }
  return defaults
}

function getMeta(attr: 'name' | 'property', key: string): string | null {
  return document.head.querySelector(`meta[${attr}="${key}"]`)?.getAttribute('content') ?? null
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

// A self-referencing absolute URL: origin + path, no trailing slash except at
// root, query/hash stripped (canonical must name the page, not the view).
function absoluteUrl(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '')
  return SITE_ORIGIN + (clean === '' ? '/' : clean)
}

// Meta descriptions display ~155 chars; a note opening can run longer, so trim
// at a word boundary and mark the cut. Never mid-word, never a bare ellipsis.
function clamp(text: string, max = 155): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.]+$/, '') + '…'
}

function applyHead({
  description,
  ogTitle,
}: {
  description: string
  ogTitle: string
}) {
  setMeta('name', 'description', description)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:title', ogTitle)
}

// The whole point of the stopgap runs here on every route change.
export function useRouteHead() {
  const { pathname } = useLocation()

  useEffect(() => {
    const def = readDefaults()
    const canonical = absoluteUrl(pathname)
    setCanonical(canonical)
    setMeta('property', 'og:url', canonical)

    // /work/:id and /thoughts/:id are the routes whose stale head hurt most
    // (a shared project or note link previewed as the homepage). Their precise
    // copy lives in the page's lazy chunk; set the title synchronously from the
    // registry, then resolve the exact description without bloating the entry.
    const projectMatch = pathname.match(/^\/work\/([^/]+)$/)
    if (projectMatch) {
      const id = projectMatch[1]!
      const title = PROJECT_TITLE_BY_ID.get(id)
      if (title) {
        let live = true
        applyHead({ description: def.description, ogTitle: title + SUFFIX })
        import('../data/work')
          .then((m) => {
            if (!live) return
            const dek = m.workEntryById(id)?.dek
            if (dek) applyHead({ description: dek, ogTitle: title + SUFFIX })
          })
          .catch(() => {})
        return () => {
          live = false
        }
      }
    }

    const thoughtMatch = pathname.match(/^\/thoughts\/([^/]+)$/)
    if (thoughtMatch) {
      const id = thoughtMatch[1]!
      const title = THOUGHT_TITLE_BY_ID.get(id)
      if (title) {
        let live = true
        applyHead({ description: def.description, ogTitle: title + SUFFIX })
        import('../thoughts/openings')
          .then((m) => {
            if (!live) return
            const opening = m.THOUGHT_OPENINGS[id]
            if (opening) applyHead({ description: clamp(opening), ogTitle: title + SUFFIX })
          })
          .catch(() => {})
        return () => {
          live = false
        }
      }
    }

    // The static index pages: authored page description + plain title.
    if (PAGE_DESCRIPTIONS[pathname]) {
      applyHead({
        description: PAGE_DESCRIPTIONS[pathname]!,
        ogTitle: PAGE_TITLES[pathname]! + SUFFIX,
      })
      return
    }

    // "/" and everything else (the 404, redirects mid-flight) restore the
    // signed landing defaults from index.html.
    applyHead({ description: def.description, ogTitle: def.ogTitle })
  }, [pathname])
}
