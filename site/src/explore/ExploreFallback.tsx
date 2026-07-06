// No-WebGL alternative: the same 21 words as a plain list on carbon. Per the
// brief, READ mode is the real fallback { every path leads back there.
import { Link } from 'react-router-dom'
import { GRAPH } from './graph'
import { LENSES } from './palette'
import { EXPLORE_NODES } from '../data/registry'

export default function ExploreFallback() {
  return (
    <div className="fixed inset-0 overflow-y-auto bg-carbon text-ink-dark">
      <div className="mx-auto max-w-xl px-6 py-10">
        <p className="font-mono text-[10px] leading-loose tracking-[0.12em] text-anno-dark">
          EMILIE EL CHIDIAC · <b className="font-medium text-ink-dark">EXPLORE</b>
          <br />
          THIS VIEW NEEDS WEBGL · THE LIST BELOW IS THE SAME MIND, FLAT
        </p>
        <ul className="mt-6 list-none p-0 font-mono text-xs leading-loose tracking-[0.08em]">
          {GRAPH.nodes.map((n, i) => {
            const sheet = EXPLORE_NODES[i]?.sheet
            const label =
              n.kind === 'project' ? (
                n.label
              ) : (
                <i className="font-serif text-[15px] tracking-normal">{n.label}</i>
              )
            return (
              <li key={n.id}>
                <span className="text-anno-dark">{LENSES[n.lens].label.slice(0, 1)} · </span>
                {sheet && sheet.status === 'issued' ? (
                  <Link
                    to={sheet.route}
                    className="text-redline-wire underline underline-offset-[3px]"
                  >
                    {label} &gt;
                  </Link>
                ) : (
                  label
                )}
              </li>
            )
          })}
        </ul>
        <p className="mt-8 font-mono text-[10px] tracking-[0.12em]">
          <Link
            to="/"
            className="-m-2.5 p-2.5 text-redline-wire underline underline-offset-4"
          >
            ISSUED FOR: READ &gt;
          </Link>
        </p>
      </div>
    </div>
  )
}
