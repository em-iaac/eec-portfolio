// /work/:id · THE SHOWCASE OPENS OVER WHERE YOU WERE (Emilie's ruling
// 2026-08-02: "when we press a project, instead of it taking us into the work
// page and then opening, let it open from the landing page, same interaction in
// the whole website desktop and mobile and from any page").
//
// Before this, /work/:id rendered the /work GALLERY and lifted the sheet over
// it, wherever you had come from. Tapping Sensi on the landing meant the
// landing left, a page you did not ask for arrived, and the sheet opened on top
// of that. Two page changes for one tap.
//
// Now the route renders the page you were ON, with the sheet over it. Closing
// goes BACK, so you return to that page at the scroll position you left it, not
// to the top of a gallery.
//
// A COLD ARRIVAL IS UNCHANGED, and that is the whole safety of this. A shared
// link, a refresh, a search result and the prerenderer have no page to open
// over: getOpenedFrom() is null and this renders the full /work page exactly as
// it always did. The 46 prerendered routes and every deep link are untouched.
//
// WHY matchRoutes AND NOT A MAP of path to component. `routes` (App.tsx) is
// already the single source for what a path renders, and a second table here
// would be a second source that drifts the first time a route moves. The LEAF
// element only is rendered, never the whole match chain: the chain includes the
// Chrome layout route, and mounting a second Chrome would run useRouteHead,
// page counting and route warming twice per navigation.
//
// THOUGHT NOTES ARE NOT PART OF THIS (her ruling, same gate). A project is a
// card you look at; a note is something you read to the end, and a long article
// inside a panel is a worse read than a page. /thoughts/:id stays a page.
import { Suspense, lazy } from 'react'
import { matchRoutes, useNavigate, useParams } from 'react-router-dom'
import WorkOverlay from '../components/work/WorkOverlay'
import { getOpenedFrom } from '../lib/navIntent'
import { travelTo } from '../lib/navIntent'
import { workEntryById } from '../data/work'
import { routes } from '../App'

const Work = lazy(() => import('./Work'))

// The gallery is its own background: opening a project FROM /work must keep
// behaving exactly as it always has, grid in place, sheet over it, and that is
// what <Work/> already does with an :id. Anything else gets the new behaviour.
function isGallery(path: string): boolean {
  return path === '/work' || path.startsWith('/work/')
}

export default function ShowcaseRoute() {
  const { id } = useParams()
  const navigate = useNavigate()
  const from = getOpenedFrom()
  const entry = id ? workEntryById(id) : undefined

  // Cold arrival, or opened from the gallery: the gallery IS the page.
  // A bad id falls through to <Work/> too, which already cleans itself back to
  // the grid rather than showing nothing.
  if (!from || isGallery(from) || !entry) {
    return (
      <Suspense fallback={null}>
        <Work />
      </Suspense>
    )
  }

  // The page they were on, rendered behind the sheet. `matchRoutes` can return
  // null for a path the table does not know; falling back to the gallery is the
  // honest failure, never a blank screen behind a dialog.
  const matched = matchRoutes(routes, from)
  const behind = matched?.[matched.length - 1]?.route.element
  if (!behind) {
    return (
      <Suspense fallback={null}>
        <Work />
      </Suspense>
    )
  }

  return (
    <>
      {behind}
      <WorkOverlay
        key={entry.id}
        entry={entry}
        // BACK, not a navigate to /work. Going back returns them to the page
        // they opened it from, at the scroll position they left, which is the
        // point of opening in place. `travelTo` still marks the intent so the
        // transition is the in-room one rather than a room change.
        onClose={() => {
          travelTo(from)
          navigate(-1)
        }}
      />
    </>
  )
}
