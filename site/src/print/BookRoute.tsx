// G5 · /print/book — the chrome-less surface headless Chrome prints to the
// A4-landscape portfolio PDF every build (scripts/render-pdfs.mjs). No
// header, no footer, no cursor ceremony: just the document. The @page rule
// lives HERE, not in print.css, because @page is document-global and the CV
// route needs portrait. [data-theme=light] is THE print pin (DL §2);
// ?bw=1 is the greyscale proof pass (the office-printer truth).
import { useSearchParams } from 'react-router-dom'
import { PrintContext } from './PrintContext'
import usePrintDoc from './usePrintDoc'
import PrintBook from './PrintBook'
import './print.css'

export default function BookRoute() {
  const [params] = useSearchParams()
  const bw = params.get('bw') === '1'
  const ready = usePrintDoc('Emilie El Chidiac · Portfolio')

  return (
    <PrintContext.Provider value={true}>
      <style>{'@page { size: 297mm 210mm; margin: 0; }'}</style>
      <div
        className={`pr-doc${bw ? ' pr-bw' : ''}`}
        data-theme="light"
        data-print-ready={ready ? '' : undefined}
      >
        <PrintBook />
      </div>
    </PrintContext.Provider>
  )
}
