// SHARED-ELEMENT VIEW TRANSITIONS · the naming convention (DL-1, 2026-07-10;
// DESIGN-LANGUAGE.md §3). Every navigation already gets the soft ~250ms
// crossfade (language.css); a MORPH happens when exactly one element in the
// old state and one in the new state share a `view-transition-name`.
//
// THE CONVENTION: the name is the DESTINATION route's slug, `page-` + the
// route with slashes as hyphens (`/work/sensi` -> `page-work-sensi`,
// `/sheets/p-101` -> `page-sheets-p-101`, `/thoughts/bim` ->
// `page-thoughts-bim`).
// - The routed page's HERO (title block / hero media / overlay media)
//   carries its own route's name, derived from useParams so it stays
//   data-driven (SheetLayout, ThoughtLeaf, WorkOverlay).
// - A SOURCE that opens that route puts the same name on its face: the
//   WORK card tile (except while its own overlay is open), the ACTIVE
//   mind-graph node. DL-2+ re-skins (the glass card, project pages) attach
//   their morphs by carrying the same names, nothing else to wire.
// - HARD RULE: at most ONE element per name per rendered state. A duplicate
//   makes the browser skip the whole transition (a hard cut, worse than no
//   name). Assign names via inline style.viewTransitionName.
// - FALLBACKS are free: no counterpart or no browser support degrades to
//   the crossfade / an instant swap; reduced motion is always an instant
//   swap (language.css kill block).

/** The `view-transition-name` for a route's hero, or undefined for routes
 *  with no single hero to travel to (the bare gallery, the landing). */
export function vtName(route: string): string | undefined {
  const slug = route.replace(/^\/+|\/+$/g, '')
  // A specific destination has at least two segments (/work/:id, /sheets/:id,
  // /thoughts/:id); a top page has nothing for a face to morph into.
  if (!slug.includes('/')) return undefined
  return `page-${slug.replace(/\//g, '-')}`
}
