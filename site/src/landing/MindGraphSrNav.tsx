// The screen-reader alternative to the mind-graph (Session R1; migrated from the
// retired explore/NetworkSrNav.tsx). Reads the pure model + registry so the
// constellation is fully navigable with no SVG and in every fallback mode: every
// project and thought with its issued-sheet or drafted-note link, awards noted.
//
// The SVG nodes are already focusable role="link"s, so a sighted keyboard user
// already has a visible path through the graph. These links stay reachable to a
// screen reader's virtual cursor but are pulled OUT of the Tab order
// (tabIndex=-1) so they don't add a second run of invisible tab stops.
import { Link } from 'react-router-dom'
import { LENSES } from './palette'
import { MIND } from './mindGraph'

export default function MindGraphSrNav() {
  return (
    <nav aria-label="All projects and thoughts" className="sr-only">
      <ul>
        {MIND.nodes.map((n) => (
          <li key={n.id}>
            {n.label} ({n.kind}, {LENSES[n.lens].label}
            {n.award ? ', award-winning' : ''}){' '}
            {n.sheetRoute && (
              <Link to={n.sheetRoute} viewTransition tabIndex={-1}>
                Open sheet
              </Link>
            )}
            {n.noteRoute && (
              <Link to={n.noteRoute} viewTransition tabIndex={-1}>
                Open note
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
