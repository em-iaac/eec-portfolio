// THE SINGLE-SOURCE HEAD MODULE (S3, 2026-07-13; CONTENT-STRATEGY.md D6,
// REDESIGN-SPEC R9). ONE function answers "what does this route's <head>
// say": title, description, canonical, Open Graph card, and the JSON-LD
// entity graph, all read from the registry + the master content files.
//
// TWO CONSUMERS, ZERO DRIFT: lib/routeHead.ts applies this on every client
// navigation, and scripts/prerender.mjs snapshots each route AFTER that
// application, so the static HTML crawlers read is by construction the same
// head the SPA maintains. Nothing re-implements these values anywhere.
//
// ECONOMY: descriptions are renditions of the single source. A project's is
// its authored QUESTION the moment S4/S5 lands one in the master file, the
// signed dek until then (D4: the question does triple duty as claim, meta
// description, and search hook). A thought's is its signed note opening.
// The heavy content chunks arrive via the SAME dynamic imports the pages
// use, so the landing entry stays lean (the 2026-07-12 LCP work holds).
import { ENTRIES } from '../data/registry'
import { SITE_ORIGIN } from './routes'
import { PILLAR_PATH, PILLAR_PHRASE } from './pillar'

export interface RouteHead {
  /** the full <title> text */
  title: string
  description: string
  /** self-referencing absolute URL (origin + path, no trailing slash) */
  canonical: string
  ogType: 'website' | 'article'
  /** absolute URL of the route's share card */
  ogImage: string
  ogImageAlt: string
  /** set only on the not-a-page head (the 404) */
  noindex?: boolean
  /** the route's whole JSON-LD graph, ready to stringify */
  jsonLd: Record<string, unknown>
}

const SUFFIX = ' | Emilie El Chidiac'

// The landing strings. index.html carries the same values statically (the
// pre-JS first paint); lib/headData.test.ts asserts the two never drift.
export const LANDING_TITLE = 'Emilie El Chidiac | Design Technology Architect'
export const LANDING_DESCRIPTION =
  "Computational tools that model how architecture affects the people inside it, and change the design before it's built."
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og.png`
const DEFAULT_OG_ALT =
  'Emilie El Chidiac, Design Technology Architect: the EEC constellation cube mark, a graph cube with one red node'

// The four index-page descriptions (authored in S1, still DRAFT pending
// Emilie's sign-off) + the pillar's placeholder line (S3 DRAFT; S5 writes
// the definitive pillar copy). Standard-vocabulary keywords in natural
// prose; verbs score / model, never measure; no em dashes.
const PAGE_DESCRIPTIONS: Record<string, string> = {
  '/work':
    'Selected computational design and design-technology work by Emilie El Chidiac: comfort copilots, neuroarchitecture tools, and parametric studies, each linked to its live app, repo, or writeup.',
  '/thoughts':
    'Short essays by Emilie El Chidiac on neuroarchitecture, computational design, and behavior information modeling: the thinking behind the tools.',
  '/about':
    'Emilie El Chidiac is a Design Technology Architect building computational tools that model how architecture affects the people inside it.',
  '/cv':
    'The CV of Emilie El Chidiac, Design Technology Architect: computational design, neuroarchitecture research, and AI-assisted tools. Download the PDF.',
  [PILLAR_PATH]:
    'Behavior information modeling treats how a space will make someone feel as design data: score it, model it, and change the building before it is built.',
}

const PAGE_TITLES: Record<string, string> = {
  '/work': 'Work' + SUFFIX,
  '/thoughts': 'Thoughts' + SUFFIX,
  '/about': 'About' + SUFFIX,
  '/cv': 'CV' + SUFFIX,
  [PILLAR_PATH]: PILLAR_PHRASE + SUFFIX,
}

// ---- The entity graph -------------------------------------------------------
// ONE Person node (@id anchored) travels on every route; each page adds its
// own @id-linked node with author/mainEntity pointing back at it, so the
// whole site reads as one graph about one person (D6: entity consistency is
// the top name-ranking lever). alternateName carries both public forms of
// the name; sameAs is the profile cluster (no Scholar profile exists yet;
// add it here the day one does).
const PERSON_ID = `${SITE_ORIGIN}/#person`
const WEBSITE_ID = `${SITE_ORIGIN}/#website`

const PERSON = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Emilie El Chidiac',
  alternateName: ['Emilie Chidiac', 'Emilie El Chidiac'],
  url: SITE_ORIGIN + '/',
  jobTitle: 'Design Technology Architect',
  knowsAbout: ['neuroarchitecture', 'computational design', 'behavior information modeling'],
  email: 'mailto:chidiacemilie@gmail.com',
  sameAs: [
    'https://www.linkedin.com/in/EmilieElChidiac',
    'https://github.com/hi-em',
    'https://open.spotify.com/episode/6WpF5HmKteEBateSqSWe0D',
  ],
} as const

const WEBSITE = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_ORIGIN + '/',
  name: 'Emilie El Chidiac',
  publisher: { '@id': PERSON_ID },
} as const

function graph(...nodes: Record<string, unknown>[]): Record<string, unknown> {
  return { '@context': 'https://schema.org', '@graph': [PERSON, WEBSITE, ...nodes] }
}

function pageNode(
  type: 'WebPage' | 'CollectionPage' | 'ProfilePage',
  canonical: string,
  name: string,
  description: string,
): Record<string, unknown> {
  return {
    '@type': type,
    '@id': canonical,
    url: canonical,
    name,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    ...(type === 'ProfilePage' ? { mainEntity: { '@id': PERSON_ID } } : { about: { '@id': PERSON_ID } }),
  }
}

// ---- Helpers ---------------------------------------------------------------

function absoluteUrl(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '')
  return SITE_ORIGIN + (clean === '' ? '/' : clean)
}

// Meta descriptions display ~155 chars; a note opening can run longer, so
// trim at a word boundary and mark the cut. Never mid-word, never a bare
// ellipsis.
function clamp(text: string, max = 155): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.]+$/, '') + '…'
}

// The share-card file each route carries: the statics share the site card
// (og.png, DL section 4.5); every project, thought, and the pillar get their
// own generated card (scripts/prerender.mjs renders /print/og/<key> to
// /og/<key>.png). ogCardKey names both the print route and the file, so the
// convention lives in exactly one place.
export function ogCardKey(pathname: string): string | null {
  const project = pathname.match(/^\/work\/([^/]+)$/)
  if (project) return `work-${project[1]}`
  const thought = pathname.match(/^\/thoughts\/([^/]+)$/)
  if (thought) return `thought-${thought[1]}`
  if (pathname === PILLAR_PATH) return 'pillar'
  return null
}

const ogCardUrl = (key: string) => `${SITE_ORIGIN}/og/${key}.png`

// Registry lookups (synchronous: the registry rides the entry chunk anyway).
const PROJECT_BY_ID = new Map(ENTRIES.filter((e) => e.kind === 'project').map((e) => [e.id, e]))
const THOUGHT_BY_ID = new Map(
  ENTRIES.filter((e) => e.kind === 'thought' && e.note?.status === 'drafted').map((e) => [e.id, e]),
)

// ---- The one resolver -------------------------------------------------------
// Returns the not-a-page head for anything that is honestly not a page
// (the warm 404 bakes it; unknown client routes apply it live). Retired
// redirect routes (/notebook, /explore, /sheets) pass through here for a
// beat before the SPA lands on their target; the momentary head is the
// not-a-page one, which is honest for the address itself.
export async function headForRoute(pathname: string): Promise<RouteHead> {
  const path = pathname.replace(/\/+$/, '') || '/'
  const canonical = absoluteUrl(path)

  if (path === '/') {
    return {
      title: LANDING_TITLE,
      description: LANDING_DESCRIPTION,
      canonical,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: DEFAULT_OG_ALT,
      jsonLd: graph(pageNode('WebPage', canonical, LANDING_TITLE, LANDING_DESCRIPTION)),
    }
  }

  const projectMatch = path.match(/^\/work\/([^/]+)$/)
  if (projectMatch && PROJECT_BY_ID.has(projectMatch[1]!)) {
    const entry = PROJECT_BY_ID.get(projectMatch[1]!)!
    // The precise copy lives in the work chunk (the same one /work loads).
    const work = (await import('../data/work')).workEntryById(entry.id)
    const description = clamp(work?.question ?? work?.dek ?? LANDING_DESCRIPTION)
    const title = entry.title + SUFFIX
    const ogImage = ogCardUrl(ogCardKey(path)!)
    return {
      title,
      description,
      canonical,
      ogType: 'article',
      ogImage,
      ogImageAlt: clamp(`${entry.title} by Emilie El Chidiac: ${description}`, 140),
      jsonLd: graph({
        '@type': 'CreativeWork',
        '@id': `${canonical}#work`,
        name: entry.title,
        url: canonical,
        description,
        image: ogImage,
        dateCreated: entry.date,
        author: { '@id': PERSON_ID },
        mainEntityOfPage: canonical,
        isPartOf: { '@id': WEBSITE_ID },
      }),
    }
  }

  const thoughtMatch = path.match(/^\/thoughts\/([^/]+)$/)
  if (thoughtMatch && THOUGHT_BY_ID.has(thoughtMatch[1]!)) {
    const entry = THOUGHT_BY_ID.get(thoughtMatch[1]!)!
    const openings = (await import('../thoughts/openings')).THOUGHT_OPENINGS
    const description = clamp(openings[entry.id] ?? LANDING_DESCRIPTION)
    // The T-number rides the title (the leaf's own grammar). It also keeps
    // the bim note's title distinct from the pillar page's.
    const title = `${entry.title} · ${entry.note!.number}` + SUFFIX
    const ogImage = ogCardUrl(ogCardKey(path)!)
    return {
      title,
      description,
      canonical,
      ogType: 'article',
      ogImage,
      ogImageAlt: clamp(`${entry.title}, a thought note by Emilie El Chidiac: ${description}`, 140),
      jsonLd: graph({
        '@type': 'Article',
        '@id': `${canonical}#article`,
        headline: entry.title,
        url: canonical,
        description,
        image: ogImage,
        datePublished: entry.date,
        inLanguage: 'en',
        author: { '@id': PERSON_ID },
        mainEntityOfPage: canonical,
        isPartOf: { '@id': WEBSITE_ID },
      }),
    }
  }

  if (path === PILLAR_PATH) {
    const description = PAGE_DESCRIPTIONS[PILLAR_PATH]!
    const ogImage = ogCardUrl('pillar')
    return {
      title: PAGE_TITLES[PILLAR_PATH]!,
      description,
      canonical,
      ogType: 'article',
      ogImage,
      ogImageAlt: `${PILLAR_PHRASE}, the definition note by Emilie El Chidiac`,
      jsonLd: graph({
        '@type': 'Article',
        '@id': `${canonical}#article`,
        headline: PILLAR_PHRASE,
        url: canonical,
        description,
        image: ogImage,
        inLanguage: 'en',
        author: { '@id': PERSON_ID },
        mainEntityOfPage: canonical,
        isPartOf: { '@id': WEBSITE_ID },
      }),
    }
  }

  if (PAGE_TITLES[path]) {
    const type = path === '/about' ? 'ProfilePage' : path === '/cv' ? 'WebPage' : 'CollectionPage'
    return {
      title: PAGE_TITLES[path]!,
      description: PAGE_DESCRIPTIONS[path]!,
      canonical,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: DEFAULT_OG_ALT,
      jsonLd: graph(pageNode(type, canonical, PAGE_TITLES[path]!, PAGE_DESCRIPTIONS[path]!)),
    }
  }

  // The primitives lab is dev-only chrome, not a public page.
  if (import.meta.env.DEV && path === '/lab') {
    return {
      title: 'Lab' + SUFFIX,
      description: LANDING_DESCRIPTION,
      canonical,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: DEFAULT_OG_ALT,
      noindex: true,
      jsonLd: graph(),
    }
  }

  // Honestly not a page: the warm 404's head. noindex + no self-canonical
  // (a 404 must never present itself as a canonical document).
  return {
    title: 'Not found' + SUFFIX,
    description: 'Whatever lived at this address is not here. Everything that is lives one door away.',
    canonical,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    ogImageAlt: DEFAULT_OG_ALT,
    noindex: true,
    jsonLd: graph(),
  }
}
