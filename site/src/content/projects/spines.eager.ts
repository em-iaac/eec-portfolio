// EVERY SPINE, EAGERLY — for the printed book ONLY.
//
// The book is the one surface that genuinely needs all 21 spines at once and
// renders synchronously (renderToString in printBook.test.tsx, and a headless
// page in scripts/render-pdfs.mjs). It cannot await.
//
// This module is safe to be eager because NOTHING a visitor can reach imports
// it: the only consumer is print/bookContents.ts, and both print routes are
// lazy and unlinked (App.tsx:48-51, "unlinked, noindexed and lazy so the site
// never pays for them"). The spine chunks land in the book's graph, not the
// site's.
//
// If you are tempted to import this from a screen surface: don't. Use
// loadSpine(slug) from ./index. That is the whole point of the 2026-08-03
// split.
import type { ProjectSpine } from './types'

const EAGER = import.meta.glob<{ default: ProjectSpine }>('./*.spine.tsx', { eager: true })

export const SPINES_BY_SLUG: Record<string, ProjectSpine> = Object.fromEntries(
  Object.entries(EAGER).map(([path, mod]) => [
    path.replace(/^\.\//, '').replace(/\.spine\.tsx$/, ''),
    mod.default,
  ]),
)
