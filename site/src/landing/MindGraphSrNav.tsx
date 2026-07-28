// The screen-reader alternative to the mind-graph (Session R1; migrated from the
// retired explore/NetworkSrNav.tsx). Reads the pure model + registry so the
// constellation is fully navigable with no SVG and in every fallback mode: every
// project with its showcase link (G1: /work/:id), every thought with its
// drafted-note link, awards noted.
//
// The SVG nodes are already focusable role="link"s, so a sighted keyboard user
// already has a visible path through the graph. These links stay reachable to a
// screen reader's virtual cursor but are pulled OUT of the Tab order
// (tabIndex=-1) so they don't add a second run of invisible tab stops.
import { Link } from 'react-router-dom'
import { LENSES } from '../components/Lens'
import { KEY_TO_LENS } from './palette'
import { MIND } from './mindGraph'

export default function MindGraphSrNav() {
  return (
    <nav aria-label="All projects and thoughts" className="sr-only">
      <ul>
        {MIND.nodes.map((n) => (
          <li key={n.id}>
            {/* the LONG lens name, title case: a screen reader should not be
                handed an all-caps string it may spell out letter by letter. */}
            {/* "carries a recognition", never "award-winning": the star is
                derived from AWARD_WINNER_IDS, which includes Tamayouz (Top
                100), the Cemetery Challenge (finalist) and Marsception (Top
                50). None of those was won, and the registry's own comment
                already says awards read as recognition, never a stamp. */}
            {n.label} ({n.kind}, {LENSES[KEY_TO_LENS[n.lens]].label}
            {n.award ? ', carries a recognition' : ''}){' '}
            {n.sheetRoute && (
              <Link to={n.sheetRoute} viewTransition tabIndex={-1}>
                Open project
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
