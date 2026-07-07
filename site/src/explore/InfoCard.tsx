// Focused-word card, bottom-right: lens, name in redline wire, kind, thread
// (its neighbors), and the sheet line: a real link when the sheet is
// issued, the honest IN PREPARATION otherwise. The card fades and rises in on
// focus (Session 5 bundle, keyed per node in ExplorePage). Its OPEN SHEET link
// leaves through the mylar mode ceremony (onOpenSheet), not the root view
// transition, since EXPLORE -> a sheet is a mode change.
import { Link } from 'react-router-dom'
import { GRAPH, neighbors } from './graph'
import { LENSES } from './palette'
import { EXPLORE_NODES } from '../data/registry'

export default function InfoCard({
  index,
  onOpenSheet,
}: {
  index: number
  onOpenSheet?: (target: string) => void
}) {
  const n = GRAPH.nodes[index]
  const nb = [...neighbors(GRAPH, index)]
  const reg = EXPLORE_NODES[index]
  const sheet = reg?.sheet
  if (!n) return null

  return (
    <div
      aria-live="polite"
      className="infocard-enter fixed right-4 bottom-4 z-[3] max-w-[300px] border border-ink-dark/25 bg-carbon/90 px-3.5 py-3 font-mono text-[10px] leading-[1.9] tracking-[0.06em] text-ink-dark"
    >
      <div className="text-anno-dark">{LENSES[n.lens].label}</div>
      <div className="text-redline-wire">{n.label.toUpperCase()}</div>
      <div>
        <span className="text-anno-dark">KIND </span>
        {n.kind.toUpperCase()}
      </div>
      <div>
        <span className="text-anno-dark">THREAD </span>
        {nb.map((j) => GRAPH.nodes[j]!.label).join(' · ')}
      </div>
      {sheet && sheet.status === 'issued' ? (
        <div>
          <Link
            to={sheet.route}
            onClick={
              onOpenSheet
                ? (e) => {
                    e.preventDefault()
                    onOpenSheet(sheet.route)
                  }
                : undefined
            }
            className="text-redline-wire underline underline-offset-[3px] focus-visible:outline-2 focus-visible:outline-redline-wire"
          >
            OPEN SHEET {sheet.number} &gt;
          </Link>
        </div>
      ) : (
        <div className="text-anno-dark">SHEET: IN PREPARATION</div>
      )}
      <div className="text-anno-dark">ESC OR CLICK BACKGROUND TO RETURN</div>
    </div>
  )
}
