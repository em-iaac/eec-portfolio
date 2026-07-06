// PLACEHOLDER: replaced by the full three.js EXPLORE scene later in this
// build. Keeps the mode toggle from dead-ending while READ surfaces land.
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function ExplorePage() {
  useEffect(() => {
    document.title = 'EXPLORE | Emilie El Chidiac'
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 overflow-hidden bg-carbon text-ink-dark">
      <p className="font-mono text-[10px] tracking-[0.12em] text-anno-dark">
        EMILIE EL CHIDIAC · <b className="font-medium text-ink-dark">EXPLORE</b>
      </p>
      <p className="font-mono text-[10px] tracking-[0.12em] text-anno-dark">
        THE MIND IS BEING PLOTTED · SCENE IN PREPARATION
      </p>
      <Link
        to="/"
        className="-m-2.5 p-2.5 font-mono text-[10px] tracking-[0.12em] text-redline-wire underline underline-offset-4"
      >
        ISSUED FOR: READ &gt;
      </Link>
    </div>
  )
}
