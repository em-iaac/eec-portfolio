// The screen-reader alternative to the neural world (the MindGraphSrNav
// pattern): every piece of the record as a labelled list item, the routed
// ones carrying real links, in every fallback mode. The SVG nodes are
// already focusable, so these links leave the Tab order (tabIndex -1) and
// stay reachable to a virtual cursor.
//
// ⚠ IT CARRIES THE THREADS NOW (2026-08-07), AND FOR SIX MONTHS IT DID NOT.
// This list used to be 56 titles and dates with not one relation in it, while
// the whole drawing — every thread, every direction, the entire argument the
// page exists to make — sat inside a `<g aria-hidden="true">`. Someone reading
// this site with a screen reader got the INDEX of the map and none of the map.
// The relations are the content here, not decoration on it, so each item now
// says what led to it, what it led to, and what it is almost joined to.
//
// Direction is spoken, because direction is meaning: CORRELATIONS are written
// earlier-first and the world fires each thread from a to b, so "led to" and
// "grew out of" are read straight off the data and can never disagree with the
// drawing.
import { Link } from 'react-router-dom'
import { WORLD } from './worldGraph'

const KIND_NAME = {
  project: 'project',
  thought: 'thought',
  award: 'award',
  milestone: 'milestone',
} as const

const TITLE = new Map(WORLD.nodes.map((n) => [n.id, n.title]))
const name = (id: string) => TITLE.get(id) ?? id

/** Built once, module scope, from the frozen world — the same single source the
 *  drawing reads, so the two can never drift. */
const RELATIONS = (() => {
  const out = new Map<string, { to: string[]; from: string[]; near: string[] }>()
  const slot = (id: string) => {
    let r = out.get(id)
    if (!r) out.set(id, (r = { to: [], from: [], near: [] }))
    return r
  }
  for (const l of WORLD.links) {
    slot(l.a).to.push(l.b)
    slot(l.b).from.push(l.a)
  }
  for (const r of WORLD.reaches) {
    slot(r.a).near.push(r.b)
    slot(r.b).near.push(r.a)
  }
  return out
})()

export default function WorldSrNav() {
  return (
    <nav aria-label="Everything on the map, and what it connects to" className="sr-only">
      <ul>
        {WORLD.nodes.map((n) => {
          const r = RELATIONS.get(n.id)
          return (
            <li key={n.id}>
              {n.title} ({KIND_NAME[n.kind]}, {n.date}){' '}
              {n.route && (
                <Link to={n.route} viewTransition tabIndex={-1}>
                  Open it
                </Link>
              )}
              {r && (r.from.length > 0 || r.to.length > 0 || r.near.length > 0) && (
                <ul>
                  {r.from.length > 0 && <li>Grew out of: {r.from.map(name).join(', ')}.</li>}
                  {r.to.length > 0 && <li>Led to: {r.to.map(name).join(', ')}.</li>}
                  {/* Worded as the fact it is — things in common — never as a
                      claim that the two are related. The map draws this as a
                      gap for the same reason. */}
                  {r.near.length > 0 && (
                    <li>Not joined to, but shares connections with: {r.near.map(name).join(', ')}.</li>
                  )}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
