// The screen-reader alternative to the neural world (the MindGraphSrNav
// pattern): every piece of the record as a labelled list item, the routed
// ones carrying real links, in every fallback mode. The SVG nodes are
// already focusable, so these links leave the Tab order (tabIndex -1) and
// stay reachable to a virtual cursor.
import { Link } from 'react-router-dom'
import { WORLD } from './worldGraph'

const KIND_NAME = {
  project: 'project',
  thought: 'thought',
  award: 'award',
  milestone: 'milestone',
} as const

export default function WorldSrNav() {
  return (
    <nav aria-label="Everything on the map" className="sr-only">
      <ul>
        {WORLD.nodes.map((n) => (
          <li key={n.id}>
            {n.title} ({KIND_NAME[n.kind]}, {n.date}){' '}
            {n.route && (
              <Link to={n.route} viewTransition tabIndex={-1}>
                Open it
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
