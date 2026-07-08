// The screen-reader alternative to the network (Session 12), extracted so it can
// travel with the surface AND stand alone on the poster-only landing path
// (Session 13) without pulling in three.js. Reads the pure graph + registry:
// every project and thought with its issued-sheet or drafted-note link, so the
// constellation is fully navigable with no GL.
import { Link } from 'react-router-dom'
import { GRAPH } from './graph'
import { LENSES } from './palette'
import { EXPLORE_NODES } from '../data/registry'

export default function NetworkSrNav() {
  return (
    <nav aria-label="All projects and thoughts" className="sr-only">
      <ul>
        {GRAPH.nodes.map((n, i) => {
          const reg = EXPLORE_NODES[i]
          const sheet = reg?.sheet
          const note = reg?.note
          return (
            <li key={n.id}>
              {n.label} ({n.kind}, {LENSES[n.lens].label}){' '}
              {sheet && sheet.status === 'issued' && (
                <Link to={sheet.route}>Open sheet {sheet.number}</Link>
              )}
              {note && note.status === 'drafted' && <Link to={note.route}>Open note</Link>}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
