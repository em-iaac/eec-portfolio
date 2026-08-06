// THE SEARCH'S ROOMS (Emilie's ruling 2026-08-06: "let's have it on all main
// pages, same place. work, thoughts, cv, contact").
//
// The search is chrome now, not a page's tool: TitleBlock asks hasSiteSearch()
// which rooms carry it, so no page wires it and nothing local says where it is.
// That is the right shape, and it means a route rename can silently drop it out
// of a room with nothing failing. This is the guard against that.
//
// It is written against PUBLIC_ROUTES rather than a hand-typed list, so a new
// project or note joins the "showcase pages have it / reading rooms do not"
// census by existing, exactly like the prerender and the sitemap.
import { describe, expect, it } from 'vitest'
import { hasSiteSearch } from './SiteSearch'
import { PROJECT_IDS, PUBLIC_ROUTES, THOUGHT_IDS } from '../lib/routes'
import { PILLAR_PATH } from '../lib/pillar'

// The five she named on 2026-08-06, plus the thought leaves she added later the
// same day ("we can also have the jump bar here as well") once their four nav
// verbs had moved into the drawer and freed the header line. Anything else
// public is the small print or a document, and deliberately carries no search.
const ROOMS_WITH_SEARCH = ['/', '/work', '/thoughts', '/cv', '/contact']

describe('the site search', () => {
  it('is in every room Emilie named, and only those', () => {
    for (const room of ROOMS_WITH_SEARCH) {
      expect(hasSiteSearch(room), `${room} should carry the search`).toBe(true)
    }
    const others = PUBLIC_ROUTES.filter(
      (r) =>
        !ROOMS_WITH_SEARCH.includes(r) && !r.startsWith('/work/') && !r.startsWith('/thoughts/'),
    )
    // Sanity: the census is not empty, or the loop below proves nothing.
    expect(others.length).toBeGreaterThan(0)
    for (const room of others) {
      expect(hasSiteSearch(room), `${room} should NOT carry the search`).toBe(false)
    }
  })

  it('follows a project into its sheet, so the header does not flicker', () => {
    // /work/:id renders /work behind a dialog. If the search dropped out there,
    // it would vanish on open and reappear on close, on the same header line.
    expect(PROJECT_IDS.length).toBeGreaterThan(0)
    for (const id of PROJECT_IDS) {
      expect(hasSiteSearch(`/work/${id}`), `/work/${id}`).toBe(true)
    }
  })

  it('follows a note into its leaf, the same way it follows a project', () => {
    // Her ruling 2026-08-06. The leaf was excluded that morning because its
    // header line carried 653px of meta AND four nav verbs; the verbs moved
    // into the drawer the same day, so the room is there now.
    expect(THOUGHT_IDS.length).toBeGreaterThan(0)
    for (const id of THOUGHT_IDS) {
      expect(hasSiteSearch(`/thoughts/${id}`), `/thoughts/${id}`).toBe(true)
    }
  })

  it('stays out of the documents, which are read and not browsed', () => {
    // The pillar and /rights are prose with no index behind them.
    expect(hasSiteSearch(PILLAR_PATH)).toBe(false)
    expect(hasSiteSearch('/rights')).toBe(false)
  })

  it('does not leak onto an address the site does not own', () => {
    for (const junk of ['/worked', '/workshop', '/cv/print', '/nope', '/contactless']) {
      expect(hasSiteSearch(junk), junk).toBe(false)
    }
  })
})
